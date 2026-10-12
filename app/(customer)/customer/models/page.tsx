"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Star, ChevronRight, MapPin, CheckCircle2 } from "lucide-react";

interface TalentModel {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  rating: number;
  location: string;
  image: string;
  height: string;
  experience: string;
  tags: string[];
}

const TALENT_MODELS: TalentModel[] = [
  {
    id: "shalini-perera",
    name: "Shalini Perera",
    handle: "@shalini_perera",
    specialty: "High Fashion & Editorial",
    rating: 4.9,
    location: "Colombo, Sri Lanka",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    height: "175 cm",
    experience: "5+ Years Exp",
    tags: ["Editorial", "Runway", "Commercial"],
  },
  {
    id: "ananya-sen",
    name: "Ananya Sen",
    handle: "@ananya_sen",
    specialty: "Commercial & Lifestyle",
    rating: 4.8,
    location: "Colombo, Sri Lanka",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    height: "172 cm",
    experience: "3+ Years Exp",
    tags: ["Lifestyle", "Brand Campaigns", "Fashion"],
  },
  {
    id: "rohan-de-silva",
    name: "Rohan De Silva",
    handle: "@rohan_desilva",
    specialty: "Men's Apparel & Runway",
    rating: 4.9,
    location: "Galle / Colombo",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    height: "183 cm",
    experience: "4+ Years Exp",
    tags: ["Men's Fashion", "Commercial", "Swimwear"],
  },
  {
    id: "kavindi-jay",
    name: "Kavindi Jayawardena",
    handle: "@kavindi_jay",
    specialty: "Bridal & Portrait",
    rating: 5.0,
    location: "Kandy / Colombo",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    height: "170 cm",
    experience: "4+ Years Exp",
    tags: ["Bridal", "Jewelry", "Studio Portrait"],
  },
];

export default function CustomerModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = TALENT_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden justify-between gap-3 sm:gap-4 min-h-0">
      {/* Search Bar Row between top header and bottom card */}
      <div className="px-3 pt-1 pb-0.5 flex items-center gap-2.5 shrink-0">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified models & talent..."
            className="w-full h-11 py-2 px-4 bg-[#1a1a1e] border border-white/10 rounded-xl text-[14px] font-medium text-white placeholder-white/40 focus-visible:ring-im-accent focus-visible:border-im-accent shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-12 h-11 bg-[#26262c] hover:bg-[#32323a] text-white border border-white/15 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
          aria-label="Search Models"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Card Container: Light curved panel with notch */}
      <div className="flex-1 min-h-0 bg-[#DCE0E2] rounded-t-[36px] rounded-b px-4 pt-3 pb-32 flex flex-col gap-3.5 overflow-y-auto">
        {/* Drag Notch Indicator */}
        <div className="w-10 h-1 bg-slate-400/50 rounded-full mx-auto my-0.5 shrink-0" />

        {/* Header: Title and Count */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[16px] font-medium text-slate-900 tracking-tight">
              Studio Models & Talent
            </h1>
            <Sparkles className="w-4 h-4 text-[#FF6433]" />
          </div>
          <span className="px-2.5 py-1 bg-black/10 text-slate-700 text-[12px] font-medium rounded-full">
            {filteredModels.length} Talent
          </span>
        </div>

        {/* Talent List */}
        <div className="flex flex-col gap-3">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-2xl p-3.5 shadow-xs border border-black/5 flex items-center gap-3.5 hover:shadow-md transition-shadow"
            >
              {/* Avatar Photo */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-white text-[#E84A23] rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-slate-900 truncate">
                    {model.name}
                  </span>
                  <div className="flex items-center gap-1 text-[12px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{model.rating}</span>
                  </div>
                </div>

                <span className="text-[12px] text-slate-500 font-medium">
                  {model.specialty}
                </span>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {model.location}
                  </span>
                  <span>•</span>
                  <span>{model.height}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{model.experience}</span>
                </div>
              </div>

              <Link
                href="/customer/packages"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF6433] hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Book shoot with model"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
