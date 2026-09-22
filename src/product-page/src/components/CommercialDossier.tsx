import React, { useState, useEffect } from 'react';
import { FruitSpecimen, VarietyItem } from '../types';
import { CustomSelect } from './CustomSelect';
import {
  CheckCircle2,
  Ship,
  Warehouse,
  Thermometer,
  ShieldCheck,
  Calendar,
  Box,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  MapPin,
  Clock,
  PhoneCall,
  Check,
  Bell,
  X,
  FileText,
  AlertCircle,
  Calendar as CalendarIcon,
  Send,
} from 'lucide-react';

interface CommercialDossierProps {
  selectedFruit: FruitSpecimen;
  isDarkMode?: boolean;
}

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function CommercialDossier({
  selectedFruit,
  isDarkMode = false,
}: CommercialDossierProps) {
  const isApple = selectedFruit.id === 'apple';
  const isOrange = selectedFruit.id === 'orange';
  const isDragonFruit = selectedFruit.id === 'dragonfruit';

  const [selectedVariety, setSelectedVariety] = useState<string>(
    selectedFruit.varieties[0]?.name || ''
  );
  const [selectedCount, setSelectedCount] = useState<string>(
    selectedFruit.packingSpecs.counts[1] || selectedFruit.packingSpecs.counts[0]
  );

  // Active enquiry product tab (Slide 08: Apple, Orange, Dragon Fruit)
  const [enquiryFruit, setEnquiryFruit] = useState<'apple' | 'orange' | 'dragonfruit'>(
    selectedFruit.id as any
  );

  useEffect(() => {
    setEnquiryFruit(selectedFruit.id as any);
  }, [selectedFruit.id]);

  // Specific forms per product (Slide 08)
  const [appleForm, setAppleForm] = useState({
    name: '',
    company: '',
    phoneEmail: '',
    origin: 'Washington, USA (Wenatchee & Yakima)',
    variety: 'Royal Gala',
    count: 'Count 88',
    grade: 'Washington Extra Fancy',
    quantity: 'Full 40ft Reefer Container (FCL - ~1,180 Cartons)',
    deliveryLocation: 'Mumbai (Nhava Sheva / Vashi)',
    requiredDate: '',
  });

  const [orangeForm, setOrangeForm] = useState({
    name: '',
    company: '',
    phoneEmail: '',
    origin: 'Egypt (Nile Delta)',
    variety: 'Valencia Late',
    count: 'Count 64',
    grade: 'Export Class 1 Premium',
    quantity: 'Full 40ft Reefer Container (1,600 Cartons of 15kg)',
    deliveryLocation: 'Mumbai (Nhava Sheva / Vashi)',
    requiredDate: '',
  });

  const [dragonForm, setDragonForm] = useState({
    name: '',
    company: '',
    phoneEmail: '',
    type: 'White Flesh Pitaya (Snow White)',
    origin: 'Binh Thuan Province, Vietnam',
    packSize: 'NEW 9.0kg FRU FRESH Carton',
    quantity: 'Full 40ft Reefer Container (~2,000 Cartons)',
    destination: 'Chennai Port (10-Day Direct Sea Transit)',
    requiredDate: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState<any>(null);

  // Notification Modal state for Slide 09 "GET NOTIFIED"
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyTargetFruit, setNotifyTargetFruit] = useState('All Upcoming Arrivals');
  const [notifyContact, setNotifyContact] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const handleAppleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedDetails({ fruit: 'Apples', ...appleForm });
    setIsSubmitted(true);
  };

  const handleOrangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedDetails({ fruit: 'Oranges', ...orangeForm });
    setIsSubmitted(true);
  };

  const handleDragonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedDetails({ fruit: 'Dragon Fruit', ...dragonForm });
    setIsSubmitted(true);
  };

  // Color accent styles per fruit
  const accentColor = isApple ? '#8e1d24' : isOrange ? '#c2410c' : '#be185d';
  const accentLight = isApple ? '#fef2f2' : isOrange ? '#fff7ed' : '#fdf2f8';

  return (
    <section id="commercial-dossier" className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 select-none">
      {/* SECTION HEADER & BRAND POSITIONING (Slide 01 & 02) */}
      <div className="border-b border-black/10 pb-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-semibold text-black/60">
              COMMERCIAL ARCHITECTURE & SPECIFICATIONS
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-black/40">
            FRU FRESH DIRECT ALLOCATION • 2026/27
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline">
          <h2 className="lg:col-span-8 font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] font-normal leading-tight">
            {selectedFruit.name}: Sourcing Strength, Knowledge & Quality Standards.
          </h2>
          <p className="lg:col-span-4 font-sans text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed">
            Origins, varieties, counts and cold-chain protocol — the specification
            a buyer needs before placing an allocation.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 02 ORIGIN & JOURNEY (Slide 02, 03, 04, 05) */}
      {/* ========================================================================= */}
      <div id="section-origin" className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ ORIGIN ]</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A]">Where It Comes From & The Journey To India</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Growing regions & packhouse standards */}
          <div className="lg:col-span-6 rounded-2xl border border-black/10 bg-transparent p-6 sm:p-7 space-y-5">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block mb-1">
                AUTHENTIC GROWING REGIONS
              </span>
              <ul className="space-y-2 font-sans text-sm text-[#1A1A1A]">
                {selectedFruit.originStory.growingRegions.map((region, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-black/40" />
                    <span>{region}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-black/10 pt-4 space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                PACKHOUSE SOURCING & POST-HARVEST PROTOCOL
              </span>
              <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                {selectedFruit.originStory.packhouse}
              </p>
            </div>
          </div>

          {/* Right: Sea Freight Transit & Cold Chain into India */}
          <div className="lg:col-span-6 rounded-2xl border border-black/10 bg-transparent p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                ORIGIN → INDIA TEMPERATURE-CONTROLLED PIPELINE
              </span>

              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-black/20">
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  <div className="font-mono text-[10px] font-bold text-black/50 uppercase">Stage 1 • Orchard Pre-Cooling</div>
                  <div className="font-sans text-xs text-[#1A1A1A]/90 font-medium">Hydro-cooling down to pulp target within 4–6 hours of picking.</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
                  <div className="font-mono text-[10px] font-bold text-black/50 uppercase">Stage 2 • Controlled Atmosphere Reefer</div>
                  <div className="font-sans text-xs text-[#1A1A1A]/90 font-medium">{selectedFruit.qualityGuide.coldChainTemp} continuous recording.</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  <div className="font-mono text-[10px] font-bold text-black/50 uppercase">Stage 3 • Indian Port Clearance</div>
                  <div className="font-sans text-xs text-[#1A1A1A]/90 font-medium">Direct dock clearance at Nhava Sheva (JNPT), Mundra & Chennai Port.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono text-black/60">
              <span>ESTIMATED MARITIME TRANSIT</span>
              <span className="font-bold text-[#1A1A1A]">
                {isApple ? '22 – 38 Days (Pacific/Atlantic)' : isOrange ? '14 – 24 Days (Med/Africa)' : '10 – 12 Days (Direct Vietnam)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 03 VARIETIES (Slide 02, 03, 04, 05) - MOBILE TOUCH-SWIPE CAROUSEL */}
      {/* ========================================================================= */}
      <div id="section-varieties" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ VARIETIES ]</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A]">Commercial Varieties Handled by FRU FRESH</h3>
          </div>
          <span className="font-mono text-xs text-black/50 hidden sm:inline-block">
            SWIPE OR SELECT TO CONFIGURE ALLOCATION
          </span>
        </div>

        {/* Mobile: Horizontal Snap Scroll | Desktop: Responsive Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 scrollbar-none">
          {selectedFruit.varieties.map((item: VarietyItem) => {
            const isSelected = selectedVariety === item.name;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedVariety(item.name)}
                className={`snap-center min-w-[280px] sm:min-w-0 rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${isSelected
                    ? 'bg-black/[0.03] ring-1'
                    : 'bg-transparent hover:bg-black/[0.015] border-black/10'
                  }`}
                style={{
                  borderColor: isSelected ? accentColor : 'rgba(0,0,0,0.1)',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider"
                      style={{ backgroundColor: accentLight, color: accentColor }}
                    >
                      {item.badge || item.grade}
                    </span>
                    <span className="font-mono text-xs font-bold text-black/60">{item.brix}</span>
                  </div>

                  <h4 className="font-serif text-2xl text-[#1A1A1A]">{item.name}</h4>
                  <p className="font-sans text-xs text-[#1A1A1A]/80 leading-relaxed">{item.notes}</p>

                  <div className="pt-3 border-t border-black/10 space-y-1.5 font-mono text-[10px] text-black/60">
                    <div>
                      <span className="text-black/40">WINDOW: </span>
                      <span className="text-black/80 font-medium">{item.harvestWindow}</span>
                    </div>
                    <div>
                      <span className="text-black/40">IDEAL FOR: </span>
                      <span className="text-black/80 font-medium">{item.bestFor}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-black/50">
                    {isSelected ? 'SELECTED FOR ENQUIRY' : 'TAP TO SELECT'}
                  </span>
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: isSelected ? accentColor : '#9ca3af' }}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : '+'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 04 TASTE & SENSORY ARCHITECTURE (Slide 02, 03, 04, 05) */}
      {/* ========================================================================= */}
      <div id="section-taste" className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ TASTE ]</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A]">Sensory Architecture & Flavour Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Star rating meters */}
          <div className="lg:col-span-7 rounded-2xl border border-black/10 bg-transparent p-6 sm:p-7 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
              Sensory profile — calibrated 1 to 5
            </span>

            <div className="space-y-3">
              {[
                { label: 'Sweetness / Sucrose Density', val: selectedFruit.sensoryRatings.sweetness },
                { label: 'Crispness / Acoustic Cell Snap', val: selectedFruit.sensoryRatings.crispness },
                { label: 'Juiciness / Vesicle Liquid Ratio', val: selectedFruit.sensoryRatings.juiciness },
                { label: 'Acidity / Malic-Citric Balance', val: selectedFruit.sensoryRatings.acidity },
                { label: 'Aroma Index / Essential Terpenes', val: selectedFruit.sensoryRatings.aroma },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#1A1A1A] font-medium">{m.label}</span>
                    {/* The bar below already carries the value, and the
                        figure states it exactly — a row of stars was a third
                        reading of the same number, in an amber that appears
                        nowhere else in the palette. */}
                    <span className="font-bold text-[#1A1A1A]">{m.val}/5</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(m.val / 5) * 100}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Descriptive Tasting Notes */}
          <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-transparent p-6 sm:p-7 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                ORGANOLEPTIC CHARACTER
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedFruit.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full border border-black/10 bg-black/[0.02] font-sans text-xs text-[#1A1A1A] font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed pt-2">
                {selectedFruit.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-50/30 space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-amber-800 uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>B2B Market Acceptance</span>
              </div>
              <p className="font-sans text-xs text-amber-900/80 leading-normal">
                Approved by top Indian supermarket chains, five-star luxury hotels, and export juice extractors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 07 — SEASONALITY SHOULD BE VISUAL (Slide 07)                              */}
      {/* ========================================================================= */}
      <div id="section-season" className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ SEASONALITY ]</span>
            <span className="font-mono text-[10px] text-black/40 uppercase tracking-wider">Origin-by-Origin Calendar</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">Availability Through the Year</h3>
          <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/70">
            When each origin is in season, so a buyer can plan cover across the calendar.
          </p>
        </div>

        {/* The calendar alone. It used to sit beside a "why it matters"
            card explaining the chart to the reader, which is brief copy
            rather than anything a buyer needs — a seasonality grid reads
            itself. Full width now that it is not sharing the row. */}
        <div>
          <div className="rounded-3xl border-2 border-[#8e1d24]/30 bg-white/70 backdrop-blur-sm p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10">
                <span className="font-mono text-xs font-bold text-[#8e1d24] uppercase tracking-widest">
                  {selectedFruit.name} — Origin Availability
                </span>
              </div>

              {/* Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-black/60 text-[10px] uppercase">
                      <th className="py-2.5 pr-4 font-bold tracking-wider">ORIGIN</th>
                      {MONTH_NAMES.map((m) => (
                        <th key={m} className="py-2.5 px-1.5 text-center font-bold">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-[11px]">
                    {selectedFruit.seasonality.map((s, idx) => (
                      <tr key={idx} className="hover:bg-black/[0.02] transition-colors">
                        <td className="py-3 pr-4 font-bold text-[#1A1A1A] whitespace-nowrap">
                          {s.country.toUpperCase()}
                        </td>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                          const isActive = s.activeMonths.includes(m);
                          return (
                            <td key={m} className="py-3 px-1.5 text-center">
                              {isActive ? (
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                              ) : (
                                <span className="text-black/30 font-medium">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matrix Legend & Callout */}
            <div className="pt-4 border-t border-black/10 space-y-1 font-mono text-[10px] text-black/70">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#1A1A1A]" />
                <span className="font-semibold">= typical availability</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[#8e1d24] font-bold pt-1">
                FINAL MONTHS MUST MATCH FRU FRESH&apos;S REAL SOURCING
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 06 QUALITY STANDARDS (Slide 02, 03, 04, 05) */}
      {/* ========================================================================= */}
      <div id="section-quality" className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ QUALITY ]</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A]">Inspection Parameters & Quality Protocol</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedFruit.qualityGuide.parameters.map((param, idx) => (
            <div key={idx} className="rounded-2xl border border-black/10 bg-transparent p-5 space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/40 block">PARAMETER 0{idx + 1}</span>
              <div className="font-mono text-xs font-bold text-[#1A1A1A]">{param.label}</div>
              <div className="font-serif text-xl font-normal" style={{ color: accentColor }}>{param.value}</div>
              <p className="font-sans text-[11px] text-[#1A1A1A]/70 leading-relaxed pt-1">{param.desc}</p>
            </div>
          ))}
        </div>

        {/* Cold chain & appearance standards strip */}
        <div className="rounded-2xl border border-black/10 bg-transparent p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-start gap-3">
            <Thermometer className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] uppercase font-bold text-black/50">COLD CHAIN REQUIREMENT</div>
              <div className="font-sans text-xs text-[#1A1A1A] font-medium mt-0.5">{selectedFruit.qualityGuide.coldChainTemp}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] uppercase font-bold text-black/50">PORT ARRIVAL SPEC</div>
              <div className="font-sans text-xs text-[#1A1A1A] font-medium mt-0.5">{selectedFruit.qualityGuide.firmnessSpec}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] uppercase font-bold text-black/50">COSMETIC INTEGRITY</div>
              <div className="font-sans text-xs text-[#1A1A1A] font-medium mt-0.5">{selectedFruit.qualityGuide.appearanceCheck}</div>
            </div>
          </div>
        </div>

        {/* DRAGON FRUIT SPECIAL: Ripeness Scale (Slide 05) */}
        {isDragonFruit && selectedFruit.qualityGuide.ripenessStages && (
          <div className="rounded-2xl border border-pink-200 bg-pink-50/20 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-pink-800 tracking-wider">
                DRAGON FRUIT RIPENESS SCALE: EARLY → READY → PEAK
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white font-mono text-[9px] uppercase font-bold">
                Vietnam Standard
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedFruit.qualityGuide.ripenessStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${stage.optimal ? 'border-pink-500/40 bg-pink-500/10 ring-1 ring-pink-500/20' : 'border-black/10 bg-transparent'
                    } space-y-1.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-bold text-black/50 uppercase">{stage.stage}</span>
                    {stage.optimal && (
                      <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono text-[8px] font-bold">
                        OPTIMAL RETAIL
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-base text-[#1A1A1A] font-medium">{stage.label}</div>
                  <p className="font-sans text-[11px] text-[#1A1A1A]/70 leading-normal">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 07 PACKING & COMMERCIAL SPECS (Slide 02, 03, 04, 05) */}
      {/* ========================================================================= */}
      <div id="section-packing" className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ PACKING ]</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A]">Packing Formats, Count Sizes & Palletization</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formats & Carton detail */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-black/10 bg-transparent p-6 space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                STANDARD EXPORT CARTON FORMATS
              </span>

              <div className="space-y-4">
                {selectedFruit.packingSpecs.formats.map((fmt, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-black/10 bg-black/[0.015] space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-serif text-lg text-[#1A1A1A]">{fmt.name}</h4>
                      <span className="font-mono text-xs font-bold text-[#8e1d24] bg-red-50 px-2.5 py-0.5 rounded-full">
                        {fmt.netWeight}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#1A1A1A]/80 leading-normal">{fmt.desc}</p>
                    <div className="font-mono text-[10px] text-black/50 pt-1">SPECS: {fmt.specs}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vietnam Carton Special Feature (Slide 05) */}
            {isDragonFruit && selectedFruit.packingSpecs.featuredCarton && (
              <div className="rounded-2xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-50/50 to-transparent p-6 space-y-3">
                <div className="flex items-center gap-2 text-pink-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Box className="w-4 h-4" />
                  <span>FEATURED PACKAGING INNOVATION</span>
                </div>
                <h4 className="font-serif text-2xl text-[#1A1A1A]">
                  {selectedFruit.packingSpecs.featuredCarton.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed">
                  {selectedFruit.packingSpecs.featuredCarton.desc}
                </p>
                <div className="inline-block font-mono text-xs font-bold px-3 py-1 rounded-full bg-pink-600 text-white shadow-sm">
                  {selectedFruit.packingSpecs.featuredCarton.highlight}
                </div>
              </div>
            )}
          </div>

          {/* Counts & Pallet matrix */}
          <div className="lg:col-span-5 rounded-2xl border border-black/10 bg-transparent p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                COMMERCIAL COUNT & CALIBER AVAILABILITY
              </span>

              <div className="flex flex-wrap gap-2">
                {selectedFruit.packingSpecs.counts.map((cnt) => {
                  const isCntSelected = selectedCount === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSelectedCount(cnt)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-medium cursor-pointer transition-all ${isCntSelected
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                          : 'bg-white text-black/70 border-black/10 hover:border-black/30'
                        }`}
                    >
                      {cnt}
                    </button>
                  );
                })}
              </div>
              <p className="font-sans text-[11px] text-black/50">
                Tap a count size to pre-fill your B2B allocation inquiry.
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                FULL CONTAINER LOAD (FCL) PALLET MATRIX
              </span>
              <div className="p-3.5 rounded-xl border border-black/10 bg-white font-mono text-xs text-[#1A1A1A]">
                {selectedFruit.packingSpecs.palletCapacity}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 09 — ADD "NOW AVAILABLE" + "COMING SOON" (Slide 09)                       */}
      {/* ========================================================================= */}
      <div id="section-availability" className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ AVAILABILITY ]</span>
            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
              ● UPDATED THIS SEASON
            </span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">Current & Incoming Sourcing</h3>
          <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/70">
            What is in cold store now, and what lands next.
          </p>
        </div>

        {/* Dual prominent cards matching Slide 09 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: NOW AVAILABLE */}
          <div className="rounded-3xl border-2 border-[#8e1d24]/35 bg-white/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <h4 className="font-mono text-xs font-bold text-[#8e1d24] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8e1d24] animate-pulse" />
                  NOW AVAILABLE
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-black/50">Cold Store Ready</span>
              </div>

              <div className="space-y-3.5">
                {/* Himachal Apples */}
                <div className="p-4 rounded-2xl border border-black/10 bg-black/[0.02] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[#1A1A1A]">HIMACHAL APPLES</span>
                    </div>
                    <p className="font-mono text-[10px] text-black/60">Kinnaur & Shimla High-Altitude Crisp Harvest</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0">
                    NOW AVAILABLE
                  </span>
                </div>

                {/* Vietnam Dragon Fruit */}
                <div className="p-4 rounded-2xl border border-black/10 bg-black/[0.02] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[#1A1A1A]">VIETNAM DRAGON FRUIT</span>
                    </div>
                    <p className="font-mono text-[10px] text-black/60">Binh Thuan & Long An 4.5kg / 9kg Cartons</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0">
                    CURRENT SEASON
                  </span>
                </div>

                {/* Current Orange */}
                <div className="p-4 rounded-2xl border border-black/10 bg-black/[0.02] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[#1A1A1A]">SOUTH AFRICAN / EGYPTIAN VALENCIA</span>
                    </div>
                    <p className="font-mono text-[10px] text-black/60">High Juice Yield 52% • Counts 64 / 72 / 88</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-mono text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0">
                    AVAILABLE NOW
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('section-enquire');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-[0.16em] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md hover:opacity-95 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <span>ENQUIRE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Card: COMING SOON */}
          <div className="rounded-3xl border-2 border-emerald-700/35 bg-[#fbfdfb] backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <h4 className="font-mono text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  COMING SOON
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-black/50">Maritime In-Transit</span>
              </div>

              <div className="space-y-3.5">
                {/* Washington Gala & Fuji */}
                <div className="p-4 rounded-2xl border border-black/10 bg-white/70 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[#1A1A1A]">USA WASHINGTON GALA & FUJI</span>
                    </div>
                    <p className="font-mono text-[10px] text-black/60">Vessel MSC Alizee • ETA 6 Days to Nhava Sheva</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-mono text-[9px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider shrink-0">
                    ARRIVING SOON
                  </span>
                </div>

                {/* Australian Navel & Midknight */}
                <div className="p-4 rounded-2xl border border-black/10 bg-white/70 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[#1A1A1A]">AUSTRALIAN NAVEL & MIDKNIGHT</span>
                    </div>
                    <p className="font-mono text-[10px] text-black/60">Vessel CMA CGM Mozart • Pre-Booking Open</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-mono text-[9px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider shrink-0">
                    NEXT SHIPMENT
                  </span>
                </div>

                {/* Vietnam Red Dragon Fruit */}
                <div className="p-4 rounded-2xl border border-black/10 bg-white/70 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-medium text-[#1A1A1A]">VIETNAM RUBY RED DRAGON FRUIT</span>
                    </div>
                    <p className="font-mono text-[10px] text-black/60">Binh Thuan High-Betacyanin Export Batches</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-mono text-[9px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider shrink-0">
                    UPCOMING
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setNotifySubmitted(false);
                setIsNotifyModalOpen(true);
              }}
              className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1A1A1A] bg-white border border-black/20 hover:bg-black hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-700" />
              <span>GET NOTIFIED</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warning Note */}
        <div className="text-center font-mono text-xs font-bold text-[#8e1d24]">
          Only show live information that the commercial team can maintain.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 08 — EVERY PRODUCT NEEDS A B2B ENQUIRY PATH (Slide 08)                    */}
      {/* ========================================================================= */}
      <div id="section-enquire" className="rounded-3xl border border-black/15 bg-white/95 p-6 sm:p-10 shadow-xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#8e1d24] uppercase tracking-widest">[ ENQUIRY ]</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[9px] font-bold uppercase">
                Auto-Attached Product Route
              </span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
              Enquire
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/70">
              Your selection is attached to the enquiry automatically.
            </p>
          </div>
        </div>

        {/* Segmented Product Switcher matching Slide 08 */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/[0.04] rounded-2xl border border-black/5">
          <button
            type="button"
            onClick={() => {
              setEnquiryFruit('apple');
              setIsSubmitted(false);
            }}
            className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              enquiryFruit === 'apple'
                ? 'bg-[#8e1d24] text-white shadow-md'
                : 'text-black/60 hover:text-black hover:bg-black/[0.02]'
            }`}
          >
            <span>APPLE ENQUIRY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEnquiryFruit('orange');
              setIsSubmitted(false);
            }}
            className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              enquiryFruit === 'orange'
                ? 'bg-[#c2410c] text-white shadow-md'
                : 'text-black/60 hover:text-black hover:bg-black/[0.02]'
            }`}
          >
            <span>ORANGE ENQUIRY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEnquiryFruit('dragonfruit');
              setIsSubmitted(false);
            }}
            className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              enquiryFruit === 'dragonfruit'
                ? 'bg-[#be185d] text-white shadow-md'
                : 'text-black/60 hover:text-black hover:bg-black/[0.02]'
            }`}
          >
            <span>DRAGON FRUIT</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-4 bg-emerald-50/70 rounded-2xl border border-emerald-300 p-8 animate-in fade-in duration-300">
            <div className="inline-flex p-3 rounded-full bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-3xl text-[#1A1A1A]">Commercial Enquiry Dispatched</h4>
            <div className="max-w-lg mx-auto bg-white p-5 rounded-2xl border border-emerald-200 text-left space-y-2 font-mono text-xs text-black/80">
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span className="text-black/40 uppercase">Product:</span>
                <span className="font-bold text-[#1A1A1A]">{submittedDetails?.fruit}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span className="text-black/40 uppercase">Representative:</span>
                <span className="font-bold text-[#1A1A1A]">{submittedDetails?.name} ({submittedDetails?.company})</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span className="text-black/40 uppercase">Specification:</span>
                <span className="font-bold text-[#1A1A1A]">{submittedDetails?.variety || submittedDetails?.type} • {submittedDetails?.count || submittedDetails?.packSize}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span className="text-black/40 uppercase">Volume & Destination:</span>
                <span className="font-bold text-[#1A1A1A]">{submittedDetails?.quantity} → {submittedDetails?.deliveryLocation || submittedDetails?.destination}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-black/40 uppercase">Required Date:</span>
                <span className="font-bold text-emerald-700">{submittedDetails?.requiredDate || 'Immediate Dispatch'}</span>
              </div>
            </div>
            <p className="font-sans text-xs text-black/60 max-w-md mx-auto">
              Our commercial allocation desk will review vessel manifests and confirm booking allocations within 2 hours.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="fr-btn mt-2"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <div>
            {/* 1. APPLE ENQUIRY FORM */}
            {enquiryFruit === 'apple' && (
              <form onSubmit={handleAppleSubmit} className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Name *</label>
                    <input
                      type="text"
                      required
                      value={appleForm.name}
                      onChange={(e) => setAppleForm({ ...appleForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8e1d24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Company *</label>
                    <input
                      type="text"
                      required
                      value={appleForm.company}
                      onChange={(e) => setAppleForm({ ...appleForm, company: e.target.value })}
                      placeholder="e.g. Patel Fresh Imports Pvt Ltd"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8e1d24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Phone / Email *</label>
                    <input
                      type="text"
                      required
                      value={appleForm.phoneEmail}
                      onChange={(e) => setAppleForm({ ...appleForm, phoneEmail: e.target.value })}
                      placeholder="+91 98765 43210 / buyer@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8e1d24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Origin</label>
                    <CustomSelect
                      value={appleForm.origin}
                      onChange={(val) => setAppleForm({ ...appleForm, origin: val })}
                      accentColor="#8e1d24"
                      options={[
                        'Washington, USA (Wenatchee & Yakima)',
                        'Curicó Valley, Chile',
                        "Hawke's Bay, New Zealand",
                        'South Tyrol, Northern Italy',
                        'Ceres Valley, South Africa',
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Variety</label>
                    <CustomSelect
                      value={appleForm.variety}
                      onChange={(val) => setAppleForm({ ...appleForm, variety: val })}
                      accentColor="#8e1d24"
                      options={[
                        { value: 'Royal Gala', label: 'Royal Gala (High Volume Mover)' },
                        { value: 'Red Fuji', label: 'Red Fuji (Highest Brix 16°+)' },
                        { value: 'Granny Smith', label: 'Granny Smith (Tart & Firm Crunch)' },
                        { value: 'Pink Lady', label: 'Pink Lady / Cripps Pink (Gourmet Benchmark)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Count</label>
                    <CustomSelect
                      value={appleForm.count}
                      onChange={(val) => setAppleForm({ ...appleForm, count: val })}
                      accentColor="#8e1d24"
                      options={[
                        { value: 'Count 80', label: 'Count 80 (Extra Large)' },
                        { value: 'Count 88', label: 'Count 88 (Large Benchmark)' },
                        { value: 'Count 100', label: 'Count 100 (Medium-Large)' },
                        { value: 'Count 113', label: 'Count 113 (Standard Retail)' },
                        { value: 'Count 125', label: 'Count 125 (Medium)' },
                        { value: 'Count 138', label: 'Count 138 (Small-Medium)' },
                        { value: 'Count 150', label: 'Count 150 (Compact)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Grade</label>
                    <CustomSelect
                      value={appleForm.grade}
                      onChange={(val) => setAppleForm({ ...appleForm, grade: val })}
                      accentColor="#8e1d24"
                      options={[
                        { value: 'Washington Extra Fancy', label: 'Washington Extra Fancy (Top 5% Blush)' },
                        { value: 'Chilean Export Standard', label: 'Chilean Export Standard' },
                        { value: 'New Zealand Class 1', label: 'New Zealand Class 1 Premium' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Quantity</label>
                    <CustomSelect
                      value={appleForm.quantity}
                      onChange={(val) => setAppleForm({ ...appleForm, quantity: val })}
                      accentColor="#8e1d24"
                      options={[
                        { value: 'Full 40ft Reefer Container (FCL)', label: 'Full 40ft Reefer Container (FCL - ~1,180 Cartons)' },
                        { value: 'Multi-Pallet Allocation (LCL)', label: 'Multi-Pallet Allocation (2 to 10 Pallets)' },
                        { value: 'Trial Sample Consignment', label: 'Trial Sample Consignment (1 Pallet)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Delivery Location</label>
                    <CustomSelect
                      value={appleForm.deliveryLocation}
                      onChange={(val) => setAppleForm({ ...appleForm, deliveryLocation: val })}
                      accentColor="#8e1d24"
                      options={[
                        { value: 'Mumbai (Nhava Sheva / Vashi)', label: 'Mumbai (Nhava Sheva / Vashi Cold Storage)' },
                        { value: 'Delhi NCR (Azadpur / Kundli)', label: 'Delhi NCR (Azadpur Terminal / Kundli Hub)' },
                        { value: 'Chennai (Chennai Port)', label: 'Chennai (Chennai Port / Koyambedu)' },
                        { value: 'Bengaluru (Yeshwanthpur)', label: 'Bengaluru (Yeshwanthpur / Hoskote)' },
                        { value: 'Hyderabad (Gaddi Annaram)', label: 'Hyderabad (Gaddi Annaram Terminal)' },
                        { value: 'Mundra Port (Gujarat)', label: 'Mundra Port (Gujarat Clearance)' },
                      ]}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#8e1d24]" />
                      <span>Required Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={appleForm.requiredDate}
                      onChange={(e) => setAppleForm({ ...appleForm, requiredDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#8e1d24] cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-[#8e1d24] hover:bg-[#72171c]"
                >
                  <span>REQUEST AVAILABILITY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. ORANGE ENQUIRY FORM */}
            {enquiryFruit === 'orange' && (
              <form onSubmit={handleOrangeSubmit} className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Name *</label>
                    <input
                      type="text"
                      required
                      value={orangeForm.name}
                      onChange={(e) => setOrangeForm({ ...orangeForm, name: e.target.value })}
                      placeholder="e.g. Anand Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Company *</label>
                    <input
                      type="text"
                      required
                      value={orangeForm.company}
                      onChange={(e) => setOrangeForm({ ...orangeForm, company: e.target.value })}
                      placeholder="e.g. Apex Citrus Wholesale"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Phone / Email *</label>
                    <input
                      type="text"
                      required
                      value={orangeForm.phoneEmail}
                      onChange={(e) => setOrangeForm({ ...orangeForm, phoneEmail: e.target.value })}
                      placeholder="+91 98111 22334 / citrus@apex.com"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Origin</label>
                    <CustomSelect
                      value={orangeForm.origin}
                      onChange={(val) => setOrangeForm({ ...orangeForm, origin: val })}
                      accentColor="#c2410c"
                      options={[
                        'Egypt (Nile Delta & Desert Road)',
                        'South Africa (Western & Eastern Cape)',
                        'Spain (Valencia & Seville)',
                        'Australia (Riverina & Murray Valley)',
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Variety</label>
                    <CustomSelect
                      value={orangeForm.variety}
                      onChange={(val) => setOrangeForm({ ...orangeForm, variety: val })}
                      accentColor="#c2410c"
                      options={[
                        { value: 'Valencia Late', label: 'Valencia Late (Maximum 52% Juice Yield)' },
                        { value: 'Washington Navel', label: 'Washington Navel (Premier Seedless Table)' },
                        { value: 'Murcott Mandarin', label: 'Murcott / Afourer Mandarin (Easy-Peel)' },
                        { value: 'Cara Cara Navel', label: 'Cara Cara Navel (Ruby Lycopene Flesh)' },
                        { value: 'Clementine', label: 'Clementine (Seedless Grab-and-Go)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Count</label>
                    <CustomSelect
                      value={orangeForm.count}
                      onChange={(val) => setOrangeForm({ ...orangeForm, count: val })}
                      accentColor="#c2410c"
                      options={[
                        { value: 'Count 48', label: 'Count 48 (Jumbo Table)' },
                        { value: 'Count 56', label: 'Count 56 (Extra Large)' },
                        { value: 'Count 64', label: 'Count 64 (Large Juicing/Table)' },
                        { value: 'Count 72', label: 'Count 72 (Standard Retail)' },
                        { value: 'Count 80', label: 'Count 80 (Commercial Juicing)' },
                        { value: 'Count 88', label: 'Count 88 (Medium)' },
                        { value: 'Count 100', label: 'Count 100 (Compact Easy-Peel)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Grade</label>
                    <CustomSelect
                      value={orangeForm.grade}
                      onChange={(val) => setOrangeForm({ ...orangeForm, grade: val })}
                      accentColor="#c2410c"
                      options={[
                        { value: 'Export Class 1 Premium', label: 'Export Class 1 Premium' },
                        { value: 'Choice Table Citrus', label: 'Choice Table Citrus' },
                        { value: 'Commercial Juicing Grade A', label: 'Commercial Juicing Grade A' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Quantity</label>
                    <CustomSelect
                      value={orangeForm.quantity}
                      onChange={(val) => setOrangeForm({ ...orangeForm, quantity: val })}
                      accentColor="#c2410c"
                      options={[
                        { value: 'Full 40ft Reefer Container (FCL)', label: 'Full 40ft Reefer Container (1,600 Cartons of 15kg)' },
                        { value: 'Multi-Pallet Allocation (LCL)', label: 'Multi-Pallet Allocation (2 to 10 Pallets)' },
                        { value: 'Trial Sample Consignment', label: 'Trial Sample Consignment (1 Pallet)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Delivery Location</label>
                    <CustomSelect
                      value={orangeForm.deliveryLocation}
                      onChange={(val) => setOrangeForm({ ...orangeForm, deliveryLocation: val })}
                      accentColor="#c2410c"
                      options={[
                        { value: 'Mumbai (Nhava Sheva / Vashi)', label: 'Mumbai (Nhava Sheva / Vashi Cold Storage)' },
                        { value: 'Delhi NCR (Azadpur / Kundli)', label: 'Delhi NCR (Azadpur Terminal / Kundli Hub)' },
                        { value: 'Chennai (Chennai Port)', label: 'Chennai (Chennai Port / Koyambedu)' },
                        { value: 'Bengaluru (Yeshwanthpur)', label: 'Bengaluru (Yeshwanthpur / Hoskote)' },
                        { value: 'Hyderabad (Gaddi Annaram)', label: 'Hyderabad (Gaddi Annaram Terminal)' },
                        { value: 'Mundra Port (Gujarat)', label: 'Mundra Port (Gujarat Clearance)' },
                      ]}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span>Required Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={orangeForm.requiredDate}
                      onChange={(e) => setOrangeForm({ ...orangeForm, requiredDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c] cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-[#c2410c] hover:bg-[#9a3412]"
                >
                  <span>REQUEST AVAILABILITY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. DRAGON FRUIT ENQUIRY FORM */}
            {enquiryFruit === 'dragonfruit' && (
              <form onSubmit={handleDragonSubmit} className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Name *</label>
                    <input
                      type="text"
                      required
                      value={dragonForm.name}
                      onChange={(e) => setDragonForm({ ...dragonForm, name: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#be185d]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Company *</label>
                    <input
                      type="text"
                      required
                      value={dragonForm.company}
                      onChange={(e) => setDragonForm({ ...dragonForm, company: e.target.value })}
                      placeholder="e.g. Exotic Fruit Logistics India"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#be185d]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Phone / Email *</label>
                    <input
                      type="text"
                      required
                      value={dragonForm.phoneEmail}
                      onChange={(e) => setDragonForm({ ...dragonForm, phoneEmail: e.target.value })}
                      placeholder="+91 99000 88776 / procurement@exotics.com"
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#be185d]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Type</label>
                    <CustomSelect
                      value={dragonForm.type}
                      onChange={(val) => setDragonForm({ ...dragonForm, type: val })}
                      accentColor="#be185d"
                      options={[
                        { value: 'White Flesh Pitaya (Snow White)', label: 'White Flesh Pitaya (Snow White • Crisp Seeds)' },
                        { value: 'Red / Magenta Flesh Pitaya (Ruby)', label: 'Red / Magenta Flesh Pitaya (Ruby Betacyanin)' },
                        { value: 'Yellow Dragon Fruit (Palora)', label: 'Yellow Dragon Fruit (Palora • Ultra Sweet 18° Brix)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Origin</label>
                    <CustomSelect
                      value={dragonForm.origin}
                      onChange={(val) => setDragonForm({ ...dragonForm, origin: val })}
                      accentColor="#be185d"
                      options={[
                        { value: 'Binh Thuan Province, Vietnam', label: 'Binh Thuan Province, Vietnam (Capital of Pitaya)' },
                        { value: 'Long An Province, Vietnam', label: 'Long An Province, Vietnam' },
                        { value: 'Tien Giang (Mekong Delta), Vietnam', label: 'Tien Giang (Mekong Delta), Vietnam' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Pack size</label>
                    <CustomSelect
                      value={dragonForm.packSize}
                      onChange={(val) => setDragonForm({ ...dragonForm, packSize: val })}
                      accentColor="#be185d"
                      options={[
                        { value: 'NEW 9.0kg FRU FRESH Carton', label: 'NEW 9.0kg FRU FRESH Vietnam Branded Carton' },
                        { value: '4.0kg Luxury Presentation Gift Box', label: '4.0kg Luxury Presentation Gift Box' },
                        { value: '18.0kg Bulk Reefer Bin', label: '18.0kg Bulk Reefer Bin' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Quantity</label>
                    <CustomSelect
                      value={dragonForm.quantity}
                      onChange={(val) => setDragonForm({ ...dragonForm, quantity: val })}
                      accentColor="#be185d"
                      options={[
                        { value: 'Full 40ft Reefer Container (~2,000 Cartons)', label: 'Full 40ft Reefer Container (~2,000 Cartons)' },
                        { value: 'Direct Air Cargo Pallet (500kg Fast Link)', label: 'Direct Air Cargo Pallet (500kg Fast Link)' },
                        { value: 'Trial Assessment Pallet', label: 'Trial Assessment Pallet (1 Pallet / ~100 Cartons)' },
                      ]}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70">Destination</label>
                    <CustomSelect
                      value={dragonForm.destination}
                      onChange={(val) => setDragonForm({ ...dragonForm, destination: val })}
                      accentColor="#be185d"
                      options={[
                        { value: 'Chennai Port (10-Day Direct Sea Transit)', label: 'Chennai Port (10-Day Direct Sea Transit)' },
                        { value: 'Mumbai (Nhava Sheva / Vashi)', label: 'Mumbai (Nhava Sheva / Vashi Cold Storage)' },
                        { value: 'Bengaluru (Cold Chain Terminal)', label: 'Bengaluru (Cold Chain Terminal)' },
                        { value: 'Delhi NCR Air Cargo Terminal', label: 'Delhi NCR Air Cargo Terminal' },
                      ]}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                    <label className="font-mono text-[11px] uppercase font-bold text-black/70 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#be185d]" />
                      <span>Required Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dragonForm.requiredDate}
                      onChange={(e) => setDragonForm({ ...dragonForm, requiredDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#be185d] cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-white font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-[#be185d] hover:bg-[#9d174d]"
                >
                  <span>REQUEST AVAILABILITY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Notice matching Slide 08 */}
        <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-black/60">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>The form sends the enquiry to the FRU FRESH sales team with the product and page automatically attached.</span>
          </div>
          <span className="text-black/40 uppercase">Direct B2B Sales Protocol</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GET NOTIFIED MODAL (Slide 09 Interactive Feature)                         */}
      {/* ========================================================================= */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-black/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h4 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  VESSEL INFLOW ALERTS
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsNotifyModalOpen(false)}
                className="p-1 rounded-full text-black/40 hover:text-black transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifySubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="inline-flex p-2.5 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-serif text-2xl text-[#1A1A1A]">Alert Preferences Logged</h5>
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  You will receive real-time container manifests and port berthing notifications for <span className="font-bold text-[#1A1A1A]">{notifyTargetFruit}</span> directly on <span className="font-bold text-[#1A1A1A]">{notifyContact}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsNotifyModalOpen(false)}
                  className="fr-btn mt-2 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotifySubmitted(true);
                }}
                className="space-y-4"
              >
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  Pre-book allocations before maritime vessels dock at Indian ports. Get notified when cold-chain manifests clear customs.
                </p>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase font-bold text-black/60">Upcoming Inflow Sourcing Target</label>
                  <CustomSelect
                    value={notifyTargetFruit}
                    onChange={(val) => setNotifyTargetFruit(val)}
                    accentColor="#1A1A1A"
                    options={[
                      { value: 'All Upcoming Arrivals', label: 'All Upcoming Fruit Shipments' },
                      { value: 'USA Washington Gala & Fuji Apples', label: 'USA Washington Gala & Fuji Apples (ETA 6 Days)' },
                      { value: 'Australian Navel & Midknight Oranges', label: 'Australian Navel & Midknight Oranges (Next Shipment)' },
                      { value: 'Vietnam Ruby Red Dragon Fruit', label: 'Vietnam Ruby Red Dragon Fruit (Next Week)' },
                    ]}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase font-bold text-black/60">WhatsApp Number or Corporate Email *</label>
                  <input
                    type="text"
                    required
                    value={notifyContact}
                    onChange={(e) => setNotifyContact(e.target.value)}
                    placeholder="+91 98765 43210 or procurement@firm.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ACTIVATE VESSEL ALERTS</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
