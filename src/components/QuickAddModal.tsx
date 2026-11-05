import React, { useState } from 'react';
import { X, Sparkles, Send, ArrowRight, Check, Calendar, Target, Clock, Bell, ListTodo } from 'lucide-react';
import { Task, Goal, Habit, Reminder, TimeOfDay } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  accentColor?: string;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'date'>) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'updatedAt'>) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'active'>) => void;
  onOpenAIPlannerWithPrompt: (prompt: string) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  accentColor = '#6366f1',
  onClose,
  onAddTask,
  onAddGoal,
  onAddHabit,
  onAddReminder,
  onOpenAIPlannerWithPrompt,
}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any>(null);

  if (!isOpen) return null;

  const examplePrompts = [
    'I need to study chemistry for two hours tomorrow evening.',
    'Remind me to pay rent on the 5th of every month.',
    'I want to lose 10 kg in six months.',
    'Help me plan my week.',
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || input).trim();
    if (!text) return;

    // Check if it's explicitly a planning request
    if (text.toLowerCase().includes('plan my week') || text.toLowerCase().includes('help me plan')) {
      onClose();
      onOpenAIPlannerWithPrompt(text);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/parse-quick-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setParsedPreview(data.result);
      }
    } catch (e) {
      console.warn('Analysis error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!parsedPreview) return;

    if (parsedPreview.type === 'task') {
      const taskData = parsedPreview.taskData || {};
      onAddTask({
        title: taskData.title || parsedPreview.summary,
        duration: taskData.durationMinutes ? `${taskData.durationMinutes} min` : '30 min',
        timeOfDay: (taskData.timeOfDay as TimeOfDay) || 'afternoon',
        completed: false,
        isFocus: taskData.priority === 'focus',
        category: taskData.category || 'General',
      });
    } else if (parsedPreview.type === 'goal') {
      const goalData = parsedPreview.goalData || {};
      onAddGoal({
        title: goalData.title || parsedPreview.summary,
        category: goalData.category || 'Personal',
        startValue: goalData.startValue || 0,
        currentValue: goalData.startValue || 0,
        targetValue: goalData.targetValue || 100,
        unit: goalData.unit || '',
        deadline: `${goalData.targetMonths || 6} months`,
        deadlineMonthsRemaining: goalData.targetMonths || 6,
        milestones: (goalData.milestones || ['Baseline setup', 'Halfway progress', 'Final completion']).map(
          (m: string, i: number) => ({
            id: `m-qa-${Date.now()}-${i}`,
            title: m,
            completed: i === 0,
          })
        ),
      });
    } else if (parsedPreview.type === 'habit') {
      const habitData = parsedPreview.habitData || {};
      onAddHabit({
        title: habitData.title || parsedPreview.summary,
        category: 'Personal',
        frequency: habitData.frequency || 'daily',
        timeOfDay: habitData.timeOfDay || 'anytime',
      });
    } else if (parsedPreview.type === 'reminder') {
      const reminderData = parsedPreview.reminderData || {};
      onAddReminder({
        title: reminderData.title || parsedPreview.summary,
        timing: reminderData.datetimeStr || 'Soon',
        repeat: reminderData.repeat || 'once',
      });
    } else if (parsedPreview.type === 'plan') {
      onClose();
      onOpenAIPlannerWithPrompt(parsedPreview.summary || input);
      return;
    }

    onClose();
    setInput('');
    setParsedPreview(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg liquid-glass rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-white/60 dark:border-white/10 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                Natural Quick Add
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Type naturally. BASIC DAY recognizes tasks, goals, habits, and plans.
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

        {/* Natural Language Input */}
        <div className="relative">
          <textarea
            autoFocus
            rows={3}
            placeholder="e.g. Study chemistry for 2 hours tomorrow evening, or save $5,000 for vacation..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setParsedPreview(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            className="w-full p-3.5 text-sm liquid-glass rounded-2xl text-stone-900 dark:text-stone-100 focus:outline-none placeholder:text-stone-400 resize-none"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-stone-400">
              Press Enter to parse
            </span>

            <button
              onClick={() => handleAnalyze()}
              disabled={isProcessing || !input.trim()}
              style={{ backgroundColor: accentColor }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity shadow-xs"
            >
              {isProcessing ? (
                <span>Analyzing...</span>
              ) : (
                <>
                  <span>Recognize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Examples Chips from Prompt brief */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            Or try an example:
          </p>
          <div className="flex flex-col gap-1.5">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(example);
                  handleAnalyze(example);
                }}
                className="text-left text-xs p-2.5 rounded-xl liquid-glass text-stone-700 dark:text-stone-300 hover:border-white transition-all"
              >
                “{example}”
              </button>
            ))}
          </div>
        </div>

        {/* Parsed Preview Card */}
        {parsedPreview && (
          <div className="p-4 rounded-2xl liquid-glass-card space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Recognized as: <strong className="uppercase" style={{ color: accentColor }}>{parsedPreview.type}</strong>
              </span>
              <span className="text-[11px] text-stone-500">Ready to save</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {parsedPreview.type === 'task' && <ListTodo className="w-4 h-4" />}
                {parsedPreview.type === 'goal' && <Target className="w-4 h-4" />}
                {parsedPreview.type === 'habit' && <Clock className="w-4 h-4" />}
                {parsedPreview.type === 'reminder' && <Bell className="w-4 h-4" />}
                {parsedPreview.type === 'plan' && <Calendar className="w-4 h-4" />}
              </div>

              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {parsedPreview.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  {parsedPreview.taskData?.timeOfDay && (
                    <span>Slot: {parsedPreview.taskData.timeOfDay}</span>
                  )}
                  {parsedPreview.taskData?.durationMinutes && (
                    <span>· {parsedPreview.taskData.durationMinutes} min</span>
                  )}
                  {parsedPreview.goalData?.unit && (
                    <span>Target: {parsedPreview.goalData.targetValue} {parsedPreview.goalData.unit}</span>
                  )}
                  {parsedPreview.reminderData?.datetimeStr && (
                    <span>Time: {parsedPreview.reminderData.datetimeStr}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-200/50 dark:border-stone-700/60">
              <button
                type="button"
                onClick={() => setParsedPreview(null)}
                className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                Re-edit
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                style={{ backgroundColor: accentColor }}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Confirm & Add</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
