'use server';

import { CustomerFormState } from '@/components/customer/CustomerDetails';
import { Customer } from '../schema';
import { auth } from '@/auth';
import { CustomerDataSchema } from '../validation/customerSchema';
import { getCustomerByEmail } from '../mockData';
import { z } from 'zod';

export default async function submitCustomerDetails(
  prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  // ✅ STEP 1: Authentication check - verify user is logged in
  const session = await auth();
  if (!session?.user?.email) {
    return {
      data: prevState.data,
      errors: '🔒 Unauthorized: You must be logged in to update customer details',
      success: false,
    };
  }

  // ✅ STEP 2: Authorization check - verify user owns this customer record
  // Get the customer email from session (not from form - don't trust client!)
  const authenticatedEmail = session.user.email;
  const customer = getCustomerByEmail(authenticatedEmail);

  if (!customer) {
    return {
      data: prevState.data,
      errors: '❌ Customer not found',
      success: false,
    };
  }

  // Verify they're only updating their own data (Insecure Direct Object Reference prevention)
  if (customer.id !== prevState.data.id) {
    console.warn(
      `🚨 SECURITY: User ${authenticatedEmail} attempted to modify customer ${prevState.data.id} (owns ${customer.id})`,
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
