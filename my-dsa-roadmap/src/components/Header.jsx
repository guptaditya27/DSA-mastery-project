
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Menu, X, LogOut, User, Settings } from 'lucide-react';

const MANDATORY_FIELDS = ['name', 'username', 'email', 'profilePhoto', 'college', 'graduationYear', 'bio'];

function calcCompletion(profile) {
  if (!profile) return 0;
  let filled = 0;
  for (const f of MANDATORY_FIELDS) {
    if (profile[f] && String(profile[f]).trim().length > 0) filled++;
  }
  return Math.round((filled / MANDATORY_FIELDS.length) * 100);
}

export default function Header({ viewMode, setViewMode, totalProgress, onLogout, showMobileMenu, setShowMobileMenu, userProfile, onOpenProfile }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showGreenFlash, setShowGreenFlash] = useState(false);
  const dropdownRef = useRef(null);
  const prevCompletionRef = useRef(null);

  const completion = calcCompletion(userProfile);

  // Detect when completion hits 100% for the first time
  useEffect(() => {
    if (prevCompletionRef.current !== null && prevCompletionRef.current < 100 && completion === 100) {
      setShowGreenFlash(true);
      setTimeout(() => setShowGreenFlash(false), 2500);
    }
    prevCompletionRef.current = completion;
  }, [completion]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const ringColor = completion < 50 ? '#ef4444' : completion < 80 ? '#eab308' : completion < 100 ? '#3b82f6' : '#22c55e';
  const ringSize = 44;
  const ringRadius = 18;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference * (1 - completion / 100);

  const handleLogoutAndCloseMenu = () => {
    onLogout();
    setShowMobileMenu(false);
  };

  const initials = userProfile?.name ? userProfile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">DSA Master</h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button onClick={() => setViewMode("mindmap")} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === "mindmap" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>Mindmap</button>
              <button onClick={() => setViewMode("progress")} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === "progress" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>Progress</button>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">{totalProgress.completed}/{totalProgress.total}</span>
              <span className="text-xs text-gray-500">({totalProgress.percentage}%)</span>
            </div>

            {/* Profile Avatar with Completion Ring */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative flex items-center justify-center focus:outline-none group"
                title={`Profile ${completion}% complete`}
              >
                {/* SVG Completion Ring */}
                <svg className="-rotate-90" width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
                  {/* Background track */}
                  <circle 
                    cx={ringSize/2} cy={ringSize/2} r={ringRadius} 
                    fill="none" stroke="#e2e8f0" strokeWidth="2.5" 
                  />
                  {/* Progress arc */}
                  {completion < 100 && (
                    <circle 
                      cx={ringSize/2} cy={ringSize/2} r={ringRadius}
                      fill="none" stroke={ringColor} strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{ 
                        transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
                        filter: `drop-shadow(0 0 3px ${ringColor}60)`
                      }}
                    />
                  )}
                </svg>

                {/* Green flash animation at 100% */}
                {showGreenFlash && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.3, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 rounded-full border-2 border-emerald-400"
                    style={{ boxShadow: '0 0 20px rgba(34,197,94,0.6)' }}
                  />
                )}

                {/* Avatar circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-md group-hover:ring-purple-200 transition-all">
                    {userProfile?.profilePhoto ? (
                      <img src={userProfile.profilePhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold tracking-tight">{initials}</span>
                    )}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/80 overflow-hidden z-50"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">{userProfile?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">@{userProfile?.username || 'user'}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${completion}%`, backgroundColor: ringColor }}
                          />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: ringColor }}>{completion}%</span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => { setShowDropdown(false); onOpenProfile?.(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => { setShowDropdown(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t border-gray-200 overflow-hidden">
            <div className="p-4 flex flex-col gap-3">
              {/* Mobile Profile Card */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="relative">
                  <svg className="-rotate-90" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    {completion < 100 && (
                      <circle cx="20" cy="20" r="16" fill="none" stroke={ringColor} strokeWidth="2" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - completion / 100)}`}
                        style={{ transition: 'all 0.8s ease' }} />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden ring-1 ring-white">
                      {userProfile?.profilePhoto ? (
                        <img src={userProfile.profilePhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-[10px] font-bold">{initials}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{userProfile?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">@{userProfile?.username || 'user'}</p>
                </div>
                <button onClick={() => { onOpenProfile?.(); setShowMobileMenu(false); }} className="p-2 rounded-lg hover:bg-white text-gray-500 hover:text-purple-600 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setViewMode("mindmap"); setShowMobileMenu(false); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "mindmap" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-gray-700"}`}>Mindmap</button>
                <button onClick={() => { setViewMode("progress"); setShowMobileMenu(false); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "progress" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-gray-700"}`}>Progress</button>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Progress: {totalProgress.completed}/{totalProgress.total} ({totalProgress.percentage}%)</span>
              </div>
              <button onClick={handleLogoutAndCloseMenu} className="w-full mt-2 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}