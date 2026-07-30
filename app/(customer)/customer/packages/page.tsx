"use client";

import React, { useState } from "react";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { PackageCard } from "@/components/portal/PackageCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function PackagesListPage() {
  const { user, packages, setSelectedPackage } = useCustomer();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Header */}
      <h1 className="text-[28px] font-semibold text-[#0b1c30] tracking-tight">
        Good morning, {user.firstName}.
      </h1>

      {/* Search Bar using shadcn Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Packages..."
            className="w-full h-11 pl-4 pr-10 bg-white border border-[#c6c6cd] rounded-full text-[15px] text-[#0b1c30] placeholder-[#9e9e9e] focus-visible:ring-[#4648d4] focus-visible:border-[#4648d4] transition-all shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-[#4648d4] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-[#4648d4]/90 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Packages List */}
      <div className="flex flex-col gap-6">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              packageItem={pkg}
              onSelect={setSelectedPackage}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-[#c6c6cd] rounded-lg">
            <p className="text-[#9e9e9e] text-[15px]">
              No packages found matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
