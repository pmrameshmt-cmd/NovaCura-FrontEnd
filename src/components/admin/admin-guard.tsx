'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const DEFAULT_ALLOWED_ROLES = ['admin', 'supervisor'];

export function AdminGuard({ children, allowedRoles }: AdminGuardProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/admin/login');
            return;
        }

        try {
            const user = JSON.parse(userData);
            const userRole = user.role?.toLowerCase();
            const rolesToCheck = allowedRoles || DEFAULT_ALLOWED_ROLES;
            const lowerAllowedRoles = rolesToCheck.map(r => r.toLowerCase());

            if (!lowerAllowedRoles.includes(userRole)) {
                // If the user is a doctor, send them to doctor dashboard instead of patient dashboard
                if (userRole === 'doctor' || userRole === 'moderate_doctor') {
                    router.push('/doctor/dashboard');
                } else {
                    router.push('/dashboard'); // Patients go to their dashboard
                }
                return;
            }
            setAuthorized(true);
        } catch (e) {
            localStorage.removeItem('user');
            router.push('/admin/login');
        }
    }, [router, allowedRoles]);

    if (!authorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
