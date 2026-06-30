"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  FileText,
  Download,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import { mockDB } from "@/lib/mock-db";
import { useSearchParams } from "next/navigation";

const statusStyles: Record<string, string> = {
  "Case Sheet Submitted": "bg-blue-50 text-blue-700 border-blue-100",
  "Doctor Query Sent": "bg-amber-50 text-amber-700 border-amber-100",
  "Awaiting Patient Response":
    "bg-slate-50 text-slate-700 border-slate-100 italic",
  "Review Completed": "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Slots Shared": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Slot Selected": "bg-violet-50 text-violet-700 border-violet-100",
  "Pending Payment":
    "bg-rose-50 text-rose-700 border-rose-100 font-bold animate-pulse",
  "Payment Completed": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Consultation Confirmed":
    "bg-emerald-500 text-white border-transparent shadow-sm",
  "Consultation Completed": "bg-slate-900 text-white border-transparent",
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading consultations...
        </div>
      }
    >
      <ConsultationContent />
    </Suspense>
  );
}

function ConsultationContent() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const isSending = React.useRef(false);
  const selectedPatientRef = React.useRef<any>(null);

  // Sync ref and refresh messages when patient changes
  useEffect(() => {
    selectedPatientRef.current = selectedPatient;
    if (selectedPatient) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      fetchWithTimeout(
        `${API_BASE_URL}/services/api/messages/${selectedPatient.caseId}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        },
      )
        .then((res) => res.json())
        .then((msgs) => setChatMessages(msgs));
    }
  }, [selectedPatient]);

  // Summary State
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState({
    findings: "",
    recommendations: "",
    nextSteps: "",
    followUpAdvice: "",
    followUpRequired: false,
    followUpDate: "",
    followUpTime: "",
    prescriptionNote: "",
  });

  // Escalation State
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationData, setEscalationData] = useState({
    to: "specialist",
    reason: "Complex medical case requiring specialist intervention",
    details: "",
  });

  const searchParams = useSearchParams();
  const targetPatientId = searchParams.get("patientId");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  const fetchPatients = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const userObj = JSON.parse(userData);

      // Fetch real clinical cases from Backend
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/services/api/doctor/assigned-patients`,
        {
          headers: { Authorization: `Bearer ${userObj.token}` },
        },
        5000,
      );

      if (response.ok) {
        const assignedRaw = await response.json();
        const doctorCases = assignedRaw.map((c: any) => ({
          id: c.patientId,
          caseId: c.caseId,
          name: c.name || "Assigned Patient",
          status: c.status || "Under Review",
          lastUpdated: "Today",
          time: "Now",
          unread: 1,
          caseRecord: { ...c, id: c.caseId },
        }));

        setPatients(doctorCases);

        const currentSelected = selectedPatientRef.current;

        // Priority 1: Direct link
        if (targetPatientId && !hasAutoSelected) {
          const target = doctorCases.find((p: any) => p.id === targetPatientId);
          if (target) {
            setSelectedPatient(target);
            setHasAutoSelected(true);
            return;
          }
        }

        // Priority 2: Maintain existing selection
        if (currentSelected) {
          const updatedSelected = doctorCases.find(
            (c: any) => c.caseId === currentSelected.caseId,
          );
          if (updatedSelected) setSelectedPatient(updatedSelected);
        }
        // Priority 3: Default to first
        else if (doctorCases.length > 0) {
          setSelectedPatient(doctorCases[0]);
        }
      }
    } catch (error) {
      console.error("Clinical list sync error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedPatient) return;
    setIsUpdating(true);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      await fetchWithTimeout(
        `${API_BASE_URL}/services/api/doctor/patient-case/${selectedPatient.caseId}/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
        5000,
      );

      if (newStatus === "Slots Shared") {
        // Fetch doctor's available slots from backend
        const slotRes = await fetchWithTimeout(
          `${API_BASE_URL}/services/api/slots/doctor/${userData.id}`,
          {
            headers: { Authorization: `Bearer ${userData.token}` },
          },
        );

        if (slotRes.ok) {
          const availableBackendSlots = (await slotRes.json())
            .filter((s: any) => s.status === "available")
            .slice(0, 3);

          const sharePayload = availableBackendSlots.map((s: any) => ({
            doctorId: userData.id,
            caseId: selectedPatient.caseId,
            date: s.date,
            time: s.time,
            status: "available",
          }));

          await fetchWithTimeout(
            `${API_BASE_URL}/services/api/slots/share`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userData.token}`,
              },
              body: JSON.stringify(sharePayload),
            },
            5000,
          );
        }
      }

      toast({ title: "Workflow Sync", description: `Case: ${newStatus}` });
      fetchPatients();
    } catch (err) {
      console.error("Status update error:", err);
      toast({
        variant: "destructive",
        title: "Sync error",
        description: "Failed to push status to clinical cloud.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!selectedPatient) return;
    setIsUpdating(true);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const summary = {
        ...summaryData,
        timestamp: new Date().toISOString(),
      };

      await fetchWithTimeout(
        `${API_BASE_URL}/services/api/doctor/patient-case/${selectedPatient.caseId}/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(summary),
        },
        5000,
      );

      toast({
        title: "Consultation Concluded",
        description: "Case records archived and shared with patient.",
      });
      setShowSummaryModal(false);
      fetchPatients();
    } catch (err) {
      console.error("Summary sync error:", err);
      toast({
        variant: "destructive",
        title: "Sync error",
        description: "Failed to finalize summary.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEscalate = async () => {
    if (!selectedPatient) return;
    setIsUpdating(true);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const escalation = {
        reason: escalationData.reason,
        description: escalationData.details,
        escalatedTo: escalationData.to,
        timestamp: new Date().toISOString(),
      };

      await fetchWithTimeout(
        `${API_BASE_URL}/services/api/doctor/patient-case/${selectedPatient.caseId}/escalate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(escalation),
        },
        5000,
      );

      toast({
        title: "Escalation Triggered",
        description: `Transferred to ${escalationData.to}`,
      });
      setShowEscalationModal(false);
      fetchPatients();
    } catch (err) {
      console.error("Escalation error:", err);
      toast({
        variant: "destructive",
        title: "Sync error",
        description: "Failed to escalate case.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    const text = message.trim();
    if (!text || !selectedPatient || isSending.current) return;

    isSending.current = true;
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const msgData = {
        caseId: selectedPatient.caseId,
        senderId: userData.id || "DOC-01",
        senderRole: "doctor",
        text: text,
      };

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/services/api/messages/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(msgData),
        },
        5000,
      );

      if (response.ok) {
        const savedMsg = await response.json();
        setChatMessages((prev) => [...prev, savedMsg]);
      }

      setMessage("");
    } catch (err) {
      console.error("Message send error:", err);
      toast({
        variant: "destructive",
        title: "Message failed",
        description: "Real-time sync error.",
      });
    } finally {
      isSending.current = false;
    }
  };

  useEffect(() => {
    fetchPatients();
    // Set up periodic sync for real-time feel
    const interval = setInterval(fetchPatients, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const messagesList =
    chatMessages.length > 0
      ? chatMessages
      : [
          {
            id: "1",
            senderRole: "doctor",
            text: "Reviewing your case sheet now.",
            time: "10:15 AM",
          },
        ];

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in duration-500">
      <div className="w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
            Patient Inbox
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search..." className="pl-9 h-10 rounded-xl" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {patients.map((p) => (
              <div
                key={p.caseId}
                onClick={() => setSelectedPatient(p)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${selectedPatient?.caseId === p.caseId ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50 border-transparent"}`}
              >
                <Avatar className="h-10 w-10 border shadow-sm">
                  <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                    {p.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-black truncate">{p.name}</p>
                  </div>
                  <Badge
                    className={`${statusStyles[p.status] || "bg-slate-100 text-slate-600"} text-[8px] font-black uppercase px-2 py-0`}
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          {selectedPatient && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-emerald-500/20">
                <AvatarFallback className="font-black text-xs">
                  {selectedPatient.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {selectedPatient.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    Consultation Open
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            {selectedPatient &&
              selectedPatient.status === "Consultation Confirmed" && (
                <Button
                  size="sm"
                  className="h-8 bg-slate-900 text-white font-black text-[10px] uppercase rounded-lg px-4"
                  onClick={() => setShowSummaryModal(true)}
                >
                  Complete & Finalize
                </Button>
              )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase rounded-lg"
              onClick={() => setShowEscalationModal(true)}
            >
              Escalate
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messagesList.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.senderRole === "doctor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${m.senderRole === "doctor" ? "bg-slate-900 text-white rounded-tr-none" : "bg-slate-50 text-slate-900 rounded-tl-none"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type clinical note..."
              className="flex-1 border-none bg-transparent focus-visible:ring-0 text-sm font-medium"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              size="sm"
              className="bg-slate-900 text-white rounded-xl px-4 h-8"
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
        <DialogContent className="max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-6 text-white text-center">
            <DialogTitle className="text-xl font-black">
              Consultation Summary
            </DialogTitle>
            <DialogDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">
              Finalize medical findings & recommendations
            </DialogDescription>
          </div>
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Clinical Findings
              </Label>
              <Textarea
                placeholder="Document patient appearance, vitals, and primary symptoms noticed..."
                className="rounded-xl border-slate-200 font-medium text-sm min-h-[80px]"
                value={summaryData.findings}
                onChange={(e) =>
                  setSummaryData({ ...summaryData, findings: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Medical Recommendations
              </Label>
              <Textarea
                placeholder="Treatment plan, lifestyle changes, etc."
                className="rounded-xl border-slate-200 font-medium text-sm min-h-[80px]"
                value={summaryData.recommendations}
                onChange={(e) =>
                  setSummaryData({
                    ...summaryData,
                    recommendations: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Follow-Up Required
                </Label>
                <div className="flex items-center h-10 px-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <Switch
                    checked={summaryData.followUpRequired}
                    onCheckedChange={(val) =>
                      setSummaryData({ ...summaryData, followUpRequired: val })
                    }
                  />
                  <span className="ml-3 text-xs font-bold text-slate-600 uppercase">
                    Yes / No
                  </span>
                </div>
              </div>
              {summaryData.followUpRequired && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Suggested Date
                  </Label>
                  <Input
                    type="date"
                    className="rounded-xl border-slate-200 h-10 font-bold"
                    value={summaryData.followUpDate}
                    onChange={(e) =>
                      setSummaryData({
                        ...summaryData,
                        followUpDate: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Digital Prescription / Advice
              </Label>
              <div className="mt-2 p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-900">
                    Upload Prescription PDF
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">
                    Max size: 5MB • PDF Only
                  </p>
                </div>
                <Input
                  type="text"
                  placeholder="Prescription Name / Note (e.g. Daily Medication Plan)"
                  className="h-10 rounded-xl bg-white border-slate-200 font-medium text-xs mt-2"
                  value={summaryData.prescriptionNote}
                  onChange={(e) =>
                    setSummaryData({
                      ...summaryData,
                      prescriptionNote: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="p-6 pt-0 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl font-black uppercase text-[10px]"
              onClick={() => setShowSummaryModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black uppercase text-[10px] shadow-lg shadow-emerald-200"
              onClick={handleCompleteConsultation}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sync & Complete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Escalation Modal */}
      <Dialog open={showEscalationModal} onOpenChange={setShowEscalationModal}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-rose-600 p-6 text-white text-center">
            <DialogTitle className="text-xl font-black">
              Escalate Patient Case
            </DialogTitle>
            <DialogDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-1">
              High-priority transfer of responsibility
            </DialogDescription>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Escalate To
              </Label>
              <Select
                value={escalationData.to}
                onValueChange={(val) =>
                  setEscalationData({ ...escalationData, to: val })
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specialist">
                    Consultant Specialist
                  </SelectItem>
                  <SelectItem value="hospital">
                    Affiliated Hospital (Emergency)
                  </SelectItem>
                  <SelectItem value="admin">Senior Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Escalation Reason
              </Label>
              <Textarea
                placeholder="Elaborate on why this case needs redirection..."
                className="rounded-xl border-slate-200 font-medium text-sm"
                value={escalationData.details}
                onChange={(e) =>
                  setEscalationData({
                    ...escalationData,
                    details: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="p-6 pt-0 flex gap-3">
            <Button
              className="w-full bg-rose-600 text-white rounded-xl font-black uppercase text-[10px]"
              onClick={handleEscalate}
              disabled={isUpdating}
            >
              Transfer Case Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <div className={className}>
    <RefreshCw className="h-full w-full animate-spin" />
  </div>
);
