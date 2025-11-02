"use client";

import { Equipment } from "@/lib/schema";
import { LoaderCircle, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import submitEquipmentForm from "@/lib/submit/submitEquipmentForm";

interface EquipmentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
}

export interface EquipmentPickerFormState {
  formData: EquipmentPickerData;
  errors: Record<string, string>;
  success: boolean;
}

export interface EquipmentPickerData {
  manufacturer: string;
  model: string;
  size: string;
  serialNumber?: string;
}

export function EquipmentPicker({
  isOpen,
  onClose,
  equipmentList,
}: EquipmentPickerProps) {
  const [isNew, setIsNew] = useState<boolean>(false);

  // Make sure that the model is closed
  if (!isOpen) return null;

  // If there is not kit in the list then the form should offer to add new kit
  if (equipmentList.length === 0) setIsNew(true);

  // Pick up when the option "add new equipment" is selected"
  function handleSelectChange(value: string) {
    if (value === "new") {
      setIsNew(true);
    } else {
      setIsNew(false);
      // TODO: Handle existing equipment selection
    }
  }

  // Form logic
  // initial value init
  const initialFormData: EquipmentPickerData = {
    manufacturer: "",
    model: "",
    size: "",
    serialNumber: "",
  };
// initial state definition
  const initialState: EquipmentPickerFormState = {
    formData: initialFormData,
    errors: {},
    success: false,
  };
// form logic holder
  const [state, formAction, isPending] = useActionState(
    submitEquipmentForm,
    initialState
  )

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-90">

    <dialog open={isOpen} className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] m-auto overflow-y-auto">
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

        <h2 className="font-medium text-gray-900 mb-2">Select Equipment</h2>
        {/* Equipment selection logic goes here */}
        <select onChange={(e) => handleSelectChange(e.target.value)} className="bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700">
          {equipmentList.length > 0 &&
            equipmentList.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.manufacturer} {equipment.model} {equipment.size} (
                {equipment.serialNumber})
              </option>
            ))}
          <option value="new">+ Add New Equipment</option>
          </select>

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

              {isNew && (
                <div className="grid grid-cols-2 gap-4 text-sm my-5">
                  <label className="text-gray-600">
                    Manufacturer:
                <input type="text" name="manufacturer" required
                className={"bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 " +
                      (state.errors.manufacturer
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : "")
                    }
                    defaultValue={state.formData.manufacturer}/>
                  </label>
                  <label className="text-gray-600">
                    Model:
                    <input type="text" name="model" required
                    className={"bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 " +
                      (state.errors.model
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : "")
                    }
                    defaultValue={state.formData.model}/>
                  </label>
                  <label className="text-gray-600">
                    Size:
                    <input type="text" name="size" required
                    className={"bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 " +
                      (state.errors.size
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : "")
                    }
                    defaultValue={state.formData.size}/>
                  </label >
                  <label className="text-gray-600">
                    Serial Number:
                    <input type="text" name="serialNumber" required
                    className={"bg-white p-2 border-sky-300 border-2 rounded-lg hover:border-sky-700 " +
                      (state.errors.serialNumber
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                        : "")
                    }
                    defaultValue={state.formData.serialNumber}/>
                  </label>
                </div>
              )}
          </div>

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
              disabled={isPending}
                  className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
              { isPending ?
                  (
                    <>
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  )
                  : (isNew ? "Add Equipment" : "Update Equipment")}
                </button>
              </div>

      </form>
    </dialog>
    </div>
  );
}
