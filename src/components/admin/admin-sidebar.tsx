'use client';

import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Users,
    Hospital,
    Stethoscope,
    Calendar,
    MessageSquare,
    CreditCard,
    Settings,
    LogOut,
    FileText,
    PieChart,
    Globe,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";
import React from 'react';

export function AdminSidebar() {
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
        localStorage.removeItem('user');
        router.push('/admin/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: Users, label: 'Patients', href: '/admin/patients' },
        { icon: ShieldCheck, label: 'Admin Users', href: '/admin/users' },
        { icon: Hospital, label: 'Hospitals', href: '/admin/hospitals' },
        { icon: Stethoscope, label: 'Doctors', href: '/admin/doctors' },
        { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
        { icon: MessageSquare, label: 'Inquiries', href: '/admin/inquiries' },
        { icon: CreditCard, label: 'Finance', href: '/admin/finance' },
        { icon: Globe, label: 'CMS / Website', href: '/admin/cms' },
        { icon: PieChart, label: 'Reports', href: '/admin/reports' },
        { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-none tracking-tight">Admin Portal</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">NOVACURA</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} className="w-full">
                                <SidebarMenuButton isActive={pathname === item.href}>
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || ''}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate">{user?.firstName} {user?.lastName}</span>
                            <span className="text-[10px] text-muted-foreground truncate uppercase">{user?.role}</span>
                        </div>
                    </div>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
