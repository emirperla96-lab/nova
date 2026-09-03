'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Terminal,
  Search,
  Filter,
  Pause,
  Play,
  Trash2,
  Download,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Code,
  Server,
  Wrench,
  Brain,
  Bot,
  Briefcase,
  PenTool,
  Database,
  CheckSquare,
  Workflow,
  FileText,
  LineChart,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  BarChart2,
  Radio
} from 'lucide-react';
import { useAutonomousAiCompany } from '../context/AutonomousAiCompanyContext';

// Icon mapper helper
const ICON_MAP = {
  Bot,
  Layers,
  Briefcase,
  Search,
  Code,
  Server,
  PenTool,
  Shield,
  Zap,
  Database,
  CheckSquare,
  Wrench,
  Brain,
  Workflow,
  Terminal,
  FileText,
  LineChart,
  TrendingUp,
  Activity
};

const renderWorkerIcon = (worker, className = "w-4 h-4") => {
  if (!worker) return <Bot className={className} />;
  const iconName = worker.iconName || (typeof worker.icon === 'string' ? worker.icon : null);
  const IconComp = (iconName && ICON_MAP[iconName]) || Bot;
  return <IconComp className={className} />;
};

export default function RealTimeActivityLog() {
  const {
    workers,
    activityLogs,
    addActivityLog,
    clearActivityLogs,
    simulateRandomWorkerActivity,
    isSystemRunning
  } = useAutonomousAiCompany();

  // Component States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('all'); // 'all' or workerId number
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedActionType, setSelectedActionType] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const scrollRef = useRef(null);

  // Auto-scroll to top when new logs arrive if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activityLogs, autoScroll]);

  // Compute worker event counts
  const workerEventCounts = useMemo(() => {
    const counts = {};
    activityLogs.forEach((log) => {
      counts[log.workerId] = (counts[log.workerId] || 0) + 1;
    });
    return counts;
  }, [activityLogs]);

  // Unique categories & action types
  const categories = useMemo(() => {
    const cats = new Set(['Executive & Strategy', 'Research & Product', 'Design & Frontend', 'Engineering & Data', 'Security & QA', 'Growth & Content']);
    activityLogs.forEach(l => l.category && cats.add(l.category));
    return Array.from(cats);
  }, [activityLogs]);

  const actionTypes = useMemo(() => {
    const types = new Set();
    activityLogs.forEach(l => l.actionType && types.add(l.actionType));
    return Array.from(types);
  }, [activityLogs]);

  // Filtered activity logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      // Worker filter
      if (selectedWorkerId !== 'all' && log.workerId !== Number(selectedWorkerId)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false;
      }
      // Action Type filter
      if (selectedActionType !== 'all' && log.actionType !== selectedActionType) {
        return false;
      }
      // Impact filter
      if (selectedImpact !== 'all' && log.impact !== selectedImpact) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && log.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = log.workerName?.toLowerCase().includes(q);
        const matchRole = log.workerRole?.toLowerCase().includes(q);
        const matchAction = log.actionType?.toLowerCase().includes(q);
        const matchDesc = log.actionDescription?.toLowerCase().includes(q);
        const matchId = log.id?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchAction && !matchDesc && !matchId) {
          return false;
        }
      }
      return true;
    });
  }, [activityLogs, selectedWorkerId, selectedCategory, selectedActionType, selectedImpact, selectedStatus, searchQuery]);

  // Calculate live average latency
  const avgLatency = useMemo(() => {
    if (activityLogs.length === 0) return 0;
    const total = activityLogs.reduce((acc, log) => acc + (log.latencyMs || 20), 0);
    return Math.round(total / activityLogs.length);
  }, [activityLogs]);

  // Export logs handler
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atlantida_ai_activity_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleExpand = (logId) => {
    setExpandedLogId(prev => prev === logId ? null : logId);
  };

  const copyLogPayload = (log) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 animate-fadeIn">
      {/* SECTION 1: HEADER & TELEMETRY BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded-xl shadow-lg relative">
              <Activity className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100 tracking-tight font-mono">
                  Real-Time AI Worker Activity Log
                </h2>
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Continuous high-frequency telemetry stream tracking autonomous worker actions, subroutines and task execution.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                autoScroll
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {autoScroll ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
              {autoScroll ? 'Auto-Scroll: ON' : 'Auto-Scroll: OFF'}
            </button>

            <button
              onClick={() => simulateRandomWorkerActivity()}
              className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Zap className="w-3.5 h-3.5" /> Trigger Event ⚡
            </button>

            <button
              onClick={handleExportLogs}
              title="Export JSON Logs"
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Export JSON
            </button>

            <button
              onClick={clearActivityLogs}
              title="Clear Stream"
              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" /> Ocisti
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>Total Logged Events</span>
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-extrabold text-cyan-300">{activityLogs.length}</div>
            <div className="text-[10px] text-slate-500">Max buffer: 100 entries</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>Active Streaming Workers</span>
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-extrabold text-indigo-300">
              {workers.filter((w) => w.status === 'Running').length} / 20
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">100% Autonomous</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>Average Action Latency</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-extrabold text-amber-300">{avgLatency} ms</div>
            <div className="text-[10px] text-slate-500">Sub-50ms execution speed</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="text-slate-400 text-[11px] flex items-center justify-between">
              <span>System Health Index</span>
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-emerald-400">99.8%</div>
            <div className="text-[10px] text-emerald-400">0 Critical Bottlenecks</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 20 AI WORKERS QUICK FILTER SELECTOR BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-slate-300 font-bold flex items-center gap-2 text-xs">
            <Bot className="w-4 h-4 text-cyan-400" />
            Filtriraj po AI Radniku (20 Radnika Matrix)
          </span>
          {selectedWorkerId !== 'all' && (
            <button
              onClick={() => setSelectedWorkerId('all')}
              className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Prikazi sve radnike
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          <button
            onClick={() => setSelectedWorkerId('all')}
            className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all border flex items-center gap-2 ${
              selectedWorkerId === 'all'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Svi Radnici ({activityLogs.length})</span>
          </button>

          {workers.map((worker) => {
            const count = workerEventCounts[worker.id] || 0;
            const isSelected = selectedWorkerId === worker.id;
            return (
              <button
                key={worker.id}
                onClick={() => setSelectedWorkerId(worker.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded bg-gradient-to-br ${worker.color} text-white`}>
                  {renderWorkerIcon(worker, "w-3 h-3")}
                </div>
                <span className="truncate max-w-[110px]">{worker.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    count > 0 ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: MULTI-FILTER CONTROL TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Pretraži zapise po tekstu, radniku, akciji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Sve Kategorije</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Impact */}
        <div>
          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Svi Utjecaji (Impact)</option>
            <option value="Low">Low Impact</option>
            <option value="Medium">Medium Impact</option>
            <option value="High">High Impact</option>
            <option value="Critical">Critical Impact</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Svi Statusi</option>
            <option value="Success">Success</option>
            <option value="In Progress">In Progress</option>
            <option value="Warning">Warning</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* SECTION 4: REAL-TIME ACTIVITY LOG TIMELINE STREAM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-100">
              Aktivni Dnevnik Radnji ({filteredLogs.length} / {activityLogs.length} Prikazano)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Prikaz uživo u realnom vremenu • Kliknite na zapis za detalje
          </span>
        </div>

        {/* Stream Box */}
        <div
          ref={scrollRef}
          className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {filteredLogs.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-12 text-center space-y-3 font-mono text-xs">
              <Bot className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
              <p className="text-slate-400 font-bold">Nema aktivnih zapisa koji odgovaraju odabranim filterima.</p>
              <button
                onClick={() => {
                  setSelectedWorkerId('all');
                  setSelectedCategory('all');
                  setSelectedActionType('all');
                  setSelectedImpact('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 rounded-xl transition-all"
              >
                Ponisti sve filtere
              </button>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const matchedWorker = workers.find((w) => w.id === log.workerId);
              const workerColor = matchedWorker ? matchedWorker.color : 'from-cyan-500 to-blue-600';
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className={`bg-slate-950 border transition-all rounded-xl p-4 space-y-3 ${
                    isExpanded
                      ? 'border-cyan-500 shadow-lg shadow-cyan-950/20'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Top Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${workerColor} text-white shadow shrink-0`}>
                        {renderWorkerIcon(matchedWorker, "w-4 h-4")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-slate-100">{log.workerName}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-[11px] text-cyan-400 font-medium">{log.workerRole || log.category}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span>{log.timestamp}</span>
                          <span>•</span>
                          <span className="text-slate-400 font-mono">ID: {log.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action & Impact Badges */}
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                      {/* Latency */}
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded font-bold">
                        ⚡ {log.latencyMs || 15}ms
                      </span>

                      {/* Impact Badge */}
                      <span
                        className={`px-2 py-0.5 rounded font-bold border ${
                          log.impact === 'Critical'
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : log.impact === 'High'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : log.impact === 'Medium'
                            ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {log.impact || 'Low'} Impact
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                          log.status === 'Success'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : log.status === 'Resolved'
                            ? 'bg-blue-950 text-blue-400 border-blue-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status || 'Success'}
                      </span>

                      {/* Expand Toggle */}
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Body Description */}
                  <div className="p-3 bg-slate-900/80 border border-slate-800/60 rounded-lg text-xs font-sans text-slate-200 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-wider mr-2">
                        [{log.actionType || 'Executed Step'}]
                      </span>
                      <span>{log.actionDescription}</span>
                    </div>
                  </div>

                  {/* Expanded Payload Section */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-3 font-mono text-xs animate-fadeIn">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-bold flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Live Execution Payload Inspector
                        </span>
                        <button
                          onClick={() => copyLogPayload(log)}
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {copiedId === log.id ? 'Kopirano ✓' : 'Kopiraj JSON'}
                        </button>
                      </div>

                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-cyan-300 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 font-mono">
                        {JSON.stringify(
                          {
                            logId: log.id,
                            timestamp: log.timestamp,
                            workerId: log.workerId,
                            workerName: log.workerName,
                            workerRole: log.workerRole,
                            category: log.category,
                            actionType: log.actionType,
                            impact: log.impact,
                            latencyMs: log.latencyMs,
                            status: log.status,
                            executionThread: `atlantida-worker-thread-#${log.workerId}`,
                            memoryLogSynced: true,
                            telemetry: {
                              cpuLoad: `${(Math.random() * 4 + 1).toFixed(1)}%`,
                              ramUsage: `${Math.floor(Math.random() * 40 + 80)}MB`
                            }
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
