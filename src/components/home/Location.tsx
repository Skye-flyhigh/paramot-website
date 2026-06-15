import { BUSINESS } from '@/lib/metadata.const';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Location() {
  const linkStyle =
    'group lg:min-w-[240px] rounded-2xl bg-linear-to-b from-sky-50 to-white border border-sky-100 p-8 m-10 transition-shadow hover:shadow-lg';
  const titleStyle = 'text-lg font-bold mb-1 text-sky-900';
  const pStyle = 'text-sky-700 group-hover:text-sky-800 transition-colors';
  const iconWrapperStyle = 'w-14 h-14 pm-icon-box mx-auto mb-4';
  const iconStyle = 'w-7 h-7 text-sky-600';

  const contactLinks = [
    {
      title: 'Email us',
      href: `mailto:${BUSINESS.email}`,
      details: BUSINESS.email,
      Icon: Mail,
    },
    {
      title: 'Phone us',
      href: `tel:${BUSINESS.phone}`,
      details: BUSINESS.phone,
      Icon: Phone,
    },
    {
      title: 'Visit us',
      href: 'https://share.google/WH6dbck2NRmVeJJPM',
      details: (
        <div className="flex flex-col">
          <span>{BUSINESS.address.street}</span>
          <span>{BUSINESS.address.city}</span>
          <span>{BUSINESS.address.region}</span>
          <span>{BUSINESS.address.postcode}</span>
          <span>{BUSINESS.address.country}</span>
        </div>
      ),
      Icon: MapPin,
    },
  ];

  return (
    <section id="location" aria-label="Contact information" className="px-4">
      <div className="mx-auto block md:flex justify-around text-center">
        {contactLinks.map(({ title, href, details, Icon }) => {
          if (!details) return;

          return (
            <a key={title} className={linkStyle} href={href}>
              <div className={iconWrapperStyle}>
                <Icon className={iconStyle} />
              </div>
              <h3 className={titleStyle}>{title}</h3>
              <p className={pStyle}>{details}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
