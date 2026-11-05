import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';
import { Task, Goal, Habit } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  accentColor?: string;
  onClose: () => void;
  onComplete: (data: {
    name: string;
    category: string;
    goal: string;
    starterTasks: Array<Omit<Task, 'id' | 'date'>>;
    starterHabit: Omit<Habit, 'id' | 'completedDates'>;
    starterGoal: Omit<Goal, 'id' | 'updatedAt'>;
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  accentColor = '#6366f1',
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Alex');
  const [selectedCategory, setSelectedCategory] = useState('Study');
  const [biggestGoal, setBiggestGoal] = useState('Finish mathematics assignment & pass calculus');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  if (!isOpen) return null;

  const categories = [
    'Fitness',
    'Money',
    'Study',
    'Career',
    'Relationships',
    'Personal growth',
    'Other',
  ];

  const handleBuildPlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/onboarding-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory, goal: biggestGoal }),
      });
      const data = await res.json();
      if (data.data) {
        setGeneratedPlan(data.data);
      }
    } catch (e) {
      console.warn('Onboarding plan error:', e);
    } finally {
      setIsGenerating(false);
      setStep(4);
    }
  };

  const handleFinish = () => {
    const tasks: Array<Omit<Task, 'id' | 'date'>> = (
      generatedPlan?.tasks || [
        { title: 'Morning walk or physical reset', timeOfDay: 'morning', duration: '20 min' },
        { title: `Focus: ${biggestGoal}`, timeOfDay: 'afternoon', duration: '45 min' },
        { title: 'Evening review', timeOfDay: 'evening', duration: '15 min' },
      ]
    ).map((t: any, idx: number) => ({
      title: t.title,
      timeOfDay: t.timeOfDay || (idx === 0 ? 'morning' : idx === 1 ? 'afternoon' : 'evening'),
      duration: t.duration || '30 min',
      completed: false,
      isFocus: idx === 1,
      category: selectedCategory,
    }));

    const starterGoal: Omit<Goal, 'id' | 'updatedAt'> = {
      title: generatedPlan?.goalTitle || biggestGoal,
      category: (['Fitness', 'Savings', 'Study', 'Career', 'Personal'].includes(selectedCategory)
        ? selectedCategory
        : 'Personal') as any,
      startValue: 0,
      currentValue: 0,
      targetValue: 100,
      unit: '%',
      deadline: '3 months',
      deadlineMonthsRemaining: 3,
      milestones: (generatedPlan?.milestones || ['Baseline setup', 'Halfway progress', 'Goal completion']).map(
        (m: string, i: number) => ({
          id: `m-ob-${Date.now()}-${i}`,
          title: m,
          completed: false,
        })
      ),
    };

    const starterHabit: Omit<Habit, 'id' | 'completedDates'> = {
      title: generatedPlan?.habit?.title || `Daily 20m progress on ${biggestGoal.slice(0, 30)}`,
      category: selectedCategory,
      frequency: 'daily',
      timeOfDay: 'anytime',
    };

    onComplete({
      name: name.trim() || 'Alex',
      category: selectedCategory,
      goal: biggestGoal,
      starterTasks: tasks,
      starterHabit,
      starterGoal,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/60 dark:border-white/10 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">
            Step {step} of 4
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{
                  backgroundColor: step === i ? accentColor : step > i ? `${accentColor}80` : undefined,
                }}
                className={`w-6 h-1 rounded-full transition-all ${
                  step < i ? 'bg-stone-200/50 dark:bg-stone-800' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Screen 1: Welcome */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Welcome to BASIC DAY.
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                “Your life, organized around what matters.”
              </p>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              No complicated productivity dogmas, no bloated subtasks or spam. Just calm progress in a fluid, liquid glass workspace.
            </p>

            <div className="pt-2">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                What should we call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 text-sm liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ backgroundColor: accentColor }}
              className="w-full py-3 text-xs font-semibold text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-opacity shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Screen 2: What are you working on? */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                What are you working on?
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Select the area of your life you want to focus on first.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={
                    selectedCategory === cat
                      ? { backgroundColor: accentColor, color: '#ffffff', boxShadow: `0 4px 12px ${accentColor}40` }
                      : undefined
                  }
                  className={`p-3 text-left text-xs font-medium rounded-2xl border transition-all ${
                    selectedCategory === cat
                      ? 'text-white border-transparent shadow-xs'
                      : 'liquid-glass text-stone-700 dark:text-stone-300 hover:border-stone-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 text-xs font-medium text-stone-500 hover:text-stone-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{ backgroundColor: accentColor }}
                className="flex-1 py-3 text-xs font-semibold text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: What's your biggest goal right now? */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                What's your biggest goal right now?
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Type naturally in your own words.
              </p>
            </div>

            <textarea
              rows={3}
              value={biggestGoal}
              onChange={(e) => setBiggestGoal(e.target.value)}
              placeholder="e.g. Finish my mathematics assignment and score >85% on the final exam..."
              className="w-full p-3.5 text-sm liquid-glass rounded-2xl text-stone-900 dark:text-stone-100 focus:outline-none placeholder:text-stone-400 resize-none"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 text-xs font-medium text-stone-500 hover:text-stone-800"
              >
                Back
              </button>
              <button
                onClick={handleBuildPlan}
                disabled={isGenerating || !biggestGoal.trim()}
                style={{ backgroundColor: accentColor }}
                className="flex-1 py-3 text-xs font-semibold text-white rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
              >
                {isGenerating ? (
                  <span>Building plan...</span>
                ) : (
                  <>
                    <span>Build My First Plan</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Screen 4: Let's build your first plan */}
        {step === 4 && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Here is your starting plan.
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                We've shaped today around your focus without overwhelming you.
              </p>
            </div>

            <div className="p-4 rounded-2xl liquid-glass-card space-y-3 text-xs">
              <div>
                <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                  Today's Main Focus
                </span>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  “{generatedPlan?.focus || biggestGoal}”
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/50 dark:border-stone-700/60">
                <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
                  Suggested Routine
                </span>
                <ul className="mt-1 space-y-1 text-stone-700 dark:text-stone-300">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Morning: Reset & light movement</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    <span className="font-medium">Afternoon: Deep focus on {biggestGoal.slice(0, 32)}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>Evening: Wind down & plan tomorrow</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleFinish}
              style={{ backgroundColor: accentColor }}
              className="w-full py-3.5 text-xs font-semibold text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-md transition-opacity"
            >
              <span>Open BASIC DAY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
