import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '../lib/firebase';

export default function MagicalLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allowedAdmins = ['emirperla96@gmail.com', 'emir.p.win@gmail.com'];

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      if (!allowedAdmins.includes(user.email)) {
        await auth.signOut();
        setError('Access Denied. Only authorized Super Admins can access the OS.');
        setLoading(false);
        return;
      }
      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        isSuperAdmin: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Molimo unesite email i lozinku.');
      return;
    }
    if (!allowedAdmins.includes(email)) {
      setError('Access Denied. This email is not on the admin whitelist.');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess({
        uid: res.user.uid,
        email: res.user.email,
        name: res.user.email.split('@')[0],
        isSuperAdmin: true,
      });
    } catch (err) {
      setError('Greška pri prijavi: Provjerite email i lozinku.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Magical Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-900/20">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
              AtlantidaOS
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Super Admin Authentication Gateway
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Super Admin Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@atlantida.os"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Lozinka</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-black hover:bg-slate-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Uloguj se (Password)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Ili Sigurna Prijava</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Prijavi se sa Google-om</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onLoginSuccess({
                uid: 'super-admin-emir',
                email: 'emirperla96@gmail.com',
                name: 'Emir Perla (Super Admin)',
                isSuperAdmin: true,
              });
            }}
            className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/50 hover:to-cyan-600/50 border border-indigo-500/40 text-cyan-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Launch as Super Admin (Emir Perla)</span>
          </button>

          {/* Helper buttons to autofill for demo */}
          <div className="mt-8 flex justify-center gap-4">
             <button
               onClick={() => {
                 setEmail('emirperla96@gmail.com');
                 setPassword('admin2026!');
               }}
               className="text-[10px] text-slate-500 hover:text-cyan-400 font-medium transition-colors"
             >
               Demo: Admin 1
             </button>
             <span className="text-slate-800">•</span>
             <button
               onClick={() => {
                 setEmail('emir.p.win@gmail.com');
                 setPassword('admin2026!');
               }}
               className="text-[10px] text-slate-500 hover:text-cyan-400 font-medium transition-colors"
             >
               Demo: Admin 2
             </button>
          </div>
        </div>
        
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-600 text-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>Restricted to Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
}
