'use client';

import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Calendar,
    Settings,
    LogOut,
    UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";
import { mockDB } from "@/lib/mock-db";
import React from 'react';

export function DoctorSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        if (user) {
            // First try matching by ID
            let targetId = user.id;
            
            // If IDs don't match (e.g. backend vs mock), match by username/email
            const matchedMockUser = mockDB.getUsers().find(u => 
                u.id === user.id || u.username === user.username || u.email === user.email
            );
            if (matchedMockUser) {
                targetId = matchedMockUser.id;
            } else {
                // Fallback to demo doctor
                targetId = 'DOC-001';
            }
            
            mockDB.setUserOnline(targetId, false);
        }
        localStorage.removeItem('user');
        router.push('/doctor/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor/dashboard' },
        ...(user?.role === 'moderate_doctor' ? [
            { icon: UserCheck, label: 'Moderation Queue', href: '/doctor/moderation' }
        ] : []),
        { icon: Users, label: 'Assigned Patients', href: '/doctor/patients' },
        { icon: MessageSquare, label: 'Consultations', href: '/doctor/consultations' },
        { icon: Calendar, label: 'Availability', href: '/doctor/availability' },
        { icon: Settings, label: 'Profile Settings', href: '/doctor/profile-settings' },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-6">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black leading-none tracking-tight">Doctor Portal</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Moderate Access</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} className="w-full">
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    className="h-11 px-4 rounded-xl transition-all hover:bg-primary/5 active:scale-[0.98]"
                                >
                                    <item.icon className={`h-5 w-5 ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className={`font-semibold ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {item.label}
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm text-2xl">
                            {user?.emoji || '👨‍⚕️'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold truncate text-slate-900">Dr. {user?.lastName || 'Doctor'}</span>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Moderate Access</span>
                        </div>
                    </div>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleLogout}
                                className="h-10 px-4 rounded-lg text-destructive hover:text-white hover:bg-destructive transition-all active:scale-95"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="font-bold text-xs uppercase tracking-wider">Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
