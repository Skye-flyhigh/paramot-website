'use client';

import { LoaderCircle } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

import type {
  Equipment,
  EquipmentPickerData,
  EquipmentPickerFormState,
  EquipmentType,
} from '@/lib/validation/equipmentSchema';

import submitEquipmentForm from '@/lib/submit/submitEquipmentForm';

import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import XButton from '../ui/x-button';

interface EquipmentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onEquipmentSelected: (equipment: Equipment) => void; // Callback when equipment chosen
}

export function EquipmentPicker({
  isOpen,
  onClose,
  equipmentList,
  onEquipmentSelected,
}: EquipmentPickerProps) {
  const [isNew, setIsNew] = useState<boolean>(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('GLIDER');

  // Initialize with first equipment when modal opens
  useEffect(() => {
    if (isOpen && equipmentList.length > 0 && !selectedEquipmentId && !isNew) {
      setSelectedEquipmentId(equipmentList[0].id);
    }
  }, [isOpen, equipmentList, selectedEquipmentId, isNew]);

  // Form logic
  const initialFormData: EquipmentPickerData = {
    type: 'GLIDER',
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

  // Handle "Continue" button for existing equipment
  const handleContinue = () => {
    const equipment = equipmentList.find((eq) => eq.id === selectedEquipmentId);

    if (equipment) {
      onEquipmentSelected(equipment);
    }
  };

  useEffect(() => {
    if (state.success && state.equipmentId) {
      const newEquipment: Equipment = {
        id: state.equipmentId, // Real DB ID from server action
        manufacturer: state.formData.manufacturer,
        model: state.formData.model,
        size: state.formData.size,
        type: state.formData.type,
        serialNumber: state.formData.serialNumber || '',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onEquipmentSelected(newEquipment);
    }
  }, [state.success, state.equipmentId, state.formData, onEquipmentSelected]);

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

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <dialog
        id="equipment-picker"
        open={isOpen}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto m-0"
      >
        <form method="dialog" action={formAction} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Choose Equipment</h2>
            <XButton onClose={onClose} />
          </div>

          {/* Modal main */}
          <div className="p-6 bg-gray-50 border-b">
            <Label htmlFor="equipment-select">Select Equipment</Label>
            <Select
              value={isNew ? 'new' : selectedEquipmentId || equipmentList[0]?.id}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="equipment-select" className="mt-2">
                <SelectValue placeholder="Choose equipment..." />
              </SelectTrigger>
              <SelectContent>
                {equipmentList.length > 0 &&
                  equipmentList.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.manufacturer} {equipment.model} {equipment.size} (
                      {equipment.serialNumber})
                    </SelectItem>
                  ))}
                <SelectItem value="new">+ Add New Equipment</SelectItem>
              </SelectContent>
            </Select>
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

              {/* New equipment input */}
              <div className="grid grid-cols-2 gap-4 my-5" id="new-equipment-input">
                <div className="space-y-2">
                  <Label htmlFor="type">Equipment Type</Label>
                  <Select
                    name="type"
                    value={equipmentType}
                    disabled={isPending}
                    onValueChange={(value) => setEquipmentType(value as EquipmentType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GLIDER">Paraglider</SelectItem>
                      <SelectItem value="HARNESS">Harness</SelectItem>
                      <SelectItem value="RESERVE">Reserve</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="type" value={equipmentType} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    type="text"
                    required
                    disabled={isPending}
                    className={state.errors.manufacturer ? 'border-red-500' : ''}
                    defaultValue={state.formData.manufacturer}
                  />
                  {state.errors.manufacturer && (
                    <p className="text-red-500 text-xs">{state.errors.manufacturer}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    type="text"
                    required
                    disabled={isPending}
                    className={state.errors.model ? 'border-red-500' : ''}
                    defaultValue={state.formData.model}
                  />
                  {state.errors.model && (
                    <p className="text-red-500 text-xs">{state.errors.model}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    type="text"
                    required
                    disabled={isPending}
                    className={state.errors.size ? 'border-red-500' : ''}
                    defaultValue={state.formData.size}
                  />
                  {state.errors.size && (
                    <p className="text-red-500 text-xs">{state.errors.size}</p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    type="text"
                    disabled={isPending}
                    className={state.errors.serialNumber ? 'border-red-500' : ''}
                    defaultValue={state.formData.serialNumber ?? ''}
                  />
                  {state.errors.serialNumber && (
                    <p className="text-red-500 text-xs">{state.errors.serialNumber}</p>
                  )}
                </div>
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
