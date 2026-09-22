import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, Compass, Flame, ShieldAlert, BookOpen, DollarSign, Award, Smile, RefreshCw, Activity, Image as ImageIcon, Share2 } from 'lucide-react';

export type ActiveTabType = 'daily' | 'trendline' | 'diagnostic' | 'goals' | 'identity' | 'weekly' | 'money' | 'themes' | 'cover';

interface HeaderProps {
  user: UserProfile;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  onOpenStickers: () => void;
  onOpenShare?: () => void;
  onRefreshData?: () => void;
  isDiagnosing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  currentDate,
  setCurrentDate,
  onOpenStickers,
  onOpenShare,
  onRefreshData,
  isDiagnosing = false
}) => {
  return (
    <header className="border-b border-stone-300 bg-[#faf7f0]/95 backdrop-blur-md sticky top-0 z-40 shadow-xs print:hidden">
      {/* Top Banner Tag */}
      <div className="bg-[#0f172a] text-white px-4 py-1.5 text-xs font-mono-code flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="tracking-widest uppercase font-bold text-rose-400">LIFE OS · 2027</span>
          <span className="text-stone-400 hidden sm:inline">|</span>
          <span className="text-stone-300 hidden sm:inline">OFF SCRIPT · CHAOS YEAR EDITION</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-amber-400 hidden md:inline">WORD: <strong>"{user.word_of_the_year}"</strong></span>
          <span className="bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-mono-code shadow-xs">
            SLOGAN: "{user.slogan || 'Boredom=Death'}"
          </span>
          <span className="bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase hidden sm:inline">
            NOT A VIBE BOARD
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Identity & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex items-center justify-center font-display-punch text-xl font-bold shadow-sm border border-stone-800">
                ⚡
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-slate-900 font-display-punch tracking-tight">
                    2027 Life OS <span className="text-rose-600 italic font-serif-display font-normal">Off Script</span>
                  </h1>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-300 font-mono-code">
                    v2.7
                  </span>
                </div>
                <p className="text-xs text-stone-600 flex items-center gap-1.5 font-medium">
                  <span>Operated by:</span>
                  <button 
                    onClick={() => setActiveTab('identity')}
                    className="underline text-slate-900 font-semibold hover:text-rose-600 transition-colors"
                    title="Click to edit identity & core values"
                  >
                    {user.chaos_name || "Unruly Sovereign"}
                  </button>
                  <span className="text-stone-300">·</span>
                  <span className="text-rose-600 font-bold font-mono-code text-[11px] tracking-wide hidden sm:inline">
                    "{user.slogan || 'Boredom=Death'}"
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Date Picker + Quick Action Pills */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 shadow-xs">
              <label htmlFor="active-date-picker" className="text-[11px] font-mono-code text-stone-500 mr-2 uppercase tracking-wider">
                Log Date:
              </label>
              <input
                id="active-date-picker"
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="text-xs font-semibold text-slate-900 bg-transparent outline-none cursor-pointer font-mono-code"
              />
            </div>

            <button
              id="header-stickers-btn"
              onClick={onOpenStickers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 hover:border-rose-400 text-slate-800 hover:text-rose-600 rounded-lg shadow-xs transition-colors"
              title="Open digital sticker sheets to drag & drop or paste"
            >
              <Smile className="w-3.5 h-3.5 text-rose-500" />
              <span>Stickers</span>
            </button>

            {onOpenShare && (
              <button
                id="header-share-btn"
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg shadow-xs transition-all"
                title="Share your Life OS or Daily Flight Log to Social Media"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            )}

            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isDiagnosing}
                className="p-1.5 text-stone-500 hover:text-slate-900 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 transition-colors"
                title="Refresh database state"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'daily'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Daily OS</span>
          </button>

          <button
            onClick={() => setActiveTab('trendline')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'trendline'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Chaos Trendline</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'diagnostic'
                ? 'bg-rose-600 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mei Diagnostic (Big 5 & Sassy Mirror)</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'goals'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Big 6 Goals</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'weekly'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>Weekly Flight Debrief</span>
          </button>

          <button
            onClick={() => setActiveTab('money')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'money'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Money Map</span>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'themes'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>12 Themes</span>
          </button>

          <button
            onClick={() => setActiveTab('identity')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              activeTab === 'identity'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
            <span>Identity Base</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
