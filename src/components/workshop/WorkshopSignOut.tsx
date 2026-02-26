'use client';

import { signOut } from 'next-auth/react';

export default function WorkshopSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-xs text-zinc-400 hover:text-zinc-600"
    >
      Sign out
    </button>
  );
}
