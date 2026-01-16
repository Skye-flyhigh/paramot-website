import Link from 'next/link';

import { auth, signOut } from '@/auth';

export default async function Nav() {
  const session = await auth();

  return (
    <nav className="bg-white shadow-sm border-b border-sky-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="">
          <Link href="/" className="text-xl font-bold text-sky-900">
            para<span className="text-sky-400">MOT</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sky-700 hover:text-sky-800 font-medium"
              >
                Dashboard
              </Link>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
