/**
 * Mock Database Implementation for End-to-End Testing
 */

// Define core interfaces
export interface User {
    id: string;
    role: 'patient' | 'doctor' | 'moderate_doctor' | 'admin' | 'supervisor' | 'hospital';
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    password?: string;
    hospitalId?: string;
    specialization?: string;
    experience?: number;
    bio?: string;
    fees?: { online: number; inPerson: number };
    languages?: string[];
    rating?: number;
    ratingCount?: number;
    location?: string;
    isAvailableToday?: boolean;
    nextAvailable?: string;
    isProfileCompleted?: boolean;
    profileCompleted?: boolean;
    joined?: string;
    emoji?: string; // Standard professional emoji
    isOnline?: boolean;
    lastSeen?: string;
}

export interface CaseTimelineEvent {
    id: string;
    status: string;
    description: string;
    time: string;
    completed: boolean;
}

export interface CaseNote {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    time: string;
    isPrivate: boolean;
}

export interface ConsultationSummary {
    id: string;
    findings: string;
    recommendations: string;
    nextSteps: string;
    followUpAdvice: string;
    followUpRequired: boolean;
    suggestedFollowUpDate?: string;
    suggestedFollowUpTime?: string;
    prescriptionUrl?: string;
    timestamp: string;
}

export interface EscalationRecord {
    id: string;
    reason: string;
    description: string;
    escalatedTo: 'specialist' | 'admin' | 'hospital';
    status: 'pending' | 'resolved';
    timestamp: string;
}

export interface MedicationEntry {
    id?: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    refills: number;
}

export interface PrescriptionEdit {
    timestamp: string;
    summary: string;
    previousMedications: MedicationEntry[];
}

export interface Prescription {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    status: 'active' | 'past';
    date: string;
    medications: MedicationEntry[];
    edits?: PrescriptionEdit[];
    lastUpdated?: string;
}

export interface MedicalCase {
    id: string;
    patientId: string;
    doctorId?: string | null;
    hospitalId?: string | null;
    status: string;
    type: string;
    urgency: 'Routine' | 'Urgent' | 'Critical';
    lastUpdated: string;
    medicalData: any;
    documents: {
        id: string;
        name: string;
        tag: 'ECG' | 'MRI' | 'Blood Test' | 'X-Ray' | 'Other';
        url: string;
        uploadedAt: string;
        version: number;
    }[];
    timeline: CaseTimelineEvent[];
    notes: CaseNote[];
    proposedSlots?: { id: string, date: string, time: string }[];
    selectedSlotId?: string | null;
    paymentStatus: 'Unpaid' | 'Paid';
    followUpCaseId?: string;
    consultationSummary?: ConsultationSummary;
    escalation?: EscalationRecord;
    readiness: {
        caseSheetCompleted: boolean;
        reportsUploaded: boolean;
        slotSelected: boolean;
        paymentCompleted: boolean;
    };
}

export type SlotStatus = 'available' | 'shared' | 'selected' | 'pending_payment' | 'confirmed' | 'booked' | 'cancelled' | 'unavailable' | 'completed';

export interface Slot {
    id: string;
    doctorId: string;
    date: string;
    time: string;
    status: SlotStatus;
    patientId?: string | null;
    type?: 'Initial' | 'Follow-up';
    duration?: number; // in minutes
}

export interface Message {
    id: string;
    caseId: string;
    senderId: string;
    senderRole: 'patient' | 'doctor' | 'moderate_doctor';
    text: string;
    time: string;
}

export interface PatientDocument {
    id: string;
    patientId: string;
    title: string;
    type: string;
    date: string;
    url: string;
}

export interface AuditLog {
    id: string;
    level: 'info' | 'warning' | 'security';
    event: string;
    details: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    time: string;
    read: boolean;
    type: 'assignment' | 'report' | 'payment' | 'slot' | 'consultation' | 'message' | 'prescription';
    redirectUrl?: string;
}

export interface MockDBState {
    _v: number;
    users: User[];
    cases: MedicalCase[];
    slots: Slot[];
    notifications: Notification[];
    messages: Message[];
    patientDocuments: PatientDocument[];
    auditLogs: AuditLog[];
    prescriptions: Prescription[];
}

