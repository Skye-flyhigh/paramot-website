"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Equipment } from "@/lib/schema";
import { ServiceRecords } from "@/lib/schema";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "modify";
  equipment: Equipment;
  existingBooking?: ServiceRecords;
}

interface BookingFormData {
  serviceType: string;
  preferredDate: string;
  deliveryMethod: string;
  specialInstructions: string;
  contactMethod: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  mode,
  equipment,
  existingBooking,
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: existingBooking?.service || "",
    preferredDate: "",
    deliveryMethod: "drop-off",
    specialInstructions: "",
    contactMethod: "email",
  });

  const serviceTypes = [
    {
      value: "SVC-001",
      label: "Full Service (£150)",
      description: "Complete inspection and maintenance",
    },
    {
      value: "TRIM-001",
      label: "Trim Only (£120)",
      description: "Line check and adjustments",
    },
    {
      value: "PACK-001",
      label: "Pack Check (£65)",
      description: "Packing inspection only",
    },
    {
      value: "REP-001",
      label: "Repair Work",
      description: "Contact us for quote",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Booking request:", { equipment, formData, mode });
    onClose();
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Request Service" : "Modify Booking"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Equipment Context */}
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="font-medium text-gray-900 mb-2">Equipment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Model:</span>
              <span className="ml-2 font-medium">
                {equipment.manufacturer} {equipment.model} {equipment.size}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Serial:</span>
              <span className="ml-2 font-medium">{equipment.serialNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{equipment.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium capitalize">{equipment.status}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Type
            </label>
            <div className="space-y-3">
              {serviceTypes.map((service) => (
                <label
                  key={service.value}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={service.value}
                    checked={formData.serviceType === service.value}
                    onChange={(e) =>
                      handleInputChange("serviceType", e.target.value)
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {service.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) =>
                handleInputChange("preferredDate", e.target.value)
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Method
            </label>
            <select
              value={formData.deliveryMethod}
              onChange={(e) =>
                handleInputChange("deliveryMethod", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="drop-off">Drop off in person</option>
              <option value="pickup">Collection service</option>
              <option value="post">Post/Courier</option>
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) =>
                handleInputChange("specialInstructions", e.target.value)
              }
              rows={3}
              placeholder="Any specific concerns, damage, or requirements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </label>
            <select
              value={formData.contactMethod}
              onChange={(e) =>
                handleInputChange("contactMethod", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone call</option>
              <option value="text">Text message</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              {mode === "create" ? "Submit Request" : "Update Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
