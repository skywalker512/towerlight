import path from 'path';
import { promises as fs } from 'fs';
import { getOptions } from 'loader-utils';
import grayMatter from 'gray-matter';
import slash from 'slash';
import filterRouteLocale from './filter-route-locale';
import type webpack from 'webpack';

export interface LoaderConfig {
  theme: string;
  themeConfig: string;
  locales: string[];
  defaultLocale: string;
  pagePath: string;
}

/**
 * Get local through the suffix of the file
 * @param name File name
 */
function getLocaleFromFilename(name: string) {
  const localeRegex = /\.([a-zA-Z-]+)?\.(mdx?|jsx?|json)$/;
  const match = name.match(localeRegex);
  if (match) return match[1];
  return undefined;
}

/**
 * a.en.md => a
 * @param name File name
 */
function removeExtension(name: string) {
  const match = name.match(/^([^.]+)/);
  return match !== null ? match[1] : '';
}

/**
 * a.en.md => a
 * @param resourcePath
 */
function getFileName(resourcePath: string) {
  return removeExtension(path.basename(resourcePath));
}

const parseJsonFile = (content: string, path: string) => {
  let parsed = {};
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error(
      `Error parsing ${path}, make sure it's a valid JSON \n` + err
    );
  }

  return parsed;
};

export type getFilesReturn = {
  route?: string;
  name: string;
  children?: getFilesReturn[];
  frontMatter?: { [p: string]: string };
  meta?: {
    [key: string]: string;
  };
  locale?: string | undefined;
};

/**
 * getPageMap
 * @param currentResourcePath 当前 webpack 正在处理的路径
 * @param pagePath
 */
async function getPageMap(currentResourcePath: string, pagePath: string) {
  const extension = /\.(mdx?|jsx?)$/;
  const mdxExtension = /\.mdx?$/;
  const metaExtension = /meta\.?([a-zA-Z-]+)?\.json/;
  let activeRoute = '';

  /**
   * 得到文件信息数
   * @param dir 进入的目录
   * @param route 目录下的文件夹
   */
  async function getFiles(
    dir: string,
    route: string
  ): Promise<getFilesReturn[]> {
    const files = await fs.readdir(dir, { withFileTypes: true });

    const resultWithUndefined: (
      | getFilesReturn
      | null
      | undefined
    )[] = await Promise.all(
      files.map(async (f) => {
        const filePath = path.resolve(dir, f.name);
        // URL 路径
        const fileRoute = path.join(
          route,
          removeExtension(f.name).replace(/^index$/, '')
        );

        if (filePath === currentResourcePath) {
          activeRoute = fileRoute;
        }

        if (f.isDirectory()) {
          const children = await getFiles(filePath, fileRoute);
          if (!children.length) return null;

          // 返回的是一个文件数型的结构
          return {
            name: f.name,
            children,
            route: fileRoute,
          };
        } else if (extension.test(f.name)) {
          // mdx md js jsx
          // md mdx
          if (mdxExtension.test(f.name)) {
            const fileContents = await fs.readFile(filePath, 'utf-8');
            const { data } = grayMatter(fileContents);

            if (Object.keys(data).length) {
              // grayMatter
              return {
                name: removeExtension(f.name),
                route: fileRoute,
                frontMatter: data,
                locale: getLocaleFromFilename(f.name),
              };
            }
          }

          // js jsx
          return {
            name: removeExtension(f.name),
            route: fileRoute,
            locale: getLocaleFromFilename(f.name),
          };
        } else if (metaExtension.test(f.name)) {
          // meta.json
          const content = await fs.readFile(filePath, 'utf-8');
          const meta = parseJsonFile(content, filePath);

          // 从文件中拿到语言
          const locale = f.name.match(metaExtension)?.[1];

          return {
            name: 'meta.json',
            meta,
            locale,
          };
        }
      })
    );

    // go through the directory
    return (
      resultWithUndefined
        // 类似 slice
        .map((item) => {
          if (!item) return;
          return { ...item };
        })
        // 去掉 undefined, null
        .filter(Boolean) as getFilesReturn[]
    );
  }

  return [await getFiles(pagePath, '/'), activeRoute] as const;
}

