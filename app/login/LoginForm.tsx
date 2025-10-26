"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>();

    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setErrorMsg(""); // reset error
            const res = await axios.post("/api/login", data);

            if (res.data.success) {
                // ✅ Redirect based on role
                if (res.data.user.role === "admin") {
                    window.location.href = "/";
                } else {
                    window.location.href = "/";
                }
            } else {
                setErrorMsg(res.data.message || "Invalid credentials");
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.error("Login Error:", error);
            setErrorMsg(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <section className="flex justify-center mt-24 mx-4 mb-10">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="grid gap-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {errorMsg && (
                            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                        )}

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        {/* Google Login */}
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-center w-full">
                        Don’t have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
}


// "use client";

// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import axios from "axios";

// type LoginFormInputs = {
//     email: string;
//     password: string;
// };

// export default function LoginForm() {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//     } = useForm<LoginFormInputs>();

//     const onSubmit = async (data: LoginFormInputs) => {
//         console.log("Login Data:", data);

//         // You’ll connect this to your backend next:
//         const res = await axios.post("/api/login", data);
//         console.log(res.data);
//     };

//     return (
//         <section className="flex justify-center mt-24 mx-4">
//             <Card className="w-full max-w-sm">
//                 <CardHeader>
//                     <CardTitle>Login</CardTitle>
//                     <CardDescription>
//                         Enter your email and password to access your account
//                     </CardDescription>
//                 </CardHeader>

//                 <CardContent>
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                         {/* Email Field */}
//                         <div className="grid gap-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 placeholder="example@email.com"
//                                 {...register("email", {
//                                     required: "Email is required",
//                                     pattern: {
//                                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                         message: "Enter a valid email",
//                                     },
//                                 })}
//                             />
//                             {errors.email && (
//                                 <p className="text-red-500 text-sm">{errors.email.message}</p>
//                             )}
//                         </div>

//                         {/* Password Field */}
//                         <div className="grid gap-2">
//                             <div className="flex justify-between items-center">
//                                 <Label htmlFor="password">Password</Label>
//                                 <a
//                                     href="#"
//                                     className="text-sm text-blue-600 hover:underline"
//                                 >
//                                     Forgot Password?
//                                 </a>
//                             </div>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 {...register("password", {
//                                     required: "Password is required",
//                                     minLength: {
//                                         value: 6,
//                                         message: "Password must be at least 6 characters",
//                                     },
//                                 })}
//                             />
//                             {errors.password && (
//                                 <p className="text-red-500 text-sm">
//                                     {errors.password.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Submit Button */}
//                         <Button
//                             type="submit"
//                             className="w-full"
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? "Logging in..." : "Login"}
//                         </Button>

//                         {/* Google Login */}
//                         <Button variant="outline" className="w-full">
//                             Login with Google
//                         </Button>
//                     </form>
//                 </CardContent>

//                 <CardFooter>
//                     <p className="text-sm text-center w-full">
//                         Don’t have an account?{" "}
//                         <Link href="/signup" className="text-blue-600 hover:underline">
//                             Sign Up
//                         </Link>
//                     </p>
//                 </CardFooter>
//             </Card>
//         </section>
//     );
// }
