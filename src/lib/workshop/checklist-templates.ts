/**
 * Checklist templates from APPI workflow specification.
 * These define the steps loaded into ServiceChecklist when a session is created.
 */

interface ChecklistStep {
  serviceType: string;
  stepNumber: number;
  description: string;
}

// =============================================================================
// GLIDER: Service type checklists (selected at intake)
// =============================================================================

const STRENGTH_CHECK: ChecklistStep[] = [
  {
    serviceType: 'strength_check',
    stepNumber: 1,
    description:
      'Destructive (assessment of % remaining useful strength) OR Non-destructive (airworthiness assessment)',
  },
  {
    serviceType: 'strength_check',
    stepNumber: 2,
    description: 'Trim control and adjustment (of the group)',
  },
];

const TRIM_CONTROL: ChecklistStep[] = [
  {
    serviceType: 'trim_control',
    stepNumber: 1,
    description: 'Trim control and adjustment',
  },
  {
    serviceType: 'trim_control',
    stepNumber: 2,
    description: 'Inflated check (shape, crossed lines, behaviour)',
  },
  { serviceType: 'trim_control', stepNumber: 3, description: 'Flight test recommended' },
];

const CANOPY_REPAIR: ChecklistStep[] = [
  {
    serviceType: 'canopy_repair',
    stepNumber: 1,
    description: "According to the operator's decision: glider's initial diagnostic",
  },
  {
    serviceType: 'canopy_repair',
    stepNumber: 2,
    description: 'Quotation accepted by customer',
  },
  { serviceType: 'canopy_repair', stepNumber: 3, description: 'Canopy repair' },
  {
    serviceType: 'canopy_repair',
    stepNumber: 4,
    description: 'Inflated check (behaviour, canopy shape, wrinkles, crossed lines)',
  },
  {
    serviceType: 'canopy_repair',
    stepNumber: 5,
    description: 'In case of massive repair, flight test recommended',
  },
];

const LINESET_REPLACEMENT: ChecklistStep[] = [
  {
    serviceType: 'lineset_replacement',
    stepNumber: 1,
    description: 'Replacement lines conformity check (length, strength)',
  },
  {
    serviceType: 'lineset_replacement',
    stepNumber: 2,
    description: 'Risers inspection (quick links)',
  },
  {
    serviceType: 'lineset_replacement',
    stepNumber: 3,
    description: "Glider's attachment points",
  },
  {
    serviceType: 'lineset_replacement',
    stepNumber: 4,
    description: 'Lineset replacement',
  },
  {
    serviceType: 'lineset_replacement',
    stepNumber: 5,
    description: 'Trim control and adjustment',
  },
  {
    serviceType: 'lineset_replacement',
    stepNumber: 6,
    description: 'Inflated check (shape, crossed lines, behaviour)',
  },
  {
    serviceType: 'lineset_replacement',
    stepNumber: 7,
    description: 'Flight test recommended',
  },
];

const PARTIAL_REPLACEMENT: ChecklistStep[] = [
  {
    serviceType: 'partial_replacement',
    stepNumber: 1,
    description: 'Replacement lines conformity check (length, strength)',
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 2,
    description: "According to the operator's decision: risers inspection (quick links)",
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 3,
    description: 'Lines tactile inspection',
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 4,
    description: "Glider's attachment points",
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 5,
    description: 'Line(s) replacement',
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 6,
    description: 'Partial or total trim control, except if only steering lines',
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 7,
    description: 'Inflated check (shape, crossed lines, behaviour)',
  },
  {
    serviceType: 'partial_replacement',
    stepNumber: 8,
    description: 'If significant number of lines replaced, flight test recommended',
  },
];

