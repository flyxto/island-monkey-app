import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_PORTALS: Record<string, string> = {
  customer: '/customer',
  partner: '/partner',
  model: '/model',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value;
  const isLoginPage = pathname === '/login';

  // No token → redirect to login (except if already on login)
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Has token + on login → redirect to their portal
  if (token && isLoginPage) {
    const portal = ROLE_PORTALS[role || ''] || '/customer';
    return NextResponse.redirect(new URL(portal, request.url));
  }

  // Role-based access control
  if (token && role) {
    const allowedPrefix = ROLE_PORTALS[role];
    if (allowedPrefix) {
      // Block wrong role from accessing another portal
      const otherPortals = Object.values(ROLE_PORTALS).filter(p => p !== allowedPrefix);
      const isAccessingWrongPortal = otherPortals.some(p => pathname.startsWith(p));
      if (isAccessingWrongPortal) {
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
