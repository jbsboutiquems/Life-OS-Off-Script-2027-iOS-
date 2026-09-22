import { UserProfile, Goal, AntiGoal, DailyEntry, PersonalitySnapshot, WeeklyFlightDebrief, MonthlyMoneyMap } from '../types';

const defaultAntiGoals: AntiGoal[] = [
  {
    id: "antigoal_01",
    title: "Apologizing before asking a straightforward question in team chats",
    category: "People Pleasing",
    why_stopped: "Shrinking myself to make normal communication feel like an inconvenience.",
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: "antigoal_02",
    title: "Saying 'yes' on the spot to non-urgent commitments without sleeping on it",
    category: "Boundary",
    why_stopped: "Immediate compliance is fear masquerading as helpfulness.",
    is_completed: true,
    created_at: new Date().toISOString()
  },
  {
    id: "antigoal_03",
    title: "Checking work notifications and email before getting out of bed",
    category: "Time Theft",
    why_stopped: "Hands over the keys of my nervous system to strangers before sunrise.",
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: "antigoal_04",
    title: "Polishing drafts for hours when 80% clarity was reached 3 hours ago",
    category: "Perfectionism",
    why_stopped: "Procrastination dressed in bespoke calligraphy.",
    is_completed: false,
    created_at: new Date().toISOString()
  }
];