const FLIGHT_TEST: ChecklistStep[] = [
  {
    serviceType: 'flight_test',
    stepNumber: 1,
    description: "Complete preflight (riser's quick links, speed system)",
  },
  {
    serviceType: 'flight_test',
    stepNumber: 2,
    description: 'Inflated check (shape, crossed lines, behaviour)',
  },
  { serviceType: 'flight_test', stepNumber: 3, description: 'Inflate behaviour' },
  { serviceType: 'flight_test', stepNumber: 4, description: 'Take off behaviour' },
  {
    serviceType: 'flight_test',
    stepNumber: 5,
    description: 'Lines tension symmetry in flight',
  },
  {
    serviceType: 'flight_test',
    stepNumber: 6,
    description: 'Steering lines length adjustment',
  },
  { serviceType: 'flight_test', stepNumber: 7, description: 'Speed range assessment' },
  {
    serviceType: 'flight_test',
    stepNumber: 8,
    description: 'Steering lines tension (increasing as we pull)',
  },
  {
    serviceType: 'flight_test',
    stepNumber: 9,
    description:
      'Steering lines travel (according to max total flying weight and EN class)',
  },
  {
    serviceType: 'flight_test',
    stepNumber: 10,
    description: 'Big ears (if applies — see manual)',
  },
  { serviceType: 'flight_test', stepNumber: 11, description: 'Big incidence angle' },
  {
    serviceType: 'flight_test',
    stepNumber: 12,
    description: 'Flare and final braking efficiency',
  },
];

// Initial diagnostic — always loaded for gliders
// Ordered: structural safety first, then fabric/cosmetic
const INITIAL_DIAGNOSTIC: ChecklistStep[] = [
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 1,
    description: "Glider's attachment points",
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 2,
    description: 'Risers inspection (quick links)',
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 3,
    description: 'Lines strength evaluation (non-destructive or destructive)',
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 4,
    description: 'Lines tactile inspection',
  },
  { serviceType: 'initial_diagnostic', stepNumber: 5, description: 'Cloth evaluation' },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 6,
    description:
      "According to the operator's decision: cloth tear resistance (Bettsometer)",
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 7,
    description:
      'Outer canopy cloth & stitching: lower and upper outer surface, training edge, leading edge',
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 8,
    description: 'Inner canopy cloth & stitching: ribs and diagonals',
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 9,
    description:
      "According to the operator's decision: Basic trim evaluation (differential A-B, A-Rear, 1 rib per group)",
  },
  {
    serviceType: 'initial_diagnostic',
    stepNumber: 10,
    description: 'Inflated check (shape, crossed lines, behaviour)',
  },
];

// APPI airworthiness check — always loaded for gliders
// Ordered: manual/structural first, then fabric, then operational
const APPI_AIRWORTHINESS: ChecklistStep[] = [
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 1,
    description: "Glider's manual, maintenance book (if exists)",
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 2,
    description: "Glider's attachment points",
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 3,
    description: 'Risers inspection (quick links)',
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 4,
    description: 'Lines strength evaluation (non-destructive or destructive)',
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 5,
    description: 'Lines tactile inspection',
  },
  { serviceType: 'appi_airworthiness', stepNumber: 6, description: 'Cloth evaluation' },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 7,
    description:
      "According to the operator's decision: cloth tear resistance (Bettsometer)",
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 8,
    description:
      'Outer canopy cloth & stitching: lower and upper outer surface, training edge, leading edge',
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 9,
    description: 'Inner canopy cloth & stitching: ribs and diagonals',
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 10,
    description: 'Trim control and adjustment',
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 11,
    description: 'Inflated check (shape, crossed lines, behaviour)',
  },
  {
    serviceType: 'appi_airworthiness',
    stepNumber: 12,
    description: 'Flight test recommended',
  },
];

const GLIDER_SERVICE_TYPE_MAP: Record<string, ChecklistStep[]> = {
  strength_check: STRENGTH_CHECK,
  trim_control: TRIM_CONTROL,
  canopy_repair: CANOPY_REPAIR,
  lineset_replacement: LINESET_REPLACEMENT,
  partial_replacement: PARTIAL_REPLACEMENT,
  flight_test: FLIGHT_TEST,
};

// =============================================================================
// RESERVE: 22-step repack workflow
// =============================================================================

