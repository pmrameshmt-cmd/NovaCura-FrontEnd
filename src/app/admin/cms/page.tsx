'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    Plus,
    Edit,
    Trash2,
    Globe,
    Package,
    MessageSquare,
    Image as ImageIcon,
    Layout
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const initialPackages = [
    { id: 1, title: "Comprehensive Cardiology Checkup", price: "$1,200", status: "Active", inclusions: ["Full ECG", "Echo", "Blood Prep"] },
    { id: 2, title: "Executive Health Package", price: "$850", status: "Active", inclusions: ["30+ Tests", "Consultation"] },
];

const initialTestimonials = [
    { id: 1, name: "Mark Wilson", text: "Exceptional care from start to finish. The coordination was seamless.", rating: 5 },
    { id: 2, name: "Sophia Jones", text: "NOVACURA made my travel for surgery so easy. Highly recommended.", rating: 5 },
];

export default function AdminCMSPage() {
    const { toast } = useToast();
    const [packages, setPackages] = useState(initialPackages);
    const [testimonials, setTestimonials] = useState(initialTestimonials);

    const handleAddPackage = () => {
        const newPkg = {
            id: packages.length + 1,
            title: "New Custom Package",
            price: "$0",
            status: "Draft",
            inclusions: ["New Inclusion"]
        };
        setPackages([...packages, newPkg]);
        toast({
            title: "Package Created",
            description: "A new draft package has been added.",
        });
    };

    const handleDeletePackage = (id: number) => {
        setPackages(packages.filter(p => p.id !== id));
        toast({
            title: "Package Deleted",
            description: "The package has been removed.",
        });
    };

    const handleAddTestimonial = () => {
        const newT = {
            id: testimonials.length + 1,
            name: "New Reviewer",
            text: "This is a placeholder for a new client testimonial.",
            rating: 5
        };
        setTestimonials([...testimonials, newT]);
        toast({
            title: "Testimonial Added",
            description: "New client feedback has been recorded.",
        });
    };

    const handleDeleteTestimonial = (id: number) => {
        setTestimonials(testimonials.filter(t => t.id !== id));
        toast({
            title: "Testimonial Removed",
            description: "The feedback has been deleted.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage website packages, testimonials, and core service content.
                    </p>
                </div>
                <Button className="gap-2" onClick={() => toast({ title: "Previewing", description: "Opening website preview..." })}>
                    <Globe className="h-4 w-4" />
                    Preview Website
                </Button>
            </div>

            <Tabs defaultValue="packages" className="w-full">
                <TabsList className="w-full max-w-md">
                    <TabsTrigger value="packages" className="flex-1 gap-2">
                        <Package className="h-4 w-4" /> Packages
                    </TabsTrigger>
                    <TabsTrigger value="testimonials" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" /> Testimonials
                    </TabsTrigger>
                    <TabsTrigger value="services" className="flex-1 gap-2">
                        <Layout className="h-4 w-4" /> Services
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="packages" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <PackageItem
                                key={pkg.id}
                                title={pkg.title}
                                price={pkg.price}
                                status={pkg.status}
                                inclusions={pkg.inclusions}
                                onDelete={() => handleDeletePackage(pkg.id)}
                            />
                        ))}
                        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center border-2 bg-transparent">
                            <Plus className="h-8 w-8 text-muted-foreground mb-4" />
                            <h3 className="font-semibold">Add New Package</h3>
                            <p className="text-sm text-muted-foreground mt-1">Create a new treatment bundle for patients.</p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={handleAddPackage}>Create Now</Button>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="testimonials" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Client Testimonials</CardTitle>
                                <CardDescription>Manage feedback displayed on the landing page.</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2" onClick={handleAddTestimonial}>
                                <Plus className="h-4 w-4" /> Add Testimonial
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {testimonials.map((t) => (
                                <div key={t.id} className="flex items-start justify-between border rounded-lg p-4 group">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{t.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{t.text}</p>
                                            <div className="flex gap-1 mt-2">
                                                {[...Array(t.rating)].map((_, j) => (
                                                    <span key={j} className="text-yellow-400 text-xs text-amber-500">★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteTestimonial(t.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function PackageItem({ title, price, status, inclusions, onDelete }: any) {
    const { toast } = useToast();
    return (
        <Card className="overflow-hidden">
            <div className="h-32 bg-muted flex items-center justify-center border-b">
                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-sm leading-tight">{title}</h3>
                    <Badge variant="secondary" className={`${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} hover:bg-opacity-50 text-[10px]`}>
                        {status}
                    </Badge>
                </div>
                <div className="text-lg font-bold text-primary mb-4">{price}</div>
                <div className="space-y-1 mb-6">
                    {inclusions.map((inc: any) => (
                        <div key={inc} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            {inc}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Edit Mode", description: "Opening package editor..." })}>
                        <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive gap-2" onClick={onDelete}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
