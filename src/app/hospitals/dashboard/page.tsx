"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Stethoscope, Activity, Calendar } from "lucide-react";
import { mockDB, User, MedicalCase } from "@/lib/mock-db";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function HospitalDashboard() {
    const router = useRouter();
    const [hospital, setHospital] = useState<User | null>(null);
    const [doctors, setDoctors] = useState<User[]>([]);
    const [cases, setCases] = useState<MedicalCase[]>([]);

    useEffect(() => {
        const loadDashboard = () => {
            const userData = localStorage.getItem('user');
            if (!userData) {
                router.push('/sign-in');
                return;
            }
            const userObj = JSON.parse(userData);
            if (userObj.role !== 'hospital' && userObj.role !== 'admin') {
                router.push('/dashboard');
                return;
            }

            setHospital(userObj);

            // Fetch doctors belonging to this hospital
            const myDoctors = mockDB.getUsers().filter(u => u.role === 'doctor' && u.hospitalId === userObj.id);
            setDoctors(myDoctors);

            // Fetch cases assigned to this hospital (either via hospitalId or through its doctors)
            const myCases = mockDB.getCases().filter(c =>
                c.hospitalId === userObj.id || myDoctors.some(d => d.id === c.doctorId)
            );
            setCases(myCases);
        };

        loadDashboard();
        window.addEventListener('mock-db-update', loadDashboard);
        return () => window.removeEventListener('mock-db-update', loadDashboard);
    }, [router]);

    if (!hospital) return null;

    return (
        <SidebarProvider>
            <AppSidebar profileCompleted={true} user={hospital} />
            <SidebarInset>
                <header className="flex items-center justify-between p-4 md:hidden border-b bg-white">
                    <SidebarTrigger />
                    <h2 className="font-semibold">{hospital.firstName} {hospital.lastName} Dashboard</h2>
                </header>

                <div className="p-8 bg-[#f8f7f2] min-h-screen space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Hospital Administration</h1>
                        <p className="text-muted-foreground mt-2">Manage your doctors, view active cases, and monitor availability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                                    <Stethoscope className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Registered Doctors</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{doctors.length}</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Active Cases</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{cases.length}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Our Doctors</CardTitle>
                                <CardDescription>Medical professionals operating at this facility</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Doctor</TableHead>
                                            <TableHead>Specialization</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {doctors.map(doc => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">Dr. {doc.firstName} {doc.lastName}</TableCell>
                                                <TableCell>{doc.specialization || 'General'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Patient Cases</CardTitle>
                                <CardDescription>Latest cases routed to your hospital</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Case ID</TableHead>
                                            <TableHead>Assigned Doctor</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cases.slice(0, 5).map(c => {
                                            const d = doctors.find(doc => doc.id === c.doctorId);
                                            return (
                                                <TableRow key={c.id}>
                                                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                                                    <TableCell>{d ? `Dr. ${d.lastName}` : 'Pending Assignment'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                            {c.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {cases.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                                                    No cases found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
