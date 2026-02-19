import { redirect } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';

export default async function WorkshopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await ensureTechnician();

  if (!authResult.authorized) {
    redirect('/dashboard/login');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-zinc-900">paraMOT Workshop</h1>
          </div>
          <div className="text-sm text-zinc-500">{authResult.email}</div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
