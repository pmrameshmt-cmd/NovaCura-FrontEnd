'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Stethoscope, User, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export default function DoctorSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
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

    if (formData.phoneNumber) {
      try {
        if (!isValidPhoneNumber(formData.phoneNumber)) {
          toast({
            variant: "destructive",
            title: "Invalid Phone Number",
            description: "Please enter a valid phone number for the selected country.",
          });
          return;
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number format.",
        });
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Backend Registration
      const signupResponse = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "DOCTOR"
        }),
      });

      if (!signupResponse.ok) {
        const errorText = await signupResponse.text();
        throw new Error(errorText || "Backend registration failed");
      }

      toast({
        title: "Account Created",
        description: "Your Doctor profile has been successfully registered. Please sign in to continue.",
      });
      setTimeout(() => router.push("/doctor/login"), 2000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message || "Failed to connect to the authentication server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-inter p-4">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white/55 backdrop-blur-sm">

        {/* Left: Branding & Info (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#EEF2F6] flex-col items-center justify-center p-12 overflow-hidden">
          <img
            src="/signin-doctors.png"
            alt="Medical Professionals"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl animate-in zoom-in duration-1000 mb-8"
          />
          <div className="relative z-20 w-full max-w-md px-4 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Join our Clinical Network</h2>
            <p className="text-base font-semibold text-slate-600 leading-relaxed">
              Empower your practice with our advanced clinical management tools and reach thousands of patients globally.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col items-center justify-center bg-white">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 border border-primary/20">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Doctor Registration</h1>
              <p className="text-muted-foreground text-sm font-medium">Create your professional profile today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g. Stephen"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g. Strange"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="username"
                    placeholder="dr_strange"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`h-10 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50 ${usernameError ? "border-destructive ring-destructive" : ""}`}
                  />
                </div>
                {usernameError && (
                  <p className="text-[10px] font-bold text-destructive mt-1 uppercase">Username already exists</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="stephen@strange.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                <PhoneInput
                  value={formData.phoneNumber}
                  onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
                  defaultCountryCode="IN"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                disabled={loading}
              >
                {loading ? "Registering..." : "Create Professional Account"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Already have a profile?{" "}
                <Link href="/doctor/login" className="text-primary hover:underline font-bold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
