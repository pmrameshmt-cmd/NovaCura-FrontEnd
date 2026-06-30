'use client';

import { useState, useEffect } from "react";
import { mockDB } from "@/lib/mock-db";
import { fetchWithTimeout } from "@/lib/config";
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
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Hospital,
    Stethoscope,
    UserCircle,
    Star,
    CheckCircle2
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export default function AdminDoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        firstName: "",
        lastName: "",
        specialty: "",
        hospital: "",
        experience: "",
        qualification: ""
    });

    useEffect(() => {
        const fetchRealDoctors = async () => {
            try {
                const userData = localStorage.getItem('user');
                const token = userData ? JSON.parse(userData).token : '';
                const response = await fetchWithTimeout('/services/api/admin/doctors', {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const drs = await response.json();
                    const live = drs.map((d: any) => ({
                        id: d.id,
                        name: `Dr. ${d.firstName} ${d.lastName}`,
                        specialty: d.role.includes('MODERATE') ? "Consultant" : (d.specialization || "Specialist"),
                        hospital: d.hospitalId || "Global Network",
                        experience: `${d.experience || 5}+ Years`,
                        rating: 5.0,
                        active: d.emailVerified,
                        emoji: d.role.includes('MODERATE') ? '🏥' : '🩺'
                    }));
                    if (live.length > 0) {
                        setDoctors(live);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Backend doctors unreachable, using mock data", err);
            }

            // Mock Data Fallback for visual completeness
            const docList = mockDB.getUsers().filter(u => u.role === 'doctor').map(d => ({
                id: d.id,
                name: `Dr. ${d.firstName} ${d.lastName}`,
                specialty: d.specialization || "General Medicine",
                hospital: d.hospitalId === 'HOS-01' ? "Apollo Hospitals" : "General Hospital",
                experience: `${d.experience || 0}+ Years`,
                rating: d.rating || 5.0,
                active: true,
                emoji: d.emoji || '👨‍⚕️'
            }));
            setDoctors(docList);
        };

        fetchRealDoctors();
    }, []);

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRegister = () => {
        if (!newDoctor.firstName || !newDoctor.lastName || !newDoctor.specialty) {
            toast({
                title: "Error",
                description: "Name and specialty are required.",
                variant: "destructive"
            });
            return;
        }

        // Generate a real system ID for persistence
        const doctorId = mockDB.generateDoctorId();

        const doctor: any = {
            id: doctorId,
            role: 'doctor',
            firstName: newDoctor.firstName,
            lastName: newDoctor.lastName,
            email: `${newDoctor.firstName.toLowerCase()}.${newDoctor.lastName.toLowerCase()}@healhome.com`,
            specialization: newDoctor.specialty.charAt(0).toUpperCase() + newDoctor.specialty.slice(1),
            hospitalId: newDoctor.hospital === "Apollo Hospital" ? "HOS-01" : "HOS-02",
            experience: parseInt(newDoctor.experience) || 5,
            rating: 5.0,
            ratingCount: 1,
            isOnline: true,
            emoji: '👨‍⚕️',
            joined: new Date().toLocaleDateString()
        };

        // Persist to MockDB so it reflects across the entire portal (Assign Doctor dropdowns, etc)
        mockDB.addUser(doctor);

        setDoctors([{
            id: doctor.id,
            name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            specialty: doctor.specialization,
            hospital: newDoctor.hospital || "General Hospital",
            experience: `${doctor.experience}+ Years`,
            rating: 5.0,
            active: true,
            emoji: doctor.emoji
        }, ...doctors]);

        setNewDoctor({ firstName: "", lastName: "", specialty: "", hospital: "", experience: "", qualification: "" });
        setIsAddDialogOpen(false);

        toast({
            title: "Doctor Registered",
            description: `${doctor.firstName} ${doctor.lastName} has been added to the database with ID: ${doctorId}`,
        });
    };

    const handleDelete = (id: number) => {
        const doc = doctors.find(d => d.id === id);
        setDoctors(doctors.filter(d => d.id !== id));
        toast({
            title: "Doctor Removed",
            description: `${doc?.name} has been removed.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Doctor Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Register new doctors and link them to Specialised treatments and hospitals.
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Register Doctor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Register New Doctor</DialogTitle>
                            <DialogDescription>
                                Add a new healthcare professional to the platform.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Dr. John"
                                        value={newDoctor.firstName}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={newDoctor.lastName}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Primary Specialty</Label>
                                <Select onValueChange={(v) => setNewDoctor({ ...newDoctor, specialty: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cardiology">Cardiology</SelectItem>
                                        <SelectItem value="neurology">Neurology</SelectItem>
                                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                        <SelectItem value="oncology">Oncology</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hospital">Associated Hospital</Label>
                                <Select onValueChange={(v) => setNewDoctor({ ...newDoctor, hospital: v === "1" ? "Apollo Hospital" : v === "2" ? "Fortis Escorts" : "Max Healthcare" })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select hospital" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Apollo Hospital</SelectItem>
                                        <SelectItem value="2">Fortis Escorts</SelectItem>
                                        <SelectItem value="3">Max Healthcare</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="exp">Experience</Label>
                                    <Input
                                        id="exp"
                                        placeholder="e.g. 15 Years"
                                        value={newDoctor.experience}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Input
                                        id="qualification"
                                        placeholder="e.g. MBBS, MD"
                                        value={newDoctor.qualification}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleRegister} className="w-full">Complete Registration</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or specialty..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>Hospital</TableHead>
                                    <TableHead>Experience</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDoctors.map((doctor) => (
                                    <TableRow key={doctor.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center relative border border-slate-100 shadow-sm text-xl">
                                                    {doctor.emoji || '👨‍⚕️'}
                                                    {doctor.active && (
                                                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{doctor.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">ID: {doctor.id}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Stethoscope className="h-3.5 w-3.5 text-primary" />
                                                {doctor.specialty}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Hospital className="h-3.5 w-3.5" />
                                                {doctor.hospital}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">{doctor.experience}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-bold">{doctor.rating}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={doctor.active ? "default" : "secondary"} className={doctor.active ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                                {doctor.active ? "Verified" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Edit className="h-4 w-4" /> Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-primary">
                                                        <CheckCircle2 className="h-4 w-4" /> Link to Package
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(doctor.id)}>
                                                        <Trash2 className="h-4 w-4" /> Remove Doctor
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
