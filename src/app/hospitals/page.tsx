"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { ALL_HOSPITALS } from "@/lib/hospital-data"
import { 
    Heart, Brain, Smile, Star, Map, Compass, Leaf, MapPin, ExternalLink, Info, Image as ImageIcon 
} from 'lucide-react'

export default function HospitalsPage() {
    const [user, setUser] = React.useState<any>(null);
    const [profileCompleted, setProfileCompleted] = React.useState(true);
    const [activeCategory, setActiveCategory] = React.useState("All");

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            const isCompleted = !!(parsed.isProfileCompleted || parsed.profileCompleted);
            setProfileCompleted(isCompleted);
        }
    }, []);

    const categories = [
        { name: "All", icon: Compass, active: activeCategory === "All" },
        { name: "Cardiology", icon: Heart, active: activeCategory === "Cardiology" },
        { name: "Neurology", icon: Brain, active: activeCategory === "Neurology" },
        { name: "Dentistry", icon: Smile, active: activeCategory === "Dentistry" },
        { name: "Ayurvedic", icon: Leaf, active: activeCategory === "Ayurvedic" },
    ]

    const filteredHospitals = activeCategory === "All" 
        ? ALL_HOSPITALS 
        : activeCategory === "Ayurvedic"
            ? ALL_HOSPITALS.filter(h => h.category === 'Ayurvedic')
            : ALL_HOSPITALS.filter(h => h.specialities.some(s => s.toLowerCase().includes(activeCategory.toLowerCase())));

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden">
                    <SidebarTrigger />
                </header>
                <div className="min-h-screen bg-[#f8f7f2] p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Global Clinical Network</h1>
                                <p className="text-slate-500 mt-2 text-sm max-w-lg">
                                    Direct access to our verified medical partners. Explore specialities, compare facilities, and visit official portals.
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    {filteredHospitals.length} Institutions Listed
                                </span>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none">
                            {categories.map((cat, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${cat.active
                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                                        : "bg-white text-slate-400 hover:bg-slate-50 shadow-sm border border-slate-100"
                                        }`}
                                >
                                    <cat.icon className={`h-4 w-4 ${cat.active ? "text-primary" : "text-slate-300"}`} />
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Hospital Table - Unified Admin/Patient Design */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white rounded-2xl">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-100">
                                            <TableHead className="font-black py-6 pl-8 text-slate-500 text-[10px] uppercase tracking-widest">Institution</TableHead>
                                            <TableHead className="font-black text-slate-500 text-[10px] uppercase tracking-widest">Global Location</TableHead>
                                            <TableHead className="font-black text-slate-500 text-[10px] uppercase tracking-widest text-center">Clinical Rating</TableHead>
                                            <TableHead className="font-black text-slate-500 text-[10px] uppercase tracking-widest">Key specialities</TableHead>
                                            <TableHead className="font-black text-slate-500 text-[10px] uppercase tracking-widest">Verified Portal</TableHead>
                                            <TableHead className="text-right font-black pr-8 text-slate-500 text-[10px] uppercase tracking-widest">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHospitals.map((hospital) => (
                                            <TableRow key={hospital.id} className="hover:bg-slate-50/40 transition-colors group border-b-slate-50">
                                                <TableCell className="py-6 pl-8">
                                                    <div className="flex flex-col">
                                                        <Link href={hospital.pagePath} className="font-black text-sm text-slate-800 hover:text-primary transition-colors leading-tight tracking-tight">
                                                            {hospital.name}
                                                        </Link>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] uppercase font-black tracking-tighter text-slate-400">ID: {hospital.id}</span>
                                                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{hospital.category}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                                                        <div className="p-1 rounded bg-slate-100">
                                                            <MapPin className="h-3 w-3 text-slate-400" />
                                                        </div>
                                                        {hospital.location}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                            <span className="text-sm font-black text-slate-800">{hospital.rating}</span>
                                                        </div>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">({hospital.reviews} Reviews)</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                        {hospital.specialities.slice(0, 3).map((t) => (
                                                            <Badge key={t} variant="secondary" className="bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100 text-[8px] px-2 py-0.5 h-auto font-black uppercase tracking-widest">
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                        {hospital.specialities.length > 3 && (
                                                            <Badge variant="outline" className="text-[8px] font-black border-slate-100 text-slate-300">
                                                                +{hospital.specialities.length - 3} MORE
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <a 
                                                        href={hospital.websiteUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="group/link inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10"
                                                    >
                                                        Visit Website <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="h-9 text-[9px] font-black uppercase tracking-widest px-5 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 rounded-xl shadow-sm"
                                                            onClick={() => alert(`Institutional Comparison: ${hospital.name} added to your workspace.`)}
                                                        >
                                                            Compare
                                                        </Button>
                                                        <Link href={hospital.pagePath}>
                                                            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-slate-100 rounded-xl group/info">
                                                                <Info className="h-4 w-4 text-slate-300 group-hover/info:text-primary transition-colors" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                        
                        {/* Footer Info */}
                        <div className="mt-8 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                Powered by Novacura Global Health Network &copy; 2026
                            </p>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
