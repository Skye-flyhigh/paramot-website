"use server"

import { EquipmentPickerFormState } from "@/components/dashboard/EquipmentPicker";

  
export default async function submitEquipmentForm(prevState: EquipmentPickerFormState, data: FormData):
    Promise<EquipmentPickerFormState>{
    try {
      console.log("Submitting equipment form:", data)

       // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
      return {
        formData: {
          manufacturer: "",
          model: "",
          size: "",
          serialNumber: ""
        },
        errors: {},
        success: true
      }
      
    } catch (error) {
      console.error("Error submitting equipment form:", error)
      return {
        ...prevState,
        errors: {
          ...prevState.errors,
          general: "Failed to submit equipment form"
        },
        success: false
      }
    }
  }
