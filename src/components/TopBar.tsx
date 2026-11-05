import React from 'react';
import { Sparkles, Sun, Moon, Smartphone, Monitor } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  profile: UserProfile;
  activeTab: string;
  onOpenAIPlanner: () => void;
  onOpenThemeSelector: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenProModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  activeTab,
  onOpenAIPlanner,
  onOpenThemeSelector,
  onToggleTheme,
  isDarkMode,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenProModal,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full liquid-glass border-b border-white/60 dark:border-white/10 transition-colors">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand / Tab Title */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-xs"
            style={{ backgroundColor: profile.accentColor || '#6366f1' }}
          />
          <span className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 uppercase">
            BASIC DAY
          </span>
          <span className="text-stone-300 dark:text-stone-700 font-light">/</span>
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 capitalize">
            {activeTab}
          </span>
        </div>

        {/* Right contextual actions */}
        <div className="flex items-center gap-1.5">
          {/* Dynamic Theme Color Picker Trigger */}
          <button
            onClick={onOpenThemeSelector}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-white/70 dark:bg-stone-800/70 hover:bg-white dark:hover:bg-stone-800 border border-white/80 dark:border-white/10 shadow-xs transition-all active:scale-95"
            title="Change dynamic theme color"
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: profile.accentColor || '#6366f1' }}
            />
            <span className="hidden sm:inline text-stone-700 dark:text-stone-300 text-[11px]">Theme</span>
          </button>

          {/* Pro Pill / Upgrade trigger */}
          <button
            onClick={onOpenProModal}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
              profile.isPro
                ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/60 dark:hover:bg-stone-800/60'
            }`}
            title={profile.isPro ? 'BASIC DAY Pro Member' : 'Explore BASIC DAY Pro'}
          >
            {profile.isPro ? 'Pro' : 'Get Pro'}
          </button>

          {/* AI Planner trigger */}
          <button
            onClick={onOpenAIPlanner}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-white/60 dark:bg-stone-800/60 hover:bg-white dark:hover:bg-stone-800 border border-white/80 dark:border-white/10 rounded-full shadow-xs transition-colors"
            title="Open AI Planner"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span className="hidden sm:inline">AI Plan</span>
          </button>

          {/* Dark/Light Switcher */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/60 dark:hover:bg-stone-800/60 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Phone Bezel Simulator Toggle (visible on wide screens) */}
          <button
            onClick={onTogglePhoneFrame}
            className="hidden md:flex w-8 h-8 items-center justify-center rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-white/60 dark:hover:bg-stone-800/60 transition-colors"
            title={isPhoneFrame ? 'Switch to Full Canvas' : 'Switch to Mobile Frame'}
            aria-label="Toggle device frame"
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
