'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardCheck,
  Eye,
  TestTube,
  Zap,
  Ruler,
  Wrench,
  FileText,
} from 'lucide-react';

import type { EquipmentType } from '@/generated/prisma';

interface Step {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const GLIDER_STEPS: Step[] = [
  { label: 'Intake', path: 'intake', icon: <Eye className="h-4 w-4" /> },
  { label: 'Cloth', path: 'cloth', icon: <TestTube className="h-4 w-4" /> },
  { label: 'Strength', path: 'strength', icon: <Zap className="h-4 w-4" /> },
  { label: 'Trim', path: 'trim', icon: <Ruler className="h-4 w-4" /> },
  { label: 'Correct', path: 'correct', icon: <Wrench className="h-4 w-4" /> },
  { label: 'Report', path: 'report', icon: <FileText className="h-4 w-4" /> },
];

const RESERVE_STEPS: Step[] = [
  { label: 'Intake', path: 'intake', icon: <Eye className="h-4 w-4" /> },
  { label: 'Repack', path: 'checklist', icon: <ClipboardCheck className="h-4 w-4" /> },
  { label: 'Report', path: 'report', icon: <FileText className="h-4 w-4" /> },
];

const HARNESS_STEPS: Step[] = [
  { label: 'Intake', path: 'intake', icon: <Eye className="h-4 w-4" /> },
  {
    label: 'Inspection',
    path: 'checklist',
    icon: <ClipboardCheck className="h-4 w-4" />,
  },
  { label: 'Report', path: 'report', icon: <FileText className="h-4 w-4" /> },
];

function getSteps(equipmentType: EquipmentType): Step[] {
  switch (equipmentType) {
    case 'GLIDER':
      return GLIDER_STEPS;
    case 'RESERVE':
      return RESERVE_STEPS;
    case 'HARNESS':
      return HARNESS_STEPS;
  }
}

interface StepNavigationProps {
  sessionId: string;
  equipmentType: EquipmentType;
}

export default function StepNavigation({
  sessionId,
  equipmentType,
}: StepNavigationProps) {
  const pathname = usePathname();
  const steps = getSteps(equipmentType);
  const basePath = `/workshop/session/${sessionId}`;

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href={basePath}
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          pathname === basePath
            ? 'bg-zinc-900 text-white'
            : 'text-zinc-600 hover:bg-zinc-100'
        }`}
      >
        Overview
      </Link>
      {steps.map((step) => {
        const href = `${basePath}/${step.path}`;
        const isActive = pathname === href;

        return (
          <Link
            key={step.path}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              isActive ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {step.icon}
            {step.label}
          </Link>
        );
      })}
    </nav>
  );
}
