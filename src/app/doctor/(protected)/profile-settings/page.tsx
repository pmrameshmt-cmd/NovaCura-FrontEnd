'use client';

import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, LogOut, Camera, Key, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { mockDB } from "@/lib/mock-db";

export default function ProfileSettingsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('personal');
    const [user, setUser] = useState<any>(null);

    // Form states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('Senior Consultant with over 10 years of experience in cardiology and internal medicine. Specialised in remote healthcare delivery and moderate-risk case management.');

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setFirstName(parsed.firstName || '');
            setLastName(parsed.lastName || '');
            setEmail(parsed.email || '');
        } else {
            router.push('/doctor/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/doctor/login');
    };

    const handleSave = (section: string) => {
        if (section === 'Profile' && user) {
            // Update in mockDB
            const updatedUser = {
                ...user,
                firstName,
                lastName,
                email
            };
            const state = mockDB.getState();
            const index = state.users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                state.users[index] = updatedUser;
                localStorage.setItem('healhome_mock_db', JSON.stringify(state));
                window.dispatchEvent(new Event('mock-db-update')); // Trigger wide refresh
            }
            // Update in local active session
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }

        toast({
            title: `${section} Updated`,
            description: `Your ${section.toLowerCase()} settings have been saved successfully.`,
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in mt-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Profile Settings</h1>
                <p className="text-slate-500 font-medium">Manage your clinical profile and account security.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-xl">
                                    <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                                        {user ? `${user.firstName[0]}${user.lastName[0]}` : 'MD'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="mt-4 font-black text-slate-900">Dr. {user?.firstName} {user?.lastName}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {user?.specialization || 'Moderate Access Provider'}
                            </p>
                            <Button variant="outline" className="mt-6 w-full rounded-xl font-bold text-[10px] uppercase h-10" onClick={() => toast({ title: "Photo upload initiated." })}>Update Photo</Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('personal')}
                            className={`w-full justify-start gap-3 rounded-xl font-bold ${activeTab === 'personal' ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'}`}
                        >
                            <User className="h-4 w-4" /> Personal Info
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('security')}
                            className={`w-full justify-start gap-3 rounded-xl font-bold ${activeTab === 'security' ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'}`}
                        >
                            <Shield className="h-4 w-4" /> Security
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full justify-start gap-3 rounded-xl font-bold ${activeTab === 'notifications' ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'}`}
                        >
                            <Bell className="h-4 w-4" /> Notifications
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 rounded-xl font-bold text-rose-500 hover:bg-rose-50"
                        >
                            <LogOut className="h-4 w-4" /> Logout Session
                        </Button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'personal' && (
                        <Card className="border-none shadow-sm overflow-hidden bg-white animate-in fade-in duration-300">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-base font-black text-slate-900">Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</Label>
                                        <Input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="h-12 rounded-2xl border-slate-200 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                                        <Input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="h-12 rounded-2xl border-slate-200 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Email</Label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="h-12 rounded-2xl border-slate-200 font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Bio</Label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-200 font-bold text-sm focus:ring-primary/10 transition-all resize-none"
                                    />
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex justify-end">
                                    <Button
                                        onClick={() => handleSave('Profile')}
                                        className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase shadow-xl hover:bg-slate-800 transition-all"
                                    >
                                        Save Profile Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card className="border-none shadow-sm overflow-hidden bg-white animate-in fade-in duration-300">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-base font-black text-slate-900">Security Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Key className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 text-sm">Change Password</h4>
                                            <p className="text-xs text-slate-500 font-medium">Update your account password securely.</p>
                                        </div>
                                        <Button variant="outline" className="rounded-xl font-bold text-xs" onClick={() => toast({ title: "Password Reset Sent", description: "Check your email for instructions." })}>Update</Button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Smartphone className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication</h4>
                                            <p className="text-xs text-slate-500 font-medium">Add an extra layer of security.</p>
                                        </div>
                                        <Button
                                            className={`rounded-xl font-bold text-xs ${twoFactorEnabled ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white'}`}
                                            onClick={() => {
                                                setTwoFactorEnabled(!twoFactorEnabled);
                                                toast({
                                                    title: !twoFactorEnabled ? "2FA Enabled" : "2FA Disabled",
                                                    description: !twoFactorEnabled ? "Authenticator app required for sign-ins." : "Two-factor authentication removed."
                                                });
                                            }}
                                        >
                                            {twoFactorEnabled ? 'Enabled' : 'Enable'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card className="border-none shadow-sm overflow-hidden bg-white animate-in fade-in duration-300">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-base font-black text-slate-900">Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-row items-center justify-between rounded-xl border border-slate-100 p-4">
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-slate-900 text-sm">New Consultation Requests</h4>
                                            <p className="text-xs text-slate-500 font-medium">Receive alerts when a new patient is assigned.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-xl border border-slate-100 p-4">
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-slate-900 text-sm">Patient Messages</h4>
                                            <p className="text-xs text-slate-500 font-medium">Get notified of new messages in the chat.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex flex-row items-center justify-between rounded-xl border border-slate-100 p-4">
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-slate-900 text-sm">Marketing & Updates</h4>
                                            <p className="text-xs text-slate-500 font-medium">Receive latest platform updates.</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-50 flex justify-end">
                                    <Button
                                        onClick={() => handleSave('Notifications')}
                                        className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase shadow-xl hover:bg-slate-800 transition-all"
                                    >
                                        Save Preferences
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
