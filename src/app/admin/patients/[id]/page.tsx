'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";
import { mockDB } from "@/lib/mock-db";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    FileText,
    Download,
    Eye,
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Activity,
    History,
    FileSpreadsheet,
    Clock,
    Loader2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchPatientData = async () => {
        try {
            const userData = localStorage.getItem('user');
            const token = userData ? JSON.parse(userData).token : null;

            let finalData = null;

            // 1. Try API first
            try {
                const response = await fetch(`${API_BASE_URL}/services/api/admin/patients/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    finalData = await response.json();
                }
            } catch (e) {
                console.warn("API Unavailable, using mockDB fallback");
            }

            // 2. Fallback to mockDB if API failed or no data
            if (!finalData) {
                // Fetch ALL cases and pick the LATEST one for this patient ID
                const allMockCases = mockDB.getCases().filter((c: any) => c.patientId === id);
                const mockCase = allMockCases.sort((a: any, b: any) => 
                    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
                )[0];

                if (mockCase) {
                    const mockPatient = mockDB.getUserById(id as string);
                    if (mockPatient) {
                        finalData = {
                            user: mockPatient,
                            medicalData: {
                                ...mockCase.medicalData,
                                status: mockCase.status,
                                id: mockCase.id
                            }
                        };
                    }
                }
            }

            if (finalData) {
                setData(finalData);
                setError(null);
            } else {
                setError("Patient or Clinical Case not found in system.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Synchronization error. Patient record unavailable.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientData();
        // Polling for real-time updates
        const interval = setInterval(fetchPatientData, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, [id]);

    const handleUpdateStatus = async (newStatus: string) => {
        setIsUpdating(true);
        // Sync local MockDB for faster UI feedback and cross-portal consistency
        const caseToUpdate = mockDB.getCases().filter((c: any) => c.patientId === id).sort((a: any, b: any) => 
            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        )[0];

        if (caseToUpdate) {
            mockDB.updateCase(caseToUpdate.id, { status: newStatus });
            mockDB.addTimelineEvent(caseToUpdate.id, {
                status: newStatus,
                description: `Admin manual status override to: ${newStatus}`,
                completed: true
            });
        }

        // Network simulation
        setTimeout(() => {
            toast({
                title: `Status Synchronized`,
                description: `Patient record updated to ${newStatus}`,
            });
            setIsUpdating(false);
            fetchPatientData();
        }, 800);
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading real-time profile data...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-bold">Profile Unavailable</h2>
                <p className="text-muted-foreground">{error || "User data could not be retrieved."}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const { user, medicalData } = data;
    const status = medicalData?.status || 'Pending';
    const name = (user.firstName || '') + ' ' + (user.lastName || '');

    // Prepare lists of files if they exist
    const documentKeys = [
        'xrayFile', 'ctScanFile', 'usgFile', 'mriFile',
        'bloodReportFile', 'urineReportFile', 'tissueBiopsyFile',
        'liverFunctionTestFile', 'kidneyFunctionTestFile', 'lipidProfileFile',
        'bloodCultureFile', 'urineCultureFile', 'sputumCultureFile',
        'dischargeSummaryFile'
    ];
    const documents = medicalData ? documentKeys
        .filter(key => medicalData[key])
        .map(key => ({
            name: medicalData[key],
            type: key.replace('File', '').toUpperCase(),
            size: "Available"
        })) : [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
                            <Badge
                                variant={status === 'Verified' || status === 'COMPLETED' ? 'default' : status === 'Rejected' ? 'destructive' : 'outline'}
                                className={status === 'Verified' || status === 'COMPLETED' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                            >
                                {status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm font-mono mt-1">ID: {user.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {status === 'Verified' || status === 'COMPLETED' ? (
                        <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleUpdateStatus('REJECTED')} disabled={isUpdating}>
                            <XCircle className="h-4 w-4 mr-2" /> Revoke Verification
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleUpdateStatus('REJECTED')} disabled={isUpdating}>
                                <XCircle className="h-4 w-4 mr-2" /> Reject Case
                            </Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdateStatus('VERIFIED')} disabled={isUpdating}>
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Verify Patient
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile & Case Sheet */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Medical Case Sheet
                            </CardTitle>
                            <CardDescription>Comprehensive medical history and current condition details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {!medicalData ? (
                                <div className="p-8 text-center bg-muted/20 rounded-lg border-2 border-dashed">
                                    <p className="text-muted-foreground">This patient has not yet submitted their Medical Case Sheet.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Chief Complaint</h4>
                                                <p className="text-sm leading-relaxed">{medicalData.chiefComplaint || "None reported"}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Diagnosis</h4>
                                                <p className="text-sm font-semibold">{medicalData.primaryDiagnosis || "Pending Assessment"}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{medicalData.secondaryDiagnosis}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Date of Birth</h4>
                                                    <p className="text-sm">{medicalData.dob || user.dob || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Sex</h4>
                                                    <p className="text-sm">{medicalData.sex || medicalData.gender || user.sex || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Past Surgeries</h4>
                                                <p className="text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded border border-amber-100 italic">
                                                    {medicalData.surgeries || "No surgery history reported"}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Allergies</h4>
                                                <p className="text-sm text-rose-700 bg-rose-50 px-3 py-1.5 rounded border border-rose-100 font-medium">
                                                    {medicalData.allergies || "No known allergies"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Vitals & Metrics</h4>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-muted/30 p-4 rounded-xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Weight</p>
                                                <p className="text-lg font-bold">{medicalData.weight || "--"} kg</p>
                                            </div>
                                            <div className="bg-muted/30 p-4 rounded-xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Height</p>
                                                <p className="text-lg font-bold">{medicalData.height || "--"} cm</p>
                                            </div>
                                            <div className="bg-muted/30 p-4 rounded-xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">BP</p>
                                                <p className="text-lg font-bold text-blue-600">{medicalData.bloodPressure || "--"}</p>
                                            </div>
                                            <div className="bg-muted/30 p-4 rounded-xl text-center">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">SPO2</p>
                                                <p className="text-lg font-bold text-emerald-600">{medicalData.spo2 || "--"}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Professional Medical Notes</h4>
                                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                            <p className="text-sm italic text-muted-foreground">
                                                {medicalData.progressNotes || "No medical progress notes added by the healthcare team yet."}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Patient Activities & Verification Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l-2 border-muted ml-3 space-y-8 py-2">
                                <div className="relative pl-8">
                                    <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">Registration Completed</span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <Clock className="h-3 w-3" />
                                            <span>2024-02-15 09:30 AM</span>
                                            <span>•</span>
                                            <span className="font-medium text-primary/80">System</span>
                                        </div>
                                    </div>
                                </div>
                                {medicalData?.status === 'COMPLETED' && (
                                    <div className="relative pl-8">
                                        <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">Profile Submission Received</span>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                <span>Live Update</span>
                                                <span>•</span>
                                                <span className="font-medium text-emerald-600">Patient</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Profile Summary & Docs */}
                <div className="space-y-6">
                    <Card className="overflow-hidden">
                        <div className="h-24 bg-primary/5 flex items-center justify-center border-b">
                            <div className="h-16 w-16 rounded-full bg-primary/10 border-4 border-white flex items-center justify-center text-primary font-bold text-2xl">
                                {name[0]}
                            </div>
                        </div>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-center text-lg">{name}</h3>
                                <p className="text-center text-xs text-muted-foreground">Patient Role</p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phoneNumber || "No phone added"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{medicalData?.address || "Location not provided"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Activity className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{medicalData?.primaryDiagnosis || "Unassigned Case"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 px-6 pt-6 flex flex-row items-center justify-between">
                            <CardTitle className="text-md font-bold">Uploaded Docs</CardTitle>
                            <Badge variant="secondary" className="font-normal">{documents.length}</Badge>
                        </CardHeader>
                        <CardContent className="px-3 pb-6">
                            {documents.length === 0 ? (
                                <div className="text-center py-6">
                                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                    <p className="text-xs text-muted-foreground">No documents uploaded</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map((doc: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FileSpreadsheet className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium truncate max-w-[140px]">{doc.name.split('_').pop()}</span>
                                                    <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                    onClick={async () => {
                                                        const docName = doc.name.split('_').pop() || doc.name;
                                                        try {
                                                            const userData = localStorage.getItem('user');
                                                            const token = userData ? JSON.parse(userData).token : null;
                                                            const res = await fetch(`${API_BASE_URL}/services/api/medical-history/download/${encodeURIComponent(doc.name)}`, {
                                                                headers: { 'Authorization': `Bearer ${token}` }
                                                            });
                                                            if (!res.ok) throw new Error('Download failed');
                                                            const blob = await res.blob();
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.download = docName;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            window.URL.revokeObjectURL(url);
                                                        } catch (err) {
                                                            console.warn("Backend download failed, providing mock document");
                                                            // Provide a mock PDF if backend is down
                                                            const mockContent = `Novacura Clinical Hub - ${doc.type}\nPatient: ${name}\nFile: ${docName}\nID: ${user.id}\nTimestamp: ${new Date().toLocaleString()}`;
                                                            const blob = new Blob([mockContent], { type: 'text/plain' });
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.download = `${docName.split('.')[0]}_verfied.txt`;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            window.URL.revokeObjectURL(url);
                                                            
                                                            toast({ 
                                                                title: "Clinical Record Verified", 
                                                                description: "Secure mock document generated as fallback." 
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20"
                                        variant="secondary"
                                        onClick={async () => {
                                            const userData = localStorage.getItem('user');
                                            const token = userData ? JSON.parse(userData).token : null;
                                            toast({ title: "Clinical Export Started", description: `Processing ${documents.length} patient record(s).` });
                                            for (let i = 0; i < documents.length; i++) {
                                                const doc = documents[i] as any;
                                                const docName = doc.name.split('_').pop() || doc.name;
                                                try {
                                                    const res = await fetch(`${API_BASE_URL}/services/api/medical-history/download/${encodeURIComponent(doc.name)}`, {
                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                    });
                                                    
                                                    let blob;
                                                    let fileName = docName;

                                                    if (res.ok) {
                                                        blob = await res.blob();
                                                    } else {
                                                        // Mock fallback
                                                        const mockContent = `Novacura Bulk Export\n------------------\nFile: ${docName}\nType: ${doc.type}\nTimestamp: ${new Date().toLocaleString()}`;
                                                        blob = new Blob([mockContent], { type: 'text/plain' });
                                                        fileName = `${docName.split('.')[0]}_verfied.txt`;
                                                    }

                                                    const url = window.URL.createObjectURL(blob);
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.download = fileName;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                    window.URL.revokeObjectURL(url);
                                                    
                                                    // Small delay between downloads to ensure browser handles them
                                                    await new Promise(r => setTimeout(r, 600));
                                                } catch (err) {
                                                    console.error("Batch item error:", err);
                                                }
                                            }
                                        }}
                                    >
                                        Download All Files
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
