"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ISignUp } from "../type/IsignUp"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import axios from "axios"

export function SignupForm() {
    const [role, setRole] = useState<"student" | "admin">("student")
    const { register, handleSubmit, reset} = useForm<ISignUp>();
    const handleRoleChange = (newRole: "student" | "admin") => {
        setRole(newRole)
    }
    const onSubmit = async (data: ISignUp) => {
        try {
            const res = await axios.post("/api/signup", { ...data, role });
            if (res.data.success) {
                alert("User registered successfully!");
                window.location.href = "/login";
            }
            reset(); // reset form after success
        } catch (error) {
            console.error("Signup error:", error);
        }
    };


    return (
        <section className="min-h-[calc(100vh-6rem)] mt-24 flex items-center justify-center bg-gray-50 px-4 py-10">
            <Card className="w-full max-w-xl bg-white border border-gray-200 shadow-sm rounded-xl">

                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl text-gray-900">
                        {role === "student"
                            ? "Student Sign Up"
                            : "Admin Sign Up"}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        {role === "student"
                            ? "Register as a student to participate in events."
                            : "Register as an admin to manage events and students."}
                    </CardDescription>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                            variant="link"
                            className={`px-4 py-1.5 rounded-md border transition-colors ${role === "student" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"}`}
                            onClick={() => handleRoleChange("student")}
                        >
                            Student Sign Up
                        </Button>
                        <Button
                            variant="link"
                            className={`px-4 py-1.5 rounded-md border transition-colors ${role === "admin" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"}`}
                            onClick={() => handleRoleChange("admin")}
                        >
                            Admin Sign Up
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-700">Name</Label>
                                <Input
                                    id="name"
                                    {...register("name", {
                                        required: "Name is required"
                                    })}
                                    type="text"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    {...register("email")}
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>

                            {role === "student" && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="department" className="text-gray-700">Department</Label>
                                        <Input
                                            id="department"
                                            {...register("department")}
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="year" className="text-gray-700">Year</Label>
                                        <Input
                                            id="year"
                                            {...register("year")}
                                            type="number"
                                            placeholder="e.g. 3"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {role === "admin" && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="designation" className="text-gray-700">
                                            Designation
                                        </Label>
                                        <Input
                                            id="designation"
                                            {...register("designation")}
                                            type="text"
                                            placeholder="e.g. Event Coordinator"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="accesscode" className="text-gray-700">
                                            Admin Access Code
                                        </Label>
                                        <Input
                                            id="accesscode"
                                            {...register("secretCode")}
                                            type="password"
                                            placeholder="Enter secret code"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-gray-700">Mobile Number</Label>
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    type="number"
                                    placeholder="Enter mobile number"
                                    required
                                />
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="password" className="text-gray-700">Password</Label>
                                <Input
                                    id="password"
                                    {...register("password")}
                                    type="password"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button variant="outline" className="w-full cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50">
                        Sign Up with Google
                    </Button>
                    <p className="text-sm text-center w-full text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>

            </Card>
        </section>
    )
}
