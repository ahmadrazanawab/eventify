"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone?: string | number;
    department?: string;
    year?: string;
    role: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/student/me", { cache: "no-store" });
        const data = await res.json();
        if (data?.success) {
          setProfile(data.student);
          setError(null);
        } else {
          setProfile(null);
          setError("Failed to load profile");
        }
      } catch (_) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full mt-20">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : !profile ? (
            <div className="py-10 text-center text-gray-500">No profile data</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Name</div>
                <div className="font-medium">{profile.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="font-medium">{profile.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="font-medium">{profile.phone ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Department</div>
                <div className="font-medium">{profile.department ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Year</div>
                <div className="font-medium">{profile.year ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Role</div>
                <div className="font-medium capitalize">{profile.role}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
