import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2">Privacy Policy</h1>
          <p className="text-sky-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>

          <div className="prose prose-sky max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                paraMOT ("we", "us", or "our") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard
                your personal information when you use our services.
              </p>
              <p className="text-gray-700 mb-4">
                We are based in the United Kingdom and comply with UK data protection
                laws, including the UK GDPR and the Data Protection Act 2018.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-sky-800 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                When you register for our services, we collect:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Name and contact details (email, phone number)</li>
                <li>Postal address (for equipment delivery/collection)</li>
                <li>Authentication information (for account security)</li>
              </ul>

              <h3 className="text-xl font-semibold text-sky-800 mb-3">
                2.2 Equipment Information
              </h3>
              <p className="text-gray-700 mb-4">
                To provide our services, we record details about your paragliding
                equipment:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Equipment type, manufacturer, model, and serial numbers</li>
                <li>Service history and condition reports</li>
                <li>Ownership records (for equipment tracking)</li>
              </ul>

              <h3 className="text-xl font-semibold text-sky-800 mb-3">
                2.3 Service Records
              </h3>
              <p className="text-gray-700 mb-4">
                We maintain records of all services performed, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Service dates, types, and descriptions</li>
                <li>Technician notes and findings</li>
                <li>Booking and payment information</li>
              </ul>

              <h3 className="text-xl font-semibold text-sky-800 mb-3">
                2.4 Technical Information
              </h3>
              <p className="text-gray-700 mb-4">
                When you use our website, we automatically collect minimal technical
                information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Authentication session data (for secure login)</li>
                <li>Browser preferences (for site functionality)</li>
              </ul>
              <p className="text-gray-700 mb-4 text-sm italic">
                Note: Our hosting provider may log IP addresses and other technical
                information in server logs for security and troubleshooting purposes. We
                do not actively collect or use this information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Provide and manage our servicing and repair services</li>
                <li>Maintain accurate service records for safety and compliance</li>
                <li>Communicate with you about bookings, services, and updates</li>
                <li>Process payments and manage our business operations</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations and industry regulations</li>
              </ul>

              <p className="text-gray-700 mb-4">
                <strong>Legal Basis:</strong> We process your personal data under the
                following legal bases:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Contract:</strong> Processing is necessary to perform our
                  services
                </li>
                <li>
                  <strong>Consent:</strong> You have explicitly agreed to processing
                  (e.g., marketing emails)
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> For business operations and
                  service improvement
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with UK laws and
                  regulations
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                4. Public Equipment Service History
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Important:</strong> Equipment service records are intentionally
                made public (accessible via serial number lookup) to promote safety and
                transparency in the paragliding community.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>What is public:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Equipment serial numbers, manufacturers, models</li>
                <li>Service dates, types, and general condition reports</li>
                <li>Service history timeline (similar to vehicle MOT history)</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>What remains private:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Your personal contact information (name, email, phone, address)</li>
                <li>Service costs and payment information</li>
                <li>Your customer account details</li>
              </ul>
              <p className="text-gray-700 mb-4">
                By using our services, you consent to this public equipment history model.
                This serves the legitimate interest of safety in the paragliding
                community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information
                with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Service Providers:</strong> Third parties who help us operate
                  our business (e.g., payment processors, email services)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect
                  our legal rights
                </li>
                <li>
                  <strong>Equipment Manufacturers:</strong> For warranty claims or safety
                  recalls (with your consent)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to provide
                our services and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Customer Account Data:</strong> Until account deletion + [X
                  years] for legal compliance
                </li>
                <li>
                  <strong>Service Records:</strong> Indefinitely for safety and equipment
                  history tracking
                </li>
                <li>
                  <strong>Payment Records:</strong> [X years] as required by UK tax law
                </li>
              </ul>
              <p className="text-gray-700 mb-4 text-sm italic">
                [TODO: Define specific retention periods based on legal requirements and
                business needs]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                7. Your Rights (UK GDPR)
              </h2>
              <p className="text-gray-700 mb-4">
                Under UK data protection law, you have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate or incomplete data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your data (subject to
                  legal obligations)
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a structured,
                  machine-readable format
                </li>
                <li>
                  <strong>Object:</strong> Object to processing based on legitimate
                  interests
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Where processing is based on consent
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, contact us at:{' '}
                <strong>hello@paramot.co.uk</strong>
              </p>
              <p className="text-gray-700 mb-4">
                You also have the right to lodge a complaint with the{' '}
                <a
                  href="https://ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-800 underline"
                >
                  Information Commissioner's Office (ICO)
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                8. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect
                your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Encryption of data in transit (HTTPS) and at rest</li>
                <li>Row-level security policies on database access</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no internet-based system is completely secure. We cannot
                guarantee absolute security of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                9. Cookies and Tracking
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze site usage and improve performance</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookie settings through your browser. Disabling certain
                cookies may affect site functionality.
              </p>
              <p className="text-gray-700 mb-4 text-sm italic">
                [TODO: Add detailed cookie policy and consent management if using
                analytics/marketing cookies]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                10. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                Our website and services may use third-party providers:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Authentication:</strong> NextAuth.js (for secure login)
                </li>
                <li>
                  <strong>Email:</strong> Resend (for transactional emails)
                </li>
                <li>
                  <strong>Hosting:</strong> [Hosting provider TBD]
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                These services have their own privacy policies and are responsible for
                their data practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                11. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for individuals under 18. We do not
                knowingly collect personal information from children. If you believe we
                have collected data from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                12. Changes to This Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. Changes will be
                posted on this page with an updated revision date. Significant changes
                will be communicated via email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                For questions about this Privacy Policy or to exercise your data rights,
                contact us:
              </p>
              <p className="text-gray-700">
                Email: hello@paramot.co.uk
                <br />
                [TODO: Add Data Protection Officer details if required, physical address,
                company registration]
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-sky-200">
            <Link
              href="/"
              className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-2"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
