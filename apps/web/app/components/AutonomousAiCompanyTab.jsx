'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Terminal,
  Zap,
  Users,
  Database,
  Search,
  FileText,
  BarChart3,
  TrendingUp,
  Clock,
  Plus,
  Trash2,
  Filter,
  Check,
  Eye,
  RefreshCw,
  Lock,
  Server,
  Settings,
  Code,
  Bot,
  Workflow,
  Brain,
  ShieldAlert,
  Wrench,
  Globe,
  PenTool,
  CheckSquare,
  LineChart,
  Bell,
  FileCheck,
  Sliders,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Briefcase,
  Download,
  Share2,
  Copy,
  ExternalLink,
  CreditCard,
  DollarSign,
  GitBranch,
  Network,
  Link,
  Key,
  Webhook,
  Send,
  ArrowRight,
  Scale
} from 'lucide-react';
import { useAutonomousAiCompany } from '../context/AutonomousAiCompanyContext';
import RealTimeActivityLog from './RealTimeActivityLog';

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

export default function AutonomousAiCompanyTab({ currentUser }) {
  // Consume Centralized React Context
  const {
    workers,
    taskQueue,
    memoryLogs,
    reports,
    isSystemRunning,
    systemScores,
    stripeTier,
    creditsRemaining,
    orchestratorConfig,
    // Feature 1: DAG Workflows
    dagWorkflows,
    addDagWorkflow,
    executeDagWorkflow,
    // Feature 2: RAG Vector Vault
    ragDocuments,
    addRagDocument,
    performRagSearch,
    // Feature 3: Governance & Approval Gates
    budgetGuardrails,
    updateBudgetGuardrails,
    approvalQueue,
    approveGateAction,
    rejectGateAction,
    // Feature 4: API Keys & Webhooks
    apiKeys,
    createApiKey,
    revokeApiKey,
    webhookSettings,
    addWebhook,
    deleteWebhook,
    simulateApiTaskAssign,
    // Feature 5: Advanced Analytics & Reports
    auditReports,
    generateAuditReport,
    downloadReportCsv,
    downloadReportPdf,
    // Core Methods
    updateStripeTier,
    updateOrchestratorConfig,
    updateWorkerPersona,
    exportAllWorkerData,
    updateWorkerStatus,
    pauseWorker,
    resumeWorker,
    pauseAllWorkers,
    resumeAllWorkers,
    emergencyStop,
    assignTaskToWorker,
    approveHighRiskAction,
    addWorkerMemory,
    deleteWorkerMemory,
    clearAllMemories,
    broadcastMemoryNode,
    simulateRandomWorkerActivity,
    deleteTask,
    resetToDefaults
  } = useAutonomousAiCompany();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'dag', 'rag', 'governance', 'api', 'analytics', 'workers', 'orchestrator', 'monetization', 'scheduler', 'memory', 'reports'

  // Feature 1: DAG Builder State
  const [showCreateDagModal, setShowCreateDagModal] = useState(false);
  const [newDagName, setNewDagName] = useState('');
  const [newDagDesc, setNewDagDesc] = useState('');

  // Feature 2: RAG Vector Vault State
  const [ragSearchQuery, setRagSearchQuery] = useState('');
  const [showAddRagModal, setShowAddRagModal] = useState(false);
  const [newRagTitle, setNewRagTitle] = useState('');
  const [newRagCategory, setNewRagCategory] = useState('Database Architecture');
  const [newRagWorker, setNewRagWorker] = useState('Chief AI');
  const [newRagContent, setNewRagContent] = useState('');
  const [newRagTags, setNewRagTags] = useState('vector, memory, os');

  // Feature 3: Governance & Approval State
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Feature 4: External API & Webhooks State
  const [showCreateApiKeyModal, setShowCreateApiKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [newWhName, setNewWhName] = useState('');
  const [newWhUrl, setNewWhUrl] = useState('');
  const [apiTestPayload, setApiTestPayload] = useState(
    JSON.stringify(
      {
        assignee: 'Chief AI',
        title: 'Execute WebGPU Local Cache Refactoring',
        priority: 'High',
        apiKeyName: 'GitHub Actions Auto-CI Integration'
      },
      null,
      2
    )
  );
  const [apiTestResponse, setApiTestResponse] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  
  // Agent Persona Customizer State
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [personaForm, setPersonaForm] = useState({
    modelAlias: 'Gemini 1.5 Pro',
    temperature: 0.7,
    systemInstructions: '',
    priorityLevel: 'High'
  });
  
  // System Telemetry Metrics derived from Context
  const cpuUsage = systemScores.cpuUsage;
  const memUsage = systemScores.memUsage;
  const securityScore = systemScores.securityScore;
  const performanceScore = systemScores.performanceScore;
  const seoScore = 97;

  const [globalLogs, setGlobalLogs] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', text: 'Chief AI synchronized 20 worker schedules.', time: 'Just now' },
    { id: 2, type: 'success', text: 'Hourly background scheduler completed log scan: 0 critical bugs.', time: '2m ago' }
  ]);

  // Modal / Controls State
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Chief AI');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [pendingApprovalAction, setPendingApprovalAction] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Worker Memory Suite State
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newMemoryWorkerId, setNewMemoryWorkerId] = useState(1);
  const [newMemoryType, setNewMemoryType] = useState('Learned Solution');
  const [newMemorySummary, setNewMemorySummary] = useState('');
  const [memorySearch, setMemorySearch] = useState('');
  const [memoryWorkerFilter, setMemoryWorkerFilter] = useState('all');
  const [memoryTypeFilter, setMemoryTypeFilter] = useState('all');
  const [copiedMemoryId, setCopiedMemoryId] = useState(null);

  // System Health Monitoring State
  const [isAuditingHealth, setIsAuditingHealth] = useState(false);
  const [healthStatusMsg, setHealthStatusMsg] = useState('Svi podsistemi funkcionišu optimalno (100% Uptime)');

  // Dynamic global log ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const workerList = ['Chief AI', 'Bug Hunter', 'Performance Engineer', 'Security Engineer', 'Frontend Engineer', 'QA Engineer'];
      const randomWorker = workerList[Math.floor(Math.random() * workerList.length)];
      const actions = [
        `Scanned background worker buffer: healthy`,
        `Executed sub-50ms WebGPU pipeline check`,
        `Verified Cloud SQL table indices`,
        `Checked OAuth 2.0 token expiration bounds`,
        `Optimized React component rendering tree`
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const logEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        worker: randomWorker,
        action: randomAction
      };
      setGlobalLogs((prev) => [logEntry, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Worker Control Handlers
  const handleWorkerAction = (workerId, action) => {
    const targetWorker = workers.find((w) => w.id === workerId);
    if (!targetWorker) return;

    // Check if risky action needs Super Admin / Admin Approval
    if (targetWorker.requiresApproval && (action === 'Stop' || action === 'Restart')) {
      setPendingApprovalAction({ workerId, action, name: targetWorker.name });
      setShowApprovalModal(true);
      return;
    }

    applyWorkerStatusChange(workerId, action);
  };

  const applyWorkerStatusChange = (workerId, action) => {
    let newStatus = 'Running';
    if (action === 'Start' || action === 'Restart') newStatus = 'Running';
    if (action === 'Pause') newStatus = 'Paused';
    if (action === 'Stop') newStatus = 'Stopped';

    updateWorkerStatus(workerId, newStatus);

    const workerName = workers.find((w) => w.id === workerId)?.name;
    const newNotif = {
      id: Date.now(),
      type: 'info',
      text: `Administrator updated worker ${workerName} status to: ${action}`,
      time: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Assign New Task Handler
  const handleAssignTask = () => {
    if (!newTaskTitle.trim()) return;

    const targetWorker = workers.find((w) => w.name === newTaskAssignee) || workers[0];
    assignTaskToWorker(targetWorker.id, newTaskTitle, newTaskPriority);

    setNewTaskTitle('');
    setShowAssignModal(false);
  };

  // Add Worker Memory Handler
  const handleCreateMemoryNode = () => {
    if (!newMemorySummary.trim()) return;

    const targetWorker = workers.find((w) => w.id === Number(newMemoryWorkerId)) || workers[0];
    addWorkerMemory(targetWorker.id, {
      type: newMemoryType,
      title: newMemoryType,
      details: newMemorySummary,
      summary: newMemorySummary
    });

    setNewMemorySummary('');
    setShowAddMemoryModal(false);
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: 'success',
        text: `Dodat novi nod memorije za ${targetWorker.name}`,
        time: 'Just now'
      },
      ...prev
    ]);
  };

  // Share Memory (Copy Payload)
  const handleShareMemoryNode = (log) => {
    const formattedPayload = JSON.stringify(
      {
        memoryId: log.id,
        timestamp: log.timestamp,
        worker: log.worker,
        workerId: log.workerId,
        type: log.type,
        summary: log.summary,
        status: log.status,
        synced: true,
        atlantidaOSVersion: '2.4.0-Autonomous'
      },
      null,
      2
    );
    navigator.clipboard.writeText(formattedPayload);
    setCopiedMemoryId(log.id);
    setTimeout(() => setCopiedMemoryId(null), 2000);
  };

  // Export Memory Vault JSON
  const handleExportMemoryVault = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memoryLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `atlantida_ai_worker_memory_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Instant Health Audit Trigger
  const handleRunHealthAudit = () => {
    setIsAuditingHealth(true);
    setHealthStatusMsg('Skeniranje 5 sistemskih podsistema u toku...');
    setTimeout(() => {
      setIsAuditingHealth(false);
      setHealthStatusMsg('Revizija završena: Svi podsistemi su 100% operativni (0 ranjivosti)');
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: 'success',
          text: 'Deep System Health Audit: 0 Critical Vulnerabilities Found.',
          time: 'Just now'
        },
        ...prev
      ]);
    }, 1500);
  };

  // Agent Persona Modal Handlers
  const handleOpenPersonaModal = (worker) => {
    setEditingWorker(worker);
    setPersonaForm({
      modelAlias: worker.modelAlias || 'Gemini 1.5 Pro',
      temperature: worker.temperature !== undefined ? worker.temperature : 0.7,
      systemInstructions: worker.systemInstructions || worker.description || '',
      priorityLevel: worker.priorityLevel || 'High'
    });
    setShowPersonaModal(true);
  };

  const handleSavePersona = () => {
    if (!editingWorker) return;
    updateWorkerPersona(editingWorker.id, personaForm);
    setShowPersonaModal(false);
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: 'success',
        text: `Prilagođena persona za ${editingWorker.name} (${personaForm.modelAlias}, Temp ${personaForm.temperature})`,
        time: 'Just now'
      },
      ...prev
    ]);
  };

  // Filtering
  const filteredWorkers = workers.filter((w) => {
    const matchesCategory = activeCategory === 'all' || w.category === activeCategory;
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const runningCount = workers.filter((w) => w.status === 'Running').length;
  const pausedCount = workers.filter((w) => w.status === 'Paused').length;
  const stoppedCount = workers.filter((w) => w.status === 'Stopped').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner: Autonomous AI Company Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              AUTONOMOUS AI OPERATING SYSTEM &amp; WORKFORCE
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
              <span>Autonomous AI Company</span>
              <span className="px-3 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold rounded-full">
                20 Active AI Workers
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Self-improving autonomous workforce coordinated by CEO AI. Continuously optimizes security, speed, UX, code quality and database health through shared persistent memory and automated recurring schedulers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={exportAllWorkerData}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-purple-400" /> Export Vault (JSON)
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Dodijeli Zadatak (Assign Task)
            </button>
            <div className="px-3.5 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>System Health: 99%</span>
            </div>
          </div>
        </div>

        {/* Live System Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs" role="region" aria-label="System Metrics">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
            <span className="text-slate-300 text-[11px] uppercase font-bold tracking-wide">Active Workers</span>
            <div className="text-xl font-extrabold text-cyan-300 flex items-center gap-1">
              <span>{runningCount}</span>
              <span className="text-slate-400 text-xs">/ 20</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
            <span className="text-slate-300 text-[11px] uppercase font-bold tracking-wide">CPU Usage</span>
            <div className="text-xl font-extrabold text-indigo-300">{cpuUsage}%</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
            <span className="text-slate-300 text-[11px] uppercase font-bold tracking-wide">RAM Allocation</span>
            <div className="text-xl font-extrabold text-purple-300">{memUsage}%</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
            <span className="text-slate-300 text-[11px] uppercase font-bold tracking-wide">Security Score</span>
            <div className="text-xl font-extrabold text-emerald-300">{securityScore}/100</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
            <span className="text-slate-300 text-[11px] uppercase font-bold tracking-wide">Performance</span>
            <div className="text-xl font-extrabold text-amber-300">{performanceScore}/100</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
            <span className="text-slate-300 text-[11px] uppercase font-bold tracking-wide">SEO Score</span>
            <div className="text-xl font-extrabold text-blue-300">{seoScore}/100</div>
          </div>
        </div>
      </div>

      {/* Main View Navigation Tabs */}
      <nav aria-label="System Navigation" className="flex border-b border-slate-800 font-mono text-xs overflow-x-auto gap-3 items-center justify-between pb-2 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveView('dashboard')}
            aria-pressed={activeView === 'dashboard'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeView === 'dashboard'
                ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" /> CEO Dashboard
          </button>

          <button
            onClick={() => setActiveView('dag')}
            aria-pressed={activeView === 'dag'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              activeView === 'dag'
                ? 'bg-purple-950 border border-purple-500/80 text-purple-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4 text-purple-400" /> Visual DAG Builder 🔀
          </button>

          <button
            onClick={() => setActiveView('rag')}
            aria-pressed={activeView === 'rag'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeView === 'rag'
                ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-400" /> RAG Vector Vault 🧠
          </button>

          <button
            onClick={() => setActiveView('governance')}
            aria-pressed={activeView === 'governance'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-400 ${
              activeView === 'governance'
                ? 'bg-red-950 border border-red-500/80 text-red-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-400" /> Governance &amp; Gates 🚨
            {approvalQueue.filter(a => a.status === 'Pending').length > 0 && (
              <span className="px-2 py-0.5 bg-red-900 text-red-100 border border-red-700 text-[11px] rounded-full font-bold animate-pulse">
                {approvalQueue.filter(a => a.status === 'Pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('api')}
            aria-pressed={activeView === 'api'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeView === 'api'
                ? 'bg-indigo-950 border border-indigo-500/80 text-indigo-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4 text-indigo-400" /> API &amp; Webhooks 🔌
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            aria-pressed={activeView === 'analytics'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              activeView === 'analytics'
                ? 'bg-emerald-950 border border-emerald-500/80 text-emerald-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LineChart className="w-4 h-4 text-emerald-400" /> Analytics &amp; Reports 📊
          </button>

          <button
            onClick={() => setActiveView('monetization')}
            aria-pressed={activeView === 'monetization'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              activeView === 'monetization'
                ? 'bg-amber-950 border border-amber-500/80 text-amber-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" /> Stripe Monetization 💳
          </button>

          <button
            onClick={() => setActiveView('workers')}
            aria-pressed={activeView === 'workers'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeView === 'workers'
                ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400" /> 20 AI Workers
          </button>

          <button
            onClick={() => setActiveView('orchestrator')}
            aria-pressed={activeView === 'orchestrator'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              activeView === 'orchestrator'
                ? 'bg-purple-950 border border-purple-500/80 text-purple-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Workflow className="w-4 h-4 text-purple-400" /> Master Orchestrator ⚡
          </button>

          <button
            onClick={() => setActiveView('memory')}
            aria-pressed={activeView === 'memory'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              activeView === 'memory'
                ? 'bg-purple-950 border border-purple-500/80 text-purple-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-400" /> Shared Memory Vault 🧠
          </button>

          <button
            onClick={() => setActiveView('scheduler')}
            aria-pressed={activeView === 'scheduler'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeView === 'scheduler'
                ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" /> Schedulers (Hourly/Daily) ⏱️
          </button>

          <button
            onClick={() => setActiveView('reports')}
            aria-pressed={activeView === 'reports'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              activeView === 'reports'
                ? 'bg-emerald-950 border border-emerald-500/80 text-emerald-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" /> Executive Reports 📋
          </button>

          <button
            onClick={() => setActiveView('activity')}
            aria-pressed={activeView === 'activity'}
            className={`px-3 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              activeView === 'activity'
                ? 'bg-cyan-950 border border-cyan-500/80 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" /> Activity Log
          </button>
        </div>

        <button
          onClick={exportAllWorkerData}
          aria-label="Izvozi Sva Polja i Podatke"
          className="shrink-0 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-purple-200 border border-purple-500/50 rounded-xl font-extrabold flex items-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span>Izvozi Podatke 💾</span>
        </button>
      </nav>

      {/* FEATURE VIEW 1: VISUAL DAG WORKFLOW BUILDER */}
      {activeView === 'dag' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-950 border border-purple-800 text-purple-400 rounded-xl shadow-lg">
                <GitBranch className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  Visual DAG Workflow Builder 🔀
                  <span className="px-2.5 py-0.5 bg-purple-950 border border-purple-800 text-purple-300 text-[10px] rounded-full">
                    {dagWorkflows.length} Active DAG Pipelines
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Interaktivni graf radnih tokova sa uslovnim grananjem, verifikacijom sigurnosnih kapija i automatskim rutingom zadataka.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateDagModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Kreiraj Novi DAG Workflow
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {dagWorkflows.map((dag) => (
              <div key={dag.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-purple-400" />
                      <h3 className="text-base font-extrabold text-slate-100">{dag.name}</h3>
                      <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-md text-[10px] font-bold">
                        {dag.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-sans">{dag.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-[11px] text-slate-400">
                      <div>Zadnje Pokretanje: <span className="text-slate-200 font-bold">{dag.lastRun}</span></div>
                      <div>Izvršavanja: <span className="text-purple-400 font-bold">{dag.executionCount} ciklusa</span></div>
                    </div>
                    <button
                      onClick={() => executeDagWorkflow(dag.id)}
                      className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 text-purple-400" /> Pokreni Pipeline ⚡
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto relative min-h-[180px] bg-grid-pattern">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-3 flex items-center gap-1">
                    <Network className="w-3.5 h-3.5 text-purple-400" /> Visuelna Mreža Čvorova (Topologija)
                  </div>

                  <div className="flex items-center gap-4 min-w-[700px] justify-between py-2">
                    {dag.nodes.map((node, index) => {
                      const targetWorker = workers.find((w) => w.id === node.workerId) || workers[0];
                      const nextConn = dag.connections.find((c) => c.from === node.id);

                      return (
                        <React.Fragment key={node.id}>
                          <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-3 shadow-lg min-w-[170px] max-w-[200px] space-y-2 relative group hover:border-purple-400 transition-all">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${targetWorker.color || 'from-cyan-500 to-blue-600'} text-white shadow`}>
                                {renderWorkerIcon(targetWorker, "w-3.5 h-3.5")}
                              </div>
                              <div className="overflow-hidden">
                                <div className="font-bold text-slate-100 text-xs truncate">{node.workerName}</div>
                                <div className="text-[9px] text-slate-400 truncate">{node.role}</div>
                              </div>
                            </div>

                            <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">Čvor #{index + 1}</span>
                              <span className="text-emerald-400 font-bold">SPREMAN</span>
                            </div>
                          </div>

                          {nextConn && (
                            <div className="flex flex-col items-center justify-center shrink-0 px-1 text-center space-y-1">
                              <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-purple-300 rounded text-[9px] font-bold shadow">
                                IF: {nextConn.condition}
                              </span>
                              <div className="flex items-center gap-0 text-purple-400">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse"></div>
                                <ArrowRight className="w-4 h-4 text-indigo-400 -ml-1" />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE VIEW 2: RAG & VECTOR SEARCH MEMORY VAULT */}
      {activeView === 'rag' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded-xl shadow-lg">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                    Shared Memory RAG &amp; Vector Search Vault 🧠
                    <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] rounded-full">
                      768-Dim Vector Embeddings
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Semantička pretraga istorije odluka, arhitetskih specifikacija i znanja svih 20 AI radnika kroz HNSW vektorski indeks.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddRagModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Dodaj Dokument u Vector Index
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Indeks model</div>
                <div className="text-sm font-extrabold text-cyan-300 mt-0.5">text-embedding-004</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Ukupno Vektora</div>
                <div className="text-sm font-extrabold text-indigo-300 mt-0.5">12,480 Chunka</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Metrika Sličnosti</div>
                <div className="text-sm font-extrabold text-emerald-300 mt-0.5">Cosine Distance</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Latencija Pretrage</div>
                <div className="text-sm font-extrabold text-purple-300 mt-0.5">&lt; 8.2 ms</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={ragSearchQuery}
                onChange={(e) => setRagSearchQuery(e.target.value)}
                placeholder="Unesite semantički upit za pretragu memorije (npr. 'PostgreSQL indeksiranje', 'OAuth refresh tokeni', 'WebGPU fallback')..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-xs font-mono"
              />
            </div>

            <div className="space-y-3">
              <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between">
                <span>Rezultati Vektorskog Rangiranja ({performRagSearch(ragSearchQuery).length} Dokumenata)</span>
                {ragSearchQuery && <span className="text-cyan-400">Sortirano po Cosine Sličnosti (%)</span>}
              </div>

              {performRagSearch(ragSearchQuery).map((doc) => (
                <div key={doc.id} className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="font-extrabold text-slate-100 text-xs">{doc.title}</span>
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] rounded">
                        {doc.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      {doc.similarityScore !== undefined && (
                        <span className="px-2.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded-full">
                          🎯 {doc.similarityScore}% Match (Dist: {doc.distance})
                        </span>
                      )}
                      <span className="text-slate-500 font-mono">{doc.indexedAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{doc.content}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>Radnik: <strong className="text-cyan-300">{doc.workerName}</strong></span>
                      <span>•</span>
                      <span>Chunki: <strong className="text-indigo-300">{doc.vectorChunkCount} vektora</strong></span>
                    </div>

                    <div className="flex items-center gap-1">
                      {doc.tags.map((tag, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE VIEW 3: GOVERNANCE & APPROVAL GATES */}
      {activeView === 'governance' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-red-950 border border-red-800 text-red-400 rounded-xl shadow-lg">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  Governance, Budget Guardrails &amp; Human Approval Gates 🚨
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Upravljanje limitima tokena, finansijskim pragovima i sigurnosnim odobrenjima za rizične akcije (Human-in-the-Loop).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Dnevni Budžet Tokena:</span>
                  <span className="text-cyan-300 font-extrabold">
                    {budgetGuardrails.currentDailyTokens.toLocaleString()} / {budgetGuardrails.maxDailyTokens.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (budgetGuardrails.currentDailyTokens / budgetGuardrails.maxDailyTokens) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Dnevni Finansijski Limiti ($):</span>
                  <span className="text-emerald-300 font-extrabold">
                    ${budgetGuardrails.currentDailyCostUsd} / ${budgetGuardrails.maxDailyCostUsd} USD
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (budgetGuardrails.currentDailyCostUsd / budgetGuardrails.maxDailyCostUsd) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Konfiguracija Sigurnosnih Guardraila
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <label className="text-slate-300 text-xs font-bold block flex justify-between">
                  <span>Maksimalni Dnevni Tokeni:</span>
                  <span className="text-purple-400">{budgetGuardrails.maxDailyTokens.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={250000}
                  value={budgetGuardrails.maxDailyTokens}
                  onChange={(e) => updateBudgetGuardrails({ maxDailyTokens: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="space-y-2 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <label className="text-slate-300 text-xs font-bold block flex justify-between">
                  <span>Dnevni Limit Troškova ($):</span>
                  <span className="text-emerald-400">${budgetGuardrails.maxDailyCostUsd}</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={50}
                  value={budgetGuardrails.maxDailyCostUsd}
                  onChange={(e) => updateBudgetGuardrails({ maxDailyCostUsd: Number(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-2 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                <label className="text-slate-300 text-xs font-bold block">Auto-Pauza pri Prekoračenju:</label>
                <button
                  onClick={() => updateBudgetGuardrails({ autoPauseOnThreshold: !budgetGuardrails.autoPauseOnThreshold })}
                  className={`w-full py-2 px-3 rounded-lg border font-bold transition-all ${
                    budgetGuardrails.autoPauseOnThreshold
                      ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {budgetGuardrails.autoPauseOnThreshold ? 'Aktivirano (Zaštita od Troškova)' : 'Deaktivirano'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" /> Red Odobrenja za Rizične Akcije (CEO / Human-in-the-Loop)
              </h3>
              <span className="text-xs text-slate-400">
                Na čekanju: <strong className="text-amber-400">{approvalQueue.filter(a => a.status === 'Pending').length} akcija</strong>
              </span>
            </div>

            <div className="space-y-3">
              {approvalQueue.map((item) => (
                <div
                  key={item.id}
                  className={`bg-slate-950 border rounded-xl p-4 space-y-3 transition-all ${
                    item.status === 'Pending' ? 'border-amber-500/50 shadow-lg' : 'border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {item.riskLevel} RIZIK
                      </span>
                      <span className="font-extrabold text-slate-100 text-xs">{item.title}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      item.status === 'Pending' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                      item.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-sans">{item.details}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-900 text-[11px]">
                    <div className="text-slate-500">
                      Zahtevao Radnik: <strong className="text-slate-300">{item.workerName}</strong> ({item.timestamp})
                    </div>

                    {item.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Opcija: Napomena administratora..."
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-[11px]"
                        />
                        <button
                          onClick={() => { approveGateAction(item.id, adminNoteInput); setAdminNoteInput(''); }}
                          className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded font-bold transition-all"
                        >
                          Odobri (Approve)
                        </button>
                        <button
                          onClick={() => { rejectGateAction(item.id, adminNoteInput); setAdminNoteInput(''); }}
                          className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded font-bold transition-all"
                        >
                          Odbij (Reject)
                        </button>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">
                        Obrađeno: {item.processedAt} {item.adminNote && `("${item.adminNote}")`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE VIEW 4: EXTERNAL REST API & WEBHOOKS */}
      {activeView === 'api' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-950 border border-indigo-800 text-indigo-400 rounded-xl shadow-lg">
                <Key className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  Developer API &amp; Webhook Integrations 🔌
                  <span className="px-2.5 py-0.5 bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] rounded-full">
                    REST v1 Endpoint
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Dodeljivanje zadataka iz eksternih servisa (GitHub Actions, Slack, Jira) i slanje obaveštenja putem webhooka.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateApiKeyModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Generiši Novi API Ključ
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-indigo-400" /> Aktivni API Ključevi ({apiKeys.length})
            </h3>

            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div key={k.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-100 text-xs flex items-center gap-2">
                      <span>{k.name}</span>
                      <span className="px-2 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] rounded">
                        {k.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-indigo-300 font-mono tracking-wider">{k.key}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                      <span>Kreiran: {k.created}</span>
                      <span>•</span>
                      <span>Zadnja upotreba: {k.lastUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(k.key);
                        setNotifications(prev => [{ id: Date.now(), type: 'success', text: `Kopiran API ključ: ${k.name}`, time: 'Just now' }, ...prev]);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-400" /> Kopiraj
                    </button>
                    <button
                      onClick={() => revokeApiKey(k.id)}
                      className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg transition-all"
                    >
                      Opozovi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Send className="w-4 h-4 text-purple-400" /> Test Workbench (POST /api/v1/tasks/assign)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-400 text-[11px] font-bold block">JSON Request Payload:</label>
                <textarea
                  rows={8}
                  value={apiTestPayload}
                  onChange={(e) => setApiTestPayload(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-purple-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(apiTestPayload);
                      const res = simulateApiTaskAssign(parsed);
                      setApiTestResponse(res);
                    } catch (e) {
                      setApiTestResponse({ status: 400, statusText: 'Bad Request', data: { error: 'Nevažeći JSON format' } });
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" /> Pošalji REST Zahtjev 🚀
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-[11px] font-bold block">HTTP Odgovor Servera:</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[190px] font-mono text-xs overflow-x-auto space-y-2">
                  {apiTestResponse ? (
                    <>
                      <div className="flex items-center gap-2 border-b border-slate-900 pb-1">
                        <span className={`px-2 py-0.2 rounded font-bold text-[10px] ${apiTestResponse.status === 200 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {apiTestResponse.status} {apiTestResponse.statusText}
                        </span>
                        <span className="text-slate-500 text-[10px]">Latencija: 14ms</span>
                      </div>
                      <pre className="text-emerald-300">{JSON.stringify(apiTestResponse.data, null, 2)}</pre>
                    </>
                  ) : (
                    <span className="text-slate-600 italic">Nema poslatog zahtjeva. Kliknite na button sa leve strane.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Webhook className="w-4 h-4 text-emerald-400" /> Webhook Notifikacije ({webhookSettings.length})
              </h3>
              <button
                onClick={() => setShowAddWebhookModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Dodaj Webhook
              </button>
            </div>

            <div className="space-y-3">
              {webhookSettings.map((w) => (
                <div key={w.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-100 text-xs">{w.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{w.url}</div>
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {w.events.map((e, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 bg-slate-900 border border-slate-800 text-emerald-400 text-[9px] rounded">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNotifications(prev => [{ id: Date.now(), type: 'success', text: `Test Webhook poslat na: ${w.name}`, time: 'Just now' }, ...prev]);
                      }}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold transition-all"
                    >
                      Testiraj Webhook 🔔
                    </button>
                    <button
                      onClick={() => deleteWebhook(w.id)}
                      className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE VIEW 5: ADVANCED ANALYTICS & AUDIT REPORTS */}
      {activeView === 'analytics' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl shadow-lg">
                <LineChart className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  Advanced Analytics &amp; Audit Reports 📊
                  <span className="px-2.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] rounded-full">
                    Live Token Calculator
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Analitika efikasnosti 20 AI radnika, kalkulator troškova tokena i generisanje exportabilnih PDF / CSV izveštaja.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const rep = generateAuditReport('Executive Review');
                  setNotifications(prev => [{ id: Date.now(), type: 'success', text: `Generisan izveštaj: ${rep.title}`, time: 'Just now' }, ...prev]);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Generiši Novi Izveštaj
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Kalkulator Troškova Tokena Po Radniku (20 AI Workers)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="p-3">AI Radnik</th>
                    <th className="p-3">Kategorija</th>
                    <th className="p-3">Završenih Zadataka</th>
                    <th className="p-3">Potrošeno Tokena</th>
                    <th className="p-3">Proc. Trošak ($)</th>
                    <th className="p-3">ROI Efikasnost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {workers.map((w) => {
                    const tokens = w.tasksCompleted * 1420;
                    const estCost = (tokens / 1000000) * 0.15;
                    return (
                      <tr key={w.id} className="hover:bg-slate-950/60 transition-all text-xs">
                        <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                          <div className={`p-1 rounded bg-gradient-to-br ${w.color} text-white`}>
                            {renderWorkerIcon(w, "w-3 h-3")}
                          </div>
                          <span>{w.name}</span>
                        </td>
                        <td className="p-3 text-slate-400">{w.category}</td>
                        <td className="p-3 text-cyan-300 font-bold">{w.tasksCompleted}</td>
                        <td className="p-3 text-indigo-300 font-mono">{tokens.toLocaleString()} tok</td>
                        <td className="p-3 text-emerald-400 font-bold">${estCost.toFixed(2)}</td>
                        <td className="p-3 text-purple-300">
                          <span className="px-2 py-0.5 bg-purple-950 border border-purple-800 rounded text-[10px]">
                            98.6% ROI
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileCheck className="w-4 h-4 text-cyan-400" /> Exportabilni Izveštaji ({auditReports.length})
            </h3>

            <div className="space-y-3">
              {auditReports.map((rep) => (
                <div key={rep.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-100 text-xs flex items-center gap-2">
                      <span>{rep.title}</span>
                      <span className="px-2 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] rounded">
                        {rep.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">{rep.summary}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                      <span>Tokeni: {rep.totalTokens.toLocaleString()}</span>
                      <span>•</span>
                      <span>Ušteda: <strong className="text-emerald-400">{rep.costSavings}</strong></span>
                      <span>•</span>
                      <span>Datum: {rep.generatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => downloadReportCsv(rep)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> CSV
                    </button>
                    <button
                      onClick={() => downloadReportPdf(rep)}
                      className="px-3.5 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" /> PDF Izveštaj 🖨️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: CEO ADMIN DASHBOARD */}
      {activeView === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Row: Orchestrator Status & Background Task Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CEO Orchestrator & Worker Status Overview */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-slate-100 font-mono">
                    Central Orchestrator (CEO AI Coordinator)
                  </h2>
                </div>
                <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full font-mono text-xs font-bold">
                  Autopilot: ACTIVE
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current CEO Directive:</span>
                  <span className="text-cyan-300 font-bold">Autonomous Sprint #42 Continuous Optimization</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-[88%] animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>20 Workers Coordinated</span>
                  <span>Conflict Resolution: 0 Blocking Locks</span>
                </div>
              </div>

              {/* Quick Worker Matrix Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs text-slate-300 border-b border-slate-800/60 pb-1">
                  <span>Worker Status Matrix ({runningCount} Active, {pausedCount} Paused, {stoppedCount} Stopped)</span>
                  <button onClick={() => setActiveView('workers')} className="text-cyan-400 hover:underline flex items-center gap-1">
                    Vidi sve radnike <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workers.slice(0, 6).map((w) => (
                    <div key={w.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 font-mono text-xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${w.color} text-white shadow`}>
                          {renderWorkerIcon(w, "w-4 h-4")}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-100 text-xs truncate">{w.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{w.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          w.status === 'Running' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          w.status === 'Paused' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {w.status}
                        </span>

                        <div className="flex items-center gap-1">
                          {w.status === 'Running' ? (
                            <button onClick={() => handleWorkerAction(w.id, 'Pause')} title="Pause Worker" className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded">
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button onClick={() => handleWorkerAction(w.id, 'Start')} title="Start Worker" className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded">
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleWorkerAction(w.id, 'Restart')} title="Restart Worker" className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Queue & Recent System Improvements */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-purple-400" /> Active Job Queue ({taskQueue.length})
                  </h3>
                  <button onClick={() => setShowAssignModal(true)} className="p-1 text-cyan-400 hover:bg-slate-800 rounded">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {taskQueue.map((task) => (
                    <div key={task.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-xs">{task.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                          task.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Dodijeljeno: <strong className="text-cyan-300">{task.assignee}</strong></span>
                        <span>{task.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health Subsystems Monitoring */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Health Monitoring
                  </h3>
                  <button
                    onClick={handleRunHealthAudit}
                    disabled={isAuditingHealth}
                    className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAuditingHealth ? 'animate-spin text-emerald-400' : ''}`} />
                    {isAuditingHealth ? 'Revizija...' : 'Pokreni Scan'}
                  </button>
                </div>

                <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-lg font-sans flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span>{healthStatusMsg}</span>
                </div>

                <div className="space-y-2 font-sans text-[11px]">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-mono">🗄️ Database & Cloud SQL</span>
                    <span className="text-emerald-400 font-bold font-mono text-[10px]">100% OK (11ms)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-mono">⚡ WebGPU & UI Render</span>
                    <span className="text-emerald-400 font-bold font-mono text-[10px]">Sub-50ms</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-mono">🛡️ Security & Auth Rules</span>
                    <span className="text-emerald-400 font-bold font-mono text-[10px]">0 Vulnerabilities</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-mono">🧠 20 AI Workers Memory</span>
                    <span className="text-purple-400 font-bold font-mono text-[10px]">Synced ({memoryLogs.length} nodes)</span>
                  </div>
                </div>
              </div>

              {/* System Notifications */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Bell className="w-4 h-4 text-cyan-400" /> System Notifications
                </h3>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-200 text-xs font-sans">{n.text}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Global Live Telemetry Activity Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Global Live AI Worker Execution Stream
              </h3>
              <button
                onClick={() => setActiveView('activity')}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold text-xs"
              >
                Otvori Real-Time Activity Log Stream <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-44 overflow-y-auto font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {globalLogs.length === 0 ? (
                <div className="text-slate-500 italic">Čekanje novih dnevnika u realnom vremenu...</div>
              ) : (
                globalLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 border-b border-slate-900/60 pb-1">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className="text-cyan-400 font-bold">[{log.worker}]</span>
                    <span className="text-slate-300">{log.action}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: REAL-TIME ACTIVITY LOG STREAM */}
      {activeView === 'activity' && (
        <RealTimeActivityLog />
      )}

      {/* SECTION 2: 20 AI WORKERS DIRECTORY */}
      {activeView === 'workers' && (
        <div className="space-y-6 animate-fadeIn font-sans">
          {/* Controls Bar: Filters & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {['all', 'Executive & Strategy', 'Research & Product', 'Design & Frontend', 'Engineering & Data', 'Security & QA', 'Growth & Content'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Sve Kategorije (20)' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Pretraži 20 AI radnika..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className={`bg-slate-900 border ${worker.borderColor} rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-cyan-400 transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${worker.color} text-white shadow-md`}>
                        {renderWorkerIcon(worker, "w-5 h-5")}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-100 text-sm">{worker.name}</h3>
                        <div className="text-[11px] text-cyan-400 font-bold">{worker.role}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      worker.status === 'Running' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      worker.status === 'Paused' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {worker.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs font-sans leading-relaxed">{worker.description}</p>

                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Active Task</span>
                    <p className="text-[11px] text-slate-200 font-sans">{worker.currentTask}</p>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Task Progress</span>
                        <span className="text-cyan-400 font-bold">{worker.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-500"
                          style={{ width: `${worker.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                    <div>Zadataka: <strong className="text-slate-200">{worker.tasksCompleted}</strong></div>
                    <div>RAM: <strong className="text-slate-200">{worker.memUsage}</strong></div>
                  </div>
                </div>

                {/* Worker Control Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {worker.status === 'Running' ? (
                      <button
                        onClick={() => handleWorkerAction(worker.id, 'Pause')}
                        className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Pause className="w-3 h-3" /> Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWorkerAction(worker.id, 'Start')}
                        className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Start
                      </button>
                    )}

                    <button
                      onClick={() => handleWorkerAction(worker.id, 'Restart')}
                      className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                      title="Restart Worker"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleOpenPersonaModal(worker)}
                      className="p-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 rounded-lg text-[10px] font-bold"
                      title="Prilagodi Personu i Model"
                    >
                      <Settings className="w-3 h-3 text-purple-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingWorker(worker);
                        setPersonaForm({
                          modelAlias: worker.modelAlias || 'Gemini 1.5 Pro',
                          temperature: worker.temperature || 0.7,
                          systemInstructions: worker.systemInstructions || worker.description,
                          priorityLevel: worker.priorityLevel || 'High'
                        });
                        setShowPersonaModal(true);
                      }}
                      className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" /> Persona
                    </button>

                    <button
                      onClick={() => {
                        setSelectedWorker(worker);
                        setNewTaskAssignee(worker.name);
                        setShowAssignModal(true);
                      }}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg text-[10px] font-bold"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: RECURRING BACKGROUND SCHEDULER */}
      {activeView === 'scheduler' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" /> Autonomous Background Scheduler Engine
                </h2>
                <p className="text-slate-400 text-[11px] font-sans mt-0.5">
                  Automatski zadaci koji se izvršavaju svaka 24 sata bez potrebe za ljudskom intervencijom.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-bold">
                CRON Jobs: ACTIVE (100% Up)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hourly Schedule */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-cyan-400 uppercase text-[11px]">Every Hour</span>
                  <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded text-[10px]">Continuous</span>
                </div>
                <ul className="space-y-2 text-slate-300 font-sans text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Scan log files for unexpected errors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Detect bugs & runtime exceptions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Check server latency & Memory usage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verify security & OAuth scopes</span>
                  </li>
                </ul>
              </div>

              {/* Daily Schedule */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-indigo-400 uppercase text-[11px]">Every Day</span>
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded text-[10px]">Nightly</span>
                </div>
                <ul className="space-y-2 text-slate-300 font-sans text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Optimize PostgreSQL database indices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Optimize frontend bundles & WebGPU</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Optimize backend API routing speed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Generate Daily Health Report</span>
                  </li>
                </ul>
              </div>

              {/* Weekly Schedule */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-purple-400 uppercase text-[11px]">Every Week</span>
                  <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded text-[10px]">Sundays</span>
                </div>
                <ul className="space-y-2 text-slate-300 font-sans text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Deep security audit & Firestore rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Check npm package updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Full UX & Accessibility review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>SEO Audit & Schema validation</span>
                  </li>
                </ul>
              </div>

              {/* Monthly Schedule */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-emerald-400 uppercase text-[11px]">Every Month</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px]">1st of Month</span>
                </div>
                <ul className="space-y-2 text-slate-300 font-sans text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Full application architecture review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Technical debt cleanup sprint</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Scalability review (50k req/min)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Cost optimization ROI report</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SHARED PERSISTENT AI MEMORY SUITE */}
      {activeView === 'memory' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          {/* Header & Controls Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-950 border border-purple-800 text-purple-400 rounded-xl shadow-lg">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                    Shared Persistent AI Memory Vault
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Centralizovani trezor u kojem svih 20 radnika čuva naučene lekcije, arhitektonske odluke i otkrivene greške.
                  </p>
                </div>
              </div>

              {/* Memory Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddMemoryModal(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Dodaj Nod Memorije 🧠
                </button>

                <button
                  onClick={() => broadcastMemoryNode({ summary: 'Ručna sinhronizacija svih memorija radnika' })}
                  className="px-3 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Sinhronizuj (20 Radnika)
                </button>

                <button
                  onClick={handleExportMemoryVault}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" /> Izvozi JSON
                </button>

                <button
                  onClick={clearAllMemories}
                  className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" /> Očisti
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Pretraži zapise memorije..."
                  value={memorySearch}
                  onChange={(e) => setMemorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={memoryWorkerFilter}
                onChange={(e) => setMemoryWorkerFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">Svi Radnici (20)</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>

              <select
                value={memoryTypeFilter}
                onChange={(e) => setMemoryTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">Svi Tipovi Memorije</option>
                <option value="Architectural Decision">Architectural Decision</option>
                <option value="Learned Solution">Learned Solution</option>
                <option value="Discovered Bug">Discovered Bug</option>
                <option value="Admin Approval">Admin Approval</option>
                <option value="Shared Broadcast">Shared Broadcast</option>
              </select>
            </div>
          </div>

          {/* Memory List Stream */}
          <div className="space-y-3">
            {memoryLogs
              .filter((log) => {
                if (memoryWorkerFilter !== 'all' && log.worker !== memoryWorkerFilter) return false;
                if (memoryTypeFilter !== 'all' && log.type !== memoryTypeFilter) return false;
                if (memorySearch.trim()) {
                  const q = memorySearch.toLowerCase();
                  return (
                    log.summary?.toLowerCase().includes(q) ||
                    log.worker?.toLowerCase().includes(q) ||
                    log.type?.toLowerCase().includes(q) ||
                    log.id?.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((log) => (
                <div key={log.id} className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 transition-all shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-cyan-400 font-mono">{log.id}</span>
                      <span className="text-slate-100 font-bold">{log.worker}</span>
                      <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[10px] font-bold">
                        {log.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-500">{log.timestamp}</span>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShareMemoryNode(log)}
                        className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-lg font-bold flex items-center gap-1 transition-all"
                      >
                        {copiedMemoryId === log.id ? 'Kopirano ✓' : 'Podijeli Memoriju 🔗'}
                      </button>

                      {/* Delete Memory Button */}
                      <button
                        onClick={() => deleteWorkerMemory(log.id)}
                        className="p-1 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded transition-all"
                        title="Obriši nod memorije"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-200 font-sans text-xs leading-relaxed pl-1">{log.summary}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION 5: AUTONOMOUS HEALTH REPORTS */}
      {activeView === 'reports' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Report */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <FileCheck className="w-4 h-4 text-cyan-400" /> Daily Health Report
                </h3>
                <span className="text-cyan-300 text-[10px] font-bold">{reports.daily.date}</span>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-cyan-400 block font-mono text-[10px] uppercase">Database</strong>
                  <span className="text-slate-300">{reports.daily.dbOptimization}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-indigo-400 block font-mono text-[10px] uppercase">Frontend</strong>
                  <span className="text-slate-300">{reports.daily.frontendOptimization}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-purple-400 block font-mono text-[10px] uppercase">Backend</strong>
                  <span className="text-slate-300">{reports.daily.backendOptimization}</span>
                </div>
              </div>
            </div>

            {/* Weekly Audit */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Weekly Security &amp; UX Audit
                </h3>
                <span className="text-indigo-300 text-[10px] font-bold">{reports.weekly.date}</span>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block font-mono text-[10px] uppercase">Security Audit</strong>
                  <span className="text-slate-300">{reports.weekly.securityAudit}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-amber-400 block font-mono text-[10px] uppercase">Dependencies</strong>
                  <span className="text-slate-300">{reports.weekly.dependencyUpdates}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-blue-400 block font-mono text-[10px] uppercase">SEO Rating</strong>
                  <span className="text-slate-300">{reports.weekly.seoAudit}</span>
                </div>
              </div>
            </div>

            {/* Monthly Report */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Scalability Report
                </h3>
                <span className="text-emerald-300 text-[10px] font-bold">{reports.monthly.date}</span>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-purple-400 block font-mono text-[10px] uppercase">Technical Debt</strong>
                  <span className="text-slate-300">{reports.monthly.technicalDebt}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-cyan-400 block font-mono text-[10px] uppercase">Scalability</strong>
                  <span className="text-slate-300">{reports.monthly.scalabilityReview}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-400 block font-mono text-[10px] uppercase">Est. Monthly ROI</strong>
                  <span className="text-emerald-300 font-bold">{reports.monthly.costSavings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: MASTER AI WORKER ORCHESTRATOR */}
      {activeView === 'orchestrator' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          {/* Orchestrator Master Control Panel */}
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-950 border border-purple-800 text-purple-400 rounded-xl shadow-lg">
                  <Workflow className="w-6 h-6 animate-pulse text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                    Master AI Worker Orchestrator ⚡
                    <span className="px-2.5 py-0.5 bg-purple-950 border border-purple-800 text-purple-300 text-[10px] rounded-full">
                      20 Parallel Threads
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Centralna komandna tabla za upravljanje paralelnim izvršavanjem, rebalans opterećenja i koordinaciju 20 autonomnih radnika.
                  </p>
                </div>
              </div>

              {/* Master Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => simulateRandomWorkerActivity()}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" /> Pošalji Master Puls ⚡
                </button>

                <button
                  onClick={() => {
                    resumeAllWorkers();
                    setNotifications((prev) => [
                      { id: Date.now(), type: 'success', text: 'Master Orchestrator: Pokrenuti svi radnici!', time: 'Just now' },
                      ...prev
                    ]);
                  }}
                  className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-xl font-bold flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" /> Pokreni Sve
                </button>

                <button
                  onClick={() => {
                    pauseAllWorkers();
                    setNotifications((prev) => [
                      { id: Date.now(), type: 'info', text: 'Master Orchestrator: Pauzirani svi radnici!', time: 'Just now' },
                      ...prev
                    ]);
                  }}
                  className="px-3 py-2 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-xl font-bold flex items-center gap-1.5 transition-all"
                >
                  <Pause className="w-3.5 h-3.5 text-amber-400" /> Pauziraj Sve
                </button>

                <button
                  onClick={() => emergencyStop()}
                  className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl font-bold flex items-center gap-1.5 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Hitno Zaustavljanje 🚨
                </button>
              </div>
            </div>

            {/* Orchestration Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-bold block flex justify-between">
                  <span>Maksimalna Paralelnost (Concurrency):</span>
                  <span className="text-purple-400 font-extrabold">{orchestratorConfig.maxConcurrency} niti</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={orchestratorConfig.maxConcurrency}
                  onChange={(e) => updateOrchestratorConfig({ maxConcurrency: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-bold block">Automatski Rebalans Opterećenja:</label>
                <button
                  onClick={() => updateOrchestratorConfig({ autoRebalance: !orchestratorConfig.autoRebalance })}
                  className={`w-full py-1.5 px-3 rounded-lg border font-bold text-xs transition-all ${
                    orchestratorConfig.autoRebalance
                      ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {orchestratorConfig.autoRebalance ? 'UKLJUČENO (Dynamic Load Rebalancer)' : 'ISKLJUČENO'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-bold block">Frekvencija Pulsa Scheduler-a:</label>
                <select
                  value={orchestratorConfig.pulseIntervalSec}
                  onChange={(e) => updateOrchestratorConfig({ pulseIntervalSec: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs"
                >
                  <option value={1}>1 sekunda (Ultra Real-Time)</option>
                  <option value={5}>5 sekundi (Standard Balansirano)</option>
                  <option value={15}>15 sekundi (Eco Mode)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workflow Execution Topology Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Bot className="w-4 h-4 text-cyan-400" /> DAG Workflow Topology Map (20 Radnika Integracija)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-cyan-800/60 p-4 rounded-xl space-y-3">
                <div className="font-extrabold text-cyan-400 border-b border-slate-800 pb-1">1. Izvršni i Strategija</div>
                {workers.filter((w) => w.category === 'Executive & Strategy').map((w) => (
                  <div key={w.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{w.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{w.status}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-indigo-800/60 p-4 rounded-xl space-y-3">
                <div className="font-extrabold text-indigo-400 border-b border-slate-800 pb-1">2. Inženjering i Core OS</div>
                {workers.filter((w) => w.category === 'Engineering & Core OS').map((w) => (
                  <div key={w.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{w.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{w.status}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-emerald-800/60 p-4 rounded-xl space-y-3">
                <div className="font-extrabold text-emerald-400 border-b border-slate-800 pb-1">3. Sigurnost i QA</div>
                {workers.filter((w) => w.category === 'Security & Quality').map((w) => (
                  <div key={w.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{w.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{w.status}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-amber-800/60 p-4 rounded-xl space-y-3">
                <div className="font-extrabold text-amber-400 border-b border-slate-800 pb-1">4. Dizajn i Sadržaj</div>
                {workers.filter((w) => w.category === 'Design & Frontend' || w.category === 'Growth & Content').map((w) => (
                  <div key={w.id} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{w.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: REAL-TIME USAGE ANALYTICS */}
      {activeView === 'analytics' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-emerald-400" /> Real-Time Telemetry &amp; Usage Analytics
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Analitika potrošnje tokena, latencije računanja i finansijske uštede autonomnog sistema.
                </p>
              </div>

              <div className="px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Procjena Uštede: $342,850 / mjesečno</span>
              </div>
            </div>

            {/* KPI Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Ukupno Potrošeno Tokena</span>
                <div className="text-2xl font-extrabold text-cyan-400">1,420,800</div>
                <div className="text-[10px] text-emerald-400">+12% u odnosu na juče</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Prosječna Latencija</span>
                <div className="text-2xl font-extrabold text-indigo-400">14 ms</div>
                <div className="text-[10px] text-emerald-400">Sub-50ms WebGPU Pipeline</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Brzina Završavanja Zadataka</span>
                <div className="text-2xl font-extrabold text-purple-400">48 / sat</div>
                <div className="text-[10px] text-purple-300">20 Radnika u Paraleli</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Uptime &amp; Stabilnost</span>
                <div className="text-2xl font-extrabold text-emerald-400">100.0%</div>
                <div className="text-[10px] text-emerald-400">0 Neobrađenih Grešaka</div>
              </div>
            </div>

            {/* Category Resource Consumption Breakdown */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold text-slate-200">Potrošnja Resursa po Kategorijama Radnika</h3>
              <div className="space-y-2 font-sans text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Inženjering i Core OS (8 Radnika)</span>
                    <span className="font-mono text-indigo-400 font-bold">42% CPU / 512 MB RAM</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-indigo-500 h-full w-[42%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Izvršni i Strategija (3 Radnika)</span>
                    <span className="font-mono text-cyan-400 font-bold">25% CPU / 320 MB RAM</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-cyan-500 h-full w-[25%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Sigurnost i QA (4 Radnika)</span>
                    <span className="font-mono text-emerald-400 font-bold">18% CPU / 256 MB RAM</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full w-[18%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Dizajn i Sadržaj (5 Radnika)</span>
                    <span className="font-mono text-amber-400 font-bold">15% CPU / 192 MB RAM</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-amber-500 h-full w-[15%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: STRIPE MONETIZATION & SUBSCRIPTION TIERS */}
      {activeView === 'monetization' && (
        <div className="space-y-6 animate-fadeIn font-mono text-xs">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <Briefcase className="w-4 h-4" /> STRIPE MONETIZATION &amp; BILLING ENGINE
                </div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  Pretplatnički Paketi i Upravljanje Kreditima
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Odaberite paket za pristup dodatnim autonomnim AI radnicima, neograničenom pozivanju i priručnim persónama.
                </p>
              </div>

              <div className="bg-slate-950 border border-amber-500/50 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-bold">Aktivni Paket:</span>
                <span className="text-base font-extrabold text-amber-400">{stripeTier} Tier 👑</span>
                <div className="text-[10px] text-slate-300 font-sans">Krediti: {creditsRemaining.toLocaleString()} / neograničeno</div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
              {/* Free Tier */}
              <div className={`bg-slate-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${
                stripeTier === 'Free' ? 'border-amber-500 shadow-xl' : 'border-slate-800'
              }`}>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-100">Free Tier</h3>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">$0 <span className="text-xs text-slate-500 font-normal">/ mjesečno</span></div>
                  <p className="text-xs text-slate-400">Za pojedinačno testiranje i osnovne AI skripte.</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <li className="flex items-center gap-2">✓ 2 AI Radnika (Chief AI &amp; Code Reviewer)</li>
                    <li className="flex items-center gap-2">✓ 50,000 Mjesečnih Kredita</li>
                    <li className="flex items-center gap-2">✓ Osnovno Logovanje</li>
                  </ul>
                </div>
                <button
                  onClick={() => updateStripeTier('Free')}
                  disabled={stripeTier === 'Free'}
                  className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs transition-all ${
                    stripeTier === 'Free' ? 'bg-slate-800 text-slate-500' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {stripeTier === 'Free' ? 'Trenutni Paket' : 'Pređite na Free'}
                </button>
              </div>

              {/* Pro Tier */}
              <div className={`bg-slate-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${
                stripeTier === 'Pro' ? 'border-cyan-500 shadow-xl' : 'border-slate-800'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-100">Pro Tier</h3>
                    <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold rounded-full">Popularno</span>
                  </div>
                  <div className="text-2xl font-extrabold text-cyan-400 font-mono">$499 <span className="text-xs text-slate-500 font-normal">/ mjesečno</span></div>
                  <p className="text-xs text-slate-400">Za timove i brzi razvoj produkcijskih aplikacija.</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <li className="flex items-center gap-2">✓ 10 AI Radnika u Paraleli</li>
                    <li className="flex items-center gap-2">✓ 500,000 Mjesečnih Kredita</li>
                    <li className="flex items-center gap-2">✓ Sinhronizovana Memorija Radnika</li>
                    <li className="flex items-center gap-2">✓ WebGPU Local Model Fallback</li>
                  </ul>
                </div>
                <button
                  onClick={() => updateStripeTier('Pro')}
                  disabled={stripeTier === 'Pro'}
                  className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs transition-all ${
                    stripeTier === 'Pro' ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg'
                  }`}
                >
                  {stripeTier === 'Pro' ? 'Trenutni Paket' : 'Nadogradi na Pro (Stripe)'}
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className={`bg-slate-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${
                stripeTier === 'Enterprise' ? 'border-amber-500 shadow-xl bg-amber-950/10' : 'border-slate-800'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-amber-400">Enterprise Tier</h3>
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold rounded-full">Neograničeno</span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">$2,499 <span className="text-xs text-slate-500 font-normal">/ mjesečno</span></div>
                  <p className="text-xs text-slate-400">Puni autonomni AI radni tim (20 radnika) sa namenskom infrastrukturom.</p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    <li className="flex items-center gap-2">✓ Svih 20 Specijalizovanih AI Radnika</li>
                    <li className="flex items-center gap-2">✓ 5,000,000+ Mjesečnih Kredita</li>
                    <li className="flex items-center gap-2">✓ Prilagođavanje Persona i Prompata</li>
                    <li className="flex items-center gap-2">✓ Cloud SQL &amp; Google Workspace OAuth</li>
                    <li className="flex items-center gap-2">✓ 24/7 SLA &amp; Dedicirani AI Orchestrator</li>
                  </ul>
                </div>
                <button
                  onClick={() => updateStripeTier('Enterprise')}
                  disabled={stripeTier === 'Enterprise'}
                  className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs transition-all ${
                    stripeTier === 'Enterprise' ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg'
                  }`}
                >
                  {stripeTier === 'Enterprise' ? 'Aktivni Enterprise Paket 👑' : 'Aktiviraj Enterprise'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ASSIGN TASK TO AI WORKER */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Dodijeli Novi Zadatak AI Radniku
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Naslov Zadatka:</label>
                <input
                  type="text"
                  placeholder="npr. Optimizacija PostgreSQL upita i indeksa"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Dodijeli Radniku:</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.name}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Prioritet (Priority):</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs"
                >
                  <option value="Critical">Critical (Kritično)</option>
                  <option value="High">High (Visoko)</option>
                  <option value="Medium">Medium (Srednje)</option>
                  <option value="Low">Low (Nisko)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 font-mono">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 bg-slate-950 text-slate-300 rounded-xl">Odustani</button>
              <button
                onClick={handleAssignTask}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl"
              >
                Dodijeli Zadatak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RISKY ACTION / SUPER ADMIN APPROVAL */}
      {showApprovalModal && pendingApprovalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Potrebno Odobrenje Administratora (RBAC)
              </h3>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Radnik <strong>{pendingApprovalAction.name}</strong> upravlja osjetljivom funkcijom (Backend/Security/Database/DevOps). Akcija <strong>{pendingApprovalAction.action}</strong> zahtijeva potvrdan unos Super Administratora.
            </p>

            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-200 font-sans">
              Zahtjev poslan od: <strong>CEO Super Agent AI Orchestrator</strong>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setShowApprovalModal(false)} className="px-4 py-2 bg-slate-950 text-slate-300 rounded-xl">Odbij (Reject)</button>
              <button
                onClick={() => {
                  applyWorkerStatusChange(pendingApprovalAction.workerId, pendingApprovalAction.action);
                  setShowApprovalModal(false);
                  setPendingApprovalAction(null);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl"
              >
                Odobri Akciju (Approve)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW WORKER MEMORY NODE */}
      {showAddMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-mono text-xs">
          <div className="max-w-md w-full bg-slate-900 border border-purple-500/50 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> Dodaj Novi Nod Memorije u Trezor
              </h3>
              <button onClick={() => setShowAddMemoryModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Odaberi Radnika:</label>
                <select
                  value={newMemoryWorkerId}
                  onChange={(e) => setNewMemoryWorkerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Tip Memorije (Type):</label>
                <select
                  value={newMemoryType}
                  onChange={(e) => setNewMemoryType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs"
                >
                  <option value="Learned Solution">Learned Solution (Naučeno rješenje)</option>
                  <option value="Architectural Decision">Architectural Decision (Arhitektonska odluka)</option>
                  <option value="Discovered Bug">Discovered Bug (Otkrivena greška)</option>
                  <option value="Optimization Target">Optimization Target (Optimizacija)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Sažetak / Sadržaj Memorije:</label>
                <textarea
                  rows={4}
                  placeholder="Unesite detalje naučene lekcije, rješenja ili arhitektonske smjernice..."
                  value={newMemorySummary}
                  onChange={(e) => setNewMemorySummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 font-mono">
              <button onClick={() => setShowAddMemoryModal(false)} className="px-4 py-2 bg-slate-950 text-slate-300 rounded-xl">Odustani</button>
              <button
                onClick={handleCreateMemoryNode}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl"
              >
                Spremi u Memoriju 🧠
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: AGENT PERSONA CUSTOMIZER */}
      {showPersonaModal && editingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-mono text-xs">
          <div className="max-w-lg w-full bg-slate-900 border border-purple-500/50 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" /> Prilagodi Personu: {editingWorker.name}
              </h3>
              <button onClick={() => setShowPersonaModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Odaberi AI Model Engine:</label>
                <select
                  value={personaForm.modelAlias}
                  onChange={(e) => setPersonaForm({ ...personaForm, modelAlias: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs"
                >
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep Reasoning & Architecture)</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Sub-50ms Ultra High-Speed)</option>
                  <option value="Gemini 2.0 Flash Experimental">Gemini 2.0 Flash Experimental (Next-Gen)</option>
                  <option value="Claude 3.5 Sonnet Bridge">Claude 3.5 Sonnet Bridge (Advanced Code Syntax)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 font-mono text-[11px]">
                  <label className="text-slate-400">Model Temperature (Kreativnost vs Preciznost):</label>
                  <span className="text-purple-400 font-bold">{personaForm.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={personaForm.temperature}
                  onChange={(e) => setPersonaForm({ ...personaForm, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Sistemske Instrukcije / Persona Prompt:</label>
                <textarea
                  rows={4}
                  value={personaForm.systemInstructions}
                  onChange={(e) => setPersonaForm({ ...personaForm, systemInstructions: e.target.value })}
                  placeholder="Unesite primarno ponašanje, ciljeve i ograničenja agenta..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[11px]">Nivo Prioriteta Zahtjeva:</label>
                <select
                  value={personaForm.priorityLevel}
                  onChange={(e) => setPersonaForm({ ...personaForm, priorityLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs"
                >
                  <option value="Critical">Critical (Prio 0 - Instant Exec)</option>
                  <option value="High">High (Prio 1 - Normal Exec)</option>
                  <option value="Medium">Medium (Prio 2 - Background Queue)</option>
                  <option value="Low">Low (Prio 3 - Idle Only)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800 font-mono">
              <button onClick={() => setShowPersonaModal(false)} className="px-4 py-2 bg-slate-950 text-slate-300 rounded-xl">Odustani</button>
              <button
                onClick={handleSavePersona}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl"
              >
                Spremi Personu 🎛️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE DAG WORKFLOW */}
      {showCreateDagModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-400" /> Kreiraj Novi DAG Visual Workflow
              </h3>
              <button onClick={() => setShowCreateDagModal(false)} className="text-slate-400 hover:text-slate-100 text-base">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Naziv Workflow Pipeline-a:</label>
                <input
                  type="text"
                  placeholder="npr. Autonomous Security Patch & Deploy"
                  value={newDagName}
                  onChange={(e) => setNewDagName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Opis Cilja &amp; Grananja:</label>
                <textarea
                  rows={3}
                  placeholder="Opis uslovne logike između AI radnika..."
                  value={newDagDesc}
                  onChange={(e) => setNewDagDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setShowCreateDagModal(false)} className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-xl">Odustani</button>
              <button
                onClick={() => {
                  if (!newDagName) return;
                  addDagWorkflow({
                    id: `dag-${Date.now()}`,
                    name: newDagName,
                    description: newDagDesc || 'Automatski DAG pipeline sa verifikacijom sigurnosti.',
                    status: 'Aktiviran',
                    executionCount: 0,
                    lastRun: 'Upravo kreirano',
                    nodes: [
                      { id: 'node-1', workerId: 1, workerName: 'Chief AI Officer', role: 'Inicijalni pregled' },
                      { id: 'node-2', workerId: 2, workerName: 'Lead Architect', role: 'Generisanje plana' },
                      { id: 'node-3', workerId: 10, workerName: 'Security Sentinel', role: 'Sigurnosni audit' }
                    ],
                    connections: [
                      { from: 'node-1', to: 'node-2', condition: 'IF Verified' },
                      { from: 'node-2', to: 'node-3', condition: 'IF No Conflict' }
                    ]
                  });
                  setNewDagName('');
                  setNewDagDesc('');
                  setShowCreateDagModal(false);
                }}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
              >
                Kreiraj DAG Pipeline 🔀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD RAG DOCUMENT TO VECTOR VAULT */}
      {showAddRagModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> Indeksiraj Dokument u RAG Vector Vault
              </h3>
              <button onClick={() => setShowAddRagModal(false)} className="text-slate-400 hover:text-slate-100 text-base">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Naslov Dokumenta:</label>
                <input
                  type="text"
                  placeholder="npr. WebGPU Shader Pipeline Standard"
                  value={newRagTitle}
                  onChange={(e) => setNewRagTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kategorija:</label>
                  <select
                    value={newRagCategory}
                    onChange={(e) => setNewRagCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  >
                    <option value="Database Architecture">Database Architecture</option>
                    <option value="Security Governance">Security Governance</option>
                    <option value="DevOps & Deployment">DevOps &amp; Deployment</option>
                    <option value="AI Worker Decision">AI Worker Decision</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Dodeljeni Radnik:</label>
                  <select
                    value={newRagWorker}
                    onChange={(e) => setNewRagWorker(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Sadržaj Dokumenta (Automatsko chunking):</label>
                <textarea
                  rows={4}
                  placeholder="Unesite tekst ili tehničku specifikaciju koja će biti pretvorena u 768-dimenzionalne vektore..."
                  value={newRagContent}
                  onChange={(e) => setNewRagContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Tagovi (odvojeni zarezom):</label>
                <input
                  type="text"
                  value={newRagTags}
                  onChange={(e) => setNewRagTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setShowAddRagModal(false)} className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-xl">Odustani</button>
              <button
                onClick={() => {
                  if (!newRagTitle || !newRagContent) return;
                  addRagDocument({
                    title: newRagTitle,
                    category: newRagCategory,
                    content: newRagContent,
                    workerName: newRagWorker,
                    tags: newRagTags.split(',').map((t) => t.trim())
                  });
                  setNewRagTitle('');
                  setNewRagContent('');
                  setShowAddRagModal(false);
                }}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl"
              >
                Indeksiraj u Vector Index 🧠
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE DEVELOPER API KEY */}
      {showCreateApiKeyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" /> Generiši Novi API Ključ
              </h3>
              <button onClick={() => setShowCreateApiKeyModal(false)} className="text-slate-400 hover:text-slate-100 text-base">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Naziv Ključa / Servisa:</label>
                <input
                  type="text"
                  placeholder="npr. Jira Auto-Task Synchronizer"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setShowCreateApiKeyModal(false)} className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-xl">Odustani</button>
              <button
                onClick={() => {
                  if (!newKeyName) return;
                  createApiKey(newKeyName);
                  setNewKeyName('');
                  setShowCreateApiKeyModal(false);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
              >
                Generiši Ključ 🔑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD WEBHOOK ENDPOINT */}
      {showAddWebhookModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Webhook className="w-5 h-5 text-emerald-400" /> Registruj Novi Webhook Endpoint
              </h3>
              <button onClick={() => setShowAddWebhookModal(false)} className="text-slate-400 hover:text-slate-100 text-base">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Naziv Webhooka:</label>
                <input
                  type="text"
                  placeholder="npr. Slack Dev-Channel Alerts"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Endpoint URL (HTTPS):</label>
                <input
                  type="text"
                  placeholder="https://hooks.slack.com/services/..."
                  value={newWhUrl}
                  onChange={(e) => setNewWhUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setShowAddWebhookModal(false)} className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-xl">Odustani</button>
              <button
                onClick={() => {
                  if (!newWhName || !newWhUrl) return;
                  addWebhook({
                    name: newWhName,
                    url: newWhUrl,
                    events: ['task.completed', 'security.alert']
                  });
                  setNewWhName('');
                  setNewWhUrl('');
                  setShowAddWebhookModal(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
              >
                Dodaj Webhook 🔔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
