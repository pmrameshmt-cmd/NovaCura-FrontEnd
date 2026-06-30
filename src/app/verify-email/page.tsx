'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token found in the link. Please check your email and try again.");
            return;
        }

        const verify = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/services/api/auth/verify-email?token=${encodeURIComponent(token)}`,
                    { method: "GET" }
                );
                const text = await response.text();

                if (response.ok) {
                    setStatus("success");
                    setMessage(text || "Your email has been verified successfully!");
                    setTimeout(() => router.push("/sign-in"), 3000);
                } else {
                    setStatus("error");
                    setMessage(text || "Verification failed. The link may be invalid or already used.");
                }
            } catch {
                setStatus("error");
                setMessage("Could not connect to the server. Please try again later.");
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="mx-auto max-w-md w-full text-center space-y-6 rounded-xl border bg-card p-8 shadow-sm">
            {status === "loading" && (
                <>
                    <div className="flex justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                    <h1 className="text-2xl font-semibold">Verifying your email…</h1>
                    <p className="text-muted-foreground">Please wait a moment.</p>
                </>
            )}

            {status === "success" && (
                <>
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
                            ✓
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-green-600">Email Verified!</h1>
                    <p className="text-muted-foreground">{message}</p>
                    <p className="text-sm text-muted-foreground">Redirecting you to Sign In…</p>
                    <Link
                        href="/sign-in"
                        className="inline-block mt-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                    >
                        Go to Sign In
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
                            ✕
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-red-600">Verification Failed</h1>
                    <p className="text-muted-foreground">{message}</p>
                    <Link
                        href="/sign-in"
                        className="inline-block mt-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                    >
                        Back to Sign In
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Suspense
                fallback={
                    <div className="flex h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                }
            >
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
