import { BUSINESS } from '@/lib/metadata.const';
import { Mail } from 'lucide-react';

export default function Location() {
  return (
    <section
      id="location"
      aria-label="Contact information"
      className="py-12 px-4 bg-white"
    >
      <div className="max-w-md mx-auto text-center">
        <a
          href={`mailto:${BUSINESS.email}`}
          className="group block rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-8 transition-shadow hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Mail className="w-7 h-7 text-sky-600" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-sky-900">Email Us</h3>
          <p className="text-sky-700 group-hover:text-sky-800 transition-colors">
            {BUSINESS.email}
          </p>
        </a>
      </div>
    </section>
  );
}
