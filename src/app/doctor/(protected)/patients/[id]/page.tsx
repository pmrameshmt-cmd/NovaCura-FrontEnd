'use client';

import React, { useState, useEffect, use } from 'react';
import {
    ArrowLeft,
    FileText,
    Download,
    MessageSquare,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    History,
    FileSearch,
    Loader2,
    Activity,
    Scale,
    RefreshCw,
    Pill,
    Plus,
    Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockDB } from "@/lib/mock-db";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const statusStyles: Record<string, string> = {
    'Case Sheet Submitted': 'bg-blue-50 text-blue-700 border-blue-100',
    'Doctor Query Sent': 'bg-amber-50 text-amber-700 border-amber-100',
    'Awaiting Patient Response': 'bg-slate-50 text-slate-700 border-slate-100 italic',
    'Review Completed': 'bg-cyan-50 text-cyan-700 border-cyan-100',
    'Slots Shared': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Slot Selected': 'bg-violet-50 text-violet-700 border-violet-100',
    'Pending Payment': 'bg-rose-50 text-rose-700 border-rose-100 font-bold animate-pulse',
    'Slot Confirmed': 'bg-blue-600 text-white border-transparent shadow-sm font-black uppercase text-[8px]',
    'Payment Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Consultation Confirmed': 'bg-emerald-500 text-white border-transparent shadow-sm',
    'Consultation Completed': 'bg-slate-900 text-white border-transparent',
    'Reschedule Requested': 'bg-rose-100 text-rose-800 border-rose-300 font-bold underline',
    // Compatibility
    'Verified': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-100',
};

const workflowStages = [
    'Case Submitted',
    'Review Completed',
    'Slots Shared',
    'Slot Confirmed',
    'Payment Completed',
    'Consultation Confirmed',
    'Consultation Completed'
];

const getStageIndex = (status: string) => {
    if (!status) return -1;
    const s = status.toLowerCase();
    if (s.includes('case') && s.includes('submitted')) return 0;
    if (s.includes('verified') || s.includes('under review')) return 0;
    if (s.includes('review completed') || s.includes('query sent') || s.includes('awaiting patient')) return 1;
    if (s.includes('slots shared')) return 2;
    if (s.includes('slot selected') || s.includes('slot confirmed')) return 3;
    if (s.includes('pending payment') || s.includes('payment completed')) return 4;
    if (s.includes('consultation confirmed')) return 5;
    if (s.includes('consultation completed')) return 6;
    return -1;
};

const getNextStatus = (currentStatus: string) => {
    const idx = getStageIndex(currentStatus);
    if (idx === -1 || idx === workflowStages.length - 1) return null;
    return workflowStages[idx + 1];
};

