'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Clock,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Settings2,
    Share2,
    CalendarDays,
    Calendar as CalendarIcon,
    CalendarCheck,
    UserCircle2,
    Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { mockDB } from "@/lib/mock-db";

export default function AvailabilityPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading availability...</div>}>
            <AvailabilityContent />
        </Suspense>
    );
}

function AvailabilityContent() {
    const { toast } = useToast();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const initialDateStr = `${months[new Date().getMonth()]} ${new Date().getDate()}`;

    const [duration, setDuration] = useState('30');
    const [isOneDayAllocation, setIsOneDayAllocation] = useState(true);
    const [selectedDateObject, setSelectedDateObject] = useState<Date>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const selectedDate = format(selectedDateObject, 'MMM dd, yyyy');
    
    const isToday = format(selectedDateObject, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    
    const [slots, setSlots] = useState<any[]>([]);
    const [doctorId, setDoctorId] = useState<string>('');
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [isSharing, setIsSharing] = useState(false);
    const [selectedSlotIdsForSharing, setSelectedSlotIdsForSharing] = useState<string[]>([]);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    const [newSlotTime, setNewSlotTime] = useState('09:00');
    const [customHour, setCustomHour] = useState('09');
    const [customMinute, setCustomMinute] = useState('00');
    const [showShareModal, setShowShareModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const pid = searchParams.get('patientId');
        if (pid) {
            setSelectedPatientId(pid);
            setShowShareModal(true);
        }
    }, [searchParams]);

    const fetchData = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;
            const userObj = JSON.parse(userData);
            setDoctorId(userObj.id);

            // Fetch live slots from MongoDB Backend
            const slotRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/doctor/${userObj.id}`, {
                headers: { 'Authorization': `Bearer ${userObj.token}` }
            }, 4000);
            
            if (slotRes.ok) {
                const dbSlots = await slotRes.json();
                const sortedSlots = dbSlots.sort((a: any, b: any) => {
                    const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
                    const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
                    return timeA - timeB;
                });
                setSlots(sortedSlots);
            }

            // Fetch live assigned patients from MongoDB Backend
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/assigned-patients`, {
                headers: { 'Authorization': `Bearer ${userObj.token}` }
            }, 4000);

            if (response.ok) {
                const lp = await response.json();
                setPatients(lp.map((p: any) => ({
                    id: p.patientId, 
                    caseId: p.caseId,
                    name: p.name,
                    status: p.status
                })));
            }
            
            setIsRefreshing(false);
        } catch (e) {
            console.error("Data fetch failed.", e);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAddSlot = async () => {
        let h = parseInt(customHour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        const timeStr = `${displayH.toString().padStart(2, '0')}:${customMinute} ${ampm}`;

        if (!doctorId) return;
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        try {
            await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userData.token}` },
                body: JSON.stringify([{ doctorId, date: selectedDate, time: timeStr, status: 'available' }]),
            }, 5000);
            
            setIsAddingSlot(false);
            toast({ title: "Slot Created", description: `Added ${timeStr} to clinical availability.` });
            fetchData();
        } catch (e) {
            toast({ title: "Error", description: "Failed to push slot to backend.", variant: "destructive" });
        }
    };

    const handleDeleteSlot = async (id: string) => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        try {
            await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userData.token}` }
            }, 5000);
            toast({ title: "Slot Removed", description: "Availability revoked synchronized." });
            fetchData();
        } catch (e) {
            toast({ title: "Error", description: "Deletion sync failed.", variant: "destructive" });
        }
    };

    const handleToggleSlotStatus = async (id: string) => {
        const slot = slots.find(s => s.id === id);
        if (!slot || ['booked', 'confirmed', 'selected', 'pending_payment'].includes(slot.status)) {
            if (['booked', 'confirmed'].includes(slot?.status || '')) {
                toast({ title: "Action Denied", description: "Cannot modify a booked slot.", variant: "destructive" });
            }
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const newStatus = slot.status === 'available' ? 'unavailable' : 'available';
        
        try {
            await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userData.token}` },
                body: JSON.stringify([{ ...slot, status: newStatus }]),
            }, 5000);
            toast({ title: "Slot Updated", description: `Marked slot as ${newStatus}.` });
            fetchData();
        } catch (e) {
            toast({ title: "Update Error", description: "Failed to push status change.", variant: "destructive" });
        }
    };

    const handleFillGaps = (durOverride?: string) => {
        if (!doctorId) return;
        const dur = parseInt(durOverride || duration);
        const sequence: string[] = [];
        
        // Logical segments for clinical availability
        const generateSeq = (startH: number, endH: number) => {
            let current = new Date(`2000/01/01 ${startH.toString().padStart(2, '0')}:00:00`);
            const end = new Date(`2000/01/01 ${endH.toString().padStart(2, '0')}:00:00`);
            while (current < end) {
                // Ensure format matches the DB normalization (HH:mm AM/PM)
                const timeStr = current.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                });
                sequence.push(timeStr);
                current.setMinutes(current.getMinutes() + dur);
            }
        };

        generateSeq(9, 13); // Morning: 9 AM - 1 PM
        generateSeq(14, 18); // Evening: 2 PM - 6 PM

        // Clear existing available/unavailable slots for the CURRENT SELECTED DATE to re-align with new duration
        // We use mockDB.getSlotsByDoctor directly to ensure we have the absolute latest state
        const currentSlots = mockDB.getSlotsByDoctor(doctorId);
        const unbookedSlots = currentSlots.filter(s => s.date === selectedDate && (s.status === 'available' || s.status === 'unavailable'));
        unbookedSlots.forEach(s => mockDB.deleteSlot(s.id));

        let addedCount = 0;
        sequence.forEach(time => {
            const result = mockDB.addSlot({ 
                doctorId, 
                date: selectedDate, 
                time, 
                status: 'available', 
                duration: dur 
            });
            if (result.success) addedCount++;
        });

        if (addedCount > 0) {
            toast({ 
                title: "Schedule Realigned", 
                description: `Created ${addedCount} slots with ${dur}m duration.` 
            });
            fetchData();
        } else {
            toast({ 
                title: "Capacity Limited", 
                description: "Overlapping active appointments prevented full realignment.",
                variant: "destructive"
            });
        }
    };

    const handleShareSlots = async () => {
        if (!selectedPatientId) {
            toast({ title: "Selection Required", description: "Please select a patient.", variant: "destructive" });
            return;
        }

        if (selectedSlotIdsForSharing.length === 0) {
            toast({ title: "Slots Required", description: "Please select at least one slot to propose.", variant: "destructive" });
            return;
        }

        setIsSharing(true);
        const patient = patients.find(p => p.id === selectedPatientId);

        if (patient) {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const availableLocalSlots = slots.filter(s => selectedSlotIdsForSharing.includes(s.id));
            const backendSlots = availableLocalSlots.map(s => ({
                doctorId: doctorId,
                caseId: patient.caseId,
                date: s.date,
                time: s.time,
                status: 'available'
            }));

            try {
                await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/share`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userData.token}` },
                    body: JSON.stringify(backendSlots),
                }, 5000);
                
                toast({ title: "Slots Shared", description: `Proposals sent to ${patient?.name}.` });
                setSelectedPatientId('');
                setSelectedSlotIdsForSharing([]);
                setIsSharing(false);
                fetchData();
            } catch (e) {
                console.error("Propose sync failed:", e);
                toast({ title: "Sync failed", description: "Proposals NOT shared to clinical cloud.", variant: "destructive" });
                setIsSharing(false);
            }
        }
    };

    const handleSaveConfig = () => {
        toast({
            title: "Configuration Saved",
            description: `Duration set to ${duration}m. 1-Day Limit is ${isOneDayAllocation ? 'On' : 'Off'}.`,
        });
    };

    // Generate current week dates dynamically
    const days = (() => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = new Date();
        
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const name = dayNames[d.getDay()];
            const dateStr = `${months[d.getMonth()]} ${d.getDate()}`;
            return { name, date: dateStr };
        });
    })();

    return (
        <div className="space-y-8 animate-in mt-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Slot Allocation</h1>
                    <p className="text-slate-500 font-medium">Configure and share your consultation availability.</p>
                </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block w-64">
                             <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold focus:ring-primary/20 bg-white shadow-sm">
                                    <SelectValue placeholder="Booking for..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-2xl border-slate-100 z-[100]">
                                    {patients.map(p => (
                                        <SelectItem key={p.id} value={p.id} className="rounded-lg">
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl font-bold text-xs uppercase tracking-wider h-11 shadow-lg shadow-primary/20">
                                    <Share2 className="h-4 w-4 mr-2" /> Propose slots
                                </Button>
                            </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 p-0 overflow-hidden">
                            <Tabs defaultValue="propose" className="w-full">
                                <div className="bg-slate-900 p-6 pb-2 text-white">
                                    <DialogTitle className="font-black text-xl">Consultation Scheduler</DialogTitle>
                                    <DialogDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">
                                        Finalize or propose your availability
                                    </DialogDescription>
                                    
                                    <TabsList className="bg-white/10 border-none mt-6 w-full p-1 h-11 rounded-xl">
                                        <TabsTrigger value="propose" className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-slate-900">
                                            Propose Slots
                                        </TabsTrigger>
                                        <TabsTrigger value="direct" className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-slate-900">
                                            Direct Book
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="propose" className="p-6 pt-4 m-0 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contextual Patient Selection</Label>
                                            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                                <SelectTrigger className="h-12 rounded-2xl border-slate-200 font-bold focus:ring-primary/20 bg-white shadow-sm">
                                                    <SelectValue placeholder="Choose patient to book/propose..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100 z-[100]" position="popper" sideOffset={8}>
                                                    {patients.length > 0 ? (
                                                        patients.map(p => (
                                                            <SelectItem key={p.id} value={p.id} className="rounded-xl py-3 px-4 focus:bg-slate-50">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-slate-900">{p.name}</span>
                                                                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{p.id} • {p.status}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 text-center">
                                                            <p className="text-xs font-bold text-slate-400 uppercase">No eligible patients</p>
                                                            <p className="text-[10px] text-slate-400 mt-1">Review cases in Dashboard first</p>
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Card className="bg-slate-50/50 border-dashed border-slate-200 rounded-2xl shadow-none p-4">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
                                                <CalendarCheck className="h-3 w-3" /> Select Proposed Slots ({selectedSlotIdsForSharing.length})
                                            </p>
                                            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                                                {slots.filter(s => s.date === selectedDate && (s.status === 'available' || s.status === 'shared')).map(s => {
                                                    const isItemSelected = selectedSlotIdsForSharing.includes(s.id);
                                                    return (
                                                        <Badge 
                                                            key={s.id} 
                                                            variant={isItemSelected ? "default" : "secondary"} 
                                                            className={`cursor-pointer border-slate-100 font-bold rounded-lg px-3 py-1.5 transition-all ${isItemSelected ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white text-slate-700 hover:border-slate-300'}`}
                                                            onClick={() => {
                                                                if (isItemSelected) {
                                                                    setSelectedSlotIdsForSharing(selectedSlotIdsForSharing.filter(id => id !== s.id));
                                                                } else {
                                                                    setSelectedSlotIdsForSharing([...selectedSlotIdsForSharing, s.id]);
                                                                }
                                                            }}
                                                        >
                                                            {isItemSelected && <Check className="h-3 w-3 mr-1" />}
                                                            {s.time}
                                                        </Badge>
                                                    );
                                                })}
                                                {slots.filter(s => s.status === 'available' || s.status === 'shared').length === 0 && (
                                                    <p className="text-[10px] text-slate-400 italic">No available slots for this date.</p>
                                                )}
                                            </div>
                                        </Card>
                                        <Button className="w-full h-12 rounded-2xl bg-slate-900 font-black text-[10px] uppercase shadow-xl mt-4" onClick={handleShareSlots} disabled={isSharing || !selectedPatientId}>
                                            {isSharing ? 'Syncing...' : 'Confirm & Propose Slots'}
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="direct" className="p-6 pt-4 m-0 space-y-6">
                                     <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Patient</Label>
                                            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                                <SelectTrigger className="h-12 rounded-2xl border-slate-200 font-bold focus:ring-primary/20 bg-white shadow-sm">
                                                    <SelectValue placeholder="Select patient to finalize..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100 z-[100]" position="popper" sideOffset={8}>
                                                    {patients.map(p => (
                                                        <SelectItem key={p.id} value={p.id} className="rounded-xl py-3 px-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold">{p.name}</span>
                                                                <span className="text-[9px] text-slate-400 uppercase font-black">{p.id}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Date</Label>
                                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full h-12 rounded-2xl border-slate-200 font-bold focus:ring-primary/20 bg-white shadow-sm px-4 justify-start text-left",
                                                                !selectedDateObject && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                                            {selectedDateObject ? format(selectedDateObject, "PPP") : <span>Pick a clinical date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-slate-100 z-[200]">
                                                        <Calendar
                                                            mode="single"
                                                            selected={selectedDateObject}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    setSelectedDateObject(date);
                                                                    setIsCalendarOpen(false);
                                                                }
                                                            }}
                                                            initialFocus
                                                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                                            className="rounded-2xl"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Time</Label>
                                                <div className="flex items-center gap-2">
                                                     <Select value={customHour} onValueChange={setCustomHour}>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold focus:ring-primary/10 bg-white shadow-sm font-jakarta">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl p-1 shadow-xl z-[150]">
                                                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
                                                                .filter(h => !isToday || parseInt(h) >= currentHour)
                                                                .map(h => (
                                                                <SelectItem key={h} value={h} className="font-bold text-xs">{h}:00</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={customMinute} onValueChange={setCustomMinute}>
                                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold focus:ring-primary/10 bg-white shadow-sm font-jakarta">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl p-1 shadow-xl z-[150]">
                                                            {['00', '15', '30', '45'].filter(m => {
                                                                if (!isToday) return true;
                                                                if (parseInt(customHour) > currentHour) return true;
                                                                return parseInt(m) > currentMinute;
                                                            }).map(m => (
                                                                <SelectItem key={m} value={m} className="font-bold text-xs">{m}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 mt-2">
                                            <p className="text-[10px] font-bold text-amber-900 uppercase">Automated Action</p>
                                            <p className="text-[9px] text-amber-800/70 mt-1 italic font-medium">This will create a new clinical block and instantly notify {(selectedPatientId && patients.find((p: any) => p.id === selectedPatientId)?.name) || 'the patient'}.</p>
                                        </div>
                                         <Button 
                                            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase shadow-xl mt-4" 
                                            disabled={!selectedPatientId || isSharing}
                                            onClick={async () => {
                                                const h = parseInt(customHour);
                                                const ampm = h >= 12 ? 'PM' : 'AM';
                                                const displayH = h % 12 || 12;
                                                const timeStr = `${displayH.toString().padStart(2, '0')}:${customMinute} ${ampm}`;
                                                
                                                const patient = patients.find((p: any) => p.id === selectedPatientId);
                                                if (patient) {
                                                    const userData = JSON.parse(localStorage.getItem('user') || '{}');
                                                    setIsSharing(true);
                                                    
                                                    const newBooking = {
                                                        doctorId,
                                                        patientId: patient.id,
                                                        caseId: patient.caseId,
                                                        date: selectedDate,
                                                        time: timeStr,
                                                        status: 'booked'
                                                    };

                                                    try {
                                                        await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/share`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userData.token}` },
                                                            body: JSON.stringify([newBooking]),
                                                        }, 5000);
                                                        
                                                        toast({ title: "Consultation Finalized", description: `Direct appointment scheduled for ${patient.name} at ${timeStr}.` });
                                                        setShowShareModal(false);
                                                        fetchData();
                                                    } catch (e) {
                                                        toast({ title: "Booking Error", description: "Failed to sync clinical booking.", variant: "destructive" });
                                                    } finally {
                                                        setIsSharing(false);
                                                    }
                                                }
                                            }}
                                        >
                                            {isSharing ? 'Syncing...' : 'Finalize Clinical Booking'}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-none shadow-sm bg-white overflow-hidden self-start">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-base font-black text-slate-900">Slot Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Duration</Label>
                            <Select value={duration} onValueChange={(val) => {
                                setDuration(val);
                                // Pass val directly to avoid stale state race condition
                                handleFillGaps(val);
                            }}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold focus:ring-primary/10">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl p-1 shadow-xl">
                                    <SelectItem value="15" className="font-bold text-xs rounded-lg">15 Minutes</SelectItem>
                                    <SelectItem value="20" className="font-bold text-xs rounded-lg">20 Minutes</SelectItem>
                                    <SelectItem value="30" className="font-bold text-xs rounded-lg">30 Minutes</SelectItem>
                                    <SelectItem value="45" className="font-bold text-xs rounded-lg">45 Minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settings</Label>
                            <div className="flex items-center justify-between p-1">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-700">1-Day Allocation</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Prevents far bookings</p>
                                </div>
                                <Switch checked={isOneDayAllocation} onCheckedChange={setIsOneDayAllocation} />
                            </div>
                        </div>
                        <div className="pt-2">
                             <p className="text-[10px] text-slate-400 font-medium italic">Schedule regenerates automatically on duration change.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-1 overflow-x-auto">
                        <Button variant="ghost" size="icon" className="h-14 w-10 text-slate-400"><ChevronLeft className="h-5 w-5" /></Button>
                        {days.map((day, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    const d = parse(day.date, 'MMM dd', new Date());
                                    setSelectedDateObject(d);
                                }}
                                className={`flex-1 min-w-[4.5rem] p-3 rounded-xl cursor-pointer flex flex-col items-center gap-1 border-2 transition-all ${selectedDate === day.date ? 'bg-primary border-primary shadow-lg text-white scale-105 z-10' : 'hover:bg-slate-50 border-transparent text-slate-400'}`}
                            >
                                <span className={`text-[9px] font-black uppercase ${selectedDate === day.date ? 'text-white/70' : 'text-slate-400'}`}>{day.name}</span>
                                <span className={`text-sm font-black ${selectedDate === day.date ? 'text-white' : 'text-slate-900'}`}>{day.date}</span>
                            </div>
                        ))}
                        <Button variant="ghost" size="icon" className="h-14 w-10 text-slate-400"><ChevronRight className="h-5 w-5" /></Button>
                    </div>

                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                            <div>
                                <CardTitle className="text-base font-black text-slate-900">Active Slots for {selectedDate}</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Doctor-led allocation</CardDescription>
                            </div>
                            <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="rounded-lg h-9 font-black text-[10px] uppercase tracking-widest px-4">
                                        <Plus className="h-4 w-4 mr-2" /> Add custom
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[320px] rounded-3xl">
                                    <DialogHeader><DialogTitle className="font-black text-slate-900">Add Clinical Block</DialogTitle></DialogHeader>
                                    <div className="py-8 flex items-center justify-center gap-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hour</Label>
                                            <Select value={customHour} onValueChange={setCustomHour}>
                                                <SelectTrigger className="h-14 w-24 rounded-2xl text-xl font-black bg-slate-50 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl z-[120]">
                                                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                                        <SelectItem key={h} value={h} className="font-bold rounded-xl">{h}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <span className="text-2xl font-black text-slate-300 mt-6">:</span>
                                        <div className="flex flex-col items-center gap-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minute</Label>
                                            <Select value={customMinute} onValueChange={setCustomMinute}>
                                                <SelectTrigger className="h-14 w-24 rounded-2xl text-xl font-black bg-slate-50 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl shadow-2xl z-[120]">
                                                    {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map(m => (
                                                        <SelectItem key={m} value={m} className="font-bold rounded-xl">{m}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter><Button className="w-full h-12 rounded-2xl bg-slate-900 font-black text-[10px] uppercase shadow-xl" onClick={handleAddSlot}>Create Slot</Button></DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {slots.filter(s => s.date === selectedDate).map((slot) => {
                                    const isBooked = slot.status === 'booked';
                                    const isUnavailable = slot.status === 'unavailable';
                                    return (
                                        <div
                                            key={slot.id}
                                            onClick={() => !isBooked && handleToggleSlotStatus(slot.id)}
                                            className={`p-4 rounded-2xl border relative group flex flex-col items-center gap-2 transition-all ${isBooked ? 'bg-slate-50 opacity-60 grayscale cursor-not-allowed' : isUnavailable ? 'bg-rose-50/50 border-rose-100 hover:border-rose-300 cursor-pointer' : 'hover:border-primary cursor-pointer hover:shadow-md'}`}
                                        >
                                            <Clock className={`h-4 w-4 ${isBooked ? 'text-slate-300' : isUnavailable ? 'text-rose-400' : 'text-primary'}`} />
                                            <span className={`text-sm font-black ${isUnavailable && 'text-rose-900/60'}`}>{slot.time}</span>
                                            <Badge className={`text-[8px] font-black uppercase ${
                                                isBooked ? 'bg-slate-900 shadow-sm' : 
                                                slot.status === 'confirmed' ? 'bg-emerald-600 shadow-lg animate-pulse' :
                                                slot.status === 'selected' ? 'bg-violet-600' :
                                                slot.status === 'pending_payment' ? 'bg-rose-500' :
                                                slot.status === 'shared' ? 'bg-indigo-500' :
                                                isUnavailable ? 'bg-rose-100 text-rose-600 border-rose-200' : 
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                                {slot.status.replace('_', ' ')}
                                            </Badge>
                                            {isBooked && slot.patientId && (
                                                <div className="mt-2 text-[9px] font-black uppercase text-slate-500 bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-200/50 flex items-center gap-1.5 w-full justify-center">
                                                    <UserCircle2 className="h-3 w-3" />
                                                    {(() => {
                                                        const p = patients.find((p: any) => p.patientId === slot.patientId || p.id === slot.patientId);
                                                        return p ? p.name : slot.patientId;
                                                    })()}
                                                </div>
                                            )}
                                            {!isBooked && (
                                                <button className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-rose-50 text-rose-500 rounded-full border border-rose-100 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm transition-all hover:bg-rose-100" onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.id); }}>
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-6">
                                <AlertCircle className="h-7 w-7 text-amber-500" />
                                <div className="flex-1"><h4 className="text-sm font-black text-amber-900">Unallocated Work Hours</h4><p className="text-xs text-amber-800/70">Populate primary morning and afternoon shifts.</p></div>
                                <Button size="sm" variant="outline" className="border-amber-200 text-amber-900 font-black text-[10px] uppercase" onClick={() => handleFillGaps()}>Fill Gaps</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
