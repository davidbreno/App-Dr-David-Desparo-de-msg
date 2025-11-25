import { Filter } from 'lucide-react';

interface AgeSliderProps {
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
}

export function AgeSlider({ ageRange, setAgeRange }: AgeSliderProps) {
  return (
    <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" style={{ color: '#C8FF2E' }} />
        <label className="text-white">Filtrar por Idade</label>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span 
            className="px-3 py-1 rounded-lg border"
            style={{
              backgroundColor: 'rgba(200, 255, 46, 0.2)',
              color: '#C8FF2E',
              borderColor: 'rgba(200, 255, 46, 0.3)',
            }}
          >
            {ageRange[0]} anos
          </span>
          <span className="text-gray-400">até</span>
          <span 
            className="px-3 py-1 rounded-lg border"
            style={{
              backgroundColor: 'rgba(200, 255, 46, 0.2)',
              color: '#C8FF2E',
              borderColor: 'rgba(200, 255, 46, 0.3)',
            }}
          >
            {ageRange[1]} anos
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Idade mínima</label>
            <input
              type="range"
              min="18"
              max="80"
              value={ageRange[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                if (newMin <= ageRange[1]) {
                  setAgeRange([newMin, ageRange[1]]);
                }
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Idade máxima</label>
            <input
              type="range"
              min="18"
              max="80"
              value={ageRange[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                if (newMax >= ageRange[0]) {
                  setAgeRange([ageRange[0], newMax]);
                }
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </div>
      </div>
    </div>
  );
}