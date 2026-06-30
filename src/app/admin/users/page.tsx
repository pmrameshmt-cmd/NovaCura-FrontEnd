'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    UserPlus,
    Shield,
    Mail,
    Phone,
    Trash2,
    Edit2,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    emailVerified: boolean;
}

export default function AdminUsersPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'ADMIN',
        phoneNumber: ''
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                router.push('/admin/login');
                return;
            }

            const token = JSON.parse(userData).token;

            const response = await fetch(`${API_BASE_URL}/services/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else if (response.status === 401) {
                // Token invalid or expired - redirect to admin login
                localStorage.removeItem('user');
                toast({
                    variant: "destructive",
                    title: "Session Expired",
                    description: "Please log in again to continue."
                });
                router.push('/admin/login');
            } else {
                toast({
                    variant: "destructive",
                    title: "Fetch Failed",
                    description: `Error ${response.status}: Could not retrieve user list.`
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to connect to the server."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            const userData = localStorage.getItem('user');
            const token = userData ? JSON.parse(userData).token : '';

            const response = await fetch(`${API_BASE_URL}/services/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast({
                    title: "User Created",
                    description: "The administrative user has been successfully added."
                });
                setIsCreateModalOpen(false);
                fetchUsers();
                // Reset form
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    role: 'ADMIN',
                    phoneNumber: ''
                });
            } else {
                const error = await response.text();
                toast({
                    variant: "destructive",
                    title: "Creation Failed",
                    description: error || "Failed to create user."
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit request."
            });
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const userData = localStorage.getItem('user');
            const token = userData ? JSON.parse(userData).token : '';

            const response = await fetch(`${API_BASE_URL}/services/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast({
                    title: "User Deleted",
                    description: "User has been removed from the system."
                });
                fetchUsers();
            } else {
                const error = await response.text();
                toast({
                    variant: "destructive",
                    title: "Delete Failed",
                    description: error || "Insufficient permissions."
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Connection error."
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        const variants: Record<string, string> = {
            'SUPER_ADMIN': 'bg-red-500/10 text-red-500 border-red-500/20',
            'ADMIN': 'bg-primary/10 text-primary border-primary/20',
            'OPERATIONS': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'FINANCE': 'bg-green-500/10 text-green-500 border-green-500/20'
        };
        return (
            <Badge className={`font-bold ${variants[role] || 'bg-slate-500/10 text-slate-500'}`} variant="outline">
                {role}
            </Badge>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary" />
                        Admin Users
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Manage system administrators and operational staff
                    </p>
                </div>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="font-bold gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            Invite Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Admin User</DialogTitle>
                            <DialogDescription>
                                Add a new member to the NOVACURA operations team.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="johndoe"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(v) => setFormData({ ...formData, role: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Administrator</SelectItem>
                                            <SelectItem value="OPERATIONS">Operations</SelectItem>
                                            <SelectItem value="FINANCE">Finance</SelectItem>
                                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Initial Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" className="w-full font-bold" disabled={createLoading}>
                                    {createLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                    Create Account
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Personnel Directory</CardTitle>
                        <CardDescription>Filtering {filteredUsers.length} total staff members</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search names, email..."
                            className="pl-9 bg-background/50 border-muted-foreground/20 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30 transition-colors">
                                    <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground">User</th>
                                    <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground">ID</th>
                                    <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground">Role</th>
                                    <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground">Status</th>
                                    <th className="h-12 px-6 text-right align-middle font-bold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="h-32 text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-50" />
                                            <p className="mt-2 text-muted-foreground font-medium">Synchronizing systems...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="h-32 text-center">
                                            <p className="text-muted-foreground font-medium text-lg">No personnel records found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/20 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                                                        {user.firstName[0]}{user.lastName[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground">{user.firstName} {user.lastName}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                                                            <Mail className="w-3 h-3" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 font-mono text-xs text-slate-500">
                                                @{user.username}
                                            </td>
                                            <td className="p-6">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="p-6">
                                                {user.emailVerified ? (
                                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none gap-1 font-bold">
                                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none gap-1 font-bold">
                                                        <XCircle className="w-3 h-3" /> Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2">
                                                            <Edit2 className="w-4 h-4" /> Edit Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2">
                                                            <Shield className="w-4 h-4" /> Reset Permissions
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
                                                                    handleDeleteUser(user.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
