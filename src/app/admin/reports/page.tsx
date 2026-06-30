'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Download,
    TrendingUp,
    Users,
    FileText,
    DollarSign,
    Filter,
    ArrowUpRight,
    PieChart as PieIcon
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from "recharts";

const conversionData = [
    { name: 'Inquiries', value: 850 },
    { name: 'Qualified', value: 420 },
    { name: 'Booked', value: 124 },
    { name: 'Converted', value: 98 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminReportsPage() {
    const { toast } = useToast();

    const handleAction = (title: string, description: string, reportName?: string) => {
        toast({ title, description });
        
        if (reportName) {
            setTimeout(() => {
                const mockContent = `NOVACURA ANALYTICS REPORT\n-------------------------\nReport: ${reportName}\nGenerated On: ${new Date().toLocaleString()}\nPlatform Status: ACTIVE\n\n[CONFIDENTIAL CLINICAL DATA]`;
                const blob = new Blob([mockContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                toast({ title: "Report Downloaded", description: "Analytical document is now available." });
            }, 1000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Detailed reporting on user registrations, conversion rates, and financial performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => handleAction("Filter Reports", "Opening date range picker...")}>
                        <Filter className="h-4 w-4" />
                        Custom Date Range
                    </Button>
                    <Button className="gap-2" onClick={() => handleAction("Report Generation", "Compiling cross-platform analytics...", "Full_Platform_Audit")}>
                        <Download className="h-4 w-4" />
                        Generate Full Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                        <CardDescription>Track the journey from initial inquiry to treatment conversion.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={conversionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {conversionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                        <CardDescription>Key platform efficiency benchmarks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Monthly Conversion Rate</p>
                                    <p className="text-2xl font-bold">11.53%</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" /> +2.4%
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Active Lead Quality</p>
                                    <p className="text-2xl font-bold">8.4/10</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" /> +0.8
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Avg. Response Time</p>
                                    <p className="text-2xl font-bold">2.4 hrs</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" /> -12%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Downloads</CardTitle>
                    <CardDescription>Export platform data in Excel or PDF format.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {[
                            { name: "Global User Registration Report", date: "Feb 2024", type: "Excel" },
                            { name: "Patient Form Submission Breakdown", date: "Feb 2024", type: "PDF" },
                            { name: "Monthly Revenue & Conversion Summary", date: "Jan 2024", type: "Excel" },
                        ].map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{report.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{report.date} · {report.type}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleAction("Downloading Report", `Preparing ${report.name} for download...`, report.name)}>
                                    <Download className="h-4 w-4" /> Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
