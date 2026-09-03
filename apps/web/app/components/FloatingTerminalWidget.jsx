'use client';

import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Sparkles, Send, Shield } from 'lucide-react';
import TerminalInterfaceTab from './TerminalInterfaceTab';

export default function FloatingTerminalWidget({ agents, departments, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  // Shortcut key listener (Ctrl + ` or Ctrl + K or ~)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Bottom-Right Terminal Launch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-14 right-4 z-40 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 group"
        title="Otvori AtlantidaOS CLI Terminal (Ctrl + ~)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <TerminalIcon className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-sans">CLI Terminal</span>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">Ctrl + ~</span>
      </button>

      {/* Slide-over Modal / Terminal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-5xl bg-slate-950 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Drawer Header */}
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200 font-sans text-sm">
                  AtlantidaOS v1.0 — Visitor CLI Terminal Overlay
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline font-sans">
                  Pritisnite <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ESC</kbd> ili kliknite <X className="w-3 h-3 inline" /> za zatvaranje
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 overflow-y-auto flex-1 bg-slate-950">
              <TerminalInterfaceTab
                agents={agents}
                departments={departments}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
