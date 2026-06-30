'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import React, { useState, useEffect } from 'react';
import { 
    Calendar, LayoutDashboard, CalendarPlus, Clipboard, 
    MessageSquare, FileText, Hospital, Stethoscope, 
    Plane, User as UserIcon, Video, Building,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";

export default function AppointmentsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            
            try {
                const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/patient/${parsed.id}`, {
                    headers: { 'Authorization': `Bearer ${parsed.token}` }
                }, 5000);

                if (response.ok) {
                    const slots = await response.json();
                    setAppointments(slots.filter((a: any) => a.status !== 'cancelled'));
                }
            } catch (err) {
                console.error("Fetch appointments error:", err);
                toast({ title: "Fetch Error", description: "Failed to load appointments from server.", variant: "destructive" });
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
        window.addEventListener('mock-db-update', fetchAppointments);
        return () => window.removeEventListener('mock-db-update', fetchAppointments);
    }, []);

    const handleCancel = async (slotId: string) => {
        if (!user) return;
        if (confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/${slotId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ status: 'cancelled' })
                }, 5000);

                if (response.ok) {
                    toast({
                        title: "Appointment Cancelled",
                        description: "Your appointment has been successfully cancelled.",
                    });
                    fetchAppointments();
                }
            } catch (err) {
                console.error("Cancel appointment error:", err);
                toast({ title: "Cancel Error", description: "Failed to cancel appointment on server.", variant: "destructive" });
            }
        }
    };



    // Split appointments into upcoming and past
    // For simplicity in the demo, we consider anything "booked/confirmed" as upcoming 
    // and anything "completed" (if we had a status for it) as past.
    // Let's assume for now everything is upcoming since we don't have many past ones in mock data.
    const upcoming = appointments.filter(a => ['booked', 'confirmed', 'selected', 'pending_payment'].includes(a.status));
    const past = appointments.filter(a => ['completed', 'Consultation Completed'].includes(a.status));

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <div className="min-h-screen bg-[#f1f0f7]/30 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
                            <p className="text-slate-500 mt-1">Manage your consultations and health schedule</p>
                        </div>

                    </div>

                    <div className="space-y-10">
                        {/* Upcoming Appointments */}
                        <section>
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-slate-800">
                                <Calendar className="h-5 w-5 text-indigo-500" />
                                Upcoming Appointments
                            </h2>
                            {upcoming.length === 0 ? (
                                <Card className="border-dashed border-2 bg-slate-50/50">
                                    <CardContent className="p-10 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Calendar className="h-10 w-10 text-slate-300" />
                                            <p className="text-slate-500 font-medium text-xs mt-2 italic">Connect with your coordinator via the clinical chat to arrange a session.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4">
                                    {upcoming.map((appt) => (
                                        <Card key={appt.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                            {appt.duration === 0 ? <Video className="h-7 w-7" /> : <Building className="h-7 w-7" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                                                {appt.date} at {appt.time}
                                                                {appt.duration === 0 ? <Video className="h-4 w-4 text-slate-400" /> : <Building className="h-4 w-4 text-slate-400" />}
                                                            </p>
                                                            <p className="font-medium text-slate-700">{appt.doctorName || 'Dr. Specialist'} — <span className="text-slate-500 font-normal">{appt.specialization || 'Consultant'}</span></p>
                                                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                                <Hospital className="h-3.5 w-3.5" />
                                                                {appt.hospitalName || 'Main Clinic'}, {appt.hospitalLocation || 'Virtual Location'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 w-full md:w-auto">

                                                        <Button 
                                                            variant="destructive" 
                                                            className="flex-1 md:flex-none bg-rose-500 hover:bg-rose-600"
                                                            onClick={() => handleCancel(appt.id)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Past Appointments */}
                        <section>
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-slate-800 opacity-60">
                                <FileText className="h-5 w-5 text-slate-400" />
                                Past Appointments
                            </h2>
                            {past.length === 0 ? (
                                <p className="text-slate-400 italic text-sm ml-7">No previous records found.</p>
                            ) : (
                                <div className="grid gap-4 opacity-75">
                                    {past.map((appt) => (
                                        <Card key={appt.id} className="border-none shadow-sm bg-slate-50/50">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                        <CheckCircle2 className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-700">{appt.date}, {new Date().getFullYear()}</p>
                                                        <p className="text-sm font-medium text-slate-600">{appt.doctorName} — {appt.specialization}</p>
                                                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                                            <span className="font-semibold">Notes:</span> Consultation completed. Recommended follow-up in 3 months.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

// Helper icons that were missing
function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

