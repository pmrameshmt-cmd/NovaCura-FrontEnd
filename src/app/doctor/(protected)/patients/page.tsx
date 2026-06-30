'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    MessageSquare,
    Calendar,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Loader2
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { mockDB } from "@/lib/mock-db";

const statusStyles: Record<string, string> = {
    'Case Sheet Submitted': 'bg-blue-50 text-blue-700 border-blue-100',
    'Doctor Query Sent': 'bg-amber-50 text-amber-700 border-amber-100',
    'Awaiting Patient Response': 'bg-slate-50 text-slate-700 border-slate-100 italic',
    'Review Completed': 'bg-cyan-50 text-cyan-700 border-cyan-100',
    'Slots Shared': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Slot Selected': 'bg-violet-50 text-violet-700 border-violet-100',
    'Pending Payment': 'bg-rose-50 text-rose-700 border-rose-100 font-bold animate-pulse',
    'Payment Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Consultation Confirmed': 'bg-emerald-500 text-white border-transparent shadow-sm',
    'Consultation Completed': 'bg-slate-900 text-white border-transparent',
    'Reschedule Requested': 'bg-rose-100 text-rose-800 border-rose-300 font-bold underline',
    // Compatibility with existing data
    'Verified': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-100',
    'Pending': 'bg-blue-50 text-blue-700 border-blue-100',
    'NEW': 'bg-slate-50 text-slate-700 border-slate-100',
};

