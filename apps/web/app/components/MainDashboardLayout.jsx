'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  Terminal,
  Rocket,
  Cpu,
  Wrench,
  Sparkles,
  FileSpreadsheet,
  CreditCard,
  Users,
  Activity,
  Shield,
  Database,
  Zap,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  UserCheck,
  Search,
  ExternalLink,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const AI_TOOL_CATEGORIES = [
  {
    category: 'AI Assistant & Generation',
    items: [
      {
        id: 'gemini-chat',
        name: 'Gemini Chat Assistant',
        badge: 'New',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: MessageSquare,
        description: 'Multi-turn conversational AI powered by Google Gemini 3.8 Flash'
      },
      {
        id: 'autonomous-company',
        name: 'Autonomous AI Company',
        badge: '20 Workers',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: Bot,
        description: '20 Micro-Workers with DAG orchestration and autonomous mission execution'
      },
      {
        id: 'acos-team',
        name: 'CEO Super Agent & Workforce',
        badge: 'ACOS',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: Rocket,
        description: 'Command center for top-level executive delegation and team supervision'
      },
      {
        id: 'ai-tools-registry',
        name: 'AI Tools Registry',
        badge: 'Tools',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        icon: Wrench,
        description: 'Catalog of registered capabilities, function calls, and MCP connectors'
      },
      {
        id: 'ai-engine',
        name: 'AI Engine Router',
        badge: 'Router',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        icon: Cpu,
        description: 'Model fallback, latency routing, and multi-provider token management'
      }
    ]
  },
  {
    category: 'Developer & Intelligence',
    items: [
      {
        id: 'terminal',
        name: 'Interactive CLI Terminal',
        badge: 'CLI',
        badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
        icon: Terminal,
        description: 'Terminal shell for direct command execution and system telemetry'
      },
      {
        id: 'webgpu-local',
        name: 'WebGPU Local AI',
        badge: 'Browser',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        icon: Sparkles,
        description: 'Client-side zero-latency neural network execution in your browser'
      },
      {
        id: 'chatgpt-action',
        name: 'Custom GPT Action API',
        badge: 'OpenAPI',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: Layers,
        description: 'OpenAPI spec and schema bridge for external ChatGPT custom actions'
      },
      {
        id: 'simulator',
        name: 'Mission Simulator',
        badge: 'Simulator',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: Zap,
        description: 'Scenario sandbox for stress-testing multi-agent collaboration flows'
      }
    ]
  },
  {
    category: 'Enterprise & Data Infrastructure',
    items: [
      {
        id: 'workspace-cloudsql',
        name: 'Google Workspace & Cloud SQL',
        badge: 'Cloud',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        icon: FileSpreadsheet,
        description: 'Drive, Docs, Sheets, Gmail synchronization and PostgreSQL storage'
      },
      {
        id: 'knowledge',
        name: 'Knowledge & Memory Vault',
        badge: 'Memory',
        badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        icon: Database,
        description: 'Persistent embeddings and collective long-term memory store'
      },
      {
        id: 'overview',
        name: 'Executive Overview',
        badge: 'KPIs',
        badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
        icon: Activity,
        description: 'High-level operational metrics, agent availability, and system throughput'
      },
      {
        id: 'agents',
        name: '200 Micro-Agents Directory',
        badge: 'Catalog',
        badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
        icon: Cpu,
        description: 'Full searchable directory of all autonomous specialized micro-agents'
      },
      {
        id: 'departments',
        name: 'Departments Command',
        badge: 'Units',
        badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
        icon: Shield,
        description: 'Department hierarchy, divisional budgets, and team leadership'
      },
      {
        id: 'commerce',
        name: 'Commerce & Subscriptions',
        badge: 'Billing',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: CreditCard,
        description: 'Subscription tiers, usage billing, and payment gateways'
      },
      {
        id: 'rbac-users',
        name: 'RBAC & User Access',
        badge: 'Auth',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: Users,
        description: 'Role-based access control, invites, and permission audits'
      },
      {
        id: 'operations',
        name: 'Ops & Security Audit',
        badge: 'Audit',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        icon: Lock,
        description: 'Vulnerability scanner, security gates, and audit event logs'
      }
    ]
  }
];

export default function MainDashboardLayout({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onSwitchUser,
  children
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find active tool info
  const allTools = AI_TOOL_CATEGORIES.flatMap(cat => cat.items);
  const currentTool = allTools.find(tool => tool.id === activeTab) || {
    id: activeTab,
    name: 'AI Tool',
    category: 'AI Workspace',
    icon: Sparkles,
    description: 'Autonomous AI Operating System tool suite'
  };
  const CurrentIcon = currentTool.icon;

  // Filter tools based on search query
  const filteredCategories = AI_TOOL_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const handleSelectTool = (id) => {
    setActiveTab(id);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div id="main-dashboard-layout-container" className="flex h-screen w-full bg-[#05060b] text-slate-100 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        id="dashboard-sidebar-nav"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent truncate">
                    AtlantidaOS
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded">
                    v1.0
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">AI Command Dashboard</span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search (When expanded) */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI tools..."
                className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Sidebar Nav Items Container */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredCategories.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {group.category}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleSelectTool(item.id)}
                    title={isSidebarCollapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />

                    {!isSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`ml-1.5 px-1.5 py-0.5 text-[9px] font-mono rounded-md border font-semibold ${
                              isActive ? 'bg-indigo-700/80 text-white border-indigo-400/40' : item.badgeColor
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active accent pill when collapsed */}
                    {isSidebarCollapsed && isActive && (
                      <span className="absolute right-1 top-2.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer / User Profile & Collapse Toggle */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-900/60 space-y-2">
          {/* User Profile Info */}
          <div className={`flex items-center gap-2.5 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate leading-tight">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono truncate">
                  {currentUser?.isSuperAdmin ? 'Super Admin' : 'Standard'}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/60 text-xs transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px]">Collapse View</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Central Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#05060b] to-black">
        {/* Top App Bar */}
        <header
          id="dashboard-top-navbar"
          className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 z-30"
        >
          {/* Left: Mobile trigger & Current Tool Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shadow-sm flex-shrink-0">
                <CurrentIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-slate-100 truncate tracking-tight">
                    {currentTool.name}
                  </h1>
                  {currentTool.badge && (
                    <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded-md border font-semibold ${currentTool.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {currentTool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate hidden md:block">
                  {currentTool.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Model Status & Quick Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Gemini Model Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">gemini-3.8-flash</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-400">Ready</span>
            </div>

            {/* Quick Gemini Chat Launcher Button */}
            {activeTab !== 'gemini-chat' && (
              <button
                id="quick-gemini-chat-btn"
                onClick={() => setActiveTab('gemini-chat')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Open Gemini Chat</span>
              </button>
            )}

            {/* User Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-full transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Authenticated Account</p>
                    <p className="text-xs font-bold text-slate-100 truncate">{currentUser?.email || 'Admin'}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onSwitchUser) {
                        onSwitchUser({
                          email: 'emirperla96@gmail.com',
                          name: 'Emir Perla',
                          isSuperAdmin: true
                        });
                      }
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Emir Perla (Super Admin)</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Central Content Area for AI Tools */}
        <main
          id="dashboard-central-content-area"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
