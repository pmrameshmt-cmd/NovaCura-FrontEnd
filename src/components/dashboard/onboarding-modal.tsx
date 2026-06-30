
'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PhoneInput } from "@/components/ui/phone-input";
import { API_BASE_URL, DRAFT_KEY, fetchWithTimeout } from "@/lib/config";
import { mockDB } from "@/lib/mock-db";

const defaultFormData = {
    name: "", address: "", dob: "",
    contactInformation: "", phoneNumber: "",
    height: "", weight: "", sex: "",
    heartRate: "", spo2: "", bloodPressure: "", respiratoryRate: "",
    primaryDiagnosis: "", secondaryDiagnosis: "",
    chiefComplaint: "", historyOfPresentingIllness: "", physicalExamination: "",
    xrayFile: "", ctScanFile: "", usgFile: "", mriFile: "",
    bloodReportFile: "", urineReportFile: "", tissueBiopsyFile: "",
    liverFunctionTestFile: "", kidneyFunctionTestFile: "", lipidProfileFile: "",
    bloodCultureFile: "", urineCultureFile: "", sputumCultureFile: "",
    presentOngoingTreatment: "", previousMedicalHistory: "", dischargeSummaryFile: "",
    surgeries: "", conditions: "", allergies: "", reaction: "", progressNotes: ""
};

type FormData = typeof defaultFormData;

interface OnboardingModalProps {
    // Allow parent to force-open this modal (e.g. from a banner button)
    externalOpen?: boolean;
    onExternalOpenChange?: (val: boolean) => void;
    // Notify parent when profile is successfully submitted
    onComplete?: () => void;
}

