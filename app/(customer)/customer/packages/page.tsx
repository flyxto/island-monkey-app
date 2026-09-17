"use client";

import { useState } from "react";
import { useCustomer } from "@/lib/portal/CustomerContext";
import { PackageCard } from "@/components/portal/PackageCard";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

export default function PackagesListPage() {
  const { user, packages, isLoadingPackages, setSelectedPackage } = useCustomer();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pt-8 pb-11.5">
      {/* Greeting Header */}
      <h1 className="text-[28px] font-semibold text-im-heading tracking-tight">
        Good morning, {user.firstName}.
      </h1>

      {/* Search Bar using shadcn Input */}
      <div className="flex items-center gap-2.5 -mt-4">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Packages..."
            className="w-full h-11 pl-4 pr-10 bg-white border border-im-border rounded-full text-[15px] text-im-heading placeholder:text-im-placeholder focus-visible:ring-im-accent focus-visible:border-im-accent transition-all shadow-none"
          />
        </div>
        <button
          type="button"
          className="w-11 h-11 bg-im-accent-light text-im-accent rounded-full flex items-center justify-center shrink-0 shadow-sm hover:bg-im-accent/90 hover:text-im-accent-light transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Packages List */}
      <div className="flex flex-col gap-8">
        {isLoadingPackages ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-im-accent" />
          </div>
        ) : filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              packageItem={pkg}
              onSelect={setSelectedPackage}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-im-border rounded-lg">
            <p className="text-[#9e9e9e] text-[15px]">
              No packages found matching &quot;{searchQuery}&quot;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
