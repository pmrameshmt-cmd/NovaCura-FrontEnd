'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();
    const isAuthPage = pathname === "/admin/login" || pathname === "/admin/sign-up";

    const [adminUser, setAdminUser] = React.useState<any>(null);
    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setAdminUser(JSON.parse(userData));
    }, []);

    const handleAction = (title: string, description: string) => {
        toast({ title, description });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/admin/login');
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <AdminGuard>
            <SidebarProvider>
                <AdminSidebar />
                <SidebarInset>
                    {/* Admin Header */}
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger className="md:hidden" />

                        <div className="flex flex-1 items-center gap-4">
                            <h2 className="text-lg font-semibold hidden md:block">NOVACURA Operations</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground group"
                                onClick={() => handleAction("Global Search", "Opening operations search overlay...")}
                            >
                                <Search className="h-5 w-5 transition-colors group-hover:text-primary" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground group"
                                onClick={() => handleAction("Notifications", "You have no new alerts at this time.")}
                            >
                                <Bell className="h-5 w-5 transition-colors group-hover:text-primary" />
                            </Button>
                            <div className="h-8 w-px bg-border mx-2" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                                    {adminUser ? `${adminUser.firstName?.[0] || 'A'}${adminUser.lastName?.[0] || 'D'}` : 'AD'}
                                </div>
                                <span className="text-sm font-medium hidden sm:inline-block">
                                    {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Administrator'}
                                </span>
                                <LogOut className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 bg-muted/50 p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AdminGuard>
    );
}
