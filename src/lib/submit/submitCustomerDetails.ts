'use server';
import { CustomerFormState } from '@/components/customer/CustomerDetails';
import { Customer } from '../schema';

export default async function submitCustomerDetails(
  prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  console.log(
    '[DEBBUG] CustomerDetails.tsx: new customer details going done the pipeline:',
    formData,
  );

  const rawData: Customer = {
    ...prevState.data,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    updatedAt: new Date(),
  };
  // TODO: Validate with Zod schema

  // TODO: Sanitize data

  try {
    // TODO: submitCustomerDetails, 💾 saving the new details into the database
    console.log(
      '[TODO] submitCustomerDetails, 💾 saving the new details into the database',
    );

    return {
      data: rawData,
      errors: null,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error saving customer details', error);

    return {
      data: prevState.data,
      errors: `❌ Error saving customer details: ${error}`,
      success: false,
    };
  }
}
