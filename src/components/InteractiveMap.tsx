import React, { useState } from 'react';
import { ParkingFacility, MapLayerMode } from '../types';

interface InteractiveMapProps {
  facilities: ParkingFacility[];
  selectedFacility: ParkingFacility | null;
  destination: string;
  radiusMeters: number;
  destCoords: { x: number; y: number };
  onSelectFacility: (facility: ParkingFacility) => void;
  onNavigate: (facility: ParkingFacility) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  facilities,
  selectedFacility,
  destination,
  radiusMeters,
  destCoords,
  onSelectFacility,
  onNavigate
}) => {
  const [mapMode, setMapMode] = useState<MapLayerMode>('vector');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Scaled pixel radius: 2000m maps to ~420px on the 1000x700 canvas
  const radiusRadiusPx = Math.max(12, (radiusMeters / 2000) * 420);

  return (
    <section className="flex-1 h-full relative bg-[#060e20] overflow-hidden select-none">
      {/* Precision Vector SVG Map Canvas */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        <svg
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1000 700"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Water Body Gradient */}
            <linearGradient id="bayWaterGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={mapMode === 'satellite' ? '#04101e' : '#061226'} />
              <stop offset="100%" stopColor={mapMode === 'satellite' ? '#07162b' : '#0a1936'} />
            </linearGradient>

            {/* Radius Overlay Radial Fill */}
            <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.16" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
            </radialGradient>

            {/* Glow Filter for Selected Pin */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>

            {/* Subtle Map Grid Pattern */}
            <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="#081020" />
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#121e36" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Landmass Base */}
          <rect
            width="1000"
            height="700"
            fill={mapMode === 'satellite' ? 'url(#mapGrid)' : '#091224'}
          />

          {/* Marina Bay Waterfront Geometry */}
          <path
            d="M 120,0 
               L 420,0 
               Q 480,180 580,240 
               Q 720,290 840,240 
               L 1000,210 
               L 1000,700 
               L 680,700 
               Q 540,580 430,460 
               Q 320,380 220,390 
               Q 140,400 120,700 
               L 0,700 
               L 0,0 Z"
            fill="url(#bayWaterGrad)"
            stroke="#1d2e4d"
            strokeWidth="1.5"
          />

          {/* Major Singapore CBD Road Arteries */}
          <g stroke="#1b2844" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Bayfront Avenue */}
            <path d="M 520,60 Q 640,240 760,420 Q 820,530 890,680" />
            {/* Marina Boulevard */}
            <path d="M 100,520 Q 340,460 520,440 Q 700,430 820,440" />
            {/* Central Boulevard */}
            <path d="M 110,400 Q 320,370 460,370" />
            {/* Raffles Avenue / Sheares Ave */}
            <path d="M 380,40 Q 560,90 740,110 Q 880,140 1000,200" />
            {/* Collyer Quay */}
            <path d="M 280,200 L 390,380" />
          </g>

          {/* Road Centerlines (High Contrast Minimalist) */}
          <g stroke="#2c3e66" strokeWidth="1.5" fill="none" strokeDasharray="6 4">
            <path d="M 520,60 Q 640,240 760,420 Q 820,530 890,680" />
            <path d="M 100,520 Q 340,460 520,440 Q 700,430 820,440" />
            <path d="M 380,40 Q 560,90 740,110 Q 880,140 1000,200" />
          </g>

          {/* Architectural Landmark Silhouettes */}
          {/* Marina Bay Sands 3 Towers & SkyPark */}
          <g fill="#16223b" opacity="0.75">
            <path d="M 680,220 L 740,210 L 755,270 L 695,280 Z" />
            <path d="M 705,295 L 765,285 L 780,345 L 720,355 Z" />
            <path d="M 730,370 L 790,360 L 805,420 L 745,430 Z" />
            <path d="M 660,215 Q 750,290 820,440" fill="none" stroke="#253555" strokeWidth="16" strokeLinecap="round" opacity="0.4" />
          </g>

          {/* MBFC Cluster */}
          <g fill="#16223b" opacity="0.75">
            <rect x="290" y="380" width="70" height="60" rx="6" />
            <rect x="280" y="460" width="80" height="75" rx="6" />
            <rect x="380" y="470" width="60" height="65" rx="6" />
          </g>

          {/* Dynamic Search Radius Circle (0 - 2000m) */}
          <g>
            <circle
              cx={destCoords.x}
              cy={destCoords.y}
              r={radiusRadiusPx}
              fill="url(#radiusGradient)"
            />
            <circle
              cx={destCoords.x}
              cy={destCoords.y}
              r={radiusRadiusPx}
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.85"
            />
            {/* Radius Edge Label */}
            <g transform={`translate(${destCoords.x + radiusRadiusPx - 36}, ${destCoords.y - 12})`}>
              <rect width="72" height="22" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="36" y="15" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                {radiusMeters}m radius
              </text>
            </g>
          </g>

          {/* Destination Target Marker (Pulsing Pin) */}
          <g transform={`translate(${destCoords.x}, ${destCoords.y})`}>
            <circle r="22" fill="#38bdf8" opacity="0.2">
              <animate attributeName="r" values="18;32;18" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
            <circle r="4" fill="#ffffff" />
            {/* Destination Name Label */}
            <g transform="translate(0, -22)">
              <rect x="-60" y="-18" width="120" height="20" rx="4" fill="#0284c7" opacity="0.95" />
              <text x="0" y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                📍 {destination ? (destination.length > 18 ? destination.slice(0, 16) + '...' : destination) : 'Destination'}
              </text>
            </g>
          </g>

          {/* Parking Facility Markers (Only facilities inside selected radius) */}
          {facilities.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id;
            const x = fac.coords.x;
            const y = fac.coords.y;

            return (
              <g
                key={fac.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => onSelectFacility(fac)}
                className="cursor-pointer transition-transform duration-200"
                style={{ filter: isSelected ? 'url(#cyanGlow)' : undefined }}
              >
                {/* Marker Body */}
                <rect
                  x="-32"
                  y="-18"
                  width="64"
                  height="28"
                  rx="7"
                  fill={isSelected ? '#38bdf8' : '#1e293b'}
                  stroke={isSelected ? '#ffffff' : '#475569'}
                  strokeWidth={isSelected ? '2' : '1'}
                />

                {/* Marker Pin Point */}
                <polygon
                  points="0,15 -6,10 6,10"
                  fill={isSelected ? '#38bdf8' : '#1e293b'}
                />

                {/* Text: Lots Free & Distance */}
                <text
                  x="0"
                  y="-2"
                  fill={isSelected ? '#0f172a' : '#34d399'}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {fac.availableLots} free
                </text>
                <text
                  x="0"
                  y="7"
                  fill={isSelected ? '#0f172a' : '#94a3b8'}
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {fac.walkMeters}m
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Selected Facility Detail Card (Bottom Right on Map) */}
      {selectedFacility && (
        <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-96 bg-[#0f172a]/95 border border-[#38bdf8]/40 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 flex flex-col gap-3 animate-slideUp">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] text-[10px] font-bold border border-[#38bdf8]/30">
                  {selectedFacility.walkMeters}m • {selectedFacility.walkMinutes} min walk
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#34d399] text-[10px] font-bold border border-[#10b981]/30">
                  {selectedFacility.availableLots} lots free
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] mt-1.5">
                {selectedFacility.name}
              </h4>
              <p className="text-xs text-[#94A3B8]">{selectedFacility.address}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#334155]/60 text-xs">
            <div>
              <span className="text-[10px] text-[#64748B] block">Standard Rate</span>
              <span className="font-bold text-[#38bdf8]">
                {selectedFacility.tariff.peakDayRate}
              </span>
            </div>

            <button
              onClick={() => onNavigate(selectedFacility)}
              className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#38bdf8] hover:text-[#0f172a] text-[#F8FAFC] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Start Navigation</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Control Floating Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Layer Mode Switch */}
        <button
          onClick={() => setMapMode(mapMode === 'vector' ? 'satellite' : 'vector')}
          className="p-2 rounded-xl bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#334155] text-[#38bdf8] shadow-lg transition-colors flex items-center justify-center"
          title={`Switch to ${mapMode === 'vector' ? 'Satellite Grid' : 'Vector'}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {mapMode === 'vector' ? 'satellite_alt' : 'map'}
          </span>
        </button>

        {/* Zoom In */}
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
          className="p-2 rounded-xl bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#334155] text-[#F8FAFC] shadow-lg transition-colors flex items-center justify-center"
          title="Zoom in"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
          className="p-2 rounded-xl bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#334155] text-[#F8FAFC] shadow-lg transition-colors flex items-center justify-center"
          title="Zoom out"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
      </div>
    </section>
  );
};
