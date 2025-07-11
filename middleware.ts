//  middleware.ts file must be located at the same level as the app/ directory.

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|images|assets|logo|.*\\..*).*)'],
};
