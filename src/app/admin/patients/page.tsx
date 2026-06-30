'use client';

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import { mockDB } from "@/lib/mock-db";
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
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle2,
    XCircle,
    UserCircle,
    Download,
    Loader2,
    RefreshCw
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Stethoscope } from "lucide-react";


export default function AdminPatientsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminPatientsContent />
        </Suspense>
    );
}

function AdminPatientsContent() {
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status');
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");
    const [selectedCaseId, setSelectedCaseId] = useState<string>("");
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("admin");
    const { toast } = useToast();
    const router = useRouter();

    const fetchPatients = async () => {
        setIsSyncing(true);
        try {
            const userData = localStorage.getItem('user');
            let token = '';
            if (userData) {
                const parsed = JSON.parse(userData);
                setUserRole(parsed.role);
                token = parsed.token;
            }

            // ── Try Real Backend First ──────────────────────────────────────────────
            try {
                const response = await fetchWithTimeout('/services/api/admin/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPatients(data);
                    // Also fetch doctors from real backend if possible
                    const drResponse = await fetchWithTimeout('/services/api/admin/doctors', { 
                        headers: { 'Authorization': `Bearer ${token}` } 
                    });
                    if (drResponse.ok) {
                        const drs = await drResponse.json();
                        setDoctors(drs); // The backend now filters these properly
                    }
                    return; // Successfully loaded from real DB
                }
            } catch (backendError) {
                console.warn("Backend unreachable, falling back to local MockDB", backendError);
            }

            // ── Falling back to MockDB (for offline testability) ───────────────────
            const allPatients = mockDB.getUsers().filter(u => u.role === 'patient');
            const allCases = mockDB.getCases();
            
            // Group cases by patientId and keep only the latest case for each
            const latestCasesByPatient: Record<string, any> = {};
            allCases.forEach(c => {
                if (!latestCasesByPatient[c.patientId] || 
                    new Date(c.lastUpdated).getTime() > new Date(latestCasesByPatient[c.patientId].lastUpdated).getTime()) {
                    latestCasesByPatient[c.patientId] = c;
                }
            });

            const patientData = allPatients.map(p => {
                const c = latestCasesByPatient[p.id];
                const d = c?.doctorId ? mockDB.getUserById(c.doctorId) : null;
                
                return {
                    id: p.id,
                    caseId: c?.id || null,
                    name: `${p.firstName} ${p.lastName}`,
                    email: p.email,
                    treatment: c?.type || 'Not Started',
                    status: c?.status || 'NEW',
                    joined: p.joined || (c ? new Date(c.lastUpdated).toLocaleDateString() : 'N/A'),
                    forms: c?.documents?.length || 0,
                    assignedDoctor: d ? (d.lastName ? `Dr. ${d.lastName}` : `Dr. ${d.firstName}`) : null,
                    doctorId: c?.doctorId || null
                };
            });

            setPatients(patientData.sort((a, b) => (a.assignedDoctor ? 1 : -1)));
            setDoctors(mockDB.getUsers().filter(u => u.role === 'doctor'));

        } catch (error) {
            console.error("Error fetching patients:", error);
            toast({ variant: "destructive", title: "Sync Error", description: "Failed to load clinical records from database." });
        } finally {
            setLoading(false);
            setTimeout(() => setIsSyncing(false), 500);
        }
    };

    useEffect(() => {
        fetchPatients();
        window.addEventListener('mock-db-update', fetchPatients);
        window.addEventListener('storage', fetchPatients);
        return () => {
            window.removeEventListener('mock-db-update', fetchPatients);
            window.removeEventListener('storage', fetchPatients);
        };
    }, []);

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.treatment.toLowerCase().includes(searchTerm.toLowerCase());

        if (!statusFilter || statusFilter === 'all') return matchesSearch;

        if (statusFilter === 'Active') {
            return matchesSearch && (patient.assignedDoctor !== null || patient.doctorId !== null) && patient.status !== 'Consultation Completed';
        }

        if (statusFilter === 'Pending') {
            return matchesSearch && !patient.assignedDoctor && !patient.doctorId;
        }

        return matchesSearch && patient.status === statusFilter;
    });

    const handleExport = () => {
        toast({
            title: "Exporting Data",
            description: "Preparing patient report for download...",
        });

        setTimeout(() => {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "ID,Name,Email,Status,Last Updated\n"
                + filteredPatients.map(p => `${p.id},${p.name},${p.user.email},${p.status},${p.lastUpdated}`).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `patient_records_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Export Complete",
                description: `Successfully exported ${filteredPatients.length} patient records.`,
            });
        }, 1500);
    };

    const handleAssignDoctor = async () => {
        if (!selectedDoctorId) return;

        const userData = localStorage.getItem('user');
        const token = userData ? JSON.parse(userData).token : '';

        // ── Priority 1: Real Database Assignment ────────────────────────────────
        try {
            const response = await fetchWithTimeout('/services/api/admin/patients/assign', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId: selectedPatientId,
                    doctorId: selectedDoctorId
                })
            });

            if (response.ok) {
                toast({ title: "Clinical Assignment Confirmed", description: "Patient has been routed to professional for real-time review (MongoDB)." });
                setAssignModalOpen(false);
                fetchPatients(); // Reload table
                return;
            }
        } catch (err) {
            console.warn("Backend assignment failed, falling back to local storage", err);
        }

        // ── Priority 2: Local MockDB Fallback ───────────────────────────────────
        let targetCaseId = selectedCaseId;
        
        // If we don't have a caseId associated, but have a patientId, check for the latest case
        if (!targetCaseId && selectedPatientId) {
            const allCases = mockDB.getCases().filter(c => c.patientId === selectedPatientId);
            if (allCases.length > 0) {
                targetCaseId = allCases.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0].id;
            } else {
                const newId = mockDB.generateCaseId();
                mockDB.addCase({
                    id: newId,
                    patientId: selectedPatientId,
                    doctorId: null,
                    status: 'NEW',
                    type: 'General Consultation',
                    urgency: 'Routine',
                    medicalData: {},
                    lastUpdated: new Date().toISOString(),
                    documents: [],
                    timeline: [],
                    notes: [],
                    paymentStatus: 'Unpaid',
                    readiness: {
                        caseSheetCompleted: false,
                        reportsUploaded: false,
                        slotSelected: false,
                        paymentCompleted: false
                    }
                });
                targetCaseId = newId;
            }
        }

        if (!targetCaseId) {
             toast({ variant: "destructive", title: "Assignment Not Possible", description: "No clinical case associated with this patient account." });
             return;
        }

        const success = mockDB.assignDoctor(targetCaseId, selectedDoctorId);
        
        if (success) {
            toast({ title: "Clinical Assignment Confirmed", description: "Patient has been routed for clinical review (offline mode)." });
        } else {
            toast({ variant: "destructive", title: "Protocol Error", description: "Failed to update case assignment in database." });
        }
        
        setAssignModalOpen(false);
        setSelectedCaseId("");
        setSelectedPatientId("");
        setSelectedDoctorId("");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        Patient Management
                        {isSyncing && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage patient profiles, documentation, and verification status in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-8 gap-1.5 font-medium px-3 bg-emerald-50 text-emerald-700 border-emerald-200">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        API Sync Active
                    </Badge>
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email or ID..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {statusFilter && statusFilter !== 'all' && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs text-muted-foreground hover:text-primary"
                                    onClick={() => router.push('/admin/patients')}
                                >
                                    Clear Filter
                                </Button>
                            )}
                            <Button variant="outline" size="sm" className="gap-2 text-xs h-9">
                                <Filter className="h-4 w-4" />
                                {statusFilter && statusFilter !== 'all' ? statusFilter : 'All Status'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                    <TableHead>Treatment</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && patients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-sm font-medium text-muted-foreground">Initializing real-time sync...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <p className="text-sm font-medium text-muted-foreground">No patients found matching your search.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <TableRow key={patient.id} className="group hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-mono text-xs">{patient.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] border border-primary/20">
                                                        {patient.name[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Link href={`/admin/patients/${patient.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                                                            {patient.name}
                                                        </Link>
                                                        <span className="text-[10px] text-muted-foreground">{patient.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{patient.joined}</TableCell>
                                            <TableCell className="text-sm font-medium">{patient.treatment}</TableCell>
                                            <TableCell className="text-sm">
                                                {patient.assignedDoctor ? (
                                                    <Badge variant="outline" className="font-semibold bg-blue-50 text-blue-700 border-blue-200">
                                                        {patient.assignedDoctor}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-slate-400 border-dashed">
                                                        Unassigned
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                        patient.status === 'Case Sheet Submitted' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                        patient.status === 'Review Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                        patient.status === 'Doctor Assigned' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                        patient.status === 'NEW' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                        'bg-amber-100 text-amber-700 border-amber-200'
                                                    }`}
                                                >
                                                    {patient.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <Link href={`/admin/patients/${patient.id}`}>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        {(userRole.toLowerCase() === 'supervisor' || userRole.toLowerCase() === 'admin') && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="gap-2 text-blue-600 font-semibold cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedPatientId(patient.id);
                                                                        setSelectedCaseId(patient.caseId || "");
                                                                        setSelectedDoctorId(patient.doctorId || "");
                                                                        setAssignModalOpen(true);
                                                                    }}
                                                                >
                                                                    <Stethoscope className="h-4 w-4" /> Assign Doctor
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Assign Doctor Modal */}
            <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Medical Case</DialogTitle>
                        <DialogDescription>Select a Moderate Doctor to handle this patient's consultation loop.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(d => (
                                    <SelectItem key={d.id} value={d.id}>
                                        Dr. {d.firstName} {d.lastName} ({d.specialization || d.hospitalId})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignDoctor} disabled={!selectedDoctorId}>Confirm Assignment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
