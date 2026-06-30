'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import { Stethoscope, Lock, User, Activity, Loader2, ArrowRight } from "lucide-react";

export default function DoctorLoginPage() {
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
            // ── Priority 1: Real Database Authentication ────────────────────────
            try {
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
                    const role = data.role.toUpperCase();
                    if (role === 'DOCTOR' || role === 'MODERATE_DOCTOR') {
                        localStorage.setItem('user', JSON.stringify(data));
                        router.push('/doctor/dashboard');
                        toast({ title: "Clinical Access Granted", description: "Authorization successful (Active Session)." });
                        return;
                    } else {
                        toast({ variant: "destructive", title: "Access Denied", description: "This portal is medical PERSONNEL ONLY. Use the patient portal instead." });
                        setLoading(false);
                        return;
                    }
                }
            } catch (backendError) {
                console.error("Backend login error:", backendError);
                toast({ variant: "destructive", title: "Gateway Error", description: "Communication with the medical hub failed." });
                setLoading(false);
                return;
            }

            toast({ variant: "destructive", title: "Authorization Failed", description: "Invalid clinical credentials or user does not exist." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Gateway Error", description: "Communication with the medical hub failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-inter">
            {/* Background elements for premium look */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-200/10 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex overflow-hidden rounded-2xl border border-slate-200 shadow-2xl m-4 bg-white/55 backdrop-blur-sm">

                {/* Left: form */}
                <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 backdrop-blur-xl shadow-xl shadow-primary/5">
                                <Stethoscope className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Doctor Portal</h1>
                        </div>

                        <Card className="bg-white/70 border-white/40 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ring-1 ring-black/5">
                            <CardContent className="p-8">
                                <CardTitle className="text-lg mb-6 text-slate-900">Medical Professional Login</CardTitle>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Doctor ID or Email</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground/50 transition-colors" />
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="e.g. doctor@healhome.com"
                                                required
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="h-12 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Clinical Key</Label>
                                            <Link href="/forgot-password" title="title" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground/50 transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="h-12 pl-10 bg-slate-50 border-slate-200 rounded-xl focus:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="mt-8 text-center animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
                            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-2">
                                New to Novacura? <Link href="/doctor/sign-up" className="text-primary hover:underline ml-1">Create doctor profile</Link>
                            </p>
                            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest opacity-60">
                                Secure Clinical Workspace
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
                                <Link href="/sign-in" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                    Return to Patient Portal
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Medical scene image */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-[#EEF2F6] flex-col items-center justify-center p-12 overflow-hidden">
                    <img
                        src="/signin-doctors.png"
                        alt="Medical Professionals"
                        className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl animate-in zoom-in duration-1000 mb-12"
                    />
                    <div className="relative z-20 w-full max-w-md px-4">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Doctor Portal</h2>
                        <p className="text-base font-semibold text-slate-600 leading-relaxed">
                            Professional workspace for clinical excellence and patient care management.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
