"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import React, { useState, useEffect, useMemo } from 'react'
import { 
    Search, Filter, Star, Heart, Wind, Scan, Brain, Sparkles, 
    Bone, Smile, Languages, MapPin, Clock, Calendar, CheckCircle2, 
    AlertCircle, Activity, ArrowRight, X, User, ChevronRight,
    Trophy, GraduationCap, Building2, Stethoscope, DollarSign,
    ArrowLeftRight, MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from "next/navigation"
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";

export default function DoctorsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profileCompleted, setProfileCompleted] = useState(true);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filterExp, setFilterExp] = useState("all");
    const [filterRating, setFilterRating] = useState("all");
    const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
    const [compareList, setCompareList] = useState<any[]>([]);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserData = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                // Profile completion check could be moved to backend too if needed
                setProfileCompleted(true); 
            }
        };

        const fetchDoctorsList = async () => {
            try {
                const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/public/doctors`, {}, 5000);
                if (response.ok) {
                    const data = await response.json();
                    setDoctors(data);
                }
            } catch (err) {
                console.error("Fetch doctors error:", err);
            }
        };

        fetchUserData();
        fetchDoctorsList();
        
        // Polling for real-time presence updates
        const interval = setInterval(fetchDoctorsList, 15000);
        window.addEventListener('focus', fetchDoctorsList);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', fetchDoctorsList);
        };
    }, []);

    const categories = [
        { name: "All", icon: Activity },
        { name: "Cardiology", icon: Heart },
        { name: "Pulmonology", icon: Wind },
        { name: "Nephrology", icon: Scan },
        { name: "Neurology", icon: Brain },
        { name: "Dermatology", icon: Sparkles },
        { name: "Orthopedics", icon: Bone },
        { name: "Dentistry", icon: Smile },
    ]

    const filteredDoctors = useMemo(() => {
        let list = [...doctors];

        // 1. Recommendation Logic
        const hasCardioCase = false; // Simplified for now since cases are in separate API
        
        if (hasCardioCase && selectedCategory === "All") {
            // Sort cardiologists to top
            list.sort((a, b) => {
                if (a.specialization === 'Cardiology' && b.specialization !== 'Cardiology') return -1;
                if (a.specialization !== 'Cardiology' && b.specialization === 'Cardiology') return 1;
                return 0;
            });
        }

        return list.filter(doc => {
            const matchesSearch = (doc.firstName + " " + doc.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                                doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = selectedCategory === "All" || doc.specialization === selectedCategory;
            const matchesExp = filterExp === "all" || 
                              (filterExp === "10" && (doc.experience || 0) >= 10) ||
                              (filterExp === "20" && (doc.experience || 0) >= 20);
            const matchesRating = filterRating === "all" || (doc.rating || 0) >= parseFloat(filterRating);

            return matchesSearch && matchesCat && matchesExp && matchesRating;
        });
    }, [doctors, searchTerm, selectedCategory, filterExp, filterRating, user]);

    const addToCompare = (doc: any) => {
        if (compareList.find(d => d.id === doc.id)) {
            setCompareList(compareList.filter(d => d.id !== doc.id));
        } else if (compareList.length < 3) {
            setCompareList([...compareList, doc]);
        } else {
            toast({
                title: "Compare limit reached",
                description: "You can compare up to 3 doctors at a time.",
                variant: "destructive"
            });
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden border-b">
                    <SidebarTrigger />
                    <span className="font-bold">Find a Doctor</span>
                </header>
                <div className="min-h-screen bg-[#f8f7f2]">
                    {/* Hero / Header Section */}
                    <div className="bg-white border-b px-8 py-10">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Find Specialists</h1>
                                    <p className="text-slate-500 mt-2 text-lg">Connect with word-class healthcare professionals globally.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {compareList.length > 0 && (
                                        <Button 
                                            variant="outline" 
                                            className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
                                            onClick={() => setIsCompareOpen(true)}
                                        >
                                            <ArrowLeftRight className="h-4 w-4" />
                                            Compare ({compareList.length})
                                        </Button>
                                    )}
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input 
                                            placeholder="Search by name, specialty..." 
                                            className="pl-10 h-11 bg-slate-50 border-slate-200"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                    {categories.map((cat) => (
                                        <Button
                                            key={cat.name}
                                            variant={selectedCategory === cat.name ? "default" : "outline"}
                                            size="sm"
                                            className="gap-2 rounded-full h-9"
                                            onClick={() => setSelectedCategory(cat.name)}
                                        >
                                            <cat.icon className="h-3.5 w-3.5" />
                                            {cat.name}
                                        </Button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select value={filterExp} onValueChange={setFilterExp}>
                                        <SelectTrigger className="w-[140px] h-9 rounded-full bg-slate-50">
                                            <SelectValue placeholder="Experience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Any Experience</SelectItem>
                                            <SelectItem value="10">10+ Years</SelectItem>
                                            <SelectItem value="20">20+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={filterRating} onValueChange={setFilterRating}>
                                        <SelectTrigger className="w-[140px] h-9 rounded-full bg-slate-50">
                                            <SelectValue placeholder="Rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Any Rating</SelectItem>
                                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                            <SelectItem value="4.8">4.8+ Stars</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 max-w-7xl mx-auto">
                        {/* Recommendation Banner (Placeholder) */}
                        {user && selectedCategory === "Recommendation" && (
                            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-emerald-900">Recommended for you</p>
                                    <p className="text-xs text-emerald-700">Based on your cardiology case history, we've prioritized specialists for you.</p>
                                </div>
                            </div>
                        )}

                        {/* Doctors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDoctors.map((doctor) => {
                                const isComparing = compareList.find(d => d.id === doctor.id);
                                return (
                                    <Card key={doctor.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col cursor-pointer" onClick={() => setSelectedDoctor(doctor)}>
                                        <div className="p-6 flex flex-col items-center text-center">
                                            <div className="relative mb-6">
                                                <div className="h-28 w-28 rounded-full border-4 border-slate-50 flex items-center justify-center bg-slate-100 text-5xl shadow-inner">
                                                    {doctor.emoji || '👨‍⚕️'}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-slate-900">Dr. {doctor.firstName} {doctor.lastName}</h3>
                                            <div className="flex items-center gap-1.5 mt-1 text-primary font-semibold text-sm">
                                                <Stethoscope className="h-3.5 w-3.5" />
                                                {doctor.specialization || 'Specialist'}
                                            </div>

                                            {/* Real-time Presence Indicator */}
                                            <div className="mt-3">
                                                {doctor.isOnline ? (
                                                    <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in duration-1000">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Online Now
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-slate-500 font-bold text-xs bg-slate-100 px-3 py-1 rounded-full">
                                                        <Clock className="h-3 w-3" />
                                                        {doctor.lastSeen ? `Last seen ${formatDistanceToNow(new Date(doctor.lastSeen), { addSuffix: true })}` : 'Offline'}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mt-4 w-full justify-center text-[13px] text-slate-500 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                                    {doctor.experience || 0}Y Exp
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                    {doctor.rating || 'N/A'} ({doctor.ratingCount || 0})
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-1 py-1 px-3 bg-slate-50 rounded-full text-xs text-slate-600 hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                                                <Building2 className="h-3 w-3" />
                                                <Link href={`/hospitals/${doctor.hospitalId}`} className="hover:underline font-medium">
                                                    {doctor.hospitalId === 'HOS-01' ? 'Apollo Hospitals' : 'General Hospital'}
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="mt-auto px-6 py-4 border-t bg-slate-50/50 flex items-center gap-3">
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starting at</p>
                                                <p className="text-lg font-black text-slate-900">${doctor.fees?.online || 0}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className={`h-9 w-9 rounded-full ${isComparing ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-slate-200'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCompare(doctor);
                                                    }}
                                                >
                                                    <ArrowLeftRight className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" className="rounded-xl px-4 gap-2 font-bold bg-white" onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push('/consultations');
                                                }}>
                                                    Consult
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Doctor Comparison Dialog */}
                <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Compare Specialists</DialogTitle>
                            <DialogDescription>Side-by-side comparison of your selected doctors.</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 border rounded-xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[150px]">Feature</TableHead>
                                        {compareList.map(doc => (
                                            <TableHead key={doc.id} className="text-center min-w-[150px]">
                                                <div className="flex flex-col items-center gap-2 py-2">
                                                    <div className="h-12 w-12 rounded-full border flex items-center justify-center bg-slate-50 text-2xl">
                                                        {doc.emoji || '👨‍⚕️'}
                                                    </div>
                                                    <span className="font-bold">Dr. {doc.lastName}</span>
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Specialty</TableCell>
                                        {compareList.map(doc => (
                                            <TableCell key={doc.id} className="text-center">{doc.specialization}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Experience</TableCell>
                                        {compareList.map(doc => (
                                            <TableCell key={doc.id} className="text-center">{doc.experience} Years</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Rating</TableCell>
                                        {compareList.map(doc => (
                                            <TableCell key={doc.id} className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    {doc.rating}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Online Fee</TableCell>
                                        {compareList.map(doc => (
                                            <TableCell key={doc.id} className="text-center font-bold">${doc.fees?.online}</TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Location</TableCell>
                                        {compareList.map(doc => (
                                            <TableCell key={doc.id} className="text-center text-xs">{doc.location}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Doctor Profile Dialog */}
                <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
                    {selectedDoctor && (
                        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Doctor Profile - {selectedDoctor.firstName} {selectedDoctor.lastName}</DialogTitle>
                                <DialogDescription>Full professional profile and clinical history of the specialist.</DialogDescription>
                            </DialogHeader>
                            <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-4 right-4 text-white hover:bg-white/10"
                                    onClick={() => setSelectedDoctor(null)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="px-8 pb-8 -mt-12 relative">
                                <div className="flex flex-col md:flex-row gap-6 items-end md:items-center">
                                    <div className="h-28 w-28 rounded-2xl border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center text-5xl">
                                        {selectedDoctor.emoji || '👨‍⚕️'}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-black text-slate-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h2>
                                            {selectedDoctor.isOnline ? (
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-2 py-0.5 text-[10px] whitespace-nowrap shadow-lg animate-pulse">
                                                    Online Now
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-2 py-0.5 text-[10px] whitespace-nowrap">
                                                    {selectedDoctor.lastSeen ? `Last seen ${formatDistanceToNow(parseISO(selectedDoctor.lastSeen), { addSuffix: true })}` : (selectedDoctor.nextAvailable || 'Contact Hospital')}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <Badge className="bg-primary/10 text-primary border-none">{selectedDoctor.specialization}</Badge>
                                            <div className="flex items-center gap-1 text-sm font-bold text-slate-600">
                                                <Building2 className="h-4 w-4" />
                                                {selectedDoctor.hospitalId === 'HOS-01' ? 'Apollo Hospitals' : 'General Hospital'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-100 min-w-[100px]">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="font-black text-lg">{selectedDoctor.rating}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{selectedDoctor.ratingCount} Reviews</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-center">
                                        <Clock className="h-5 w-5 mx-auto text-primary mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                                        <p className="font-bold text-slate-900">{selectedDoctor.experience} Years</p>
                                    </div>
                                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-center">
                                        <Languages className="h-5 w-5 mx-auto text-primary mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Languages</p>
                                        <p className="font-bold text-slate-900">{selectedDoctor.languages?.join(", ") || "English"}</p>
                                    </div>
                                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-center">
                                        <DollarSign className="h-5 w-5 mx-auto text-primary mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation</p>
                                        <p className="font-bold text-slate-900">${selectedDoctor.fees?.online}</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                        About Doctor
                                    </h4>
                                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                        {selectedDoctor.bio}
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Clinic Location</p>
                                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                                            <MapPin className="h-4 w-4 text-rose-500" />
                                            {selectedDoctor.location}
                                        </div>
                                    </div>
                                    <Button className="h-12 px-8 rounded-xl font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => router.push('/consultations')}>
                                        Connect with Specialist
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    )
}
