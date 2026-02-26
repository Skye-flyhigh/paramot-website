import { redirect } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';

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
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
