import React from 'react';

interface DestinationRadiusControllerProps {
  destination: string;
  setDestination: (dest: string) => void;
  radiusMeters: number;
  setRadiusMeters: (radius: number) => void;
  matchCount: number;
  onLocateMe: () => void;
}

const PRESET_DESTINATIONS = [
  'Marina Bay Sands',
  'Raffles Place',
  'Suntec City',
  'Gardens by the Bay',
  'City Hall',
  'Tanjong Pagar'
];

const RADIUS_PRESETS = [250, 500, 1000, 1500, 2000];

export const DestinationRadiusController: React.FC<DestinationRadiusControllerProps> = ({
  destination,
  setDestination,
  radiusMeters,
  setRadiusMeters,
  matchCount,
  onLocateMe
}) => {
  return (
    <div className="w-full bg-[#131d33] border-b border-[#25324d] px-4 py-4 md:px-8 md:py-5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Destination Input Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93ccff] text-[22px] pointer-events-none">
              location_on
            </span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Key in desired destination (e.g. Marina Bay Sands, Raffles Place, Suntec City...)"
              className="w-full bg-[#09101f] border border-[#2d3a56] focus:border-[#38bdf8] rounded-xl pl-11 pr-24 py-3 text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none transition-all shadow-inner"
            />
            {destination && (
              <button
                onClick={() => setDestination('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md transition-colors"
                title="Clear destination"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={onLocateMe}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#38bdf8] transition-colors"
              title="Use my current location"
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </button>
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] text-[#94A3B8] font-medium hidden lg:inline mr-1">
              Popular:
            </span>
            {PRESET_DESTINATIONS.map((preset) => (
              <button
                key={preset}
                onClick={() => setDestination(preset)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  destination.toLowerCase().includes(preset.toLowerCase())
                    ? 'bg-[#38bdf8] text-[#0f172a] font-semibold shadow-sm'
                    : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#283548] border border-[#334155]/60'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Radius Slider Row (0 - 2000m) */}
        <div className="bg-[#09101f] border border-[#2d3a56] rounded-xl p-3.5 md:px-5 md:py-3.5 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
                radar
              </span>
              <span className="text-xs font-medium text-[#94A3B8]">
                Search Radius:
              </span>
              <span className="text-sm md:text-base font-bold text-[#38bdf8] font-['Plus_Jakarta_Sans',sans-serif]">
                {radiusMeters.toLocaleString()} m
              </span>
              <span className="text-xs text-[#64748B]">
                ({(radiusMeters / 1000).toFixed(2)} km)
              </span>
            </div>

            {/* Match counter & Preset Radius Pills */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 text-xs font-semibold">
                {matchCount} {matchCount === 1 ? 'location' : 'locations'} in range
              </span>
              <div className="hidden sm:flex items-center gap-1">
                {RADIUS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setRadiusMeters(preset)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      radiusMeters === preset
                        ? 'bg-[#38bdf8] text-[#0f172a] font-bold'
                        : 'bg-[#1e293b] text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}km` : `${preset}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Range Slider (0 to 2000m) */}
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={2000}
              step={25}
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] px-0.5 font-medium">
              <span>0m</span>
              <span>500m</span>
              <span>1,000m</span>
              <span>1,500m</span>
              <span>2,000m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
