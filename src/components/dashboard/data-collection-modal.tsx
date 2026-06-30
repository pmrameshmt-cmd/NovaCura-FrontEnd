'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DataCollectionModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Welcome to your Dashboard!</DialogTitle>
          <DialogDescription>
            Please provide us with some more information to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Personal Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="Your full name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dob" className="text-right">
                    Date of Birth
                  </Label>
                  <Input id="dob" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Gender
                  </Label>
                  <Input id="gender" placeholder="Your gender" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input id="address" placeholder="Your address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-right">
                    Height (cm)
                  </Label>
                  <Input id="height" type="number" placeholder="Your height in cm" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Weight (kg)
                  </Label>
                  <Input id="weight" type="number" placeholder="Your weight in kg" className="col-span-3" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Current Vitals</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hr" className="text-right">
                    Heart Rate (HR)
                  </Label>
                  <Input id="hr" type="number" placeholder="Your heart rate" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="spo2" className="text-right">
                    SPO2 (%)
                  </Label>
                  <Input id="spo2" type="number" placeholder="Your SPO2 in %" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bp" className="text-right">
                    Blood Pressure (BP)
                  </Label>
                  <Input id="bp" placeholder="e.g. 120/80" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rr" className="text-right">
                    Respiratory Rate (RR)
                  </Label>
                  <Input id="rr" type="number" placeholder="Your respiratory rate" className="col-span-3" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Diagnosis</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primary-diagnosis" className="text-right">
                    Primary
                  </Label>
                  <Textarea id="primary-diagnosis" placeholder="Primary diagnosis" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="secondary-diagnosis" className="text-right">
                    Secondary
                  </Label>
                  <Textarea id="secondary-diagnosis" placeholder="Secondary diagnosis" className="col-span-3" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>History & Physical</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chief-complaint" className="text-right">
                    Chief Complaint
                  </Label>
                  <Textarea id="chief-complaint" placeholder="Chief complaint" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hpi" className="text-right">
                    History of presenting illness
                  </Label>
                  <Textarea id="hpi" placeholder="History of presenting illness" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pe" className="text-right">
                    PE
                  </Label>
                  <Textarea id="pe" placeholder="Physical Exam" className="col-span-3" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <DialogFooter>
          <Button type="submit" onClick={() => onOpenChange(false)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