async function getLocalizedEntries(currentResourcePath: string) {
  const filename = getFileName(currentResourcePath);
  const dir = path.dirname(currentResourcePath);

  const fileRe = new RegExp('^' + filename + '.[a-zA-Z-]+.(mdx?|jsx?|json)$');

  const files = await fs.readdir(dir, { withFileTypes: true });
  return (
    files
      // only get need file
      .filter((file) => {
        return fileRe.test(file.name);
      })
      .map((file) => {
        return {
          name: file.name,
          locale: getLocaleFromFilename(file.name),
        };
      })
  );
}

export default async function (
  this: webpack.loader.LoaderContext,
  source: string
) {
  // Make this loader async.
  const callback = this.async();

  this.cacheable();

  const options = getOptions(this);
  const {
    theme,
    themeConfig,
    locales,
    defaultLocale,
    pagePath,
  } = (options as unknown) as LoaderConfig;

  // Add the entire directory `pages` as the dependency
  // so we can generate the correct page map
  this.addContextDependency(pagePath);

  // Generate the page map
  // eslint-disable-next-line prefer-const
  let [pageMap, route] = await getPageMap(this.resourcePath, pagePath);

  // Extract frontMatter information if it exists
  const { data, content } = grayMatter(source);

  // Remove frontMatter from the source
  source = content;

  if (!theme) {
    console.error('No theme found!');
    return callback ? callback(null, source) : undefined;
  }

  let layout = theme;
  let layoutConfig = themeConfig || null;

  // Relative path instead of a package name
  if (theme.startsWith('.') || theme.startsWith('/')) {
    layout = path.resolve(theme);
  }
  if (layoutConfig) {
    layoutConfig = slash(path.resolve(pagePath, '..', layoutConfig));
  }

  const filename = this.resourcePath.slice(
    this.resourcePath.lastIndexOf('/') + 1
  );

  const notI18nEntry = this.resourceQuery.includes('dokument-raw');
  if (locales && !notI18nEntry) {
    // we need to handle i18n here

    const i18nFiles = await getLocalizedEntries(this.resourcePath);
    let defaultLocaleIndex = 0;

    const i18nSwitcher = `
import { useRouter } from 'next/router'
${i18nFiles
  .map((file, index) => {
    if (file.locale === defaultLocale) {
      defaultLocaleIndex = index;
    }
    return `import Page_${index} from './${file.name}?dokument-raw'`;
  })
  .join('\n')}
export default function I18NPage () {
  const { locale } = useRouter()
  ${i18nFiles
    .map((file, index) => {
      return `if (locale === '${file.locale}') {
    return <Page_${index}/>
  } else `;
    })
    .join('')} {
    return <Page_${defaultLocaleIndex}/>
  }
}`;

    return callback ? callback(null, i18nSwitcher) : undefined;
  }

  if (locales) {
    const locale = getLocaleFromFilename(filename);
    if (locale) {
      pageMap = filterRouteLocale(pageMap, locale, defaultLocale);
    }
  }

  const prefix = `
import withLayout from '${layout}'
import { withSSG } from '@towerlight/dokument'
${layoutConfig ? `import layoutConfig from '${layoutConfig}'` : ''}
`;

  const suffix = `\n\nexport default function DokumentPage (props) {
    return withSSG(withLayout({
      filename: "${slash(filename)}",
      route: "${slash(route)}",
      meta: ${JSON.stringify(data)},
      pageMap: ${JSON.stringify(pageMap)}
    }, ${layoutConfig ? 'layoutConfig' : 'null'}))(props)
}`;

  // Add imports and exports to the source
  source = prefix + '\n' + source + '\n' + suffix;

  return callback ? callback(null, source) : undefined;
}
