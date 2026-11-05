export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface Task {
  id: string;
  title: string;
  duration?: string;
  timeOfDay: TimeOfDay;
  completed: boolean;
  isFocus?: boolean;
  date: string; // YYYY-MM-DD
  category: string;
  notes?: string;
}

export type GoalCategory = 'Fitness' | 'Savings' | 'Study' | 'Career' | 'Personal';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  currentValue: number;
  startValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  deadlineMonthsRemaining?: number;
  milestones: Milestone[];
  linkedHabitIds?: string[];
  updatedAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  timeOfDay: TimeOfDay | 'anytime';
  completedDates: string[]; // YYYY-MM-DD
}

export interface CircleMember {
  id: string;
  name: string;
  avatarColor: string;
  isUser: boolean;
  completedToday: boolean;
  streakDays: number;
}

export interface AccountabilityCircle {
  id: string;
  name: string;
  description: string;
  activity: string;
  durationDays: number;
  currentDay: number;
  members: CircleMember[];
  isPrivate: boolean;
  inviteCode: string;
}

export interface Reminder {
  id: string;
  title: string;
  timing: string;
  repeat: 'once' | 'monthly' | 'weekly';
  active: boolean;
}

export interface UserProfile {
  name: string;
  isPro: boolean;
  theme: 'light' | 'dark' | 'system';
  accentColor: string; // Dynamic color of choice e.g. '#6366f1'
  glassIntensity?: 'subtle' | 'medium' | 'deep';
  focusQuote: string;
  onboardingCompleted: boolean;
  primaryCategory: string;
  primaryGoal: string;
  notifications: {
    morningBrief: boolean;
    morningTime: string;
    eveningRecap: boolean;
    eveningTime: string;
    milestoneAlerts: boolean;
    quietHours: boolean;
  };
}

export interface AIPlanWeek {
  weekNumber: number;
  title: string;
  summary: string;
  actions: string[];
}

export interface AIPlanResult {
  title: string;
  overview: string;
  immediateTodayTask?: {
    title: string;
    durationMinutes: number;
    timeOfDay: TimeOfDay;
  };
  supportingHabit?: {
    title: string;
    frequency: string;
  };
  weeks: AIPlanWeek[];
}
