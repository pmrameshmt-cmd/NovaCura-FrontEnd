'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DoctorGuardProps {
    children: React.ReactNode;
}

export function DoctorGuard({ children }: DoctorGuardProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/doctor/login');
            return;
        }

        try {
            const user = JSON.parse(userData);
            const userRole = user.role?.toLowerCase();
            
            if (userRole !== 'moderate_doctor' && userRole !== 'doctor') {
                // If the user is an admin or supervisor, send them to admin dashboard
                if (userRole === 'admin' || userRole === 'supervisor') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard'); // Patients go to their dashboard
                }
                return;
            }
            setAuthorized(true);
        } catch (e) {
            localStorage.removeItem('user');
            router.push('/doctor/login');
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
