import {
  AlertCircle,
  Cog,
  Eye,
  PackageCheck,
  Shield,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

import type { ServicesType } from '@/lib/schema';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ServiceCardProps {
  service: ServicesType;
}

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Shield,
  Zap,
  PackageCheck,
  Cog,
  Eye,
};

/** Map service codes to their detail page slugs */
const codeToSlug: Record<string, string> = {
  'SVC-001': 'trim',
  'SVC-002': 'trim',
  'SVC-003': 'visual-check',
  'SVC-004': 'visual-check',
  'SVC-011': 'full-service',
  'SVC-012': 'full-service',
  'SVC-031': 'harness',
  'PACK-001': 'reserve',
  'PACK-002': 'reserve',
  'REP-001': 'repair',
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Cog;
  const slug = codeToSlug[service.code];

  return (
    <Card className={`bg-white border-sky-100 ${service.available ? '' : 'opacity-60'}`}>
      <CardHeader className="text-center">
        <div className="w-14 h-14 bg-linear-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner relative">
          <Icon className="w-7 h-7 text-sky-600" />
          {!service.available && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-bold text-sky-900">{service.title}</CardTitle>
        <div className="flex items-center justify-center gap-2">
          {!service.available && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        <div className="flex items-center justify-center">
          {typeof service.cost === 'number' ? (
            <span className="text-lg font-bold text-sky-900">£{service.cost}</span>
          ) : (
            <span className="text-lg font-bold text-sky-900">{service.cost}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-sky-700 leading-relaxed mb-3">
          {service.description}
        </CardDescription>
        {slug ? (
          <Link
            href={`/services/${slug}`}
            className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
          >
            Learn more &rarr;
          </Link>
        ) : service.available ? (
          <a
            href="#contact"
            className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
          >
            Get in touch &rarr;
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
