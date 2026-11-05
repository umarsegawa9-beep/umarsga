import React, { useState } from 'react';
import { Check, Clock, Plus, Sparkles, Sun, Sunset, Sunrise, Flame, Edit3, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TimeOfDay, Habit, UserProfile } from '../types';
import { getFormattedDateHeader } from '../lib/storage';

interface TodayScreenProps {
  tasks: Task[];
  habits: Habit[];
  profile: UserProfile;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'date'>) => void;
  onDeleteTask: (taskId: string) => void;
  onSetFocusTask: (taskId: string) => void;
  onToggleHabit: (habitId: string) => void;
  onOpenAIPlanner: () => void;
  onOpenQuickAdd: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  tasks,
  habits,
  profile,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSetFocusTask,
  onToggleHabit,
  onOpenAIPlanner,
  onOpenQuickAdd,
}) => {
  const { greeting, formattedDate } = getFormattedDateHeader();
  const [inlineGroup, setInlineGroup] = useState<TimeOfDay | null>(null);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineDuration, setInlineDuration] = useState('30 min');
  const [editingFocus, setEditingFocus] = useState(false);
  const [customFocusText, setCustomFocusText] = useState('');

  // Calculate today's progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // The primary focus task
  const focusTask = tasks.find((t) => t.isFocus) || tasks[0];

  const handleToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed && completedTasks + 1 === totalTasks) {
      // All tasks completed celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#78716c', '#a8a29e', '#d6d3d1', '#1c1917'],
        disableForReducedMotion: true,
      });
    }
    onToggleTask(taskId);
  };

  const handleInlineSubmit = (group: TimeOfDay) => {
    if (!inlineTitle.trim()) {
      setInlineGroup(null);
      return;
    }
    onAddTask({
      title: inlineTitle.trim(),
      duration: inlineDuration,
      timeOfDay: group,
      completed: false,
      category: 'General',
    });
    setInlineTitle('');
    setInlineGroup(null);
  };

  const morningTasks = tasks.filter((t) => t.timeOfDay === 'morning');
  const afternoonTasks = tasks.filter((t) => t.timeOfDay === 'afternoon');
  const eveningTasks = tasks.filter((t) => t.timeOfDay === 'evening');

  const groups: Array<{
    key: TimeOfDay;
    title: string;
    icon: React.FC<{ className?: string }>;
    taskList: Task[];
  }> = [
    { key: 'morning', title: 'Morning', icon: Sunrise, taskList: morningTasks },
    { key: 'afternoon', title: 'Afternoon', icon: Sun, taskList: afternoonTasks },
    { key: 'evening', title: 'Evening', icon: Sunset, taskList: eveningTasks },
  ];

  const accentColor = profile.accentColor || '#6366f1';

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* 1. Greeting & Date */}
      <div>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 tracking-wide uppercase">
          {formattedDate}
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
          {greeting}, {profile.name}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          “{profile.focusQuote}”
        </p>
      </div>

      {/* 2. Today's Progress Liquid Glass Card */}
      <section className="liquid-glass-card rounded-3xl p-5 relative overflow-hidden transition-all duration-300">
        {/* Ambient liquid glow behind the glass */}
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-30 dark:opacity-20 transition-all duration-500"
          style={{ backgroundColor: accentColor }}
        />

        <div className="relative flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Today's progress
            </h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
                {progressPercent}%
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                complete · {completedTasks} of {totalTasks} tasks
              </span>
            </div>
          </div>

          {/* Liquid Glass SVG Progress Ring with Dynamic Accent */}
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-stone-200/80 dark:text-stone-800/80"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke={accentColor}
                strokeWidth="4"
                fill="none"
                strokeDasharray={119.38}
                strokeDashoffset={119.38 - (119.38 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
                style={{
                  filter: `drop-shadow(0 2px 6px ${accentColor}60)`,
                }}
              />
            </svg>
            <span className="absolute text-[11px] font-semibold text-stone-800 dark:text-stone-200 tabular-nums">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Clean horizontal progress bar with dynamic glow */}
        <div className="w-full bg-stone-200/50 dark:bg-stone-800/50 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
        </div>
      </section>

      {/* 3. Focus Section — Liquid Glass Highlight */}
      <section
        className="liquid-glass rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300"
        style={{
          boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.7), 0 8px 30px -4px ${accentColor}18`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="uppercase tracking-wider text-stone-800 dark:text-stone-200">
              Today's Focus
            </span>
          </div>
          <button
            onClick={() => setEditingFocus(!editingFocus)}
            className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>{editingFocus ? 'Close' : 'Change'}</span>
          </button>
        </div>

        {editingFocus ? (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="What is your #1 priority today?"
              defaultValue={focusTask ? focusTask.title : ''}
              onChange={(e) => setCustomFocusText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingFocus(false)}
                className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customFocusText.trim()) {
                    if (focusTask) {
                      focusTask.title = customFocusText.trim();
                    } else {
                      onAddTask({
                        title: customFocusText.trim(),
                        timeOfDay: 'afternoon',
                        completed: false,
                        isFocus: true,
                        category: 'Study',
                      });
                    }
                  }
                  setEditingFocus(false);
                }}
                style={{ backgroundColor: accentColor }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-opacity"
              >
                Set Focus
              </button>
            </div>
          </div>
        ) : focusTask ? (
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="space-y-1">
              <p className={`text-base sm:text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100 ${focusTask.completed ? 'line-through text-stone-400 dark:text-stone-500' : ''}`}>
                “{focusTask.title}”
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Single priority · {focusTask.duration || 'Estimated 1 hour'}
              </p>
            </div>
            <button
              onClick={() => handleToggle(focusTask.id)}
              style={
                focusTask.completed
                  ? {
                      backgroundColor: accentColor,
                      boxShadow: `0 4px 12px ${accentColor}60`,
                    }
                  : undefined
              }
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all min-h-[44px] min-w-[44px] ${
                focusTask.completed
                  ? 'text-white'
                  : 'liquid-glass text-stone-400 hover:text-stone-600'
              }`}
              aria-label="Toggle focus task completion"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-stone-500 dark:text-stone-400 italic">
            No focus selected yet. Tap change to define today's main task.
          </p>
        )}
      </section>

      {/* 4. Habits Fast-Check Strip */}
      {habits.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Daily habits
            </h2>
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              Tap to check in
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {habits.map((habit) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isDone = habit.completedDates.includes(todayStr);
              return (
                <button
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id)}
                  style={
                    isDone
                      ? {
                          backgroundColor: accentColor,
                          boxShadow: `0 4px 14px ${accentColor}40`,
                          color: '#ffffff',
                        }
                      : undefined
                  }
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs whitespace-nowrap transition-all min-h-[44px] ${
                    isDone
                      ? 'border-transparent text-white'
                      : 'liquid-glass text-stone-700 dark:text-stone-300 hover:border-stone-400'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      isDone
                        ? 'bg-white/30 text-white border-transparent'
                        : 'border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="font-medium">{habit.title}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Intelligently Grouped Tasks (Morning, Afternoon, Evening) */}
      <section className="space-y-6">
        {groups.map((group) => {
          const Icon = group.icon;
          const isAdding = inlineGroup === group.key;

          return (
            <div key={group.key} className="space-y-2">
              {/* Group Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {group.title}
                  </h3>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    ({group.taskList.filter((t) => t.completed).length}/{group.taskList.length})
                  </span>
                </div>

                <button
                  onClick={() => {
                    setInlineGroup(isAdding ? null : group.key);
                    setInlineTitle('');
                  }}
                  className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 min-h-[36px] px-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-stone-800/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Inline Add Input */}
              {isAdding && (
                <div className="p-3.5 liquid-glass-card rounded-2xl space-y-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder={`Add task for ${group.title.toLowerCase()}...`}
                    value={inlineTitle}
                    onChange={(e) => setInlineTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleInlineSubmit(group.key);
                      if (e.key === 'Escape') setInlineGroup(null);
                    }}
                    className="w-full text-sm bg-transparent border-0 text-stone-900 dark:text-stone-100 focus:outline-none placeholder:text-stone-400"
                  />
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/50 dark:border-stone-800/50">
                    <div className="flex items-center gap-1.5">
                      {['15 min', '30 min', '45 min', '1 hour'].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setInlineDuration(dur)}
                          style={
                            inlineDuration === dur
                              ? { backgroundColor: accentColor, color: '#ffffff' }
                              : undefined
                          }
                          className={`text-[11px] px-2.5 py-0.5 rounded-lg transition-colors ${
                            inlineDuration === dur
                              ? 'text-white shadow-xs'
                              : 'text-stone-500 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInlineGroup(null)}
                        className="text-xs text-stone-500 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleInlineSubmit(group.key)}
                        style={{ backgroundColor: accentColor }}
                        className="px-3.5 py-1 text-xs font-semibold text-white rounded-xl shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Task Items in Liquid Glass Rows */}
              {group.taskList.length === 0 && !isAdding ? (
                <div className="py-4 text-center border border-dashed border-stone-300/50 dark:border-stone-800 rounded-2xl liquid-glass">
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    No {group.title.toLowerCase()} tasks planned
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {group.taskList.map((task) => {
                    return (
                      <div
                        key={task.id}
                        className={`group flex items-center justify-between p-3.5 rounded-2xl liquid-glass-interactive transition-all ${
                          task.completed
                            ? 'bg-white/30 dark:bg-stone-900/30 text-stone-400 dark:text-stone-500 border border-white/20 dark:border-white/5'
                            : 'liquid-glass-card text-stone-900 dark:text-stone-100 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Check Button with 44px touch area & dynamic accent */}
                          <button
                            onClick={() => handleToggle(task.id)}
                            style={
                              task.completed
                                ? {
                                    backgroundColor: accentColor,
                                    borderColor: 'transparent',
                                    boxShadow: `0 2px 8px ${accentColor}50`,
                                  }
                                : undefined
                            }
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all border ${
                              task.completed
                                ? 'text-white'
                                : 'border-stone-300 dark:border-stone-700 hover:border-stone-400 bg-white/60 dark:bg-stone-800/60'
                            }`}
                            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </button>

                          {/* Task details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-medium tracking-tight truncate ${
                                  task.completed ? 'line-through text-stone-400 dark:text-stone-500' : ''
                                }`}
                              >
                                {task.title}
                              </span>
                              {task.isFocus && (
                                <span
                                  style={{
                                    backgroundColor: `${accentColor}20`,
                                    color: accentColor,
                                  }}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                >
                                  Focus
                                </span>
                              )}
                            </div>

                            {task.duration && (
                              <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                <Clock className="w-3 h-3 text-stone-400" />
                                <span>{task.duration}</span>
                                {task.notes && (
                                  <>
                                    <span>·</span>
                                    <span className="truncate max-w-[140px] sm:max-w-xs">{task.notes}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions (Set as Focus, Delete) */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {!task.isFocus && !task.completed && (
                            <button
                              onClick={() => onSetFocusTask(task.id)}
                              className="text-[11px] text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 p-1.5 rounded-md hover:bg-white/60 dark:hover:bg-stone-800"
                              title="Make this today's main focus"
                            >
                              <Flame className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-stone-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-white/60 dark:hover:bg-stone-800 transition-colors"
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 6. AI Assistant Quick Prompt Banner — Liquid Glass Card */}
      <section className="liquid-glass-card p-5 rounded-3xl relative overflow-hidden flex items-center justify-between gap-3">
        <div
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
          style={{ backgroundColor: accentColor }}
        />
        <div className="space-y-0.5 relative">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100">
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>Need clarity or feeling overloaded?</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Let BASIC DAY AI suggest priorities or reschedule unfinished tasks.
          </p>
        </div>
        <button
          onClick={onOpenAIPlanner}
          style={{ backgroundColor: accentColor }}
          className="shrink-0 px-3.5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Plan with AI
        </button>
      </section>
    </div>
  );
};
