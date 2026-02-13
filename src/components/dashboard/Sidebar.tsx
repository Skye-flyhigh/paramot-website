'use client';

import { useCustomer } from '@/contexts/CustomerContext';
import {
  CreditCard,
  Home,
  LogOut,
  MessageSquarePlus,
  Package,
  Settings,
  Wrench,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ContactForm from '../home/ContactForm';
import XButton from '../ui/x-button';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/equipment', label: 'Equipment', icon: Package },
  { href: '/dashboard/services', label: 'Services', icon: Wrench },
  { href: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const [openSupport, setOpenSupport] = useState<boolean>(false);
  const pathname = usePathname();
  const customer = useCustomer();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';

    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-full bg-white border-r border-sky-200 flex flex-col">
      {/* User info */}
      <div className="p-6 border-b border-sky-100">
        <p className="font-semibold text-sky-900">
          {customer.firstName} {customer.lastName}
        </p>
        <p className="text-sm text-sky-500 truncate">{customer.email}</p>
      </div>

      {/* Navigation */}
      <nav aria-label="Dashboard navigation" className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'bg-sky-100 text-sky-900 font-medium'
                    : 'text-sky-600 hover:bg-sky-50 hover:text-sky-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-sky-100 space-y-2">
        <button
          onClick={() => setOpenSupport(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sky-600 hover:bg-sky-50 hover:text-sky-900 transition-colors"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span>Submit a suggestion</span>
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sky-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign out</span>
        </button>
      </div>
      {/* Support Modal */}
      {openSupport && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <dialog
            open={openSupport}
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-0"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Submit a feedback</h2>
              <XButton onClose={() => setOpenSupport(false)} />
            </header>
            <ContactForm variant="feedback" onClose={() => setOpenSupport(false)} />
          </dialog>
        </div>
      )}
    </aside>
  );
}
