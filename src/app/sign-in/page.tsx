'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // 1. Try real API FIRST (with 5s timeout so it never hangs)
      const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }, 5000);

      const responseText = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseText);
        const role = data.role?.toLowerCase();

        // Allow both 'patient' and 'user' roles (Real API uses 'user' or 'role_user' for patients)
        if (role !== 'patient' && role !== 'user' && role !== 'role_user' && role !== 'role_patient') {
          toast({ 
            variant: "destructive", 
            title: "Access Denied", 
            description: `This account has ${role} privileges. Please use the appropriate portal.` 
          });
          setLoading(false);
          return;
        }

        localStorage.setItem('user', JSON.stringify(data));
        toast({
          title: "Sign In Successful",
          description: `Welcome back!`,
        });

        router.push('/dashboard');
        return;
      }

      // Handle status 403 or other non-OK responses
      if (response.status === 403) {
        if (responseText.toLowerCase().includes('verify your email')) {
          toast({ 
            variant: "destructive", 
            title: "Email Not Verified", 
            description: "Please check your inbox and verify your email address before signing in." 
          });
        } else {
          toast({ 
            variant: "destructive", 
            title: "Access Denied", 
            description: responseText || "Access is restricted. Please contact support." 
          });
        }
      } else {
        toast({ variant: "destructive", title: "Sign In Failed", description: responseText || "Invalid username or password." });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast({ variant: "destructive", title: "Connection Timeout", description: "Server took too long to respond. Please try again." });
      } else {
        toast({ variant: "destructive", title: "Sign In Failed", description: "Invalid username or password." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-inter">
      {/* Decorative background blobs */}
      <div className="absolute pointer-events-none inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex overflow-hidden rounded-2xl border border-slate-200 shadow-2xl m-4 bg-white/60 backdrop-blur-sm">

        {/* Left: form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">NOVACURA Patient</h1>
              <p className="text-muted-foreground text-sm font-medium">Your global healthcare journey starts here.</p>
            </div>

            <Card className="bg-white/70 border-white/40 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ring-1 ring-black/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your portal.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username or Email</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="e.g. johnp"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                      <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : null}
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-[10px] space-y-3 font-semibold uppercase tracking-widest text-slate-400 animate-in fade-in duration-700 delay-300">
              <p>Medical Professional? <Link href="/doctor/login" className="text-primary hover:underline ml-1">Doctor Portal</Link></p>
              <div className="h-px bg-slate-100 max-w-[100px] mx-auto" />
              <p>Staff & Admins? <Link href="/admin/login" className="text-primary hover:underline ml-1">Ops Hub</Link></p>
            </div>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/5 to-blue-50 flex-col items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-white/40" />
          <img
            src="/patient-portal.png"
            alt="Medical Professionals"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl animate-in flip-in-y duration-1000 mb-12"
          />
          <div className="relative z-20 w-full max-w-md px-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-3">Patient Portal</h2>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">Access your medical history, view scheduled consultations, and connect with specialists instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
