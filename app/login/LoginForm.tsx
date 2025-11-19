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
        <section className="min-h-[calc(100vh-6rem)] mt-24 flex items-center justify-center bg-gray-50 px-4 py-10">
            <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl text-gray-900">Login</CardTitle>
                    <CardDescription className="text-gray-500">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
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
                                <Label htmlFor="password" className="text-gray-700">Password</Label>
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
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        {/* Google Login */}
                        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                            Login with Google
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-center w-full text-gray-600">
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
