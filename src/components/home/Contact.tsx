'use client';

import ContactForm from './ContactForm';

export default function ContactF() {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-sky-900">Get In Touch</h2>
          <p className="text-sky-700 text-lg">
            Need service for your paraglider? Drop us a message and we'll get back to you
            soon.
          </p>
        </div>
        <ContactForm variant="contact" />
      </div>
    </section>
  );
}
