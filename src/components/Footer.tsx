import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      aria-label="Footer"
      className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-800 text-white py-12 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-2">
            para<span className="text-sky-300">MOT</span>
          </h3>
          <p className="text-sky-200">Professional paragliding servicing and repairs</p>
        </div>
        <nav aria-label="Legal links">
          <h4 className="font-bold mb-2">Legal</h4>
          <ul className="text-sky-200 space-y-1">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="max-w-6xl mx-auto mt-8 flex flex-col items-center gap-2 border-t border-sky-700/50 pt-6">
        <p className="text-sky-300/80">
          &copy; {new Date().getFullYear()} paraMOT. All rights reserved.
        </p>
        <p className="text-sky-300/80">Homemade with 💜 by Skye</p>
      </div>
    </footer>
  );
}
