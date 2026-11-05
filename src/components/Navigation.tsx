import React from 'react';
import { Calendar, Target, TrendingUp, User, Plus } from 'lucide-react';

export type TabKey = 'today' | 'goals' | 'progress' | 'profile';

interface NavigationProps {
  activeTab: TabKey;
  accentColor?: string;
  onSelectTab: (tab: TabKey) => void;
  onOpenQuickAdd: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  accentColor = '#6366f1',
  onSelectTab,
  onOpenQuickAdd,
}) => {
  const tabs: Array<{ key: TabKey; label: string; icon: React.FC<{ className?: string }> }> = [
    { key: 'today', label: 'Today', icon: Calendar },
    { key: 'goals', label: 'Goals', icon: Target },
    { key: 'progress', label: 'Progress', icon: TrendingUp },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Floating ＋ Quick Add Liquid Glass Orb Button */}
      <div className="fixed bottom-20 right-5 z-40 sm:right-auto sm:left-1/2 sm:translate-x-32 md:translate-x-36">
        <button
          onClick={onOpenQuickAdd}
          aria-label="Quick Add with AI"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 12px 30px -4px ${accentColor}80, inset 0 2px 2px 0 rgba(255, 255, 255, 0.4)`,
          }}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white border border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
        >
          {/* Internal specular highlight reflection */}
          <div className="absolute top-1 left-2.5 right-2.5 h-3 rounded-full bg-white/25 pointer-events-none blur-[0.5px]" />
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200 drop-shadow-xs" />
          <span className="sr-only">Add Task, Goal, or Ask AI</span>
        </button>
      </div>

      {/* Bottom Liquid Glass Tab Dock */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 liquid-glass border-t border-white/60 dark:border-white/10 transition-colors pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onSelectTab(tab.key)}
                className={`relative flex flex-col items-center justify-center w-16 h-full min-h-[44px] transition-colors ${
                  isActive
                    ? 'font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                style={{
                  color: isActive ? accentColor : undefined,
                }}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-xs"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </div>
                <span className="text-[11px] tracking-tight mt-1">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
