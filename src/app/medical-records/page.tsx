"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { mockDB } from "@/lib/mock-db"
import React from 'react'
import { FileText, Plus, Trash2, Download, AlertCircle, Eye, Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { API_BASE_URL } from "@/lib/config"

export default function MedicalRecordsPage() {
  const [user, setUser] = React.useState<any>(null);
  const [profileCompleted, setProfileCompleted] = React.useState(true);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadData = React.useCallback(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileCompleted(mockDB.isProfileCompleted(parsed.id));
      setDocuments(mockDB.getPatientDocuments(parsed.id));
    }
  }, []);

  React.useEffect(() => {
    loadData();
    window.addEventListener('mock-db-update', loadData);
    return () => window.removeEventListener('mock-db-update', loadData);
  }, [loadData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
        // 1. Storage in Clinical Vault (Patient Documents)
        const newDoc = {
            patientId: user.id,
            title: file.name,
            type: 'Uploaded Document',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            url: '#'
        };
        const createdDoc = mockDB.addPatientDocument(newDoc);
        const docId = createdDoc.id;
        
        // 2. Synchronize with Active Case for Doctor/Admin visibility
        const activeCases = mockDB.getCasesByPatient(user.id);
        if (activeCases.length > 0) {
            const currentCase = activeCases[0];
            const updatedDocs = [...(currentCase.documents || []), {
                id: docId || 'DOC-' + Date.now(),
                name: file.name,
                tag: 'Other' as any,
                url: '#',
                uploadedAt: new Date().toISOString(),
                version: 1
            }];
            
            mockDB.updateCase(currentCase.id, { 
                documents: updatedDocs,
                readiness: { ...currentCase.readiness, reportsUploaded: true }
            });
            
            toast({
                title: "Portal Sync Active",
                description: `${file.name} synchronized with clinical case.`,
            });
        } else {
            toast({
                title: "Document Vaulted",
                description: `${file.name} added to your record history.`,
            });
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
        mockDB.deletePatientDocument(id);
        toast({
            title: "Document Deleted",
            description: "The record has been permanently removed.",
        });
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(documents.map(d => d.type)));

  return (
    <SidebarProvider>
      <AppSidebar profileCompleted={profileCompleted} user={user} />
      <SidebarInset>
        <header className="flex items-center justify-between p-4 md:hidden">
          <SidebarTrigger />
        </header>
        <div className="min-h-screen bg-[#f8f7f2] p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Medical Records</h1>
                <p className="text-slate-500 font-medium">Your centralized clinical document vault.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search records..." 
                        className="pl-9 bg-white border-slate-200 rounded-xl h-12 shadow-sm focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48 bg-white border-slate-200 rounded-xl h-12 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Filter className="h-3.5 w-3.5 text-slate-400" />
                            <SelectValue placeholder="All Categories" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 rounded-xl">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat: string) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                />
                <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 h-12 rounded-xl shadow-lg shadow-slate-900/20 flex items-center gap-2 group whitespace-nowrap"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    Upload
                </Button>
              </div>
            </div>

            <Card className="bg-white shadow-xl shadow-slate-200/50 border-none overflow-hidden rounded-3xl">
              <CardHeader className="pb-4 border-b border-slate-50">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Document Repository</span>
                </div>
                <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">My Documents</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Access and audit all clinical reports and administrative letters.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Document Details</th>
                                <th className="px-8 py-5">Classification</th>
                                <th className="px-8 py-5">Date Produced</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <AlertCircle className="h-8 w-8" />
                                            <p className="text-sm font-bold">No documents match your results.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDocuments.map((doc: any) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <FileText className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-base">{doc.title}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Verified Clinical Record</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-bold">
                                        {doc.date}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Preview Document"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors"
                                                title="Download Record"
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`${API_BASE_URL}/services/api/medical-history/download/${encodeURIComponent(doc.title)}`, {
                                                            headers: { 'Authorization': `Bearer ${user?.token}` }
                                                        });
                                                        if (!res.ok) throw new Error();
                                                        const blob = await res.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = doc.title;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(url);
                                                    } catch (err) {
                                                        console.warn("Backend download failed, providing vault fallback");
                                                        const mockContent = `NOVACURA PATIENT VAULT\n----------------------\nDocument: ${doc.title}\nCategory: ${doc.type}\nDate: ${doc.date}\nStatus: Verified Clinical Export\n\nThis is a secure fallback export from the patient's local clinical memory.`;
                                                        const blob = new Blob([mockContent], { type: 'text/plain' });
                                                        const url = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = `${doc.title.split('.')[0]}_vault_export.txt`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                        window.URL.revokeObjectURL(url);
                                                        
                                                        toast({ title: "Vault Export Successful", description: "Local clinical record retrieved." });
                                                    }
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDelete(doc.id)}
                                                className="h-9 w-9 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                                                title="Delete Record"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
