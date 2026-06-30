"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { mockDB } from "@/lib/mock-db"
import { Home, Briefcase, Users, Settings, Calendar as CalendarIcon, Clipboard, MessageSquare, FileText, Hospital, Stethoscope, Plane, User, LayoutDashboard, CalendarPlus, Building2, Video } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function BookAppointmentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [mounted, setMounted] = React.useState(false)
    const [user, setUser] = React.useState<any>(null);
    const [profileCompleted, setProfileCompleted] = React.useState(true);
    
    // Booking states
    const [selectedDoctorId, setSelectedDoctorId] = React.useState("");
    const [visitType, setVisitType] = React.useState("in-person");
    const [notes, setNotes] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const doctors = React.useMemo(() => {
        return mockDB.getUsers().filter(u => u.role === 'doctor');
    }, []);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setProfileCompleted(mockDB.isProfileCompleted(parsed.id));
        }
        setDate(new Date());
        setMounted(true);
    }, []);

    const handleBooking = () => {
        if (!selectedDoctorId) {
            toast({
                title: "Selection Required",
                description: "Please select a doctor to continue.",
                variant: "destructive"
            });
            return;
        }
        if (!date) {
            toast({
                title: "Date Required",
                description: "Please select a date from the calendar.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Create a new slot in mockDB for this patient
            const newSlot = {
                doctorId: selectedDoctorId,
                patientId: user.id,
                date: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                time: "10:30 AM", // Defaults for demo
                status: 'booked' as const,
                type: 'Initial' as const,
                duration: visitType === 'virtual' ? 0 : 30 // 0 means virtual/video in our render logic
            };

            const result = mockDB.addSlot(newSlot);
            
            if (result.success) {
                toast({
                    title: "Appointment Booked!",
                    description: "Your consultation has been successfully scheduled.",
                });
                
                // Redirect to appointments page to see the new entry
                setTimeout(() => {
                    router.push('/appointments');
                }, 1500);
            } else {
                toast({
                    title: "Booking Failed",
                    description: result.message || "Could not complete booking.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden">
                    <SidebarTrigger />
                </header>
                <div className="min-h-screen bg-[#f8f7f2] p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-center mb-10 text-slate-800">Book an Appointment</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Appointment Details */}
                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-xl">Appointment Details</CardTitle>
                                    <CardDescription>Fill in the details for your appointment.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* 1. Select a Doctor */}
                                    <div className="space-y-3">
                                        <Label className="font-semibold">1. Select a Doctor</Label>
                                        <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Choose a doctor..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.map(doc => (
                                                    <SelectItem key={doc.id} value={doc.id}>
                                                        Dr. {doc.lastName} ({doc.specialization})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* 2. Reason for Visit */}
                                    <div className="space-y-3">
                                        <Label className="font-semibold">2. Reason for Visit (Optional)</Label>
                                        <Textarea
                                            placeholder="Briefly describe the reason for your appointment..."
                                            className="resize-none min-h-[100px] bg-slate-50 border-slate-200"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                    {/* 3. Select Visit Type */}
                                    <div className="space-y-3">
                                        <Label className="font-semibold">3. Select Visit Type</Label>
                                        <RadioGroup value={visitType} onValueChange={setVisitType} className="grid grid-cols-1 gap-4">
                                            <div>
                                                <RadioGroupItem value="in-person" id="in-person" className="peer sr-only" />
                                                <Label
                                                    htmlFor="in-person"
                                                    className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-slate-50 [&:has([data-state=checked])]:border-primary cursor-pointer h-16"
                                                >
                                                    <Building2 className="mr-2 h-5 w-5" />
                                                    In-Person
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Right Column: Date & Time */}
                            <div className="space-y-6">
                                <Card className="border-none shadow-sm bg-white h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl">4. Select a Date & Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Select Date & Time</div>
                                                <div className="text-4xl font-light text-slate-800 mb-1">
                                                    {!mounted ? '...' : (date ? date.toLocaleString('en-US', { month: 'short', day: 'numeric' }) : 'Select Date')}
                                                </div>
                                                <div className="text-4xl font-light text-slate-800 mb-1">10:30</div>
                                                <div className="flex gap-2 text-xl text-slate-500 font-medium mt-1">
                                                    <span className="text-slate-900">AM</span>
                                                    <span>PM</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    className="rounded-md border-none"
                                                    initialFocus
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end gap-4 mt-auto">
                                        <Button variant="ghost" onClick={() => router.back()} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">CANCEL</Button>
                                        <Button variant="ghost" onClick={handleBooking} disabled={isSubmitting} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                            {isSubmitting ? '...' : 'OK'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="mt-8 flex justify-end">
                            <Button 
                                onClick={handleBooking}
                                disabled={isSubmitting}
                                className="w-full md:w-auto px-8 py-6 text-lg bg-[#869f96] hover:bg-[#6e857d] text-white"
                            >
                                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
