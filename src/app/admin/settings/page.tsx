'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Bell,
    Lock,
    Globe,
    Shield,
    Mail,
    Smartphone,
    Save,
    RefreshCw
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (section: string) => {
        setIsSaving(true);
        // Mock save delay
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Settings Saved",
                description: `${section} settings have been updated successfully.`,
            });
        }, 1200);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure platform preferences, security protocols, and notification rules.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            General Configuration
                        </CardTitle>
                        <CardDescription>Global platform defaults and public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Platform Name</Label>
                            <Input id="siteName" defaultValue="NOVACURA Operations" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Global Contact Email</Label>
                            <Input id="adminEmail" defaultValue="admin@novacura.com" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Maintenance Mode</Label>
                                <p className="text-xs text-muted-foreground">Temporarily disable public access.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button className="ml-auto gap-2" size="sm" onClick={() => handleSave("General")} disabled={isSaving}>
                            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save General
                        </Button>
                    </CardFooter>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Rules
                        </CardTitle>
                        <CardDescription>Control how administrators receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <Label>Email Alerts for New Inquiries</Label>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <Label>WhatsApp Notification Sync</Label>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <Label>Security Failure Warnings</Label>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button className="ml-auto gap-2" size="sm" onClick={() => handleSave("Notification")} disabled={isSaving}>
                            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Notifications
                        </Button>
                    </CardFooter>
                </Card>

                {/* Security Settings */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Security & Access Control
                        </CardTitle>
                        <CardDescription>Manage password policies and session timeouts.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Automatic Session Timeout (minutes)</Label>
                                <Input id="sessionTimeout" type="number" defaultValue="30" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Require 2FA for Admin Access</Label>
                                    <p className="text-xs text-muted-foreground">Mandatory for all operations roles.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                                <Input id="passwordExpiry" type="number" defaultValue="90" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Enable IP Whitelisting</Label>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button className="ml-auto gap-2" size="sm" onClick={() => handleSave("Security")} disabled={isSaving}>
                            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Security
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
