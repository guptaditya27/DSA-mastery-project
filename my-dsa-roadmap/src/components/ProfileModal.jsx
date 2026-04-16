import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, User, Mail, GraduationCap, MapPin, Phone, 
  Linkedin, Github, Code2, BookOpen, Save, CheckCircle2,
  Sparkles, Globe
} from 'lucide-react';

const MANDATORY_FIELDS = ['name', 'username', 'email', 'profilePhoto', 'college', 'graduationYear', 'bio'];

function calcCompletion(profile) {
  let filled = 0;
  for (const f of MANDATORY_FIELDS) {
    if (profile[f] && String(profile[f]).trim().length > 0) filled++;
  }
  return Math.round((filled / MANDATORY_FIELDS.length) * 100);
}

const LANGUAGES = ['', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Rust', 'TypeScript'];

export default function ProfileModal({ isOpen, onClose, profile, onSave }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (profile && isOpen) {
      setForm({
        name: profile.name || '',
        username: profile.username || '',
        email: profile.email || '',
        profilePhoto: profile.profilePhoto || '',
        college: profile.college || '',
        graduationYear: profile.graduationYear || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        city: profile.city || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        leetcodeUsername: profile.leetcodeUsername || '',
        preferredLanguage: profile.preferredLanguage || '',
      });
      setPhotoPreview(profile.profilePhoto || '');
      setSaved(false);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const completion = calcCompletion(form);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 300 * 1024) {
      alert('Image must be under 300KB. Please compress or resize it.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setForm(f => ({ ...f, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save profile');
    }
    setSaving(false);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  // Completion ring colors
  const ringColor = completion < 50 ? '#ef4444' : completion < 80 ? '#eab308' : completion < 100 ? '#3b82f6' : '#22c55e';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-[#040814] ring-1 ring-indigo-500/20 shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)] rounded-[2rem] w-full max-w-[560px] max-h-[90vh] overflow-hidden z-10"
      >
        {/* Ambient glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Close button */}
        <button className="absolute z-20 top-5 right-5 p-2 text-slate-500 hover:text-white transition-colors" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto max-h-[90vh] p-8 pb-6 custom-scrollbar">
          {/* Profile Photo + Completion Ring */}
          <div className="relative z-10 flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {/* SVG Completion Ring */}
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                {/* Background track */}
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                {/* Progress arc */}
                <circle 
                  cx="60" cy="60" r="54" fill="none" 
                  stroke={ringColor}
                  strokeWidth="4" 
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - completion / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${ringColor}50)` }}
                />
              </svg>

              {/* Photo circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 ring-2 ring-white/10 overflow-hidden flex items-center justify-center shadow-inner">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-600" />
                  )}
                </div>
              </div>

              {/* Camera overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-24 h-24 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>

            {/* Completion percentage badge */}
            <div className="mt-3 flex items-center gap-2">
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                style={{ 
                  background: `${ringColor}15`, 
                  color: ringColor, 
                  border: `1px solid ${ringColor}30` 
                }}
              >
                {completion === 100 ? (
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Profile Complete</span>
                ) : (
                  `${completion}% Complete`
                )}
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-2 font-medium">Click photo to upload (max 300KB)</p>
          </div>

          {/* Section: Essential Info */}
          <div className="relative z-10 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Essential Information
              </h3>
              <div className="space-y-3">
                <InputField icon={User} label="Full Name" value={form.name} onChange={set('name')} placeholder="Your full name" />
                <InputField icon={Mail} label="Username" value={form.username} disabled className="opacity-50 cursor-not-allowed" />
                <InputField icon={Mail} label="Email" value={form.email} disabled className="opacity-50 cursor-not-allowed" />
                <InputField icon={GraduationCap} label="College / University" value={form.college} onChange={set('college')} placeholder="e.g. IIT Delhi" />
                <InputField icon={GraduationCap} label="Graduation Year" value={form.graduationYear} onChange={set('graduationYear')} placeholder="e.g. 2025" />
                
                {/* Bio textarea */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Bio / Summary
                  </label>
                  <textarea
                    value={form.bio || ''}
                    onChange={set('bio')}
                    placeholder="A short summary about yourself..."
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0A0E17] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm resize-none"
                  />
                  <p className="text-right text-[10px] text-slate-600 mt-1 font-medium">{(form.bio || '').length}/200</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Additional Details</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Section: Optional Info */}
            <div className="space-y-3">
              <InputField icon={Phone} label="Mobile Number" value={form.phone} onChange={set('phone')} placeholder="+91 9876543210" />
              <InputField icon={MapPin} label="City / Location" value={form.city} onChange={set('city')} placeholder="e.g. Delhi, India" />
              <InputField icon={Linkedin} label="LinkedIn URL" value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/..." />
              <InputField icon={Github} label="GitHub URL" value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/..." />
              <InputField icon={Globe} label="LeetCode Username" value={form.leetcodeUsername} onChange={set('leetcodeUsername')} placeholder="your_leetcode_id" />
              
              {/* Language dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Code2 className="w-3 h-3" /> Preferred Language
                </label>
                <select
                  value={form.preferredLanguage || ''}
                  onChange={set('preferredLanguage')}
                  className="w-full px-4 py-3 bg-[#0A0E17] ring-1 ring-white/10 rounded-xl text-white focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0A0E17]">Select language...</option>
                  {LANGUAGES.filter(Boolean).map(lang => (
                    <option key={lang} value={lang} className="bg-[#0A0E17]">{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 pb-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3.5 rounded-xl font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 ${
                  saved 
                    ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                    : 'bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                } disabled:opacity-50`}
              >
                {saving ? (
                  'Saving...'
                ) : saved ? (
                  <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</>
                ) : (
                  <><Save className="w-5 h-5" /> Save Profile</>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }
      `}</style>
    </div>
  );
}

// Reusable premium input field
function InputField({ icon: Icon, label, value, onChange, placeholder, disabled, className = '' }) {
  return (
    <div className={className}>
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 bg-[#0A0E17] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
