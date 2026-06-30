'use client';

import { useState, useEffect } from 'react';
import { mockDB } from "@/lib/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    ShieldCheck, 
    FileSearch, 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    User,
    ArrowRight,
    Search,
    Filter,
    BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ModerationQueuePage() {
    const router = useRouter();
    const [cases, setCases] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const loadData = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                
                if ((parsedUser.role || '').toLowerCase() !== 'moderate_doctor') {
                    router.push('/doctor/dashboard');
                    return;
                }
            }

            // Show all cases that have a doctor assigned but aren't completed yet
            // Prioritize status 'Awaiting Moderation' or general clinical loop status
            const allCases = mockDB.getCases().filter(c => 
                c.doctorId && 
                (c.status === 'Awaiting Moderation' || c.status === 'Under Review' || c.status === 'Slots Shared' || c.status === 'Case Sheet Submitted')
            );
            setCases(allCases);
        };

        loadData();
        window.addEventListener('mock-db-update', loadData);
        return () => window.removeEventListener('mock-db-update', loadData);
    }, [router]);

    const handleApprove = (caseId: string) => {
        mockDB.addTimelineEvent(caseId, {
            status: 'Moderation Approved',
            description: 'Moderate Doctor has reviewed and approved the clinical consultation.',
            completed: true
        });
        
        mockDB.updateCase(caseId, { status: 'Consultation Completed' });
        
        toast({ title: "Review Approved", description: `Case ${caseId} has been finalized.` });
    };

    const handleFlag = (caseId: string) => {
        mockDB.addTimelineEvent(caseId, {
            status: 'Flagged for Quality',
            description: 'Moderate Doctor requested additional clarification on the consultation notes.',
            completed: true
        });
        
        mockDB.updateCase(caseId, { status: 'Under Review' });
        
        toast({ title: "Case Flagged", description: "The primary doctor has been notified." });
    };

    const filteredCases = cases.filter(c => 
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-inter">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-teal-600 mb-1">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Clinical Quality Assurance</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Moderation Queue</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Reviewing {cases.length} active clinical loops for baseline compliance.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Direct Audits" value={cases.length.toString()} icon={FileSearch} color="blue" />
                <StatCard title="Review Pending" value={cases.filter(c => c.status !== 'Under Review').length.toString()} icon={Clock} color="amber" />
                <StatCard title="Quality Benchmark" value="98.4%" icon={BarChart3} color="emerald" />
            </div>

            {/* Main Content */}
            <Card className="border-slate-200/60 shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900">Assessment Review</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase text-slate-400 tracking-tighter">Verify clinical documentation standards.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Filter Case ID or Diagnostic..." 
                                className="pl-9 h-11 bg-slate-50 border-slate-200 rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Clinical Case</th>
                                    <th className="px-6 py-4">Treatment Team</th>
                                    <th className="px-6 py-4">Audit Status</th>
                                    <th className="px-6 py-4">Last Sync</th>
                                    <th className="px-6 py-4 text-right">Moderator Decisions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCases.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                                            No cases currently requiring compliance review.
                                        </td>
                                    </tr>
                                ) : filteredCases.map(c => {
                                    const patient = mockDB.getUserById(c.patientId);
                                    const doctor = c.doctorId ? mockDB.getUserById(c.doctorId) : null;
                                    return (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-black border border-teal-100 shadow-sm">
                                                        {c.id.slice(-2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{c.id}</div>
                                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{c.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span className="font-bold text-slate-700">{patient?.firstName} {patient?.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                                                        <ShieldCheck className="h-3 w-3 text-blue-500" />
                                                        <span>Dr. {doctor?.lastName || 'Unassigned'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <Badge variant="outline" className={`font-black text-[10px] tracking-wide transition-all ${
                                                    c.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200 px-2' :
                                                    'bg-blue-50 text-blue-700 border-blue-200 px-2'
                                                }`}>
                                                    {c.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-6 text-xs text-slate-500 font-bold">
                                                {new Date(c.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-9 px-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all"
                                                        onClick={() => router.push(`/doctor/patients/${c.patientId}`)}
                                                    >
                                                        <FileSearch className="h-4 w-4 mr-2" />
                                                        View Data
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-9 px-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all"
                                                        onClick={() => handleFlag(c.id)}
                                                    >
                                                        <AlertCircle className="h-4 w-4 mr-2" />
                                                        Flag
                                                    </Button>
                                                    <Button 
                                                        className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg shadow-teal-600/20 transition-all active:scale-95"
                                                        onClick={() => handleApprove(c.id)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        teal: "text-teal-600 bg-teal-50 border-teal-100",
    };

    return (
        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                    </div>
                    <div className={`p-4 rounded-2xl border ${colors[color] || colors.blue} transition-transform group-hover:scale-110 shadow-sm animate-in fade-in zoom-in duration-500`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
