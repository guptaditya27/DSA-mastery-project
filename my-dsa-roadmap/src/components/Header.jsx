
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Menu, X, LogOut } from 'lucide-react';

export default function Header({ viewMode, setViewMode, totalProgress, onLogout, showMobileMenu, setShowMobileMenu }) {
  const handleLogoutAndCloseMenu = () => {
    onLogout();
    setShowMobileMenu(false);
  };

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
            <button onClick={onLogout} title="Logout" className="p-2 rounded-lg hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
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