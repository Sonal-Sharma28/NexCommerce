"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load profile");
        setForm({
          name: data?.name || user.name || "",
          phone: data?.phone || "",
          address: data?.address || "",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
        setForm({ name: user?.name || "", phone: "", address: "" });
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, [user?.uid]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Profile</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage your shipping details and account info.</p>
        </div>

        <Card className="p-7 sm:p-8 max-w-2xl">
          {!hydrated ? (
            <p className="text-sm text-zinc-500">Loading profile…</p>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  startAdornment={<User size={18} />}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555 000 0000"
                  startAdornment={<Phone size={18} />}
                />
              </div>

              <div className="space-y-2">
                <Label>Shipping address</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-4 text-zinc-400">
                    <MapPin size={18} />
                  </div>
                  <Textarea
                    className="pl-12"
                    rows={4}
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Street, city, state, zip"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button onClick={save} disabled={saving} className="h-12 font-black flex-1">
                  <Save size={18} />
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <div className="flex gap-3 flex-1">
                  <Button variant="outline" onClick={() => (window.location.href = "/dashboard/customer")} className="h-12 flex-1">
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={logout} className="h-12 flex-1 text-red-600 hover:bg-red-50">
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

