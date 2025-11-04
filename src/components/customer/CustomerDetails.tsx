import { Customer } from '@/lib/schema';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <form>
      <Label htmlFor="name">Name</Label>
      <Input id="name" defaultValue={customer.name} />
      <Label htmlFor="email">Email</Label>
      <Input id="email" defaultValue={customer.email} />
      <Button type="submit">Save</Button>
    </form>
  );
}
