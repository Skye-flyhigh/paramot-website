'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { Session } from 'next-auth';
import {
  Wrench,
  Shield,
  Zap,
  PackageCheck,
  Cog,
  type LucideIcon,
  AlertCircle,
} from 'lucide-react';
import { ServicesType } from '@/lib/schema';

interface ServiceCardProps {
  service: ServicesType;
  pricing: number | string;
  session: Session | null;
}

// When adding new icon in the services.json, they need to be added in the iconMap too.
const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Shield,
  Zap,
  PackageCheck,
  Cog,
};

export function ServiceCard({ service, pricing, session }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Cog;

  const handleCardClick = () => {
    if (!session) {
      window.location.href = '/login';
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <Card
      onClick={!service.available ? undefined : handleCardClick}
      className={`bg-white border-sky-100 hover:border-sky-200 ${
        service.available
          ? 'cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl'
          : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner relative">
          <Icon className="w-8 h-8 text-sky-600" />
          {!service.available && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold text-sky-900">{service.title}</CardTitle>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono text-sky-500 bg-sky-50 px-2 py-1 rounded-full">
            {service.code}
          </span>
          {!service.available && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        <div className="flex items-center justify-center">
          {typeof pricing === 'number' ? (
            <span className="text-lg font-bold text-sky-900">£{pricing}</span>
          ) : (
            <span className="text-lg font-bold text-sky-900">{pricing}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sky-700 leading-relaxed text-center">
          {service.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
