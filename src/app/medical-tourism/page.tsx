"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { mockDB } from "@/lib/mock-db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Globe, MapPin, Phone } from 'lucide-react'

export default function MedicalTourismPage() {
    const [user, setUser] = React.useState<any>(null);
    const [profileCompleted, setProfileCompleted] = React.useState(true);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setProfileCompleted(mockDB.isProfileCompleted(parsed.id));
        }
    }, []);

    const destinations = [
        {
            name: "New Delhi, India",
            hospitals: "Apollo, Fortis, Max",
            specialities: "Cardiology, Oncology, Orthopedics",
            details: "World-class healthcare at a fraction of the cost."
        },
        {
            name: "Dubai, UAE",
            hospitals: "American Hospital Dubai, Kings College Hospital",
            specialities: "Cosmetic Surgery, Wellness, Specialised Care",
            details: "Luxury medical care in a global hub."
        }
    ]

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={profileCompleted} user={user} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden">
                    <SidebarTrigger />
                </header>
                <div className="min-h-screen bg-[#f8f7f2] p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-slate-800 mb-8">Medical Tourism</h1>

                        <div className="grid gap-6">
                            <Card className="bg-white shadow-sm border-none">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Plane className="h-6 w-6 text-blue-500" />
                                        Medical Travel Services
                                    </CardTitle>
                                    <CardDescription>
                                        We help you coordinate your medical journey abroad, including visa assistance, travel arrangements, and hospital bookings.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {destinations.map((dest, i) => (
                                            <div key={i} className="p-4 border rounded-lg hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Globe className="h-5 w-5 text-slate-400" />
                                                    <h3 className="font-bold text-lg text-slate-800">{dest.name}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-semibold text-slate-600 block mb-1">Top Hospitals:</span>
                                                        <p className="text-slate-500">{dest.hospitals}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-600 block mb-1">Key specialities:</span>
                                                        <p className="text-slate-500">{dest.specialities}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-3 text-slate-600 italic">{dest.details}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1e4620] text-white border-none">
                                <CardContent className="p-8 text-center sm:text-left flex flex-col sm:row items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Planning your journey?</h2>
                                        <p className="text-white/80">Get a free consultation with our medical travel experts.</p>
                                    </div>
                                    <button className="bg-white text-[#1e4620] px-8 py-3 rounded-md font-bold hover:bg-slate-100 transition-colors">
                                        Contact Us
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
