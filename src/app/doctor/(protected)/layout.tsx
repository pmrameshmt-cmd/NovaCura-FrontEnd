'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { DoctorGuard } from "@/components/doctor/doctor-guard";
import { Search, User, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NotificationsPopover } from "@/components/notifications-popover";
import React, { useEffect, useState } from "react";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleAction = (title: string, description: string) => {
        toast({ title, description });
    };

    return (
        <DoctorGuard>
            <SidebarProvider>
                <DoctorSidebar />
                <SidebarInset className="bg-slate-50/50">
                    {/* Doctor Header */}
                    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm">
                        <SidebarTrigger className="md:hidden" />

                        <div className="flex flex-1 items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                                <LayoutGrid className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Doctor Operations Hub</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                                onClick={() => handleAction("Global Search", "Search within assigned patients and records...")}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                            
                            {user && <NotificationsPopover userId={user.id} role={user.role} />}

                            <div className="h-8 w-px bg-slate-200 mx-1" />

                            <Button variant="ghost" size="sm" className="gap-2 rounded-full pl-1 pr-3 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shadow-inner">
                                    {user?.firstName?.[0] || 'D'}
                                </div>
                                <span className="text-sm font-bold text-slate-700 hidden sm:inline-block">{user?.firstName || 'Moderate Doctor'}</span>
                            </Button>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </DoctorGuard>
    );
}
