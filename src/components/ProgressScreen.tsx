import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Target, Sparkles, RefreshCw, Award, ArrowUpRight } from 'lucide-react';
import { Task, Goal, Habit } from '../types';

interface ProgressScreenProps {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  accentColor?: string;
  onOpenAIPlanner: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  tasks,
  goals,
  habits,
  accentColor = '#6366f1',
  onOpenAIPlanner,
}) => {
  const [aiInsight, setAiInsight] = useState<string>(
    'You completed 78% of your planned tasks with Wednesday showing your peak focus. Protect your morning routine to maintain this calm momentum.'
  );
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Static/dynamic weekly distribution (Mon-Sun)
  const daysOfWeek = [
    { day: 'Mon', completed: 4, total: 5, rate: 80 },
    { day: 'Tue', completed: 5, total: 6, rate: 83 },
    { day: 'Wed', completed: 6, total: 6, rate: 100, isBest: true },
    { day: 'Thu', completed: 4, total: 5, rate: 80 },
    { day: 'Fri', completed: 3, total: 4, rate: 75 },
    { day: 'Sat', completed: 2, total: 3, rate: 66 },
    { day: 'Sun', completed: 3, total: 4, rate: 75 },
  ];

  const totalWeeklyCompleted = daysOfWeek.reduce((acc, d) => acc + d.completed, 0);
  const totalWeeklyPlanned = daysOfWeek.reduce((acc, d) => acc + d.total, 0);
  const weeklyRate = Math.round((totalWeeklyCompleted / totalWeeklyPlanned) * 100);

  const totalMilestonesCompleted = goals.reduce(
    (acc, g) => acc + g.milestones.filter((m) => m.completed).length,
    0
  );

  const fetchAiInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: { weeklyRate, totalWeeklyCompleted, bestDay: 'Wednesday' },
          tasksSummary: tasks.map((t) => ({ title: t.title, completed: t.completed })),
        }),
      });
      const data = await res.json();
      if (data.insight) {
        setAiInsight(data.insight);
      }
    } catch (e) {
      console.warn('Failed to fetch live insight, keeping current');
    } finally {
      setLoadingInsight(false);
    }
  };

  // 30 days grid for consistency
  const past30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const completedCount = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    return {
      dateStr,
      dayNum: d.getDate(),
      intensity: completedCount >= 3 ? 3 : completedCount >= 1 ? 1 : 0,
    };
  });

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          Progress
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Real consistency, measured quietly over time.
        </p>
      </div>

      {/* 1. "Your week" Core Highlight Liquid Glass Card */}
      <section className="liquid-glass-card rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Your week
          </h2>
          <span
            style={{
              backgroundColor: `${accentColor}18`,
              color: accentColor,
            }}
            className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-lg"
          >
            Nov 1 – Nov 7
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            You completed <span className="tabular-nums font-bold" style={{ color: accentColor }}>{weeklyRate}%</span> of your planned tasks.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
            <span className="font-semibold text-stone-900 dark:text-stone-200">
              3 goals moved forward.
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span>
              Best day: <strong className="font-semibold text-stone-900 dark:text-stone-100">Wednesday</strong> (100% completion)
            </span>
          </div>
        </div>

        {/* Weekly Productivity Bar Chart */}
        <div className="pt-3">
          <div className="flex items-end justify-between gap-2 h-28 pt-4">
            {daysOfWeek.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-stone-400 tabular-nums">
                  {day.completed}/{day.total}
                </span>
                <div className="w-full bg-stone-200/50 dark:bg-stone-800/50 rounded-xl h-full max-h-16 flex items-end overflow-hidden p-0.5">
                  <div
                    style={{
                      height: `${day.rate}%`,
                      backgroundColor: day.isBest ? accentColor : undefined,
                      boxShadow: day.isBest ? `0 0 10px ${accentColor}80` : undefined,
                    }}
                    className={`w-full rounded-lg transition-all duration-500 ${
                      !day.isBest ? 'bg-stone-400/80 dark:bg-stone-600/80' : ''
                    }`}
                  />
                </div>
                <span className={`text-[11px] font-medium ${day.isBest ? 'font-bold' : 'text-stone-500 dark:text-stone-400'}`} style={day.isBest ? { color: accentColor } : undefined}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. AI Progress Insight Card */}
      <section className="liquid-glass rounded-3xl p-5 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100">
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="uppercase tracking-wider">AI Progress Insight</span>
          </div>
          <button
            onClick={fetchAiInsight}
            disabled={loadingInsight}
            className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 p-1"
            title="Refresh insight"
          >
            <RefreshCw className={`w-3 h-3 ${loadingInsight ? 'animate-spin' : ''}`} />
            <span>Update</span>
          </button>
        </div>

        <p className="text-sm font-medium leading-relaxed text-stone-800 dark:text-stone-200">
          “{aiInsight}”
        </p>
      </section>

      {/* 3. Habit Consistency Calendar (Liquid Glass Tile Grid) */}
      <section className="liquid-glass-card rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Habit Consistency
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Last 30 days of daily check-ins
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-200/50 dark:bg-stone-800/50" />
            <span>0</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-400/70 ml-1" />
            <span>1-2</span>
            <span
              className="w-2.5 h-2.5 rounded-sm ml-1"
              style={{ backgroundColor: accentColor }}
            />
            <span>3+</span>
          </div>
        </div>

        {/* 30 days block visualizer */}
        <div className="grid grid-cols-10 gap-1.5 pt-1">
          {past30Days.map((item, idx) => (
            <div
              key={idx}
              title={`${item.dateStr}: ${item.intensity === 3 ? '3+ habits' : item.intensity === 1 ? '1-2 habits' : 'No habits'}`}
              style={
                item.intensity === 3
                  ? {
                      backgroundColor: accentColor,
                      color: '#ffffff',
                      boxShadow: `0 2px 8px ${accentColor}50`,
                    }
                  : undefined
              }
              className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-medium transition-colors ${
                item.intensity === 3
                  ? 'text-white'
                  : item.intensity === 1
                  ? 'bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                  : 'bg-stone-100/60 dark:bg-stone-800/40 text-stone-400'
              }`}
            >
              {item.dayNum}
            </div>
          ))}
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 pt-1">
          Consistency rate: <strong className="font-semibold text-stone-900 dark:text-stone-100">82%</strong> across your 5 active habits.
        </p>
      </section>

      {/* 4. Milestone & Goal Summary */}
      <section className="grid grid-cols-2 gap-3">
        <div className="liquid-glass-card p-4 rounded-3xl">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <Award className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>Milestones hit</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-2 tabular-nums">
            {totalMilestonesCompleted}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            Across {goals.length} active goals
          </p>
        </div>

        <div className="liquid-glass-card p-4 rounded-3xl">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <CheckCircle className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>Tasks finished</span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-2 tabular-nums">
            {tasks.filter((t) => t.completed).length + 24}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            This month so far
          </p>
        </div>
      </section>
    </div>
  );
};
