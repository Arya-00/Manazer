import React from 'react';
import { gradients } from '../data/gradients';
import { cn } from '../utils/cn';
import { Check } from 'lucide-react';

export default function GradientPicker({ selectedId, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white/80">Card Gradient</label>
      <div className="grid grid-cols-6 sm:grid-cols-4 gap-3 max-h-[160px] overflow-y-auto p-2 glass rounded-xl border border-white/10 custom-scrollbar">
        {gradients.map((grad) => (
          <button
            key={grad.id}
            type="button"
            onClick={() => onChange(grad.id)}
            title={grad.name}
            className={cn(
              "relative w-full aspect-video rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105",
              grad.css,
              selectedId === grad.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#1E232B]" : ""
            )}
          >
            {selectedId === grad.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Check className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
