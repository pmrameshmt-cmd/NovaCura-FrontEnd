'use client';

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { Suspense, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const { toast } = useToast();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Passwords don't match",
                description: "Please make sure both passwords are the same.",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                variant: "destructive",
                title: "Password too short",
                description: "Password must be at least 6 characters.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/services/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const text = await response.text();

            if (response.ok) {
                toast({
                    title: "Password Reset Successful",
                    description: "Your password has been updated. Redirecting to Sign In…",
                });
                setTimeout(() => router.push("/sign-in"), 2000);
            } else {
                toast({
                    variant: "destructive",
                    title: "Reset Failed",
                    description: text || "The reset link may have expired. Please request a new one.",
                });
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to connect to the server.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Card className="mx-auto max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle className="text-xl text-red-600">Invalid Link</CardTitle>
                    <CardDescription>
                        This password reset link is missing or invalid. Please request a new one.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/forgot-password" className="underline text-sm">
                        Request a new reset link
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>Enter a new password for your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <Link href="/forgot-password" className="underline text-muted-foreground">
                        Request a new reset link
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Suspense
                fallback={
                    <div className="flex h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                }
            >
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