const INITIAL_MOCK_DATA: MockDBState = {
    _v: 4,
    users: [
        { id: 'ADM-01', role: 'admin', firstName: 'System', lastName: 'Admin', username: 'admin', email: 'admin@healhome.com', password: 'password' },
        { id: 'SUP-01', role: 'supervisor', firstName: 'Global', lastName: 'Supervisor', username: 'supervisor', email: 'supervisor@healhome.com', password: 'password' },
        { id: 'MOD-01', role: 'moderate_doctor', firstName: 'Alice', lastName: 'Reviewer', username: 'moderate', email: 'moderate@healhome.com', password: 'password' },
        { id: 'HOS-01', role: 'hospital', firstName: 'Apollo', lastName: 'Hospitals', username: 'apollo', email: 'apollo@hospital.com', password: 'password' },
        { 
            id: 'DOC-001', 
            role: 'doctor', 
            firstName: 'Deepa', 
            lastName: '', 
            username: 'doctor', 
            email: 'doctor@healhome.com', 
            password: 'password', 
            hospitalId: 'HOS-002', 
            specialization: 'Cardiology',
            experience: 35,
            bio: "Dr. Deepa is a world-renowned interventional cardiologist with over 35 years of experience.",
            fees: { online: 50, inPerson: 100 },
            languages: ["English", "Hindi"],
            rating: 4.9,
            ratingCount: 1250,
            location: "New Delhi, India",
            isAvailableToday: true,
            isOnline: true,
            nextAvailable: "Today",
            emoji: "👩‍⚕️"
        },
        { id: 'PAT-0001', role: 'patient', firstName: 'John', lastName: 'Peterson', email: 'john@patient.com', password: 'password123', joined: '22/03/2026' },
        { id: 'PAT-0002', role: 'patient', firstName: 'Sarah', lastName: 'Miller', email: 'sarah@patient.com', password: 'password123', joined: '22/03/2026' },
        { id: 'PAT-0003', role: 'patient', firstName: 'Emily', lastName: 'Wilson', email: 'emily@patient.com', password: 'password123', joined: '22/03/2026' },
        { id: 'PAT-0004', role: 'patient', firstName: 'David', lastName: 'Clark', email: 'david@patient.com', password: 'password123', joined: '22/03/2026' },
    ],
    cases: [
        {
            id: 'CASE-1001',
            patientId: 'PAT-0001',
            doctorId: null,
            hospitalId: 'HOS-002',
            status: 'Case Sheet Submitted',
            type: 'Cardiology',
            urgency: 'Urgent',
            lastUpdated: new Date().toISOString(),
            medicalData: { chiefComplaint: 'Chest pain', weight: '80', height: '175', bloodPressure: '130/85' },
            documents: [
                { id: 'DOC-1', name: 'ECG_Baseline.pdf', tag: 'ECG', url: '#', uploadedAt: new Date().toISOString(), version: 1 }
            ],
            timeline: [
                { id: 'T1', status: 'Medical Case Submitted', description: 'Patient submitted the initial case sheet.', time: new Date().toISOString(), completed: true }
            ],
            notes: [],
            paymentStatus: 'Unpaid',
            readiness: {
                caseSheetCompleted: true,
                reportsUploaded: true,
                slotSelected: false,
                paymentCompleted: false
            }
        },
        {
            id: 'CASE-1002',
            patientId: 'PAT-0002',
            doctorId: 'DOC-001',
            hospitalId: 'HOS-002',
            status: 'Review Completed',
            type: 'Cardiology',
            urgency: 'Routine',
            lastUpdated: new Date().toISOString(),
            medicalData: { chiefComplaint: 'Palpitations', weight: '65', height: '160', bloodPressure: '110/70' },
            documents: [],
            timeline: [
                { id: 'T1', status: 'Case Submitted', description: 'Patient submitted initial case sheet.', time: new Date().toISOString(), completed: true },
                { id: 'T2', status: 'Doctor Assigned', description: 'Dr. Deepa has been assigned to the case.', time: new Date().toISOString(), completed: true },
                { id: 'T3', status: 'Review Completed', description: 'Doctor finished preliminary review.', time: new Date().toISOString(), completed: true }
            ],
            notes: [
                { id: 'N1', authorId: 'DOC-001', authorName: 'Dr. Deepa', content: 'Patient exhibits normal sinus rhythm but complains of periodic palpitations.', time: new Date().toISOString(), isPrivate: true }
            ],
            paymentStatus: 'Unpaid',
            readiness: {
                caseSheetCompleted: true,
                reportsUploaded: false,
                slotSelected: false,
                paymentCompleted: false
            }
        }
    ],
    slots: [
        { id: 'SLOT-001', doctorId: 'DOC-001', date: 'Mar 12, 2026', time: '10:00 AM', status: 'available', type: 'Initial', duration: 30 },
        { id: 'SLOT-002', doctorId: 'DOC-001', date: 'Mar 12, 2026', time: '10:30 AM', status: 'available', type: 'Initial', duration: 30 },
        { id: 'SLOT-003', doctorId: 'DOC-001', date: 'Mar 12, 2026', time: '11:00 AM', status: 'booked', patientId: 'PAT-0003', type: 'Initial', duration: 30 },
        { id: 'SLOT-004', doctorId: 'DOC-001', date: 'Mar 13, 2026', time: '09:00 AM', status: 'shared', type: 'Initial', duration: 30 },
        { id: 'SLOT-005', doctorId: 'DOC-001', date: 'Mar 13, 2026', time: '09:30 AM', status: 'shared', type: 'Initial', duration: 30 },
        { id: 'SLOT-006', doctorId: 'DOC-001', date: 'Mar 14, 2026', time: '01:00 PM', status: 'available', type: 'Initial', duration: 30 },
        
        // Mohamed Asif's Appointments (Cleaned up: only keeps sessions with valid specialists)
        { id: 'SLOT-007', doctorId: 'DOC-001', patientId: 'PAT-0004', date: 'Aug 15, 2026', time: '10:30 AM', status: 'booked', type: 'Initial', duration: 30 },
        { id: 'SLOT-008', doctorId: 'DOC-001', patientId: 'PAT-0004', date: 'Aug 22, 2026', time: '02:00 PM', status: 'booked', type: 'Initial', duration: 0 },
        { id: 'SLOT-009', doctorId: 'DOC-001', patientId: 'PAT-0004', date: 'May 10, 2026', time: '11:00 AM', status: 'completed', type: 'Initial', duration: 30 },
        { id: 'SLOT-010', doctorId: 'DOC-001', patientId: 'PAT-0004', date: 'Mar 18, 2026', time: '04:00 PM', status: 'completed', type: 'Initial', duration: 0 },
    ],
    notifications: [],
    messages: [],
    patientDocuments: [
        { id: 'PD-1', patientId: 'PAT-0004', title: 'Medical Visa Letter for Mohamed Asif', type: 'Visa Document', date: 'January 19th, 2026', url: '#' },
        { id: 'PD-2', patientId: 'PAT-0004', title: 'Lab Report - Blood Test', type: 'Lab Report', date: 'July 15th, 2024', url: '#' },
        { id: 'PD-3', patientId: 'PAT-0004', title: 'Discharge Summary - Apollo Hospital', type: 'Discharge Summary', date: 'June 20th, 2024', url: '#' }
    ],
    auditLogs: [
        { id: 'LOG-001', level: 'info', event: 'System Start', details: 'Database initialized from source.', timestamp: new Date().toISOString() }
    ],
    prescriptions: [
        {
            id: 'RX-001',
            patientId: 'PAT-0001',
            doctorId: 'DOC-001',
            doctorName: 'Dr. Deepa',
            status: 'active',
            date: '2026-03-24',
            medications: [{
                medication: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take in the morning with food',
                refills: 2
            }]
        },
        {
            id: 'RX-002',
            patientId: 'PAT-0001',
            doctorId: 'DOC-001',
            doctorName: 'Dr. Deepa',
            status: 'active',
            date: '2026-03-22',
            medications: [{
                medication: 'Tretinoin Cream',
                dosage: '0.05%',
                frequency: 'At night',
                duration: 'Ongoing',
                instructions: 'Apply a pea-sized amount to clean skin',
                refills: 5
            }]
        },
        {
            id: 'RX-003',
            patientId: 'PAT-0001',
            doctorId: 'DOC-001',
            doctorName: 'Dr. Deepa',
            status: 'past',
            date: '2026-02-15',
            medications: [{
                medication: 'Amoxicillin',
                dosage: '500mg',
                frequency: 'Three times daily',
                duration: '7 days',
                instructions: 'Finish the entire course',
                refills: 0
            }]
        }
    ]
};

