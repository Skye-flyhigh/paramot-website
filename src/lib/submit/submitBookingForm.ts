'use server';

import { getServiceByCode, getServicePrice } from '../schema';
import sendEmail, { Email } from '../services/user-mailing';
import { BookingFormState, bookingFormSchema } from '../validation/bookingForm';

import z from 'zod';
import { createServiceRecord, findEquipmentById } from '../db';
import { ensureCustomer } from '../security/auth-check';

export default async function submitBookingForm(
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    return {
      ...prevState,
      errors: { general: authResult.error },
      success: false,
    };
  }
  const customer = authResult.customer;

  // Convert FormData to plain object for Zod validation
  const rawFormData = Object.fromEntries(formData);

  // Validate and parse form data
  const { data, error, success } = bookingFormSchema.safeParse(rawFormData);

  if (!success || error) {
    const formattedError = z.prettifyError(error) || 'Error in validating data';

    return { ...prevState, errors: { general: formattedError }, success: false };
  }

  // Retrieve Equipment data & compare with the database
  const equipment = await findEquipmentById(data.equipmentId);

  if (!equipment)
    return { ...prevState, errors: { general: 'Equipment not found' }, success: false };

  try {
    // Get service details
    const service = getServiceByCode(data.serviceType);

    if (!service)
      return {
        ...prevState,
        errors: { general: 'Invalid service type' },
        success: false,
      };

    const serviceCode = data.serviceType; // e.g. "SVC-001"
    const serviceTitle = service.title;
    const serviceDescription = service.description;
    const price = getServicePrice(data.serviceType);

    // Create service record in database (auto-generates booking reference)
    const newServiceRecord = await createServiceRecord({
      customerId: customer.id,
      equipmentId: equipment.id,
      serviceCode,
      preferredDate: data.preferredDate,
      deliveryMethod: data.deliveryMethod,
      contactMethod: data.contactMethod,
      specialInstructions: data.specialInstructions,
      cost: typeof price === 'number' ? price : 0,
    });

    // Email confirmation to the customer
    const equipmentName = `${equipment.manufacturer} ${equipment.model} ${equipment.size} ${equipment.serialNumber ? '- ' + equipment.serialNumber : ''}`;
    // TODO: transform that preferredDate into UK friendly format
    const bookingDate = data.preferredDate;

    const email: Email = {
      to: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: authResult.email,
      },
      subject: `paraMOT - Booking confirmation ${newServiceRecord.bookingReference} - ${equipmentName}`,
      template: 'booking-confirmation',
      templateVariables: {
        recipientName: `${customer.firstName} ${customer.lastName}`,
        bookingReference: newServiceRecord.bookingReference,
        serviceTitle,
        serviceDescription,
        equipmentName,
        bookingDate,
        price,
      },
    };
    const results = await sendEmail(email);

    if (results.error)
      return {
        ...prevState,
        errors: { general: results.error },
        success: false,
      };

    //TODO: save the email id result somewhere?? 🤷

    return {
      ...prevState,
      errors: {},
      success: true,
    };
  } catch (error: unknown) {
    console.warn('Error submitting booking form', error);

    return {
      ...prevState,
      errors: { general: 'Something went wrong' },
      success: false,
    };
  }
}
