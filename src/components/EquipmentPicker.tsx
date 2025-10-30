"use client";

import { Equipment } from "@/lib/schema";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EquipmentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Record<string, Equipment>;
}

export function EquipmentPicker({
  isOpen,
  onClose,
  equipmentList,
}: EquipmentPickerProps) {
  const [isNew, setIsNew] = useState<boolean>(false);

  if (!isOpen) return null;

  if (Object.keys(equipmentList).length === 0) setIsNew(true);

  return (
    <dialog open={isOpen}>
      <form method="dialog">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Choose Equipment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <h2>Select Equipment</h2>
        {/* Equipment selection logic goes here */}
        <select>
          {Object.entries(equipmentList).length > 0 &&
            Object.entries(equipmentList).map(([id, equipment]) => (
              <option key={id} value={id}>
                {equipment.manufacturer} {equipment.model} {equipment.size} (
                {equipment.serialNumber})
              </option>
            ))}
          <option value="new">+ Add New Equipment</option>
              </select>

              {isNew && (
                <div>
                  <label>
                    Manufacturer:
                    <input type="text" name="manufacturer" required />
                  </label>
                  <label>
                    Model:
                    <input type="text" name="model" required />
                  </label>
                  <label>
                    Size:
                    <input type="text" name="size" required />
                  </label>
                  <label>
                    Serial Number:
                    <input type="text" name="serialNumber" />
                  </label>
                </div>
              )}

              {/* Action Buttons */}

              <div className="flex justify-end p-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  {isNew ? "Add Equipment" : "Update Equipment"}
                </button>
              </div>

      </form>
    </dialog>
  );
}
