"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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

export function SignupForm() {
    const [role, setRole] = useState<"student" | "admin">("student")

    const handleRoleChange = (newRole: "student" | "admin") => {
        setRole(newRole)
    }

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
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
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
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="year">Year</Label>
                                        <Input
                                            id="year"
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
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer">
                        Sign Up
                    </Button>
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
