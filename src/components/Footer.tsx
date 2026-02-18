import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center flex justify-around">
        <section id="footer-branding" className="mb-6">
          <h3 className="text-2xl font-bold mb-3">
            para<span className="text-sky-300">MOT</span>
          </h3>
          <p className="text-sky-200">Professional paragliding servicing and repairs</p>
        </section>
        <section id="footer-links" className="flex justify-around w-[50%]">
          <div id="legal-links">
            <h4 className="font-bold">Legal links</h4>
            <ul className="text-sky-200">
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policies</Link>
              </li>
            </ul>
          </div>
          <div id="social-links">
            <h4 className="font-bold">Social links</h4>
            <ul className="text-sky-200">
              <li>Some link</li>
            </ul>
          </div>
        </section>
      </div>
      <section className="flex border-t border-sky-700/50 pt-6 justify-around">
        <p className="text-sky-300/80">
          &copy; {new Date().getFullYear()} paraMOT. All rights reserved.
        </p>
        <p className="text-sky-300/80">Homemade with 💜 by Skye</p>
      </section>
    </footer>
  );
}
