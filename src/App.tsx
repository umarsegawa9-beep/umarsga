import React, { useState, useEffect } from 'react';
import {
  loadData,
  saveData,
  STORAGE_KEYS,
  INITIAL_PROFILE,
  INITIAL_TASKS,
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_CIRCLES,
  INITIAL_REMINDERS,
  resetAllData,
  getTodayDateString,
} from './lib/storage';
import { Task, Goal, Habit, AccountabilityCircle, Reminder, UserProfile } from './types';
import { TopBar } from './components/TopBar';
import { Navigation, TabKey } from './components/Navigation';
import { TodayScreen } from './components/TodayScreen';
import { GoalsScreen } from './components/GoalsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { QuickAddModal } from './components/QuickAddModal';
import { AIPlannerModal } from './components/AIPlannerModal';
import { ProSubscriptionModal } from './components/ProSubscriptionModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { applyThemeColor } from './lib/theme';

export default function App() {
  // Load persistent states
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadData(STORAGE_KEYS.PROFILE, INITIAL_PROFILE)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadData(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadData(STORAGE_KEYS.GOALS, INITIAL_GOALS)
  );
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadData(STORAGE_KEYS.HABITS, INITIAL_HABITS)
  );
  const [circles, setCircles] = useState<AccountabilityCircle[]>(() =>
    loadData(STORAGE_KEYS.CIRCLES, INITIAL_CIRCLES)
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    loadData(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS)
  );

  // Active tab & view toggles
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('nuvora_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [aiPlannerInitialPrompt, setAiPlannerInitialPrompt] = useState('');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Sync dark mode class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nuvora_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nuvora_theme', 'light');
    }
  }, [isDarkMode]);

  // Dynamically apply chosen liquid accent color to document root
  useEffect(() => {
    applyThemeColor(profile.accentColor || '#6366f1');
  }, [profile.accentColor]);

  // Sync states to local storage
  useEffect(() => {
    saveData(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    saveData(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    saveData(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  useEffect(() => {
    saveData(STORAGE_KEYS.HABITS, habits);
  }, [habits]);

  useEffect(() => {
    saveData(STORAGE_KEYS.CIRCLES, circles);
  }, [circles]);

  useEffect(() => {
    saveData(STORAGE_KEYS.REMINDERS, reminders);
  }, [reminders]);

  // Handlers for Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'date'>) => {
    const today = getTodayDateString();
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: today,
    };
    setTasks((prev) => [...prev, task]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSetFocusTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        isFocus: t.id === taskId,
      }))
    );
  };

  // Handlers for Habits
  const handleToggleHabit = (habitId: string) => {
    const today = getTodayDateString();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(today);
        const updatedDates = exists
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today];
        return { ...h, completedDates: updatedDates };
      })
    );
  };

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'completedDates'>) => {
    const habit: Habit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      completedDates: [],
    };
    setHabits((prev) => [...prev, habit]);
  };

  // Handlers for Goals
  const handleUpdateGoalProgress = (goalId: string, newValue: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentValue: newValue } : g))
    );
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      })
    );
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'updatedAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      updatedAt: getTodayDateString(),
    };
    setGoals((prev) => [goal, ...prev]);
  };

  // Handlers for Accountability Circles
  const handleToggleCircleToday = (circleId: string) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;
        return {
          ...c,
          members: c.members.map((m) => {
            if (!m.isUser) return m;
            const nextCompleted = !m.completedToday;
            return {
              ...m,
              completedToday: nextCompleted,
              streakDays: nextCompleted ? m.streakDays + 1 : Math.max(0, m.streakDays - 1),
            };
          }),
        };
      })
    );
  };

  // Handler for AI Plan Application
  const handleApplyPlan = (plan: {
    goal?: Omit<Goal, 'id' | 'updatedAt'>;
    tasks?: Array<Omit<Task, 'id' | 'date'>>;
    habit?: Omit<Habit, 'id' | 'completedDates'>;
  }) => {
    if (plan.goal) {
      handleAddGoal(plan.goal);
    }
    if (plan.habit) {
      handleAddHabit(plan.habit);
    }
    if (plan.tasks && plan.tasks.length > 0) {
      plan.tasks.forEach((t) => handleAddTask(t));
    }
    setActiveTab('today');
  };

  // Handler for Resetting Data
  const handleResetData = () => {
    resetAllData();
    setProfile(INITIAL_PROFILE);
    setTasks(INITIAL_TASKS);
    setGoals(INITIAL_GOALS);
    setHabits(INITIAL_HABITS);
    setCircles(INITIAL_CIRCLES);
    setReminders(INITIAL_REMINDERS);
  };

  // Handler for Onboarding Completion
  const handleCompleteOnboarding = (data: {
    name: string;
    category: string;
    goal: string;
    starterTasks: Array<Omit<Task, 'id' | 'date'>>;
    starterHabit: Omit<Habit, 'id' | 'completedDates'>;
    starterGoal: Omit<Goal, 'id' | 'updatedAt'>;
  }) => {
    setProfile((prev) => ({
      ...prev,
      name: data.name,
      primaryCategory: data.category,
      primaryGoal: data.goal,
      onboardingCompleted: true,
    }));
    setTasks(data.starterTasks.map((t, i) => ({
      ...t,
      id: `task-ob-${Date.now()}-${i}`,
      date: getTodayDateString(),
    })));
    setHabits([
      {
        ...data.starterHabit,
        id: `habit-ob-${Date.now()}`,
        completedDates: [],
      },
      ...INITIAL_HABITS.slice(1, 4),
    ]);
    setGoals([
      {
        ...data.starterGoal,
        id: `goal-ob-${Date.now()}`,
        updatedAt: getTodayDateString(),
      },
      ...INITIAL_GOALS.slice(0, 2),
    ]);
    setIsOnboardingOpen(false);
    setActiveTab('today');
  };

  const activeAccentColor = profile.accentColor || '#6366f1';

  return (
    <div className="relative min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col items-center justify-start transition-colors selection:bg-stone-300 dark:selection:bg-stone-700 overflow-x-hidden">
      {/* Background Liquid Glass Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        <div
          className="absolute -top-24 -left-20 w-96 h-96 rounded-full blur-[110px] opacity-25 dark:opacity-20 animate-liquid-orb-1 transition-colors duration-700"
          style={{ backgroundColor: activeAccentColor }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[420px] h-[420px] rounded-full blur-[130px] opacity-20 dark:opacity-15 animate-liquid-orb-2 transition-colors duration-700"
          style={{ backgroundColor: activeAccentColor }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full blur-[100px] opacity-15 dark:opacity-10 transition-colors duration-700"
          style={{ backgroundColor: activeAccentColor }}
        />
      </div>

      {/* Container wrapper: either simulated flagship phone or fluid responsive container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame
            ? 'max-w-[430px] my-6 rounded-[48px] border-[10px] border-stone-800 dark:border-stone-800 shadow-2xl overflow-hidden bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-xl relative min-h-[880px]'
            : 'max-w-xl min-h-screen bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-xl shadow-sm relative'
        }`}
      >
        {/* Simulated mobile status bar when in phone bezel mode */}
        {isPhoneFrame && (
          <div className="w-full h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-stone-800 dark:text-stone-200 bg-stone-50/80 dark:bg-stone-950/80 select-none">
            <span>9:41</span>
            <div className="w-20 h-4 bg-stone-800 dark:bg-stone-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top App Bar */}
        <TopBar
          profile={profile}
          activeTab={activeTab}
          onOpenAIPlanner={() => {
            setAiPlannerInitialPrompt('');
            setIsAIPlannerOpen(true);
          }}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
          isDarkMode={isDarkMode}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame((prev) => !prev)}
          onOpenProModal={() => setIsProModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-5">
          {activeTab === 'today' && (
            <TodayScreen
              tasks={tasks}
              habits={habits}
              profile={profile}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onSetFocusTask={handleSetFocusTask}
              onToggleHabit={handleToggleHabit}
              onOpenAIPlanner={() => {
                setAiPlannerInitialPrompt('');
                setIsAIPlannerOpen(true);
              }}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsScreen
              goals={goals}
              accentColor={activeAccentColor}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onToggleMilestone={handleToggleMilestone}
              onAddGoal={handleAddGoal}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressScreen
              tasks={tasks}
              goals={goals}
              habits={habits}
              accentColor={activeAccentColor}
              onOpenAIPlanner={() => {
                setAiPlannerInitialPrompt('');
                setIsAIPlannerOpen(true);
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              profile={profile}
              circles={circles}
              onUpdateProfile={(updates) => setProfile((p) => ({ ...p, ...updates }))}
              onToggleCircleToday={handleToggleCircleToday}
              onResetData={handleResetData}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onOpenProModal={() => setIsProModalOpen(true)}
              onOpenThemeSelector={() => setIsThemeModalOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          accentColor={activeAccentColor}
          onSelectTab={setActiveTab}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        />
      </div>

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        accentColor={activeAccentColor}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        onAddGoal={handleAddGoal}
        onAddHabit={handleAddHabit}
        onAddReminder={(rem) =>
          setReminders((prev) => [...prev, { ...rem, id: `r-${Date.now()}`, active: true }])
        }
        onOpenAIPlannerWithPrompt={(p) => {
          setAiPlannerInitialPrompt(p);
          setIsAIPlannerOpen(true);
        }}
      />

      <AIPlannerModal
        isOpen={isAIPlannerOpen}
        accentColor={activeAccentColor}
        initialPrompt={aiPlannerInitialPrompt}
        onClose={() => setIsAIPlannerOpen(false)}
        onApplyPlan={handleApplyPlan}
      />

      <ProSubscriptionModal
        isOpen={isProModalOpen}
        isCurrentPro={profile.isPro}
        accentColor={activeAccentColor}
        onClose={() => setIsProModalOpen(false)}
        onTogglePro={(status) => setProfile((p) => ({ ...p, isPro: status }))}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        accentColor={activeAccentColor}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
      />

      {/* Dynamic Theme Color Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        currentColor={activeAccentColor}
        onClose={() => setIsThemeModalOpen(false)}
        onSelectColor={(hex) => setProfile((p) => ({ ...p, accentColor: hex }))}
      />
    </div>
  );
}
