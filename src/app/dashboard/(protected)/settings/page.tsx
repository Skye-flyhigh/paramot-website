'use client';

import { Settings, User, Mail, Phone, MapPin } from 'lucide-react';

import { useCustomer } from '@/contexts/CustomerContext';

export default function SettingsPage() {
  const customer = useCustomer();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-sky-900">Settings</h1>
        <p className="text-sky-600 mt-1">Manage your account and preferences</p>
      </header>

      {/* Profile Section */}
      <section className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl font-semibold text-sky-900">Profile</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-sky-500">First Name</label>
            <p className="text-sky-900 font-medium">{customer.firstName}</p>
          </div>
          <div>
            <label className="text-sm text-sky-500">Last Name</label>
            <p className="text-sky-900 font-medium">{customer.lastName}</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl font-semibold text-sky-900">Contact Information</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-sky-400 mt-1" />
            <div>
              <label className="text-sm text-sky-500">Email</label>
              <p className="text-sky-900">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-sky-400 mt-1" />
            <div>
              <label className="text-sm text-sky-500">Phone</label>
              <p className="text-sky-900">{customer.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl font-semibold text-sky-900">Address</h2>
        </div>

        {customer.address ? (
          <div className="text-sky-900">
            <p>{customer.address.line1}</p>
            {customer.address.line2 && <p>{customer.address.line2}</p>}
            <p>
              {customer.address.city}, {customer.address.county}{' '}
              {customer.address.postcode}
            </p>
            <p>{customer.address.country}</p>
          </div>
        ) : (
          <p className="text-sky-500">No address on file</p>
        )}
      </section>

      {/* Communication Preferences */}
      <section className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl font-semibold text-sky-900">
            Communication Preferences
          </h2>
        </div>

        {customer.communicationPreferences ? (
          <div className="grid gap-3">
            <div className="flex items-center justify-between py-2 border-b border-sky-100">
              <span className="text-sky-700">Email notifications</span>
              <span
                className={`text-sm ${customer.communicationPreferences.emailNotifications ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.emailNotifications
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sky-100">
              <span className="text-sky-700">SMS notifications</span>
              <span
                className={`text-sm ${customer.communicationPreferences.smsNotifications ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.smsNotifications
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sky-700">Marketing emails</span>
              <span
                className={`text-sm ${customer.communicationPreferences.marketingEmails ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.marketingEmails
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sky-500">No preferences set</p>
        )}
      </section>
    </div>
  );
}
