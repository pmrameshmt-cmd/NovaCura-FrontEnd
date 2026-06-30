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
import { mockDB } from "@/lib/mock-db";
import { ShieldCheck, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";

export default function ModerateDoctorSignUpPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        medicalId: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const existingUser = mockDB.getUsers().find(u => u.username === formData.username || u.email === formData.email);

            if (existingUser) {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: "A moderator account with these details already exists."
                });
                setLoading(false);
                return;
            }

            // Register as moderate_doctor
            mockDB.addUser({
                id: mockDB.generateModerateDoctorId(),
                role: 'moderate_doctor',
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                specialization: 'Clinical Reviewer',
                isProfileCompleted: true
            });

            toast({
                title: "Moderator Profile Created",
                description: "Your registration is complete. Audit tools are now available.",
            });
            
            setTimeout(() => router.push("/moderate-doctor/login"), 2000);

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create account.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfdfc] p-4 font-inter">
            <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl border border-slate-200 bg-white">
                
                {/* Visual Side */}
                <div className="hidden lg:flex lg:w-5/12 bg-teal-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/50 rounded-full blur-3xl -ml-32 -mb-32" />
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8 border border-white/20 backdrop-blur-md">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-4">Moderate Doctor Program</h2>
                        <p className="text-teal-50 font-medium leading-relaxed opacity-90">
                            Join our elite team of medical reviewers. Ensure clinical excellence across every interaction.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <CheckCircle2 className="h-5 w-5 text-teal-200" />
                            </div>
                            <p className="text-sm font-bold">Audit Case Compliance</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <CheckCircle2 className="h-5 w-5 text-teal-200" />
                            </div>
                            <p className="text-sm font-bold">Review Doctor Consultations</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-7/12 p-8 lg:p-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create Moderator Profile</h1>
                            <p className="text-slate-500 font-medium">Register to start reviewing medical cases.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name</Label>
                                    <Input id="firstName" required value={formData.firstName} onChange={handleChange} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</Label>
                                    <Input id="lastName" required value={formData.lastName} onChange={handleChange} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-500">Administrative Username</Label>
                                <Input id="username" required value={formData.username} onChange={handleChange} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Professional Email</Label>
                                <Input id="email" type="email" required value={formData.email} onChange={handleChange} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Key</Label>
                                <Input id="password" type="password" required value={formData.password} onChange={handleChange} className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
                                {loading ? "Registering..." : "Complete Registration"}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm font-medium text-slate-500">
                            Already registered? <Link href="/moderate-doctor/login" className="text-teal-600 font-bold hover:underline">Sign In</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
