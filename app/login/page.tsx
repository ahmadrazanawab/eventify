import React from 'react'
import LoginForm from './LoginForm'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
    // ✅ Server-side cookie check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    // Redirect if already logged in
    if (token) {
        redirect("/dashboard");
    }
    return (
        <div >
            <LoginForm />
        </div>
    )
}

export default page