export const api = {
  async getUser(): Promise<UserProfile> {
    try {
      const res = await fetch('/api/user');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API unavailable, reading local user', e);
    }
    const local = localStorage.getItem('lifeos_user');
    if (local) return JSON.parse(local);
    return {
      id: "user_chaos_01",
      chaos_name: "The Unruly Alchemist",
      word_of_the_year: "FERAL",
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
    };
  },

  async updateUser(user: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem('lifeos_user', JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.warn('API error, saving local user', e);
    }
    const current = await this.getUser();
    const updated = { ...current, ...user, updated_at: new Date().toISOString() };
    localStorage.setItem('lifeos_user', JSON.stringify(updated));
    return updated;
  },

  async getGoals(): Promise<Goal[]> {
    try {
      const res = await fetch('/api/goals');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, reading local goals', e);
    }
    const local = localStorage.getItem('lifeos_goals');
    return local ? JSON.parse(local) : [];
  },

  async createGoal(goalData: Omit<Goal, 'id' | 'created_at' | 'is_completed'>): Promise<Goal> {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, saving local goal', e);
    }
    const goals = await this.getGoals();
    if (goals.length >= 6) {
      throw new Error("Strict maximum of 6 goals allowed in the Big 6 Os!");
    }
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      is_completed: false,
      created_at: new Date().toISOString()
    };
    const updated = [...goals, newGoal];
    localStorage.setItem('lifeos_goals', JSON.stringify(updated));
    return newGoal;
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, updating local goal', e);
    }
    const goals = await this.getGoals();
    const updated = goals.map(g => g.id === id ? { ...g, ...updates } : g);
    localStorage.setItem('lifeos_goals', JSON.stringify(updated));
    return updated.find(g => g.id === id)!;
  },

  async deleteGoal(id: string): Promise<void> {
    try {
      await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API error, deleting local goal', e);
    }
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem('lifeos_goals', JSON.stringify(filtered));
  },

  async getAntiGoals(): Promise<AntiGoal[]> {
    try {
      const res = await fetch('/api/anti-goals');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, reading local anti-goals', e);
    }
    const local = localStorage.getItem('lifeos_antigoals');
    return local ? JSON.parse(local) : defaultAntiGoals;
  },

  async createAntiGoal(antiGoalData: Omit<AntiGoal, 'id' | 'created_at' | 'is_completed'> & { is_completed?: boolean }): Promise<AntiGoal> {
    try {
      const res = await fetch('/api/anti-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(antiGoalData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, saving local anti-goal', e);
    }
    const antiGoals = await this.getAntiGoals();
    const newAntiGoal: AntiGoal = {
      ...antiGoalData,
      id: `antigoal_${Date.now()}`,
      is_completed: Boolean(antiGoalData.is_completed),
      created_at: new Date().toISOString()
    };
    const updated = [...antiGoals, newAntiGoal];
    localStorage.setItem('lifeos_antigoals', JSON.stringify(updated));
    return newAntiGoal;
  },

  async updateAntiGoal(id: string, updates: Partial<AntiGoal>): Promise<AntiGoal> {
    try {
      const res = await fetch(`/api/anti-goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, updating local anti-goal', e);
    }
    const antiGoals = await this.getAntiGoals();
    const updated = antiGoals.map(ag => ag.id === id ? { ...ag, ...updates } : ag);
    localStorage.setItem('lifeos_antigoals', JSON.stringify(updated));
    return updated.find(ag => ag.id === id)!;
  },

  async deleteAntiGoal(id: string): Promise<void> {
    try {
      await fetch(`/api/anti-goals/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API error, deleting local anti-goal', e);
    }
    const antiGoals = await this.getAntiGoals();
    const filtered = antiGoals.filter(ag => ag.id !== id);
    localStorage.setItem('lifeos_antigoals', JSON.stringify(filtered));
  },

  async getAllDailyEntries(): Promise<DailyEntry[]> {
    try {
      const res = await fetch('/api/entries');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, reading all entries', e);
    }
    // Fallback: search localStorage keys
    const entries: DailyEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lifeos_entry_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '');
          if (item && item.entry_date) entries.push(item);
        } catch {
          // ignore
        }
      }
    }
    return entries;
  },

  async getDailyEntry(dateStr: string): Promise<DailyEntry | null> {
    try {
      const res = await fetch(`/api/entries/${dateStr}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, reading local entry', e);
    }
    const local = localStorage.getItem(`lifeos_entry_${dateStr}`);
    return local ? JSON.parse(local) : null;
  },

  async saveDailyEntry(entry: Partial<DailyEntry> & { entry_date: string }): Promise<DailyEntry> {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const saved = await res.json();
        localStorage.setItem(`lifeos_entry_${entry.entry_date}`, JSON.stringify(saved));
        return saved;
      }
    } catch (e) {
      console.warn('API error, saving local entry', e);
    }
    const existing = (await this.getDailyEntry(entry.entry_date)) || {
      id: `entry_${entry.entry_date}`,
      entry_date: entry.entry_date,
      morning_intention: '',
      today_i_am: '',
      anchor_question_answer: '',
      priorities: ['', '', ''],
      midday_checkin: '',
      micro_dare_completed: false,
      evening_notes: '',
      chaos_score: 5,
      updated_at: new Date().toISOString()
    };
    const saved = { ...existing, ...entry, updated_at: new Date().toISOString() };
    localStorage.setItem(`lifeos_entry_${entry.entry_date}`, JSON.stringify(saved));
    return saved as DailyEntry;
  },

  async runMeiDiagnostic(params: {
    entry_date: string;
    evening_notes: string;
    morning_intention?: string;
    midday_checkin?: string;
    chaos_score?: number;
    user_profile?: UserProfile;
  }): Promise<PersonalitySnapshot> {
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const snapshot = await res.json();
        const existingSnapshots = await this.getSnapshots();
        localStorage.setItem('lifeos_snapshots', JSON.stringify([snapshot, ...existingSnapshots.slice(0, 49)]));
        return snapshot;
      }
    } catch (e) {
      console.warn('API error during diagnostic, using local engine fallback', e);
    }

    // Local client-side fallback
    const notes = (params.evening_notes || '').toLowerCase();
    const wordCount = notes.split(/\s+/).filter(Boolean).length;
    const hasBurnout = /tired|exhaust|drain|fumes|overwhelm|can't|heavy|collapse|numb|burnout|anxious/i.test(notes);
    const hasDefiance = /refuse|no|done|stop|script|quit|hell|fake|pretend|furious/i.test(notes);

    const snapshot: PersonalitySnapshot = {
      id: `snap_${Date.now()}`,
      entry_id: `entry_${params.entry_date}`,
      snapshot_date: params.entry_date,
      openness: Math.min(95, 65 + (wordCount > 30 ? 15 : 5) + (hasDefiance ? 10 : 0)),
      conscientiousness: 64,
      extraversion: 48,
      agreeableness: hasDefiance ? 45 : 62,
      neuroticism: hasBurnout ? 78 : 55,
      detected_mood: hasBurnout ? "Running on Low Battery & Defiance" : "Sharp, Observant & Grounded",
      burnout_risk: hasBurnout ? "High" : "Low",
      self_sabotage_alert: "Rationalizing overwork as 'necessary discipline' instead of acknowledging mental fatigue.",
      contradiction_callout: "You wrote that you're done pretending, yet you spent all afternoon editing your thoughts before letting them breathe.",
      ai_feedback: "Here is your honest mirror: You showed up with plenty of energy to criticize yourself, but zero willingness to just let the day be messy. You don't have to turn every mundane hour into a breakthrough. Take the armor off. It's safe.",
      micro_dare: "Tomorrow, write with your non-dominant hand for 3 minutes and refuse to apologize for being clumsy.",
      sub_traits: [
        { name: "Imagination", dimension: "Openness", score: 86, trait_description: "Rich internal narrative" },
        { name: "Intellect", dimension: "Openness", score: 80, trait_description: "Appetite for re-framing mental premises" },
        { name: "Self-Discipline", dimension: "Conscientiousness", score: 60, trait_description: "Grit amidst fatigue" },
        { name: "Assertiveness", dimension: "Extraversion", score: 55, trait_description: "Direct boundary awareness" },
        { name: "Honesty", dimension: "Agreeableness", score: 88, trait_description: "Uncurated truth-seeking" },
        { name: "Anxiety", dimension: "Neuroticism", score: hasBurnout ? 78 : 54, trait_description: "Tension between control and freedom" }
      ]
    };

    const existingSnapshots = await this.getSnapshots();
    localStorage.setItem('lifeos_snapshots', JSON.stringify([snapshot, ...existingSnapshots.slice(0, 49)]));
    return snapshot;
  },

  async getSnapshots(): Promise<PersonalitySnapshot[]> {
    try {
      const res = await fetch('/api/snapshots');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, reading local snapshots', e);
    }
    const local = localStorage.getItem('lifeos_snapshots');
    return local ? JSON.parse(local) : [];
  },

  async getWeeklyDebrief(weekNum: number): Promise<WeeklyFlightDebrief | null> {
    try {
      const res = await fetch('/api/flight-debriefs');
      if (res.ok) {
        const list = await res.json();
        const found = list.find((d: any) => d.week_number === weekNum);
        if (found) return found;
      }
    } catch (e) {
      console.warn('API error, reading local debrief', e);
    }
    const local = localStorage.getItem(`lifeos_debrief_${weekNum}`);
    return local ? JSON.parse(local) : null;
  },

  async saveWeeklyDebrief(debrief: WeeklyFlightDebrief): Promise<WeeklyFlightDebrief> {
    try {
      const res = await fetch('/api/flight-debriefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debrief)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, saving local debrief', e);
    }
    localStorage.setItem(`lifeos_debrief_${debrief.week_number}`, JSON.stringify(debrief));
    return debrief;
  },

  async getMoneyMap(year: number, month: number): Promise<MonthlyMoneyMap | null> {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    try {
      const res = await fetch(`/api/money-maps/${key}`);
      if (res.ok) {
        const data = await res.json();
        if (data) return data;
      }
    } catch (e) {
      console.warn('API error, reading local money map', e);
    }
    const local = localStorage.getItem(`lifeos_moneymap_${key}`);
    return local ? JSON.parse(local) : null;
  },

  async saveMoneyMap(map: MonthlyMoneyMap): Promise<MonthlyMoneyMap> {
    const key = `${map.year}-${String(map.month).padStart(2, '0')}`;
    try {
      const res = await fetch('/api/money-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(map)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, saving local money map', e);
    }
    localStorage.setItem(`lifeos_moneymap_${key}`, JSON.stringify(map));
    return map;
  }
};
