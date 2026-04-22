'use client';

import {
  ClipboardList,
  FolderSearch2,
  HelpCircle,
  Home,
  LogIn,
  LogOut,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match these path prefixes for active state */
  matchPrefixes: string[];
}

const baseTabs: Tab[] = [
  { href: '/', label: 'Home', icon: Home, matchPrefixes: [] },
  { href: '/services', label: 'Services', icon: Wrench, matchPrefixes: ['/services'] },
  {
    href: '/equipment',
    label: 'Registry',
    icon: FolderSearch2,
    matchPrefixes: ['/equipment'],
  },
];

const dashboardTab: Tab = {
  href: '/dashboard',
  label: 'Dashboard',
  icon: ClipboardList,
  matchPrefixes: ['/dashboard'],
};

const faqTab: Tab = {
  href: '/faq',
  label: 'FAQ',
  icon: HelpCircle,
  matchPrefixes: ['/faq'],
};

interface MobileTabBarProps {
  isAuthenticated: boolean;
}

export default function MobileTabBar({ isAuthenticated }: MobileTabBarProps) {
  const pathname = usePathname();

  const tabs = [...baseTabs, isAuthenticated ? dashboardTab : faqTab];

  function isActive(tab: Tab): boolean {
    if (tab.matchPrefixes.length === 0) return pathname === '/';

    return tab.matchPrefixes.some((prefix) => pathname.startsWith(prefix));
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-sky-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <div className="flex">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                active ? 'font-bold text-sky-600' : 'text-gray-500 hover:text-sky-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        {isAuthenticated ? (
          <>
            <form
              action={async () => {
                await signOut({ redirectTo: '/' });
              }}
              className="py-2 "
            >
              <Button
                variant="ghost"
                type="submit"
                className="flex flex-1 flex-col items-center gap-0.5 text-xs text-gray-500 hover:text-sky-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Button>
            </form>
          </>
        ) : (
          <Link
            href="/dashboard/login"
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs text-gray-500 hover:text-sky-600 transition-colors"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
