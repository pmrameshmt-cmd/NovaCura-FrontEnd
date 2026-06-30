'use client';

import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import { Calendar, Clipboard, MessageSquare, FileText, Hospital, Stethoscope, Plane, User, LayoutDashboard, CalendarPlus, Settings, LogOut, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";
import { NotificationsPopover } from "@/components/notifications-popover";
import React from 'react';

interface AppSidebarProps {
    profileCompleted: boolean;
    user: any;
    onOpenOnboarding?: () => void;
}

export function AppSidebar({ profileCompleted, user, onOpenOnboarding }: AppSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/sign-in');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: MessageSquare, label: 'Consultations', href: '/consultations' },
        { icon: Stethoscope, label: 'Doctors', href: '/doctors' },
        { icon: Hospital, label: 'Hospitals', href: '/hospitals' },
        { icon: Calendar, label: 'Appointments', href: '/appointments' },
        { icon: Clipboard, label: 'Medical Records', href: '/medical-records' },
        { icon: FileText, label: 'Prescriptions', href: '/prescriptions' },
        { icon: Plane, label: 'Medical Tourism', href: '/medical-tourism' },
        { icon: User, label: 'My Account', href: '/my-account' },
    ];

    // Add Admin Portal link if user is an admin
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(user?.role);
    if (isAdmin) {
        navItems.splice(1, 0, { icon: Settings, label: 'Admin Portal', href: '/admin/dashboard' });
    }

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20">
                            N
                        </div>
                        <span className="font-black text-sm tracking-tight text-slate-900">NOVACURA</span>
                    </div>
                    {user && <NotificationsPopover userId={user.id} role={user.role} />}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>

                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href} className="w-full">
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}

                    {/* Logout — always enabled */}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate">{user?.firstName} {user?.lastName}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
