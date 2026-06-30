'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { mockDB } from "@/lib/mock-db";
import { fetchWithTimeout, API_BASE_URL } from "@/lib/config";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    FileCheck,
    Activity,
    Clock,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    UserPlus,
    ShieldAlert
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import React from "react";

const registrationData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 9 },
    { name: 'Fri', count: 12 },
    { name: 'Sat', count: 8 },
    { name: 'Sun', count: 6 },
];

const revenueData = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 5900 },
    { month: 'Jun', revenue: 7200 },
];

export default function AdminDashboardPage() {
    const [metrics, setMetrics] = useState({
        patients: 0,
        cases: 0,
        activeTreatments: 0,
        pending: 0,
        newReg: 0,
        revenue: 0,
        bookings: 0
    });
	const [ongoingCases, setOngoingCases] = useState<any[]>([]);
	const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setIsSyncing(true);
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;
            const token = JSON.parse(userData).token || '';

            // ── Backend MongoDB Sync ──────────────────────────────────────────────
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/admin/patients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const patients = await response.json();
                
                const dashboardMetrics = {
                    patients: patients.length,
                    cases: patients.filter((p: any) => p.status !== 'No Record').length,
                    activeTreatments: patients.filter((p: any) => p.assignedDoctor && p.status !== 'Consultation Completed').length,
                    pending: patients.filter((p: any) => !p.assignedDoctor && p.status !== 'No Record').length,
                    newReg: patients.length,
                    revenue: patients.filter((p: any) => ['Payment Completed', 'Consultation Confirmed', 'Consultation Completed'].includes(p.status)).length * 100,
                    bookings: 0 // To be implemented with real booking API
                };

                setMetrics(dashboardMetrics);

                const live = patients
                    .filter((p: any) => p.status !== 'No Record' && p.status !== 'Consultation Completed')
                    .slice(0, 10)
                    .map((p: any) => ({
                        patient: p.name,
                        treatment: p.treatment,
                        doctor: p.assignedDoctor || 'Unassigned',
                        status: p.status,
                        time: 'Recently'
                    }));
                setOngoingCases(live);
                setAuditLogs([]); // No backend audit log yet
            }
        } catch (error) {
            console.error("Error loading dashboard metrics:", error);
        } finally {
            setLoading(false);
            setTimeout(() => setIsSyncing(false), 500);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        window.addEventListener('mock-db-update', fetchDashboardData);
        return () => window.removeEventListener('mock-db-update', fetchDashboardData);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Real-time overview of NOVACURA platform activity.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Patients"
                    value={metrics.patients.toString()}
                    icon={Users}
                    trend="Signed up in portal"
                    trendType="neutral"
                    href="/admin/patients?status=all"
                />
                <KPICard
                    title="With Case Sheets"
                    value={metrics.cases.toString()}
                    icon={FileCheck}
                    trend="Medical history submitted"
                    trendType="up"
                    href="/admin/patients?status=Case Sheet Submitted"
                />
                <KPICard
                    title="Active Workflows"
                    value={metrics.activeTreatments.toString()}
                    icon={Activity}
                    trend="Currently ongoing"
                    trendType="neutral"
                    href="/admin/patients?status=Active"
                />
                <KPICard
                    title="Pending Reviews"
                    value={metrics.pending.toString()}
                    icon={Clock}
                    trend="Require doctor action"
                    trendType="down"
                    href="/admin/patients?status=Pending"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="New Registrations"
                    value={metrics.newReg.toString()}
                    subtitle="Today"
                    icon={UserPlus}
                    trend="All time"
                    trendType="neutral"
                    href="/admin/patients?status=NEW"
                />
                <KPICard
                    title="Revenue"
                    value={`$${metrics.revenue.toLocaleString()}`}
                    subtitle="This Month"
                    icon={DollarSign}
                    trend="From $100 fees"
                    trendType="up"
                    href="/admin/finance"
                />
                <KPICard
                    title="Booked Consultations"
                    value={metrics.bookings.toString()}
                    icon={TrendingUp}
                    trend="Slots reserved"
                    trendType="up"
                    href="/admin/bookings"
                />
                <KPICard
                    title="Completion Rate"
                    value={metrics.cases > 0 ? `${Math.round(((metrics.cases - metrics.activeTreatments) / metrics.cases) * 100)}%` : '0%'}
                    icon={Activity}
                    trend="Successful cases"
                    trendType="up"
                    color="primary"
                    href="/admin/reports"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Registration Trends</CardTitle>
                        <CardDescription>Daily new patient registrations over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={registrationData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Analytics</CardTitle>
                        <CardDescription>Monthly revenue growth trajectory.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                    {revenueData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === revenueData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Approve/Reject conversion</span>
                            <span className="text-sm font-medium">85%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[85%]" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Document verification speed</span>
                            <span className="text-sm font-medium">4.2h avg</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[65%]" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Inquiry response rate</span>
                            <span className="text-sm font-medium">98%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[98%]" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Ongoing Treatments</CardTitle>
                            <CardDescription>Live patient cases currently in progress.</CardDescription>
                        </div>
                        <Link href="/admin/patients">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {ongoingCases.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-6">No active cases right now.</p>
                            ) : ongoingCases.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {item.patient[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{item.patient}</p>
                                            <p className="text-xs text-muted-foreground">{item.treatment} &middot; {item.doctor}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs">
                                        <div className={`font-black uppercase tracking-tighter ${item.status === 'Awaiting Assignment' ? 'text-amber-500 animate-pulse' : 'text-primary'}`}>{item.status}</div>
                                        <div className="text-muted-foreground font-medium">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardHeader className="pt-0">
                        <Button variant="ghost" className="w-full text-xs text-primary hover:bg-primary/5 hover:text-primary font-bold uppercase tracking-widest" asChild>
                            <Link href="/admin/patients">Go to Patient Management →</Link>
                        </Button>
                    </CardHeader>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-rose-500" />
                            <div>
                                <CardTitle className="text-lg">Security Audit Feed</CardTitle>
                                <CardDescription>System flags and data integrity logs.</CardDescription>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Download Audit History</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {auditLogs.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-6">No security alerts detected.</p>
                            ) : auditLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                                        log.level === 'security' ? 'bg-rose-500 animate-pulse' : 
                                        log.level === 'warning' ? 'bg-amber-500' : 'bg-slate-300'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">
                                                {log.event}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            {log.details}
                                        </p>
                                    </div>
                                    {log.level === 'security' && (
                                        <Badge variant="destructive" className="uppercase text-[8px] font-black h-5">Action Required</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KPICard({ title, value, subtitle, icon: Icon, trend, trendType, color = "default", href }: any) {
    const CardContentWrapper = href ? Link : 'div';
    
    return (
        <Card className={href ? "hover:shadow-md transition-all cursor-pointer group" : ""}>
            <CardContentWrapper href={href || '#'}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</h3>
                        <div className={`p-2 rounded-lg ${color === 'primary' ? 'bg-primary/20' : 'bg-secondary'} group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-4 w-4 ${color === 'primary' ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{value}</div>
                        {subtitle && <p className="text-[10px] text-muted-foreground uppercase">{subtitle}</p>}
                        <div className="flex items-center gap-1 mt-2">
                            {trendType === 'up' && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                            {trendType === 'down' && <ArrowDownRight className="h-3 w-3 text-rose-500" />}
                            <p className={`text-xs ${trendType === 'up' ? 'text-emerald-500' :
                                trendType === 'down' ? 'text-rose-500' :
                                    'text-muted-foreground'
                                }`}>
                                {trend}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </CardContentWrapper>
        </Card>
    );
}
