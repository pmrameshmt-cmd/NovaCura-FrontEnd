'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MessagesRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/consultations');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Relocating to Consultations...</p>
            </div>
        </div>
    );
}
