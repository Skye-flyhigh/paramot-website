import { BUSINESS } from '@/lib/metadata.const';
import { getPriceRange, getServicesList } from '@/lib/schema';
import type { CategorisedFAQ, FAQ, FAQCategory } from '@/lib/types/metadata';

/** Set of service codes that are currently available */
function getAvailableServiceCodes(): Set<string> {
  return new Set(
    getServicesList()
      .filter((s) => s.available)
      .map((s) => s.code),
  );
}

/** Filter FAQs: show if no serviceCodes, or if ANY linked service is available */
export function filterAvailableFAQs(faqs: CategorisedFAQ[]): CategorisedFAQ[] {
  const available = getAvailableServiceCodes();

  return faqs.filter(
    (faq) => !faq.serviceCodes || faq.serviceCodes.some((code) => available.has(code)),
  );
}

/** Filter categories, removing empty ones after FAQ filtering */
export function getVisibleCategories(): FAQCategory[] {
  return FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    faqs: filterAvailableFAQs(cat.faqs),
  })).filter((cat) => cat.faqs.length > 0);
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  // TODO: read thoroughly before pushing to prod
  {
    name: 'Services & Pricing',
    slug: 'services',
    icon: 'Wrench',
    description:
      'What each service tier includes, how pricing works, and what happens if we find a problem.',
    faqs: [
      {
        id: 'what-does-visual-check-include',
        serviceCodes: ['SVC-003', 'SVC-004'],
        question: 'What does a Visual Check include?',
        answer:
          "A Visual Check is a quick health assessment for your wing. We inspect the canopy fabric for visible wear, UV damage, and porosity concerns, check the lines for fraying or knots, examine the risers and maillons, and give a general condition summary. It's ideal if you're buying a used wing or just want peace of mind before the season.",
      },
      {
        id: 'what-does-trim-service-include',
        serviceCodes: ['SVC-001', 'SVC-002'],
        question: 'What does a Trim & Line service include?',
        answer:
          "The Trim & Line service focuses on your wing's geometry — the thing that most affects how it flies. We measure every line with a laser system, compare the results against the manufacturer's trim chart, identify any shrinkage or stretch (common with Aramid and Dyneema lines), and correct the trim to restore the original flight characteristics. You get a full digital report showing before and after measurements.",
      },
      {
        id: 'what-does-full-service-include',
        serviceCodes: ['SVC-011', 'SVC-012'],
        question: 'What does a Full Service include?',
        answer:
          'A Full Service is our most comprehensive option. It includes everything in the Trim & Line service, plus cloth porosity testing at multiple points across the canopy, tear resistance testing using a Bettsometer, line strength testing, detailed riser and carabiner inspection, and a comprehensive digital report. Think of it as an annual health check for your wing — it covers every aspect that degrades over time.',
      },
      {
        id: 'solo-vs-tandem-pricing',
        question: 'Why is tandem wing servicing more expensive?',
        answer:
          'Tandem wings are significantly larger — typically 38–42m² compared to 22–28m² for a solo wing. That means more fabric to test, more lines to measure, the trimming process is more delicate and more time on every step. The price difference reflects the genuine extra work involved, not a markup.',
      },
      {
        id: 'what-if-problem-found',
        question: 'What happens if you find a problem during servicing?',
        answer:
          "We'll contact you before doing any additional work. You'll get a clear explanation of the issue, photos where relevant, and a quote for any repairs. Nothing happens without your approval. If the issue is safety-critical, we'll explain why and recommend grounding the wing until it's resolved — but the decision is always yours.",
      },
      {
        id: 'do-you-do-repairs',
        serviceCodes: ['REP-001'],
        question: 'Do you do repairs as well as servicing?',
        answer:
          "Yes — we handle panel repairs, line replacements, riser refurbishment, and brake handle replacements. Minor repairs found during servicing can often be done on the spot (with your approval). For major repairs, we'll quote separately.",
      },
      {
        id: 'how-much-does-service-cost',
        question: 'How much does a paraglider service cost?',
        answer: `Our services range from ${getPriceRange()} depending on the service tier and whether your wing is solo or tandem. Check the Services section on our homepage for current pricing. We believe in transparent pricing — no hidden fees or surprise charges.`,
      },
      {
        id: 'do-you-service-paramotors',
        question: 'Do you service paramotor wings?',
        answer:
          "Yes. Paramotor (PPG) wings go through the same inspection process as free-flight wings. The trim profiles differ due to the motor's thrust line, but our laser measurement system handles both. If your wing has a reflex profile, we use the appropriate manufacturer trim data.",
      },
      {
        id: 'do-you-service-all-brands',
        question: 'Do you service all brands of paraglider?',
        answer:
          "We service all major brands including Advance, BGD, Gin, Nova, Ozone, Niviuk, Skywalk, Supair, and many more. The APPI methodology is currently supported by 9 manufacturers. We maintain a library of manufacturer trim charts and specifications. If we don't have data for your specific wing, we'll source it from the manufacturer before starting work.",
      },
      {
        id: 'do-you-service-harnesses',
        serviceCodes: ['SVC-031'],
        question: 'Do you inspect and service harnesses?',
        answer:
          'No. Harnesses have their own well detailed and thorough 22 steps inspection.',
      },
    ],
  },
  {
    name: 'Servicing Process',
    slug: 'process',
    icon: 'Microscope',
    description:
      'How we test, measure, and report — from trim to porosity to your digital report.',
    faqs: [
      {
        id: 'what-is-trim-measurement',
        question: 'What is trim measurement and why does it matter?',
        answer:
          "Trim is the relative length relationship between your A, B, C, and brake lines. Over time, different line materials shrink or stretch at different rates — Aramid tends to shrink, Dyneema can creep under load. Even a few millimetres of deviation changes your wing's angle of attack, affecting launch behaviour, speed, brake pressure, and collapse recovery. Trim measurement compares your lines against the manufacturer's specification to identify exactly where corrections are needed.",
      },
      {
        id: 'how-is-trim-measured',
        question: 'How do you measure trim?',
        answer:
          "We use a laser-guided measurement system. The wing is suspended and each line is measured under controlled tension to ensure repeatable, accurate results. Every measurement is recorded digitally and compared against the manufacturer's trim chart. The output shows deviations for each line group and cascade, making it easy to see exactly where adjustments are needed.",
      },
      {
        id: 'what-is-porosity-testing',
        question: 'What is porosity testing?',
        answer:
          "Porosity measures how much air passes through your canopy fabric, expressed in seconds (the time for a fixed volume of air to pass through a sample area). New paraglider fabric typically reads 200+ seconds. As fabric degrades from UV, abrasion, and use, porosity drops. Below certain thresholds (usually around 20–30 seconds, depending on the manufacturer), the wing can't maintain internal pressure reliably, leading to poor inflation and collapse resistance. We test at multiple points across the canopy to build a complete picture.",
      },
      {
        id: 'what-is-bettsometer',
        question: 'What is a Bettsometer test?',
        answer:
          "A Bettsometer measures the tear resistance of your canopy fabric — how much force is needed to propagate a small cut. It's a standardised test (similar to EN 926-1 requirements) that tells us whether the ripstop nylon still has enough structural strength. Low tear resistance, combined with poor porosity, is often the deciding factor in whether a wing should be retired.",
      },
      {
        id: 'what-is-line-strength-test',
        question: 'How do you test line strength?',
        answer:
          "We test individual lines using a calibrated tension gauge to check they still meet the minimum breaking strain specified by the manufacturer. Lines degrade from UV exposure, abrasion (especially at the connection points), and general fatigue. A line that's lost significant strength is a safety concern even if it looks fine visually — this is why strength testing matters.",
      },
      {
        id: 'what-does-digital-report-include',
        question: 'What does the digital service report include?',
        answer:
          'Your report includes every measurement and test result from the service: trim data (before and after correction), porosity readings with canopy position map, Bettsometer results, line strength data, riser condition notes, and an overall pass/fail assessment. The report is accessible online through our Equipment Registry — you can share the link with anyone, which is particularly useful when selling your wing.',
      },
      {
        id: 'what-is-riser-inspection',
        question: 'What do you check during a riser inspection?',
        answer:
          "We inspect the webbing for UV degradation and abrasion, check all stitching for integrity, test speed bar pulleys and Brummel hooks, examine maillons for corrosion or deformation, and verify brake handle attachment. Risers take a lot of load and UV exposure — they're one of the most safety-critical components.",
      },
      {
        id: 'how-are-corrections-made',
        question: 'How are trim corrections made?',
        answer:
          "Trim corrections are made at the maillon connections between the lines and risers. By adjusting where the line attaches (using knots or replacement loops), we change the effective line length to match the manufacturer's specification. All corrections are re-measured after adjustment to verify accuracy. The before-and-after data is documented in your report.",
      },
    ],
  },
  {
    name: 'Equipment Care',
    slug: 'care',
    icon: 'ShieldCheck',
    description:
      'How to store, protect, and extend the life of your paragliding equipment.',
    faqs: [
      {
        id: 'how-often-service',
        question: 'How often should I service my paraglider?',
        answer:
          "Most manufacturers recommend an annual service or every 100 flying hours, whichever comes first. If you fly in coastal environments (salt air accelerates degradation), sandy conditions, or do a lot of ground handling, consider more frequent checks. A good rule: if you're unsure, a Visual Check is a low-cost way to assess whether a full service is needed.",
      },
      {
        id: 'uv-protection',
        question: 'How does UV damage affect my paraglider?',
        answer:
          'UV radiation is the single biggest factor in paraglider fabric degradation. It breaks down the nylon polymer chains, reducing both porosity and tear strength. A wing left in the sun loses performance faster than one stored properly — even indirect UV through a car window adds up. The damage is cumulative and irreversible. Always pack your wing away after landing rather than leaving it laid out.',
      },
      {
        id: 'storage-tips',
        question: "What's the best way to store my paraglider?",
        answer:
          "Store your wing loosely packed in a cool, dry, dark place. Avoid compression (don't stack heavy items on top), avoid damp environments (promotes mildew), and keep away from direct sunlight. A dedicated storage bag or a loose stuff sack is ideal. If the wing is wet, dry it thoroughly in the shade before packing — never store a damp wing.",
      },
      {
        id: 'concertina-bag',
        question: 'Should I use a concertina packing bag?',
        answer:
          'Yes — concertina bags are worth the investment. They keep your wing organised, protect the cells during transport, speed up launch preparation, and reduce random creasing that can stress the fabric. They also make packing more consistent, which means less time faffing on launch.',
      },
      {
        id: 'signs-of-wear',
        question: 'What are the signs that my wing needs servicing?',
        answer:
          "Watch for: longer or harder launches (trim deviation), the wing feeling different in the air (brake pressure changes, speed changes), visible fabric discolouration or shiny patches (UV damage), frayed or fuzzy lines, stiff or corroded maillons, or any asymmetry in flight. If something feels different from when the wing was new, that's your signal.",
      },
      {
        id: 'wing-lifespan',
        question: 'How long does a paraglider last?',
        answer:
          'Typically 300–500 flying hours or 8–10 years, whichever comes first — but this varies hugely depending on use and care. A wing stored properly, flown gently, and serviced regularly can exceed these numbers. A wing left in a hot car, flown in sandy conditions, and never serviced might not make 200 hours. Regular servicing gives you objective data (porosity, tear strength) to make an informed decision rather than guessing.',
      },
      {
        id: 'sand-and-dirt',
        question: 'How does sand and dirt affect my paraglider?',
        answer:
          'Sand and grit act as abrasives inside the cells, wearing down the fabric coating from the inside every time the wing inflates and moves. They also damage lines at contact points. If you regularly fly from sandy or dusty sites, rinse the inside of the wing with fresh water periodically and dry thoroughly. Avoid dragging the wing across abrasive ground.',
      },
      {
        id: 'washing-paraglider',
        question: 'Can I wash my paraglider?',
        answer:
          'You can rinse it with clean fresh water to remove salt or sand — lay it out flat and use a gentle hose. Never use detergents, solvents, or washing machines. Never wring or twist the fabric. Dry completely in the shade before storing. If the wing has a serious contamination issue (oil, fuel), contact us for advice before attempting to clean it.',
      },
    ],
  },
  {
    name: 'Shipping & Logistics',
    slug: 'shipping',
    icon: 'Truck',
    description:
      'How our postal service works, packing advice, turnaround times, and drop-off options.',
    faqs: [
      {
        id: 'postal-service',
        question: 'How does the postal service work?',
        answer:
          "Simple: pack your wing, post it to us, and we'll return it fully serviced. We'll confirm receipt when it arrives and keep you updated on progress. When the service is complete, we ship it back to you via tracked courier. The whole process is managed through our booking system so you can track the status.",
      },
      {
        id: 'how-to-pack',
        question: 'How should I pack my paraglider for posting?',
        answer:
          "Use the wing's own bag inside a sturdy outer box or heavy-duty shipping bag. Remove any sharp items (carabiners, speed bar) and wrap them separately. Pad any hard components. Include your name and booking reference inside the package. We recommend a box over a bag for better protection — and please don't vacuum-seal it, as extreme compression can crease the fabric.",
      },
      {
        id: 'turnaround-time',
        question: 'How long does a service take?',
        answer:
          "Typically 3–5 working days once we receive your wing, depending on the service type and current workload. We'll confirm expected timescales when you book. During peak season (spring), turnaround may be slightly longer — booking early helps.",
      },
      {
        id: 'drop-off',
        question: 'Can I drop off my equipment in person?',
        answer: `Yes — we're based in ${BUSINESS.address.city}, South Wales. Get in touch to arrange a drop-off time. This saves you shipping costs and gives us a chance to discuss any concerns face-to-face.`,
      },
      {
        id: 'shipping-insurance',
        question: 'Is my equipment insured during shipping?',
        answer:
          "We recommend using a tracked, insured shipping service when sending your equipment. Once it's in our workshop, your equipment is covered under our professional liability insurance. For the return journey, we use tracked courier services with appropriate insurance.",
      },
      {
        id: 'international-shipping',
        question: 'Do you accept equipment from outside the UK?',
        answer:
          "We primarily serve the UK market, but we can accept equipment from Europe and beyond. International shipping costs and customs are the customer's responsibility. Get in touch and we'll work out the logistics.",
      },
    ],
  },
  {
    name: 'Equipment Registry',
    slug: 'registry',
    icon: 'ClipboardList',
    description:
      'Our public service history lookup — what it shows, why it exists, and how it helps you.',
    faqs: [
      {
        id: 'what-is-equipment-registry',
        question: 'What is the Equipment Registry?',
        answer:
          "The Equipment Registry is a public service history lookup, similar to an MOT check for vehicles. Anyone can search by serial number to see a wing's service history — what tests were done, when, and the results. It's designed to bring transparency to the used paraglider market, where buyers currently have to take sellers at their word.",
      },
      {
        id: 'what-does-registry-show',
        question: 'What information does the Equipment Registry show?',
        answer:
          "The registry shows the equipment's service history: service dates, service types performed, overall pass/fail results, and key test data (porosity, trim status, line condition). It does not show the owner's personal information, pricing, or any commercially sensitive data. Think of it as a Carfax report for paragliders.",
      },
      {
        id: 'who-can-see-registry',
        question: "Who can see my equipment's service history?",
        answer:
          "Anyone with the serial number can view the service history — that's by design. The registry is intentionally public to promote transparency and safety. Your personal details (name, email, address) are never shown. Only the equipment's technical service data is visible.",
      },
      {
        id: 'buying-used-gear',
        question: 'How does the registry help when buying used equipment?',
        answer: `Before buying a used wing, ask the seller for the serial number and look it up. You'll see whether it's been professionally serviced, the most recent porosity and trim data, and any issues that were flagged. No service history doesn't necessarily mean a bad wing — it might just mean it was serviced elsewhere. But a verified service history from ${BUSINESS.name} gives you objective data to inform your decision.`,
      },
      {
        id: 'add-equipment-to-registry',
        question: 'How do I get my equipment on the registry?',
        answer: `Any equipment serviced by ${BUSINESS.name} is automatically added to the registry. We record the serial number during intake and all service data is linked to it. There's nothing extra you need to do.`,
      },
      {
        id: 'registry-privacy',
        question: 'Can I opt out of the Equipment Registry?',
        answer:
          "The registry only shows technical service data — never personal information. Since the data relates to the equipment (not you), it stays with the equipment regardless of ownership changes. This is what makes it valuable: future owners can verify the service history. If you have specific concerns, get in touch and we'll discuss your situation.",
      },
    ],
  },
  {
    name: 'Reserve & Harness',
    slug: 'reserves',
    icon: 'LifeBuoy',
    description:
      'Reserve repacking schedules, lifespan, types, and harness inspection essentials.',
    faqs: [
      {
        id: 'how-often-repack-reserve',
        serviceCodes: ['PACK-001', 'PACK-002'],
        question: 'How often should I repack my reserve parachute?',
        answer:
          "Every 6 months is the standard recommendation, and many manufacturers require it. Even if you never deploy it, the fabric can develop memory folds and the deployment bag can compress, potentially slowing deployment when you need it most. A reserve that doesn't open quickly is a reserve that doesn't work. Mark your repack date and stick to it.",
      },
      {
        id: 'reserve-lifespan',
        question: 'How long does a reserve parachute last?',
        answer:
          'Most manufacturers specify a 10-year lifespan from date of manufacture, regardless of use. The nylon degrades over time even when stored perfectly. After 10 years, the fabric may not have the porosity or strength to guarantee the descent rate specified in the certification. Some reserves can be tested and recertified — check with the manufacturer.',
      },
      {
        id: 'steerable-vs-round',
        question: "What's the difference between a steerable and round reserve?",
        answer:
          'Round reserves are simpler and lighter — they provide a stable descent with minimal pilot input. Steerable (Rogallo-type) reserves give you directional control, which can help you avoid obstacles on landing. The trade-off: steerables are heavier, more complex to pack, and require practice to fly. For most recreational pilots, a round reserve with a good sink rate is the reliable choice.',
      },
      {
        id: 'reserve-deployment',
        question: 'What should I check about my reserve deployment system?',
        answer:
          "Check: the handle is accessible and secure (can you reach it with either hand?), the pins and closing loop are in good condition, the inner container isn't too tight or too loose, and the bridle routing is correct. During repacking, we check all of these. If your reserve was deployed or your harness was modified, get the deployment system inspected before flying.",
      },
      {
        id: 'harness-inspection-what',
        question: 'What gets checked during a harness inspection?',
        answer:
          'We inspect the main structural webbing for UV damage and abrasion, check all stitching (especially load-bearing bartacks), examine buckles and adjustment hardware, test carabiner condition and gate function, verify the reserve container and deployment system, and check the back protection system. Harnesses take constant UV exposure and load cycling — they deserve the same attention as your wing.',
      },
      {
        id: 'carabiner-inspection',
        question: 'How often should carabiners be inspected?',
        answer:
          "Check your carabiners before every flight (gate opens and closes freely, no visible damage). Get a professional inspection annually — we check for hairline cracks, gate wear, corrosion, and proper lock function. Steel carabiners are more durable than aluminium but heavier. Replace immediately if you see any signs of damage or if the gate doesn't lock positively.",
      },
      {
        id: 'do-you-repack-reserves',
        serviceCodes: ['PACK-001', 'PACK-002'],
        question: 'Do you offer reserve repacking?',
        answer:
          "Yes — reserve repacking is one of our core services. We inspect the canopy, lines, and deployment system during every repack, and document the condition in your service record. We'll flag any issues and advise on replacement if the reserve is approaching end of life.",
      },
      {
        id: 'cocoon-harness-reserve',
        question: 'Does harness type affect reserve deployment?',
        answer:
          'Yes — cocoon (pod) harnesses route the reserve deployment differently to open harnesses. The deployment path is longer and the inner container position matters more. If you switch harness type, have the reserve repacked and the deployment system checked in the new harness to ensure clean extraction.',
      },
    ],
  },
  {
    name: `About ${BUSINESS.name}`,
    slug: 'about',
    icon: 'Mountain',
    description: "Who we are, our qualifications, where we're based, and what drives us.",
    faqs: [
      {
        id: 'who-is-paramot',
        question: `Who runs ${BUSINESS.name}?`,
        answer: `${BUSINESS.name} is run by ${BUSINESS.legalName.split(' ')[0]}, a pilot and APPI-certified technician based in ${BUSINESS.address.city}, South Wales. It started from a frustration with the lack of transparency in the paraglider servicing industry — you'd send your wing off and get a piece of paper back with vague notes. ${BUSINESS.name} exists to do it properly: every measurement documented, every result accessible online.`,
      },
      {
        id: 'appi-certification',
        question: 'What is APPI certification?',
        answer:
          "APPI (Association of Paragliding Pilots and Instructors) is an international paragliding standards body. Their technician certification covers wing inspection methodology, measurement techniques, material testing standards, and safety assessment protocols. It ensures your wing is being assessed against recognised international standards, not just someone's best guess.",
      },
      {
        id: 'where-based',
        question: 'Where are you based?',
        answer: `We're in ${BUSINESS.address.city}, South Wales (${BUSINESS.address.postcode}) — in the heart of some of the best flying country in the UK. If you're local to the Brecon Beacons area, drop-off is easy. For everyone else, our postal service covers the whole UK.`,
      },
      {
        id: 'what-makes-different',
        question: `What makes ${BUSINESS.name} different from other servicing workshops?`,
        answer:
          "Three things: transparency (every test result documented and accessible online via the Equipment Registry), technology (laser trim measurement and digital reporting, not handwritten notes), and accountability (our results are public, so we can't hide behind vague assessments). We believe if a workshop isn't willing to show you the data, you should ask why.",
      },
      {
        id: 'guarantee',
        question: 'Do you offer a guarantee on your work?',
        answer:
          "Yes — if you believe our work is defective, contact us within 30 days. We'll re-inspect and correct any defects free of charge. Note that this covers our workmanship, not pre-existing conditions or subsequent damage. Full details are in our Terms of Service.",
      },
      {
        id: 'how-to-contact',
        question: 'How do I get in touch or book a service?',
        answer: `Use the contact form on our homepage, or email us directly at ${BUSINESS.email}. Tell us what equipment you have and what service you're interested in, and we'll get back to you with availability and next steps.`,
      },
    ],
  },
];

/** Fetch specific FAQs by ID — used for service page sidebars */
export function getFAQsByIds(ids: string[]): CategorisedFAQ[] {
  const all = getVisibleCategories().flatMap((cat) => cat.faqs);

  return ids
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is CategorisedFAQ => f !== undefined);
}

/** Flat array of all visible FAQs — used for JSON-LD schemas */
export function getAllFAQs(): FAQ[] {
  return getVisibleCategories().flatMap((cat) =>
    cat.faqs.map(({ question, answer }) => ({ question, answer })),
  );
}

/** Curated selection for homepage preview (filtered by service availability) */
export function getHomepageFAQs(): CategorisedFAQ[] {
  const picks = [
    'what-does-full-service-include',
    'how-often-service',
    'what-is-trim-measurement',
    'what-is-equipment-registry',
    'how-often-repack-reserve',
    'postal-service',
  ];
  const all = getVisibleCategories().flatMap((cat) => cat.faqs);

  return picks
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is CategorisedFAQ => f !== undefined);
}
