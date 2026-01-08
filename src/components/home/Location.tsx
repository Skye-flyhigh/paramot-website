import { MapPin, Phone, Mail } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-sky-900">Find Us</h2>
          <p className="text-sky-700 text-lg">
            Visit our workshop or get in touch through any of these channels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <MapPin className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-sky-900">Address</h3>
            <address className="text-sky-700 not-italic leading-relaxed">
              123 Paragliding St.
              <br />
              Soaring Heights, PH 12345
              <br />
              United Kingdom
            </address>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Phone className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-sky-900">Phone</h3>
            <p className="text-sky-700">
              <a
                href="tel:+441234567890"
                className="hover:text-sky-800 font-medium transition-colors"
              >
                +44 123 456 7890
              </a>
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Mail className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-sky-900">Email</h3>
            <p className="text-sky-700">
              <a
                href="mailto:info@paramot.uk"
                className="hover:text-sky-800 font-medium transition-colors"
              >
                info@paramot.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
