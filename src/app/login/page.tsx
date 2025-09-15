import { auth } from "@/auth";
import Login from "@/components/Login";

export default async function LoginPage() {
    const session = await auth()

    if (!session) return <Login />
    
    return (
        <div>
            <h1>Welcome back!</h1>
        </div>
    )
}
