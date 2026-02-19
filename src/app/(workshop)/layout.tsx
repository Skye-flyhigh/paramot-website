import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import WorkshopSignOut from '@/components/workshop/WorkshopSignOut';

export default async function WorkshopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await ensureTechnician();

  if (!authResult.authorized) {
    redirect('/dashboard/login?callbackUrl=/workshop');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/workshop"
              className="text-lg font-semibold text-zinc-900 hover:text-zinc-700"
            >
              paraMOT Workshop
            </Link>
            <Link href="/dashboard" className="text-xs text-zinc-400 hover:text-zinc-600">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{authResult.email}</span>
            <WorkshopSignOut />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
