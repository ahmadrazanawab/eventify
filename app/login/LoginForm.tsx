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
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
    email: string;
    password: string;
};

type LoginResponse = {
    success: boolean;
    message?: string;
    user?: {
        role: string;
    };
};

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setErrorMsg(""); // reset error
            const res = await axios.post("/api/login", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.data.success) {
                // The token is already set as an HTTP-only cookie by the server
                // Redirect based on role
                if (res.data.user?.role === "admin") {
                    window.location.href = "/admin/dashboard";
                } else if (res.data.user?.role === "student") {
                    window.location.href = "/student/dashboard";
                } else {
                    window.location.href = "/";
                }
            } else {
                setErrorMsg(res.data.message || "Invalid credentials");
            }
        } catch (error) {
            const err = error as any;
            if (err?.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Login Error:", err.response.data);
                setErrorMsg(err.response.data?.message || "Invalid credentials");
            } else if (err?.request) {
                // The request was made but no response was received
                console.error("No response received:", err.request);
                setErrorMsg("No response from server. Please try again.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error:", err.message || "Unknown error occurred");
                setErrorMsg("An error occurred. Please try again.");
            }
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
                                placeholder="name@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                }) as any}
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
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                }) as any}
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
                        <Button type="submit" className="w-full" disabled={isSubmitting as boolean}>
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
