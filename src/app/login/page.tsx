import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-sky-900 mb-6">
          Customer Login
        </h2>
        <div className="space-y-4">
          <form action={async () => {
            "use server"
            await signIn("google")
          }}>
            <button 
              type="submit"
              className="w-full bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700"
            >
              Sign in with Google
            </button>
          </form>
                  </div>
      </div>
    </div>
  )
}
