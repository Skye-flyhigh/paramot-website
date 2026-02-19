import Link from 'next/link';

import { auth, signOut } from '@/auth';
import { Button } from './ui/button';

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="bg-white shadow-sm border-b border-sky-200">
      <div className="mx-auto px-20 py-4 flex justify-between items-center">
        <div className="">
          <Link href="/" className="text-xl font-bold text-sky-900">
            para<span className="text-sky-400">MOT</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/equipment">
            <Button variant="link">Equipment Registry</Button>
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
    </nav>
  );
}
