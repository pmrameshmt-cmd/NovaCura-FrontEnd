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
    MessageSquare,
    User,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Clock,
    UserPlus,
    Filter,
    MoreHorizontal
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

const initialInquiries = [
    {
        id: "INQ-2045",
        patient: "Sarah Miller",
        concern: "Need consultation for spinal surgery pricing.",
        source: "Website Contact Form",
        date: "2024-02-23",
        assignedTo: "Rajesh Kumar",
        status: "New"
    },
    {
        id: "INQ-2046",
        patient: "David Vane",
        concern: "Is accommodation included in the IVF package?",
        source: "WhatsApp Inquiry",
        date: "2024-02-22",
        assignedTo: "Unassigned",
        status: "In Progress"
    },
    {
        id: "INQ-2047",
        patient: "Linda Grey",
        concern: "Urgent heart checkup appointment in Delhi.",
        source: "Direct Email",
        date: "2024-02-21",
        assignedTo: "Priya Singh",
        status: "Converted"
    },
];

export default function AdminInquiriesPage() {
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInquiries = inquiries.filter(inq =>
        inq.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.concern.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = (id: string) => {
        setInquiries(inquiries.map(inq =>
            inq.id === id ? { ...inq, assignedTo: "Admin User", status: "In Progress" } : inq
        ));
        toast({
            title: "Inquiry Assigned",
            description: `Assigned to Admin User.`,
        });
    };

    const handleRespond = (patient: string) => {
        toast({
            title: "Response Started",
            description: `Opening secure channel to message ${patient}...`,
        });
    };

    const handleStatusUpdate = (id: string, status: string) => {
        setInquiries(inquiries.map(inq =>
            inq.id === id ? { ...inq, status } : inq
        ));
        toast({
            title: "Status Updated",
            description: `Inquiry marked as ${status}.`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Inquiry Management</h1>
                <p className="text-muted-foreground mt-1">
                    Track and respond to new patient inquiries and assign them to coordinators.
                </p>
            </div>

            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search inquiries..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6">Status</TableHead>
                                <TableHead>Patient & Concern</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInquiries.map((inq) => (
                                <TableRow key={inq.id}>
                                    <TableCell className="px-6">
                                        <Badge
                                            variant={
                                                inq.status === 'New' ? 'default' :
                                                    inq.status === 'Converted' ? 'secondary' : 'outline'
                                            }
                                            className={
                                                inq.status === 'New' ? 'bg-primary' :
                                                    inq.status === 'Converted' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : ''
                                            }
                                        >
                                            {inq.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[300px]">
                                            <span className="font-medium text-sm">{inq.patient}</span>
                                            <span className="text-xs text-muted-foreground truncate italic">{inq.concern}</span>
                                            <span className="text-[10px] text-muted-foreground opacity-70 mt-1">Source: {inq.source}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${inq.assignedTo === 'Unassigned' ? 'bg-muted text-muted-foreground' : 'bg-secondary text-primary'}`}>
                                                {inq.assignedTo === 'Unassigned' ? '?' : inq.assignedTo[0]}
                                            </div>
                                            <span className={`text-sm ${inq.assignedTo === 'Unassigned' ? 'text-muted-foreground italic' : 'font-medium'}`}>{inq.assignedTo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{inq.date}</TableCell>
                                    <TableCell className="text-right px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => handleAssign(inq.id)}>
                                                <UserPlus className="h-3.5 w-3.5" />
                                                Assign
                                            </Button>
                                            <Button size="sm" className="h-8 gap-2" onClick={() => handleRespond(inq.patient)}>
                                                Respond
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Inquiry Status</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleStatusUpdate(inq.id, 'Converted')}>
                                                        <CheckCircle2 className="h-4 w-4" /> Mark Converted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleStatusUpdate(inq.id, 'Lost')}>
                                                        <XCircle className="h-4 w-4" /> Close / Lost
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2">
                                                        <Clock className="h-4 w-4" /> Activity Log
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
