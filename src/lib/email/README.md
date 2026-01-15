# Email Setup - Resend Dashboard Templates

## Workflow

### 1. Design Template (Local)

Use `react-email-starter/` to design your template:

```bash
cd react-email-starter
npm run dev
```

Opens preview server at `http://localhost:3000`

### 2. Upload to Resend Dashboard

1. Go to https://resend.com/templates
2. Click "Create Template"
3. Copy your HTML from preview
4. Give it an ID (e.g., `booking-confirmation`)
5. Define variables (e.g., `{{recipientName}}`, `{{bookingDate}}`)

### 3. Use in Code

```typescript
import sendEmail from '@/lib/services/user-mailing';

await sendEmail({
  to: { name: 'Customer', email: 'customer@example.com' },
  subject: 'Booking Confirmed',
  template: 'booking-confirmation', // ← Template ID from dashboard
  templateVariables: {
    recipientName: 'Skye',
    bookingDate: 'Jan 20, 2026',
    price: '45.00',
  },
});
```

## Color Scheme

All email colors are centralized in `color-scheme.ts`:

```typescript
import { emailColors } from '@/lib/email/color-scheme';

// Use in templates
<div style={{ backgroundColor: emailColors.primary }}>...</div>
```

## Testing

```bash
# Test dashboard template
npx tsx src/scripts/test-dashboard-template.ts
```

## Templates

Current templates:

- `booking-confirmation` - Service booking confirmation email
- (Add more as needed)

## Notes

- `react-email-starter/` is in `.gitignore` - it's just for local design
- Upload finalized templates to Resend dashboard
- Template variables use `{{variableName}}` syntax in the dashboard
- Update `templateVariables` types in `test-dashboard-template.ts` for reference
- Variable names must be ASCII letters, numbers, underscores only (max 50 chars)
