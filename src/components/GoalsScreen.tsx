import React, { useState } from 'react';
import { Plus, Target, CheckCircle2, Circle, ChevronRight, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Goal, GoalCategory } from '../types';

interface GoalsScreenProps {
  goals: Goal[];
  accentColor?: string;
  onUpdateGoalProgress: (goalId: string, newValue: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'updatedAt'>) => void;
  onOpenQuickAdd: () => void;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({
  goals,
  accentColor = '#6366f1',
  onUpdateGoalProgress,
  onToggleMilestone,
  onAddGoal,
  onOpenQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('Personal');
  const [newCurrent, setNewCurrent] = useState('0');
  const [newTarget, setNewTarget] = useState('100');
  const [newUnit, setNewUnit] = useState('');
  const [newMonths, setNewMonths] = useState('6');

  const categories = ['All', 'Fitness', 'Savings', 'Study', 'Career', 'Personal'];

  const filteredGoals =
    selectedCategory === 'All'
      ? goals
      : goals.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());

  const activeGoal = goals.find((g) => g.id === activeGoalId);

  const calculatePercent = (goal: Goal): number => {
    // If target is less than start (e.g. weight loss 87kg -> 75kg)
    if (goal.startValue > goal.targetValue) {
      const totalLossNeeded = goal.startValue - goal.targetValue;
      const lossAchieved = goal.startValue - goal.currentValue;
      if (totalLossNeeded <= 0) return 100;
      const pct = Math.round((lossAchieved / totalLossNeeded) * 100);
      return Math.max(0, Math.min(100, pct));
    }
    // Normal upward goal (e.g. $0 -> $1,000)
    const range = goal.targetValue - goal.startValue;
    if (range <= 0) return 100;
    const progress = goal.currentValue - goal.startValue;
    const pct = Math.round((progress / range) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGoal({
      title: newTitle.trim(),
      category: newCategory,
      startValue: parseFloat(newCurrent) || 0,
      currentValue: parseFloat(newCurrent) || 0,
      targetValue: parseFloat(newTarget) || 100,
      unit: newUnit.trim() || '',
      deadline: `${newMonths} months`,
      deadlineMonthsRemaining: parseInt(newMonths, 10) || 6,
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Initial baseline setup', completed: true },
        { id: `m-${Date.now()}-2`, title: 'Reach half-way milestone', completed: false },
        { id: `m-${Date.now()}-3`, title: 'Final goal completion', completed: false },
      ],
    });

    setNewTitle('');
    setNewCurrent('0');
    setNewTarget('100');
    setNewUnit('');
    setIsCreatingGoal(false);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Goals
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Clear targets, steady progress, no arbitrary noise.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingGoal(true)}
          style={{ backgroundColor: accentColor }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={
                isActive
                  ? { backgroundColor: accentColor, color: '#ffffff', boxShadow: `0 4px 12px ${accentColor}40` }
                  : undefined
              }
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap min-h-[36px] ${
                isActive
                  ? 'text-white'
                  : 'liquid-glass text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Create Goal Inline Drawer */}
      {isCreatingGoal && (
        <form
          onSubmit={handleCreateGoal}
          className="liquid-glass-card p-5 rounded-3xl space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Create New Goal
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingGoal(false)}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Build an emergency fund, Learn video editing"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                className="w-full px-3 py-2 text-xs liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
              >
                <option value="Fitness">Fitness</option>
                <option value="Savings">Savings</option>
                <option value="Study">Study</option>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Unit (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. $, kg, books"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Start
              </label>
              <input
                type="number"
                value={newCurrent}
                onChange={(e) => setNewCurrent(e.target.value)}
                className="w-full px-3 py-2 text-xs liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Target
              </label>
              <input
                type="number"
                required
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full px-3 py-2 text-xs liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Timeline
              </label>
              <select
                value={newMonths}
                onChange={(e) => setNewMonths(e.target.value)}
                className="w-full px-3 py-2 text-xs liquid-glass rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
              >
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: accentColor }}
            className="w-full py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90 transition-opacity"
          >
            Create Goal
          </button>
        </form>
      )}

      {/* Goals List in Liquid Glass Cards */}
      <div className="space-y-3">
        {filteredGoals.map((goal) => {
          const percent = calculatePercent(goal);
          const isDownward = goal.startValue > goal.targetValue;
          const completedMilestones = goal.milestones.filter((m) => m.completed).length;

          return (
            <div
              key={goal.id}
              onClick={() => setActiveGoalId(activeGoalId === goal.id ? null : goal.id)}
              className="group liquid-glass-card rounded-3xl p-5 hover:border-white dark:hover:border-white/20 shadow-xs transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Subtle ambient light pool behind the active goal */}
              {activeGoalId === goal.id && (
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                />
              )}

              <div className="flex items-start justify-between gap-3 relative">
                <div className="space-y-1">
                  {/* Category unboxed text separator discipline */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold" style={{ color: accentColor }}>
                      {goal.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {goal.deadlineMonthsRemaining
                        ? `${goal.deadlineMonthsRemaining} months remaining`
                        : goal.deadline}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {goal.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className="text-xl font-bold tracking-tight tabular-nums"
                    style={{ color: accentColor }}
                  >
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Numerical target status */}
              <div className="mt-3 flex items-baseline justify-between text-xs text-stone-600 dark:text-stone-400">
                <span className="tabular-nums font-medium text-stone-900 dark:text-stone-200">
                  {goal.unit === '$' ? `$${goal.currentValue.toLocaleString()}` : `${goal.currentValue} ${goal.unit}`}
                  <span className="text-stone-400 font-normal"> / </span>
                  {goal.unit === '$' ? `$${goal.targetValue.toLocaleString()}` : `${goal.targetValue} ${goal.unit}`}
                </span>

                {isDownward && (
                  <span className="text-[11px] text-stone-500">
                    {goal.startValue} {goal.unit} → {goal.targetValue} {goal.unit}
                  </span>
                )}
              </div>

              {/* Minimal Progress Bar with Dynamic Liquid Gradient */}
              <div className="w-full bg-stone-200/50 dark:bg-stone-800/50 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}80`,
                  }}
                />
              </div>

              {/* Milestones count preview */}
              <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200/40 dark:border-stone-800/60">
                <span>
                  {completedMilestones} of {goal.milestones.length} milestones complete
                </span>
                <span className="text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100 flex items-center gap-1 text-[11px] font-medium">
                  {activeGoalId === goal.id ? 'Close details' : 'View milestones'}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeGoalId === goal.id ? 'rotate-90' : ''}`} />
                </span>
              </div>

              {/* Expanded Milestones & Quick Progress Update */}
              {activeGoalId === goal.id && (
                <div
                  className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Milestones
                    </p>
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        onClick={() => onToggleMilestone(goal.id, milestone.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-stone-800/50 cursor-pointer text-xs"
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
                            milestone.completed
                              ? 'line-through text-stone-400 dark:text-stone-500'
                              : 'text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Update current value buttons */}
                  <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Update progress:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const delta = goal.unit === '$' ? 50 : 1;
                          onUpdateGoalProgress(goal.id, goal.currentValue + delta);
                        }}
                        className="px-2.5 py-1 text-xs font-medium liquid-glass text-stone-800 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800 rounded-lg"
                      >
                        +{goal.unit === '$' ? '$50' : `1 ${goal.unit}`}
                      </button>
                      <button
                        onClick={() => {
                          const delta = goal.unit === '$' ? 100 : 5;
                          onUpdateGoalProgress(goal.id, goal.currentValue + delta);
                        }}
                        style={{ backgroundColor: accentColor }}
                        className="px-3 py-1 text-xs font-semibold text-white rounded-lg shadow-xs"
                      >
                        +{goal.unit === '$' ? '$100' : `5 ${goal.unit}`}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivation note */}
      <div className="p-4 rounded-xl bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60 text-center">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Small steps done daily beat intense sprints followed by quitting. Focus on today's tasks.
        </p>
      </div>
    </div>
  );
};
