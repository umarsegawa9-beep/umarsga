import React, { useState } from 'react';
import { X, Check, Palette, Sparkles, Sliders } from 'lucide-react';
import { PRESET_THEMES, ThemePalette } from '../lib/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  currentColor: string;
  onClose: () => void;
  onSelectColor: (hex: string) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  currentColor,
  onClose,
  onSelectColor,
}) => {
  const [customHex, setCustomHex] = useState(currentColor);

  if (!isOpen) return null;

  const handleCustomChange = (hex: string) => {
    setCustomHex(hex);
    onSelectColor(hex);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md liquid-glass rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-white/60 dark:border-white/10 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors"
              style={{ backgroundColor: currentColor, color: '#ffffff' }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                Liquid Theme Color
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Dynamically tints ambient liquid glass reflections & accents.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Pill */}
        <div className="p-4 rounded-2xl liquid-glass-card border border-white/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300"
              style={{
                backgroundColor: currentColor,
                boxShadow: `0 8px 24px ${currentColor}55`,
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                Active Liquid Tint
              </span>
              <p className="text-sm font-mono font-medium text-stone-600 dark:text-stone-300">
                {currentColor.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Native HTML5 Color Picker Trigger */}
          <div className="relative">
            <input
              type="color"
              value={customHex}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              title="Pick any custom color"
            />
            <div className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white/80 dark:bg-stone-800/80 border border-white/80 dark:border-white/10 shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-white dark:hover:bg-stone-800">
              <Sliders className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span>Custom Picker</span>
            </div>
          </div>
        </div>

        {/* Curated Theme Presets Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Curated Liquid Palettes
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_THEMES.map((theme: ThemePalette) => {
              const isSelected = currentColor.toLowerCase() === theme.hex.toLowerCase();
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCustomHex(theme.hex);
                    onSelectColor(theme.hex);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? 'liquid-glass-card border-stone-800 dark:border-stone-200 shadow-md scale-[1.02]'
                      : 'bg-white/40 dark:bg-stone-900/40 border-white/40 dark:border-white/5 hover:bg-white/70 dark:hover:bg-stone-900/70'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: theme.hex }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                      {theme.name}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono">
                      {theme.hex}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hex input */}
        <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between gap-3">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Direct Hex Value:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={7}
              value={customHex}
              onChange={(e) => {
                const val = e.target.value;
                setCustomHex(val);
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  onSelectColor(val);
                }
              }}
              className="w-24 px-2 py-1 text-xs font-mono bg-white/80 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none"
              placeholder="#6366F1"
            />
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-opacity"
              style={{ backgroundColor: currentColor }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
