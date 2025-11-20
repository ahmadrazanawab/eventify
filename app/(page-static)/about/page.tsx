import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, CreditCard, BarChart2, CheckCircle } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen mt-24">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="rounded-2xl bg-gradient-to-r from-[#0071BC] to-blue-600 text-white p-8 sm:p-12 shadow-sm">
            <h1 className="text-3xl sm:text-4xl font-bold">Powering Campus Events</h1>
            <p className="mt-2 text-white/90 max-w-2xl">
              Eventify helps students and admins plan, publish, register, pay, and track events in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/student/dashboard/student-register-event">
                <Button className="bg-white text-[#0a58a5] hover:bg-white/90">Browse Events</Button>
              </a>
              <a href="/login">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">Admin Sign In</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-900">Why Eventify</h2>
        <p className="text-gray-600 mt-1">Built for colleges and universities to streamline the entire event lifecycle.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0071BC]"><CalendarDays className="h-5 w-5"/> Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">Publish events with date, venue, capacity, and categories.</CardContent>
          </Card>
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0071BC]"><Users className="h-5 w-5"/> Register</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">One-click student registrations with profile autofill.</CardContent>
          </Card>
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0071BC]"><CreditCard className="h-5 w-5"/> Pay</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">Secure online payments via Razorpay or cash confirmation.</CardContent>
          </Card>
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0071BC]"><BarChart2 className="h-5 w-5"/> Track</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">Real-time stats on registrations, payments, and attendance.</CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-blue-700">Fast</div>
              <div className="text-sm text-blue-700/70">Launch and manage events quickly</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-emerald-700">Secure</div>
              <div className="text-sm text-emerald-700/70">JWT auth, protected dashboards</div>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-amber-700">Scalable</div>
              <div className="text-sm text-amber-700/70">MongoDB models and analytics</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h3 className="text-xl font-semibold text-gray-900">How it works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600"/> Create Event</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">Admins set up event details, fees, and publish.</CardContent>
          </Card>
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600"/> Students Register</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">Students sign in and register in seconds.</CardContent>
          </Card>
          <Card className="hover:shadow transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600"/> Manage & Track</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">Dashboards show stats and support verification.</CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Page;
