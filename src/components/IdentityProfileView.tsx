import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldAlert, Save, Sparkles, User, Key, Flame } from 'lucide-react';

interface IdentityProfileViewProps {
  user: UserProfile;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
}

export const IdentityProfileView: React.FC<IdentityProfileViewProps> = ({
  user,
  onSaveProfile
}) => {
  const [chaosName, setChaosName] = useState(user.chaos_name || '');
  const [wordOfYear, setWordOfYear] = useState(user.word_of_the_year || '');
  const [slogan, setSlogan] = useState(user.slogan || 'Boredom=Death');
  const [chaosMantra, setChaosMantra] = useState(user.chaos_mantra || '');
  const [whatDonePretending, setWhatDonePretending] = useState(user.what_done_pretending || '');
  const [whatReadyToAdmit, setWhatReadyToAdmit] = useState(user.what_ready_to_admit || '');
  const [relationshipWithChaos, setRelationshipWithChaos] = useState(user.relationship_with_chaos || '');
  const [permissionGranted, setPermissionGranted] = useState(user.permission_granted || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      chaos_name: chaosName.trim(),
      word_of_the_year: wordOfYear.trim().toUpperCase(),
      slogan: slogan.trim(),
      chaos_mantra: chaosMantra.trim(),
      what_done_pretending: whatDonePretending.trim(),
      what_ready_to_admit: whatReadyToAdmit.trim(),
      relationship_with_chaos: relationshipWithChaos.trim(),
      permission_granted: permissionGranted.trim()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-stone-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="bg-rose-600 text-white text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded tracking-wider">
            IDENTITY ARCHITECTURE
          </span>
          <span className="text-xs text-stone-500 font-mono-code">GROUND ZERO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-slate-900 mt-1">
          Identity Base &amp; Self-Sovereignty
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Before tracking hours or organizing tasks, define who is running the machine and what rules you have officially burned.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity Tags */}
        <div className="bg-white rounded-2xl border border-stone-300 p-6 shadow-xs space-y-5">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="font-bold text-sm text-slate-900 font-display-punch uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-rose-600" />
              <span>Operator Coordinates</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Chaos Alias / Chosen Name:
              </label>
              <input
                type="text"
                value={chaosName}
                onChange={(e) => setChaosName(e.target.value)}
                placeholder="e.g. The Unruly Architect"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50/50 focus:outline-rose-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Word of the Year <span className="text-stone-400 font-normal font-mono-code">(one defiant word)</span>:
              </label>
              <input
                type="text"
                value={wordOfYear}
                onChange={(e) => setWordOfYear(e.target.value)}
                placeholder="e.g. UNGOVERNABLE, FERAL, TENDER, EXPANSIVE"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50/50 focus:outline-rose-500 font-mono-code uppercase font-bold text-rose-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Official Operational Slogan:
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder='e.g. Boredom=Death'
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50/50 focus:outline-rose-500 font-mono-code font-bold text-slate-900"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block font-mono-code">
                Planner mandate: Monotony is the true mortal hazard.
              </span>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">
                Personal Operating Mantra:
              </label>
              <input
                type="text"
                value={chaosMantra}
                onChange={(e) => setChaosMantra(e.target.value)}
                placeholder="e.g. An intention is not a prison. I am allowed to update the map."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50/50 focus:outline-rose-500 font-medium italic"
              />
            </div>
          </div>
        </div>

        {/* The Truth Box: What I'm Done Pretending */}
        <div className="bg-[#fffdfa] rounded-2xl border-2 border-rose-300/80 p-6 shadow-xs space-y-5">
          <div className="border-b border-rose-200 pb-3">
            <h3 className="font-bold text-sm text-slate-900 font-display-punch uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Unfiltered Truth Inventory</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              The Mei Diagnostic engine checks your daily rants against these core confessions.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-800 font-bold mb-1">
                1. What I am officially done pretending:
              </label>
              <textarea
                value={whatDonePretending}
                onChange={(e) => setWhatDonePretending(e.target.value)}
                placeholder="Pretending I enjoy networking breakfasts, that I can work 70 hours without spiraling, that I don't care about..."
                rows={3}
                className="w-full p-3 border border-stone-300 rounded-xl focus:outline-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                2. What I am finally ready to admit about myself:
              </label>
              <textarea
                value={whatReadyToAdmit}
                onChange={(e) => setWhatReadyToAdmit(e.target.value)}
                placeholder="I lose interest after the architecture phase, I need 10 hours of solitude every Sunday, I create best under..."
                rows={3}
                className="w-full p-3 border border-stone-300 rounded-xl focus:outline-rose-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                3. My redefined relationship with chaos:
              </label>
              <textarea
                value={relationshipWithChaos}
                onChange={(e) => setRelationshipWithChaos(e.target.value)}
                placeholder="Chaos is not my failure to be orderly. It is the unmapped terrain where real breakthroughs happen..."
                rows={2}
                className="w-full p-3 border border-stone-300 rounded-xl focus:outline-rose-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* The Irrevocable Permission Slip */}
        <div className="bg-[#faf5eb] border-2 border-dashed border-stone-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-rose-700">
              IRREVOCABLE PERMISSION SLIP
            </span>
            <span className="text-xs font-mono-code text-stone-500">SIGNED IN FULL CONSCIOUSNESS</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-stone-600 italic">
              "By operating the 2027 Life OS, I hereby grant myself irrevocable permission to:"
            </p>
            <textarea
              value={permissionGranted}
              onChange={(e) => setPermissionGranted(e.target.value)}
              placeholder="Change my mind without writing an apology memo, leave events early, cancel projects that feel dead, and sleep without earning it..."
              rows={3}
              className="w-full p-3 border border-stone-400 rounded-xl bg-white text-xs font-serif-display text-slate-900 focus:outline-stone-800"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Identity Coordinates Locked!' : 'Save Identity Base'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
