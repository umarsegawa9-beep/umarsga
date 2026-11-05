import React, { useState } from 'react';
import { X, Sparkles, Send, Check, Calendar, ArrowRight, ArrowDownCircle, Clock, Plus } from 'lucide-react';
import { AIPlanResult, Task, Goal, Habit } from '../types';

interface AIPlannerModalProps {
  isOpen: boolean;
  accentColor?: string;
  initialPrompt?: string;
  onClose: () => void;
  onApplyPlan: (plan: {
    goal?: Omit<Goal, 'id' | 'updatedAt'>;
    tasks?: Array<Omit<Task, 'id' | 'date'>>;
    habit?: Omit<Habit, 'id' | 'completedDates'>;
  }) => void;
}

export const AIPlannerModal: React.FC<AIPlannerModalProps> = ({
  isOpen,
  accentColor = '#6366f1',
  initialPrompt = '',
  onClose,
  onApplyPlan,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<AIPlanResult | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const quickStarters = [
    'I want to start a YouTube channel but I have never edited videos.',
    'I want to study chemistry for 2 hours daily and pass my exam.',
    'I want to run a 5k in 4 weeks from couch.',
    'Plan my week to balance work, fitness, and family.',
  ];

  const handleGeneratePlan = async (userGoalText?: string) => {
    const goalPrompt = (userGoalText || prompt).trim();
    if (!goalPrompt) return;

    setLoading(true);
    setApplied(false);
    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalPrompt }),
      });
      const data = await res.json();
      if (data.plan) {
        setPlanResult(data.plan);
      }
    } catch (e) {
      console.warn('Plan generation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToNuvora = () => {
    if (!planResult) return;

    // Convert plan into real items
    const tasksToAdd: Array<Omit<Task, 'id' | 'date'>> = [];
    if (planResult.immediateTodayTask) {
      tasksToAdd.push({
        title: planResult.immediateTodayTask.title,
        duration: `${planResult.immediateTodayTask.durationMinutes} min`,
        timeOfDay: planResult.immediateTodayTask.timeOfDay,
        completed: false,
        isFocus: true,
        category: 'Study',
      });
    }

    const milestones = planResult.weeks.map((w, idx) => ({
      id: `m-ai-${Date.now()}-${idx}`,
      title: `${w.title}: ${w.actions[0] || w.summary}`,
      completed: false,
    }));

    const goalToAdd: Omit<Goal, 'id' | 'updatedAt'> = {
      title: planResult.title,
      category: 'Personal',
      startValue: 0,
      currentValue: 0,
      targetValue: planResult.weeks.length,
      unit: 'weeks',
      deadline: `${planResult.weeks.length} weeks`,
      deadlineMonthsRemaining: Math.ceil(planResult.weeks.length / 4),
      milestones,
    };

    let habitToAdd: Omit<Habit, 'id' | 'completedDates'> | undefined = undefined;
    if (planResult.supportingHabit) {
      habitToAdd = {
        title: planResult.supportingHabit.title,
        category: 'Personal',
        frequency: 'daily',
        timeOfDay: 'anytime',
      };
    }

    onApplyPlan({
      goal: goalToAdd,
      tasks: tasksToAdd,
      habit: habitToAdd,
    });

    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl liquid-glass rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-white/60 dark:border-white/10 space-y-4 max-h-[90vh] overflow-y-auto"
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
                BASIC DAY AI Planner
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Practical, realistic 4-week roadmaps. No walls of text.
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

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
            What goal or challenge do you want to plan?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="e.g. I want to start a YouTube channel but I have never edited videos"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGeneratePlan();
              }}
              className="flex-1 px-3.5 py-2.5 text-sm liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none placeholder:text-stone-400"
            />
            <button
              onClick={() => handleGeneratePlan()}
              disabled={loading || !prompt.trim()}
              style={{ backgroundColor: accentColor }}
              className="px-4 py-2.5 text-xs font-semibold text-white rounded-xl disabled:opacity-50 hover:opacity-90 flex items-center gap-1.5 transition-opacity shadow-xs"
            >
              {loading ? (
                <span>Planning...</span>
              ) : (
                <>
                  <span>Create Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Starters */}
        {!planResult && !loading && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
              Popular planning templates:
            </p>
            <div className="space-y-1">
              {quickStarters.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(q);
                    handleGeneratePlan(q);
                  }}
                  className="w-full text-left text-xs p-2.5 rounded-xl liquid-glass text-stone-700 dark:text-stone-300 hover:border-white transition-all"
                >
                  “{q}”
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Plan Results View */}
        {planResult && (
          <div className="space-y-4 pt-2 border-t border-stone-200/50 dark:border-stone-800 animate-in fade-in duration-200">
            <div>
              <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                {planResult.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {planResult.overview}
              </p>
            </div>

            {/* Weeks Accordion / List */}
            <div className="space-y-2.5">
              {planResult.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className="p-4 rounded-2xl liquid-glass-card space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      Week {week.weekNumber} · {week.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {week.summary}
                  </p>
                  <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1 pt-1 list-disc list-inside">
                    {week.actions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Immediate actions preview */}
            <div className="p-3.5 rounded-2xl liquid-glass space-y-1 text-xs">
              <span className="font-semibold" style={{ color: accentColor }}>
                Immediate Next Action:
              </span>
              <p className="text-stone-700 dark:text-stone-300">
                Today: {planResult.immediateTodayTask?.title} ({planResult.immediateTodayTask?.durationMinutes} min)
              </p>
              {planResult.supportingHabit && (
                <p className="text-stone-700 dark:text-stone-300">
                  Daily Habit: {planResult.supportingHabit.title}
                </p>
              )}
            </div>

            {/* Action button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPlanResult(null)}
                className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800"
              >
                Change Goal
              </button>

              <button
                type="button"
                onClick={handleApplyToNuvora}
                disabled={applied}
                style={{ backgroundColor: accentColor }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-all"
              >
                {applied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Plan Added to Schedule!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Add Plan to My Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
