'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Download,
    Search,
    DollarSign,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    MoreHorizontal,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialTransactions = [
    { id: "INV-6001", patient: "John Doe", type: "Treatment Fee", amount: "$3,200", date: "2024-02-23", status: "Paid", method: "Wire Transfer" },
    { id: "INV-6002", patient: "Alice Smith", type: "Consultation", amount: "$150", date: "2024-02-22", status: "Pending", method: "Credit Card" },
    { id: "INV-6003", patient: "Emma Wilson", type: "Travel Package", amount: "$1,800", date: "2024-02-20", status: "Paid", method: "Stripe" },
    { id: "INV-6004", patient: "Robert Brown", type: "Hospital Deposit", amount: "$5,000", date: "2024-02-18", status: "Overdue", method: "Cash" },
];

export default function AdminFinancePage() {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState(initialTransactions);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTransactions = transactions.filter(tx =>
        tx.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        toast({
            title: "Exporting Records",
            description: "Generating financial PDF report...",
        });
    };

    const handleGenerateInvoice = () => {
        toast({
            title: "Invoice System",
            description: "Opening invoice generator tool...",
        });
    };

    const handleStatusUpdate = (id: string, status: string) => {
        setTransactions(transactions.map(tx =>
            tx.id === id ? { ...tx, status } : tx
        ));
        toast({
            title: "Transaction Updated",
            description: `${id} marked as ${status}.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Records</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage invoices, payments, and revenue reporting.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button className="gap-2" onClick={handleGenerateInvoice}>
                        <Plus className="h-4 w-4" />
                        Generate Invoice
                    </Button>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$42,500</div>
                        <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-3 w-3" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,400</div>
                        <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                            8 invoices awaiting settlement
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$3,800</div>
                        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                            <ArrowDownRight className="h-3 w-3" /> -2% reduction this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="pb-3 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Invoices & Transactions</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search records..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="px-6">Invoice ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="px-6 font-mono text-xs">{tx.id}</TableCell>
                                    <TableCell className="text-sm font-medium">{tx.patient}</TableCell>
                                    <TableCell className="text-sm">{tx.type}</TableCell>
                                    <TableCell className="text-sm font-bold">{tx.amount}</TableCell>
                                    <TableCell className="text-sm">{tx.date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                tx.status === 'Paid' ? 'default' :
                                                    tx.status === 'Overdue' ? 'destructive' : 'outline'
                                            }
                                            className={tx.status === 'Paid' ? 'bg-emerald-500' : ''}
                                        >
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Financial Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2" onClick={() => toast({ title: "Opening Invoice", description: `Viewing invoice ${tx.id}...` })}>
                                                        <FileText className="h-4 w-4" /> View Invoice
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2" onClick={() => toast({ title: "Downloading", description: `Preparing PDF for ${tx.id}...` })}>
                                                        <Download className="h-4 w-4" /> Download PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-emerald-600" onClick={() => handleStatusUpdate(tx.id, 'Paid')}>
                                                        <CheckCircle2 className="h-4 w-4" /> Mark as Paid
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
