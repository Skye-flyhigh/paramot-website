import ScrollReveal from '@/components/ui/ScrollReveal';

import ContactModal from '@/components/ui/contact-modal';

interface ServiceCTAProps {
  available: boolean;
}

export default function ServiceCTA({ available }: ServiceCTAProps) {
  return (
    <ScrollReveal>
      <div className="rounded-xl border border-sky-200 bg-white p-8 text-center">
        {available ? (
          <>
            <h2 className="mb-2 text-xl font-bold text-sky-900">Ready to book?</h2>
            <p className="mb-4 text-sky-700">
              Get in touch and we&apos;ll arrange everything — postal service available
              UK-wide.
            </p>
            <ContactModal className="inline-block rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700">
              Get in touch
            </ContactModal>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-bold text-sky-900">Currently unavailable</h2>
            <p className="mb-4 text-sky-700">
              This service isn&apos;t available yet. Register your interest and we&apos;ll
              let you know when it launches.
            </p>
            <ContactModal className="inline-block rounded-lg border border-sky-300 px-6 py-3 font-medium text-sky-700 transition-colors hover:bg-sky-50">
              Register interest
            </ContactModal>
          </>
        )}
      </div>
    </ScrollReveal>
  );
}
