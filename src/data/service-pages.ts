import rawServicesData from '@/data/services.json';
import type { ServiceCode } from '@/lib/validation/serviceSchema';

// ─── Types ────────────────────────────────────────────────────────

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
  /** Failure at this step = stop and discuss with customer */
  critical?: boolean;
}

export interface IncludeItem {
  label: string;
  included: boolean;
}

export interface ServiceImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ServicePageConfig {
  slug: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  serviceCodes: ServiceCode[];
  heroDescription: string;
  icon: string;
  processSteps: ProcessStep[];
  includes: IncludeItem[];
  images: ServiceImage[];
  relatedFAQIds: string[];
  upgradeNote?: string;
  upgradeSlug?: string;
}

// ─── Page configs ─────────────────────────────────────────────────

const SERVICE_PAGES: ServicePageConfig[] = [
  //TODO: read thoroughly the content
  {
    slug: 'full-service',
    pageTitle: 'Full Glider Service',
    metaTitle: 'Full Paraglider Service — APPI Airworthiness Check | paraMOT',
    metaDescription:
      'Complete 12-step APPI airworthiness inspection: porosity testing, tear resistance, line strength, trim measurement and correction. Transparent digital report included.',
    keywords: [
      'paraglider full service UK',
      'annual paraglider inspection',
      'APPI airworthiness check',
      'wing porosity test',
      'glider cloth testing',
      'paraglider service report',
    ],
    serviceCodes: ['SVC-011', 'SVC-012'],
    heroDescription:
      'The complete health check for your wing. Every aspect that degrades over time — cloth, lines, trim, risers — tested, measured, and documented. You get a full digital report showing exactly what was found and what was fixed.',
    icon: 'Shield',
    processSteps: [
      {
        step: 1,
        title: 'Material reception & intake',
        description:
          'We log your equipment, confirm the serial number, note any concerns you have, and record the current state of the wing before work begins.',
        icon: 'ClipboardList',
      },
      {
        step: 2,
        title: 'Initial diagnostic',
        description:
          'A visual assessment of the canopy, lines, and risers to evaluate the overall condition and identify anything that needs closer attention.',
        icon: 'Search',
      },
      {
        step: 3,
        title: 'Cloth porosity testing',
        description:
          'We measure air permeability at multiple points across the canopy. Porosity indicates how well the fabric maintains internal pressure — critical for inflation and collapse resistance.',
        icon: 'Wind',
        critical: true,
      },
      {
        step: 4,
        title: 'Tear resistance testing (Bettsometer)',
        description:
          'A standardised test measuring how much force is needed to propagate a small cut in the fabric. Combined with porosity, this determines whether the cloth still has enough structural strength.',
        icon: 'Gauge',
        critical: true,
      },
      {
        step: 5,
        title: 'Line strength evaluation',
        description:
          "Individual lines are tested against the manufacturer's minimum breaking strain. Lines degrade from UV and abrasion — a line can look fine but have lost significant strength.",
        icon: 'Cable',
        critical: true,
      },
      {
        step: 6,
        title: 'Riser & hardware inspection',
        description:
          'We examine webbing for UV damage, check all stitching, test speed bar pulleys and Brummel hooks, inspect maillons for corrosion, and verify brake handle attachment.',
        icon: 'Link',
      },
      {
        step: 7,
        title: 'Lines tactile inspection',
        description:
          'Every line is checked by hand for fraying, stiffness, kinks, and sheath damage. We note any lines that need replacement and their positions.',
        icon: 'Hand',
      },
      {
        step: 8,
        title: 'Canopy inspection — outer surfaces',
        description:
          'Systematic inspection of the upper and lower outer surfaces, trailing edge, and leading edge. We flag any damaged cloth or stitching by location.',
        icon: 'Layers',
      },
      {
        step: 9,
        title: 'Canopy inspection — internal structure',
        description:
          'Ribs and diagonal walls are inspected for tears, delamination, and stitching failures. Internal damage is invisible from outside but affects cell structure.',
        icon: 'ScanSearch',
      },
      {
        step: 10,
        title: 'Trim measurement & correction',
        description:
          "Every line is measured with a laser system and compared against the manufacturer's trim chart. Deviations are corrected at the maillon connections to restore the original flight characteristics.",
        icon: 'Ruler',
      },
      {
        step: 11,
        title: 'Inflated check',
        description:
          'The wing is inflated to verify canopy shape, check for crossed lines, and assess overall behaviour. This confirms the bench work translates to proper wing geometry.',
        icon: 'CloudSun',
      },
      {
        step: 12,
        title: 'Flight test recommendation',
        description:
          'If corrections were significant, a flight test is recommended to verify in-air behaviour — speed range, brake response, and symmetry under load.',
        icon: 'Plane',
      },
    ],
    includes: [
      { label: 'Cloth porosity testing (multi-point)', included: true },
      { label: 'Tear resistance testing (Bettsometer)', included: true },
      { label: 'Line strength testing', included: true },
      { label: 'Full trim measurement & correction', included: true },
      { label: 'Riser & hardware inspection', included: true },
      { label: 'Complete canopy inspection', included: true },
      { label: 'Detailed digital service report', included: true },
      { label: 'Equipment Registry entry', included: true },
      { label: 'Reserve repack', included: false },
      { label: 'Harness inspection', included: false },
    ],
    images: [],
    relatedFAQIds: [
      'what-does-full-service-include',
      'how-often-service',
      'what-is-porosity-testing',
      'what-is-bettsometer',
      'what-is-line-strength-test',
      'what-does-digital-report-include',
    ],
  },
  {
    slug: 'trim',
    pageTitle: 'Trim & Line Service',
    metaTitle: 'Paraglider Trim & Line Service — Laser Measurement | paraMOT',
    metaDescription:
      'Precision laser trim measurement and correction for paragliders. We measure every line against manufacturer specs, detect asymmetries, and restore original flight characteristics.',
    keywords: [
      'paraglider trim service',
      'line trim measurement',
      'wing trim correction',
      'laser trim measurement paraglider',
      'Aramid line shrinkage',
    ],
    serviceCodes: ['SVC-001', 'SVC-002'],
    heroDescription:
      "Your wing's geometry is the single biggest factor in how it flies. We measure every line with a laser system, compare against manufacturer specs, and correct deviations so your glider handles the way it should.",
    icon: 'Zap',
    processSteps: [
      {
        step: 1,
        title: 'Trim measurement',
        description:
          "The wing is suspended and every line measured under controlled tension using a laser system. Each measurement is recorded digitally and compared against the manufacturer's trim chart to identify shrinkage, stretch, and asymmetries.",
        icon: 'Ruler',
      },
      {
        step: 2,
        title: 'Trim correction & adjustment',
        description:
          'Deviations are corrected at the maillon connections by adjusting the effective line length. All corrections are re-measured to verify accuracy. Before-and-after data is documented in your report.',
        icon: 'Wrench',
      },
      {
        step: 3,
        title: 'Inflated check & flight test',
        description:
          'The wing is inflated to verify shape, check for crossed lines, and assess behaviour. If corrections were significant, a flight test is recommended to confirm speed range, brake response, and symmetry.',
        icon: 'CloudSun',
      },
    ],
    includes: [
      { label: 'Full trim measurement (all lines)', included: true },
      { label: 'Trim correction at maillons', included: true },
      { label: 'Before/after comparison report', included: true },
      { label: 'Inflated check', included: true },
      { label: 'Equipment Registry entry', included: true },
      { label: 'Cloth porosity testing', included: false },
      { label: 'Tear resistance testing', included: false },
      { label: 'Line strength testing', included: false },
    ],
    images: [],
    relatedFAQIds: [
      'what-does-trim-service-include',
      'what-is-trim-measurement',
      'how-is-trim-measured',
      'how-are-corrections-made',
      'signs-of-wear',
    ],
    upgradeNote:
      'Need a complete health check? The Full Service includes everything in the Trim & Line service plus cloth testing, line strength analysis, and riser inspection.',
    upgradeSlug: 'full-service',
  },
  {
    slug: 'visual-check',
    pageTitle: 'Visual Check',
    metaTitle: 'Paraglider Visual Inspection — Pre-Purchase Check | paraMOT',
    metaDescription:
      'Quick visual health assessment for your paraglider. Canopy fabric inspection, line condition check, riser examination, and porosity overview. Ideal for pre-purchase checks.',
    keywords: [
      'paraglider visual inspection',
      'wing condition check',
      'pre-purchase paraglider inspection',
      'used paraglider check',
    ],
    serviceCodes: ['SVC-003', 'SVC-004'],
    heroDescription:
      "A quick health assessment for your wing. We inspect the canopy, lines, and risers to give you a clear picture of your equipment's condition — ideal if you're buying a used wing or want peace of mind before the season.",
    icon: 'Eye',
    processSteps: [
      {
        step: 1,
        title: 'Cloth evaluation',
        description:
          'Visual assessment of the canopy fabric for UV damage, wear, discolouration, and porosity concerns. We rate the cloth condition on a standardised 5-point scale from Excellent to Worn Out.',
        icon: 'Eye',
      },
      {
        step: 2,
        title: 'Porosity overview',
        description:
          'Basic porosity measurements at key points across the canopy to assess air permeability. This gives a quick indication of fabric health without the full multi-point testing of a Full Service.',
        icon: 'Wind',
      },
      {
        step: 3,
        title: 'Lines & riser inspection',
        description:
          'Visual and tactile inspection of the entire lineset for fraying, stiffness, and sheath damage. Risers checked for webbing condition, stitching integrity, and maillon corrosion.',
        icon: 'Cable',
      },
      {
        step: 4,
        title: 'Canopy inspection',
        description:
          'The canopy surfaces, trailing edge, leading edge, and internal structure are examined for tears, stitching failures, and structural issues.',
        icon: 'Layers',
      },
      {
        step: 5,
        title: 'Condition summary',
        description:
          "You receive a clear written summary of the wing's overall condition with recommendations — whether it's good to fly, needs further testing, or has issues that need attention.",
        icon: 'FileText',
      },
    ],
    includes: [
      { label: 'Visual cloth assessment', included: true },
      { label: 'Basic porosity check', included: true },
      { label: 'Lineset inspection', included: true },
      { label: 'Riser & hardware check', included: true },
      { label: 'Written condition report', included: true },
      { label: 'Equipment Registry entry', included: true },
      { label: 'Trim measurement', included: false },
      { label: 'Tear resistance testing', included: false },
      { label: 'Line strength testing', included: false },
    ],
    images: [
      {
        src: '/images/inspection.jpeg',
        alt: 'Skye is thoroughly inspecting the top surface of this BGD Magic',
        caption: 'Inspection of the top surface of a BGD Magic',
      },
    ],
    relatedFAQIds: [
      'what-does-visual-check-include',
      'signs-of-wear',
      'how-often-service',
      'buying-used-gear',
    ],
    upgradeNote:
      'Want the full picture? Upgrade to a Full Service for cloth testing, line strength analysis, and complete trim measurement.',
    upgradeSlug: 'full-service',
  },
  {
    slug: 'harness',
    pageTitle: 'Harness Inspection',
    metaTitle: 'Paraglider Harness Inspection — 20-Point Safety Check | paraMOT',
    metaDescription:
      'Thorough 20-point harness inspection covering buckles, straps, stitching, airbag, back protection, carabiners, and reserve deployment system. APPI methodology.',
    keywords: [
      'paraglider harness inspection',
      'harness safety check',
      'carabiner inspection',
      'airbag harness test',
    ],
    serviceCodes: ['SVC-031'],
    heroDescription:
      'Your harness takes constant UV exposure and load cycling — it deserves the same attention as your wing. Our 20-point inspection covers every structural and safety-critical component.',
    icon: 'Shield',
    processSteps: [
      {
        step: 1,
        title: 'Serial number & documentation',
        description:
          "We record the harness serial number, stated hours, and check the manufacturer's manual and safety notes for model-specific inspection requirements.",
        icon: 'ClipboardList',
      },
      {
        step: 2,
        title: 'Attachment points & structural strap',
        description:
          'The primary load-bearing attachment points and structural safety strap are inspected — these are what keep you connected to the wing.',
        icon: 'Link',
        critical: true,
      },
      {
        step: 3,
        title: 'Buckles & retention system',
        description:
          'Ventral buckles, leg buckles, shoulder straps, chest buckle, and all adjustments are tested for mechanism function and condition.',
        icon: 'Lock',
        critical: true,
      },
      {
        step: 4,
        title: 'Harness geometry & adjustments',
        description:
          'Lateral, depth, and extension adjustments are checked. Seat-board, housing, stirrup or foot plate, and adjustment straps are all inspected for wear and function.',
        icon: 'Move',
      },
      {
        step: 5,
        title: 'Speed system',
        description:
          'Accelerator mechanism, pulleys, and holding system are tested. A sticky or failed speed bar can compromise flight safety.',
        icon: 'Gauge',
      },
      {
        step: 6,
        title: 'Fabric & structure',
        description:
          'The back, seat, exterior, and interior fabric are inspected for UV degradation, abrasion, and tears. Includes the structural frame and housing.',
        icon: 'Layers',
      },
      {
        step: 7,
        title: 'Passive protection systems',
        description:
          'Airbag (fabric, stitching, zip, mylar sheet, rod) and foam protection (mousse-bag, zip, velcro, inner condition) are thoroughly checked.',
        icon: 'ShieldCheck',
      },
      {
        step: 8,
        title: 'Carabiners',
        description:
          'Main connection carabiners are inspected for hairline cracks, gate wear, corrosion, and proper lock function. These are your primary connection to the wing.',
        icon: 'Anchor',
        critical: true,
      },
      {
        step: 9,
        title: 'Reserve deployment system',
        description:
          'Reserve anchor points, quick links, risers, tunnel zips/velcro, handle extraction force (>2 daN), and full extraction force (<7 daN) are all tested.',
        icon: 'LifeBuoy',
        critical: true,
      },
      {
        step: 10,
        title: 'Simulator test',
        description:
          'The complete harness is tested in a simulator — adjustments, comfort, and function are verified through the full range from standing to seated position.',
        icon: 'User',
      },
    ],
    includes: [
      { label: '20-point structural inspection', included: true },
      { label: 'Buckle & strap testing', included: true },
      { label: 'Carabiner inspection', included: true },
      { label: 'Airbag & back protection check', included: true },
      { label: 'Reserve deployment force test', included: true },
      { label: 'Simulator function test', included: true },
      { label: 'Written inspection report', included: true },
      { label: 'Equipment Registry entry', included: true },
    ],
    images: [],
    relatedFAQIds: [
      'do-you-service-harnesses',
      'harness-inspection-what',
      'carabiner-inspection',
      'reserve-deployment',
    ],
  },
  {
    slug: 'reserve',
    pageTitle: 'Reserve Repack',
    metaTitle: 'Reserve Parachute Repack — APPI Procedure | paraMOT',
    metaDescription:
      'Professional 22-step reserve parachute repacking following APPI procedure. Includes deployment test, condition assessment, force testing, and reintegration into your harness.',
    keywords: [
      'reserve parachute repack',
      'paraglider reserve repack UK',
      'reserve deployment test',
      'steerable reserve repack',
    ],
    serviceCodes: ['PACK-001', 'PACK-002'],
    heroDescription:
      "A reserve that doesn't open quickly is a reserve that doesn't work. Our 22-step repack follows the APPI procedure — including deployment testing, condition assessment, and force verification.",
    icon: 'PackageCheck',
    processSteps: [
      {
        step: 1,
        title: 'Documentation & history',
        description:
          "We record the reserve serial number, stated age, and check the manufacturer's manual and safety notes for model-specific folding and packing requirements.",
        icon: 'ClipboardList',
      },
      {
        step: 2,
        title: 'Extraction test',
        description:
          'The reserve is deployed from the harness to test the extraction mechanism. Ideally performed by the owner so they experience the handle pull force.',
        icon: 'Rocket',
      },
      {
        step: 3,
        title: 'Deploy & inspect',
        description:
          'The reserve is fully deployed and left open for a minimum of 2 hours. This allows the fabric to relax from compression and enables thorough visual inspection of the canopy, lines, and connections.',
        icon: 'Clock',
      },
      {
        step: 4,
        title: 'Deployment mechanism check',
        description:
          'Pod, ribbon, and handle connections are inspected for strength and condition. Rubber bands are replaced. These components must work reliably under stress.',
        icon: 'Cog',
        critical: true,
      },
      {
        step: 5,
        title: 'Canopy & lines condition',
        description:
          'Cloth, stitching, and lines are checked for degradation. Line length differentials are measured versus the apex line. Steerable reserves get additional brake and locking system checks.',
        icon: 'Search',
        critical: true,
      },
      {
        step: 6,
        title: 'Critical safety check',
        description:
          'Reserve lines must be shorter than glider lines — otherwise the reserve tangles with the wing on deployment. This is verified before repacking.',
        icon: 'AlertTriangle',
        critical: true,
      },
      {
        step: 7,
        title: 'Fold & pack',
        description:
          "The reserve is folded according to the manufacturer's instructions manual. Closing bungee tension is adjusted, closing loop length verified, and the reserve is integrated into the container with pin.",
        icon: 'Package',
      },
      {
        step: 8,
        title: 'Harness reintegration',
        description:
          'Risers are connected to the harness, slack is verified (prevents premature deployment), bridle length checked, and the handle is positioned for accessibility.',
        icon: 'Link',
      },
      {
        step: 9,
        title: 'Force testing',
        description:
          'Handle extraction force must exceed 2 daN (accessible but not accidental). Full deployment force must be under 7 daN (deployable in an emergency). Both are measured and documented.',
        icon: 'Gauge',
        critical: true,
      },
      {
        step: 10,
        title: 'Final check & documentation',
        description:
          'The reserve is re-integrated into the container. Maintenance book is updated and signed. All folding cords and tools are counted out — nothing left inside.',
        icon: 'FileCheck',
      },
    ],
    includes: [
      { label: '22-step APPI repack procedure', included: true },
      { label: 'Extraction & deployment test', included: true },
      { label: 'Canopy & lines condition check', included: true },
      { label: 'Force testing (handle & extraction)', included: true },
      { label: 'Rubber band replacement', included: true },
      { label: 'Harness reintegration', included: true },
      { label: 'Maintenance book update', included: true },
      { label: 'Equipment Registry entry', included: true },
    ],
    images: [],
    relatedFAQIds: [
      'do-you-repack-reserves',
      'how-often-repack-reserve',
      'reserve-lifespan',
      'reserve-deployment',
      'steerable-vs-round',
    ],
  },
  {
    slug: 'repair',
    pageTitle: 'Glider Repair',
    metaTitle: 'Paraglider Repair — Canopy, Lines & Components | paraMOT',
    metaDescription:
      'Professional paraglider canopy repairs, line replacements, and component fixes. Send photos for a free assessment. APPI-certified workshop in South Wales.',
    keywords: [
      'paraglider canopy repair',
      'glider panel repair',
      'paraglider line replacement',
      'wing repair service UK',
    ],
    serviceCodes: ['REP-001'],
    heroDescription:
      "Canopy repairs, line replacements, and component fixes. Get in touch with photos of the damage and we'll assess what's needed and quote accordingly.",
    icon: 'Wrench',
    processSteps: [
      {
        step: 1,
        title: 'Initial diagnostic',
        description:
          "We assess the damage — either from photos you send or by inspecting the wing in person. This determines the scope of repair and whether it's economically viable.",
        icon: 'Search',
      },
      {
        step: 2,
        title: 'Quotation & approval',
        description:
          "You receive a clear quote detailing what needs to be done and the cost. Nothing happens without your approval. If repair isn't viable, we'll explain why.",
        icon: 'FileText',
      },
      {
        step: 3,
        title: 'Repair work',
        description:
          "Canopy repairs, panel replacements, line replacements, riser refurbishment, or brake handle replacements — depending on what's needed.",
        icon: 'Wrench',
      },
      {
        step: 4,
        title: 'Inflated check',
        description:
          "After repair, the wing is inflated to check canopy shape, wrinkles, and crossed lines. This verifies the repair hasn't affected the wing's geometry.",
        icon: 'CloudSun',
      },
      {
        step: 5,
        title: 'Flight test recommendation',
        description:
          "For major repairs, a flight test is recommended to verify in-air behaviour. Minor repairs (small panels, individual lines) typically don't require this.",
        icon: 'Plane',
      },
    ],
    includes: [
      { label: 'Free damage assessment', included: true },
      { label: 'Canopy panel repair', included: true },
      { label: 'Line replacement', included: true },
      { label: 'Riser refurbishment', included: true },
      { label: 'Brake handle replacement', included: true },
      { label: 'Post-repair inflated check', included: true },
      { label: 'Equipment Registry entry', included: true },
    ],
    images: [],
    relatedFAQIds: ['do-you-do-repairs', 'what-if-problem-found', 'signs-of-wear'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────

export function getServicePageBySlug(slug: string): ServicePageConfig | undefined {
  return SERVICE_PAGES.find((p) => p.slug === slug);
}

export function getAllServicePages(): ServicePageConfig[] {
  return SERVICE_PAGES;
}

export function getAllServicePageSlugs(): string[] {
  return SERVICE_PAGES.map((p) => p.slug);
}

export interface ServicePricingResult {
  solo?: number;
  tandem?: number;
  regular?: number;
  steerable?: number;
  available: boolean;
}

/** Reserve pack codes for regular/steerable distinction */
const RESERVE_CODES = new Set(['PACK-001', 'PACK-002']);

/** Pull pricing from services.json for a set of service codes */
export function getServicePricing(codes: ServiceCode[]): ServicePricingResult {
  const services = Object.values(rawServicesData) as Array<{
    code: string;
    cost: number | string;
    available: boolean;
    variant?: string;
  }>;

  let solo: number | undefined;
  let tandem: number | undefined;
  let regular: number | undefined;
  let steerable: number | undefined;
  let available = false;

  const isReservePack = codes.some((c) => RESERVE_CODES.has(c));

  for (const code of codes) {
    const svc = services.find((s) => s.code === code);

    if (!svc) continue;
    if (svc.available) available = true;
    if (typeof svc.cost !== 'number') continue;

    if (isReservePack) {
      // PACK-001 = regular, PACK-002 = steerable
      if (code === 'PACK-002') {
        steerable = svc.cost;
      } else {
        regular = svc.cost;
      }
    } else if (svc.variant === 'tandem') {
      tandem = svc.cost;
    } else {
      solo = svc.cost;
    }
  }

  return { solo, tandem, regular, steerable, available };
}
