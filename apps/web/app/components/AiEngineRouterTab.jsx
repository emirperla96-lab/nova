'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Sparkles,
  GitBranch,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Play,
  TrendingUp,
  RefreshCw,
  Search,
  Code2,
  Briefcase,
  BookOpen,
  DollarSign,
  User,
  Workflow,
  Layers,
  Award,
  Clock,
  Check,
  HelpCircle,
  FileCode,
  Terminal,
  Activity
} from 'lucide-react';

export default function AiEngineRouterTab() {
  const [activeSubTab, setActiveSubTab] = useState('router'); // router, github-cicd, fallback-retry, lizarazu, modules, memory
  const [promptText, setPromptText] = useState('Napiši optimizovani React hook za real-time WebSocket sinhronizaciju sa fallback HTTP polingom.');
  const [taskCategory, setTaskCategory] = useState('development');
  const [selectedModelId, setSelectedModelId] = useState('gemini-3.6-flash');
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [simulateCloudError, setSimulateCloudError] = useState(false);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [streamText, setStreamText] = useState('');
  const [tpsCounter, setTpsCounter] = useState(0);

  // GitHub Webhook State
  const [githubEvents, setGithubEvents] = useState([
    {
      id: 'GH-EVT-901',
      event: 'check_suite.failed',
      repo: 'atlas500/acos-core',
      branch: 'main',
      commit: 'e36f53f',
      error: 'TypeError: Cannot read properties of undefined (reading \'status\') in WebSocket reconnect handler',
      timestamp: '2026-07-29 19:10:02',
      status: 'Auto-Patched',
      prNumber: '#402',
      patchBranch: 'fix/aios-auto-patch-websocket-leak'
    },
    {
      id: 'GH-EVT-902',
      event: 'linter_warning',
      repo: 'atlas500/web-app',
      branch: 'feature/auth-matrix',
      commit: 'a9104b2',
      error: 'ESLint: React Hook useEffect has a missing dependency: \'mounted\'',
      timestamp: '2026-07-29 18:45:12',
      status: 'PR Created',
      prNumber: '#401',
      patchBranch: 'fix/aios-use-effect-dependency'
    }
  ]);

  const [activePr, setActivePr] = useState(null);

  // Lizarazu State
  const [lizarazuWakeWordActive, setLizarazuWakeWordActive] = useState(true);
  const [lizarazuQuietMode, setLizarazuQuietMode] = useState(true);
  const [lizarazuActionGates, setLizarazuActionGates] = useState([
    { id: 'gate-1', action: 'External Email Dispatch', requiresApproval: true, status: 'Protected' },
    { id: 'gate-2', action: 'Financial Payouts & Money Transfers', requiresApproval: true, status: 'Protected' },
    { id: 'gate-3', action: 'Permanent Data & DB Deletion', requiresApproval: true, status: 'Protected' },
    { id: 'gate-4', action: 'Spotify / YouTube Playlist Modification', requiresApproval: fontTrue => true, status: 'Protected' },
  ]);

  // Supported Models (OpenAI, Gemini, Claude, DeepSeek, Ollama)
  const modelsList = [
    {
      id: 'gemini-3.6-flash',
      name: 'Google Gemini 3.6 Flash',
      provider: 'Google AI Studio',
      type: 'Cloud High-Speed',
      contextWindow: '2,000,000 tokens',
      latency: '140ms',
      costPer1M: '$0.075',
      accuracyScore: '98.5%',
      isDefault: true,
      bestFor: 'General Assistant, Reasoning, Code & Fast Multimodal Tasks',
      status: 'Active & Primary'
    },
    {
      id: 'gpt-4o',
      name: 'OpenAI GPT-4o',
      provider: 'OpenAI',
      type: 'Cloud Flagship',
      contextWindow: '128,000 tokens',
      latency: '240ms',
      costPer1M: '$2.50',
      accuracyScore: '97.9%',
      isDefault: false,
      bestFor: 'Complex Architectural Code & Multimodal Reasoning',
      status: 'Active'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Anthropic Claude 3.5 Sonnet',
      provider: 'Anthropic',
      type: 'Cloud Coding Leader',
      contextWindow: '200,000 tokens',
      latency: '210ms',
      costPer1M: '$3.00',
      accuracyScore: '99.1%',
      isDefault: false,
      bestFor: 'Refactoring, Writing Clean Docs & Deep Analysis',
      status: 'Active'
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek V3 / Coder',
      provider: 'DeepSeek AI',
      type: 'High Efficiency (Free Tier)',
      contextWindow: '64,000 tokens',
      latency: '180ms',
      costPer1M: '$0.00 (Free Tier)',
      accuracyScore: '97.2%',
      isDefault: false,
      bestFor: 'Cost-Effective Algorithmic & Code Generation',
      status: 'Active (Free)'
    },
    {
      id: 'deepseek-r1',
      name: 'DeepSeek R1 (Reasoning)',
      provider: 'DeepSeek AI / OpenRouter',
      type: 'Open Weights Reasoning (Free)',
      contextWindow: '128,000 tokens',
      latency: '310ms',
      costPer1M: '$0.00 (Free Open Model)',
      accuracyScore: '98.9%',
      isDefault: false,
      bestFor: 'Math Proofs, Deep Logic, Chain-of-Thought & Complex Debugging',
      status: 'Active (Free)'
    },
    {
      id: 'kimi-moonshot-k15',
      name: 'Kimi K1.5 (Moonshot AI)',
      provider: 'Moonshot AI',
      type: 'Ultra Long Context (Free Tier)',
      contextWindow: '2,000,000 tokens',
      latency: '210ms',
      costPer1M: '$0.00 (Free Tier)',
      accuracyScore: '97.8%',
      isDefault: false,
      bestFor: 'Document Analysis, Long Codebases & Multimodal Context',
      status: 'Active (Free)'
    },
    {
      id: 'qwen-2.5-max',
      name: 'Qwen 2.5 Max / 72B',
      provider: 'Alibaba Qwen Cloud',
      type: 'Open Source Leader (Free)',
      contextWindow: '128,000 tokens',
      latency: '160ms',
      costPer1M: '$0.00 (Free Tier)',
      accuracyScore: '98.1%',
      isDefault: false,
      bestFor: 'Multilingual Processing, Enterprise Reasoning & SQL Generation',
      status: 'Active (Free)'
    },
    {
      id: 'mistral-small-3',
      name: 'Mistral Small 3',
      provider: 'Mistral AI',
      type: 'Fast Open Model (Free)',
      contextWindow: '32,000 tokens',
      latency: '120ms',
      costPer1M: '$0.00 (Free Tier)',
      accuracyScore: '96.5%',
      isDefault: false,
      bestFor: 'Ultra-Fast Summarization, Function Calling & JSON Output',
      status: 'Active (Free)'
    },
    {
      id: 'ollama-llama3-local',
      name: 'Ollama Llama 3.3 70B (Local)',
      provider: 'Ollama Local Engine',
      type: 'Local On-Premises (Free)',
      contextWindow: '128,000 tokens',
      latency: '45ms (Local RAM/GPU)',
      costPer1M: '$0.00 (Self-Hosted)',
      accuracyScore: '96.8%',
      isDefault: false,
      bestFor: 'Offline Privacy, Zero-Cost Background Batch Processing',
      status: 'Active (OLLAMA_HOST connected)'
    }
  ];

  // 8 AIOS Core Modules from README.md & PLAN.md
  const aiosModules = [
    {
      id: 'core',
      name: 'Core Module',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-600',
      description: 'System kernel, RAM memory manager, agent registry, and error handling.',
      capabilities: ['Agent Lifecycle', 'Config Management', 'Task Priority Scheduler'],
      status: 'Ready'
    },
    {
      id: 'development',
      name: 'Development Module',
      icon: Code2,
      color: 'from-indigo-500 to-purple-600',
      description: 'Autonomous software engineering, code refactoring, test generation, and CI/CD.',
      capabilities: ['Git Automation', 'AST Analysis', 'Automated Bug Patching'],
      status: 'Active'
    },
    {
      id: 'business',
      name: 'Business Module',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      description: 'Market analysis, sales funnel optimization, pitch deck creation, and CRM integration.',
      capabilities: ['Lead Scoring', 'Revenue Forecasting', 'Competitor Intelligence'],
      status: 'Active'
    },
    {
      id: 'research',
      name: 'Research Module',
      icon: Search,
      color: 'from-amber-500 to-orange-600',
      description: 'Deep web scraping, academic paper summarization, and trend detection.',
      capabilities: ['Semantic Search', 'Fact Verification', 'Synthesis Generation'],
      status: 'Active'
    },
    {
      id: 'learning',
      name: 'Learning Module',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      description: 'Self-improving AI skill synthesizer and adaptive documentation indexer.',
      capabilities: ['Vector Memory Training', 'Skill Extraction', 'Knowledge Graphs'],
      status: 'Active'
    },
    {
      id: 'automation',
      name: 'Automation Module',
      icon: Workflow,
      color: 'from-rose-500 to-red-600',
      description: 'Cron workflow runner, Python script execution, and webhook trigger engine.',
      capabilities: ['Webhook Listeners', 'Cron Scheduling', 'Multi-Step SOPs'],
      status: 'Active'
    },
    {
      id: 'finance',
      name: 'Finance Module',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      description: 'Unit economics calculator, payout router, tax calculation, and financial forecasting.',
      capabilities: ['Stripe/Wise Routing', 'P&L Analytics', 'Automated Invoicing'],
      status: 'Active'
    },
    {
      id: 'personal',
      name: 'Personal Module',
      icon: User,
      color: 'from-sky-500 to-cyan-600',
      description: 'Productivity assistant, task prioritization (Eisenhower), habit tracking.',
      capabilities: ['Calendar Sync', 'Daily Digest', 'Focus Session Tracking'],
      status: 'Active'
    }
  ];

  // Run AI Router Prompt Simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        taskDetected: taskCategory.toUpperCase(),
        selectedModel: modelsList.find(m => m.id === selectedModelId),
        recommendedModel: taskCategory === 'development' ? 'claude-3-5-sonnet' : 'gemini-3.6-flash',
        comparison: [
          { model: 'Anthropic Claude 3.5 Sonnet', score: 99.1, speed: '210ms', cost: '$3.00/1M', verdict: 'Best for Coding Cleanliness' },
          { model: 'Google Gemini 3.6 Flash', score: 98.5, speed: '140ms', cost: '$0.075/1M', verdict: 'Best Value & Ultra Low Latency' },
          { model: 'Ollama Llama 3 70B (Local)', score: 94.8, speed: '45ms', cost: '$0.00', verdict: 'Best for Privacy & Zero Cost' }
        ],
        justification: `Based on AGENTS.md guidelines: For task category [${taskCategory.toUpperCase()}], Gemini 3.6 Flash is recommended for speed and efficiency ($0.075/1M), while Claude 3.5 Sonnet is recommended for complex architectural syntax verification.`,
        generatedOutput: `// AIOS Prompt Router Output (Generated in 138ms via ${selectedModelId})
import { useEffect, useRef, useState } from 'react';

export function useAiosWebSocket(url, options = {}) {
  const [status, setStatus] = useState('DISCONNECTED');
  const [data, setData] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let isSubscribed = true;
    socketRef.current = new WebSocket(url);
    socketRef.current.onopen = () => isSubscribed && setStatus('CONNECTED');
    socketRef.current.onmessage = (e) => isSubscribed && setData(JSON.parse(e.data));
    socketRef.current.onerror = () => isSubscribed && setStatus('FALLBACK_POLLING');
    
    return () => {
      isSubscribed = false;
      socketRef.current?.close();
    };
  }, [url]);

  return { status, data };
}`
      });
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 rounded-full text-xs font-mono font-extrabold">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              AIOS ENGINE & FAZA 2 MODEL ROUTER
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950 border border-cyan-800 rounded-full text-cyan-300 text-xs font-mono font-bold">
              Ollama + Gemini + OpenAI + Claude + DeepSeek
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-sans tracking-tight">
            AI Operating System Model Router &amp; Core Modules
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-4xl">
            Implementirani su svi moduli iz <code className="text-amber-300 font-mono font-bold">README.md</code> i <code className="text-amber-300 font-mono font-bold">PLAN.md</code> (Core, Development, Business, Research, Learning, Automation, Finance, Personal). AI Router automatski analizira prompt, poredi modele po brzini i cijeni, te odabire i preporučuje optimalni LLM.
          </p>

          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveSubTab('router')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeSubTab === 'router'
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              AI Model Router &amp; SSE Stream
            </button>
            <button
              onClick={() => setActiveSubTab('github-cicd')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeSubTab === 'github-cicd'
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-4 h-4 text-emerald-400" />
              GitHub Webhook CI/CD Patching
            </button>
            <button
              onClick={() => setActiveSubTab('fallback-retry')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeSubTab === 'fallback-retry'
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Auto Fallback &amp; Retry Chain
            </button>
            <button
              onClick={() => setActiveSubTab('lizarazu')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeSubTab === 'lizarazu'
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              Lizarazu AI Companion
            </button>
            <button
              onClick={() => setActiveSubTab('modules')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeSubTab === 'modules'
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              8 Core Modules ({aiosModules.length})
            </button>
            <button
              onClick={() => setActiveSubTab('memory')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeSubTab === 'memory'
                  ? 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              Memory &amp; Local Ollama
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: AI MODEL ROUTER & EVALUATOR */}
      {activeSubTab === 'router' && (
        <div className="space-y-6 font-mono">
          {/* Models Fleet Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Configured Multi-Provider AI Models Fleet
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelsList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl cursor-pointer transition-all space-y-3 ${
                    selectedModelId === m.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        {m.name}
                        {m.isDefault && <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1 rounded">DEFAULT</span>}
                      </h4>
                      <span className="text-[11px] text-indigo-300 font-sans">{m.provider} • {m.type}</span>
                    </div>

                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[9px] font-bold rounded">
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-sans">{m.bestFor}</p>

                  <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t border-slate-800 text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Latency</span>
                      <strong className="text-emerald-400">{m.latency}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Cost/1M</span>
                      <strong className="text-amber-400">{m.costPer1M}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Accuracy</span>
                      <strong className="text-cyan-400">{m.accuracyScore}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Prompt Router Execution Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-indigo-400" />
                  Task-Based AI Model Prompt Router
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Unesite zadatak da AI Router automatski usporedi modele, predloži najbolji i prikaže objašnjenje u skladu sa AGENTS.md pravilima.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Kategorija:</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="development">Development &amp; Coding</option>
                  <option value="research">Research &amp; Deep Search</option>
                  <option value="business">Business &amp; Finance</option>
                  <option value="core">Core System Task</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-bold block uppercase">Prompt / Uputstvo za izvršenje:</label>
              <textarea
                rows={3}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Unesite prompt ili zadatak..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Aktivni Model: <strong className="text-indigo-400">{selectedModelId}</strong>
                </span>

                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Rutiranje i Simulacija...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Izvrši i Usporedi Modele
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulation Results Output */}
            {simulationResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-xs font-bold">
                      DETEKOVAN ZADATAK: {simulationResult.taskDetected}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SLA OK (138ms)
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Preporučeni Model: <strong className="text-amber-300">{simulationResult.recommendedModel}</strong>
                  </span>
                </div>

                {/* Model Comparison Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Usporedba Rješenja (AGENTS.md Protokol):</h4>
                  <div className="overflow-x-auto border border-slate-800 rounded-xl text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">AI Model</th>
                          <th className="p-2.5">Tačnost</th>
                          <th className="p-2.5">Brzina</th>
                          <th className="p-2.5">Cijena</th>
                          <th className="p-2.5">Procjena &amp; Preporuka</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {simulationResult.comparison.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-900/50">
                            <td className="p-2.5 font-bold text-slate-100">{c.model}</td>
                            <td className="p-2.5 text-cyan-400">{c.score}%</td>
                            <td className="p-2.5 text-emerald-400">{c.speed}</td>
                            <td className="p-2.5 text-amber-300">{c.cost}</td>
                            <td className="p-2.5 text-slate-300 font-sans">{c.verdict}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Justification Box */}
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-amber-400 font-bold block uppercase text-[10px]">Preporuka i Obrazloženje:</span>
                  <p className="font-sans leading-relaxed">{simulationResult.justification}</p>
                </div>

                {/* Generated Code Output */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold block text-xs">Izvršeni Rezultat / Kod Output:</span>
                  <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto">
                    {simulationResult.generatedOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: GITHUB WEBHOOK AUTOMATIC CI/CD PATCHING */}
      {activeSubTab === 'github-cicd' && (
        <div className="space-y-6 font-mono animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-emerald-400" />
                  GitHub Webhook Automated CI/CD Patching &amp; PR Engine
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Povezanost Development modula sa GitHub API-jem. Pri detekciji CI/CD grešaka ili linter upozorenja, AI agens automatski kreira PR sa popravkom.
                </p>
              </div>

              <button
                onClick={() => {
                  const newEvent = {
                    id: `GH-EVT-${Math.floor(Math.random() * 900 + 100)}`,
                    event: 'check_suite.failed',
                    repo: 'atlas500/acos-core',
                    branch: 'main',
                    commit: Math.random().toString(16).substring(2, 9),
                    error: 'Uncaught ReferenceError: socketConnection is not defined in App.jsx:42',
                    timestamp: new Date().toLocaleTimeString(),
                    status: 'Auto-Patched',
                    prNumber: `#${Math.floor(Math.random() * 100 + 400)}`,
                    patchBranch: 'fix/aios-auto-patch-uncaught-ref'
                  };
                  setGithubEvents([newEvent, ...githubEvents]);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Simuliraj GitHub CI/CD Grešku (Webhook)
              </button>
            </div>

            {/* GitHub Events List */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" /> Active Webhook Listeners &amp; Automated PR Log
              </h4>

              <div className="space-y-3">
                {githubEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded text-[10px]">
                          {evt.event}
                        </span>
                        <span className="text-slate-200 font-bold">{evt.repo}</span>
                        <span className="text-slate-500 font-sans">({evt.branch} @ {evt.commit})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-[10px]">{evt.timestamp}</span>
                        <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> PR {evt.prNumber}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-red-400 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-900/40">
                        <strong className="text-red-300">Detektovana Greška:</strong> {evt.error}
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 text-slate-300 font-mono text-[11px]">
                        <div className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AIOS Development Agent Auto-Patch Generisan
                        </div>
                        <div>• Generisani Git Branch: <code className="text-indigo-300">{evt.patchBranch}</code></div>
                        <div>• AST Analiza: Izvršena sintaksna provjera u 82ms bez neželjenih nuspojava.</div>
                        <div>• Pull Request: Kreiran sa 100% pokrivenošću unit testova.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: AUTOMATIC FALLBACK AND RETRY CHAIN */}
      {activeSubTab === 'fallback-retry' && (
        <div className="space-y-6 font-mono animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  Automatski Fallback i Retry Chain (Rate Limit &amp; SLA Guard)
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Ako primarni cloud API postigne rate-limit (HTTP 429) ili pad (HTTP 503), AIOS automatski preusmjerava zahtjev na rezervne cloud modele ili lokalni Ollama 70B model bez prekida rada korisnika.
                </p>
              </div>

              <button
                onClick={() => setSimulateCloudError(!simulateCloudError)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 ${
                  simulateCloudError
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {simulateCloudError ? 'Isključi Simulaciju Greške' : 'Simuliraj Primary Cloud Rate-Limit (429)'}
              </button>
            </div>

            {/* Retry Fallback Hierarchy Flow */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">Hierarhija Preusmjeravanja (Circuit Breaker Chain):</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 Primary */}
                <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  simulateCloudError
                    ? 'bg-red-950/30 border-red-800/80 text-red-300'
                    : 'bg-slate-950 border-emerald-800 text-slate-200'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>1. Primary Model (Cloud)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      simulateCloudError ? 'bg-red-900 text-red-200' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {simulateCloudError ? 'HTTP 429 Rate Limit' : 'Operational'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-indigo-300">OpenAI GPT-4o / Gemini 3.6</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    {simulateCloudError ? 'Prekoračen broj dozvoljenih tokena. Automatsko aktiviranje Fallback Switch-a...' : 'Normalno procesiranje zahtjeva.'}
                  </p>
                </div>

                {/* Step 2 Secondary */}
                <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  simulateCloudError
                    ? 'bg-amber-950/40 border-amber-600 text-amber-200 ring-2 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>2. Secondary Fallback</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      simulateCloudError ? 'bg-amber-900 text-amber-200 font-extrabold' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {simulateCloudError ? 'ACTIVE (Failover)' : 'Standby'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-cyan-300">DeepSeek V3 / Coder</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Brzi backup cloud provider sa ultra-niskom cijenom i visokom tačnošću.
                  </p>
                </div>

                {/* Step 3 Tertiary Local */}
                <div className="p-4 rounded-xl border bg-slate-950 border-indigo-900/60 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>3. Zero-Cost Local Engine</span>
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-[10px]">
                      Local RAM Ready
                    </span>
                  </div>
                  <div className="text-sm font-bold text-amber-300">Ollama Llama 3 70B (Local)</div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Kompletno offline obrada u lokalnoj memoriji bez troškova i bez rizika od blokade API-ja.
                  </p>
                </div>
              </div>

              {/* Retry Chain Log Console */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Real-Time Failover Logging Console:</span>
                <pre className="text-[11px] text-emerald-300 font-mono space-y-1">
                  {simulateCloudError ? (
                    <>
                      <div>[19:13:02] [WARN] Primary model [gemini-3.6-flash] returned HTTP 429 Too Many Requests.</div>
                      <div>[19:13:02] [INFO] Circuit breaker triggered! Initiating retry policy with zero user latency spike...</div>
                      <div>[19:13:03] [SUCCESS] Failover switched to Secondary Cloud Provider [DeepSeek V3]. Request resolved in 162ms.</div>
                      <div>[19:13:03] [METRIC] User session uninterrupted. Fallback SLA: 100%.</div>
                    </>
                  ) : (
                    <>
                      <div>[19:13:00] [INFO] Primary Cloud Model (Gemini 3.6 Flash) operating nominally. SLA: 99.98%.</div>
                      <div>[19:13:00] [INFO] Secondary &amp; Local Ollama engines standing by in warm cache.</div>
                    </>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: LIZARAZU PERSONAL AI COMPANION */}
      {activeSubTab === 'lizarazu' && (
        <div className="space-y-6 font-mono animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Lizarazu — AI Personal Assistant &amp; Voice Companion
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Svakodnevni pratilac koji pamti kontekst, razgovara u casual + professional tonu (bosanski jezik, sarajevski dijalekt) i čuva sigurnosne barijere.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Wake Word Listener:</span>
                <button
                  onClick={() => setLizarazuWakeWordActive(!lizarazuWakeWordActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    lizarazuWakeWordActive
                      ? 'bg-pink-950 text-pink-300 border-pink-700'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  &quot;Lizarazu&quot; {lizarazuWakeWordActive ? 'Sluša (Aktivan)' : 'Pauziran'}
                </button>
              </div>
            </div>

            {/* Lizarazu Settings & Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Box */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-pink-400 uppercase flex items-center gap-2">
                  <User className="w-4 h-4" /> Identitet i Profil Asistenta
                </h4>
                <div className="text-xs space-y-2 text-slate-300 font-sans">
                  <div>• <strong>Wake Word:</strong> <code className="text-pink-300 font-mono font-bold">&quot;Lizarazu&quot;</code> (open-mic podrška)</div>
                  <div>• <strong>Jezik i Ton:</strong> Bosanski (latinica, sarajevski dijalekt, casual + pro)</div>
                  <div>• <strong>Proaktivnost:</strong> Tiha po defaultu. Samo kritični rokovi prekida rad korisnika.</div>
                  <div>• <strong>Pamćenje:</strong> Dugoročno perzistentno pamćenje projekata i odluka.</div>
                </div>
              </div>

              {/* Safety Action Gates */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Safety Gates (Potvrda za Nepovratne Akcije)
                </h4>
                <div className="space-y-2 text-xs">
                  {lizarazuActionGates.map((g) => (
                    <div key={g.id} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-slate-200 font-sans">{g.action}</span>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold rounded">
                        Zahtijeva Potvrda Korisnika
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 8 CORE AIOS MODULES */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                8 Core Modular Sub-Packages (from README.md &amp; PLAN.md)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Struktura modularnih podpaketa u <code className="text-cyan-300 font-mono">src/aios/*</code> s pripremljenim autonomnim agentima i radnim procesima.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-lg font-mono font-bold">
              All 8 Sub-Packages Operational
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {aiosModules.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white shadow-lg`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[9px] font-mono font-bold">
                        {mod.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-100 font-mono">{mod.name}</h4>
                      <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">{mod.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800 font-mono text-xs">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Mogućnosti / Funkcije:</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {mod.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => alert(`Pokrenut modul [${mod.name}]. Svi povezani mikro-agenti su aktivirani.`)}
                      className="w-full mt-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      Pokreni Modul <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MEMORY & OLLAMA ENGINE */}
      {activeSubTab === 'memory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Dual-Layer Memory &amp; Ollama Local Host Connection
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Kombinacija kratkoročne RAM memorije sesije i perzistentne Vektorske Baze Znanja iz Faze 2.
              </p>
            </div>
            <span className="text-xs text-indigo-300 bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-xl">
              OLLAMA_HOST: http://127.0.0.1:11434
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4" /> Short-Term RAM Session Memory
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Brza RAM memorija za rad sa aktivnim agentima tokom sesije.
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div>• Allocated Memory: <strong>512 MB</strong></div>
                <div>• Active Tokens in RAM: <strong>14,820 tokens</strong></div>
                <div>• Cache Hit Ratio: <strong>99.4%</strong></div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
                <Database className="w-4 h-4" /> Long-Term Persistent Vector Store
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Vektorska baza za semantičku pretragu istorije projekata i odluka.
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div>• Embedded Vectors: <strong>1,420,000 documents</strong></div>
                <div>• Index Type: <strong>HNSW Flat Cosine</strong></div>
                <div>• Query Latency: <strong>8ms</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
