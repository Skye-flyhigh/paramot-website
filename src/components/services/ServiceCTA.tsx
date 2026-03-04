import ScrollReveal from '@/components/ui/ScrollReveal';

import ContactModal from '@/components/ui/contact-modal';

interface ServiceCTAProps {
  available: boolean;
}

export default function ServiceCTA({ available }: ServiceCTAProps) {
  return (
    <ScrollReveal>
      <div className="pm-card-cta">
        {available ? (
          <>
            <h2 className="mb-2 text-xl font-bold text-sky-900">Ready to book?</h2>
            <p className="mb-4 text-sky-700">
              Get in touch and we&apos;ll arrange everything — postal service available
              UK-wide.
            </p>
            <ContactModal className="pm-btn">Get in touch</ContactModal>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-xl font-bold text-sky-900">Currently unavailable</h2>
            <p className="mb-4 text-sky-700">
              This service isn&apos;t available yet. Register your interest and we&apos;ll
              let you know when it launches.
            </p>
            <ContactModal className="pm-btn-outline">Register interest</ContactModal>
          </>
        )}
      </div>
    </ScrollReveal>
  );
}
