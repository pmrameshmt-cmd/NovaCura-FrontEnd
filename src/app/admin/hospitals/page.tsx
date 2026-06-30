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
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    MapPin,
    Star,
    Image as ImageIcon,
    ExternalLink
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

import { ALL_HOSPITALS } from "@/lib/hospital-data";
import Link from 'next/link';

const initialHospitals = ALL_HOSPITALS.map(h => ({
    id: h.id.split('-')[1],
    name: h.name,
    location: h.location,
    rating: h.rating,
    reviews: h.reviews,
    contact: h.contact || "+91 00 0000 0000",
    treatments: h.specialities,
    pagePath: h.pagePath,
    websiteUrl: h.websiteUrl
}));

export default function AdminHospitalsPage() {
    const [hospitals, setHospitals] = useState(initialHospitals);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHospital, setEditingHospital] = useState<any>(null);
    const [hospitalForm, setHospitalForm] = useState({
        name: "",
        location: "",
        contact: "",
        treatments: ""
    });

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (hospital?: any) => {
        if (hospital) {
            setEditingHospital(hospital);
            setHospitalForm({
                name: hospital.name,
                location: hospital.location,
                contact: hospital.contact,
                treatments: hospital.treatments.join(", ")
            });
        } else {
            setEditingHospital(null);
            setHospitalForm({ name: "", location: "", contact: "", treatments: "" });
        }
        setIsDialogOpen(true);
    };

    const handleSaveHospital = () => {
        if (!hospitalForm.name || !hospitalForm.location) {
            toast({
                title: "Error",
                description: "Hospital name and location are required.",
                variant: "destructive"
            });
            return;
        }

        const treatmentsArray = hospitalForm.treatments.split(",").map(s => s.trim()).filter(s => s !== "");

        if (editingHospital) {
            setHospitals(hospitals.map(h => h.id === editingHospital.id ? {
                ...h,
                name: hospitalForm.name,
                location: hospitalForm.location,
                contact: hospitalForm.contact,
                treatments: treatmentsArray
            } : h));
            toast({ title: "Hospital Updated", description: `${hospitalForm.name} details have been saved.` });
        } else {
            const newId = (Math.max(...hospitals.map(h => parseInt(h.id))) + 1).toString().padStart(3, '0');
            const hospital = {
                id: newId,
                name: hospitalForm.name,
                location: hospitalForm.location,
                contact: hospitalForm.contact,
                rating: 5.0,
                reviews: 0,
                treatments: treatmentsArray,
                pagePath: `/hospitals/${hospitalForm.name.toLowerCase().replace(/ /g, '-')}`,
                websiteUrl: '#'
            };
            setHospitals([hospital, ...hospitals]);
            toast({ title: "Hospital Added", description: `${hospital.name} has been added.` });
        }

        setIsDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        const hospital = hospitals.find(h => h.id === id);
        if (confirm(`Are you sure you want to delete ${hospital?.name}?`)) {
            setHospitals(hospitals.filter(h => h.id !== id));
            toast({
                title: "Hospital Removed",
                description: `${hospital?.name} has been deleted.`,
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hospital Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Total {hospitals.length} partnered institutions online.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4" />
                    Add Hospital
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>{editingHospital ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>
                            <DialogDescription>
                                {editingHospital ? "Update the clinical records for this institution." : "Enter the details of the new hospital to add it to the platform."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Hospital Name"
                                    className="col-span-3"
                                    value={hospitalForm.name}
                                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="City, Country"
                                    className="col-span-3"
                                    value={hospitalForm.location}
                                    onChange={(e) => setHospitalForm({ ...hospitalForm, location: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contact" className="text-right">Contact</Label>
                                <Input
                                    id="contact"
                                    placeholder="Phone Number"
                                    className="col-span-3"
                                    value={hospitalForm.contact}
                                    onChange={(e) => setHospitalForm({ ...hospitalForm, contact: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="treatments" className="text-right">specialities</Label>
                                <Input
                                    id="treatments"
                                    placeholder="Cardiology, Neurology..."
                                    className="col-span-3"
                                    value={hospitalForm.treatments}
                                    onChange={(e) => setHospitalForm({ ...hospitalForm, treatments: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSaveHospital}>
                                {editingHospital ? "Update Institution" : "Save Hospital"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search hospitals..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="font-bold py-4">Hospital</TableHead>
                                    <TableHead className="font-bold">Location</TableHead>
                                    <TableHead className="font-bold">Rating</TableHead>
                                    <TableHead className="font-bold">specialities</TableHead>
                                    <TableHead className="font-bold">Contact</TableHead>
                                    <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHospitals.map((hospital) => (
                                    <TableRow key={hospital.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="py-6 pl-8 font-bold">
                                            <div className="flex flex-col">
                                                <Link href={hospital.pagePath} className="font-bold text-sm text-slate-800 hover:text-primary transition-colors leading-tight tracking-tight">
                                                    {hospital.name}
                                                </Link>
                                                <span className="text-[10px] uppercase font-black tracking-tighter text-slate-400 mt-1">ID: HSP-00{hospital.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <MapPin className="h-3.5 w-3.5 text-slate-300" />
                                                {hospital.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-bold text-slate-700">{hospital.rating}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">({hospital.reviews})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                {hospital.treatments.slice(0, 2).map((t) => (
                                                    <Badge key={t} variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none text-[9px] px-2 py-0.5 h-auto font-bold uppercase tracking-wider">
                                                        {t}
                                                    </Badge>
                                                ))}
                                                {hospital.treatments.length > 2 && (
                                                    <span className="text-[9px] font-black text-slate-300">+{hospital.treatments.length - 2}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600 font-medium">{hospital.contact}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                                                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400">Institutional Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2 text-xs font-medium py-2.5 cursor-pointer" onClick={() => handleOpenDialog(hospital)}>
                                                        <Edit className="h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-xs font-medium py-2.5 cursor-pointer" onClick={() => window.open(hospital.pagePath, '_blank')}>
                                                        <ExternalLink className="h-4 w-4" /> View Public Page
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-xs font-bold py-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer" onClick={() => handleDelete(hospital.id)}>
                                                        <Trash2 className="h-4 w-4" /> Delete Hospital
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
