import { Task, Goal, Habit, AccountabilityCircle, Reminder, UserProfile } from '../types';

const STORAGE_KEYS = {
  TASKS: 'nuvora_tasks_v1',
  GOALS: 'nuvora_goals_v1',
  HABITS: 'nuvora_habits_v1',
  CIRCLES: 'nuvora_circles_v1',
  REMINDERS: 'nuvora_reminders_v1',
  PROFILE: 'nuvora_profile_v1',
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFormattedDateHeader = (): { greeting: string; formattedDate: string } => {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = now.toLocaleDateString('en-US', options);

  return { greeting, formattedDate };
};

// Generate past 30 days dates for habit history
const generateRecentDates = (count: number, completionRatio: number = 0.7): string[] => {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    if (Math.random() < completionRatio) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${day}`);
    }
  }
  return dates;
};

const today = getTodayDateString();

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex',
  isPro: false,
  theme: 'system',
  accentColor: '#6366f1', // Electric Iris liquid accent
  glassIntensity: 'medium',
  focusQuote: 'Make progress. One day at a time.',
  onboardingCompleted: true,
  primaryCategory: 'Study & Career',
  primaryGoal: 'Pass mathematics with distinction',
  notifications: {
    morningBrief: true,
    morningTime: '07:30',
    eveningRecap: true,
    eveningTime: '21:00',
    milestoneAlerts: true,
    quietHours: true,
  },
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Walk',
    duration: '30 min',
    timeOfDay: 'morning',
    completed: true,
    date: today,
    category: 'Fitness',
  },
  {
    id: 't-2',
    title: 'Read',
    duration: '20 min',
    timeOfDay: 'morning',
    completed: true,
    date: today,
    category: 'Personal',
  },
  {
    id: 't-3',
    title: 'Study mathematics',
    duration: '1 hour',
    timeOfDay: 'afternoon',
    completed: false,
    isFocus: true,
    date: today,
    category: 'Study',
    notes: 'Finish calculus problem sets 4.1 to 4.3',
  },
  {
    id: 't-4',
    title: 'Work on YouTube video',
    duration: '45 min',
    timeOfDay: 'evening',
    completed: false,
    date: today,
    category: 'Career',
    notes: 'Rough timeline cut for tutorial part 1',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    title: 'Build an emergency fund',
    category: 'Savings',
    currentValue: 350,
    startValue: 0,
    targetValue: 1000,
    unit: '$',
    deadline: '2027-04-01',
    deadlineMonthsRemaining: 5,
    milestones: [
      { id: 'm-1', title: 'Save first $100', completed: true },
      { id: 'm-2', title: 'Reach $500 milestone', completed: false },
      { id: 'm-3', title: 'Complete $1,000 emergency reserve', completed: false },
    ],
    updatedAt: today,
  },
  {
    id: 'g-2',
    title: 'Weight Optimization',
    category: 'Fitness',
    currentValue: 81.5,
    startValue: 87,
    targetValue: 75,
    unit: 'kg',
    deadline: '2027-05-15',
    deadlineMonthsRemaining: 6,
    milestones: [
      { id: 'm-4', title: 'Break 85 kg mark', completed: true },
      { id: 'm-5', title: 'Reach 80 kg steady weight', completed: false },
      { id: 'm-6', title: 'Achieve 75 kg target bodyweight', completed: false },
    ],
    updatedAt: today,
  },
  {
    id: 'g-3',
    title: 'Pass Mathematics Final',
    category: 'Study',
    currentValue: 4,
    startValue: 0,
    targetValue: 6,
    unit: 'modules',
    deadline: '2026-12-20',
    deadlineMonthsRemaining: 2,
    milestones: [
      { id: 'm-7', title: 'Complete Differential Equations', completed: true },
      { id: 'm-8', title: 'Finish Linear Algebra Review', completed: true },
      { id: 'm-9', title: 'Score >85% on 2 mock practice exams', completed: false },
    ],
    updatedAt: today,
  },
  {
    id: 'g-4',
    title: 'Learn Video Editing',
    category: 'Career',
    currentValue: 4,
    startValue: 0,
    targetValue: 8,
    unit: 'projects',
    deadline: '2027-02-28',
    deadlineMonthsRemaining: 4,
    milestones: [
      { id: 'm-10', title: 'Master timeline cuts and keyboard shortcuts', completed: true },
      { id: 'm-11', title: 'Create first 3 short form videos', completed: true },
      { id: 'm-12', title: 'Produce full 10-minute polished YouTube video', completed: false },
    ],
    updatedAt: today,
  },
  {
    id: 'g-5',
    title: 'Read 12 books',
    category: 'Personal',
    currentValue: 7,
    startValue: 0,
    targetValue: 12,
    unit: 'books',
    deadline: '2026-12-31',
    deadlineMonthsRemaining: 2,
    milestones: [
      { id: 'm-13', title: 'Complete first 6 books', completed: true },
      { id: 'm-14', title: 'Read 3 non-fiction philosophy/biography books', completed: true },
      { id: 'm-15', title: 'Finish book 12 by year end', completed: false },
    ],
    updatedAt: today,
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    title: 'Walk 30 minutes',
    category: 'Fitness',
    frequency: 'daily',
    timeOfDay: 'morning',
    completedDates: [today, ...generateRecentDates(24, 0.85)],
  },
  {
    id: 'h-2',
    title: 'Drink 2L water',
    category: 'Health',
    frequency: 'daily',
    timeOfDay: 'anytime',
    completedDates: [today, ...generateRecentDates(22, 0.75)],
  },
  {
    id: 'h-3',
    title: 'Read',
    category: 'Personal',
    frequency: 'daily',
    timeOfDay: 'morning',
    completedDates: [today, ...generateRecentDates(20, 0.7)],
  },
  {
    id: 'h-4',
    title: 'Study mathematics',
    category: 'Study',
    frequency: 'weekdays',
    timeOfDay: 'afternoon',
    completedDates: generateRecentDates(18, 0.65),
  },
  {
    id: 'h-5',
    title: 'Sleep before 11 PM',
    category: 'Health',
    frequency: 'daily',
    timeOfDay: 'evening',
    completedDates: generateRecentDates(15, 0.55),
  },
];

export const INITIAL_CIRCLES: AccountabilityCircle[] = [
  {
    id: 'c-1',
    name: '30-Day Walking Challenge',
    description: 'A calm daily commitment between friends to walk at least 30 minutes every day.',
    activity: 'Daily 30 min Walk',
    durationDays: 30,
    currentDay: 19,
    isPrivate: true,
    inviteCode: 'NUVORA-WALK30',
    members: [
      {
        id: 'u-self',
        name: 'Alex (You)',
        avatarColor: 'bg-indigo-600',
        isUser: true,
        completedToday: true,
        streakDays: 14,
      },
      {
        id: 'u-2',
        name: 'Maya S.',
        avatarColor: 'bg-emerald-600',
        isUser: false,
        completedToday: true,
        streakDays: 18,
      },
      {
        id: 'u-3',
        name: 'Daniel K.',
        avatarColor: 'bg-amber-600',
        isUser: false,
        completedToday: false,
        streakDays: 9,
      },
      {
        id: 'u-4',
        name: 'Chloe T.',
        avatarColor: 'bg-rose-600',
        isUser: false,
        completedToday: true,
        streakDays: 12,
      },
    ],
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'r-1',
    title: 'Pay rent on the 5th of every month',
    timing: '5th of every month at 09:00',
    repeat: 'monthly',
    active: true,
  },
  {
    id: 'r-2',
    title: 'Sunday weekly planning & review',
    timing: 'Sundays at 19:00',
    repeat: 'weekly',
    active: true,
  },
];

// LocalStorage helpers with type safety
export const loadData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error loading key ${key}:`, e);
    return fallback;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving key ${key}:`, e);
  }
};

export const resetAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.CIRCLES);
  localStorage.removeItem(STORAGE_KEYS.REMINDERS);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
};

export { STORAGE_KEYS };
