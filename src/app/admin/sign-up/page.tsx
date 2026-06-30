'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { mockDB } from "@/lib/mock-db";
import { Shield, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AdminSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "username") {
      setUsernameError(false);
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // 1. Mock DB Registration
      const existingUser = mockDB.getUsers().find(u => u.username === formData.username || u.email === formData.email);

      if (existingUser) {
        if (existingUser.username === formData.username) setUsernameError(true);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "An account with these details already exists."
        });
        setLoading(false);
        return;
      }

      // Generate Admin ID
      const newId = mockDB.generateAdminId();
      mockDB.addUser({
        id: newId,
        role: 'admin',
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      toast({
        title: "Admin Account Created",
        description: "Administrative profile successfully provisioned. Redirecting to login...",
      });
      setTimeout(() => router.push("/admin/login"), 2000);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Failed to provision administrative account.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-inter p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white/55 backdrop-blur-sm">

        {/* Left Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col items-center justify-center bg-white">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-4 border border-purple-600/20 shadow-xl shadow-purple-600/5">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Registration</h1>
              <p className="text-muted-foreground text-sm font-medium">Provision a new administrative profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g. Sarah"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:border-purple-600/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g. Connor"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:border-purple-600/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Administrative ID</Label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground/50" />
                  <Input
                    id="username"
                    placeholder="admin_sarah"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:border-purple-600/50 ${usernameError ? "border-destructive ring-destructive" : ""}`}
                  />
                </div>
                {usernameError && <p className="text-[10px] font-bold text-destructive mt-1 uppercase">ID already exists in registry</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah@novacura.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:border-purple-600/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Key</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 pl-12 bg-slate-50 border-slate-200 rounded-xl focus:border-purple-600/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4"
                disabled={loading}
              >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                    <>
                        Complete Registration
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Already registered?{" "}
                <Link href="/admin/login" className="text-purple-600 hover:underline font-bold">
                  Sign In to Portal
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#EEF2F6] flex-col items-center justify-center p-12 overflow-hidden">
          <img
            src="/admin-signup.png"
            alt="Admin Command Center"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-1000 mb-12"
          />
          <div className="relative z-20 w-full max-w-md px-4 text-center">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Command Center</h2>
            <p className="text-base font-semibold text-slate-600 leading-relaxed">
              Orchestrate global healthcare operations, manage resources, and oversee patient care workflows from one secure unified workspace.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
