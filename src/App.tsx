import React, { useState, useEffect } from 'react';
import { UserProfile, DailyEntry, PersonalitySnapshot, Goal, AntiGoal, WeeklyFlightDebrief, MonthlyMoneyMap } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { DailyOSView } from './components/DailyOSView';
import { MeiDiagnosticCard } from './components/MeiDiagnosticCard';
import { Big6GoalsTracker } from './components/Big6GoalsTracker';
import { IdentityProfileView } from './components/IdentityProfileView';
import { WeeklyDebriefView } from './components/WeeklyDebriefView';
import { MonthlyMoneyMapView } from './components/MonthlyMoneyMapView';
import { ThemesGalleryView } from './components/ThemesGalleryView';
import { StickersSheetModal } from './components/StickersSheetModal';
import { CoverArtView } from './components/CoverArtView';
import { ChaosTrendline } from './components/ChaosTrendline';
import {
  Compass,
  Sparkles,
  Flame,
  BookOpen,
  DollarSign,
  Award,
  ShieldAlert,
  Image as ImageIcon,
  Smile,
  CheckCircle,
  Activity
} from 'lucide-react';

export default function App() {
  const [currentDate, setCurrentDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [activeTab, setActiveTab] = useState<'cover' | 'daily' | 'trendline' | 'diagnostic' | 'goals' | 'identity' | 'weekly' | 'money' | 'themes'>('daily');
  const [stickersModalOpen, setStickersModalOpen] = useState(false);
  const [allEntries, setAllEntries] = useState<DailyEntry[]>([]);

  // Core data states
  const [user, setUser] = useState<UserProfile>({
    id: "user_chaos_01",
    chaos_name: "The Unruly Alchemist",
    word_of_the_year: "FERAL",
    slogan: "Boredom=Death",
    chaos_mantra: "An intention is not a promise. It is a direction. I am allowed to update the map.",
    what_done_pretending: "Pretending that I have my life in neat boxes and that 5-year plans make any sense.",
    what_ready_to_admit: "I thrive when there is room for surprise and friction, not rigid perfectionism.",
    relationship_with_chaos: "Not disorder, but raw material for becoming.",
    permission_granted: "You have permission to change your mind mid-sentence, skip a day without guilt, and burn the performance.",
    created_at: new Date().toISOString(),
    core_values: {
      autonomy: 9,
      honesty: 10,
      creativity: 8,
      presence: 7,
      resilience: 8,
      playfulness: 9,
      rest: 6,
      discipline: 7
    }
  });

  const [dailyEntry, setDailyEntry] = useState<DailyEntry>({
    id: `entry_${currentDate}`,
    entry_date: currentDate,
    morning_intention: "Today I am choosing steadiness over optimization.",
    today_i_am: "An unhurried architect of my own space.",
    anchor_question_answer: "I am paying attention to what I resent doing, because resentment is a boundary alarm.",
    priorities: [
      "Ship the core architecture without second-guessing",
      "One hour uninterrupted in the studio",
      "Walk outside with zero audio inputs"
    ],
    midday_checkin: "Energy is good. Caught myself wanting to check email every 4 minutes. Stepped back.",
    micro_dare_completed: false,
    micro_dare_notes: "",
    evening_notes: "Felt the urge to make today look cleaner than it actually was. I kept saying I was 'fine' during the check-in, but I'm deeply irritated by performative busywork. I want to build things that matter, not maintain calendars for people whose approval I don't even respect. Big paradox: I crave order, but the minute things are too tidy, I deliberately shake the snowglobe.",
    chaos_score: 6,
    updated_at: new Date().toISOString()
  });

  const [latestSnapshot, setLatestSnapshot] = useState<PersonalitySnapshot | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [antiGoals, setAntiGoals] = useState<AntiGoal[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load from backend API
  const loadData = async () => {
    try {
      const [u, e, snaps, g, ags, allE] = await Promise.all([
        api.getUser(),
        api.getDailyEntry(currentDate),
        api.getSnapshots(),
        api.getGoals(),
        api.getAntiGoals(),
        api.getAllDailyEntries()
      ]);

      if (u) setUser(u);
      if (e) setDailyEntry(e);
      if (snaps && snaps.length > 0) setLatestSnapshot(snaps[0]);
      if (g) setGoals(g);
      if (ags) setAntiGoals(ags);
      if (allE) setAllEntries(allE);
    } catch (err) {
      console.warn("Backend API call issue, operating gracefully with local state", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  // Handle Saving Daily Entry
  const handleSaveDailyEntry = async (updates: Partial<DailyEntry>) => {
    const updatedEntry: DailyEntry = {
      ...dailyEntry,
      ...updates,
      entry_date: currentDate,
      updated_at: new Date().toISOString()
    };
    setDailyEntry(updatedEntry);

    // Update allEntries array for immediate chart refresh
    setAllEntries(prev => {
      const idx = prev.findIndex(item => item.entry_date === currentDate);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedEntry;
        return copy;
      }
      return [...prev, updatedEntry];
    });

    try {
      await api.saveDailyEntry(updatedEntry);
      showToast("Daily Flight Log saved.");
    } catch (err) {
      showToast("Saved locally.");
    }
  };

  // Handle Running Mei Diagnostic
  const handleRunDiagnostic = async () => {
    setIsDiagnosing(true);
    try {
      const snapshot = await api.runMeiDiagnostic({
        entry_date: currentDate,
        evening_notes: dailyEntry.evening_notes || '',
        morning_intention: dailyEntry.morning_intention || '',
        midday_checkin: dailyEntry.midday_checkin || '',
        chaos_score: dailyEntry.chaos_score || 5,
        user_profile: user
      });

      setLatestSnapshot(snapshot);
      setActiveTab('diagnostic');
      showToast("Mei Diagnostic complete! Honest mirror updated.");
    } catch (err) {
      console.error("Diagnosis error:", err);
      showToast("Failed to run diagnosis. Check server connection.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Goals Handlers
  const handleAddGoal = async (newGoal: Omit<Goal, 'id' | 'created_at' | 'is_completed'>) => {
    try {
      const created = await api.createGoal(newGoal);
      setGoals([...goals, created]);
      showToast("Goal committed to slot.");
    } catch (err) {
      const fallbackGoal: Goal = {
        ...newGoal,
        id: `goal_${Date.now()}`,
        is_completed: false,
        created_at: new Date().toISOString()
      };
      setGoals([...goals, fallbackGoal]);
      showToast("Goal committed locally.");
    }
  };

  const handleToggleGoal = async (id: string, isCompleted: boolean) => {
    try {
      await api.updateGoal(id, { is_completed: isCompleted });
    } catch (e) {
      console.warn(e);
    }
    setGoals(goals.map(g => g.id === id ? { ...g, is_completed: isCompleted } : g));
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id);
    } catch (e) {
      console.warn(e);
    }
    setGoals(goals.filter(g => g.id !== id));
    showToast("Goal removed from slot.");
  };

  // Anti-Goals Handlers
  const handleAddAntiGoal = async (newAntiGoal: Omit<AntiGoal, 'id' | 'created_at' | 'is_completed'> & { is_completed?: boolean }) => {
    try {
      const created = await api.createAntiGoal(newAntiGoal);
      setAntiGoals(prev => [...prev, created]);
      showToast("Anti-Goal commitment logged.");
    } catch (err) {
      const fallback: AntiGoal = {
        ...newAntiGoal,
        id: `antigoal_${Date.now()}`,
        is_completed: Boolean(newAntiGoal.is_completed),
        created_at: new Date().toISOString()
      };
      setAntiGoals(prev => [...prev, fallback]);
      showToast("Anti-Goal logged locally.");
    }
  };

  const handleToggleAntiGoal = async (id: string, isCompleted: boolean) => {
    try {
      await api.updateAntiGoal(id, { is_completed: isCompleted });
    } catch (e) {
      console.warn(e);
    }
    setAntiGoals(prev => prev.map(ag => ag.id === id ? { ...ag, is_completed: isCompleted } : ag));
    if (isCompleted) {
      showToast("Habit eliminated! Strikethrough protocol active.");
    } else {
      showToast("Anti-Goal reopened as active commitment.");
    }
  };

  const handleDeleteAntiGoal = async (id: string) => {
    try {
      await api.deleteAntiGoal(id);
    } catch (e) {
      console.warn(e);
    }
    setAntiGoals(prev => prev.filter(ag => ag.id !== id));
    showToast("Anti-Goal removed.");
  };

  // Profile Save Handler
  const handleSaveProfile = async (profileUpdates: Partial<UserProfile>) => {
    const updated = { ...user, ...profileUpdates };
    setUser(updated);
    try {
      await api.updateUser(updated);
      showToast("Identity Base updated.");
    } catch (err) {
      showToast("Identity Base saved locally.");
    }
  };

  const navigationItems = [
    { id: 'cover', label: 'Cover Art & Jacket', icon: ImageIcon, badge: 'Art' },
    { id: 'daily', label: 'Daily OS (Launch · Orbit · Landing)', icon: Compass, badge: 'Core' },
    { id: 'trendline', label: 'Chaos Trendline (30-Day)', icon: Activity, badge: 'Analysis' },
    { id: 'diagnostic', label: 'Mei Diagnostic & Sassy Mirror', icon: Sparkles, badge: 'AI' },
    { id: 'goals', label: 'Big 6 Goals OS', icon: Flame, badge: `${goals.length}/6` },
    { id: 'weekly', label: 'Weekly Flight Debrief', icon: BookOpen, badge: 'Review' },
    { id: 'money', label: 'Monthly Money Map', icon: DollarSign, badge: 'Finance' },
    { id: 'themes', label: '12 Annual Arc Themes', icon: Award, badge: '12' },
    { id: 'identity', label: 'Identity Base & Rules', icon: ShieldAlert, badge: 'Base' },
  ];

  return (
    <div className="min-h-screen bg-cream-canvas text-stone-900 flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900">
      
      {/* Top Main Navigation Bar */}
      <Header
        user={user}
        activeTab={activeTab as any}
        setActiveTab={(t) => setActiveTab(t as any)}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onOpenStickers={() => setStickersModalOpen(true)}
        onRefreshData={loadData}
        isDiagnosing={isDiagnosing}
      />

      {/* Main App Layout: Sidebar + Canvas Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        
        {/* RESPONSIVE NAVIGATION SIDEBAR (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 space-y-4">
          
          {/* Quick Operator Card */}
          <div className="bg-white border-2 border-stone-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex items-center justify-center font-display-punch text-xl font-bold border border-stone-800 shadow-2xs">
                ⚡
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] font-mono-code uppercase font-bold text-rose-600">
                  OPERATOR
                </div>
                <div className="font-serif-display font-bold text-slate-900 text-sm truncate">
                  {user.chaos_name}
                </div>
                <div className="text-[11px] font-mono-code text-stone-500 truncate">
                  Word: <span className="font-bold text-slate-800 uppercase">"{user.word_of_the_year}"</span>
                </div>
              </div>
            </div>

            {/* Quick action button for Mei */}
            <div className="mt-3 pt-3 border-t border-stone-200">
              <button
                onClick={handleRunDiagnostic}
                disabled={isDiagnosing}
                className="w-full py-2 px-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
                <span>{isDiagnosing ? 'Diagnosing...' : 'Run Mei Diagnostic'}</span>
              </button>
            </div>
          </div>

          {/* Nav List */}
          <div className="bg-white border border-stone-300 rounded-2xl p-2.5 shadow-xs space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono-code uppercase text-stone-400 font-bold tracking-wider">
              Navigation Flights
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Micro Dare & Sticker Quick Launcher */}
          <div className="bg-[#faf5eb] border border-amber-300/80 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-code font-bold uppercase text-amber-900">
                QUICK TOOLS
              </span>
              <Smile className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-[11px] text-amber-950 font-medium">
              Decorate your flight logs or stamp your emotional state.
            </p>
            <button
              onClick={() => setStickersModalOpen(true)}
              className="w-full py-2 bg-white border border-amber-300 hover:border-amber-400 text-amber-900 rounded-xl text-xs font-bold font-mono-code flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>✦ Open Sticker Sheets</span>
            </button>
          </div>

          {/* Small Manifesto Quote */}
          <div className="p-3 text-[11px] text-stone-500 italic font-serif-display border-l-2 border-stone-400 pl-3">
            "Ideas &gt; Rules. The system bends so you don't break."
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          
          {/* Active Tab View Rendering */}
          {activeTab === 'cover' && (
            <CoverArtView
              onOpenDaily={() => setActiveTab('daily')}
              wordOfTheYear={user.word_of_the_year}
              chaosName={user.chaos_name}
              slogan={user.slogan || "Boredom=Death"}
            />
          )}

          {activeTab === 'daily' && (
            <div className="space-y-8">
              {/* Daily OS 3-Part Component (Launch, Orbit, Landing / Rant Box) */}
              <DailyOSView
                entry={dailyEntry}
                onSaveEntry={handleSaveDailyEntry}
                onRunDiagnostic={handleRunDiagnostic}
                isDiagnosing={isDiagnosing}
                user={user}
                currentDate={currentDate}
                onDateChange={(d) => setCurrentDate(d)}
                onOpenStickers={() => setStickersModalOpen(true)}
              />

              {/* Mei Diagnostic Card right below */}
              <MeiDiagnosticCard
                snapshot={latestSnapshot}
                onTriggerDiagnosis={handleRunDiagnostic}
                isLoading={isDiagnosing}
                hasLatestEntryContent={Boolean(dailyEntry.evening_notes && dailyEntry.evening_notes.length > 5)}
              />

              {/* Chaos Trendline Teaser Card */}
              <div className="bg-gradient-to-r from-stone-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 border-2 border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="bg-rose-600 text-white text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded">
                      PATTERN MAP
                    </span>
                    <span className="text-xs text-amber-300 font-mono-code">DIPS &amp; SPIKES RADAR</span>
                  </div>
                  <h4 className="text-lg font-bold font-serif-display text-white">
                    30-Day Chaos Trajectory: Controlled vs. Uncontrolled
                  </h4>
                  <p className="text-xs text-stone-300">
                    See where your system operates in the sovereign sweet spot (4–7) versus reactionary overwhelm (8–10).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('trendline')}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold font-mono-code rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center space-x-1.5"
                >
                  <Activity className="w-4 h-4" />
                  <span>Open Chaos Trendline →</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'trendline' && (
            <div className="space-y-6">
              <ChaosTrendline
                entries={allEntries}
                currentDate={currentDate}
                onSelectDate={(selectedD) => {
                  setCurrentDate(selectedD);
                  setActiveTab('daily');
                  showToast(`Switched flight log date to ${selectedD}`);
                }}
              />
            </div>
          )}

          {activeTab === 'diagnostic' && (
            <div className="space-y-6">
              <MeiDiagnosticCard
                snapshot={latestSnapshot}
                onTriggerDiagnosis={handleRunDiagnostic}
                isLoading={isDiagnosing}
                hasLatestEntryContent={Boolean(dailyEntry.evening_notes && dailyEntry.evening_notes.length > 5)}
              />

              {/* Quick Jump back to write notes */}
              <div className="bg-white border border-stone-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-serif-display">
                    Need to feed more raw notes to the diagnostic mirror?
                  </h4>
                  <p className="text-xs text-stone-600">
                    Jump into today's Evening Rant Box to pour out your uncurated field notes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('daily')}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  Go to Rant Box →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <Big6GoalsTracker
              goals={goals}
              onAddGoal={handleAddGoal}
              onToggleGoal={handleToggleGoal}
              onDeleteGoal={handleDeleteGoal}
              antiGoals={antiGoals}
              onAddAntiGoal={handleAddAntiGoal}
              onToggleAntiGoal={handleToggleAntiGoal}
              onDeleteAntiGoal={handleDeleteAntiGoal}
            />
          )}

          {activeTab === 'weekly' && (
            <WeeklyDebriefView
              onSaveDebrief={async (debrief) => {
                try {
                  await api.saveWeeklyDebrief(debrief);
                  showToast("Weekly Flight Debrief committed.");
                } catch (e) {
                  showToast("Weekly Debrief saved locally.");
                }
              }}
            />
          )}

          {activeTab === 'money' && (
            <MonthlyMoneyMapView
              onSaveMoneyMap={async (m) => {
                try {
                  await api.saveMoneyMap(m);
                  showToast("Monthly Money Map saved.");
                } catch (e) {
                  showToast("Money Map saved locally.");
                }
              }}
            />
          )}

          {activeTab === 'themes' && (
            <ThemesGalleryView />
          )}

          {activeTab === 'identity' && (
            <IdentityProfileView
              user={user}
              onSaveProfile={handleSaveProfile}
            />
          )}
        </main>
      </div>

      {/* STICKERS SHEET MODAL */}
      <StickersSheetModal
        isOpen={stickersModalOpen}
        onClose={() => setStickersModalOpen(false)}
        onPasteStickerToNotes={(stk) => {
          const currentNotes = dailyEntry.evening_notes || '';
          const stamped = `${currentNotes}\n\n[STICKER STAMP: ${stk.emoji} ${stk.label}]`;
          handleSaveDailyEntry({ evening_notes: stamped });
          showToast(`Stamped ${stk.label} to field notes!`);
        }}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-mono-code flex items-center space-x-2 border border-stone-700 animate-fade-in print:hidden">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-stone-300 bg-[#faf7f0] py-6 px-4 text-center text-xs text-stone-500 font-mono-code mt-auto print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Life OS: Off*Script 2027.</span>
            <span>·</span>
            <span>Chaos Year Edition</span>
          </div>
          <div className="text-stone-400">
            Mei-Style Natural Language Personality Engine · No Toxic Positivity
          </div>
        </div>
      </footer>
    </div>
  );
}
