import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define protected routes
  // const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");

  // If trying to access protected route without auth, redirect to login
  // if (isProtectedRoute && !isLoggedIn) {
  //   const loginUrl = new URL('/login', nextUrl.origin)
  //   loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  // If logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && nextUrl.pathname === '/login') {
    const callbackUrl = nextUrl.searchParams.get('callbackUrl');
    const redirectUrl = callbackUrl || '/dashboard';

    return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
