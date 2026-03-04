'use client';

import { ClipboardList, HelpCircle, Home, Wrench, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match these path prefixes for active state */
  matchPrefixes: string[];
}

const tabs: Tab[] = [
  { href: '/', label: 'Home', icon: Home, matchPrefixes: [] },
  {
    href: '/services',
    label: 'Services',
    icon: Wrench,
    matchPrefixes: ['/services'],
  },
  { href: '/faq', label: 'FAQ', icon: HelpCircle, matchPrefixes: ['/faq'] },
  {
    href: '/equipment',
    label: 'Equipment',
    icon: ClipboardList,
    matchPrefixes: ['/equipment'],
  },
];

export default function MobileTabBar() {
  const pathname = usePathname();

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
      </div>
    </nav>
  );
}
