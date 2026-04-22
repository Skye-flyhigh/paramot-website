import Link from 'next/link';

import { signOut } from '@/auth';
import { ensureAuthenticated } from '@/lib/security/auth-check';
import { Button } from './ui/button';

export default async function Nav() {
  const isAuth = await ensureAuthenticated();
  const session = isAuth.authenticated ? isAuth.session : null;

  return (
    <nav
      aria-label="Main navigation"
      className="bg-white shadow-sm border-b border-sky-200"
    >
      <div className="mx-auto px-6 sm:px-20 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-sky-900">
          para<span className="text-sky-400">MOT</span>
        </Link>
        <div className="flex flex-row gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/services">
              <Button variant="link">Services</Button>
            </Link>
            <Link href="/faq">
              <Button variant="link">FAQ</Button>
            </Link>
            <Link href="/equipment">
              <Button variant="link">Equipment Registry</Button>
            </Link>
            <Link href="/blog">
              <Button variant="link">Blog</Button>
            </Link>
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="link">Dashboard</Button>
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
                >
                  <Button type="submit">Sign Out</Button>
                </form>
              </>
            ) : (
              <Link href="/dashboard/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
