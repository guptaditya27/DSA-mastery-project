import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, CheckCircle2, RotateCcw, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { 
  login, register, googleSignIn, checkUsernameApi, 
  sendLoginOtpApi, verifyLoginOtpApi, sendResetOtpApi, resetPasswordApi 
} from '../api';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('LOGIN'); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); 
  
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) timer = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (mode !== 'SIGNUP' || !username) {
        setUsernameStatus(null);
        return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        setUsernameStatus('invalid');
        return;
    }
    
    setUsernameStatus('checking');
    const delay = setTimeout(async () => {
        try {
            const res = await checkUsernameApi(username);
            setUsernameStatus(res.available ? 'available' : 'taken');
        } catch (err) {
            setUsernameStatus(null);
        }
    }, 500);
    return () => clearTimeout(delay);
  }, [username, mode]);

  if (!isOpen) return null;

  const switchMode = (newMode) => { setMode(newMode); setError(""); setMessage(""); };

  const handleStandardLogin = async () => {
    if (!email || !password) return setError("Fill all fields");
    setIsLoading(true); setError("");
    try {
      const data = await login(email, password); 
      onClose();
      if (onLogin) onLogin(data.user);
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !username) return setError("Fill all fields");
    if (usernameStatus !== 'available') return setError("Username format invalid or unavailable");
    setIsLoading(true); setError("");
    try {
      await register(name, email, password, username);
      setMessage("Registration successful! You can now log in.");
      switchMode('LOGIN');
    } catch (err) { setError(err.response?.data?.message || 'Signup failed'); }
    setIsLoading(false);
  };

  const handleSendOtp = async (isReset = false) => {
    if (!email) return setError("Enter your registered email");
    if (cooldown > 0) return setError(`Wait ${cooldown}s before resending`);
    setIsLoading(true); setError(""); setMessage("");
    try {
      if (isReset) {
         await sendResetOtpApi(email);
         switchMode('RESET_PASS');
      } else {
         await sendLoginOtpApi(email);
         switchMode('VERIFY_OTP');
      }
      setMessage("OTP dispatched to your email");
      setCooldown(60);
    } catch (err) { setError(err.response?.data?.message || 'Failed to send OTP'); }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Enter OTP Code");
    setIsLoading(true); setError("");
    try {
      const data = await verifyLoginOtpApi(email, otp);
      onClose();
      if (onLogin) onLogin(data.user);
    } catch (err) { setError(err.response?.data?.message || 'Invalid OTP'); }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return setError("Fill all fields");
    if (newPassword.length < 6) return setError("Password too short");
    setIsLoading(true); setError("");
    try {
      await resetPasswordApi(email, otp, newPassword);
      setMessage("Password reset successful. Please log in.");
      switchMode('LOGIN');
    } catch (err) { setError(err.response?.data?.message || 'Failed to reset password'); }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (cred) => {
    try {
      const data = await googleSignIn(cred.credential);
      onClose();
      if (onLogin) onLogin(data.user);
    } catch (err) { setError(err.response?.data?.message || 'Google Auth failed'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-[#040814] ring-1 ring-indigo-500/20 shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)] rounded-[2rem] p-10 w-full max-w-[440px] z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        {mode !== 'LOGIN' && mode !== 'SIGNUP' && (
          <button className="absolute z-20 top-6 left-6 p-2 text-slate-500 hover:text-white transition-colors" onClick={() => switchMode('LOGIN')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <button className="absolute z-20 top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 mb-6 shadow-inner ring-1 ring-white/5 mx-auto">
             <Lock className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
           </div>
           <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 tracking-tight mb-2">
              {mode === 'LOGIN' && 'Welcome Back'}
              {mode === 'SIGNUP' && 'Join DSA Mastery'}
              {mode === 'LOGIN_OTP' && 'Login with OTP'}
              {mode === 'VERIFY_OTP' && 'Verify OTP'}
              {mode === 'FORGOT_PASS' && 'Forgot Password'}
              {mode === 'RESET_PASS' && 'Reset Password'}
           </h2>
           <p className="text-slate-400/80 text-sm font-medium">
               {mode === 'LOGIN' && 'Sign in to continue your DSA journey'}
               {mode === 'SIGNUP' && 'Start mastering algorithms today'}
               {mode === 'LOGIN_OTP' && "We'll send a one-time code to your email"}
               {mode === 'VERIFY_OTP' && 'Enter the 6-digit code sent to your email'}
               {mode === 'FORGOT_PASS' && 'Enter your email to receive a reset code'}
               {mode === 'RESET_PASS' && 'Enter your code and set a new password'}
            </p>
        </div>

        {error && <div className="text-rose-400 text-xs font-bold leading-relaxed bg-rose-500/10 ring-1 ring-rose-500/20 rounded-lg p-3 my-4">{error}</div>}
        {message && <div className="text-emerald-400 text-xs font-bold leading-relaxed bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-lg p-3 my-4">{message}</div>}

        <div className="relative z-10 space-y-4">
           {/* Form Inputs based on Mode */}
           {(mode === 'LOGIN' || mode === 'LOGIN_OTP' || mode === 'FORGOT_PASS' || mode === 'SIGNUP' || mode === 'VERIFY_OTP' || mode === 'RESET_PASS') && (
              <input
                type="text"
                placeholder={mode === 'LOGIN' ? "Email or Username" : "Your Email Address"}
                className={`w-full px-4 py-3.5 bg-[#040814] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-inner ${(mode === 'VERIFY_OTP' || mode === 'RESET_PASS') ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={mode === 'VERIFY_OTP' || mode === 'RESET_PASS'}
              />
           )}

           {mode === 'SIGNUP' && (
             <>
               <div className="relative">
                  <input type="text" placeholder="Choose a Username" className="w-full px-4 py-3.5 bg-[#040814] ring-1 ring-white/10 rounded-xl text-white pr-10 placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-inner" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} />
                  {usernameStatus === 'available' && <CheckCircle2 className="absolute right-3 top-3.5 w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"/>}
                  {usernameStatus === 'checking' && <RotateCcw className="absolute right-3 top-3.5 w-5 h-5 text-slate-500 animate-spin"/>}
               </div>
               {usernameStatus === 'invalid' && <p className="text-[10px] uppercase tracking-wide font-bold text-rose-500 px-1">3-20 lowercase letters, numbers, or underscores</p>}
               {usernameStatus === 'taken' && <p className="text-[10px] uppercase tracking-wide font-bold text-rose-500 px-1">USERNAME TAKEN</p>}
               {usernameStatus === 'available' && <p className="text-[10px] uppercase tracking-wide font-bold text-emerald-500 px-1">USERNAME AVAILABLE</p>}
               
               <input type="text" placeholder="Full Name" className="w-full px-4 py-3.5 bg-[#040814] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-inner" value={name} onChange={e => setName(e.target.value)} />
             </>
           )}

           {(mode === 'LOGIN' || mode === 'SIGNUP') && (
              <input type="password" placeholder="Password" className="w-full px-4 py-3.5 bg-[#0A0E17] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-inner" value={password} onChange={e => setPassword(e.target.value)} />
           )}

           {(mode === 'VERIFY_OTP' || mode === 'RESET_PASS') && (
              <div className="pt-2">
                <input type="text" placeholder="000000" maxLength={6} className="w-full px-4 py-3.5 bg-[#040814] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none text-center tracking-[0.5em] text-2xl font-bold font-mono focus:ring-indigo-500/50 transition-all shadow-inner" value={otp} onChange={e => setOtp(e.target.value)} />
              </div>
           )}

           {mode === 'RESET_PASS' && (
              <input type="password" placeholder="New Password" className="w-full px-4 py-3.5 bg-[#0A0E17] ring-1 ring-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-inner mt-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
           )}
           
           {/* Action Buttons */}
           {mode === 'LOGIN' && (
              <button onClick={handleStandardLogin} disabled={isLoading} className="w-full py-3.5 bg-white text-slate-950 font-bold tracking-tight rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] mt-4 disabled:opacity-50">
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
           )}

           {mode === 'SIGNUP' && (
              <button onClick={handleSignup} disabled={isLoading || usernameStatus !== 'available'} className="w-full py-3.5 bg-indigo-500 text-white font-bold tracking-tight rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] mt-4 disabled:opacity-50">
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
           )}

           {(mode === 'LOGIN_OTP' || mode === 'FORGOT_PASS') && (
              <button onClick={() => handleSendOtp(mode === 'FORGOT_PASS')} disabled={isLoading || cooldown > 0} className="w-full py-3.5 bg-white text-slate-950 font-bold tracking-tight rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4 disabled:opacity-50">
                {isLoading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
              </button>
           )}

           {mode === 'VERIFY_OTP' && (
              <button onClick={handleVerifyOtp} disabled={isLoading} className="w-full py-3.5 bg-emerald-500 text-slate-950 font-bold tracking-tight rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-4 disabled:opacity-50">
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </button>
           )}

           {mode === 'RESET_PASS' && (
              <button onClick={handleResetPassword} disabled={isLoading} className="w-full py-3.5 bg-emerald-500 text-slate-950 font-bold tracking-tight rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-4 disabled:opacity-50">
                {isLoading ? "Processing..." : "Reset Password"}
              </button>
           )}

        </div>

        {/* Auth Modifiers */}
        {mode === 'LOGIN' && (
           <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-xs font-bold tracking-widest uppercase gap-4">
                 <button className="text-slate-500 hover:text-white transition-colors" onClick={() => switchMode('LOGIN_OTP')}>Login with OTP</button>
                 <button className="text-indigo-400 hover:text-indigo-300 transition-colors" onClick={() => switchMode('FORGOT_PASS')}>Forgot Password?</button>
              </div>

              <div className="flex items-center gap-4 my-6 py-2">
                <div className="flex-1 h-px bg-white/5"></div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Or continue with</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              <div className="w-full bg-white rounded-xl overflow-hidden hover:opacity-90 ring-1 ring-white/10 transition-all p-1">
                <GoogleLogin onSuccess={handleGoogleSuccess} theme="outline" size="large" width="100%" text="signin_with" />
              </div>
           </div>
        )}

        {(mode === 'VERIFY_OTP' || mode === 'RESET_PASS') && (
            <div className="relative z-10 mt-8 text-center">
              <button disabled={cooldown > 0} className="text-slate-500 hover:text-white text-xs font-bold tracking-wide transition-colors disabled:opacity-50" onClick={() => handleSendOtp(mode === 'RESET_PASS')}>
                {cooldown > 0 ? `RESEND IN ${cooldown}s` : "RESEND OTP"}
              </button>
            </div>
        )}

        {(mode === 'LOGIN' || mode === 'SIGNUP') && (
            <div className="relative z-10 mt-8 text-center border-t border-white/5 pt-6">
              <button className="text-slate-500 hover:text-white text-xs font-bold tracking-wide transition-colors" onClick={() => switchMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}>
                {mode === 'LOGIN' ? "New here? Create an account" : "Already have an account? Sign in"}
              </button>
            </div>
        )}
      </motion.div>
    </div>
  );
}