const RESERVE_CHECKLIST: ChecklistStep[] = [
  { serviceType: 'reserve_repack', stepNumber: 1, description: 'Serial number' },
  { serviceType: 'reserve_repack', stepNumber: 2, description: 'Stated use (years)' },
  {
    serviceType: 'reserve_repack',
    stepNumber: 3,
    description: 'Check manual and safety notes',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 4,
    description: 'Extraction test (ideally made by the owner)',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 5,
    description: 'Deploy and let reserve open 2 hours minimum',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 6,
    description: 'Pod, ribbon, handle connection & strength',
  },
  { serviceType: 'reserve_repack', stepNumber: 7, description: 'Rubber bands change' },
  {
    serviceType: 'reserve_repack',
    stepNumber: 8,
    description: 'Reserve-risers connection secured',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 9,
    description:
      'Cloth, stitchings, lines check. Length differential lines vs apex line. Steerable reserve: brakes, low speed locking system',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 10,
    description: "Reserve lines length < glider's length",
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 11,
    description: 'Fold as per instructions manual',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 12,
    description: 'Closing bungee check, tension adjustment',
  },
  { serviceType: 'reserve_repack', stepNumber: 13, description: 'Closing loop length' },
  {
    serviceType: 'reserve_repack',
    stepNumber: 14,
    description: 'Risers-harness connection secured',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 15,
    description: 'Slack in long enough to prevent premature liberation',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 16,
    description: 'Integration in container & pin',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 17,
    description: 'Bridle length, handle in place',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 18,
    description: 'Reserve handle pull > 2 daN',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 19,
    description: 'Extraction test < 7 daN',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 20,
    description: 'Re-integrate in container',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 21,
    description: 'Reserve maintenance book update & sign',
  },
  {
    serviceType: 'reserve_repack',
    stepNumber: 22,
    description: 'Count & store folding cord and all tools',
  },
];

// =============================================================================
// HARNESS: 20-step inspection
// =============================================================================

const HARNESS_CHECKLIST: ChecklistStep[] = [
  { serviceType: 'harness_check', stepNumber: 1, description: 'Serial number' },
  { serviceType: 'harness_check', stepNumber: 2, description: 'Stated use (hours)' },
  {
    serviceType: 'harness_check',
    stepNumber: 3,
    description: 'Check manual and safety notes',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 4,
    description: 'Attachment points and structural safety strap',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 5,
    description: 'Ventral & legs buckles',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 6,
    description: 'Shoulder straps & adjustments & chest buckle',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 7,
    description: 'Adjustments: lateral, depth, extension',
  },
  { serviceType: 'harness_check', stepNumber: 8, description: 'Seat-board and housing' },
  {
    serviceType: 'harness_check',
    stepNumber: 9,
    description: 'Stirrup or foot plate and adjustment straps',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 10,
    description: 'Speed: Accelerator, pulleys, holding system',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 11,
    description: 'Fabric: back, seat, ext int',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 12,
    description: 'Airbag: fabric, stitching, zip, mylar sheet, rod',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 13,
    description: 'Mousse-bag, zip, velcro, inner damage',
  },
  { serviceType: 'harness_check', stepNumber: 14, description: 'Karabiners' },
  {
    serviceType: 'harness_check',
    stepNumber: 15,
    description: 'Reserve anchor points, quick links',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 16,
    description: 'Reserve risers, tunnel zips or velcro',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 17,
    description: 'Reserve handle extraction >2 daN and reserve <7 daN',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 18,
    description: 'Reserve: pod-handle strength (70 daN)',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 19,
    description: 'Reversible: backpack function & buckles',
  },
  {
    serviceType: 'harness_check',
    stepNumber: 20,
    description: 'Simulator test: adjustments, comfort & function (stand up → seated)',
  },
];

// =============================================================================
// PUBLIC API
// =============================================================================

export function getChecklistSteps(
  equipmentType: 'GLIDER' | 'RESERVE' | 'HARNESS',
  serviceTypes: string[],
): ChecklistStep[] {
  switch (equipmentType) {
    case 'GLIDER': {
      // Always include initial diagnostic and APPI airworthiness
      const steps = [...INITIAL_DIAGNOSTIC, ...APPI_AIRWORTHINESS];

      // Add steps for each selected service type
      for (const st of serviceTypes) {
        const template = GLIDER_SERVICE_TYPE_MAP[st];

        if (template) {
          steps.push(...template);
        }
      }

      return steps;
    }
    case 'RESERVE':
      return [...RESERVE_CHECKLIST];
    case 'HARNESS':
      return [...HARNESS_CHECKLIST];
  }
}
