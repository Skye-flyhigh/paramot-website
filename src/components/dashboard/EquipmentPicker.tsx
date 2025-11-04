'use client';

import { Equipment, EquipmentType } from '@/lib/schema';
import { LoaderCircle, X } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import submitEquipmentForm from '@/lib/submit/submitEquipmentForm';
import { Button } from '../ui/button';

interface EquipmentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onEquipmentSelected: (equipment: Equipment) => void; // Callback when equipment chosen
}

export interface EquipmentPickerFormState {
  formData: EquipmentPickerData;
  errors: Record<string, string>;
  success: boolean;
}

export interface EquipmentPickerData {
  type: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  serialNumber?: string;
}

export function EquipmentPicker({
  isOpen,
  onClose,
  equipmentList,
  onEquipmentSelected,
}: EquipmentPickerProps) {
  const [isNew, setIsNew] = useState<boolean>(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');

  // Form logic
  const initialFormData: EquipmentPickerData = {
    type: 'glider',
    manufacturer: '',
    model: '',
    size: '',
    serialNumber: '',
  };

  const initialState: EquipmentPickerFormState = {
    formData: initialFormData,
    errors: {},
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    submitEquipmentForm,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      const newEquipment: Equipment = {
        id: `temp-${Date.now()}`, // Unique temporary ID
        manufacturer: state.formData.manufacturer,
        model: state.formData.model,
        size: state.formData.size,
        type: state.formData.type,
        serialNumber: state.formData.serialNumber || `temp-${Date.now()}`,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onEquipmentSelected(newEquipment);
    }
  }, [state.success, state.formData, onEquipmentSelected]);

  // Make sure that the modal is closed
  if (!isOpen) return null;

  // Handle selection change from dropdown
  function handleSelectChange(value: string) {
    if (value === 'new') {
      setIsNew(true);
      setSelectedEquipmentId('new'); // Set to "new" instead of empty
    } else {
      setIsNew(false);
      setSelectedEquipmentId(value);
    }
  }

  // Handle "Continue" button for existing equipment
  function handleContinue() {
    const equipment = equipmentList.find((eq) => eq.id === selectedEquipmentId);
    if (equipment) {
      onEquipmentSelected(equipment);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <dialog
        open={isOpen}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto m-0"
      >
        <form method="dialog" action={formAction} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Choose Equipment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal main */}
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="font-medium text-gray-900">Select Equipment</h2>
            <select // FIXME: at the opening of the modal, the first option selected isn't loaded as equipment and there for the button is disabled. Load the first equipement too
              onChange={(e) => handleSelectChange(e.target.value)}
              value={isNew ? 'new' : selectedEquipmentId || equipmentList[0]?.id}
              className="mt-2 h-10 w-full bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700"
            >
              {equipmentList.length > 0
                ? equipmentList.map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.manufacturer} {equipment.model} {equipment.size} (
                      {equipment.serialNumber})
                    </option>
                  ))
                : null}
              <option value="new" key="new">
                + Add New Equipment
              </option>
            </select>
          </div>
          {isNew && (
            <div className="px-6 h-fit">
              {/* Success Message */}
              {state.success && (
                <Alert variant="success">
                  <AlertDescription>
                    Thank you! Your equipment has been added successfully.
                  </AlertDescription>
                </Alert>
              )}

              {/* General Error */}
              {state.errors.general && (
                <Alert variant="error">
                  <AlertDescription>{state.errors.general}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm my-5">
                <label className="text-gray-600">
                  Equipment type:
                  <select
                    name="type"
                    id="type"
                    className="mt-2 h-10 w-full block bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700"
                  >
                    <option selected value="glider">
                      Paraglider
                    </option>
                    <option value="harness">Harness</option>
                    <option value="reserve">Reserve</option>
                  </select>
                </label>
                <label className="text-gray-600">
                  Manufacturer:
                  <input
                    type="text"
                    name="manufacturer"
                    required
                    className={
                      'mt-2 h-10 w-full block bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 ' +
                      (state.errors.manufacturer
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : '')
                    }
                    defaultValue={state.formData.manufacturer}
                  />
                  {state.errors.manufacturer && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {state.errors.manufacturer}
                    </span>
                  )}
                </label>
                <label className="text-gray-600">
                  Model:
                  <input
                    type="text"
                    name="model"
                    required
                    className={
                      'mt-2 h-10 w-full block bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 ' +
                      (state.errors.model
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : '')
                    }
                    defaultValue={state.formData.model}
                  />
                  {state.errors.model && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {state.errors.model}
                    </span>
                  )}
                </label>
                <label className="text-gray-600">
                  Size:
                  <input
                    type="text"
                    name="size"
                    required
                    className={
                      'mt-2 h-10 w-full block bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 ' +
                      (state.errors.size
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : '')
                    }
                    defaultValue={state.formData.size}
                  />
                  {state.errors.size && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {state.errors.size}
                    </span>
                  )}
                </label>
                <label className="text-gray-600">
                  Serial Number:
                  <input
                    type="text"
                    name="serialNumber"
                    required
                    className={
                      'mt-2 h-10 w-full block bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 ' +
                      (state.errors.serialNumber
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : '')
                    }
                    defaultValue={state.formData.serialNumber}
                  />
                  {state.errors.serialNumber && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {state.errors.serialNumber}
                    </span>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              type={isNew ? 'submit' : 'button'}
              onClick={isNew ? undefined : handleContinue}
              variant="default"
              disabled={
                isPending ||
                (!isNew && (!selectedEquipmentId || selectedEquipmentId === 'new'))
              }
            >
              {isPending ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : isNew ? (
                'Add Equipment'
              ) : (
                'Continue to Booking'
              )}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
