import { NextRequest, NextResponse } from 'next/server';

import { ensureAuthenticated } from '@/lib/security/auth-check';

// Next.js 16: proxy.ts runs in Node.js runtime (Prisma compatible!)
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // ============================================
  // SUBDOMAIN ROUTING
  // ============================================

  // Extract subdomain (e.g., "dashboard" from "dashboard.paramot.co.uk")
  const parts = hostname.split('.');
  const subdomain = parts.length >= 3 ? parts[0] : null;
  const isLocalhost = hostname.includes('localhost');
  const isMainDomain = !isLocalhost && (subdomain === null || subdomain === 'www');
  const isDashboardDomain = !isLocalhost && subdomain === 'dashboard';

  // Handle dashboard subdomain: rewrite to /dashboard routes
  if (isDashboardDomain && !url.pathname.startsWith('/dashboard')) {
    url.pathname = url.pathname === '/' ? '/dashboard' : `/dashboard${url.pathname}`;

    return NextResponse.rewrite(url);
  }

  // Main domain: redirect /dashboard routes to subdomain (except localhost)
  if (isMainDomain && url.pathname.startsWith('/dashboard')) {
    const baseDomain = parts.slice(-2).join('.');
    const redirectUrl = new URL(url);

    redirectUrl.host = `dashboard.${baseDomain}`;
    redirectUrl.pathname = url.pathname.replace('/dashboard', '');

    return NextResponse.redirect(redirectUrl);
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  const authResult = await ensureAuthenticated();
  const isLoggedIn = authResult.authenticated;

  // Main domain: redirect /login to dashboard subdomain
  if (url.pathname === '/login' && isMainDomain) {
    const baseDomain = parts.slice(-2).join('.');
    const redirectUrl = new URL(url);

    redirectUrl.host = `dashboard.${baseDomain}`;
    redirectUrl.pathname = '/login';

    return NextResponse.redirect(redirectUrl);
  }

  // Localhost: rewrite /login to /dashboard/login
  if (url.pathname === '/login' && isLocalhost) {
    url.pathname = '/dashboard/login';

    return NextResponse.rewrite(url);
  }

  // If logged in on login page, redirect to dashboard home
  if (isLoggedIn && url.pathname === '/dashboard/login') {
    const callbackUrl = url.searchParams.get('callbackUrl') || '/dashboard';

    return NextResponse.redirect(new URL(callbackUrl, url.origin));
  }

  // If logged in but onboarding incomplete, redirect to onboarding
  if (isLoggedIn && authResult.authenticated) {
    const session = authResult.session;
    const isOnboardingPage = url.pathname === '/dashboard/onboarding';
    const needsOnboarding = !session.user.onboardingComplete;

    console.log('[Proxy] Onboarding check:', {
      pathname: url.pathname,
      needsOnboarding,
      onboardingComplete: session.user.onboardingComplete,
    });

    if (needsOnboarding && !isOnboardingPage) {
      console.log('[Proxy] Redirecting to onboarding');

      // Redirect to onboarding (unless already there)
      return NextResponse.redirect(new URL('/dashboard/onboarding', url.origin));
    }

    if (!needsOnboarding && isOnboardingPage) {
      console.log('[Proxy] Already onboarded, redirecting to dashboard');

      // Already onboarded, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', url.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
