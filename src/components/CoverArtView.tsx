import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Flame, Compass, Heart, Coffee, Disc } from 'lucide-react';

interface CoverArtViewProps {
  onOpenDaily: () => void;
  wordOfTheYear?: string;
  chaosName?: string;
  slogan?: string;
}

export const CoverArtView: React.FC<CoverArtViewProps> = ({
  onOpenDaily,
  wordOfTheYear = "FERAL",
  chaosName = "Unruly Sovereign",
  slogan = "Boredom=Death"
}) => {
  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-mono-code border border-stone-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-bold text-rose-400">PLANNER JACKET · OFFICIAL COVER</span>
        </div>
        <span className="text-amber-300">CHAOS YEAR EDITION</span>
      </div>

      {/* Main Cover Display Card */}
      <div className="relative bg-[#faf5eb] border-4 border-stone-900 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-stone-900">
        {/* Ink spatter and doodle accents */}
        <div className="absolute top-4 left-4 text-3xl select-none opacity-80 animate-bounce">🛸</div>
        <div className="absolute top-6 right-6 text-3xl select-none opacity-90">💖</div>
        <div className="absolute bottom-6 left-6 text-3xl select-none opacity-80">☕</div>
        <div className="absolute bottom-6 right-6 text-3xl select-none opacity-80">⏰</div>

        {/* Decorative background stamps */}
        <div className="text-center space-y-4 relative z-10 max-w-xl mx-auto">
          
          {/* Year Header */}
          <div className="inline-block px-4 py-1.5 bg-stone-900 text-white rounded-full text-xs font-mono-code tracking-widest uppercase font-bold shadow-md">
            ✦ YEAR OF THE UNRULY ✦
          </div>

          {/* Big 2027 Display */}
          <div className="font-display-punch text-6xl sm:text-8xl font-black tracking-tighter text-[#1e293b] drop-shadow-sm select-none">
            2027
          </div>

          {/* Hand-drawn Script Title */}
          <div className="relative -mt-4 sm:-mt-6">
            <h1 className="font-serif-display text-4xl sm:text-6xl font-black italic text-rose-600 drop-shadow-sm transform -rotate-2">
              Life OS
            </h1>
            <div className="font-display-punch text-3xl sm:text-5xl font-extrabold text-[#0284c7] tracking-tight transform rotate-1 mt-1">
              Off*Script
            </div>
            <div className="inline-block bg-stone-900 text-amber-300 font-mono-code font-bold text-sm sm:text-base px-4 py-1 rounded-md tracking-wider uppercase mt-2 shadow-sm border border-stone-700">
              PLANNER · COMPANION APP
            </div>
            {/* Prominent Slogan Badge */}
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-mono-code font-black text-xs sm:text-sm rounded-full tracking-wider uppercase shadow-md transform -rotate-1">
                <span>⚡</span>
                <span>SLOGAN: "{slogan}"</span>
              </span>
            </div>
          </div>

          {/* Core Philosophy Sub-tag */}
          <div className="pt-1">
            <p className="text-xs sm:text-sm font-bold font-mono-code text-stone-800 uppercase tracking-wide">
              IDEAS &gt; RULES · {slogan.toUpperCase()} · PLAY ANYWAY
            </p>
            <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 italic font-serif-display">
              A dynamic self-relationship operating system with Mei-style diagnostic honesty and zero toxic positivity.
            </p>
          </div>

          {/* Interactive Doodles Row */}
          <div className="py-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold font-mono-code">
            <span className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 shadow-2xs flex items-center gap-1">
              <span>🔥</span> The Rant Box
            </span>
            <span className="px-3 py-1 bg-sky-100 border border-sky-300 rounded-full text-sky-900 shadow-2xs flex items-center gap-1">
              <span>🪞</span> Sassy Mirror
            </span>
            <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-900 shadow-2xs flex items-center gap-1">
              <span>🎯</span> Big 6 Goals
            </span>
            <span className="px-3 py-1 bg-rose-100 border border-rose-300 rounded-full text-rose-900 shadow-2xs flex items-center gap-1">
              <span>⚡</span> 30 Sub-Traits
            </span>
          </div>

          {/* User Customization Stamp */}
          <div className="bg-white/80 border-2 border-dashed border-stone-400 rounded-2xl p-4 max-w-sm mx-auto shadow-inner text-left text-xs space-y-1">
            <div className="flex justify-between text-[11px] font-mono-code text-stone-500">
              <span>OPERATOR:</span>
              <span className="font-bold text-slate-900">{chaosName}</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono-code text-stone-500">
              <span>OFFICIAL SLOGAN:</span>
              <span className="font-bold text-rose-700 font-mono-code uppercase">"{slogan}"</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono-code text-stone-500">
              <span>WORD OF THE YEAR:</span>
              <span className="font-bold text-rose-600 uppercase">"{wordOfTheYear}"</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono-code text-stone-500">
              <span>EDITION:</span>
              <span className="font-semibold text-stone-700">Official Physical / Digital Hybrid</span>
            </div>
          </div>

          {/* Open Planner Action */}
          <div className="pt-4">
            <button
              onClick={onOpenDaily}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-display-punch font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              <span>Open Daily OS & Field Notes</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

        </div>
      </div>

      {/* Philosophy Callout Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-2xs">
          <div className="font-bold text-slate-900 font-display-punch mb-1 text-sm flex items-center gap-1.5">
            <span>🛸</span> 01. The Launch
          </div>
          <p className="text-stone-600">
            One morning intention, one persona stance, strict top 3 priorities, and a daily anchor question from 365 unofficial chaos holidays.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-2xs">
          <div className="font-bold text-slate-900 font-display-punch mb-1 text-sm flex items-center gap-1.5">
            <span>🧭</span> 02. The Orbit
          </div>
          <p className="text-stone-600">
            A midday gut check and law-abiding micro-dare adventure ($0–$20) to shatter monotony and remind you that you are alive.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-300 shadow-2xs">
          <div className="font-bold text-slate-900 font-display-punch mb-1 text-sm flex items-center gap-1.5">
            <span>🪞</span> 03. The Landing (Mei Engine)
          </div>
          <p className="text-stone-600">
            The evening Rant Box feeds directly into natural language processing to extract Big 5 OCEAN traits, stress spikes, and honest AI mirror feedback.
          </p>
        </div>
      </div>
    </div>
  );
};
