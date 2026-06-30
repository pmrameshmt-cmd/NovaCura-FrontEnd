'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    CheckCircle2,
    MessageSquare,
    Calendar,
    AlertCircle,
    Bell,
    ArrowUpRight,
    Search,
    Loader2,
    RefreshCw,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchWithTimeout } from "@/lib/config";

export default function DoctorDashboard() {
    const { toast } = useToast();
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [doctorId, setDoctorId] = useState<string>('');
    const [doctorSlots, setDoctorSlots] = useState<any[]>([]);

    const fetchDashboardData = async () => {
        setIsSyncing(true);
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const userObj = JSON.parse(userData);
            const token = userObj.token || '';
            setDoctorId(userObj.id);

            // ── Backend MongoDB Sync ──────────────────────────────────────────────
            const patientResponse = await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/assigned-patients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (patientResponse.ok) {
                const data = await patientResponse.json();
                const mappedData = data.map((item: any) => ({
                    id: item.patientId,
                    caseId: item.caseId,
                    name: item.name,
                    email: item.email,
                    status: item.status === 'DOCTOR_ASSIGNED' ? 'Doctor Assigned' : item.status,
                    lastUpdated: new Date().toLocaleDateString(),
                    treatment: item.treatment || 'General Consultation',
                    joined: '2024-02-28',
                    urgency: item.urgency || 'Routine',
                    readiness: item.readiness || { caseSheetCompleted: true, reportsUploaded: true, slotSelected: false, paymentCompleted: false },
                    doctorId: userObj.id
                }));
                setPatients(mappedData);
            }

            // Fetch Slots
            const slotRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/doctor/${userObj.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (slotRes.ok) {
                setDoctorSlots(await slotRes.json());
            }

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
            setTimeout(() => setIsSyncing(false), 500);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        window.addEventListener('mock-db-update', fetchDashboardData);
        window.addEventListener('storage', fetchDashboardData);
        return () => {
            window.removeEventListener('mock-db-update', fetchDashboardData);
            window.removeEventListener('storage', fetchDashboardData);
        };
    }, []);

    const userRole = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}').role || '').toLowerCase() : '';
    const isModerator = userRole === 'moderate_doctor';

    const metrics = {
        personalTotal: patients.length,
        personalCompleted: patients.filter(p => p.status === 'Consultation Completed').length,
        personalPending: patients.filter(p => ['Doctor Assigned', 'Case Sheet Submitted', 'Review Completed', 'Awaiting Patient Response', 'Reschedule Requested'].includes(p.status)).length,
        
        // Global Moderation Stats
        moderationQueue: patients.length, // Simplified for real DB sync
        qualityScore: "98.4%",
        auditThroughput: patients.length,
        
        upcoming: patients.filter(p => ['Consultation Confirmed', 'Slot Selected', 'Slot Confirmed', 'Payment Completed'].includes(p.status)).length,
        critical: patients.filter(p => p.urgency === 'Critical' && p.status !== 'Consultation Completed').length
    };

    const stats = [
        { title: "Assigned Patients", value: metrics.personalTotal.toString(), description: "Your active portfolio", icon: Users, color: "text-blue-600", bg: "bg-blue-50", href: "/doctor/patients" },
        ...(isModerator ? [
            { title: "Moderation Queue", value: metrics.moderationQueue.toString(), description: "Awaiting your audit", icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-50", href: "/doctor/moderation" },
            { title: "Global Throughput", value: metrics.auditThroughput.toString(), description: "Total clinical cases", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50", href: "/doctor/moderation" }
        ] : []),
        { title: "Critical/Urgent", value: metrics.critical.toString(), description: "Personal alerts", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50", href: "/doctor/patients" },
        { title: "Completed", value: metrics.personalCompleted.toString(), description: "History", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", href: "/doctor/patients?filter=completed" }
    ];

    // Today's Queue (Filtered from fetched slots)
    const todayQueue = patients
        .filter(p => ['Consultation Confirmed', 'Slot Selected', 'Slot Confirmed', 'Payment Completed'].includes(p.status))
        .map(p => {
            const slot = doctorSlots.find(s => s.patientId === p.id && (s.status === 'booked' || s.status === 'selected'));
            return {
                ...p,
                time: slot?.time || '10:00 AM',
                isLate: false
            };
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    // Live Notifications & Reminders
    const reminders = [
        ...patients.filter(p => p.status === 'Case Sheet Submitted').map(p => `Pending review for ${p.name}`),
        ...patients.filter(p => p.status === 'Reschedule Requested').map(p => `RESCHEDULE: ${p.name} requested change`),
        ...patients.filter(p => p.urgency === 'Critical').map(p => `CRITICAL: ${p.name} needs attention`)
    ].slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Clinical Workflow Hub</h1>
                        {isSyncing && <RefreshCw className="h-4 w-4 animate-spin text-primary/50" />}
                    </div>
                    <p className="text-slate-500 font-medium">Coordinate your patients, consultations, and performance in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wider border-slate-200" onClick={fetchDashboardData} disabled={isSyncing}>
                        Refresh Hub
                    </Button>
                    <Link href="/doctor/availability">
                        <Button className="rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20">
                            Manage Availability
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Performance Cockpit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <Link key={idx} href={stat.href} className="block">
                        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden cursor-pointer h-full">
                            <CardContent className="p-6">
                                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                    <h2 className="text-2xl font-black text-slate-900">{stat.value}</h2>
                                    <p className="text-[10px] text-slate-400 font-medium">{stat.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Assigned Patients with Readiness & Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-slate-100 bg-white/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-900">Assigned Patients</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase text-slate-400">Preparation tracking & Quick Actions</CardDescription>
                                </div>
                                <Search className="h-4 w-4 text-slate-300" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {patients.map((p) => (
                                    <div key={p.id} className="p-6 hover:bg-white transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${p.urgency === 'Critical' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                                                    {p.name[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-sm font-black text-slate-900">{p.name}</h3>
                                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${p.urgency === 'Critical' ? 'bg-rose-100 text-rose-600' : p.urgency === 'Urgent' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {p.urgency}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {/* Readiness Indicators */}
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`h-1.5 w-1.5 rounded-full ${p.readiness?.caseSheetCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Case Sheet" />
                                                            <div className={`h-1.5 w-1.5 rounded-full ${p.readiness?.reportsUploaded ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Reports" />
                                                            <div className={`h-1.5 w-1.5 rounded-full ${p.readiness?.slotSelected ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Slot" />
                                                            <div className={`h-1.5 w-1.5 rounded-full ${p.readiness?.paymentCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Payment" />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ready: {Math.round((Object.values(p.readiness || {}).filter(Boolean).length / 4) * 100)}%</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase border-l border-slate-200 pl-3">Status: {p.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Quick Actions */}
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600" title="View Case" onClick={() => router.push(`/doctor/patients/${p.id}`)}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                                 <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-violet-50 hover:text-violet-600" title="Ask Question" onClick={() => router.push(`/doctor/consultations?patientId=${p.id}`)}>
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-amber-50 hover:text-amber-600" title="Share Slots" onClick={() => router.push('/doctor/availability')}>
                                                    <Calendar className="h-4 w-4" />
                                                </Button>
                                                 <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600" title="Submit for Moderation" onClick={async () => {
                                                    try {
                                                        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
                                                        await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${p.caseId}/status`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userObj.token}` },
                                                            body: JSON.stringify({ status: 'Awaiting Moderation' }),
                                                        }, 5000);
                                                        toast({ title: "Submitted", description: "Case sent to Moderate Doctor for review." });
                                                        fetchDashboardData();
                                                    } catch (e) {
                                                        toast({ title: "Error", description: "Failed to submit for moderation.", variant: "destructive" });
                                                    }
                                                 }}>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                 </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Queue */}
                    <Card className="border-none shadow-sm bg-slate-900 overflow-hidden">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-white text-base font-black">Today&apos;s Consultation Queue</CardTitle>
                                    <CardDescription className="text-white/40 text-[10px] font-bold uppercase">Scheduled for {new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}</CardDescription>
                                </div>
                                <Calendar className="h-5 w-5 text-white/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {todayQueue.length > 0 ? todayQueue.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 group hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center min-w-[60px]">
                                            <p className="text-sm font-black text-white">{item.time}</p>
                                            <p className="text-[10px] font-black text-primary uppercase">Confirmed</p>
                                        </div>
                                        <div className="h-8 w-[1px] bg-white/10" />
                                        <div>
                                            <p className="text-sm font-bold text-white mb-0.5">{item.name}</p>
                                            <p className="text-[10px] font-medium text-white/40 uppercase">{item.treatment}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white text-[10px] font-bold uppercase transition-all opacity-0 group-hover:opacity-100">Reschedule</Button>
                                         <Link href={`/doctor/consultations?patientId=${item.id}`}>
                                            <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 text-[10px] font-black uppercase rounded-lg">Join Call</Button>
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center">
                                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <Calendar className="h-5 w-5 text-white/20" />
                                    </div>
                                    <p className="text-white/40 font-black uppercase text-[10px] tracking-widest">No consultations today</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column: Reminders & Escalation */}
                <div className="space-y-6">
                    {/* Performance Metrics */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Response Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black text-slate-500 uppercase">Avg. Response Time</p>
                                    <p className="text-sm font-black text-slate-900">4.2h</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%] rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black text-slate-500 uppercase">Consultation Success</p>
                                    <p className="text-sm font-black text-slate-900">92%</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[92%] rounded-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Reminders */}
                    <Card className="border-none shadow-sm bg-amber-50/50 border-l-4 border-l-amber-400">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-amber-700">Workflow Reminders</CardTitle>
                                <span className="h-5 w-5 bg-amber-200 text-amber-700 flex items-center justify-center rounded-full text-[10px] font-black">{reminders.length}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                            {reminders.map((rem, i) => (
                                <div key={i} className="flex gap-3 text-xs font-semibold text-amber-900/70 border-b border-amber-200/50 pb-2 last:border-0 last:pb-0">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                    {rem}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Escalation Center */}
                    <Card className="border-none shadow-sm bg-rose-50 border-l-4 border-l-rose-500 overflow-hidden group">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-black text-rose-900 mb-1 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" /> Escalation Flow
                            </h3>
                            <p className="text-xs font-medium text-rose-800/60 mb-4">Transfer critical cases to a specialist, senior admin, or affiliated hospital.</p>
                            <Button className="w-full bg-rose-900 text-white hover:bg-rose-950 text-[10px] font-black uppercase rounded-xl transition-all active:scale-95">Initiate Escalation</Button>
                        </CardContent>
                    </Card>
                    
                    <Link href="/doctor/patients" className="block p-8 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 text-center hover:bg-slate-50 transition-colors group">
                        <Users className="h-8 w-8 text-slate-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Browse Full Repository</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
