'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/services/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const text = await response.text();

            if (response.ok) {
                setSubmitted(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Request Failed",
                    description: text || "Could not send reset email. Please try again.",
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

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Card className="mx-auto max-w-md w-full text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-2">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
                                ✉
                            </div>
                        </div>
                        <CardTitle className="text-xl">Check your inbox</CardTitle>
                        <CardDescription>
                            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
                            Check your spam folder if you don&apos;t see it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/sign-in" className="text-sm underline text-muted-foreground">
                            Back to Sign In
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="mx-auto max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your registered email address and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <Link href="/sign-in" className="underline text-muted-foreground">
                            Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
