'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    Calendar,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    Plane,
    Home,
    MapPin,
    AlertCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const bookings = [
    {
        id: "BK-1024",
        patient: "John Doe",
        doctor: "Dr. Ashok Seth",
        hospital: "Fortis Escorts",
        date: "2025-03-15",
        time: "10:30 AM",
        status: "Confirmed",
        travel: "Booked",
        accommodation: "Pending"
    },
    {
        id: "BK-1025",
        patient: "Alice Smith",
        doctor: "Dr. Ben Carter",
        hospital: "Max Healthcare",
        date: "2025-03-22",
        time: "02:00 PM",
        status: "Pending",
        travel: "Not Started",
        accommodation: "Not Started"
    },
    {
        id: "BK-1026",
        patient: "Robert Brown",
        doctor: "Dr. Evelyn Reed",
        hospital: "Apollo Hospital",
        date: "2025-03-25",
        time: "11:00 AM",
        status: "Confirmed",
        travel: "Booked",
        accommodation: "Booked"
    },
];

export default function AdminBookingsPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.hospital.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab =
            activeTab === "all" ||
            booking.status.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch && matchesTab;
    });

    const handleAction = (title: string, description: string) => {
        toast({ title, description });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Booking & Appointments</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage treatment bookings, schedules, and logistics coordination.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => handleAction("New Booking", "Opening booking wizard...")}>
                    <Calendar className="h-4 w-4" />
                    New Booking
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <Card className="mt-4">
                    <CardHeader className="pb-3 px-6 pt-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search bookings..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="px-6">Booking ID</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Care Provider</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Logistics</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="px-6 font-mono text-xs font-semibold">{booking.id}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{booking.patient}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{booking.doctor}</span>
                                                    <span className="text-[10px] text-muted-foreground italic">{booking.hospital}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{booking.date}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {booking.time}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="group relative">
                                                        <Plane className={`h-4 w-4 ${booking.travel === 'Booked' ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border">Travel: {booking.travel}</span>
                                                    </div>
                                                    <div className="group relative">
                                                        <Home className={`h-4 w-4 ${booking.accommodation === 'Booked' ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border">Stay: {booking.accommodation}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={booking.status === 'Confirmed' ? 'default' : 'outline'} className={booking.status === 'Confirmed' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Coordination</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-2" onClick={() => handleAction("Travel Details", `Viewing itinerary for ${booking.id}`)}>
                                                            <Plane className="h-4 w-4" /> Travel Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2" onClick={() => handleAction("Accommodation", `Viewing stay details for ${booking.id}`)}>
                                                            <Home className="h-4 w-4" /> Accommodation
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleAction("Booking Confirmed", `${booking.id} has been marked as confirmed.`)}>
                                                            <CheckCircle2 className="h-4 w-4" /> Mark Confirmed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-primary" onClick={() => handleAction("Rescheduling", `Opening scheduler for ${booking.id}`)}>
                                                            <AlertCircle className="h-4 w-4" /> Reschedule
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}
