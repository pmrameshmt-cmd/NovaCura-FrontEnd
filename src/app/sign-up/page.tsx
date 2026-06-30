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

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",   // optional — may be empty or "dial localNumber"
    password: "",
    role: "USER",
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
      // 1. Real API Registration
      const response = await fetch(`${API_BASE_URL}/services/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account before signing in.",
        });
        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          role: "USER",
        });
        setTimeout(() => router.push("/sign-in"), 3000);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: responseText || "Could not create account. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 font-inter">
      <div className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl border border-border/50">

        {/* ── Left: Sign-up form ──────────────────────────────── */}
        <div className="w-full lg:w-1/2 bg-background">
          <Card className="border-0 shadow-none rounded-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Sign Up</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName" className="font-semibold text-sm">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName" className="font-semibold text-sm">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="grid gap-2">
                  <Label htmlFor="username" className="font-semibold text-sm">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`h-11 bg-muted/30 focus:border-primary/50 transition-colors ${usernameError ? "border-destructive ring-destructive" : "border-muted/50"
                      }`}
                  />
                  {usernameError && (
                    <p className="text-xs font-medium text-destructive mt-0.5">Username already exists</p>
                  )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-semibold text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email ID"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Phone — optional */}
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber" className="font-semibold text-sm">Phone Number</Label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
                    defaultCountryCode="IN"
                    placeholder="Phone number (Optional)"
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password" title="password" className="font-semibold text-sm">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 bg-muted/30 border-muted/50 focus:border-primary/50 transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full font-bold text-base py-6 shadow-md shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create an Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline font-extrabold">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Medical scene image (hidden on mobile) ──── */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="/signup-medical-scene.png"
            alt="Medical professionals ready to help"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Subtle gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-2xl font-bold drop-shadow-lg">Your Health, Our Priority</h2>
            <p className="text-sm mt-1 text-white/85 drop-shadow-md">
              Join thousands of patients who trust us with their care.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
