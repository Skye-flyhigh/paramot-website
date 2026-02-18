'use client';

import { useCustomer } from '@/contexts/CustomerContext';
import { AlertCircle, Bell, ChevronRight, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

type NotificationType = 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

const typeStyles: Record<NotificationType, { bg: string; border: string; icon: string }> =
  {
    error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500' },
    warning: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-500' },
    info: { bg: 'bg-sky-50', border: 'border-sky-200', icon: 'text-sky-500' },
  };

/**
 * Collect all notifications based on customer data
 */
function useNotifications(): Notification[] {
  const customer = useCustomer();
  const notifications: Notification[] = [];

  // Missing address
  if (!customer.address) {
    notifications.push({
      id: 'missing-address',
      type: 'warning',
      title: 'Address missing',
      description: 'Add your address for equipment delivery',
      action: { label: 'Add address', href: '/dashboard/settings' },
    });
  }

  if (!customer.phone) {
    notifications.push({
      id: 'missing-phone',
      type: 'warning',
      title: 'Phone number missing',
      description: 'Add your phone number for contact',
      action: { label: 'Add phone', href: '/dashboard/settings' },
    });
  }

  // TODO: Future: Add service reminders here
  // TODO: Future: Add payment notifications here

  return notifications;
}

export default function Notifications() {
  const notifications = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-sky-600" />
        <h2 className="text-lg font-semibold text-sky-900">
          Action Needed ({notifications.length})
        </h2>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const styles = typeStyles[notification.type];

          return (
            <div
              key={notification.id}
              className={`flex items-center justify-between p-3 rounded-lg ${styles.bg} border ${styles.border}`}
            >
              <div className="flex items-center gap-3">
                {notification.id === 'missing-address' ? (
                  <MapPin className={`w-5 h-5 ${styles.icon}`} />
                ) : notification.id === 'missing-phone' ? (
                  <Phone className={`w-5 h-5 ${styles.icon}`} />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${styles.icon}`} />
                )}
                <div>
                  <p className="font-medium text-sky-900">{notification.title}</p>
                  {notification.description && (
                    <p className="text-sm text-sky-600">{notification.description}</p>
                  )}
                </div>
              </div>

              {notification.action && (
                <Link
                  href={notification.action.href}
                  className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-800"
                >
                  {notification.action.label}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
