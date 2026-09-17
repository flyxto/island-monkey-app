import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane - Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#faf6f0] text-[#0B1C30] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded bg-[#C85A17] flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">I</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Island Monkey</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 max-w-md leading-tight">
            Discover the best experiences on the island.
          </h1>
          <p className="text-lg text-[#45464D] max-w-sm">
            Join our community of models and partners to create unforgettable memories.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#fdf2ea] rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-1/4 -left-16 w-64 h-64 bg-[#C85A17]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex gap-4 mt-auto">
          <div className="w-12 h-1 bg-[#C85A17] rounded-full" />
          <div className="w-2 h-1 bg-[#c6c6cd] rounded-full opacity-50" />
          <div className="w-2 h-1 bg-[#c6c6cd] rounded-full opacity-50" />
        </div>
      </div>
      
      {/* Right Pane - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded bg-[#C85A17] flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">I</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0B1C30]">Island Monkey</span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
