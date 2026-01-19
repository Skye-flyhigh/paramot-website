import * as dotenv from 'dotenv';
import path from 'path';

import sendEmail, { Email } from '@/lib/services/user-mailing';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('📧 Testing Resend Dashboard Template...\n');

const email: Email = {
  to: {
    name: 'Skye',
    email: 'hello@paramot.co.uk',
  },
  subject: 'Test: Booking Confirmation - paraMOT',
  template: 'booking-confirmation', // ← Your template ID from Resend dashboard
  templateVariables: {
    // Variables your template expects
    recipientName: 'Skye',
    serviceType: 'Line length verification (SVC-001)',
    equipmentName: 'Ozone Rush 5',
    bookingDate: 'January 20, 2026',
    price: '45.00',
  },
};

console.log('📧 email content', email);

// Send email using dashboard template
(async () => {
  const results = await sendEmail(email);

  if (results.success) {
    console.log('✅ Email sent successfully!');
    console.log(`📧 Email ID: ${results.data.id}`);
    console.log(`📬 Check your inbox at hello@paramot.co.uk`);
  } else {
    console.error('❌ Failed to send email');
    console.error(`Error: ${results.error}`);
    console.error(`Status code: ${results.statusCode}`);
  }
})();
