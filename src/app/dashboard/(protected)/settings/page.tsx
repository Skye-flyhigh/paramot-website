'use client';

import { Mail, MapPin, Phone, Plus, Settings, User } from 'lucide-react';

import SettingsForm from '@/components/dashboard/SettingsForm';
import { Button } from '@/components/ui/button';
import XButton from '@/components/ui/x-button';
import { useCustomer } from '@/contexts/CustomerContext';
import { useState } from 'react';

export default function SettingsPage() {
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false);
  const customer = useCustomer();

  return (
    <div>
      <header className="mb-6 flex items-center justify-between ">
        <div className="">
          <h1 className="text-3xl font-bold text-sky-900">Settings</h1>
          <p className="text-sky-600 mt-1">Manage your account and preferences</p>
        </div>
        <Button onClick={() => setOpenSettingsModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Update Contact details
        </Button>
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
            <p>{customer.address.street}</p>
            <p>
              {customer.address.city}
              {customer.address.county && `, ${customer.address.county}`}{' '}
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
              <span className="text-sky-700">Email</span>
              <span
                className={`text-sm ${customer.communicationPreferences.email ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.email ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sky-100">
              <span className="text-sky-700">Phone</span>
              <span
                className={`text-sm ${customer.communicationPreferences.phone ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.phone ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sky-100">
              <span className="text-sky-700">Text/SMS</span>
              <span
                className={`text-sm ${customer.communicationPreferences.text ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.text ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sky-700">Marketing</span>
              <span
                className={`text-sm ${customer.communicationPreferences.marketing ? 'text-green-600' : 'text-sky-400'}`}
              >
                {customer.communicationPreferences.marketing ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sky-500">No preferences set</p>
        )}
      </section>

      {openSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <dialog
            open={openSettingsModal}
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-0"
          >
            <header className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Update Contact Details</h2>
              <XButton onClose={() => setOpenSettingsModal(false)} />
            </header>
            <div className="p-6">
              <SettingsForm onClose={() => setOpenSettingsModal(false)} />
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
}
