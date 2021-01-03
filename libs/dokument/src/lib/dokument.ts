import type { Configuration } from 'webpack';
import type { LoaderConfig } from './loader';

const defaultExtensions = ['js', 'jsx', 'ts', 'tsx'];
const markdownExtensions = ['md', 'mdx'];
const markdownExtensionTest = /\.mdx?$/;

type DomainLocales = Array<{
  http?: true;
  domain: string;
  locales?: string[];
  defaultLocale: string;
}>;

type NextConfig = { [key: string]: unknown } & {
  i18n?: {
    locales: string[];
    defaultLocale: string;
    domains?: DomainLocales;
    localeDetection?: false;
  } | null;

  trailingSlash?: boolean;
};

export default (theme: string, themeConfig: string, pagePath: string) => (
  nextConfig: NextConfig = {}
) => {
  const locales = nextConfig.i18n ? nextConfig.i18n.locales : null;
  const defaultLocale = nextConfig.i18n ? nextConfig.i18n.defaultLocale : null;

  let pageExtensions = [...defaultExtensions];
  if (locales) {
    console.log('You have i18n enabled for Dokument.');
    if (!defaultLocale) {
      console.error('Default locale is missing.');
    }

    // Exclude other locales to ensure there's no route conflicts.
    pageExtensions = pageExtensions.concat(
      markdownExtensions.map((extension) => defaultLocale + '.' + extension)
    );
  } else {
    pageExtensions = pageExtensions.concat(markdownExtensions);
  }

  return Object.assign(
    {
      pageExtensions,
    },
    nextConfig,
    {
      webpack(config: Configuration, { defaultLoaders }: unknown) {
        config.module?.rules.push({
          test: markdownExtensionTest,
          use: [
            defaultLoaders.babel,
            {
              loader: '@mdx-js/loader',
            },
            {
              loader: '@towerlight/dokument/src/lib/loader.js',
              options: {
                theme,
                themeConfig,
                locales,
                defaultLocale,
                pagePath,
              } as LoaderConfig,
            },
          ],
        });

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, { defaultLoaders });
        }

        return config;
      },
    }
  );
};
