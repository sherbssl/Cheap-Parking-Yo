/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ParkingFacility, SortCategory } from './types';
import { PARKING_FACILITIES } from './data/parkingData';
import { Header } from './components/Header';
import { DestinationRadiusController } from './components/DestinationRadiusController';
import { MinimalistParkingList } from './components/MinimalistParkingList';
import { InteractiveMap } from './components/InteractiveMap';
import { NavigationModal } from './components/NavigationModal';

// Landmark coordinate lookup on SVG canvas (1000x700)
const LANDMARK_COORDS: Record<string, { x: number; y: number }> = {
  'marina bay sands': { x: 670, y: 260 },
  'mbs': { x: 670, y: 260 },
  'raffles place': { x: 290, y: 320 },
  'suntec': { x: 610, y: 110 },
  'gardens by the bay': { x: 840, y: 440 },
  'city hall': { x: 420, y: 120 },
  'tanjong pagar': { x: 180, y: 540 }
};

export default function App() {
  // Destination & Radius State (0 - 2000m)
  const [destination, setDestination] = useState<string>('Marina Bay Sands');
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [sort, setSort] = useState<SortCategory>('distance');

  // Selected Facility & Navigation
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('pin-mbfc');
  const [navigationFacility, setNavigationFacility] = useState<ParkingFacility | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  // Determine destination coordinates on canvas
  const destCoords = useMemo(() => {
    const query = destination.toLowerCase().trim();
    for (const key of Object.keys(LANDMARK_COORDS)) {
      if (query.includes(key)) {
        return LANDMARK_COORDS[key];
      }
    }
    return { x: 500, y: 320 }; // default central bay point
  }, [destination]);

  // Recalculate relative distances based on destination coordinates
  const facilitiesWithDistances = useMemo(() => {
    return PARKING_FACILITIES.map((fac) => {
      // Euclidean distance in SVG coordinates converted to real meters
      const dx = fac.coords.x - destCoords.x;
      const dy = fac.coords.y - destCoords.y;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);
      // Map ~420px to 2000m (ratio: ~4.76m per px)
      const calculatedMeters = Math.round(pixelDist * 4.76);
      const walkMeters = Math.max(120, calculatedMeters);
      const walkMinutes = Math.max(2, Math.round(walkMeters / 75)); // average 75m/min walking pace

      return {
        ...fac,
        walkMeters,
        walkMinutes
      };
    });
  }, [destCoords]);

  // Filter facilities within the selected radius (0 - 2000m)
  const availableFacilities = useMemo(() => {
    return facilitiesWithDistances
      .filter((fac) => fac.walkMeters <= radiusMeters)
      .sort((a, b) => {
        if (sort === 'distance') return a.walkMeters - b.walkMeters;
        if (sort === 'lots') return b.availableLots - a.availableLots;
        if (sort === 'price') {
          return a.tariff.ratePerHalfHourDay - b.tariff.ratePerHalfHourDay;
        }
        return 0;
      });
  }, [facilitiesWithDistances, radiusMeters, sort]);

  // Active selected facility
  const selectedFacility = useMemo(() => {
    return (
      availableFacilities.find((f) => f.id === selectedFacilityId) ||
      availableFacilities[0] ||
      null
    );
  }, [availableFacilities, selectedFacilityId]);

  const handleReset = () => {
    setDestination('Marina Bay Sands');
    setRadiusMeters(1000);
    setSort('distance');
    setSelectedFacilityId('pin-mbfc');
    showToast('Reset to default destination & 1,000m radius');
  };

  const handleLocateMe = () => {
    setDestination('Marina Bay Sands (GPS Located)');
    showToast('GPS: Pinned to Marina Bay Sands, Singapore');
  };

  return (
    <div className="bg-[#0b1326] min-h-screen flex flex-col text-[#dae2fd] font-['Inter',sans-serif] selection:bg-[#38bdf8] selection:text-[#0f172a] overflow-hidden">
      {/* 1. Minimalist Top Bar */}
      <Header onReset={handleReset} />

      {/* 2. Destination Input & Radius Selector (0 - 2000m) */}
      <DestinationRadiusController
        destination={destination}
        setDestination={setDestination}
        radiusMeters={radiusMeters}
        setRadiusMeters={setRadiusMeters}
        matchCount={availableFacilities.length}
        onLocateMe={handleLocateMe}
      />

      {/* 3. Main Split View: Available Locations List + Responsive Minimalist Map */}
      <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Available Parking Locations within Radius */}
        <MinimalistParkingList
          facilities={availableFacilities}
          radiusMeters={radiusMeters}
          destination={destination}
          selectedFacilityId={selectedFacility?.id || ''}
          sort={sort}
          setSort={setSort}
          onSelectFacility={(fac) => setSelectedFacilityId(fac.id)}
          onNavigate={(fac) => setNavigationFacility(fac)}
          onExpandRadius={(meters) => setRadiusMeters(meters)}
        />

        {/* Right Column: Interactive Vector Map with Destination & Scaled Radius */}
        <InteractiveMap
          facilities={availableFacilities}
          selectedFacility={selectedFacility}
          destination={destination}
          radiusMeters={radiusMeters}
          destCoords={destCoords}
          onSelectFacility={(fac) => setSelectedFacilityId(fac.id)}
          onNavigate={(fac) => setNavigationFacility(fac)}
        />
      </main>

      {/* Turn-by-Turn Navigation Modal */}
      {navigationFacility && (
        <NavigationModal
          facility={navigationFacility}
          onClose={() => setNavigationFacility(null)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a]/95 text-[#F8FAFC] border border-[#38bdf8]/50 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold animate-slideUp">
          <span className="material-symbols-outlined text-[#38bdf8] text-[18px]">
            info
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
