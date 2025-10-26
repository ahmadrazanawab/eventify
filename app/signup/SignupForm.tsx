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
    const { register, handleSubmit, reset , formState:{isSubmitting}} = useForm<ISignUp>();
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
        <section className="flex justify-center mt-20 mx-4 mb-5">
            <Card className="w-full max-w-sm rounded-lg">

                <CardHeader className="flex flex-col">
                    <CardTitle>
                        {role === "student"
                            ? "Student Sign Up"
                            : "Admin Sign Up"}
                    </CardTitle>
                    <CardDescription>
                        {role === "student"
                            ? "Register as a student to participate in events."
                            : "Register as an admin to manage events and students."}
                    </CardDescription>
                    <div className="flex mt-3">
                        <Button
                            variant="link"
                            className={`bg-gray-200 px-4 py-1 rounded-md mx-1 ${role === "student" ? "bg-blue-300" : ""
                                }`}
                            onClick={() => handleRoleChange("student")}
                        >
                            Student Sign Up
                        </Button>
                        <Button
                            variant="link"
                            className={`bg-gray-200 px-4 py-1 rounded-md mx-1 ${role === "admin" ? "bg-blue-300" : ""
                                }`}
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
                                <Label htmlFor="name">Name</Label>
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
                                <Label htmlFor="email">Email</Label>
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
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            {...register("department")}
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="year">Year</Label>
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
                                        <Label htmlFor="designation">
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
                                        <Label htmlFor="accesscode">
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
                                <Label htmlFor="phone">Mobile Number</Label>
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    type="number"
                                    placeholder="Enter mobile number"
                                    required
                                />
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    {...register("password")}
                                    type="password"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button variant="outline" className="w-full cursor-pointer">
                        Sign Up with Google
                    </Button>
                    <p className="text-sm text-center w-full">
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
