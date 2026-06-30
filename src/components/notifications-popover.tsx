'use client';

import React, { useEffect, useState } from 'react';
import { Bell, MessageSquare, UserPlus, CreditCard, Calendar, FileText, CheckCircle2, Inbox, Pill } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockDB, Notification } from "@/lib/mock-db";
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NotificationsPopover({ userId, role }: { userId: string, role: string }) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = () => {
        const notifs = mockDB.getNotifications(userId);
        // Sort by time descending
        const sorted = [...notifs].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNotifications(sorted);
        setUnreadCount(sorted.filter(n => !n.read).length);
    };

    useEffect(() => {
        fetchNotifications();
        window.addEventListener('mock-db-update', fetchNotifications);
        return () => window.removeEventListener('mock-db-update', fetchNotifications);
    }, [userId]);

    const handleNotificationClick = (notif: Notification) => {
        mockDB.markNotificationRead(notif.id);
        fetchNotifications();
        if (notif.redirectUrl) {
            router.push(notif.redirectUrl);
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'assignment': return <UserPlus className="h-4 w-4 text-emerald-500" />;
            case 'payment': return <CreditCard className="h-4 w-4 text-amber-500" />;
            case 'slot': return <Calendar className="h-4 w-4 text-violet-500" />;
            case 'report': return <FileText className="h-4 w-4 text-rose-500" />;
            case 'consultation': return <CheckCircle2 className="h-4 w-4 text-indigo-500" />;
            case 'prescription': return <Pill className="h-4 w-4 text-emerald-500" />;
            default: return <Bell className="h-4 w-4 text-slate-500" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    <Bell className="h-5 w-5 text-slate-500" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
                <div className="flex items-center justify-between p-4 border-b bg-slate-50/50">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <ScrollArea className="max-h-[400px]">
                    {notifications.length > 0 ? (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={cn(
                                        "flex gap-3 p-4 text-left hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0",
                                        !notif.read && "bg-blue-50/30 font-medium"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                        !notif.read ? "bg-white shadow-sm" : "bg-slate-100"
                                    )}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <p className={cn(
                                            "text-xs leading-relaxed",
                                            !notif.read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"
                                        )}>
                                            {notif.message}
                                        </p>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {!notif.read && (
                                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                                <Inbox className="h-5 w-5 text-slate-300" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 tracking-wide">No notifications yet</p>
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-3 border-t bg-slate-50/30 text-center">
                        <button 
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                            onClick={() => {
                                notifications.forEach(n => !n.read && mockDB.markNotificationRead(n.id));
                                fetchNotifications();
                            }}
                        >
                            Mark all as read
                        </button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
