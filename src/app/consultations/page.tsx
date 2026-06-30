"use client"

import * as React from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { Home, Briefcase, Users, Settings, Calendar, Clipboard, MessageSquare, FileText, Hospital, Stethoscope, Plane, User, LayoutDashboard, CalendarPlus, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { mockDB } from "@/lib/mock-db"
import { useRouter } from "next/navigation"
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Loader2, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

export default function ConsultationsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = React.useState<any>(null);
    const [profileCompleted, setProfileCompleted] = React.useState(true);
    const [activeCase, setActiveCase] = React.useState<any>(null);
    const [assignedDoctor, setAssignedDoctor] = React.useState<any>(null);
    const [availableSlots, setAvailableSlots] = React.useState<any[]>([]);
    const [chatMessages, setChatMessages] = React.useState<any[]>([]);
    const [messageInput, setMessageInput] = React.useState('');
    const [allCases, setAllCases] = React.useState<any[]>([]);
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = React.useState(false);
    const [rescheduleReason, setRescheduleReason] = React.useState("");
    const [isRescheduling, setIsRescheduling] = React.useState(false);
    const isSending = React.useRef(false);

    React.useEffect(() => {
        const loadData = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                
                // Profile completion from user object
                setProfileCompleted(parsed.isProfileCompleted || parsed.profileCompleted || true);

                try {
                    // 1. Fetch case status from Backend (MongoDB)
                    const caseRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/medical-history/my-status`, {
                        headers: { 'Authorization': `Bearer ${parsed.token}` }
                    }, 5000);

                    if (caseRes.ok) {
                        const currentCase = await caseRes.json();
                        if (currentCase) {
                            setActiveCase(currentCase);
                            
                            // 2. Fetch remote messages from MongoDB
                            const msgRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/messages/${currentCase.id}`, {
                                headers: { 'Authorization': `Bearer ${parsed.token}` }
                            }, 5000);
                            
                            if (msgRes.ok) {
                                const remoteMsgs = await msgRes.json();
                                const processedMsgs = remoteMsgs.map((m: any) => ({
                                    ...m,
                                    time: m.time || (m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')
                                }));
                                setChatMessages(processedMsgs);
                            }

                            // 3. Handle doctor assignment
                            const doctorId = currentCase.assignedDoctorId;
                            if (doctorId) {
                                // For UI display, fetch doctor details if possible
                                if (!assignedDoctor) {
                                    try {
                                        const docRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/users/${doctorId}`, {
                                            headers: { 'Authorization': `Bearer ${parsed.token}` }
                                        });
                                        if (docRes.ok) {
                                            setAssignedDoctor(await docRes.json());
                                        } else {
                                            setAssignedDoctor({ firstName: 'Clinical', lastName: 'Specialist' });
                                        }
                                    } catch (e) {
                                        setAssignedDoctor({ firstName: 'Clinical', lastName: 'Specialist' });
                                    }
                                }

                                // Fetch slots if status requires it
                                if (currentCase.status === 'Slots Shared' || currentCase.status === 'Reschedule Requested') {
                                     const slotRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/case/${currentCase.id}`, {
                                         headers: { 'Authorization': `Bearer ${parsed.token}` }
                                     });
                                     if (slotRes.ok) {
                                         const slots = await slotRes.json();
                                         setAvailableSlots(slots.filter((s: any) => s.status === 'available'));
                                     }
                                } else {
                                    setAvailableSlots([]);
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.error("Data sync error:", err);
                }
            }
        };

        loadData();
        const pollInterval = setInterval(loadData, 3500);
        
        window.addEventListener('storage', loadData);
        return () => {
            clearInterval(pollInterval);
            window.removeEventListener('storage', loadData);
        };
    }, [assignedDoctor]);

    const handleSelectSlot = async (slotId: string) => {
        if (!activeCase || !user) return;

        try {
            // Backend sync
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/${slotId}/select?patientId=${user.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            }, 5000);

            if (response.ok) {
                toast({ 
                    title: "Slot Confirmed", 
                    description: "You have accepted the consultation slot successfully.", 
                });
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                toast({ title: "Booking Error", description: "This slot is no longer available.", variant: "destructive" });
            }
        } catch (err) {
            console.error("Booking error:", err);
            toast({ title: "Booking Error", description: "Operation failed.", variant: "destructive" });
        }
    };

    const handleRequestReschedule = async () => {
        if (!activeCase || !user || !rescheduleReason.trim()) return;
        
        setIsRescheduling(true);
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/medical-history/request-reschedule`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify({ caseId: activeCase.id, reason: rescheduleReason })
            }, 5000);

            if (response.ok) {
                toast({ title: "Reschedule Requested", description: "Your request has been sent to the doctor." });
                setRescheduleDialogOpen(false);
                setRescheduleReason("");
            }
        } catch (err) {
            console.error("Reschedule error:", err);
        } finally {
            setIsRescheduling(false);
        }
    };

    const handleSendMessage = async () => {
        const text = messageInput.trim();
        if (!text || !activeCase || !user || isSending.current) return;
        
        isSending.current = true;
        const currentText = text;
        setMessageInput('');
        
        try {
            const msgData = {
                caseId: activeCase.id,
                senderId: user.id,
                senderRole: 'patient',
                text: currentText
            };

            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(msgData),
            }, 5000);

            if (response.ok) {
                const saved = await response.json();
                setChatMessages(prev => [...prev, saved]);
            }
        } catch (err) {
            console.error("Message error:", err);
            toast({ variant: "destructive", title: "Message failed", description: "Real-time sync error." });
        } finally {
            isSending.current = false;
        }
    };

    const displayMessages = chatMessages.length > 0 ? chatMessages : [
        {
            id: 'default-1',
            senderRole: 'doctor',
            text: activeCase?.status === 'Case Sheet Submitted'
                ? "Your case sheet has been received. A doctor will review it shortly."
                : "Hello! Our care team is here to assist you.",
            time: "10:40 AM"
        }
    ];

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden">
                    <SidebarTrigger />
                </header>
                <div className="min-h-screen bg-[#f8f7f2] p-8 flex flex-col">
                    <h1 className="text-3xl font-bold text-slate-800 mb-6">Consultations</h1>

                    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row border border-slate-100 min-h-[600px]">
                        {/* Left Sidebar: Conversations */}
                        <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col">
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search messages..."
                                        className="pl-9 bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {assignedDoctor ? (
                                    <div className="p-4 flex gap-3 cursor-pointer bg-[#dcb02d] hover:bg-[#dcb02d] transition-colors">
                                        <div className="relative h-10 w-10 min-w-[2.5rem] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0">
                                            <User className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-semibold text-sm truncate text-slate-900">
                                                    Dr. {assignedDoctor.firstName} {assignedDoctor.lastName}
                                                </h3>
                                                <span className="text-xs text-slate-800">Active</span>
                                            </div>
                                            <p className="text-xs truncate mt-1 text-slate-800 font-medium">
                                                Status: {activeCase?.status}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-500 mt-10">
                                        No active case assigned yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Chat Window */}
                        <div className="flex-1 flex flex-col bg-[#fdfdfc]">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
                                <div className="relative h-10 w-10 min-w-[2.5rem] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        {assignedDoctor ? `Dr. ${assignedDoctor.firstName} ${assignedDoctor.lastName}` : 'Care Team'}
                                    </h2>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                {displayMessages.map((msg: any) => (
                                    <div key={msg.id} className={`flex ${msg.senderRole === 'patient' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex gap-3 max-w-[80%] ${msg.senderRole === 'patient' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {msg.senderRole !== 'patient' && (
                                                <div className="relative h-8 w-8 min-w-[2rem] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                </div>
                                            )}
                                            <div className={`p-4 rounded-lg shadow-sm ${msg.senderRole === 'patient' ? 'bg-[#1e4620] text-white rounded-br-none' : 'bg-[#f0efe9] text-slate-800 rounded-bl-none'}`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <p className={`text-[10px] mt-2 text-right ${msg.senderRole === 'patient' ? 'text-white/70' : 'text-slate-400'}`}>{msg.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Slot Selection Interface */}
                                {activeCase?.status === 'Slots Shared' && availableSlots.length > 0 && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3 max-w-[90%]">
                                            <div className="relative h-8 w-8 min-w-[2rem] rounded-full overflow-hidden bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                                                <User className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <div className="p-5 rounded-xl shadow-lg bg-white border border-indigo-100 rounded-bl-none">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                                    <h3 className="font-bold text-slate-900">Proposed Consultation Slots</h3>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                                    Dr. {assignedDoctor?.firstName} {assignedDoctor?.lastName} has shared the following availability. 
                                                    Please accept a slot to confirm your booking.
                                                </p>
                                                
                                                <div className="space-y-3">
                                                    {availableSlots.map(slot => (
                                                        <div key={slot.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 transition-colors">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm font-black text-slate-900">{slot.date}</span>
                                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white">
                                                                    {slot.duration || 30} Mins
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4">
                                                                <Clock className="h-3.5 w-3.5" /> {slot.time}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs rounded-lg"
                                                                    onClick={() => handleSelectSlot(slot.id)}
                                                                >
                                                                    Accept Slot
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="flex-1 border-slate-200 text-slate-600 font-bold text-xs rounded-lg"
                                                                    onClick={() => setRescheduleDialogOpen(true)}
                                                                >
                                                                    Reschedule
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                <Input
                                    placeholder={activeCase?.status === 'Doctor Query Sent' ? "Reply to doctor..." : "Type a message..."}
                                    className="flex-1"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <Button onClick={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reschedule Request Dialog */}
                <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Request Reschedule</DialogTitle>
                            <DialogDescription>
                                Please provide a reason or your preferred timing so the doctor can suggest alternative slots.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                placeholder="I'm busy at this time, can we do it later in the afternoon?"
                                value={rescheduleReason}
                                onChange={(e) => setRescheduleReason(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleRequestReschedule}
                                disabled={!rescheduleReason.trim() || isRescheduling}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isRescheduling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Request
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
