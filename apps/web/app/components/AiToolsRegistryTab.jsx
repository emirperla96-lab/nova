'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Settings2,
  Code2,
  Cpu,
  Layers,
  Database,
  Terminal,
  Zap,
  Globe,
  Trash2,
  Edit3,
  Download,
  RefreshCw,
  Sliders,
  Shield,
  Eye,
  Check,
  Copy,
  Sparkles,
  Bot,
  Activity,
  ChevronRight,
  Filter,
  BarChart3,
  ExternalLink,
  Clock,
  Key,
  Info,
  SlidersHorizontal,
  Server,
  Lightbulb,
  ArrowUpRight,
  Send,
  Boxes
} from 'lucide-react';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../../../firebase-applet-config.json';
import { initializeApp, getApps } from 'firebase/app';

// Initialize Firebase safely for tool registry persistence
let db = null;
if (typeof window !== 'undefined') {
  try {
    const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(firebaseApp);
  } catch (e) {
    console.log('Firebase init notice in AI Tools Registry:', e);
  }
}

// Default Registered AI Tools grouped into primary categories: 'Agent', 'Utility', 'Generator'
const DEFAULT_TOOLS = [
  {
    id: 'tool-ceo-orchestrator',
    name: 'CEO Super Agent Task Delegator',
    groupCategory: 'Agent',
    category: 'AGENT_ORCHESTRATOR',
    version: 'v3.2.0',
    description: 'Autonomous multi-agent task breakdown and delegation engine. Routes complex queries to 50+ specialized micro-agents.',
    endpoint: 'agent://ceo-super-agent/delegate',
    method: 'AGENT_PROTOCOL',
    permissionLevel: 'SUPER_ADMIN',
    active: true,
    executions: 18450,
    successRate: 99.9,
    avgLatencyMs: 12,
    lastUsed: 'Just now',
    author: 'Command Center Core',
    parameters: [
      { name: 'task_objective', type: 'string', required: true, description: 'High-level business or technical task description' },
      { name: 'target_departments', type: 'array', required: false, description: 'List of AI workforce units (Dev, Legal, Marketing)' },
      { name: 'max_depth', type: 'number', required: false, description: 'Recursion depth for sub-task trees' }
    ],
    config: {
      authType: 'CEO Agent Session Signature',
      rateLimitPerMin: 5000,
      timeoutMs: 10000,
      concurrencyLimit: 50
    },
    mockResponse: {
      status: 'DELEGATED',
      subtasksCreated: 4,
      assignedAgents: ['DevOps-01', 'Architect-03', 'QA-02', 'Security-01'],
      executionId: 'exec_99210'
    }
  },
  {
    id: 'tool-gworkspace',
    name: 'Google Workspace REST Interop',
    groupCategory: 'Utility',
    category: 'WORKSPACE',
    version: 'v2.4.0',
    description: 'Integrates with Gmail, Google Docs, Calendar, and Drive Picker via OAuth 2.0 to search, draft, and schedule events.',
    endpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
    method: 'REST_OAUTH2',
    permissionLevel: 'ALL_WORKERS',
    active: true,
    executions: 1240,
    successRate: 99.8,
    avgLatencyMs: 120,
    lastUsed: '2 mins ago',
    author: 'Google AI Studio',
    parameters: [
      { name: 'scope', type: 'string', required: true, description: 'Workspace scope (e.g. gmail.readonly, calendar)' },
      { name: 'query', type: 'string', required: false, description: 'Search term for emails or docs' },
      { name: 'maxResults', type: 'number', required: false, description: 'Limit number of retrieved records' }
    ],
    config: {
      authType: 'OAuth 2.0 Client Token',
      rateLimitPerMin: 600,
      timeoutMs: 5000,
      retryPolicy: 'Exponential Backoff (max 3)'
    },
    mockResponse: { status: '200 OK', itemsFound: 5, payload: 'Fetched 5 workspace items via OAuth token.' }
  },
  {
    id: 'tool-cloudsql-query',
    name: 'Cloud SQL PostgreSQL DML Executor',
    groupCategory: 'Utility',
    category: 'SYSTEM_OPS',
    version: 'v1.8.2',
    description: 'Executes parameterized SQL queries against the europe-west2 Cloud SQL PostgreSQL cluster using Drizzle ORM.',
    endpoint: 'postgres://europe-west2.cloudsql.internal/atlantida',
    method: 'DIRECT_SQL',
    permissionLevel: 'SECURITY_ADMIN',
    active: true,
    executions: 8430,
    successRate: 100,
    avgLatencyMs: 24,
    lastUsed: 'Just now',
    author: 'Cloud Infrastructure Team',
    parameters: [
      { name: 'sql_statement', type: 'string', required: true, description: 'Parameterized SELECT/UPDATE/INSERT query' },
      { name: 'params', type: 'array', required: false, description: 'Query placeholders bindings' }
    ],
    config: {
      authType: 'IAM Database Auth',
      rateLimitPerMin: 2000,
      timeoutMs: 3000,
      connectionPoolSize: 20
    },
    mockResponse: { rowsAffected: 12, executionTime: '18ms', poolStatus: 'HEALTHY' }
  },
  {
    id: 'tool-rag-embedder',
    name: 'Gemini RAG Vector Vault Embedder',
    groupCategory: 'Generator',
    category: 'AI_MODELS',
    version: 'v3.1.0',
    description: 'Generates text-embedding-004 vectors and queries vector vault memory for context augmentation.',
    endpoint: 'gemini://embedding/text-embedding-004',
    method: 'SDK_NATIVE',
    permissionLevel: 'ALL_WORKERS',
    active: true,
    executions: 24100,
    successRate: 99.9,
    avgLatencyMs: 85,
    lastUsed: '1 min ago',
    author: 'Super Agent Core',
    parameters: [
      { name: 'text_corpus', type: 'string', required: true, description: 'Text chunk to vectorize and store in memory' },
      { name: 'top_k', type: 'number', required: false, description: 'Nearest neighbors count to retrieve' }
    ],
    config: {
      modelName: 'text-embedding-004',
      dimension: 768,
      batchSize: 32,
      distanceMetric: 'Cosine Similarity'
    },
    mockResponse: { vectorDimension: 768, cosineSimilarity: 0.942, matchId: 'vec_88102' }
  },
  {
    id: 'tool-webgpu-llama',
    name: 'WebGPU In-Browser Local LLM',
    groupCategory: 'Generator',
    category: 'AI_MODELS',
    version: 'v1.0.0',
    description: 'Runs Llama-3-8B 4-bit quantized model directly inside browser memory via WebGPU without backend latency.',
    endpoint: 'webgpu://local-device-memory/llama3-4bit',
    method: 'WEBGPU_LOCAL',
    permissionLevel: 'ALL_WORKERS',
    active: true,
    executions: 512,
    successRate: 98.4,
    avgLatencyMs: 14,
    lastUsed: '15 mins ago',
    author: 'Local Engine Lab',
    parameters: [
      { name: 'prompt', type: 'string', required: true, description: 'Input text prompt for local generation' },
      { name: 'max_tokens', type: 'number', required: false, description: 'Max generated tokens limit' },
      { name: 'temperature', type: 'number', required: false, description: 'Sampling temperature (0.0 - 1.0)' }
    ],
    config: {
      precision: 'q4f16_1',
      vramAllocatedMB: 2048,
      contextWindow: 4096,
      quantization: 'AWQ 4-bit'
    },
    mockResponse: { tokensGenerated: 128, tps: 48.5, gpuMemoryUsedMB: 1840 }
  },
  {
    id: 'tool-code-refactor',
    name: 'AST Code Refactor Sentinel',
    groupCategory: 'Generator',
    category: 'CODE_GEN',
    version: 'v2.1.0',
    description: 'Parses TypeScript AST to optimize hooks, fix missing dependencies, and run static analysis.',
    endpoint: 'internal://ast-parser/refactor',
    method: 'AST_SYNTAX',
    permissionLevel: 'ALL_WORKERS',
    active: true,
    executions: 3190,
    successRate: 99.5,
    avgLatencyMs: 45,
    lastUsed: '1 hour ago',
    author: 'DevOps Sentinel AI',
    parameters: [
      { name: 'file_path', type: 'string', required: true, description: 'Target file path in workspace' },
      { name: 'autofix', type: 'boolean', required: false, description: 'Automatically apply lint fixes' }
    ],
    config: {
      parser: 'TypeScript Compiler API',
      strictMode: true,
      ruleset: 'ESLint Recommended + React Hooks'
    },
    mockResponse: { issuesFound: 0, refactoredLines: 4, syntaxValid: true }
  },
  {
    id: 'tool-devops-sentinel',
    name: 'DevOps Sentinel Auto-Fixer',
    groupCategory: 'Agent',
    category: 'AGENT_WORKER',
    version: 'v1.5.0',
    description: 'Autonomous worker agent monitoring system logs, build failures, and linter violations to issue patch PRs.',
    endpoint: 'agent://sentinel-devops/autofix',
    method: 'AGENT_WORKFLOW',
    permissionLevel: 'SECURITY_ADMIN',
    active: true,
    executions: 1420,
    successRate: 98.9,
    avgLatencyMs: 180,
    lastUsed: '12 mins ago',
    author: 'Reliability Team',
    parameters: [
      { name: 'error_log', type: 'string', required: true, description: 'Build error or stack trace' },
      { name: 'file_context', type: 'string', required: false, description: 'Source code path' }
    ],
    config: {
      autoCommit: false,
      maxAttempts: 3,
      lintCheckAfterFix: true
    },
    mockResponse: { status: 'FIX_PROPOSED', patchApplied: true, compileSuccess: true }
  },
  {
    id: 'tool-slack-notifier',
    name: 'Slack Webhook & Channel Dispatcher',
    groupCategory: 'Utility',
    category: 'COMMUNICATION',
    version: 'v1.2.0',
    description: 'Dispatches real-time alerts, executive summaries, and system incidents to Slack channels via webhooks.',
    endpoint: 'https://hooks.slack.com/services/T00/B00/XXXX',
    method: 'REST_API',
    permissionLevel: 'SECURITY_ADMIN',
    active: false,
    executions: 420,
    successRate: 97.2,
    avgLatencyMs: 210,
    lastUsed: '3 days ago',
    author: 'Integrations Team',
    parameters: [
      { name: 'channel', type: 'string', required: true, description: 'Slack target channel e.g. #alerts' },
      { name: 'message', type: 'string', required: true, description: 'Payload text or block kit JSON' }
    ],
    config: {
      authType: 'Incoming Webhook URL',
      rateLimitPerMin: 120,
      retryOn5xx: true
    },
    mockResponse: { ok: true, channel: '#alerts', ts: '1723500000.000100' }
  }
];