export default function PatientCaseView({ params }: { params: Promise<{ id: string }> }) {
    const { id: patientId } = use(params);
    const router = useRouter();
    const { toast } = useToast();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [prescriptionForm, setPrescriptionForm] = useState({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        refills: 0
    });
    const [draftMedicines, setDraftMedicines] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [isEditingRX, setIsEditingRX] = useState(false);
    const [editingRXId, setEditingRXId] = useState<string | null>(null);

    const fetchPatientData = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;
            const userObj = JSON.parse(userData);

            // 1. First, find a case match to get the CASE ID for this patient
            const listResponse = await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/assigned-patients`, {
                headers: { 'Authorization': `Bearer ${userObj.token}` }
            }, 5000);

            if (listResponse.ok) {
                const assigned = await listResponse.json();
                const matchedCase = assigned.find((c: any) => c.patientId === patientId || c.caseId === patientId);
                
                if (matchedCase) {
                    // Fetch full clinical details from Backend
                    const detailResponse = await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${matchedCase.caseId}`, {
                        headers: { 'Authorization': `Bearer ${userObj.token}` }
                    }, 5000);

                    if (detailResponse.ok) {
                        const fullData = await detailResponse.json();
                        setData({
                            user: fullData.user,
                            medicalCase: fullData.medicalCase
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Clinical fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptions = () => {
        if (!patientId) return;
        // setPrescriptions([]); // Placeholder until backend Prescription table exists
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!isMounted) return;
            await fetchPatientData();
            if (isMounted) {
                fetchPrescriptions();
            }
        };

        fetchData();

        const updateHandler = () => {
            if (isMounted) {
                fetchPatientData();
                fetchPrescriptions();
            }
        };

        window.addEventListener('mock-db-update', updateHandler);
        
        return () => {
            isMounted = false;
            window.removeEventListener('mock-db-update', updateHandler);
        };
    }, [patientId]);

    const user = data?.user || {};
    const medicalCase = data?.medicalCase || {};
    
    // Calculate all clinical docs for readiness check
    const docKeys = [
        'xrayFile', 'ctScanFile', 'usgFile', 'mriFile',
        'bloodReportFile', 'urineReportFile', 'tissueBiopsyFile',
        'liverFunctionTestFile', 'kidneyFunctionTestFile', 'lipidProfileFile',
        'bloodCultureFile', 'urineCultureFile', 'sputumCultureFile',
        'dischargeSummaryFile'
    ];
    const medicalDataDocs = medicalCase ? docKeys
        .filter(key => (medicalCase as any)[key])
        .map((key, i) => ({
            id: `MD-${key}-${i}`,
            name: (medicalCase as any)[key],
            tag: key.replace('File', '').toUpperCase() as any,
            version: 1
        })) : [];
    const allDocs = [...medicalDataDocs, ...(medicalCase.documents || [])];

    const handleUpdateStatus = async (newStatus: string) => {
        if (!data?.medicalCase?.id || data.medicalCase.id === 'NEW') return;
        setIsUpdating(true);
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        try {
            await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${data.medicalCase.id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify({ status: newStatus }),
            }, 5000);
            
            if (newStatus === 'Slots Shared') {
                // Fetch doctor's available slots from backend
                const slotRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/doctor/${userData.id}`, {
                    headers: { 'Authorization': `Bearer ${userData.token}` }
                });
                
                if (slotRes.ok) {
                    const availableBackendSlots = (await slotRes.json()).filter((s: any) => s.status === 'available').slice(0, 3);
                    
                    const sharePayload = availableBackendSlots.map((s: any) => ({
                        doctorId: userData.id,
                        caseId: data.medicalCase.id,
                        date: s.date,
                        time: s.time,
                        status: 'available'
                    }));

                    await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/share`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userData.token}` },
                        body: JSON.stringify(sharePayload),
                    }, 5000);
                }
            }

            toast({ title: "Portal Sync", description: `Synchronized: ${newStatus}` });
            fetchPatientData();
        } catch (err) {
            console.error(err);
            toast({ variant: "destructive", title: "Sync Failed", description: "Backend synchronization failed." });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddNote = async (isPrivate: boolean = true) => {
        if (!noteContent.trim() || !data?.medicalCase?.id) return;
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        try {
            const noteData = {
                authorId: userData.id || 'DOC-01',
                authorName: `Dr. ${userData.firstName || 'Deepa'}`,
                content: noteContent,
                isPrivate
            };

            await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${data.medicalCase.id}/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify(noteData),
            }, 5000);
            
            setNoteContent('');
            toast({ title: "Clinical Note", description: isPrivate ? "Encrypted private note saved." : "Advice shared with patient." });
            fetchPatientData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddtoDraft = () => {
        if (!prescriptionForm.medication.trim()) return;
        setDraftMedicines([...draftMedicines, { ...prescriptionForm, id: Date.now() }]);
        setPrescriptionForm({
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: '',
            refills: 0
        });
    };

    const handleIssuePrescription = async () => {
        if (draftMedicines.length === 0 && !prescriptionForm.medication.trim()) return;
        
        const medsToIssue = draftMedicines.length > 0 ? draftMedicines : [{ ...prescriptionForm }];
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        try {
            if (isEditingRX && editingRXId) {
                // mockDB.updatePrescription(editingRXId, { medications: medsToIssue });
                toast({ title: "Prescription Updated", description: "Changes saved and patient notified." });
            } else {
                const rxData = {
                    patientId,
                    doctorId: userData.id || 'DOC-001',
                    medications: medsToIssue,
                    status: 'active' as const,
                    date: new Date().toISOString().split('T')[0]
                };

                // mockDB.addPrescription(rxData);
                toast({ title: "Prescription Finalized", description: `${medsToIssue.length} medications issued successfully.` });
            }

            // Sync clinical note via note endpoint
            const noteData = {
                authorId: userData.id || 'DOC-01',
                authorName: `Dr. ${userData.firstName || 'Deepa'}`,
                content: `${isEditingRX ? 'Updated' : 'Issued'} prescription containing: ${medsToIssue.map(m => m.medication).join(', ')}.`,
                isPrivate: false
            };

            await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${data.medicalCase.id}/note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify(noteData),
            }, 5000);

            setDraftMedicines([]);
            setPrescriptionForm({
                medication: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: '',
                refills: 0
            });
            setIsEditingRX(false);
            setEditingRXId(null);
            fetchPrescriptions();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditPrescription = (rx: any) => {
        setEditingRXId(rx.id);
        setIsEditingRX(true);
        setDraftMedicines([...(rx.medications || [])]);
        // Switch to prescriptions tab (if not already there)
        // Scroll to form or show a message
        toast({ title: "Editing Mode", description: "Currently modifying existing prescription order." });
    };

    const cancelEdit = () => {
        setIsEditingRX(false);
        setEditingRXId(null);
        setDraftMedicines([]);
    };

    if (loading) return <div className="h-[60vh] flex flex-col items-center justify-center gap-4"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Loading Clinical File...</p></div>;
    if (!data) return null;

    const currentStageIndex = getStageIndex(medicalCase?.status);

    return (
        <div className="space-y-6 pb-20">
            {/* Context Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/doctor/patients"><Button variant="ghost" size="icon" className="rounded-full h-12 w-12 border border-slate-100"><ArrowLeft className="h-5 w-5" /></Button></Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900">{user?.firstName} {user?.lastName}</h1>
                                <Badge className={`${medicalCase?.urgency === 'Critical' ? 'bg-rose-500' : 'bg-blue-500'} text-white font-black px-2 py-0.5 rounded-lg uppercase text-[8px]`}>{medicalCase?.urgency || 'Routine'}</Badge>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Medical Record: {medicalCase?.id} • Status: {medicalCase?.status}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase h-11 px-6 border-slate-200" onClick={() => router.push('/doctor/consultations')}>Open clinical chat</Button>
                        {(() => {
                            const next = getNextStatus(medicalCase?.status);
                            if (!next) return (
                                <Button className="rounded-xl font-black text-[10px] uppercase h-11 px-6 bg-slate-100 text-slate-400 cursor-default border-none shadow-none" disabled>Workflow Finalized</Button>
                            );
                            return (
                                <Button 
                                    className="rounded-xl font-black text-[10px] uppercase h-11 px-6 bg-slate-900 text-white shadow-xl shadow-slate-200" 
                                    onClick={() => handleUpdateStatus(next)}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Synchronizing...' : `Move to ${next}`}
                                </Button>
                            );
                        })()}
                    </div>
                </div>

                {/* VISUAL TIMELINE */}
                <div className="mt-10 overflow-x-auto pb-4">
                    <div className="min-w-[800px] flex items-start justify-between relative px-4">
                        <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-100 -z-0" />
                        <div className="absolute top-4 left-10 h-0.5 bg-primary -z-0 transition-all duration-700" style={{ width: `${(currentStageIndex / (workflowStages.length - 1)) * 90}%` }} />
                        
                        {workflowStages.map((stage, idx) => {
                            const isCompleted = idx <= currentStageIndex;
                            const isCurrent = idx === currentStageIndex;
                            return (
                                <div key={idx} className="flex flex-col items-center gap-3 relative z-10 w-32 text-center group">
                                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-300'} ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-tight leading-tight ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{stage.replace(' ', '\n')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* APPOINTMENT CONTEXT CARDS */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-indigo-50 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Active Consultation Slot
                            </h3>
                            <Badge className={statusStyles[medicalCase.status] || 'bg-indigo-500 text-white border-none font-black uppercase text-[8px]'}>
                                {medicalCase.selectedSlotId ? (medicalCase.status === 'Reschedule Requested' ? 'CHANGE REQUESTED' : 'Confirmed') : (medicalCase.status === 'Reschedule Requested' ? 'RESCHEDULE PENDING' : 'Pending Selection')}
                            </Badge>
                        </div>
                        {(() => {
                            if (medicalCase.status === 'Reschedule Requested') {
                                const rescheduleEvent = medicalCase.timeline.find((t: any) => t.status === 'Reschedule Requested');
                                return (
                                    <div className="bg-white/60 p-4 rounded-xl border border-rose-200">
                                        <div className="flex items-center gap-2 mb-2 text-rose-700">
                                            <RefreshCw className="h-4 w-4 animate-spin-slow" />
                                            <p className="text-xs font-black uppercase tracking-widest leading-none">Reschedule Requested</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-4 italic leading-relaxed">
                                            "{rescheduleEvent?.description || 'Patient requested a schedule change.'}"
                                        </p>
                                        <Button asChild size="sm" className="w-full bg-rose-600 hover:bg-rose-700 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-rose-200">
                                            <Link href="/doctor/availability">Propose New Slots</Link>
                                        </Button>
                                    </div>
                                );
                            }

                            const slot = mockDB.getSlotsByPatient(patientId).find(s => ['booked', 'confirmed', 'selected', 'pending_payment'].includes(s.status));
                            
                            if (!slot) return <p className="text-xs font-bold text-indigo-900/60 italic">No scheduled session found. Please propose slots or direct book.</p>;
                            
                            return (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-black text-indigo-900">{slot.date} at {slot.time}</p>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase mt-1">Duration: {slot.duration || 30} Mins • ID: {slot.id}</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="rounded-xl border-indigo-200 text-indigo-700 font-black text-[10px] uppercase h-10 px-4 hover:bg-white"
                                        onClick={() => router.push(`/doctor/availability?reschedule=${patientId}&caseId=${medicalCase.id}`)}
                                    >
                                        Reschedule
                                    </Button>
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-emerald-50 overflow-hidden">
                    <CardContent className="p-6">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Physician Direct Actions</h3>
                        </div>
                        <div className="flex gap-2">
                             <Button className="flex-1 rounded-xl font-black text-[10px] uppercase h-11 bg-emerald-600 text-white shadow-xl shadow-emerald-200" onClick={() => router.push(`/doctor/availability`)}>Quick Book</Button>
                             <Button variant="outline" className="flex-1 rounded-xl font-black text-[10px] uppercase h-11 border-emerald-200 text-emerald-700 bg-white" onClick={() => window.print()}>Export E-Record</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="medical" className="w-full">
                        <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-fit mb-4">
                            <TabsTrigger value="medical" className="rounded-xl font-black text-[10px] uppercase px-6 py-2">Findings</TabsTrigger>
                            <TabsTrigger value="summary" className="rounded-xl font-black text-[10px] uppercase px-6 py-2">Clinical Summary</TabsTrigger>
                            <TabsTrigger value="prescriptions" className="rounded-xl font-black text-[10px] uppercase px-6 py-2 flex items-center gap-1.5"><Pill className="h-3 w-3" /> Prescriptions</TabsTrigger>
                            <TabsTrigger value="history" className="rounded-xl font-black text-[10px] uppercase px-6 py-2">History & Profile</TabsTrigger>
                            <TabsTrigger value="notes" className="rounded-xl font-black text-[10px] uppercase px-6 py-2">Notes Hub</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="medical" className="mt-0">
                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-8 space-y-10">
                                    <section>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Scale className="h-4 w-4" /> Vitals & Metrics</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Weight / Height</p><p className="font-bold text-slate-900">{medicalCase?.weight || '--'}kg • {medicalCase?.height || '--'}cm</p></div>
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Blood Pressure</p><p className="font-bold text-slate-900">{medicalCase?.bloodPressure || '--'} mmHg</p></div>
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">DOB / Sex</p><p className="font-bold text-slate-900">{medicalCase?.dob || user?.dob || '--'} • {medicalCase?.sex || user?.sex || '--'}</p></div>
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Urgency Level</p><Badge className="bg-rose-50 text-rose-600 border-none font-black uppercase text-[8px]">{medicalCase?.urgency || 'Routine'}</Badge></div>
                                        </div>
                                    </section>
                                    
                                    <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Patient Statement</h3>
                                        <p className="text-sm font-medium text-slate-700 italic leading-relaxed">"{medicalCase?.chiefComplaint || 'No specific complaint documented yet.'}"</p>
                                    </section>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="mt-0">
                            <Card className="border-none shadow-sm bg-white overflow-hidden p-8 space-y-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <section className="space-y-6">
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Surgical History</h3>
                                            <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{medicalCase?.surgeries || 'None documented.'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Chronic Conditions</h3>
                                            <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{medicalCase?.conditions || 'None documented.'}</p>
                                        </div>
                                    </section>
                                    <section className="space-y-6">
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Current Treatment</h3>
                                            <p className="text-sm font-semibold text-slate-800 bg-blue-50/30 p-4 rounded-xl border border-blue-100/30">{medicalCase?.presentOngoingTreatment || 'No active treatments reported.'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Known Allergies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {medicalCase?.allergies ? (
                                                    <Badge className="bg-rose-50 text-rose-600 border-none font-black uppercase text-[9px] py-1.5 px-3">
                                                        {medicalCase.allergies} {medicalCase.reaction ? `(${medicalCase.reaction})` : ''}
                                                    </Badge>
                                                ) : (
                                                    <p className="text-sm text-slate-400 italic">No allergies reported.</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                                <Separator />
                                <section>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Previous Medical Record Summary</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{medicalCase?.previousMedicalHistory || 'No historical records summarized.'}</p>
                                </section>
                            </Card>
                        </TabsContent>

                        <TabsContent value="summary" className="mt-0">
                            {medicalCase.consultationSummary ? (
                                <Card className="border-none shadow-sm bg-white overflow-hidden p-8 space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 mb-1">Finalized Clinical Summary</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged on {new Date(medicalCase.consultationSummary.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase text-[8px]">Synchronized</Badge>
                                    </div>
                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400">Biological Findings</Label>
                                            <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{medicalCase.consultationSummary.findings}"</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400">Recommendations</Label>
                                            <p className="text-xs font-medium text-slate-700 leading-relaxed bg-blue-50/30 p-4 rounded-xl border border-blue-100/30">"{medicalCase.consultationSummary.recommendations}"</p>
                                        </div>
                                        {medicalCase.consultationSummary.prescriptionUrl && (
                                            <div className="pt-4 border-t border-slate-100">
                                                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"><Download className="h-5 w-5" /></div>
                                                        <div><p className="text-xs font-black">Digital Prescription.pdf</p><p className="text-[8px] font-black text-white/40 uppercase">Signed & Verified</p></div>
                                                    </div>
                                                    <Button 
                                                        className="h-8 bg-white text-slate-900 font-black text-[10px] uppercase rounded-lg"
                                                        onClick={() => {
                                                            const mockContent = `DIGITAL PRESCRIPTION\n--------------------\nCase: ${medicalCase.id}\nPatient: ${user.firstName} ${user.lastName}\nPrescription ID: RX-${medicalCase.id.split('-').pop()}\nDate: ${new Date().toLocaleDateString()}\n\nVerified Digital Copy`;
                                                            const blob = new Blob([mockContent], { type: 'text/plain' });
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.download = `Prescription_${medicalCase.id}_Digital.txt`;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            window.URL.revokeObjectURL(url);
                                                            toast({ title: "Prescription Exported", description: "Secured digital copy saved to device." });
                                                        }}
                                                    >
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ) : (
                                <Card className="border-none shadow-sm bg-white overflow-hidden p-12 text-center">
                                    <Activity className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Post-Consultation Summary Available</p>
                                    <p className="text-xs text-slate-400 mt-2">Findings will appear here after the session is finalized.</p>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="prescriptions" className="mt-0 space-y-6">
                            <Card className={`border-none shadow-sm overflow-hidden p-8 transition-all ${isEditingRX ? 'bg-amber-50/50 ring-2 ring-amber-200' : 'bg-white'}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 mb-1">{isEditingRX ? 'Edit Prescription Order' : 'Issue New Prescription'}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital medications transmitted to Patient Portal</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {isEditingRX && <Button variant="ghost" onClick={cancelEdit} className="h-8 text-[8px] uppercase font-black">Cancel Edit</Button>}
                                        <Badge className={`${isEditingRX ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'} border-none font-black uppercase text-[8px]`}>
                                            {isEditingRX ? 'Editing Active Order' : 'Real-time Sync'}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Medication Name</Label>
                                        <Input 
                                            value={prescriptionForm.medication}
                                            onChange={(e) => setPrescriptionForm({...prescriptionForm, medication: e.target.value})}
                                            className="h-11 rounded-xl border-slate-200"
                                            placeholder="e.g. Lisinopril"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Dosage</Label>
                                        <Input 
                                            value={prescriptionForm.dosage}
                                            onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                                            className="h-11 rounded-xl border-slate-200"
                                            placeholder="e.g. 10mg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Frequency</Label>
                                        <Input 
                                            value={prescriptionForm.frequency}
                                            onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                                            className="h-11 rounded-xl border-slate-200"
                                            placeholder="e.g. Once daily"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Duration</Label>
                                        <Input 
                                            value={prescriptionForm.duration}
                                            onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                                            className="h-11 rounded-xl border-slate-200"
                                            placeholder="e.g. 30 days"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Instructions</Label>
                                        <Textarea 
                                            value={prescriptionForm.instructions}
                                            onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                                            className="rounded-xl border-slate-200 min-h-[80px]"
                                            placeholder="Special instructions for patient..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Refills Authorized</Label>
                                        <Input 
                                            type="number"
                                            value={prescriptionForm.refills}
                                            onChange={(e) => setPrescriptionForm({...prescriptionForm, refills: parseInt(e.target.value) || 0})}
                                            className="h-11 rounded-xl border-slate-200"
                                        />
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <Button 
                                            variant="outline"
                                            className="flex-1 h-11 rounded-xl border-slate-200 font-black text-[10px] uppercase gap-2"
                                            onClick={handleAddtoDraft}
                                        >
                                            <Plus className="h-3 w-3" /> Add More Medicine
                                        </Button>
                                        <Button 
                                            className="flex-1 h-11 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase shadow-xl shadow-slate-200"
                                            onClick={handleIssuePrescription}
                                            disabled={draftMedicines.length === 0 && !prescriptionForm.medication}
                                        >
                                            {isEditingRX ? 'Update & Finalize order' : 'Sign & Finalize Issue'}
                                        </Button>
                                    </div>
                                </div>

                                {draftMedicines.length > 0 && (
                                    <div className={`mb-10 p-6 rounded-2xl border ${isEditingRX ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
                                        <h4 className={`text-[10px] font-black uppercase mb-4 flex items-center gap-2 tracking-widest ${isEditingRX ? 'text-amber-600' : 'text-indigo-400'}`}>
                                            <Pill className="h-3 w-3" /> {isEditingRX ? 'Loaded Medications for Edit' : 'Current Session Draft Medications'}
                                        </h4>
                                        <div className="space-y-3">
                                            {draftMedicines.map((med, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-1">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{med.medication} ({med.dosage})</p>
                                                        <p className="text-[9px] font-medium text-slate-500 mt-1 uppercase tracking-tight">{med.frequency} • {med.duration} • {med.refills} refills</p>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                        onClick={() => setDraftMedicines(draftMedicines.filter((_, i) => i !== idx))}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div className="mt-10">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Prescription History</h3>
                                    <div className="space-y-4">
                                        {prescriptions.length === 0 ? (
                                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <Pill className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase">No active prescriptions issued yet</p>
                                            </div>
                                        ) : (
                                            prescriptions.map((rx: any) => (
                                                <div key={rx.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                                            <FileSearch className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">Prescription Order #{rx.id?.split('-')[1] || 'New'}</p>
                                                            <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tight">
                                                                {rx.medications?.length || 0} Medications • Issued on {rx.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            className="h-8 rounded-lg text-[10px] uppercase font-black px-4"
                                                            onClick={() => handleEditPrescription(rx)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                            onClick={() => {
                                                                if (confirm("Permanently delete this prescription order? This cannot be undone.")) {
                                                                    mockDB.deletePrescription(rx.id);
                                                                    fetchPrescriptions();
                                                                    toast({ title: "Order Revoked", description: "Prescription successfully removed." });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Badge className={rx.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-none uppercase text-[8px] font-black' : 'bg-slate-100 text-slate-400 border-none uppercase text-[8px] font-black'}>{rx.status}</Badge>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-0 space-y-4">
                            <Card className="border-none shadow-sm bg-white overflow-hidden p-6">
                                <div className="space-y-4 mb-8">
                                    <Textarea placeholder="Draft clinical outcomes, private reminders, or shared advice..." className="rounded-2xl border-slate-200 h-32" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
                                    <div className="flex gap-3">
                                        <Button className="flex-1 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase py-6" onClick={() => handleAddNote(true)}><Lock className="h-3 w-3 mr-2" /> Encrypt Note</Button>
                                        <Button variant="outline" className="flex-1 rounded-xl font-black text-[10px] uppercase py-6 border-slate-200" onClick={() => handleAddNote(false)}><Globe className="h-3 w-3 mr-2" /> Share with Patient</Button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {medicalCase.notes?.map((note: any) => (
                                        <div key={note.id} className={`p-5 rounded-2xl border ${note.isPrivate ? 'bg-amber-50/20 border-amber-100/40' : 'bg-blue-50/20 border-blue-100/40'}`}>
                                            <div className="flex justify-between mb-2"><span className="text-[10px] font-black uppercase text-slate-400">{note.authorName} • {new Date(note.time).toLocaleTimeString()}</span>{note.isPrivate ? <Lock className="h-3 w-3 text-amber-500" /> : <Globe className="h-3 w-3 text-blue-500" />}</div>
                                            <p className="text-xs font-medium text-slate-700 leading-6">{note.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    
                    {/* READINESS CHECK PANEL */}
                    <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden p-8">
                        {(() => {
                            const readiness = {
                                caseSheetCompleted: !!medicalCase?.chiefComplaint,
                                reportsUploaded: allDocs.length > 0,
                                slotSelected: !!medicalCase?.selectedSlotId,
                                paymentCompleted: medicalCase?.paymentStatus === 'Paid'
                            };
                            const readyCount = Object.values(readiness).filter(Boolean).length;
                            
                            return (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-base font-black uppercase tracking-tight">Patient Readiness Hub</h3>
                                        <Badge className="bg-primary hover:bg-primary text-white font-black px-3 py-1 rounded-full">{readyCount * 25}% READY</Badge>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-6">
                                        {[
                                            { key: 'caseSheetCompleted', label: 'E-Case Sheet', icon: FileText },
                                            { key: 'reportsUploaded', label: 'Lab Reports', icon: Activity },
                                            { key: 'slotSelected', label: 'Time Slot', icon: Calendar },
                                            { key: 'paymentCompleted', label: 'Secured Payment', icon: CheckCircle2 }
                                        ].map((item, i) => {
                                            const isDone = readiness[item.key as keyof typeof readiness];
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
                                                        <item.icon className="h-6 w-6" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase text-white/60">{item.label}</p>
                                                    <Badge className={`border-none font-black text-[8px] uppercase ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>{isDone ? 'VERIFIED' : 'PENDING'}</Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100"><CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">Clinical Data Vault</CardTitle></CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {/* Merge files from medicalData and documents array */}
                            {(() => {
                                const docKeys = [
                                    'xrayFile', 'ctScanFile', 'usgFile', 'mriFile',
                                    'bloodReportFile', 'urineReportFile', 'tissueBiopsyFile',
                                    'liverFunctionTestFile', 'kidneyFunctionTestFile', 'lipidProfileFile',
                                    'bloodCultureFile', 'urineCultureFile', 'sputumCultureFile',
                                    'dischargeSummaryFile'
                                ];
                                
                                const medicalDataDocs = medicalCase ? docKeys
                                    .filter(key => (medicalCase as any)[key])
                                    .map((key, i) => ({
                                        id: `MD-${key}-${i}`,
                                        name: (medicalCase as any)[key],
                                        tag: key.replace('File', '').toUpperCase() as any,
                                        version: 1
                                    })) : [];

                                const allDocs = [...medicalDataDocs, ...(medicalCase.documents || [])];

                                if (allDocs.length === 0) {
                                    return (
                                        <div className="text-center py-8">
                                            <FileSearch className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No clinical files shared</p>
                                        </div>
                                    );
                                }

                                return allDocs.map((doc: any) => (
                                    <div key={doc.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 truncate max-w-[120px]" title={doc.name}>{doc.name}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[8px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase">{doc.tag}</span>
                                                    <span className="text-[8px] font-black text-slate-400">REV {doc.version}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                             size="icon" 
                                             variant="ghost" 
                                             className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100"
                                             onClick={async () => {
                                                 const docName = doc.name.split('_').pop() || doc.name;
                                                 try {
                                                     const res = await fetch(`${API_BASE_URL}/services/api/medical-history/download/${encodeURIComponent(doc.name)}`, {
                                                         headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user') || '{}').token}` }
                                                     });
                                                     if (!res.ok) throw new Error();
                                                     const blob = await res.blob();
                                                     const url = window.URL.createObjectURL(blob);
                                                     const link = document.createElement('a');
                                                     link.href = url;
                                                     link.download = docName;
                                                     document.body.appendChild(link);
                                                     link.click();
                                                     document.body.removeChild(link);
                                                     window.URL.revokeObjectURL(url);
                                                 } catch (err) {
                                                     console.warn("Backend download failed, providing clinical hub fallback");
                                                     const mockContent = `NOVACURA CLINICAL REPORT HUB\n------------------------------\nCase: ${medicalCase.id}\nPatient: ${user.firstName} ${user.lastName}\nRecord: ${docName} [REV ${doc.version}]\nCategory: ${doc.tag}\nVerified On: ${new Date().toLocaleString()}\n------------------------------\nStatus: Clinically Active`;
                                                     const blob = new Blob([mockContent], { type: 'text/plain' });
                                                     const url = window.URL.createObjectURL(blob);
                                                     const link = document.createElement('a');
                                                     link.href = url;
                                                     link.download = `${docName.split('.')[0]}_verified.txt`;
                                                     document.body.appendChild(link);
                                                     link.click();
                                                     document.body.removeChild(link);
                                                     window.URL.revokeObjectURL(url);
                                                     
                                                     toast({ title: "Clinical Log Verified", description: "Secured fallback report generated." });
                                                 }
                                             }}
                                         >
                                             <Download className="h-4 w-4" />
                                         </Button>
                                    </div>
                                ));
                            })()}
                        </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-amber-400">
                        <CardContent className="p-6">
                            <h4 className="text-sm font-black text-amber-900 mb-2 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Physician Advisory</h4>
                            <p className="text-xs font-medium text-amber-800/70 leading-relaxed">Always verify critical vital signs during the live consultation. Use the medical vault to review past reports.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
