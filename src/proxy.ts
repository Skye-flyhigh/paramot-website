import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';

// Next.js 16: proxy.ts runs in Node.js runtime (Prisma compatible!)
export async function proxy(request: NextRequest) {
  // Get session from NextAuth
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Define protected routes
  // const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // If trying to access protected route without auth, redirect to login
  // if (isProtectedRoute && !isLoggedIn) {
  //   const loginUrl = new URL('/login', request.nextUrl.origin)
  //   loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  // If logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && request.nextUrl.pathname === '/login') {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const redirectUrl = callbackUrl || '/dashboard';

    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
