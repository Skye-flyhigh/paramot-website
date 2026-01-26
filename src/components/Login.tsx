import { signIn } from '@/auth';
import { Button } from './ui/button';
// TODO: add other ways to login like emails or apple etc. when there is a database

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-sky-900 mb-6">
          Customer Login
        </h2>
        <div className="space-y-4">
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: '/dashboard' });
            }}
          >
            <Button type="submit" className="w-full">
              Sign in with Google
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-sky-600">
              Access your service history and manage your paragliding equipment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
