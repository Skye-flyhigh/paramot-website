'use server';

import { ServiceCode, getServicePrice } from '../schema';
import sendEmail, { Email } from '../services/user-mailing';
import {
  BookingFormData,
  BookingFormState,
  bookingFormSchema,
} from '../validation/bookingForm';
import type { Equipment } from '../validation/equipmentSchema';

import { getEquipmentById } from '../mockData';
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

  // Retrieve formData
  if (!formData)
    return { ...prevState, errors: { general: 'Missing data' }, success: false };

  const formValues: BookingFormData = {
    serviceType: formData.get('service-type') as ServiceCode,
    preferredDate: formData.get('preferred-date') as string,
    deliveryMethod: formData.get('delivery-method') as string,
    specialInstructions: formData.get('special-instructions') as string,
    contactMethod: formData.get('contact-method') as string,
    equipmentId: formData.get('equipment-id') as string,
  };

  // Validate formData
  const { data, error, success } = bookingFormSchema.safeParse(formValues);

  if (!success) {
    return { ...prevState, errors: { general: error.message }, success: false };
  }

  // Retrieve Equipment data & compare with the database
  const equipment: Equipment = getEquipmentById(data.equipmentId);

  if (!equipment)
    return { ...prevState, errors: { general: 'Equipment not found' }, success: false };

  try {
    // TODO: Attributing a unique service code for the booking:
    const serviceCode = data.serviceType;

    // TODO: Send data to the server

    // TODO: Attributing a service description following the code
    const serviceType = data.serviceType;

    // Email confirmation to the customer
    const equipmentName = `${equipment.manufacturer} ${equipment.model} ${equipment.size} ${equipment.serialNumber ? '- ' + equipment.serialNumber : ''}`;
    // TODO: transform that preferredDate into UK friendly format
    const bookingDate = data.preferredDate;
    const price = getServicePrice(data.serviceType);

    const email: Email = {
      to: {
        name: customer.name,
        email: customer.email,
      },
      subject: `paraMOT - Booking confirmation ${serviceCode} - ${equipmentName}`,
      template: 'booking-confirmation',
      templateVariables: {
        recipientName: customer.name,
        serviceType,
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
