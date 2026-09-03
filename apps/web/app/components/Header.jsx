import React, { useState, useRef, useEffect } from 'react';
import { Shield, Activity, Cpu, Database, Zap, Sparkles, Terminal, Rocket, CreditCard, Users, Lock, UserCheck, FileSpreadsheet, LogIn, UserPlus, LogOut, Github, Bot, Wrench, Download, ChevronDown, User } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, activeAgentCount, totalAgents, systemStatus, onOpenSimulator, currentUser, onSwitchUser, onOpenPaywall, onOpenAuth, onLogout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [

    { id: 'autonomous-company', label: 'Autonomous AI Company (20 Workers)', icon: Bot, highlight: true },
    { id: 'terminal', label: 'Interactive CLI Terminal', icon: Terminal, highlight: true },
    { id: 'acos-team', label: 'CEO Super Agent & 50 AI Workforce', icon: Rocket, highlight: true },
    { id: 'ai-engine', label: 'AI Router & 8 Core Modules', icon: Cpu, highlight: true },
    { id: 'ai-tools-registry', label: 'AI Tools Registry & Capabilities', icon: Wrench, highlight: true },
    { id: 'chatgpt-action', label: 'ChatGPT Custom GPT Action API', icon: Sparkles, highlight: true },
    { id: 'webgpu-local', label: 'WebGPU Local AI (In-Browser)', icon: Sparkles, highlight: true },
    { id: 'workspace-cloudsql', label: 'Google Workspace (Calendar, Docs, Drive, Gmail) & Cloud SQL', icon: FileSpreadsheet, highlight: true },
    { id: 'commerce', label: 'Commerce & Subscriptions', icon: CreditCard },
    { id: 'rbac-users', label: 'RBAC & Email Invites', icon: Users },
    { id: 'overview', label: 'Executive Overview', icon: Activity },
    { id: 'agents', label: `200 Micro-Agents (${totalAgents})`, icon: Cpu },
    { id: 'departments', label: 'Departments', icon: Shield },
    { id: 'knowledge', label: 'Knowledge & Memory Base', icon: Database },
    { id: 'roadmap', label: 'Launch Roadmap', icon: Sparkles },
    { id: 'playbook', label: 'Operational Playbook', icon: Zap },
    { id: 'operations', label: 'Ops & Security Audit', icon: Lock },
    { id: 'simulator', label: 'Mission Simulator', icon: Terminal },
  ];

  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-40 font-sans shadow-2xl shadow-indigo-900/10">
      {/* Top Banner Telemetry & Super Admin Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-lg tracking-wider text-slate-100 font-mono">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent font-extrabold text-xl tracking-tight">
              ATLANTIDA OS v1.0
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50 rounded-full font-bold shadow-sm">
              AI OPERATING SYSTEM
            </span>
          </div>
        </div>

        {/* Super Admin & Live Metrics */}
        <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-xs">
          
          

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-700/80 px-2 py-1.5 rounded-full transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col items-start pr-1 hidden sm:flex">
                <span className="text-[10px] font-bold text-slate-200 leading-tight">
                  {currentUser?.name || 'Guest User'}
                </span>
                <span className="text-[9px] font-mono text-cyan-400 leading-tight">
                  {currentUser?.isSuperAdmin ? 'Super Admin' : 'Visitor'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors mr-1" />
            </button>

            {/* Dropdown Content */}
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Aktivni Račun</p>
                  <p className="text-xs font-bold text-slate-100 truncate">{currentUser?.email || 'Nije prijavljen'}</p>
                </div>
                
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      onSwitchUser({ email: 'emirperla96@gmail.com', name: 'Emir Perla', provider: 'google', isSuperAdmin: true, isSubscribed: true, subscriptionTier: 'premium' });
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${currentUser?.email === 'emirperla96@gmail.com' ? 'bg-indigo-950/50 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Emir Perla (Admin 1)
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUser({ email: 'emir.p.win@gmail.com', name: 'Emir Win', provider: 'google', isSuperAdmin: true, isSubscribed: true, subscriptionTier: 'premium' });
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${currentUser?.email === 'emir.p.win@gmail.com' ? 'bg-indigo-950/50 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Emir Win (Admin 2)
                  </button>
                </div>
                
                <div className="p-1.5 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Odjavi se (Logout)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-3 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">FLEET:</span>
            <span className="text-emerald-400 font-bold">{activeAgentCount}/{totalAgents} Active</span>
          </div>

          <div className="h-3 w-px bg-slate-800 hidden sm:block"></div>

          <a
            href="/atlantidaos_export.zip"
            download="atlantidaos_project_export.zip"
            className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-sans text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preuzmi ZIP</span>
          </a>

          <button
            onClick={onOpenSimulator}
            className="ml-auto sm:ml-0 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-sans text-xs font-semibold rounded-md shadow-lg shadow-indigo-950/50 transition-all flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-300" />
            Dispatch Mission
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700/80 shadow-inner font-bold'
                    : tab.highlight
                    ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
