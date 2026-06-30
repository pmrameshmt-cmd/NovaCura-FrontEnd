'use client';

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Country data ────────────────────────────────────────────────────────────
export interface Country {
    name: string;
    code: string;   // ISO 3166-1 alpha-2
    dial: string;   // e.g. "+91"
    flag: string;   // emoji flag
}

export const COUNTRIES: Country[] = [
    { name: "Afghanistan", code: "AF", dial: "+93", flag: "🇦🇫" },
    { name: "Albania", code: "AL", dial: "+355", flag: "🇦🇱" },
    { name: "Algeria", code: "DZ", dial: "+213", flag: "🇩🇿" },
    { name: "Argentina", code: "AR", dial: "+54", flag: "🇦🇷" },
    { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
    { name: "Austria", code: "AT", dial: "+43", flag: "🇦🇹" },
    { name: "Bangladesh", code: "BD", dial: "+880", flag: "🇧🇩" },
    { name: "Belgium", code: "BE", dial: "+32", flag: "🇧🇪" },
    { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
    { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
    { name: "Chile", code: "CL", dial: "+56", flag: "🇨🇱" },
    { name: "China", code: "CN", dial: "+86", flag: "🇨🇳" },
    { name: "Colombia", code: "CO", dial: "+57", flag: "🇨🇴" },
    { name: "Denmark", code: "DK", dial: "+45", flag: "🇩🇰" },
    { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
    { name: "Ethiopia", code: "ET", dial: "+251", flag: "🇪🇹" },
    { name: "Finland", code: "FI", dial: "+358", flag: "🇫🇮" },
    { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
    { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
    { name: "Ghana", code: "GH", dial: "+233", flag: "🇬🇭" },
    { name: "Greece", code: "GR", dial: "+30", flag: "🇬🇷" },
    { name: "Hong Kong", code: "HK", dial: "+852", flag: "🇭🇰" },
    { name: "Hungary", code: "HU", dial: "+36", flag: "🇭🇺" },
    { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
    { name: "Indonesia", code: "ID", dial: "+62", flag: "🇮🇩" },
    { name: "Iran", code: "IR", dial: "+98", flag: "🇮🇷" },
    { name: "Iraq", code: "IQ", dial: "+964", flag: "🇮🇶" },
    { name: "Ireland", code: "IE", dial: "+353", flag: "🇮🇪" },
    { name: "Israel", code: "IL", dial: "+972", flag: "🇮🇱" },
    { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
    { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
    { name: "Jordan", code: "JO", dial: "+962", flag: "🇯🇴" },
    { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
    { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼" },
    { name: "Lebanon", code: "LB", dial: "+961", flag: "🇱🇧" },
    { name: "Malaysia", code: "MY", dial: "+60", flag: "🇲🇾" },
    { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽" },
    { name: "Morocco", code: "MA", dial: "+212", flag: "🇲🇦" },
    { name: "Myanmar", code: "MM", dial: "+95", flag: "🇲🇲" },
    { name: "Nepal", code: "NP", dial: "+977", flag: "🇳🇵" },
    { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
    { name: "New Zealand", code: "NZ", dial: "+64", flag: "🇳🇿" },
    { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
    { name: "Norway", code: "NO", dial: "+47", flag: "🇳🇴" },
    { name: "Oman", code: "OM", dial: "+968", flag: "🇴🇲" },
    { name: "Pakistan", code: "PK", dial: "+92", flag: "🇵🇰" },
    { name: "Philippines", code: "PH", dial: "+63", flag: "🇵🇭" },
    { name: "Poland", code: "PL", dial: "+48", flag: "🇵🇱" },
    { name: "Portugal", code: "PT", dial: "+351", flag: "🇵🇹" },
    { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦" },
    { name: "Romania", code: "RO", dial: "+40", flag: "🇷🇴" },
    { name: "Russia", code: "RU", dial: "+7", flag: "🇷🇺" },
    { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
    { name: "Singapore", code: "SG", dial: "+65", flag: "🇸🇬" },
    { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
    { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
    { name: "Spain", code: "ES", dial: "+34", flag: "🇪🇸" },
    { name: "Sri Lanka", code: "LK", dial: "+94", flag: "🇱🇰" },
    { name: "Sweden", code: "SE", dial: "+46", flag: "🇸🇪" },
    { name: "Switzerland", code: "CH", dial: "+41", flag: "🇨🇭" },
    { name: "Taiwan", code: "TW", dial: "+886", flag: "🇹🇼" },
    { name: "Tanzania", code: "TZ", dial: "+255", flag: "🇹🇿" },
    { name: "Thailand", code: "TH", dial: "+66", flag: "🇹🇭" },
    { name: "Turkey", code: "TR", dial: "+90", flag: "🇹🇷" },
    { name: "Uganda", code: "UG", dial: "+256", flag: "🇺🇬" },
    { name: "Ukraine", code: "UA", dial: "+380", flag: "🇺🇦" },
    { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
    { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
    { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
    { name: "Venezuela", code: "VE", dial: "+58", flag: "🇻🇪" },
    { name: "Vietnam", code: "VN", dial: "+84", flag: "🇻🇳" },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface PhoneInputProps {
    value: string;                       // full phone number (e.g. "+91 9876543210")
    onChange: (value: string) => void;   // returns combined value
    defaultCountryCode?: string;         // ISO code, default "IN"
    placeholder?: string;
    className?: string;
}

// ─── Utils ────────────────────────────────────────────────────────────────────
const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

// ─── Component ────────────────────────────────────────────────────────────────
export function PhoneInput({
    value,
    onChange,
    defaultCountryCode = "IN",
    placeholder = "Phone number",
    className,
}: PhoneInputProps) {
    const defaultCountry =
        COUNTRIES.find((c) => c.code === defaultCountryCode) ?? COUNTRIES.find((c) => c.code === "US")!;

    const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
    const [localNumber, setLocalNumber] = useState(
        // strip dial prefix if value already contains it
        value.startsWith(selectedCountry.dial)
            ? value.slice(selectedCountry.dial.length).trim()
            : value
    );
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    // ── Sync internal state when parent value changes (e.g. draft restore) ──
    useEffect(() => {
        if (!value) {
            setLocalNumber("");
            return;
        }
        // Try to detect country from dial prefix
        const matched = COUNTRIES.find(c => value.startsWith(c.dial + ' ') || value === c.dial);
        if (matched) {
            setSelectedCountry(matched);
            setLocalNumber(value.slice(matched.dial.length).trim());
        } else {
            setLocalNumber(value);
        }
    }, [value]);  // re-run whenever parent updates value

    const filtered = useMemo(
        () =>
            COUNTRIES.filter(
                (c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.dial.includes(search) ||
                    c.code.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    );

    // Notify parent whenever country or number changes
    const notify = (country: Country, number: string) => {
        const trimmed = number.trim();
        onChange(trimmed ? `${country.dial} ${trimmed}` : "");
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setOpen(false);
        setSearch("");
        notify(country, localNumber);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // allow digits, spaces, hyphens, parentheses only
        const raw = e.target.value.replace(/[^\d\s\-()]/g, "");
        setLocalNumber(raw);
        notify(selectedCountry, raw);
    };

    return (
        <div className={cn("flex gap-2", className)}>
            {/* ── Country selector ── */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[110px] shrink-0 justify-between px-3 font-semibold bg-muted/30 border-muted"
                    >
                        <span className="flex items-center gap-2 truncate">
                            <img
                                src={getFlagUrl(selectedCountry.code)}
                                alt=""
                                className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                            />
                            <span className="text-sm font-medium text-foreground">{selectedCountry.dial}</span>
                        </span>
                        <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[280px] p-0 z-[9999]"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    // Portal renders outside ScrollArea — avoids scroll clipping
                    avoidCollisions
                >
                    {/* Search bar */}
                    <div className="flex items-center border-b px-3 py-2 gap-2">
                        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <input
                            autoFocus
                            placeholder="Search country or code…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Country list — stopPropagation prevents the parent ScrollArea from stealing wheel events */}
                    <div
                        className="h-60 overflow-y-scroll overscroll-contain"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        {filtered.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">No results found.</p>
                        ) : (
                            filtered.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className={cn(
                                        "flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                                        selectedCountry.code === country.code && "bg-accent text-accent-foreground font-medium"
                                    )}
                                >
                                    <img
                                        src={getFlagUrl(country.code)}
                                        alt=""
                                        className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0"
                                    />
                                    <span className="flex-1 text-left truncate font-medium">{country.name}</span>
                                    <span className="text-xs text-muted-foreground font-semibold shrink-0">{country.dial}</span>
                                </button>
                            ))
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* ── Phone number input ── */}
            <Input
                type="tel"
                inputMode="numeric"
                placeholder={placeholder}
                value={localNumber}
                onChange={handleNumberChange}
                className="flex-1 min-w-0 bg-muted/30 border-muted placeholder:text-muted-foreground/70"
            />
        </div>
    );
}
