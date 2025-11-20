"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentHelpPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Help / Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Need assistance?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-medium">How do I register for an event?</div>
              <div className="text-sm text-gray-600">Go to Register Event and choose the event. Complete the form and payment if required.</div>
            </div>
            <div>
              <div className="font-medium">Where can I see my registrations?</div>
              <div className="text-sm text-gray-600">Open My Registrations to view your current and past registrations with their payment status.</div>
            </div>
            <div>
              <div className="font-medium">Who can I contact for support?</div>
              <div className="text-sm text-gray-600">Email support@example.com or visit your department office for assistance.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
