import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-sky-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-sky-900 mb-3">Check your email</h1>

        <p className="text-sky-700 mb-6">
          We've sent you a magic link to sign in. Click the link in the email to continue.
        </p>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-sky-700">
            <strong>Tip:</strong> The link expires in 15 minutes for security. If you
            don't see the email, check your spam folder.
          </p>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-block text-sky-600 hover:text-sky-700 font-medium text-sm"
        >
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