export default function PatientsList() {
    const { toast } = useToast();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedCaseForStatus, setSelectedCaseForStatus] = useState<any>(null);

    const fetchPatients = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const userObj = JSON.parse(userData);
            
            // Fetch live assigned patients from MongoDB Backend
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/assigned-patients`, {
                headers: {
                    'Authorization': `Bearer ${userObj.token}`
                }
            }, 5000);

            if (response.ok) {
                const livePatients = await response.json();
                
                // Map backend fields to frontend props
                const backendPatients = livePatients.map((lp: any) => ({
                    id: lp.patientId, 
                    caseId: lp.caseId,
                    name: lp.name,
                    status: lp.status,
                    lastUpdated: lp.lastUpdated || 'Recently updated',
                    type: lp.treatment || 'General Consultation',
                    urgency: lp.urgency || 'Routine'
                }));
                
                setPatients(backendPatients);
            }
        } catch (error) {
            console.error("Patients fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();

        // Setup initial search from query params if available
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q');
            if (q) setSearchTerm(q);

            const filter = params.get('filter');
            if (filter === 'completed') setStatusFilter('Consultation Completed');
            if (filter === 'pending') setStatusFilter('Pending Action');
        }

        window.addEventListener('mock-db-update', fetchPatients);
        window.addEventListener('storage', fetchPatients);
        return () => {
            window.removeEventListener('mock-db-update', fetchPatients);
            window.removeEventListener('storage', fetchPatients);
        };
    }, []);

    const filteredPatients = patients.filter(p => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            p.name.toLowerCase().includes(searchLower) ||
            p.id.toLowerCase().includes(searchLower) ||
            p.type?.toLowerCase().includes(searchLower);

        const matchesStatus = statusFilter === 'All' || 
            (statusFilter === 'Pending Action' 
                ? ['Case Sheet Submitted', 'Review Completed', 'Awaiting Patient Response'].includes(p.status) 
                : p.status === statusFilter);
        
        return matchesSearch && matchesStatus;
    });

    const handleUnassign = (caseId: string) => {
        if (confirm('Are you sure you want to unassign yourself from this case? It will be returned to the general pool.')) {
            const success = mockDB.unassignCase(caseId);
            if (success) {
                toast({ title: "Case Relinquished", description: "The case has been returned to the pending pool." });
                fetchPatients();
            }
        }
    };

    const handleQuickStatusUpdate = async (caseId: string, nextStatus: string) => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        const userObj = JSON.parse(userData);

        try {
            await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${caseId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userObj.token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });

            toast({ title: "Status Synchronized", description: `Case updated to ${nextStatus}.` });
            setShowStatusModal(false);
            fetchPatients();
        } catch (error) {
            console.error("Status update error:", error);
            toast({ title: "Error", description: "Failed to update clinical status.", variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading clinical directory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Assigned Patients</h1>
                    <p className="text-slate-500 font-medium">Manage and track your assigned medical cases.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 rounded-full border-slate-200 text-slate-500 font-bold">
                        {filteredPatients.length} Total Patients
                    </Badge>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name or case ID..."
                        className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['All', 'Pending Action', 'Review Completed', 'Awaiting Patient Response', 'Reschedule Requested', 'Consultation Confirmed', 'Consultation Completed'].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'ghost'}
                            size="sm"
                            className={`rounded-full px-4 font-bold text-xs uppercase tracking-tight whitespace-nowrap ${statusFilter === status ? 'shadow-md shadow-primary/20' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Patients Table/List */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                                        Patient Info <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Case Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Updated</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
                                                    {patient.name[0]}
                                                </div>
                                                <Link href={`/doctor/patients/${patient.id}`} className="hover:opacity-80 transition-opacity">
                                                    <p className="font-bold text-slate-900 text-sm font-inter leading-none mb-1">{patient.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter hover:text-primary transition-colors cursor-pointer">{patient.id}</p>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-wider bg-slate-50 text-slate-500 border-slate-200">
                                                {patient.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${statusStyles[patient.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {patient.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                                                {patient.status === 'Need More Info' && <AlertCircle className="h-3 w-3" />}
                                                {patient.status === 'New' && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />}
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock className="h-3 w-3" />
                                                <span className="text-[11px] font-bold">{patient.lastUpdated}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/doctor/patients/${patient.id}`}>
                                                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                 <Link href={`/doctor/consultations?patientId=${patient.id}`}>
                                                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl">
                                                        <Link href={`/doctor/availability?patientId=${patient.id}`}>
                                                            <DropdownMenuItem className="font-bold text-xs uppercase p-3 rounded-lg cursor-pointer">
                                                                <Calendar className="h-4 w-4 mr-2" /> Share Slots
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem 
                                                            className="font-bold text-xs uppercase p-3 rounded-lg cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedCaseForStatus(patient);
                                                                setShowStatusModal(true);
                                                            }}
                                                        >
                                                            <Filter className="h-4 w-4 mr-2" /> Update Status
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-slate-100 my-1" />
                                                        <DropdownMenuItem 
                                                            className="font-bold text-xs uppercase p-3 rounded-lg cursor-pointer text-destructive hover:bg-destructive/5"
                                                            onClick={() => handleUnassign(patient.caseId)}
                                                        >
                                                            <User className="h-4 w-4 mr-2" /> Unassign Case
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                                <Search className="h-6 w-6 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No matching patients found</p>
                                            <Button variant="link" size="sm" className="mt-2 text-primary font-bold" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                                                Clear all filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredPatients.length} of {patients.length} results</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-tight" disabled>Prev</Button>
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-tight" disabled>Next</Button>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="bg-slate-900 p-6 text-white text-center">
                        <DialogTitle className="text-xl font-black">Evolve Clinical Status</DialogTitle>
                        <DialogDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">
                            Current: {selectedCaseForStatus?.status}
                        </DialogDescription>
                    </div>
                    <div className="p-6 space-y-3">
                        {[
                            'Case Sheet Submitted',
                            'Review Completed',
                            'Awaiting Patient Response',
                            'Slots Shared',
                            'Consultation Completed'
                        ].map((s) => (
                            <Button 
                                key={s}
                                variant="outline"
                                className={`w-full justify-start h-12 rounded-xl font-bold text-xs uppercase tracking-tight border-slate-100 hover:bg-slate-50 hover:text-primary transition-all ${selectedCaseForStatus?.status === s ? 'bg-primary/5 text-primary border-primary/20' : 'text-slate-600'}`}
                                onClick={() => handleQuickStatusUpdate(selectedCaseForStatus?.caseId, s)}
                            >
                                <div className={`h-2 w-2 rounded-full mr-3 ${selectedCaseForStatus?.status === s ? 'bg-primary' : 'bg-slate-200'}`} />
                                {s}
                            </Button>
                        ))}
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="ghost" className="w-full text-slate-400 font-bold text-xs uppercase" onClick={() => setShowStatusModal(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
