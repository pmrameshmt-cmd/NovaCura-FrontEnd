"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { mockDB } from "@/lib/mock-db"
import React from 'react'
import { 
    Home, Briefcase, Users, Settings, Calendar, Clipboard, 
    MessageSquare, FileText, Hospital, Stethoscope, Plane, 
    User, LayoutDashboard, CalendarPlus, Download, Pill, History 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

export default function PrescriptionsPage() {
    const [user, setUser] = React.useState<any>(null);
    const [prescriptions, setPrescriptions] = React.useState<any[]>([]);
    const [profileCompleted, setProfileCompleted] = React.useState(true);

    const loadData = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setProfileCompleted(mockDB.isProfileCompleted(parsed.id));
            setPrescriptions(mockDB.getPrescriptionsByPatient(parsed.id));
        }
    };

    React.useEffect(() => {
        loadData();
        window.addEventListener('mock-db-update', loadData);
        return () => window.removeEventListener('mock-db-update', loadData);
    }, []);

    const activePrescriptions = prescriptions.filter(p => p.status === 'active');
    const pastPrescriptions = prescriptions.filter(p => p.status === 'past');

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden">
                    <SidebarTrigger />
                </header>
                <div className="min-h-screen bg-[#f8f7f2] p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-slate-800 mb-8">Clinical Prescriptions</h1>

                        {/* Order Groups */}
                        <div className="space-y-8">
                            {prescriptions.length === 0 ? (
                                <Card className="bg-white/50 border-dashed border-2 border-slate-200">
                                    <CardContent className="py-20 text-center">
                                        <Pill className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-slate-400">No prescriptions found in your file.</h3>
                                    </CardContent>
                                </Card>
                            ) : (
                                prescriptions.map((rx: any) => (
                                    <Card key={rx.id} className="bg-white shadow-sm border-none overflow-hidden">
                                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Prescription Order #{rx.id?.split('-')[1] || 'New'}</CardTitle>
                                                    <Badge className={rx.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-none uppercase text-[8px] font-black' : 'bg-slate-100 text-slate-400 border-none uppercase text-[8px] font-black'}>{rx.status}</Badge>
                                                </div>
                                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                                    <span>📅 Issued: {rx.date}</span>
                                                    <span>👨‍⚕️ Doctor: {rx.doctorName || 'Dr. Deepa'}</span>
                                                </CardDescription>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="rounded-xl border-slate-200 font-black text-[10px] uppercase gap-2 h-9"
                                                onClick={() => {
                                                    let content = `NOVACURA DIGITAL PRESCRIPTION\nORDER ID: ${rx.id}\nDATE: ${rx.date}\nDOCTOR: ${rx.doctorName || 'Dr. Deepa'}\n==========================================\n\n`;
                                                    (rx.medications || []).forEach((med: any, i: number) => {
                                                        content += `${i+1}. ${med.medication?.toUpperCase() || ''} (${med.dosage || ''})\n`;
                                                        content += `   Frequency: ${med.frequency}\n`;
                                                        content += `   Duration: ${med.duration}\n`;
                                                        content += `   Instructions: ${med.instructions}\n`;
                                                        content += `   Refills: ${med.refills}\n`;
                                                        content += `------------------------------------------\n`;
                                                    });
                                                    content += `\nVERIFIED CLINICAL RECORD\nLast Updated: ${rx.lastUpdated || rx.date}`;
                                                    
                                                    const blob = new Blob([content], { type: 'text/plain' });
                                                    const url = window.URL.createObjectURL(blob);
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.download = `Prescription_Order_${rx.id}.txt`;
                                                    link.click();
                                                }}
                                            >
                                                <Download className="h-3 w-3" /> Download Full Page
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider bg-white">
                                                <div>Medication</div>
                                                <div>Dosage</div>
                                                <div>Frequency</div>
                                                <div>Duration</div>
                                                <div>Instructions</div>
                                                <div>Refills</div>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {(rx.medications || []).map((med: any, idx: number) => (
                                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 items-center">
                                                        <div className="font-bold text-slate-900 text-sm">{med.medication}</div>
                                                        <div className="text-slate-600 text-sm">{med.dosage}</div>
                                                        <div className="text-slate-600 text-sm italic">{med.frequency}</div>
                                                        <div className="text-slate-600 text-sm uppercase text-[10px] font-bold">{med.duration}</div>
                                                        <div className="text-slate-500 text-xs leading-relaxed">{med.instructions}</div>
                                                        <div className="text-slate-600 text-sm">{med.refills}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {rx.edits && rx.edits.length > 0 && (
                                                <div className="bg-amber-50/30 p-4 border-t border-amber-50">
                                                    <h4 className="text-[9px] font-black uppercase text-amber-500 mb-3 flex items-center gap-2 tracking-widest">
                                                        <History className="h-3 w-3" /> Adjustment History
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {rx.edits.map((edit: any, eIdx: number) => (
                                                            <div key={eIdx} className="text-[10px] text-slate-500 flex items-start gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-200 mt-1" />
                                                                <div>
                                                                    <span className="font-bold text-slate-700">{new Date(edit.timestamp).toLocaleDateString()}:</span> {edit.summary}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
