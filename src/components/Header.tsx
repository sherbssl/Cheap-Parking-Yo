import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="w-full h-14 bg-[#091122] border-b border-[#25324d] px-4 md:px-8 flex items-center justify-between z-30 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 group text-left"
          title="Reset to default destination"
        >
          <img
            alt="ParkPulse Logo"
            className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U5IY66yV-nHEZObGLNRw4Nq5yMExOOixF-qCLM2ci6VaEX_7NXZm_tGuXOeV7PvgfInZW_HCDGpbVbsJV_REMSfhBesrTslLvN9NBM7rVrxJcW-0GdKWTi02EU8eQXjx5tZzoYgl20Klt8tRlRfmPx7NoAOv37SOHHgRwuoeSNfLB3L8wWkAyIZofWkeyqxAoHY_zgz1YH5L6nhbo2HY9NFfsPDjk0IkqKYiu-Qu-XpHdC6d6XnYTUEGs"
          />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-base md:text-lg text-[#F8FAFC] tracking-tight font-bold">
            Park<span className="text-[#38bdf8]">Pulse</span>
          </span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e293b] border border-[#334155] text-[11px] text-[#94A3B8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
          Singapore Live Parking
        </span>
      </div>

      {/* Right: Telemetry & Reset */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#64748B] hidden md:inline">
          Connected to URA & LTA Bay Feeds
        </span>
        <button
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#283548] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]/60 text-xs font-semibold transition-all flex items-center gap-1.5"
          title="Reset view"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Reset View</span>
        </button>
      </div>
    </header>
  );
};
