'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { mockDB } from "@/lib/mock-db";
import { User, Mail, Phone, Shield, Bell, CreditCard } from 'lucide-react';
import React from 'react';

export default function MyAccountPage() {
    const [user, setUser] = React.useState<any>(null);
    const [profileCompleted, setProfileCompleted] = React.useState(true);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setProfileCompleted(mockDB.isProfileCompleted(parsed.id));
        }
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <div className="p-6 md:p-8 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your personal information and account settings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-xl">Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">First Name</p>
                                        <p className="text-base font-semibold">{user?.firstName || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                                        <p className="text-base font-semibold">{user?.lastName || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Username</p>
                                        <p className="text-base font-semibold">{user?.username || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                        <p className="text-base font-semibold">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Security</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm transition-colors text-left">
                                        <Shield className="h-4 w-4 text-blue-500" />
                                        Change Password
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm transition-colors text-left">
                                        <Shield className="h-4 w-4 text-emerald-500" />
                                        Two-Factor Auth
                                    </button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm transition-colors text-left">
                                        <Bell className="h-4 w-4 text-orange-500" />
                                        Notifications
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm transition-colors text-left">
                                        <CreditCard className="h-4 w-4 text-violet-500" />
                                        Billing
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
