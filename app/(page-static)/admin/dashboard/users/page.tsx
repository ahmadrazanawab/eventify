"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  designation?: string;
  department?: string;
  year?: string;
  role: "admin" | "student";
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users", {
        params: query ? { q: query } : {},
        withCredentials: true,
      });
      setUsers(res.data?.data || []);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const debounceKey = useMemo(() => ({}), []);
  useEffect(() => {
    (debounceKey as any).t && clearTimeout((debounceKey as any).t);
    (debounceKey as any).t = setTimeout(() => fetchUsers(q), 300);
    return () => clearTimeout((debounceKey as any).t);
  }, [q, debounceKey]);

  const toggleRole = async (u: User) => {
    setMutatingId(u._id);
    try {
      const nextRole = u.role === "admin" ? "student" : "admin";
      const res = await axios.patch(
        `/api/admin/users/${u._id}`,
        { role: nextRole },
        { withCredentials: true }
      );
      const updated: User = res.data?.data;
      setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)));
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update role");
    } finally {
      setMutatingId(null);
    }
  };

  const deleteUser = async (u: User) => {
    const ok = window.confirm(`Delete user ${u.name}?`);
    if (!ok) return;
    setMutatingId(u._id);
    try {
      await axios.delete(`/api/admin/users/${u._id}`, { withCredentials: true });
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete user");
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <section className="w-full min-h-screen mt-24 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by name, email, phone, dept..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" onClick={() => fetchUsers(q)}>Refresh</Button>
        </div>
      </div>

      <div className="w-full border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2 border">Name</th>
              <th className="text-left px-3 py-2 border">Email</th>
              <th className="text-left px-3 py-2 border">Phone</th>
              <th className="text-left px-3 py-2 border">Dept/Year</th>
              <th className="text-left px-3 py-2 border">Designation</th>
              <th className="text-left px-3 py-2 border">Role</th>
              <th className="text-left px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-10 text-center" colSpan={7}>
                  <Spinner />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="px-3 py-10 text-center text-muted-foreground" colSpan={7}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="odd:bg-gray-50">
                  <td className="px-3 py-2 border">{u.name}</td>
                  <td className="px-3 py-2 border">{u.email}</td>
                  <td className="px-3 py-2 border">{u.phone}</td>
                  <td className="px-3 py-2 border">{u.department || "-"}{u.year ? ` / ${u.year}` : ""}</td>
                  <td className="px-3 py-2 border">{u.designation || "-"}</td>
                  <td className="px-3 py-2 border">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                  </td>
                  <td className="px-3 py-2 border">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled={mutatingId === u._id} onClick={() => toggleRole(u)}>
                        {mutatingId === u._id ? "..." : u.role === "admin" ? "Make Student" : "Make Admin"}
                      </Button>
                      <Button size="sm" variant="destructive" disabled={mutatingId === u._id} onClick={() => deleteUser(u)}>
                        {mutatingId === u._id ? "..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
