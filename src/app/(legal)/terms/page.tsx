import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2">Terms of Service</h1>
          <p className="text-sky-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>

          <div className="prose prose-sky max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to paraMOT. By using our services, you agree to these Terms of
                Service. Please read them carefully. These terms govern your use of our
                paragliding equipment servicing, repairs, and related services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">2. Services</h2>
              <p className="text-gray-700 mb-4">
                paraMOT provides servicing and repair services for paragliding equipment
                including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Paraglider wing inspections and repairs</li>
                <li>Reserve parachute repacking and servicing</li>
                <li>Harness inspections and repairs</li>
                <li>General equipment maintenance</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All services are performed by qualified technicians in accordance with
                manufacturer guidelines and industry standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                3. Booking and Cancellation
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Booking:</strong> Services can be booked through our online portal
                or by contacting us directly. A booking confirmation will be sent to your
                registered email address.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Cancellation:</strong> You may cancel or reschedule your booking
                up to [X days] before the scheduled service date without charge.
                Cancellations made within [X days] of the service date may incur a
                cancellation fee.
              </p>
              <p className="text-gray-700 mb-4 text-sm italic">
                [TODO: Define specific cancellation timeframes and fees]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                4. Equipment Handling
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Your Responsibility:</strong> You are responsible for accurately
                describing the condition of your equipment when booking services. Any
                undisclosed damage may result in additional service time and costs.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Our Responsibility:</strong> We will handle your equipment with
                professional care. Equipment is insured while in our possession. However,
                we cannot accept liability for pre-existing damage or wear that is
                discovered during servicing.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Condition Reports:</strong> We will provide detailed condition
                reports for all equipment serviced, highlighting any issues found during
                inspection.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                5. Payment Terms
              </h2>
              <p className="text-gray-700 mb-4">
                Payment is due upon completion of services unless otherwise agreed. We
                accept [payment methods TBD]. Prices quoted are valid for [X days] from
                the date of quotation.
              </p>
              <p className="text-gray-700 mb-4">
                Additional work discovered during servicing will be quoted separately and
                requires your approval before proceeding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                <strong className="text-red-600">
                  IMPORTANT - PLEASE READ CAREFULLY:
                </strong>
              </p>
              <p className="text-gray-700 mb-4">
                Paragliding is an inherently dangerous sport. While we perform all
                services to the highest standards, we cannot guarantee the absolute safety
                of your equipment. You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  Daily <b>AND</b> Pre-flight checks before each flight
                </li>
                <li>
                  Check <b>own equipment prior flight after each servicing</b> through
                  ground handling
                </li>
                <li>Operating equipment within manufacturer specifications</li>
                <li>Regular equipment inspections per manufacturer recommendations</li>
                <li>Your own safety and the safety of others</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Our liability is limited to the cost of the services provided. We are not
                liable for consequential damages, injury, or death arising from equipment
                failure, whether serviced by us or not.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">7. Warranty</h2>
              <p className="text-gray-700 mb-4">
                We warrant that all services are performed with reasonable skill and care.
                If you believe our work is defective, please contact us within [X days] of
                service completion. We will re-inspect and, if necessary, correct any
                defects free of charge.
              </p>
              <p className="text-gray-700 mb-4">
                This warranty does not cover damage caused by improper use, accidents, or
                normal wear and tear.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                8. Data and Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Your use of our services is also governed by our{' '}
                <Link
                  href="/privacy"
                  className="text-sky-600 hover:text-sky-800 underline"
                >
                  Privacy Policy
                </Link>
                , which explains how we collect, use, and protect your personal
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                9. Service History Records
              </h2>
              <p className="text-gray-700 mb-4">
                We maintain detailed service records for all equipment we work on. These
                records are available to you through your customer portal and can be
                shared with prospective buyers when selling equipment.
              </p>
              <p className="text-gray-700 mb-4">
                Equipment service history is intentionally public (similar to vehicle
                service history) to promote transparency and safety in the paragliding
                community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We may update these terms from time to time. Changes will be posted on
                this page with an updated revision date. Continued use of our services
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-700 mb-4">
                These terms are governed by the laws of England and Wales. Any disputes
                will be subject to the exclusive jurisdiction of the courts of England and
                Wales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-sky-900 mb-4">12. Contact</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these terms, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: hello@paramot.co.uk
                <br />
                [TODO: Add physical address, phone number, company registration details]
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