export function OnboardingModal({ externalOpen, onExternalOpenChange, onComplete }: OnboardingModalProps = {}) {

    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [draftSaving, setDraftSaving] = useState(false);
    const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [open, setOpen] = useState(false);

    // Merge external open signal — parent can force the modal open
    // If the modal was opened externally, it's still open unless we set it to false
    const isOpen = (externalOpen !== undefined) ? externalOpen : open;


    // ── Lazy initializer: read draft from localStorage on very first render ──
    // This means all controlled inputs are pre-filled BEFORE the first paint —
    // no "flash of empty fields" on page reload.
    const [formData, setFormData] = useState(() => {
        if (typeof window === 'undefined') return defaultFormData;   // SSR guard
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const { _savedAt, ...draftFields } = parsed;
                const merged = { ...defaultFormData, ...draftFields };

                if (merged.name === "Admin User" || merged.name === "Name" || merged.name === "John Doe") merged.name = "";
                if (merged.contactInformation === "chennai@novacura.com" || merged.contactInformation === "Email Address" || merged.contactInformation === "john.doe@example.com") merged.contactInformation = "";

                return merged;
            }
        } catch (err) { /* ignore */ }
        return defaultFormData;
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const parsedUser = userData ? JSON.parse(userData) : null;
        if (parsedUser) setUser(parsedUser);

        setFormData((prev: FormData) => {
            return {
                ...prev,
                phoneNumber: prev.phoneNumber || parsedUser?.phoneNumber || "",
            };
        });

        // Restore draft metadata indicator
        const hasDraft = !!localStorage.getItem(DRAFT_KEY);
        if (hasDraft) {
            try {
                const raw = localStorage.getItem(DRAFT_KEY)!;
                const { _savedAt } = JSON.parse(raw);
                setDraftSavedAt(_savedAt || null);
            } catch { /* ignore */ }
        }
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    // ── Save Draft ────────────────────────────────────────────────────────────
    const handleSaveDraft = async () => {
        setDraftSaving(true);
        const now = new Date().toLocaleTimeString();

        // Prepare payload (consistent with handleSubmit)
        const payload = {
            ...formData,
            contactInformation: [
                formData.contactInformation,
                formData.phoneNumber,
            ].filter(Boolean).join(' | '),
        };
        const { phoneNumber, ...backendPayload } = payload;

        try {
            const response = await fetch(`${API_BASE_URL}/services/api/medical-history/draft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(backendPayload),
            });

            if (response.ok) {
                // Also update local storage for redundancy/quick restore
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, _savedAt: now }));
                setDraftSavedAt(now);
                // Draft save toast removed based on user request
            } else {
                toast({
                    variant: "destructive",
                    title: "Draft Save Failed",
                    description: "Your changes were not saved to the server.",
                });
            }
        } catch (error) {
            console.error("Draft save error:", error);
            toast({
                variant: "destructive",
                title: "Draft Save Error",
                description: "Something went wrong while saving the draft.",
            });
        } finally {
            setDraftSaving(false);
        }
    };

    // ── Allow closing the modal ───────────────────────────────────────────────
    const handleOpenChange = (val: boolean) => {
        if (!val) {
            // Save draft automatically when modal is closed without submitting
            const isCompleted = user?.isProfileCompleted || user?.profileCompleted;
            if (!isCompleted) {
                const now = new Date().toLocaleTimeString();
                localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, _savedAt: now }));
                setDraftSavedAt(now);
            }
            // Notify parent if it was controlling open state
            onExternalOpenChange?.(false);
        }
        setOpen(val);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const fieldId = e.target.id;

        if (file) {
            // Mock DB storage for visibility in portals
            if (user?.id) {
                const newDoc = {
                    patientId: user.id,
                    title: file.name,
                    type: fieldId.replace('File', '').toUpperCase(),
                    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    url: '#'
                };
                mockDB.addPatientDocument(newDoc);
            }

            const uploadData = new FormData();
            uploadData.append('file', file);

            try {
                const response = await fetch(`${API_BASE_URL}/services/api/medical-history/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: uploadData,
                });

                if (response.ok) {
                    const fileName = await response.text();
                    setFormData((prev: FormData) => ({
                        ...prev,
                        [fieldId]: fileName
                    }));
                    toast({
                        title: "File Uploaded",
                        description: `${file.name} uploaded successfully.`,
                    });
                } else {
                    // Fallback for demo if API fails
                    setFormData((prev: FormData) => ({
                        ...prev,
                        [fieldId]: file.name
                    }));
                    toast({
                        title: "File Uploaded (Mock)",
                        description: `${file.name} added to profile.`,
                    });
                }
            } catch (error) {
                console.error("Upload error:", error);
                // Fallback for demo if API fails
                setFormData((prev: FormData) => ({
                    ...prev,
                    [fieldId]: file.name
                }));
                toast({
                    title: "File Uploaded (Local Sync)",
                    description: `${file.name} added to clinical vault.`,
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            contactInformation: [
                formData.contactInformation,
                formData.phoneNumber,
            ].filter(Boolean).join(' | '),
        };
        // Remove the separate phoneNumber key (not a backend field)
        const { phoneNumber, ...backendPayload } = payload;

        try {
            // 1. Mandatory Sync with Real-time Backend (MongoDB)
            const response = await fetchWithTimeout(`${API_BASE_URL}/services/api/medical-history/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(backendPayload),
            }, 8000);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Backend synchronization failed.");
            }

            // 2. MockDB Update (Clinical Workflow)
            const patientId = user?.id || 'PAT-DEMO';
            const existingCases = mockDB.getCasesByPatient(patientId);
            const activeCase = existingCases.find(c => c.status !== 'Consultation Completed');
            
            let currentCaseId;
            let currentDoctorId = "";

            if (activeCase) {
                // Update existing active case instead of creating a duplicate
                currentCaseId = activeCase.id;
                currentDoctorId = activeCase.doctorId || "";
                mockDB.updateCase(currentCaseId, {
                    status: 'Case Sheet Submitted',
                    type: formData.primaryDiagnosis || 'General Consultation',
                    urgency: formData.urgency || 'Routine',
                    medicalData: {
                        ...activeCase.medicalData,
                        ...formData,
                        lastUpdated: new Date().toISOString()
                    }
                });
                
                mockDB.addTimelineEvent(currentCaseId, {
                    status: 'Case Sheet Updated',
                    description: 'Patient updated their clinical information and medical history.',
                    completed: true
                });
            } else {
                // Create new case only if no active one exists
                currentCaseId = mockDB.generateCaseId();

                mockDB.addCase({
                    id: currentCaseId,
                    patientId: patientId,
                    doctorId: currentDoctorId,
                    status: 'Case Sheet Submitted',
                    type: formData.primaryDiagnosis || 'General Consultation',
                    urgency: formData.urgency || 'Routine',
                    lastUpdated: new Date().toISOString(),
                    medicalData: {
                        ...formData,
                        lastUpdated: new Date().toISOString()
                    },
                    timeline: [
                        { id: 'T1', status: 'Case Sheet Submitted', description: 'Medical case sheet completed by patient.', time: new Date().toISOString(), completed: true }
                    ],
                    documents: formData.uploadedDocuments || [],
                    notes: [],
                    paymentStatus: 'Unpaid',
                    readiness: {
                        caseSheetCompleted: true,
                        reportsUploaded: (formData.uploadedDocuments || []).length > 0,
                        slotSelected: false,
                        paymentCompleted: false
                    }
                });
            }
            
            // Log security audit for Admin visibility
            mockDB.addAuditLog({
                event: 'Clinical Profile Completed',
                details: `Patient ${formData.name} completed Medical Case Sheet for case ${currentCaseId}`,
                level: 'info'
            });

            // Notify moderate doctor or assigned doctor
            mockDB.addNotification({
                userId: currentDoctorId || 'ADM-01', 
                message: `New/Updated Patient Case Sheet: ${formData.name}`,
                type: 'assignment',
                redirectUrl: currentDoctorId ? '/doctor/consultations' : '/admin/patients'
            });

            // Success feedback
            toast({
                title: "Medical Record Verified",
                description: "Clinical case sheet has been synchronized with the clinical hub.",
            });

            // Clear draft
            localStorage.removeItem(DRAFT_KEY);

            // 3. Update User record in MockDB to sync with portal
            if (user?.id) {
                const nameParts = formData.name.trim().split(' ');
                const firstName = nameParts[0] || user.firstName;
                const lastName = nameParts.slice(1).join(' ') || user.lastName;
                
                const updatedUserRecord = {
                    ...user,
                    firstName,
                    lastName,
                    email: formData.contactInformation || user.email,
                    phoneNumber: formData.phoneNumber || user.phoneNumber,
                    isProfileCompleted: true,
                    profileCompleted: true
                };
                mockDB.addUser(updatedUserRecord);
                
                // Update local session state
                localStorage.setItem('user', JSON.stringify(updatedUserRecord));
                
                // Trigger global cross-tab sync event
                window.dispatchEvent(new Event('storage'));
                window.dispatchEvent(new Event('mock-db-update'));
                
                setUser(updatedUserRecord);
            }
            
            setTimeout(() => {
                setOpen(false);
                onExternalOpenChange?.(false);
                onComplete?.();
            }, 1000); 
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Sync Error",
                description: "Failed to synchronize with clinical portal.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-white text-black">
                <DialogHeader>
                    <DialogTitle className="text-black">Patient Medical Case Sheet</DialogTitle>
                    <DialogDescription className="text-black/80">
                        Please complete your medical profile to continue using the dashboard.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-black">Patient Information</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="name">Name</Label>
                                    <Input
                                        className="text-black border-gray-400"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter username')}
                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        className="text-black border-gray-400"
                                        id="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                                        required
                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter date of birth')}
                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-black" htmlFor="address">Address</Label>
                                    <Input
                                        className="text-black border-gray-400"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter address')}
                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                    />
                                </div>

                                {/* ── Contact Information ── */}
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="contactInformation">Email Address</Label>
                                    <Input
                                        className="text-black border-gray-400"
                                        id="contactInformation"
                                        type="email"
                                        value={formData.contactInformation}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-black" htmlFor="phoneNumber">Phone Number</Label>
                                        {formData.phoneNumber && (
                                            <span className="text-xs text-green-600 font-medium">✓ Pre-filled from signup</span>
                                        )}
                                    </div>
                                    <PhoneInput
                                        value={formData.phoneNumber}
                                        onChange={(val) => setFormData((prev: FormData) => ({ ...prev, phoneNumber: val }))}
                                        defaultCountryCode="IN"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="height">Height (cm/ft)</Label>
                                    <Input className="text-black border-gray-400" id="height" type="number" step="any" min="0" value={formData.height} onChange={handleChange} onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="weight">Weight (kg/lbs)</Label>
                                    <Input className="text-black border-gray-400" id="weight" type="number" step="any" min="0" value={formData.weight} onChange={handleChange} onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Sex</Label>
                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 text-black text-sm cursor-pointer">
                                            <input type="radio" name="sex" value="Male" checked={formData.sex === "Male"} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} className="accent-amber-600 w-4 h-4 cursor-pointer" /> Male
                                        </label>
                                        <label className="flex items-center gap-2 text-black text-sm cursor-pointer">
                                            <input type="radio" name="sex" value="Female" checked={formData.sex === "Female"} onChange={(e) => setFormData({ ...formData, sex: e.target.value })} className="accent-amber-600 w-4 h-4 cursor-pointer" /> Female
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vitals */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-black">Current Vitals</h3>
                            <Separator />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="heartRate">HR (bpm)</Label>
                                    <Input className="text-black border-gray-400" id="heartRate" type="number" step="any" min="0" value={formData.heartRate} onChange={handleChange} onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="spo2">SPO2 (%)</Label>
                                    <Input className="text-black border-gray-400" id="spo2" type="number" step="any" min="0" value={formData.spo2} onChange={handleChange} onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="bloodPressure">BP (mmHg)</Label>
                                    <Input className="text-black border-gray-400" id="bloodPressure" value={formData.bloodPressure} onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9/]/g, '');
                                        setFormData({ ...formData, bloodPressure: val });
                                    }} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="respiratoryRate">RR (breaths/min)</Label>
                                    <Input className="text-black border-gray-400" id="respiratoryRate" type="number" step="any" min="0" value={formData.respiratoryRate} onChange={handleChange} onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); }} />
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-black">Diagnosis</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="primaryDiagnosis">Primary</Label>
                                    <Input className="text-black border-gray-400" id="primaryDiagnosis" value={formData.primaryDiagnosis} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="secondaryDiagnosis">Secondary</Label>
                                    <Input className="text-black border-gray-400" id="secondaryDiagnosis" value={formData.secondaryDiagnosis} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* History & Physical */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-black">History & Physical</h3>
                            <Separator />
                            <div className="space-y-2">
                                <Label className="text-black" htmlFor="chiefComplaint">Chief Complaint</Label>
                                <Textarea className="text-black border-gray-400" id="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black" htmlFor="historyOfPresentingIllness">History of presenting illness</Label>
                                <Textarea className="text-black border-gray-400" id="historyOfPresentingIllness" value={formData.historyOfPresentingIllness} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black" htmlFor="physicalExamination">PE</Label>
                                <Textarea className="text-black border-gray-400" id="physicalExamination" value={formData.physicalExamination} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Diagnostic Files - Simplified for modal but functional */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-black">Diagnostic Files</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="xrayFile">X-ray</Label>
                                    <Input className="text-black border-gray-400" id="xrayFile" type="file" onChange={handleFileChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black" htmlFor="bloodReportFile">Blood Reports</Label>
                                    <Input className="text-black border-gray-400" id="bloodReportFile" type="file" onChange={handleFileChange} />
                                </div>
                                {/* Add more file inputs as needed, keeping it scrollable */}
                            </div>
                        </div>

                        {/* Med History & Others - Keeping critical fields */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-black">Other History</h3>
                            <Separator />
                            <div className="space-y-2">
                                <Label className="text-black" htmlFor="allergies">Allergies</Label>
                                <Input className="text-black border-gray-400" id="allergies" value={formData.allergies} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black" htmlFor="progressNotes">Notes</Label>
                                <Textarea className="text-black border-gray-400" id="progressNotes" value={formData.progressNotes} onChange={handleChange} />
                            </div>
                        </div>

                        {/* ── Footer Buttons ── */}
                        <div className="space-y-2 pt-2">
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSaveDraft}
                                    disabled={draftSaving}
                                    className="flex-1 border-gray-400 text-black hover:bg-gray-100"
                                >
                                    {draftSaving ? "Saving…" : "💾 Save Draft"}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading ? "Submitting..." : "✅ Complete Profile"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

