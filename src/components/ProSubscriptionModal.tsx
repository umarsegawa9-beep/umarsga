import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface ProSubscriptionModalProps {
  isOpen: boolean;
  isCurrentPro: boolean;
  accentColor?: string;
  onClose: () => void;
  onTogglePro: (status: boolean) => void;
}

export const ProSubscriptionModal: React.FC<ProSubscriptionModalProps> = ({
  isOpen,
  isCurrentPro,
  accentColor = '#6366f1',
  onClose,
  onTogglePro,
}) => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');

  if (!isOpen) return null;

  const freeFeatures = [
    'Daily tasks & intelligent grouping',
    'Up to 3 active goals',
    'Daily habit tracking & calendar',
    'Smart reminders',
    'Weekly progress tracking',
    '1 private accountability circle',
  ];

  const proFeatures = [
    'Unlimited active goals & milestones',
    'Advanced multi-week AI planning & roadmaps',
    'Deep progress insights & overload detection',
    'Unlimited accountability circles with friends',
    'Smart weekly schedule rebalancing',
    'Automated local & cloud encrypted backups',
    'AI goal coaching & priority suggestions',
    'Dynamic liquid glass color themes',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg liquid-glass rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-white/60 dark:border-white/10 space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                BASIC DAY Pro
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Transparent pricing. No deceptive tricks, cancel anytime.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-white/40 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing selector */}
        <div className="p-1 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center">
          <button
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              billingCycle === 'annual'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Annual ($39.99/yr · Save 33%)
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Monthly ($4.99/mo)
          </button>
        </div>

        {/* Pricing Banner */}
        <div className="text-center py-2 space-y-0.5">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
              {billingCycle === 'annual' ? '$3.33' : '$4.99'}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              / month {billingCycle === 'annual' ? '(billed $39.99 annually)' : ''}
            </span>
          </div>
          <p className="text-[11px] text-stone-400">
            Includes 14-day zero-risk trial. Keep full access to your local data even if canceled.
          </p>
        </div>

        {/* Comparison List */}
        <div className="space-y-4 pt-1">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Everything in Pro:
            </h4>
            <div className="space-y-2">
              {proFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-stone-800 dark:text-stone-200">
                  <div
                    className="w-4 h-4 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
              Free plan retains:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              {freeFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-stone-400">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              onTogglePro(!isCurrentPro);
              onClose();
            }}
            style={{ backgroundColor: accentColor }}
            className="w-full py-3 text-xs font-semibold text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
          >
            <span>{isCurrentPro ? 'Switch to Free Tier' : 'Activate BASIC DAY Pro (Instant Test)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <p className="text-center text-[11px] text-stone-400 mt-2">
            Safe sandbox toggle. You can switch back anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
