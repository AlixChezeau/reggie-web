import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/request';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: [
    // Match root
    '/',
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files
    '/((?!api|_next|.*\\..*).*)',
  ],
};