export default function AiToolsRegistryTab() {
  const [tools, setTools] = useState(DEFAULT_TOOLS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category Group Filter Tabs: 'ALL' | 'Agent' | 'Utility' | 'Generator'
  const [activeGroupTab, setActiveGroupTab] = useState('ALL');
  
  // Sub-category filter option
  const [subCategoryFilter, setSubCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [viewMode, setViewMode] = useState('CARDS'); // 'CARDS' | 'TABLE'

  // Modal State for Inspecting Tool Details / Configs
  const [inspectTool, setInspectTool] = useState(null);
  
  // Playground Test Modal State
  const [testTool, setTestTool] = useState(null);
  const [testArguments, setTestArguments] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // New Tool Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newToolForm, setNewToolForm] = useState({
    name: '',
    groupCategory: 'Agent',
    category: 'AGENT_WORKER',
    version: 'v1.0.0',
    description: '',
    endpoint: '',
    method: 'REST_API',
    permissionLevel: 'ALL_WORKERS',
    parametersText: '{\n  "input_param": "string"\n}'
  });

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Load tools from Firestore / LocalStorage on mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        if (db) {
          const snapshot = await getDocs(collection(db, 'ai_registered_tools'));
          if (!snapshot.empty) {
            const loaded = [];
            snapshot.forEach((docSnap) => {
              loaded.push({ id: docSnap.id, ...docSnap.data() });
            });
            setTools(loaded);
            return;
          }
        }
      } catch (e) {
        console.log('Firestore load tools notice:', e);
      }

      // LocalStorage fallback
      try {
        const local = localStorage.getItem('atlantida_ai_tools_registry');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTools(parsed);
          }
        }
      } catch (e) {
        console.error("Error:", e);
      }
    };

    loadTools();
  }, []);

  // Persist tool state
  const persistToolsState = async (updatedTools) => {
    setTools(updatedTools);
    try {
      localStorage.setItem('atlantida_ai_tools_registry', JSON.stringify(updatedTools));
    } catch (e) {
      console.error("Error:", e);
    }

    if (db) {
      try {
        for (const t of updatedTools) {
          await setDoc(doc(db, 'ai_registered_tools', t.id), {
            ...t,
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.log('Firestore write notice:', err);
      }
    }
  };

  // Toggle Activation
  const handleToggleToolActive = (toolId, e) => {
    if (e) e.stopPropagation();
    const updated = tools.map((t) => {
      if (t.id === toolId) {
        const nextState = !t.active;
        showToast(`Tool "${t.name}" is now ${nextState ? 'ACTIVE' : 'DISABLED'}.`);
        return { ...t, active: nextState };
      }
      return t;
    });
    persistToolsState(updated);
    if (inspectTool?.id === toolId) {
      setInspectTool((prev) => ({ ...prev, active: !prev.active }));
    }
  };

  // Delete Tool
  const handleDeleteTool = async (toolId, e) => {
    if (e) e.stopPropagation();
    const targetTool = tools.find((t) => t.id === toolId);
    const filtered = tools.filter((t) => t.id !== toolId);
    persistToolsState(filtered);

    if (inspectTool?.id === toolId) setInspectTool(null);
    if (testTool?.id === toolId) setTestTool(null);

    if (db) {
      try {
        await deleteDoc(doc(db, 'ai_registered_tools', toolId));
      } catch (e) {
        console.log('Firestore delete notice:', e);
      }
    }
    showToast(`AI Tool "${targetTool?.name || toolId}" deleted.`, 'info');
  };

  // Open Test Runner Modal
  const handleOpenTestModal = (tool, e) => {
    if (e) e.stopPropagation();
    setTestTool(tool);
    setTestResult(null);

    // Build initial sample parameters string
    const sampleArgs = {};
    if (tool.parameters && Array.isArray(tool.parameters)) {
      tool.parameters.forEach((p) => {
        if (p.type === 'number') sampleArgs[p.name] = 10;
        else if (p.type === 'boolean') sampleArgs[p.name] = true;
        else if (p.type === 'array') sampleArgs[p.name] = ['item1', 'item2'];
        else sampleArgs[p.name] = `Sample ${p.name}`;
      });
    } else {
      sampleArgs.input = 'test execution payload';
    }
    setTestArguments(JSON.stringify(sampleArgs, null, 2));
  };

  // Execute Test Execution Simulation
  const handleRunToolTest = () => {
    if (!testTool) return;
    setIsExecuting(true);
    setTestResult(null);

    setTimeout(() => {
      let argsParsed = {};
      try {
        argsParsed = JSON.parse(testArguments);
      } catch (e) {
        argsParsed = { raw: testArguments };
      }

      const executionOutput = {
        toolId: testTool.id,
        toolName: testTool.name,
        groupCategory: testTool.groupCategory || 'Utility',
        timestamp: new Date().toISOString(),
        executionTimeMs: Math.floor(Math.random() * 35) + 12,
        argumentsProvided: argsParsed,
        output: testTool.mockResponse || { status: '200 OK', result: 'Handler executed successfully.' },
        telemetry: {
          memoryAllocatedMB: 16.4,
          tokenUsage: 42,
          invoker: 'Command Center CEO Super Agent'
        }
      };

      setTestResult(executionOutput);
      setIsExecuting(false);

      // Increment executions count
      const updated = tools.map((t) =>
        t.id === testTool.id
          ? { ...t, executions: (t.executions || 0) + 1, lastUsed: 'Just now' }
          : t
      );
      persistToolsState(updated);
      showToast(`Test execution for "${testTool.name}" completed successfully!`);
    }, 550);
  };

  // Register New Tool
  const handleRegisterToolSubmit = (e) => {
    e.preventDefault();
    if (!newToolForm.name || !newToolForm.description) {
      showToast('Please fill out required fields (Name and Description).', 'error');
      return;
    }

    let parsedParams = [];
    try {
      const obj = JSON.parse(newToolForm.parametersText);
      parsedParams = Object.keys(obj).map((k) => ({
        name: k,
        type: typeof obj[k],
        required: true,
        description: `Parameter ${k}`
      }));
    } catch (err) {
      parsedParams = [
        { name: 'input_data', type: 'string', required: true, description: 'Standard payload parameter' }
      ];
    }

    const newTool = {
      id: `tool-${Date.now()}`,
      name: newToolForm.name,
      groupCategory: newToolForm.groupCategory || 'Agent',
      category: newToolForm.category || 'CUSTOM',
      version: newToolForm.version || 'v1.0.0',
      description: newToolForm.description,
      endpoint: newToolForm.endpoint || 'internal://custom-tool-handler',
      method: newToolForm.method,
      permissionLevel: newToolForm.permissionLevel,
      active: true,
      executions: 0,
      successRate: 100,
      avgLatencyMs: 15,
      lastUsed: 'Never',
      author: 'User Registered',
      parameters: parsedParams,
      config: {
        authType: 'Internal Session Key',
        rateLimitPerMin: 1000,
        timeoutMs: 3000
      },
      mockResponse: { status: '200 OK', result: 'Custom registered AI capability executed.' }
    };

    const updated = [newTool, ...tools];
    persistToolsState(updated);
    setIsRegisterModalOpen(false);
    setNewToolForm({
      name: '',
      groupCategory: 'Agent',
      category: 'AGENT_WORKER',
      version: 'v1.0.0',
      description: '',
      endpoint: '',
      method: 'REST_API',
      permissionLevel: 'ALL_WORKERS',
      parametersText: '{\n  "input_param": "string"\n}'
    });
    showToast(`New AI Tool "${newTool.name}" registered successfully!`);
  };

  // Export JSON
  const handleExportRegistryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tools, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'atlantida_ai_tools_registry.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Registry configuration downloaded.');
  };

  // Filter tools by Primary Group Category Tab, Sub-Category, Status, and Search Query
  const filteredTools = tools.filter((t) => {
    // Primary Group Tab match ('ALL', 'Agent', 'Utility', 'Generator')
    const matchesGroup = activeGroupTab === 'ALL' || (t.groupCategory || 'Utility') === activeGroupTab;
    
    // Sub-category match
    const matchesSub = subCategoryFilter === 'ALL' || t.category === subCategoryFilter;
    
    // Status match
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && t.active) ||
      (statusFilter === 'INACTIVE' && !t.active);

    // Search query match
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      (t.category || '').toLowerCase().includes(query) ||
      (t.groupCategory || '').toLowerCase().includes(query);

    return matchesGroup && matchesSub && matchesStatus && matchesQuery;
  });

  // Calculate Group Counts for Tabs
  const agentCount = tools.filter((t) => (t.groupCategory || 'Utility') === 'Agent').length;
  const utilityCount = tools.filter((t) => (t.groupCategory || 'Utility') === 'Utility').length;
  const generatorCount = tools.filter((t) => (t.groupCategory || 'Utility') === 'Generator').length;

  // Sub-categories list
  const subCategoriesList = ['ALL', ...Array.from(new Set(tools.map((t) => t.category).filter(Boolean)))];

  // Helper function to return Category Badge Styling and Icon
  const getGroupBadge = (group) => {
    switch (group) {
      case 'Agent':
        return {
          icon: <Bot className="w-3.5 h-3.5 text-indigo-400" />,
          bg: 'bg-indigo-950/80 border-indigo-700/60 text-indigo-200',
          label: 'Agent'
        };
      case 'Generator':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
          bg: 'bg-amber-950/80 border-amber-700/60 text-amber-200',
          label: 'Generator'
        };
      case 'Utility':
      default:
        return {
          icon: <Wrench className="w-3.5 h-3.5 text-cyan-400" />,
          bg: 'bg-cyan-950/80 border-cyan-700/60 text-cyan-200',
          label: 'Utility'
        };
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16 animate-fadeIn text-slate-100">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 font-mono text-xs animate-bounce ${
            notification.type === 'error'
              ? 'bg-rose-950 border-rose-500 text-rose-200'
              : 'bg-emerald-950 border-emerald-500 text-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      {/* Hero Executive Header & Live Telemetry Summary */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-6xl space-y-5 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 font-mono">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              AI CAPABILITIES &amp; TOOLS REGISTRY
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              ORCHESTRATOR DISPATCHER
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              FIRESTORE SYNC
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-snug">
                AI Capabilities &amp; Tools Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
                Manage, group, test, and inspect registered capabilities utilized by the CEO Super Agent and 50+ AI workforce units. Filter capabilities by primary functional groups: <strong className="text-indigo-300">Agent</strong>, <strong className="text-cyan-300">Utility</strong>, and <strong className="text-amber-300">Generator</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleExportRegistryJSON}
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-2xl flex items-center gap-2 transition-all text-xs font-mono"
              >
                <Download className="w-4 h-4 text-cyan-400" /> Export Registry
              </button>

              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-xs font-mono"
              >
                <Plus className="w-4.5 h-4.5" /> Register New Tool
              </button>
            </div>
          </div>

          {/* Metric Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-4 border-t border-slate-800/80 font-mono text-xs">
            <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
                <Boxes className="w-3.5 h-3.5 text-cyan-400" /> Total Registered
              </span>
              <span className="text-2xl font-black text-cyan-300">{tools.length} Tools</span>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Capabilities
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {tools.filter((t) => t.active).length} / {tools.length}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Total Executions
              </span>
              <span className="text-2xl font-black text-indigo-300">
                {tools.reduce((acc, t) => acc + (t.executions || 0), 0).toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Avg Execution Speed
              </span>
              <span className="text-2xl font-black text-amber-300">
                {Math.round(
                  tools.reduce((acc, t) => acc + (t.avgLatencyMs || 0), 0) / (tools.length || 1)
                )}{' '}
                ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CATEGORY TABS & FILTER BAR */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 shadow-xl space-y-4 font-mono text-xs">
        {/* Row 1: Group Category Tabs (Agent, Utility, Generator) */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* Tab: Svi Alati */}
            <button
              onClick={() => setActiveGroupTab('ALL')}
              className={`px-4 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap text-xs ${
                activeGroupTab === 'ALL'
                  ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/70 text-cyan-200 shadow-lg'
                  : 'bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>All Capabilities</span>
              <span className="px-2 py-0.5 bg-slate-900 text-cyan-300 text-[10px] rounded-full border border-slate-800 font-bold">
                {tools.length}
              </span>
            </button>

            {/* Tab: Agent */}
            <button
              onClick={() => setActiveGroupTab('Agent')}
              className={`px-4 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap text-xs ${
                activeGroupTab === 'Agent'
                  ? 'bg-indigo-950/90 border border-indigo-500/70 text-indigo-200 shadow-lg'
                  : 'bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Agent</span>
              <span className="px-2 py-0.5 bg-slate-900 text-indigo-300 text-[10px] rounded-full border border-slate-800 font-bold">
                {agentCount}
              </span>
            </button>

            {/* Tab: Utility */}
            <button
              onClick={() => setActiveGroupTab('Utility')}
              className={`px-4 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap text-xs ${
                activeGroupTab === 'Utility'
                  ? 'bg-cyan-950/90 border border-cyan-500/70 text-cyan-200 shadow-lg'
                  : 'bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Utility</span>
              <span className="px-2 py-0.5 bg-slate-900 text-cyan-300 text-[10px] rounded-full border border-slate-800 font-bold">
                {utilityCount}
              </span>
            </button>

            {/* Tab: Generator */}
            <button
              onClick={() => setActiveGroupTab('Generator')}
              className={`px-4 py-2.5 rounded-2xl font-black flex items-center gap-2 transition-all whitespace-nowrap text-xs ${
                activeGroupTab === 'Generator'
                  ? 'bg-amber-950/90 border border-amber-500/70 text-amber-200 shadow-lg'
                  : 'bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generator</span>
              <span className="px-2 py-0.5 bg-slate-900 text-amber-300 text-[10px] rounded-full border border-slate-800 font-bold">
                {generatorCount}
              </span>
            </button>
          </div>

          {/* View Switcher Mode (Cards vs Table) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'CARDS'
                  ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Cards View
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Table View
            </button>
          </div>
        </div>

        {/* Row 2: Search, Status Toggle, Sub-category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools by title, description, or handler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === 'INACTIVE'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Disabled
            </button>
          </div>
        </div>

        {/* Sub-category tags scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-slate-500 text-[11px] font-bold uppercase shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Sub-Category:
          </span>
          {subCategoriesList.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubCategoryFilter(sub)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all text-[11px] ${
                subCategoryFilter === sub
                  ? 'bg-cyan-950 border border-cyan-600 text-cyan-300 shadow'
                  : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE CARDS GRID */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const groupBadge = getGroupBadge(tool.groupCategory || 'Utility');
            return (
              <div
                key={tool.id}
                onClick={() => setInspectTool(tool)}
                className={`bg-slate-900/90 border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between space-y-5 relative group ${
                  tool.active
                    ? 'border-slate-800 hover:border-cyan-500/70 hover:bg-slate-900'
                    : 'border-slate-800/60 opacity-75 bg-slate-950/60 hover:opacity-100'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Header: Group Badge, Name, Active Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        {/* Group Category Badge */}
                        <span className={`px-2.5 py-0.5 border rounded-full font-bold flex items-center gap-1 ${groupBadge.bg}`}>
                          {groupBadge.icon}
                          <span>{groupBadge.label}</span>
                        </span>

                        {/* Sub Category Tag */}
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-full font-bold">
                          {tool.category}
                        </span>

                        <span className="text-slate-500 font-bold">{tool.version}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        {tool.name}
                      </h3>
                    </div>

                    {/* Activation Toggle Switch */}
                    <button
                      onClick={(e) => handleToggleToolActive(tool.id, e)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all shrink-0 ${
                        tool.active
                          ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-rose-950 border border-rose-600 text-rose-300 hover:bg-rose-900'
                      }`}
                    >
                      {tool.active ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-400" /> Disabled
                        </>
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {tool.description}
                  </p>

                  {/* Endpoint Chip */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400 truncate flex items-center justify-between gap-2">
                    <span className="truncate text-cyan-300">{tool.endpoint}</span>
                    <span className="px-1.5 py-0.5 bg-slate-900 text-slate-400 text-[9px] rounded font-bold border border-slate-800 shrink-0">
                      {tool.method}
                    </span>
                  </div>

                  {/* Telemetry Numbers */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                    <div className="p-2 bg-slate-950 border border-slate-800/80 rounded-xl space-y-0.5">
                      <span className="text-slate-500 block">Calls</span>
                      <span className="text-slate-200 font-bold">{tool.executions || 0}</span>
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-800/80 rounded-xl space-y-0.5">
                      <span className="text-slate-500 block">Latency</span>
                      <span className="text-cyan-300 font-bold">{tool.avgLatencyMs || 0} ms</span>
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-800/80 rounded-xl space-y-0.5">
                      <span className="text-slate-500 block">Success</span>
                      <span className="text-emerald-400 font-bold">{tool.successRate || 100}%</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs gap-2">
                  <button
                    onClick={(e) => handleOpenTestModal(tool, e)}
                    className="px-3.5 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 rounded-xl font-bold flex items-center gap-1.5 transition-all text-[11px]"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-400" /> Test
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectTool(tool);
                      }}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold flex items-center gap-1.5 transition-all text-[11px]"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-cyan-400" /> Config
                    </button>

                    <button
                      onClick={(e) => handleDeleteTool(tool.id, e)}
                      className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-800/60 text-rose-400 rounded-xl transition-all"
                      title="Delete tool"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
                <tr>
                  <th className="p-4">Capability Name</th>
                  <th className="p-4">Group</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Handler Endpoint</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Executions</th>
                  <th className="p-4">Latency</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredTools.map((tool) => {
                  const groupBadge = getGroupBadge(tool.groupCategory || 'Utility');
                  return (
                    <tr key={tool.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                        <div>
                          <div>{tool.name}</div>
                          <span className="text-[10px] text-slate-500 font-normal">{tool.version}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 border rounded-full font-bold flex items-center gap-1 text-[10px] w-fit ${groupBadge.bg}`}>
                          {groupBadge.icon}
                          <span>{groupBadge.label}</span>
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-full font-bold">
                          {tool.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        <div className="text-cyan-300 font-bold">{tool.method}</div>
                        <div className="truncate max-w-[180px] text-slate-500">{tool.endpoint}</div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={(e) => handleToggleToolActive(tool.id, e)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                            tool.active
                              ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                              : 'bg-rose-950 border border-rose-600 text-rose-300'
                          }`}
                        >
                          {tool.active ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 font-bold text-slate-200">{tool.executions || 0}</td>
                      <td className="p-4 text-cyan-300 font-bold">{tool.avgLatencyMs || 0} ms</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleOpenTestModal(tool, e)}
                            className="p-2 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded-xl"
                            title="Test"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInspectTool(tool)}
                            className="p-2 bg-slate-950 border border-slate-700 text-cyan-300 rounded-xl"
                            title="Config"
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteTool(tool.id, e)}
                            className="p-2 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROADMAP / 5 NEXT STEPS RECOMMENDATIONS SECTION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-sans">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-base font-extrabold text-slate-100 font-mono">
            5 Recommended Next Steps &amp; Architectural Enhancements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
          {/* Step 1 */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 hover:border-indigo-500/50 transition-all">
            <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded-full font-bold text-[10px]">
              01. Gemini Tools Sync
            </span>
            <h3 className="font-bold text-slate-200">Native Gemini Function Calling</h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Auto-generate Gemini API function definitions from tool JSON schemas to enable native function calling.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 hover:border-cyan-500/50 transition-all">
            <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-700 text-cyan-300 rounded-full font-bold text-[10px]">
              02. Webhooks &amp; Events
            </span>
            <h3 className="font-bold text-slate-200">Event-Driven Automation</h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Trigger tools automatically upon database row insertions or incoming webhook events.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 hover:border-emerald-500/50 transition-all">
            <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-full font-bold text-[10px]">
              03. Secret Vault
            </span>
            <h3 className="font-bold text-slate-200">Encrypted Key Management</h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Store third-party secrets and OAuth access tokens securely in encrypted Firestore vaults per tool.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 hover:border-amber-500/50 transition-all">
            <span className="px-2 py-0.5 bg-amber-950 border border-amber-700 text-amber-300 rounded-full font-bold text-[10px]">
              04. Real-time Telemetry
            </span>
            <h3 className="font-bold text-slate-200">Latency &amp; Failure Charts</h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Display live performance charts and error rate distributions using Recharts graphs.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 hover:border-purple-500/50 transition-all">
            <span className="px-2 py-0.5 bg-purple-950 border border-purple-700 text-purple-300 rounded-full font-bold text-[10px]">
              05. OpenAPI Importer
            </span>
            <h3 className="font-bold text-slate-200">Swagger / OpenAPI Import</h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Import entire REST API spec files to register hundreds of tools in a single click.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: TOOL CONFIGURATION & PARAMETER INSPECTOR MODAL */}
      {inspectTool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded-full font-bold">
                    {inspectTool.groupCategory || 'Utility'}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-full font-bold">
                    {inspectTool.category}
                  </span>
                  <span className="text-slate-400 font-mono">{inspectTool.version}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mt-1">{inspectTool.name}</h2>
              </div>

              <button
                onClick={() => setInspectTool(null)}
                className="text-slate-400 hover:text-white transition-all font-mono text-lg"
              >
                ✕
              </button>
            </div>

            {/* Config Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Permission Level</span>
                <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  {inspectTool.permissionLevel}
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Average Latency</span>
                <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  {inspectTool.avgLatencyMs || 0} ms
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Success Rate</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {inspectTool.successRate || 100}%
                </div>
              </div>
            </div>

            {/* Description & Endpoint */}
            <div className="space-y-2 font-sans">
              <h3 className="text-xs font-bold text-slate-300 uppercase font-mono">Description &amp; Endpoint Handler</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {inspectTool.description}
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 truncate">
                Endpoint: <span className="text-slate-200">{inspectTool.endpoint}</span>
              </div>
            </div>

            {/* Basic Configuration Attributes */}
            <div className="space-y-3 font-sans">
              <h3 className="text-xs font-bold text-slate-300 uppercase font-mono">System Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {inspectTool.config &&
                  Object.entries(inspectTool.config).map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">{key}</span>
                      <span className="text-slate-200 font-bold">{String(val)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Parameters Table */}
            <div className="space-y-3 font-sans">
              <h3 className="text-xs font-bold text-slate-300 uppercase font-mono">JSON Schema Parameters</h3>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                    <tr>
                      <th className="p-3">Parameter Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {inspectTool.parameters?.map((p) => (
                      <tr key={p.name} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-cyan-300">{p.name}</td>
                        <td className="p-3 text-indigo-300">{p.type}</td>
                        <td className="p-3">
                          {p.required ? (
                            <span className="text-emerald-400 font-bold">YES</span>
                          ) : (
                            <span className="text-slate-500">NO</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] font-sans">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs">
              <button
                onClick={(e) => handleOpenTestModal(inspectTool, e)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Open Playground Runner
              </button>

              <button
                onClick={() => setInspectTool(null)}
                className="px-5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PLAYGROUND TEST RUNNER MODAL */}
      {testTool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">Capability Playground Runner</span>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-400" /> {testTool.name}
                </h2>
              </div>
              <button
                onClick={() => setTestTool(null)}
                className="text-slate-400 hover:text-white font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 block font-bold">Input JSON Payload Arguments:</label>
                <textarea
                  rows={5}
                  value={testArguments}
                  onChange={(e) => setTestArguments(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunToolTest}
                  disabled={isExecuting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin text-cyan-300' : ''}`} />
                  <span>{isExecuting ? 'Executing Capability Call...' : 'Run Tool Test Call'}</span>
                </button>
              </div>

              {testResult && (
                <div className="bg-slate-950 border border-emerald-800/80 rounded-2xl p-4 space-y-3 font-mono text-xs animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Execution Successful (
                      {testResult.executionTimeMs} ms)
                    </span>
                    <span className="text-[10px] text-slate-500">{testResult.timestamp}</span>
                  </div>

                  <pre className="text-slate-300 text-[11px] overflow-x-auto p-3 bg-slate-900 rounded-xl border border-slate-800">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-800 pt-4 font-mono text-xs">
              <button
                onClick={() => setTestTool(null)}
                className="px-5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold"
              >
                Close Playground
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTRATION MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2 font-mono">
                <Plus className="w-5 h-5 text-cyan-400" /> Register New AI Tool
              </h2>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterToolSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Tool Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Slack Webhook Dispatcher"
                    value={newToolForm.name}
                    onChange={(e) => setNewToolForm({ ...newToolForm, name: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Primary Group *</label>
                  <select
                    value={newToolForm.groupCategory}
                    onChange={(e) => setNewToolForm({ ...newToolForm, groupCategory: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Agent">Agent (Workforce & Orchestrators)</option>
                    <option value="Utility">Utility (Databases, REST, Workspaces)</option>
                    <option value="Generator">Generator (LLMs, Embedders, Code AST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 block">Sub-Category</label>
                  <input
                    type="text"
                    placeholder="e.g. WORKSPACE, SYSTEM_OPS, CODE_GEN"
                    value={newToolForm.category}
                    onChange={(e) => setNewToolForm({ ...newToolForm, category: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block">Execution Method</label>
                  <select
                    value={newToolForm.method}
                    onChange={(e) => setNewToolForm({ ...newToolForm, method: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="REST_API">REST_API</option>
                    <option value="AGENT_PROTOCOL">AGENT_PROTOCOL</option>
                    <option value="DIRECT_SQL">DIRECT_SQL</option>
                    <option value="SDK_NATIVE">SDK_NATIVE</option>
                    <option value="WEBGPU_LOCAL">WEBGPU_LOCAL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what this capability performs when called by agents..."
                  value={newToolForm.description}
                  onChange={(e) => setNewToolForm({ ...newToolForm, description: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Handler Endpoint / URI</label>
                <input
                  type="text"
                  placeholder="e.g. https://api.slack.com/messaging or agent://custom/handler"
                  value={newToolForm.endpoint}
                  onChange={(e) => setNewToolForm({ ...newToolForm, endpoint: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Sample JSON Schema Parameters:</label>
                <textarea
                  rows={3}
                  value={newToolForm.parametersText}
                  onChange={(e) => setNewToolForm({ ...newToolForm, parametersText: e.target.value })}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg"
                >
                  Register Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
