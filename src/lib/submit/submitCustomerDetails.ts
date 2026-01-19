'use server';

import { z } from 'zod';

import type { Customer } from '../schema';

import { ensureCustomer } from '../security/auth-check';
import { CustomerDataSchema, CustomerFormState } from '../validation/customerSchema';

export default async function submitCustomerDetails(
  prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  // ✅ STEP 1 & 2: Authentication + Authorization (DRY!)
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    return {
      data: prevState.data,
      errors: authResult.error,
      success: false,
    };
  }

  const { customer } = authResult;

  // Verify they're only updating their own data (Insecure Direct Object Reference prevention)
  if (customer.id !== prevState.data.id) {
    console.warn(
      `🚨 SECURITY: User ${customer.email} attempted to modify customer ${prevState.data.id} (owns ${customer.id})`,
    );

    return {
      data: prevState.data,
      errors: '🔒 Forbidden: You can only update your own information',
      success: false,
    };
  }

  try {
    // ✅ STEP 3: Validate and sanitize input with Zod
    const validatedData = CustomerDataSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    });

    // Prepare sanitized customer object
    const updatedCustomer: Customer = {
      ...prevState.data,
      ...validatedData,
      updatedAt: new Date(),
      communicationPreferences: {},
    };

    // TODO: 💾 Save to database
    // await prisma.customer.update({
    //   where: { id: customer.id },
    //   data: {
    //     name: validatedData.name,
    //     email: validatedData.email,
    //     phone: validatedData.phone,
    //     address: validatedData.address,
    //   }
    // });

    return {
      data: updatedCustomer,
      errors: null,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error saving customer details:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message).join(', ');

      return {
        data: prevState.data,
        errors: `Validation failed: ${errorMessages}`,
        success: false,
      };
    }

    return {
      data: prevState.data,
      errors: `❌ Error saving customer details: ${error}`,
      success: false,
    };
  }
}