const DB_KEY = 'healhome_mock_db';

class MockDBService {
    private listeners: Function[] = [];

    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(DB_KEY);
            if (!saved) {
                localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
            } else {
                const parsed = JSON.parse(saved);
                const firstCase = parsed.cases?.[0];
                // Force reset if missing new fields like urgency or timeline
                if (firstCase && (!firstCase.urgency || !firstCase.timeline)) {
                    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
                }
            }

            window.addEventListener('storage', (e) => {
                if (e.key === DB_KEY) this.notifyListeners();
            });
        }
    }

    subscribe(listener: Function) {
        this.listeners.push(listener);
        // The instruction seems to imply adding these listeners here,
        // but they are typically added in the component consuming the service.
        // For a global service, the constructor's storage listener is sufficient
        // to trigger updates via notifyListeners().
        // If the intent was for the *listener* function itself to be called on storage events,
        // the existing `window.addEventListener('storage', ...)` in the constructor
        // already calls `this.notifyListeners()`, which in turn calls all subscribed listeners.
        // Therefore, no direct change is needed here for the described functionality.
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('mock-db-update'));
        }
    }

    getState(): MockDBState {
        if (typeof window === 'undefined') return INITIAL_MOCK_DATA;
        const data = localStorage.getItem(DB_KEY);
        if (!data) return INITIAL_MOCK_DATA;
        try {
            let parsed = JSON.parse(data);
            
            // Migration: Version 2 - Standardize all IDs sequentially
            if (!parsed._v || parsed._v < 2) {
                console.log("Migrating MockDB to Version 2: Standardizing IDs...");
                
                // 1. Re-index Users
                const userMap = new Map<string, string>();
                let pCount = 1, dCount = 1, aCount = 1, mCount = 1;

                const migratedUsers = (parsed.users || INITIAL_MOCK_DATA.users).map((u: any) => {
                    let newId = u.id;
                    if (u.role === 'patient') {
                        if (u.id === 'PAT-ASIF') newId = 'PAT-0004'; // Keep Asif as 4 per initial data
                        else newId = `PAT-${(pCount++).toString().padStart(4, '0')}`;
                    } else if (u.role === 'doctor') {
                        newId = `DOC-${(dCount++).toString().padStart(3, '0')}`;
                    } else if (u.role === 'admin') {
                        newId = `ADM-${(aCount++).toString().padStart(2, '0')}`;
                    } else if (u.role === 'moderate_doctor') {
                        newId = `MOD-${(mCount++).toString().padStart(2, '0')}`;
                    }
                    userMap.set(u.id, newId);
                    return { ...u, id: newId };
                });

                // 2. Re-index Cases and update patientId/doctorId
                let cCount = 1001;
                const migratedCases = (parsed.cases || INITIAL_MOCK_DATA.cases).map((c: any) => {
                    const newCaseId = `CASE-${cCount++}`;
                    return {
                        ...c,
                        id: newCaseId,
                        patientId: userMap.get(c.patientId) || c.patientId,
                        doctorId: userMap.get(c.doctorId) || c.doctorId
                    };
                });

                // 3. Update Slots
                const migratedSlots = (parsed.slots || INITIAL_MOCK_DATA.slots).map((s: any) => {
                    return {
                        ...s,
                        patientId: userMap.get(s.patientId) || s.patientId,
                        doctorId: userMap.get(s.doctorId) || s.doctorId
                    };
                });

                // 4. Update Documents
                const migratedDocs = (parsed.patientDocuments || INITIAL_MOCK_DATA.patientDocuments).map((d: any) => {
                    return {
                        ...d,
                        patientId: userMap.get(d.patientId) || d.patientId
                    };
                });

                parsed = {
                    ...parsed,
                    _v: 2,
                    users: migratedUsers,
                    cases: migratedCases,
                    slots: migratedSlots,
                    patientDocuments: migratedDocs
                };
                
                // Commit the migration
                localStorage.setItem(DB_KEY, JSON.stringify(parsed));
            }

            // Migration: Version 3 - Cleanup Unwanted Mock Doctors (Naresh, Suresh, Evelyn, Olivia)
            if (parsed._v < 3) {
                const unwantedFirstNames = ['Naresh', 'Suresh', 'Evelyn', 'Olivia'];
                
                // Keep only valid doctors
                const sanitizedUsers = (parsed.users || []).filter((u: any) => 
                    u.role !== 'doctor' || !unwantedFirstNames.includes(u.firstName)
                );
                
                // Get remaining doctor IDs
                const activeDoctorIds = sanitizedUsers.filter((u: any) => u.role === 'doctor').map((u: any) => u.id);
                
                // Clean up cases: re-assign to DOC-001 (Deepa) or remove if orphan
                const sanitizedCases = (parsed.cases || []).filter((c: any) => {
                    if (!c.doctorId || activeDoctorIds.includes(c.doctorId)) return true;
                    // For demo purposes, we can re-assign these to DOC-001 if patient needs it
                    // but for a true "delete", we remove them
                    return false; 
                });

                // Clean up slots: only keep slots from active doctors
                const sanitizedSlots = (parsed.slots || []).filter((s: any) => activeDoctorIds.includes(s.doctorId));

                // Commit legacy doctor cleanup
                parsed = {
                    ...parsed,
                    _v: 3,
                    users: sanitizedUsers.map((u: any) => {
                        if (u.role === 'doctor' && u.id === 'DOC-001' && u.isOnline === undefined) {
                            return { ...u, isOnline: true };
                        }
                        return u;
                    }),
                    cases: sanitizedCases,
                    slots: sanitizedSlots
                };
                
                localStorage.setItem(DB_KEY, JSON.stringify(parsed));
            }

            return {
                ...INITIAL_MOCK_DATA,
                ...parsed,
                users: parsed.users || INITIAL_MOCK_DATA.users,
                cases: parsed.cases || INITIAL_MOCK_DATA.cases,
                slots: parsed.slots || INITIAL_MOCK_DATA.slots,
                notifications: parsed.notifications || INITIAL_MOCK_DATA.notifications,
                messages: parsed.messages || INITIAL_MOCK_DATA.messages,
                patientDocuments: parsed.patientDocuments || INITIAL_MOCK_DATA.patientDocuments,
                auditLogs: parsed.auditLogs || INITIAL_MOCK_DATA.auditLogs,
                prescriptions: parsed.prescriptions || INITIAL_MOCK_DATA.prescriptions
            };
        } catch (e) {
            return INITIAL_MOCK_DATA;
        }
    }

    private saveState(state: any) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(DB_KEY, JSON.stringify(state));
            this.notifyListeners();
        }
    }

    getUsers() { return this.getState().users; }
    getUserById(id: string) { return this.getState().users.find(u => u.id === id); }
    
    isProfileCompleted(userId: string): boolean {
        const user = this.getUserById(userId);
        if (user && (user.isProfileCompleted || user.profileCompleted)) return true;
        const cases = this.getCasesByPatient(userId);
        return cases.length > 0;
    }

    addUser(user: User) {
        const state = this.getState();
        const existingIndex = state.users.findIndex(u => u.id === user.id || (user.email && u.email === user.email));
        if (existingIndex !== -1) {
            state.users[existingIndex] = { ...state.users[existingIndex], ...user };
        } else {
            const newUser = user.role === 'doctor' ? {
                isOnline: false,
                rating: 0,
                ratingCount: 0,
                experience: 0,
                fees: { online: 0, inPerson: 0 },
                emoji: '👨‍⚕️',
                ...user
            } : user;
            state.users.push(newUser);
        }
        this.saveState(state);
    }

    getCases() { return this.getState().cases; }
    getCaseById(id: string) { return this.getState().cases.find(c => c.id === id); }
    getCasesByDoctor(doctorId: string): MedicalCase[] {
        const state = this.getState();
        if (!doctorId) return [];
        return state.cases
            .filter(c => c.doctorId === doctorId)
            .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }
    getCasesByPatient(patientId: string): MedicalCase[] {
        const state = this.getState();
        return state.cases
            .filter(c => c.patientId === patientId)
            .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }

    addCase(medicalCase: MedicalCase) {
        const state = this.getState();
        
        // Security Check: Verify role of user submitting the case
        const submitter = state.users.find(u => u.id === medicalCase.patientId);
        if (submitter && submitter.role !== 'patient') {
            this.addAuditLog({
                level: 'security',
                event: 'Rogue Case Creation Detected',
                details: `System Flag: Non-Patient ID (${medicalCase.patientId}) attempted to initiate a Medical Case ID: ${medicalCase.id}. Event was automatically logged for review.`,
                timestamp: new Date().toISOString()
            });
        }
        
        state.cases.push(medicalCase);
        this.saveState(state);
    }

    assignDoctor(caseId: string, doctorId: string) {
        const state = this.getState();
        const index = state.cases.findIndex(c => c.id === caseId);
        if (index !== -1) {
            const doctor = state.users.find(u => u.id === doctorId);
            state.cases[index].doctorId = doctorId;
            state.cases[index].status = 'Doctor Assigned';
            state.cases[index].lastUpdated = new Date().toISOString();
            
            // Add timeline event
            const docName = doctor ? (doctor.lastName ? `Dr. ${doctor.lastName}` : `Dr. ${doctor.firstName}`) : 'A doctor';
            const timelineEvent: CaseTimelineEvent = {
                id: 'T-' + Date.now(),
                status: 'Doctor Assigned',
                description: `${docName} has been assigned to the case loop.`,
                time: new Date().toISOString(),
                completed: true
            };
            state.cases[index].timeline.push(timelineEvent);
            
            // Add notification for doctor
            const notification: Notification = {
                id: 'NOTIF-' + Date.now(),
                userId: doctorId,
                message: `New Case Assigned: ${caseId}`,
                time: new Date().toISOString(),
                read: false,
                type: 'assignment',
                redirectUrl: `/doctor/dashboard`
            };
            state.notifications.push(notification);

            this.saveState(state);
            return true;
        }
        return false;
    }

    updateCase(caseId: string, updates: Partial<MedicalCase>) {
        const state = this.getState();
        const index = state.cases.findIndex(c => c.id === caseId);
        if (index !== -1) {
            state.cases[index] = { ...state.cases[index], ...updates, lastUpdated: new Date().toISOString() };
            this.saveState(state);
            return true;
        }
        return false;
    }

    unassignCase(caseId: string) {
        const state = this.getState();
        const index = state.cases.findIndex(c => c.id === caseId);
        if (index !== -1) {
            state.cases[index].doctorId = null;
            state.cases[index].status = 'NEW';
            state.cases[index].lastUpdated = new Date().toISOString();
            
            this.addTimelineEvent(caseId, {
                status: 'NEW',
                description: 'Doctor was unassigned. Case returned to pending pool.',
                completed: true
            });
            
            this.saveState(state);
            return true;
        }
        return false;
    }

    addTimelineEvent(caseId: string, event: Omit<CaseTimelineEvent, 'id' | 'time'>) {
        const state = this.getState();
        const c = state.cases.find(c => c.id === caseId);
        if (c) {
            const newEvent: CaseTimelineEvent = {
                id: 'T-' + Date.now(),
                time: new Date().toISOString(),
                ...event
            };
            c.timeline.push(newEvent);
            c.status = event.status;
            c.lastUpdated = new Date().toISOString();
            this.saveState(state);
            return true;
        }
        return false;
    }

    addNote(caseId: string, note: Omit<CaseNote, 'id' | 'time'>) {
        const state = this.getState();
        const c = state.cases.find(c => c.id === caseId);
        if (c) {
            const newNote: CaseNote = {
                id: 'N-' + Date.now(),
                time: new Date().toISOString(),
                ...note
            };
            c.notes.push(newNote);
            this.saveState(state);
            return true;
        }
        return false;
    }

    getSlots() { return this.getState().slots; }
    getSlotsByDoctor(doctorId: string) { return this.getState().slots.filter(s => s.doctorId === doctorId); }
    getSharedSlotsByDoctor(doctorId: string) { return this.getState().slots.filter(s => s.doctorId === doctorId && s.status === 'shared'); }
    getSlotsByPatient(patientId: string) { return this.getState().slots.filter(s => s.patientId === patientId); }

    private normalizeTime(time: string): string {
        // Standardize to "09:00 AM" format
        try {
            const clean = time.trim().toUpperCase();
            const ampm = clean.endsWith('PM') ? 'PM' : 'AM';
            const justTime = clean.replace('AM', '').replace('PM', '').trim();
            const [h, m] = justTime.split(':');
            return `${h.padStart(2, '0')}:${m.padStart(2, '0')} ${ampm}`;
        } catch (e) {
            return time;
        }
    }

    private timeToMinutes(time: string): number {
        try {
            const normalized = this.normalizeTime(time);
            const [t, ampm] = normalized.split(' ');
            let [h, m] = t.split(':').map(Number);
            if (ampm === 'PM' && h < 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        } catch (e) {
            return 0;
        }
    }

    addSlot(slot: Omit<Slot, 'id'>) {
        const state = this.getState();
        const normalizedTime = this.normalizeTime(slot.time);
        
        const newStart = this.timeToMinutes(normalizedTime);
        const newEnd = newStart + (slot.duration || 30);
        
        // Conflict detection for doctor + date + time overlap
        const conflict = state.slots.find(s => {
            if (s.doctorId !== slot.doctorId || s.date !== slot.date || s.status === 'cancelled' || s.status === 'unavailable') return false;
            
            const sStart = this.timeToMinutes(s.time);
            const sEnd = sStart + (s.duration || 30);
            
            // Overlap check: (StartA < EndB) and (EndA > StartB)
            return (newStart < sEnd && newEnd > sStart);
        });
        
        if (conflict) {
            return { 
                success: false, 
                message: `Time conflict: This overlaps with an existing ${conflict.status} slot at ${conflict.time} (Duration: ${conflict.duration || 30}m).` 
            };
        }

        const newSlot: Slot = {
            id: 'SLOT-' + Date.now() + Math.random().toString(36).substr(2, 5),
            ...slot,
            time: normalizedTime
        };
        state.slots.push(newSlot);
        this.saveState(state);
        return { success: true, slot: newSlot };
    }

    deleteSlot(slotId: string) {
        const state = this.getState();
        const filtered = state.slots.filter(s => s.id !== slotId);
        if (filtered.length === state.slots.length) return false;
        state.slots = filtered;
        this.saveState(state);
        return true;
    }

    shareSlots(caseId: string, slotIds: string[]) {
        const state = this.getState();
        const c = state.cases.find(c => c.id === caseId);
        if (!c) return false;

        const sharedSlots = state.slots.filter(s => slotIds.includes(s.id));
        sharedSlots.forEach(s => s.status = 'shared');

        c.proposedSlots = sharedSlots.map(s => ({ id: s.id, date: s.date, time: s.time }));
        c.status = 'Slots Shared';
        c.lastUpdated = new Date().toISOString();
        
        this.addTimelineEvent(c.id, {
            status: 'Slots Shared',
            description: `Doctor shared ${sharedSlots.length} available slots for consultation.`,
            completed: true
        });

        this.addNotification({
            userId: c.patientId,
            message: `New consultation slots have been shared with you for your case #${c.id}.`,
            type: 'slot',
            redirectUrl: '/consultations'
        });

        this.saveState(state);
        return true;
    }

    bookSlot(caseId: string, slotId: string) {
        const state = this.getState();
        const c = state.cases.find(c => c.id === caseId);
        const slot = state.slots.find(s => s.id === slotId);
        
        if (!c || !slot) return { success: false, message: 'Case or Slot not found.' };
        if (slot.status === 'booked') return { success: false, message: 'Slot already booked.' };

        // 1. Update Slot
        slot.status = 'booked';
        slot.patientId = c.patientId;

        // 2. Update Case
        c.selectedSlotId = slotId;
        c.status = 'Consultation Confirmed';
        c.lastUpdated = new Date().toISOString();

        // Ensure readiness is updated
        if (!c.readiness) {
            c.readiness = {
                caseSheetCompleted: true,
                reportsUploaded: false,
                slotSelected: false,
                paymentCompleted: false
            };
        }
        c.readiness.slotSelected = true;
        c.readiness.paymentCompleted = true; // Skipped for now by requirement

        // 3. Add Timeline Events (Ensuring sequence)
        const statuses = c.timeline.map(t => t.status);
        if (!statuses.includes('Review Completed')) {
            c.timeline.push({
                id: 'T-rev-' + Date.now(),
                time: new Date().toISOString(),
                status: 'Review Completed',
                description: `Doctor completed the review of the case.`,
                completed: true
            });
        }
        
        if (!statuses.includes('Slots Shared')) {
            c.timeline.push({
                id: 'T-sh-' + Date.now(),
                time: new Date().toISOString(),
                status: 'Slots Shared',
                description: `Consultation slots were successfully shared and reviewed.`,
                completed: true
            });
        }

        if (!statuses.includes('Slot Confirmed')) {
            c.timeline.push({
                id: 'T-sl-' + Date.now(),
                time: new Date().toISOString(),
                status: 'Slot Confirmed',
                description: `Consultation slot confirmed for ${slot.date} at ${slot.time}.`,
                completed: true
            });
        }

        if (!statuses.includes('Payment Completed')) {
            c.timeline.push({
                id: 'T-pay-' + Date.now(),
                time: new Date().toISOString(),
                status: 'Payment Completed',
                description: `Payment process completed/skipped successfully.`,
                completed: true
            });
        }
        
        c.timeline.push({
            id: 'T-final-' + Date.now(),
            time: new Date().toISOString(),
            status: 'Consultation Confirmed',
            description: `Consultation officially confirmed for ${slot.date} at ${slot.time}.`,
            completed: true
        });

        // 4. Add Automated Clinical Message
        const doctor = state.users.find(u => u.id === c.doctorId);
        const docName = doctor ? (doctor.lastName ? `Dr. ${doctor.lastName}` : `Dr. ${doctor.firstName}`) : 'The doctor';
        
        const automatedMsg: Message = {
            id: 'MSG-' + Date.now(),
            time: new Date().toISOString(),
            caseId: c.id,
            senderId: c.doctorId || 'SYSTEM',
            senderRole: 'doctor',
            text: `📅 CONSULTATION CONFIRMED: Your appointment is scheduled for ${slot.date} at ${slot.time}. Please ensure you are online 5 minutes before the start time.`
        };
        state.messages.push(automatedMsg);

        // 5. Add Notification for Patient
        const notification: Notification = {
            id: 'NOTIF-' + (Date.now() + 1),
            userId: c.patientId,
            message: `Consultation Booked: ${slot.date} at ${slot.time} with ${docName}.`,
            time: new Date().toISOString(),
            read: false,
            type: 'slot',
            redirectUrl: `/dashboard`
        };
        state.notifications.push(notification);

        this.saveState(state);
        return { success: true };
    }

    // NEW requirements: Patient Confirmation Flow
    acceptSlot(caseId: string, slotId: string) {
        const state = this.getState();
        const c = state.cases.find(c => c.id === caseId);
        const slot = state.slots.find(s => s.id === slotId);
        if (!c || !slot) return { success: false, message: 'Case or Slot not found.' };

        // 1. Update Slot
        slot.status = 'booked';
        slot.patientId = c.patientId;

        // 2. Update Case
        c.selectedSlotId = slotId;
        c.status = 'Consultation Confirmed';
        if (!c.readiness) {
            c.readiness = {
                caseSheetCompleted: true,
                reportsUploaded: false,
                slotSelected: false,
                paymentCompleted: false
            };
        }
        c.readiness.slotSelected = true;
        c.readiness.paymentCompleted = true; // Auto-skip payment for now as requested
        c.lastUpdated = new Date().toISOString();

        // 3. Add Timeline Events
        c.timeline.push({
            id: 'T-acc-' + Date.now(),
            time: new Date().toISOString(),
            status: 'Slot Confirmed',
            description: `Patient has accepted the consultation slot for ${slot.date} at ${slot.time}.`,
            completed: true
        });

        c.timeline.push({
            id: 'T-pay-acc-' + (Date.now() + 1),
            time: new Date().toISOString(),
            status: 'Payment Completed',
            description: `Payment step skipped. Proceeding to confirmation.`,
            completed: true
        });

        c.timeline.push({
            id: 'T-final-acc-' + (Date.now() + 2),
            time: new Date().toISOString(),
            status: 'Consultation Confirmed',
            description: `Consultation is now officially scheduled.`,
            completed: true
        });

        // 4. Messages
        const patient = state.users.find(u => u.id === c.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Patient';

        state.messages.push({
            id: 'MSG-ACC-' + Date.now(),
            time: new Date().toISOString(),
            caseId: c.id,
            senderId: c.patientId,
            senderRole: 'patient',
            text: `✅ SLOT ACCEPTED: I have accepted the consultation slot for ${slot.date} at ${slot.time}. Looking forward to the session.`
        });

        // 5. Notify Doctor
        if (c.doctorId) {
            state.notifications.push({
                id: 'NOTIF-ACC-' + Date.now(),
                userId: c.doctorId,
                message: `${patientName} has accepted the consultation slot for ${slot.date} at ${slot.time}.`,
                time: new Date().toISOString(),
                read: false,
                type: 'slot',
                redirectUrl: `/doctor/patients/${c.id}`
            });
        }

        this.saveState(state);
        return { success: true };
    }

    requestReschedule(caseId: string, reason: string) {
        const state = this.getState();
        const c = state.cases.find(c => c.id === caseId);
        if (!c) return { success: false, message: 'Case not found.' };

        // 1. Update Case
        c.status = 'Reschedule Requested';
        c.lastUpdated = new Date().toISOString();

        // 2. Add Timeline Event
        c.timeline.push({
            id: 'T-res-' + Date.now(),
            time: new Date().toISOString(),
            status: 'Reschedule Requested',
            description: `Patient requested a schedule change: ${reason}`,
            completed: true
        });

        // 3. Messages
        state.messages.push({
            id: 'MSG-RES-' + Date.now(),
            time: new Date().toISOString(),
            caseId: c.id,
            senderId: c.patientId,
            senderRole: 'patient',
            text: `🔄 RESCHEDULE REQUESTED: I would like to reschedule the consultation. Reason: ${reason}`
        });

        // 4. Notify Doctor
        const patient = state.users.find(u => u.id === c.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Patient';

        if (c.doctorId) {
            state.notifications.push({
                id: 'NOTIF-RES-' + Date.now(),
                userId: c.doctorId,
                message: `${patientName} has requested a reschedule for case #${c.id}.`,
                time: new Date().toISOString(),
                read: false,
                type: 'slot',
                redirectUrl: `/doctor/patients/${c.id}`
            });
        }

        this.saveState(state);
        return { success: true };
    }

    // Automation: Check and complete consultations
    checkAllCasesForCompletion() {
        const state = this.getState();
        let changed = false;
        const now = new Date();

        state.cases.forEach(c => {
            if (c.status === 'Consultation Confirmed' && c.selectedSlotId) {
                const slot = state.slots.find(s => s.id === c.selectedSlotId);
                if (slot) {
                    // Approximate end time: Slot Date/Time + Duration (default 30m if not set)
                    const duration = slot.duration || 30;
                    // Mock date parser for format "YYYY-MM-DD" and "HH:mm"
                    const [year, month, day] = slot.date.split('-').map(Number);
                    const [hour, min] = slot.time.split(':').map(Number);
                    
                    const endTime = new Date(year, month - 1, day, hour, min + duration);
                    
                    if (now > endTime) {
                        c.status = 'Consultation Completed';
                        slot.status = 'completed';
                        c.lastUpdated = now.toISOString();
                        
                        // Add timeline event if not already present
                        if (!c.timeline.some(t => t.status === 'Consultation Completed')) {
                            c.timeline.push({
                                id: 'T-comp-' + Date.now(),
                                time: now.toISOString(),
                                status: 'Consultation Completed',
                                description: `Consultation session has concluded according to schedule.`,
                                completed: true
                            });
                        }
                        changed = true;
                    }
                }
            }
        });

        if (changed) {
            this.saveState(state);
        }
    }

    updateSlot(slotId: string, updates: Partial<Slot>) {
        const state = this.getState();
        const ind = state.slots.findIndex(s => s.id === slotId);
        if (ind !== -1) {
            // Prevent double booking if status is changing to something selected or booked
            const current = state.slots[ind];
            if (updates.status && (updates.status === 'selected' || updates.status === 'booked' || updates.status === 'confirmed') && current.status === 'booked') {
                return { success: false, message: 'Slot already booked.' };
            }

            state.slots[ind] = { ...state.slots[ind], ...updates };
            this.saveState(state);
            return { success: true };
        }
        return { success: false, message: 'Slot not found.' };
    }

    addNotification(notif: Omit<Notification, 'id' | 'time' | 'read'>) {
        const state = this.getState();
        const notification: Notification = {
            id: 'NOTIF-' + Date.now(),
            time: new Date().toISOString(),
            read: false,
            ...notif
        };
        state.notifications.push(notification);
        this.saveState(state);
    }

    getNotifications(userId: string) {
        return (this.getState().notifications || []).filter(n => n.userId === userId);
    }

    upsertCase(c: any) {
        const state = this.getState();
        const existingIndex = state.cases.findIndex(item => item.id === c.id);
        if (existingIndex >= 0) {
            state.cases[existingIndex] = { ...state.cases[existingIndex], ...c };
        } else {
            const newCase = {
                readiness: {
                    caseSheetCompleted: true,
                    reportsUploaded: false,
                    slotSelected: false,
                    paymentCompleted: false
                },
                timeline: [],
                notes: [],
                ...c
            };
            state.cases.push(newCase);
        }
        this.saveState(state);
    }

    markNotificationRead(notificationId: string) {
        const state = this.getState();
        const ind = state.notifications.findIndex(n => n.id === notificationId);
        if (ind !== -1) {
            state.notifications[ind].read = true;
            this.saveState(state);
            return true;
        }
        return false;
    }

    getMessages(caseId: string) {
        return (this.getState().messages || []).filter(m => m.caseId === caseId);
    }

    addMessage(msg: Omit<Message, 'id' | 'time'>) {
        const state = this.getState();
        const message: Message = {
            id: 'MSG-' + Date.now(),
            time: new Date().toISOString(),
            ...msg
        };
        state.messages.push(message);

        // Generate recipient notification
        const c = state.cases.find(c => c.id === msg.caseId);
        if (c) {
            const recipientId = msg.senderRole === 'patient' ? c.doctorId : c.patientId;
            if (recipientId) {
                const sender = state.users.find(u => u.id === msg.senderId);
                const senderName = sender ? (sender.role === 'doctor' ? `Dr. ${sender.lastName || sender.firstName}` : `${sender.firstName} ${sender.lastName}`) : 'Someone';
                
                state.notifications.push({
                    id: 'NOTIF-' + (Date.now() + 2),
                    userId: recipientId,
                    message: `New message from ${senderName}: "${msg.text.substring(0, 40)}${msg.text.length > 40 ? '...' : ''}"`,
                    time: new Date().toISOString(),
                    read: false,
                    type: 'message',
                    redirectUrl: msg.senderRole === 'patient' ? `/doctor/consultations?patientId=${c.patientId}` : `/consultations`
                });
            }
        }

        this.saveState(state);
        return message;
    }
    generatePatientId() {
        const patients = this.getState().users.filter(u => u.role === 'patient');
        const numericIds = patients
            .map(p => {
                const match = p.id.match(/^PAT-(\d+)$/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((id): id is number => id !== null);
        
        const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
        return `PAT-${nextId.toString().padStart(4, '0')}`;
    }

    generateDoctorId() {
        const doctors = this.getState().users.filter(u => u.role === 'doctor');
        const numericIds = doctors
            .map(d => {
                const match = d.id.match(/^DOC-(\d+)$/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((id): id is number => id !== null);
        
        const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
        return `DOC-${nextId.toString().padStart(3, '0')}`;
    }

    generateModerateDoctorId() {
        const moderators = this.getState().users.filter(u => u.role === 'moderate_doctor');
        const numericIds = moderators
            .map(m => {
                const match = m.id.match(/^MOD-(\d+)$/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((id): id is number => id !== null);
        
        const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
        return `MOD-${nextId.toString().padStart(2, '0')}`;
    }

    generateAdminId() {
        const admins = this.getState().users.filter(u => u.role === 'admin');
        const numericIds = admins
            .map(a => {
                const match = a.id.match(/^ADM-(\d+)$/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((id): id is number => id !== null);
        
        const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
        return `ADM-${nextId.toString().padStart(2, '0')}`;
    }

    generateCaseId() {
        const cases = this.getState().cases;
        const numericIds = cases
            .map(c => {
                const match = c.id.match(/^CASE-(\d+)$/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((id): id is number => id !== null);
        
        const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1001;
        if (nextId === 1001 && cases.length > 0) {
             // Fallback if regex fails but cases exist
             return `CASE-${1000 + cases.length + 1}`;
        }
        return `CASE-${nextId}`;
    }

    getUnassignedCases() {
        return this.getState().cases.filter(c => !c.doctorId);
    }

    getPatientDocuments(patientId: string) {
        return (this.getState().patientDocuments || []).filter(pd => pd.patientId === patientId);
    }

    addPatientDocument(doc: Omit<PatientDocument, 'id'>) {
        const state = this.getState();
        const newDoc: PatientDocument = {
            id: 'PD-' + Date.now(),
            ...doc
        };
        if (!state.patientDocuments) state.patientDocuments = [];
        state.patientDocuments.push(newDoc);
        this.saveState(state);
        return newDoc;
    }

    deletePatientDocument(docId: string) {
        const state = this.getState();
        if (!state.patientDocuments) return false;
        const filtered = state.patientDocuments.filter(pd => pd.id !== docId);
        if (filtered.length === state.patientDocuments.length) return false;
        state.patientDocuments = filtered;
        this.saveState(state);
        return true;
    }

    addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'> & { timestamp?: string }) {
        const state = this.getState();
        if (!state.auditLogs) state.auditLogs = [];
        const newLog: AuditLog = {
            id: 'LOG-' + Date.now(),
            timestamp: new Date().toISOString(),
            ...log
        };
        state.auditLogs.unshift(newLog); // Put news first
        this.saveState(state);
    }

    getAuditLogs() {
        return this.getState().auditLogs || [];
    }

    setUserOnline(userId: string, isOnline: boolean) {
        const state = this.getState();
        const user = state.users.find(u => u.id === userId);
        if (user) {
            user.isOnline = isOnline;
            if (!isOnline) {
                user.lastSeen = new Date().toISOString();
            }
            this.saveState(state);
        }
    }

    // ── Prescription Methods ───────────────────────────────────────────────────

    getPrescriptionsByPatient(patientId: string) {
        return (this.getState().prescriptions || []).filter(p => p.patientId === patientId);
    }

    addPrescription(prescription: Omit<Prescription, 'id' | 'doctorName'>) {
        const state = this.getState();
        if (!state.prescriptions) state.prescriptions = [];
        
        const doctor = state.users.find(u => u.id === prescription.doctorId);
        const doctorName = doctor ? `Dr. ${doctor.lastName || doctor.firstName}` : 'Unknown Specialist';

        const newPrescription: Prescription = {
            id: 'RX-' + Date.now(),
            doctorName,
            edits: [],
            lastUpdated: new Date().toISOString(),
            ...prescription
        };

        state.prescriptions.unshift(newPrescription);
        
        // Add Notification for Patient
        state.notifications.push({
            id: 'NOTIF-RX-' + Date.now(),
            userId: prescription.patientId,
            message: `🩺 New Prescription Issued from ${doctorName}: ${prescription.medications.length} medication(s).`,
            time: new Date().toISOString(),
            read: false,
            type: 'prescription',
            redirectUrl: '/prescriptions'
        });

        this.saveState(state);
        return newPrescription;
    }

    updatePrescription(prescriptionId: string, updates: Partial<Prescription>) {
        const state = this.getState();
        const ind = state.prescriptions.findIndex(rx => rx.id === prescriptionId);
        if (ind !== -1) {
            const rx = state.prescriptions[ind];
            
            // Log edit history if medications changed
            if (updates.medications && JSON.stringify(updates.medications) !== JSON.stringify(rx.medications)) {
                if (!rx.edits) rx.edits = [];
                rx.edits.push({
                    timestamp: new Date().toISOString(),
                    summary: `Adjusted medications.`,
                    previousMedications: [...rx.medications]
                });
            }

            state.prescriptions[ind] = { 
                ...state.prescriptions[ind], 
                ...updates, 
                lastUpdated: new Date().toISOString() 
            };
            
            // Notify Patient
            state.notifications.push({
                id: 'NOTIF-RX-UPD-' + Date.now(),
                userId: rx.patientId,
                message: `⚠️ Prescription Updated: Dr. ${rx.doctorName.replace('Dr. ', '')} modified your clinical plan. Please review immediately.`,
                time: new Date().toISOString(),
                read: false,
                type: 'prescription',
                redirectUrl: '/prescriptions'
            });

            this.saveState(state);
            return true;
        }
        return false;
    }

    updatePrescriptionStatus(prescriptionId: string, status: 'active' | 'past') {
        const state = this.getState();
        if (!state.prescriptions) return false;
        
        const prescription = state.prescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.status = status;
            this.saveState(state);
            return true;
        }
        return false;
    }

    deletePrescription(prescriptionId: string) {
        const state = this.getState();
        if (!state.prescriptions) return false;
        
        const filtered = state.prescriptions.filter(p => p.id !== prescriptionId);
        if (filtered.length === state.prescriptions.length) return false;
        
        state.prescriptions = filtered;
        this.saveState(state);
        return true;
    }
}

export const mockDB = new MockDBService();
