'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Clipboard, MessageSquare, FileText, Hospital, Stethoscope, CalendarPlus, AlertCircle, Video, CalendarDays, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import React from 'react';
import { OnboardingModal } from '@/components/dashboard/onboarding-modal';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { mockDB, MedicalCase } from "@/lib/mock-db";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL, fetchWithTimeout } from "@/lib/config";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [mounted, setMounted] = React.useState(false);
  const [profileCompleted, setProfileCompleted] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCase, setActiveCase] = React.useState<MedicalCase | null>(null);
  const [allCases, setAllCases] = React.useState<MedicalCase[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<any[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);

        try {
          // 1. Fetch case status from Backend (MongoDB)
          const caseRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/medical-history/my-status`, {
            headers: { 'Authorization': `Bearer ${parsed.token}` }
          }, 5000);

          let currentCase = null;
          if (caseRes.ok) {
            currentCase = await caseRes.json();
            if (currentCase) {
              setActiveCase(currentCase);
              setAllCases([currentCase]);
              
              // Map profile completion
              setProfileCompleted(true);

              // 2. Fetch slots/appointments from Backend
              const slotRes = await fetchWithTimeout(`${API_BASE_URL}/services/api/slots/case/${currentCase.id}`, {
                headers: { 'Authorization': `Bearer ${parsed.token}` }
              }, 5000);
              
              if (slotRes.ok) {
                const slots = await slotRes.json();
                const appts = slots
                  .filter((s: any) => ['confirmed', 'booked', 'completed', 'selected', 'pending_payment'].includes(s.status))
                  .map((s: any) => {
                    const dateObj = new Date(s.date);
                    return {
                      id: s.id,
                      day: dateObj.getDate().toString(),
                      month: dateObj.toLocaleString('default', { month: 'short' }).toUpperCase(),
                      time: s.time,
                      date: dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                      doctor: s.doctorName || 'Dr. Specialist',
                      specialty: s.specialization || 'Consultant',
                      hospital: s.location || 'Virtual',
                      status: s.status === 'completed' ? 'Completed' : 'Confirmed'
                    };
                  });
                setUpcomingAppointments(appts);
              }
            }
          }

          // Fallback check for onboarding
          if (!currentCase) {
             const isCompleted = !!(parsed.isProfileCompleted || parsed.profileCompleted);
             setProfileCompleted(isCompleted);
             if (typeof window !== 'undefined' && (window.location.search.includes('open-form=true') || !isCompleted)) {
                // Only auto-open once or when specifically requested
                const hasOpened = sessionStorage.getItem('onboarding_opened');
                if (!hasOpened || window.location.search.includes('open-form=true')) {
                    setShowOnboarding(true);
                    sessionStorage.setItem('onboarding_opened', 'true');
                }
             }
          }
        } catch (err) {
          console.error("Dashboard sync error:", err);
        }
      }
    };

    loadData();
    const pollInterval = setInterval(loadData, 5000);

    window.addEventListener('storage', loadData);
    window.addEventListener('mock-db-update', loadData);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', loadData);
      window.removeEventListener('mock-db-update', loadData);
    };
  }, []);

  const handlePayment = async () => {
    if (!activeCase || !user) return;

    try {
      // Update status to 'Consultation Confirmed' via backend if possible
      // (For now, use the doctor status endpoint as a proxy or simulate)
      await fetchWithTimeout(`${API_BASE_URL}/services/api/doctor/patient-case/${activeCase.id}/status`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ status: 'Consultation Confirmed' }),
      }, 5000);

      toast({
        title: "Payment Successful",
        description: "Consultation confirmed! You can now join the session at the scheduled time.",
      });
    } catch (err) {
      console.error("Payment error:", err);
      toast({ title: "Payment Error", description: "Failed to synchronize payment.", variant: "destructive" });
    }
  };

  const handleDownloadICS = () => {
    if (!activeCase || !activeCase.proposedSlots) return;
    const slot = activeCase.proposedSlots[0] || { date: 'TBD', time: 'TBD' };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HealHome//Medical Tourism Platform//EN
BEGIN:VEVENT
UID:${activeCase.id}@healhome.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Medical Consultation
DESCRIPTION:Consultation with your assigned doctor for case ${activeCase.id}
LOCATION:Virtual
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Consultation_${activeCase.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Calendar Invite Downloaded",
      description: "You can now add this event to your personal calendar.",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent animate-pulse">
            NOVACURA GLOBAL
          </h2>
          <p className="text-sm text-muted-foreground tracking-widest uppercase mt-1">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* Single OnboardingModal instance — controlled by both auto-open and banner button */}
      <OnboardingModal
        externalOpen={showOnboarding}
        onExternalOpenChange={setShowOnboarding}
        onComplete={() => {
            setProfileCompleted(true);
            setShowOnboarding(false);
            // Clear the URL parameter so it doesn't re-open on refresh
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('open-form');
                window.history.replaceState(null, '', url.pathname + url.search);
            }
        }}
      />
      <AppSidebar
        profileCompleted={profileCompleted}
        user={user}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      <SidebarInset>
        <header className="flex items-center justify-between p-4 md:hidden">
          <SidebarTrigger />
        </header>
        <div className="p-6 md:p-8 space-y-6">

          {/* ── Profile banner (only when profile is NOT completed for Patients) ── */}
          {mounted && (user?.role?.toLowerCase() === 'patient' || user?.role?.toLowerCase() === 'user') && !profileCompleted && !showOnboarding && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h2 className="font-semibold text-amber-800">Complete Your Medical Profile</h2>
                <p className="text-sm text-amber-700 mt-1">
                  Complete your Patient Medical Case Sheet to unlock all features.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-100"
              >
                <Link
                  href="?open-form=true"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState(null, '', '?open-form=true');
                    setShowOnboarding(true);
                  }}
                >
                  Open Form
                </Link>
              </Button>
            </div>
          )}

          {/* ── Welcome header ────────────────────────────────────────────── */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s a summary of your health. Stay on top of your wellbeing.
            </p>
          </div>

          {/* ── Active Medical Case Status Banner ──────────────────────────── */}
          {/* ── Active Medical Case Status Banner + Timeline ── */}
          {activeCase && (
            <div className="space-y-4">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {activeCase.type} CASE
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">#{activeCase.id}</span>
                      <Badge className={`${activeCase.urgency === 'Critical' ? 'bg-rose-500' : activeCase.urgency === 'Urgent' ? 'bg-amber-500' : 'bg-blue-500'} text-white font-black px-2 py-0 rounded text-[9px]`}>
                        {activeCase.urgency}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Current Status: <span className="text-blue-700">{activeCase.status}</span>
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-xl">
                      {activeCase.status === 'Case Sheet Submitted' && 'Your medical details have been received. An admin will assign a doctor shortly.'}
                      {activeCase.status === 'Review Completed' && 'The doctor has reviewed your case. Please check your consultations for further instructions.'}
                      {activeCase.status === 'Doctor Query Sent' && 'The doctor has requested more information. Please reply in the Consultations tab.'}
                      {activeCase.status === 'Slots Shared' && 'Available consultation slots have been shared with you. Please select one in the Consultations tab.'}
                      {activeCase.status === 'Pending Payment' && 'Please complete your consultation payment ($100) to confirm your booking.'}
                      {activeCase.status === 'Payment Completed' && 'Payment successful! Waiting for the doctor to officially confirm the calendar slot.'}
                      {activeCase.status === 'Consultation Confirmed' && 'Consultation is confirmed! An ICS calendar invite is available.'}
                      {activeCase.status === 'Consultation Completed' && 'Your consultation has been successfully completed. View records for notes.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {activeCase.status === 'Pending Payment' && (
                      <Button onClick={handlePayment} className="bg-slate-900 hover:bg-slate-800 font-bold uppercase text-[10px] tracking-widest">
                        Pay Fee ($100)
                      </Button>
                    )}

                    {(activeCase.status === 'Slots Shared' || activeCase.status === 'Doctor Query Sent') && (
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-[10px] tracking-widest">
                        <Link href="/consultations">Respond Now</Link>
                      </Button>
                    )}

                    {activeCase.status === 'Consultation Confirmed' && (
                      <Button onClick={handleDownloadICS} className="bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] tracking-widest">
                        <CalendarDays className="mr-2 h-4 w-4" /> Download ICS
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Active Consultation Slot Context Card */}
              {(['Slots Shared', 'Pending Payment', 'Slot Selected', 'Consultation Confirmed', 'Reschedule Requested'].includes(activeCase.status)) && (
                <Card className="border-none shadow-sm bg-indigo-50/50 border-l-4 border-l-indigo-400 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Active Consultation Slot
                      </h3>
                      <Badge className={`border-none font-black uppercase text-[8px] ${activeCase.status === 'Reschedule Requested' ? 'bg-rose-500 text-white animate-pulse' : activeCase.selectedSlotId ? 'bg-indigo-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
                        {activeCase.status === 'Reschedule Requested' ? 'Reschedule Requested' : activeCase.selectedSlotId ? 'Confirmed' : 'Pending Selection'}
                      </Badge>
                    </div>
                    {(() => {
                      if (activeCase.status === 'Reschedule Requested') {
                        return (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-black text-rose-900 leading-none">Awaiting Reschedule</p>
                              <p className="text-[10px] font-black text-rose-400 uppercase mt-2">Doctor will propose new slots shortly</p>
                            </div>
                            <Button size="sm" variant="outline" asChild className="rounded-xl border-rose-200 text-rose-700 font-bold text-[10px] uppercase h-8 px-4 bg-white/50 hover:bg-white">
                              <Link href="/consultations">View Messages</Link>
                            </Button>
                          </div>
                        );
                      }

                      const slot = upcomingAppointments.find(a => a.id === activeCase.selectedSlotId);
                      
                      if (!slot && activeCase.status === 'Slots Shared') return (
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-indigo-900/60 italic">Available slots have been shared. Please respond to select one.</p>
                          <Button size="sm" variant="outline" asChild className="rounded-xl border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase h-8 px-4 bg-white/50 hover:bg-white">
                            <Link href="/consultations">View Slots</Link>
                          </Button>
                        </div>
                      );

                      if (!slot) return <p className="text-xs font-bold text-indigo-900/60 italic">No scheduled session details found.</p>;

                      return (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-indigo-900">{slot.date} at {slot.time}</p>
                            <p className="text-[10px] font-black text-indigo-400 uppercase mt-1">Duration: 30 Mins</p>
                          </div>
                          <div className="flex gap-2">
                             <Button size="sm" variant="outline" asChild className="rounded-xl border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase h-8 px-4 bg-white/50 hover:bg-white">
                              <Link href="/consultations">Clinical Chat</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Visual Timeline Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between min-w-[600px] relative pt-4">
                  {[
                    'Case Submitted',
                    'Review Completed',
                    'Slots Shared',
                    'Slot Confirmed',
                    'Payment Completed',
                    'Consultation Confirmed',
                    'Completed'
                  ].map((step, idx, arr) => {
                    const statusMap: Record<string, string> = {
                      'Case Submitted': 'Case Submitted',
                      'Review Completed': 'Review Completed',
                      'Slots Shared': 'Slots Shared',
                      'Slot Confirmed': 'Slot Confirmed',
                      'Payment Completed': 'Payment Completed',
                      'Consultation Confirmed': 'Consultation Confirmed',
                      'Completed': 'Consultation Completed'
                    };
                    
                    const timelineStatuses = activeCase.timeline?.map((t: any) => t.status) || [];
                    const isCompleted = timelineStatuses.includes(statusMap[step]);
                    const isNext = !isCompleted && (idx === 0 || timelineStatuses.includes(statusMap[arr[idx-1]]));
                    
                    return (
                      <div key={step} className="flex flex-col items-center gap-3 relative z-10 flex-1">
                        <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 border-white ring-2 ring-emerald-500 shadow-sm' : isNext ? 'bg-white border-blue-500 ring-4 ring-blue-100 animate-pulse' : 'bg-white border-slate-100'}`}>
                          {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter text-center max-w-[80px] ${isCompleted ? 'text-slate-900' : isNext ? 'text-blue-600' : 'text-slate-300'}`}>
                          {step}
                        </span>
                        {idx < arr.length - 1 && (
                          <div className={`absolute left-1/2 top-4 w-full h-[2px] -z-10 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Stat cards ───────────────────────────────────────────────── */}
          {(() => {
            const confirmedCases = allCases.filter(c => c.status === 'Consultation Confirmed').length;
            const activeCases = allCases.filter(c => c.status !== 'Consultation Completed').length;
            const pendingMessages = activeCase && ['Doctor Query Sent', 'Slots Shared'].includes(activeCase.status) ? 1 : 0;
            const completedCases = allCases.filter(c => c.status === 'Consultation Completed').length;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Appointments */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{confirmedCases > 0 ? 'Confirmed' : 'Upcoming'}</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">{confirmedCases}</p>
                    <p className="text-sm text-blue-600 mt-0.5">Consultations confirmed</p>
                  </CardContent>
                </Card>

                {/* Active Cases */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Clipboard className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700">{activeCases}</p>
                    <p className="text-sm text-emerald-600 mt-0.5">Active medical cases</p>
                  </CardContent>
                </Card>

                {/* Pending Messages */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      {pendingMessages > 0 && <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{pendingMessages} New</span>}
                    </div>
                    <p className="text-3xl font-bold text-violet-700">{pendingMessages}</p>
                    <p className="text-sm text-violet-600 mt-0.5">Pending from care team</p>
                  </CardContent>
                </Card>

                {/* Completed */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Done</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">{completedCases}</p>
                    <p className="text-sm text-orange-600 mt-0.5">Consultations completed</p>
                  </CardContent>
                </Card>
              </div>
            );
          })()}

          {/* ── Quick actions ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[

              { icon: Clipboard, label: 'Medical Records', href: '/medical-records', color: 'text-emerald-600' },
              { icon: MessageSquare, label: 'Messages', href: '/consultations', color: 'text-violet-600' },
              { icon: Hospital, label: 'Find Hospitals', href: '/hospitals', color: 'text-rose-600' },
            ].map(({ icon: Icon, label, href, color }) => (
              <a key={href} href={href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border bg-white hover:bg-gray-50 transition-colors text-center shadow-sm`}>
                <Icon className={`h-6 w-6 ${color}`} />
                <span className="text-xs font-medium text-foreground">{label}</span>
              </a>
            ))}
          </div>

          {/* ── Appointments + Health Promo ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Upcoming Appointments */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                <Link href="/appointments" className="text-sm text-primary hover:underline">View all →</Link>
              </div>
              <Card className="shadow-sm">
                <CardContent className="p-0 divide-y">
                  {upcomingAppointments.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                       <CalendarDays className="h-8 w-8 opacity-20" />
                       <p className="text-sm">No upcoming appointments found.</p>
                        <p className="text-xs italic mt-2">Connect with your coordinator via the clinical chat to arrange a session.</p>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[10px] font-black uppercase text-rose-500 mt-4 h-8 px-4 border border-rose-100 hover:bg-rose-50"
                            onClick={() => {
                                // Master Purge: Clear ALL slots for this patient
                                const patientSlots = mockDB.getSlotsByPatient(user?.id);
                                patientSlots.forEach(s => mockDB.updateSlot(s.id, { status: 'available', patientId: undefined }));
                                
                                // Reset patient case status
                                const cases = mockDB.getCasesByPatient(user?.id);
                                if (cases.length > 0) {
                                    mockDB.updateCase(cases[0].id, { status: 'Review Completed', selectedSlotId: undefined });
                                }
                                toast({ title: "Registry Synchronized", description: "All test appointments and 2001 legacy data cleared." });
                                window.dispatchEvent(new CustomEvent('mock-db-update'));
                            }}
                        >
                            Purge Records & Synchronize Year
                        </Button>
                    </div>
                  ) : (
                    upcomingAppointments.map((appt, i) => (
                      <div key={i} className="flex items-center gap-4 p-4">
                        {/* Date badge */}
                        <div className="flex-shrink-0 w-12 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-primary leading-none">{appt.day}</span>
                          <span className="text-[10px] font-semibold text-primary/70 uppercase tracking-wide">{appt.month}</span>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{appt.time}</p>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${appt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{appt.date}</p>
                          <p className="text-sm mt-0.5">
                            <Stethoscope className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {appt.doctor} <span className="text-muted-foreground">· {appt.specialty}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            <Hospital className="inline h-3 w-3 mr-1" />{appt.hospital}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="shrink-0 text-xs text-primary bg-primary/5 border-primary/10"
                                onClick={() => router.push('/appointments')}
                            >
                                Details
                            </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Health Offers & News */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Health Offers & News</h2>
              <Card className="shadow-sm overflow-hidden">
                {/* SVG illustration instead of broken placeholder image */}
                <div className="w-full h-36 bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <circle cx="160" cy="20" r="60" fill="rgba(255,255,255,0.08)" />
                    <circle cx="30" cy="90" r="50" fill="rgba(255,255,255,0.06)" />
                    <text x="100" y="38" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" opacity="0.95">🩺 Free Annual</text>
                    <text x="100" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Health Check-up</text>
                    <text x="100" y="72" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="8">Prevention is the best cure</text>
                  </svg>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm">Free Annual Health Check-up</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Book your comprehensive annual health screening at no cost. Early detection saves lives.
                    </p>
                  </div>
                  <Button size="sm" className="w-full text-xs">Book Now →</Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm overflow-hidden">
                <div className="w-full h-24 bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center">
                  <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <circle cx="170" cy="10" r="50" fill="rgba(255,255,255,0.08)" />
                    <text x="100" y="30" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">❤️ Heart Health Week</text>
                    <text x="100" y="48" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="8">Get a free ECG screening</text>
                    <text x="100" y="62" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7">Valid till March 31, 2025</text>
                  </svg>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm">Heart Health Week</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Free ECG screening for all registered patients.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── Health tips ───────────────────────────────────────────────── */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Daily Health Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '💧', title: 'Stay Hydrated', tip: 'Drink at least 8 glasses of water daily to keep your body functioning optimally.' },
                { emoji: '🏃', title: 'Move Daily', tip: '30 minutes of moderate exercise per day can significantly reduce chronic disease risk.' },
                { emoji: '😴', title: 'Sleep Well', tip: 'Aim for 7–9 hours of quality sleep to allow your body to rest and repair itself.' },
              ].map(({ emoji, title, tip }) => (
                <Card key={title} className="shadow-sm border-0 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">{emoji}</div>
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground">{tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </SidebarInset>

    </SidebarProvider>
  );
}
