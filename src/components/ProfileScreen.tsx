import React, { useState } from 'react';
import {
  Users,
  Bell,
  Sparkles,
  Shield,
  Download,
  RotateCcw,
  Check,
  ExternalLink,
  ChevronRight,
  Share2,
  Lock,
  Plus,
  Flame
} from 'lucide-react';
import { UserProfile, AccountabilityCircle } from '../types';

interface ProfileScreenProps {
  profile: UserProfile;
  circles: AccountabilityCircle[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onToggleCircleToday: (circleId: string) => void;
  onResetData: () => void;
  onOpenOnboarding: () => void;
  onOpenProModal: () => void;
  onOpenThemeSelector: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  circles,
  onUpdateProfile,
  onToggleCircleToday,
  onResetData,
  onOpenOnboarding,
  onOpenProModal,
  onOpenThemeSelector,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [copiedCode, setCopiedCode] = useState(false);
  const accentColor = profile.accentColor || '#6366f1';

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleExportData = () => {
    const backup = {
      profile,
      circles,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `basicday_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Profile & Settings
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Privacy-first. Your data remains stored locally on your device.
          </p>
        </div>
      </div>

      {/* User Identity Liquid Glass Card */}
      <section className="liquid-glass-card rounded-3xl p-5 shadow-xs flex items-center justify-between relative overflow-hidden">
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <div className="space-y-1 relative">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-2.5 py-1 text-base font-semibold liquid-glass rounded-xl text-stone-900 dark:text-stone-100"
              />
              <button
                onClick={handleSaveName}
                style={{ backgroundColor: accentColor }}
                className="px-3 py-1 text-xs font-semibold text-white rounded-xl shadow-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                {profile.name}
              </h2>
              <button
                onClick={() => setEditingName(true)}
                className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 underline"
              >
                Edit
              </button>
            </div>
          )}
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {profile.isPro ? 'BASIC DAY Pro Member · Unlimited Everything' : 'BASIC DAY Free Member'}
          </p>
        </div>

        <button
          onClick={onOpenProModal}
          style={
            !profile.isPro
              ? { backgroundColor: accentColor, color: '#ffffff', boxShadow: `0 4px 12px ${accentColor}50` }
              : undefined
          }
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            profile.isPro
              ? 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40'
              : 'text-white'
          }`}
        >
          {profile.isPro ? 'Pro Active' : 'Upgrade to Pro'}
        </button>
      </section>

      {/* Dynamic Liquid Theme Customizer Section */}
      <section className="liquid-glass-card rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Liquid Glass & Dynamic Theme
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Customize ambient glass glow, rings, and accents with any color.
            </p>
          </div>
          <button
            onClick={onOpenThemeSelector}
            style={{ backgroundColor: accentColor }}
            className="px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs hover:opacity-90"
          >
            Change Color
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between p-3 rounded-2xl liquid-glass">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl shadow-md flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Current Color Accent
              </span>
              <p className="text-[11px] font-mono text-stone-500">
                {accentColor.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {['#6366f1', '#059669', '#0284c7', '#d97706', '#e11d48', '#9333ea'].map((hex) => (
              <button
                key={hex}
                onClick={() => onUpdateProfile({ accentColor: hex })}
                className="w-5 h-5 rounded-full border border-white/80 dark:border-white/20 shadow-xs hover:scale-110 active:scale-95 transition-transform"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Accountability Circles (Private circles with friends) */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h2 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Accountability Circles
            </h2>
          </div>
          <span className="text-[11px] text-stone-400">
            Private · No public feed
          </span>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          Small private groups to keep each other honest without doom-scrolling or social media distractions.
        </p>

        {circles.map((circle) => {
          const userMember = circle.members.find((m) => m.isUser);
          const completedCount = circle.members.filter((m) => m.completedToday).length;

          return (
            <div
              key={circle.id}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {circle.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Day {circle.currentDay} of {circle.durationDays} · {circle.activity}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyCode(circle.inviteCode)}
                  className="flex items-center gap-1 text-[11px] font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2 py-1 rounded-lg transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Invite code'}</span>
                </button>
              </div>

              {/* Members progress list */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>Today's check-ins ({completedCount}/{circle.members.length})</span>
                  <span>Streak</span>
                </div>

                {circle.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-stone-800/80 border border-stone-100 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full ${member.avatarColor} text-white flex items-center justify-center text-[10px] font-bold`}>
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                        {member.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold tabular-nums text-stone-600 dark:text-stone-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        {member.streakDays}d
                      </span>

                      {member.isUser ? (
                        <button
                          onClick={() => onToggleCircleToday(circle.id)}
                          className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors ${
                            member.completedToday
                              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                              : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {member.completedToday ? 'Completed' : 'Check in'}
                        </button>
                      ) : (
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded ${
                            member.completedToday
                              ? 'text-stone-700 dark:text-stone-300 font-medium'
                              : 'text-stone-400'
                          }`}
                        >
                          {member.completedToday ? '✓ Done' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Intelligent Notifications Setting (Limited, Never Spam) */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <h2 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Intelligent Notifications
          </h2>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          Strictly limited alerts. Zero engagement spam or guilt trips.
        </p>

        <div className="space-y-3 pt-1">
          {/* Morning Brief */}
          <div className="flex items-center justify-between py-1">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                Morning Brief (07:30 AM)
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                “You have 3 important things today.”
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.notifications.morningBrief}
              onChange={(e) =>
                onUpdateProfile({
                  notifications: { ...profile.notifications, morningBrief: e.target.checked },
                })
              }
              className="w-4 h-4 accent-stone-900 dark:accent-stone-100"
            />
          </div>

          {/* Evening Recap */}
          <div className="flex items-center justify-between py-1 border-t border-stone-100 dark:border-stone-800">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                Evening Recap (09:00 PM)
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                “You completed 4 of 5 tasks today.”
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.notifications.eveningRecap}
              onChange={(e) =>
                onUpdateProfile({
                  notifications: { ...profile.notifications, eveningRecap: e.target.checked },
                })
              }
              className="w-4 h-4 accent-stone-900 dark:accent-stone-100"
            />
          </div>

          {/* Milestone Alerts */}
          <div className="flex items-center justify-between py-1 border-t border-stone-100 dark:border-stone-800">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                Goal Milestone Approaching
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                “You're $120 away from your next savings milestone.”
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.notifications.milestoneAlerts}
              onChange={(e) =>
                onUpdateProfile({
                  notifications: { ...profile.notifications, milestoneAlerts: e.target.checked },
                })
              }
              className="w-4 h-4 accent-stone-900 dark:accent-stone-100"
            />
          </div>
        </div>
      </section>

      {/* App & Data Management */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800/80 shadow-xs space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Preferences & Data
        </h2>

        <div className="space-y-1">
          <button
            onClick={onOpenOnboarding}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors"
          >
            <span>Restart Onboarding Walkthrough</span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export Local Backup (JSON)</span>
            </div>
            <span className="text-[11px] text-stone-400">Download</span>
          </button>

          <button
            onClick={onResetData}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium text-rose-600 dark:text-rose-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </div>
            <span className="text-[11px]">Reset</span>
          </button>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="text-center pt-2 text-xs text-stone-400 dark:text-stone-600 space-y-1">
        <p className="font-bold tracking-tight text-stone-600 dark:text-stone-400 uppercase">BASIC DAY</p>
        <p>“Make progress. One day at a time.”</p>
      </div>
    </div>
  );
};
