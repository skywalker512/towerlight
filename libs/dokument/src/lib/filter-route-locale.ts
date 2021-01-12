import type { getFilesReturn } from './loader';

export default function filterRouteLocale(
  pageMap: getFilesReturn[],
  locale: string,
  defaultLocale: string
): getFilesReturn[] {
  const isDefaultLocale = !locale || locale === defaultLocale;

  const filteredPageMap = [];

  // We fallback to the default locale
  const fallbackPages: {
    [key: string]: getFilesReturn | null;
  } = {};

  for (const page of pageMap) {
    if (page.children) {
      filteredPageMap.push({
        ...page,
        children: filterRouteLocale(page.children, locale, defaultLocale),
      });
      continue;
    }

    const localDoesMatch =
      (!page.locale && isDefaultLocale) || page.locale === locale;

    if (localDoesMatch) {
      fallbackPages[page.name] = null;
      filteredPageMap.push(page);
    } else {
      if (
        fallbackPages[page.name] !== null &&
        (!page.locale || page.locale === defaultLocale)
      ) {
        fallbackPages[page.name] = page;
      }
    }
  }

  for (const name in fallbackPages) {
    if (fallbackPages[name]) {
      filteredPageMap.push(fallbackPages[name]);
    }
  }

  return filteredPageMap as getFilesReturn[];
}
