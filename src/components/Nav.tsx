import Link from 'next/link';

import { Button } from './ui/button';

export default function Nav() {
  return (
    <nav
      aria-label="Main navigation"
      className="bg-white shadow-sm border-b border-sky-200"
    >
      <div className="mx-auto px-6 sm:px-20 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-sky-900">
          para<span className="text-sky-400">MOT</span>
        </Link>
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
        </div>
      </div>
    </nav>
  );
}
