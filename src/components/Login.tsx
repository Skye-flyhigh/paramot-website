import { signIn } from '@/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Login({ callbackUrl }: { callbackUrl?: string }) {
  const isDev = process.env.NODE_ENV === 'development';
  const redirectTo = callbackUrl || '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-sky-900 mb-6">
          Sign in to paraMOT
        </h2>

        <div className="space-y-4">
          {/* Magic Link Login */}
          <form
            action={async (formData: FormData) => {
              'use server';
              const email = formData.get('email') as string;

              await signIn('resend', { email, redirectTo });
            }}
            className="space-y-3"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-sky-900 mb-1"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Magic Link
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-sky-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth */}
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo });
            }}
          >
            <Button type="submit" variant="outline" className="w-full">
              Sign in with Google
            </Button>
          </form>

          {/* Dev Test Account (dev only) */}
          {isDev && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-amber-600">Dev Only</span>
                </div>
              </div>

              <form
                action={async (formData: FormData) => {
                  'use server';
                  const email = formData.get('devEmail') as string;

                  await signIn('credentials', { email, redirectTo });
                }}
                className="space-y-3"
              >
                <Input
                  name="devEmail"
                  type="email"
                  placeholder="test@dev.local"
                  required
                  className="w-full"
                />
                <Button type="submit" variant="outline" className="w-full">
                  Dev Test Account
                </Button>
              </form>
            </>
          )}

          <div className="text-center">
            <p className="text-sm text-sky-600">
              Access your service history and manage your equipment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
