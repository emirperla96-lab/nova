import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Cpu, Activity, Zap, ArrowUpRight, 
  CheckCircle2, RefreshCw, AlertTriangle, Play, Database, Sparkles, Layers
} from 'lucide-react';

export default function OverviewTab({ 
  agents, 
  departments, 
  onSelectAgent, 
  onSelectDept, 
  onNavigateTab 
}) {
  const [liveLogs, setLiveLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);

  // Generate realistic streaming activity from agents
  useEffect(() => {
    const actions = [
      'Executed neural memory indexing cycle',
      'Optimized monetization yield funnel',
      'Completed automated security audit on micro-service API',
      'Distilled domain knowledge into semantic embeddings',
      'Synchronized cross-department dependency graph',
      'Triggered self-learning error rectification loop',
      'Evaluated OKRs & autonomous task completion rates',
      'Dispatched automated customer support escalation queue',
      'Ran A/B experiment on landing page conversion',
      'Updated vector memory cluster index #104'
    ];

    const initialLogs = Array.from({ length: 6 }).map((_, i) => {
      const agent = agents[Math.floor(Math.random() * agents.length)] || { id: 1, name: 'CEO Super Agent', department: 'Executive Office' };
      const action = actions[Math.floor(Math.random() * actions.length)];
      return {
        id: Date.now() - i * 1500,
        time: new Date(Date.now() - i * 1500).toLocaleTimeString(),
        agentId: agent.id,
        agentName: agent.name,
        dept: agent.department,
        action: action,
        status: 'success'
      };
    });

    setLiveLogs(initialLogs);

    if (!isSimulating) return;

    const interval = setInterval(() => {
      const agent = agents[Math.floor(Math.random() * agents.length)] || { id: 1, name: 'CEO Super Agent', department: 'Executive Office' };
      const action = actions[Math.floor(Math.random() * actions.length)];
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        agentId: agent.id,
        agentName: agent.name,
        dept: agent.department,
        action: action,
        status: Math.random() > 0.95 ? 'warning' : 'success'
      };

      setLiveLogs((prev) => [newLog, ...prev.slice(0, 14)]);
    }, 2500);

    return () => clearInterval(interval);
  }, [agents, isSimulating]);

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const idleAgents = agents.filter(a => a.status === 'idle').length;
  const trainingAgents = agents.filter(a => a.status === 'training').length;

  return (
    <div className="space-y-6">
      {/* World-Class AtlantidaOS Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-5xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              ATLANTIDA OS • NEXT-GEN AI ARCHITECTURE
            </span>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-mono font-bold">
              v1.0 GOLDEN MASTER RELEASE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Autonomous Multi-Provider <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI Operating System</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            AtlantidaOS unifies 200 micro-agents, multi-provider AI routing (Google Gemini, OpenAI, DeepSeek R1/V3, Kimi Moonshot, Qwen 2.5, Mistral, Local WebGPU), Google Workspace (Sheets &amp; Tasks), and Cloud SQL PostgreSQL into one cohesive enterprise engine.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('terminal')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-emerald-950/60 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" /> Interactive CLI Terminal
            </button>
            <button
              onClick={() => onNavigateTab('acos-team')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-950/60 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" /> CEO Super Agent &amp; 50 AI
            </button>
            <button
              onClick={() => onNavigateTab('workspace-cloudsql')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Database className="w-4 h-4" /> Google Sheets &amp; Cloud SQL
            </button>
            <button
              onClick={() => onNavigateTab('webgpu-local')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> In-Browser WebGPU AI
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner & Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Agents</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">200</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">100% Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Autonomous Fleet</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield className="w-12 h-12 text-cyan-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Departments</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">10</span>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">Commanded</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Full Org Coverage</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Stream</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{activeAgents}</span>
            <span className="text-xs text-slate-400 font-mono">{idleAgents} Idle</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{trainingAgents} Neural Tuning</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Launch Phase</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-300 font-mono">Phase 5/7</span>
            <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">Fleet 200</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">71% Overall Progress</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-12 h-12 text-emerald-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Self-Learning</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">99.8%</span>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">Auto-Tuned</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Continuous Feedback</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-rose-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">SLA Threshold</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-100 font-mono">&lt; 50ms</span>
            <span className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded">Zero Failure</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">99.99% Uptime SLA</p>
        </div>
      </div>

      {/* Autonomous Executive Board & Profit ROI Engine */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/80 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              EXECUTIVE BOARD PROFIT &amp; CONVERSION ENGINE
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">
              Autonomous Financial ROI &amp; Value Growth Matrix
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-bold">
              Est. Monthly ROI: +$342,850
            </span>
            <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full font-bold">
              Token Cost Arbitrage: -68.4%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Productivity Savings</span>
            <div className="text-2xl font-extrabold text-emerald-400">3,200 hrs/mo</div>
            <p className="text-[11px] text-slate-400 font-sans">
              200 micro-agents automate routine workflows across 10 command departments.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Conversion Rate (CRO) Lift</span>
            <div className="text-2xl font-extrabold text-cyan-300">+34.2%</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Dynamic AI Router + WebGPU local pre-processing reduces user latency to under 50ms.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Enterprise LTV Growth</span>
            <div className="text-2xl font-extrabold text-purple-400">4.8x Retention</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Persistent memory in Cloud SQL + Google Workspace API sync keeps user data retention high.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Departments Breakdown & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Departments Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">10 Supreme Command Departments</h2>
            </div>
            <button
              onClick={() => onNavigateTab('departments')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              View All Departments <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept, idx) => {
              const deptAgents = agents.filter(a => a.departmentKey === dept.key);
              const activeCount = deptAgents.filter(a => a.status === 'active').length;
              
              return (
                <div 
                  key={dept.key || idx}
                  onClick={() => onSelectDept(dept)}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl shadow-md transition-all hover:translate-y-[-2px] cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                        DEPT #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mt-1">
                        {dept.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                      {dept.agentCount || deptAgents.length} Agents
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {dept.mission}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-slate-300">{activeCount} Active Now</span>
                    </div>
                    <span className="text-indigo-400 group-hover:underline text-[11px] font-medium">
                      Inspect Roster &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Real-time Live Telemetry Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">Live Agent Stream</h2>
            </div>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-2.5 py-1 text-xs rounded-md border flex items-center gap-1 font-mono transition-all ${
                isSimulating 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Live Streaming' : 'Paused'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg max-h-[580px] overflow-y-auto space-y-2.5 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {liveLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-indigo-400 font-bold bg-indigo-950/50 px-1.5 py-0.5 rounded text-[10px]">
                    Agent #{log.agentId}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer"
                        onClick={() => {
                          const agentObj = agents.find(a => a.id === log.agentId);
                          if (agentObj) onSelectAgent(agentObj);
                        }}>
                    {log.agentName}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {log.dept}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug font-sans">
                  {log.action}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fleet Grid Heatmap / Quick Access to 200 Agents */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              200 Micro-Agents Active Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Click any node in the matrix to inspect agent parameters, KPIs, and escalation protocols.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('agents')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 rounded-lg border border-slate-700 transition-all self-start sm:self-auto"
          >
            Open Full Directory &rarr;
          </button>
        </div>

        {/* 200 grid dots */}
        <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-25 lg:grid-cols-40 gap-1.5 pt-2">
          {agents.slice(0, 200).map((agent) => {
            const isAct = agent.status === 'active';
            const isTrn = agent.status === 'training';
            return (
              <button
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                title={`Agent #${agent.id}: ${agent.name} (${agent.department})`}
                className={`h-7 rounded text-[10px] font-mono font-semibold flex items-center justify-center transition-all hover:scale-115 ${
                  isAct 
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-800 hover:text-white' 
                    : isTrn 
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60 hover:bg-amber-800 hover:text-white' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {agent.id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
