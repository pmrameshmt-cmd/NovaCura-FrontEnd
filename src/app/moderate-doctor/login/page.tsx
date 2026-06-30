'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import { mockDB } from "@/lib/mock-db";
import { ShieldCheck, Lock, User, Activity, Loader2, ArrowRight } from "lucide-react";

export default function ModerateDoctorLoginPage() {
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
            // 1. Check Mock DB first (Offline first)
            const mockUser = mockDB.getUsers().find((u: any) =>
                (u.username === formData.username || u.email === formData.username) &&
                u.password === formData.password &&
                u.role === 'moderate_doctor'
            );

            if (mockUser) {
                const userData = { ...mockUser, token: `mock-token-${mockUser.id}` };
                localStorage.setItem('user', JSON.stringify(userData));
                router.push('/moderate-doctor/dashboard');
                toast({ title: "Moderate Doctor Access Granted", description: `Welcome back, Dr. ${mockUser.lastName}` });
                return;
            }

            // 2. Try API fallback
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/auth/moderate/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }, 5000);

            if (response.ok) {
                const data = await response.json();
                if (data.role === 'moderate_doctor') {
                    localStorage.setItem('user', JSON.stringify(data));
                    router.push('/moderate-doctor/dashboard');
                    toast({ title: "Authorized", description: "Moderation access approved." });
                } else {
                    toast({ variant: "destructive", title: "Access Denied", description: "Not a moderate doctor account." });
                }
            } else {
                toast({ variant: "destructive", title: "Authorization Failed", description: "Invalid credentials." });
            }
        } catch (error: any) {
            toast({ variant: "destructive", title: "System Error", description: "Failed to connect to the moderation gateway." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-inter">
            {/* Background elements - Teal/Blue theme for Moderate Doctors */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex overflow-hidden rounded-2xl border border-slate-200 shadow-2xl m-4 bg-white/55 backdrop-blur-sm">
                
                {/* Left: form */}
                <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-4 border border-teal-500/20 backdrop-blur-xl shadow-xl shadow-teal-500/5">
                                <ShieldCheck className="w-8 h-8 text-teal-600" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Moderate Doctor</h1>
                            <p className="text-muted-foreground font-medium text-sm text-center">Clinical Review & Quality Assurance Portal</p>
                        </div>

                        <Card className="bg-white/70 border-white/40 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ring-1 ring-black/5">
                            <CardContent className="p-8">
                                <CardTitle className="text-lg mb-6 text-slate-900 font-bold">Secure Verification Sign In</CardTitle>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Moderator ID</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground/50" />
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="Enter ID"
                                                required
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="h-12 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-teal-500/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Key</Label>
                                            <Link href="/forgot-password" title="title" className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">Forgot Password?</Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground/50" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="h-12 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-teal-500/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
                            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-2">
                                New Moderator? <Link href="/moderate-doctor/sign-up" className="text-teal-600 hover:underline ml-1">Register Profile</Link>
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
                                <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-teal-600 transition-colors">Admin Portal</Link>
                                <span className="text-slate-200 text-xs">|</span>
                                <Link href="/doctor/login" className="text-xs text-muted-foreground hover:text-teal-600 transition-colors">Clinical Portal</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Scene */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 mb-12 transform hover:scale-105 transition-transform duration-500">
                        <div className="flex gap-4 mb-6">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-amber-400" />
                            <div className="h-3 w-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                            <div className="h-4 w-full bg-slate-50 rounded-full animate-pulse [animation-delay:0.2s]" />
                            <div className="h-4 w-5/6 bg-slate-100 rounded-full animate-pulse [animation-delay:0.4s]" />
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 font-bold text-[10px]">MD</div>
                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-[10px]">DA</div>
                                </div>
                                <div className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider">Audit Ready</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-20 w-full max-w-md px-4">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Quality Assurance</h2>
                        <p className="text-base font-semibold text-slate-600 leading-relaxed">
                            Verify clinical documentation and ensure medical case compliance before final submission.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
