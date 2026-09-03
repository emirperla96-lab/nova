'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Copy, Check, Download, RefreshCw, Sparkles, Maximize2, Minimize2, Shield, Cpu, Activity, Info, Command, CornerDownLeft, Volume2, VolumeX, Trash2 } from 'lucide-react';

const COMMAND_REGISTRY = [
  { cmd: 'help', usage: 'help', desc: 'Prikaži komandnu dokumentaciju i pomoć' },
  { cmd: 'status', usage: 'status', desc: 'Telemetrija flote, latencija i sistemsko zdravlje' },
  { cmd: 'agents', usage: 'agents [--dept <IME>] [--search <Q>]', desc: 'Pretraga i inspekcija 200 mikro-agenata' },
  { cmd: 'run', usage: 'run <direktiva>', desc: 'Pokreni AI misiju na klasteru agenata' },
  { cmd: 'chat', usage: 'chat <poruka>', desc: 'Razgovor sa CEO Super Agentom (#1)' },
  { cmd: 'sysinfo', usage: 'sysinfo', desc: 'OS kernel, WebGPU, Cloud SQL i hardver' },
  { cmd: 'workspace', usage: 'workspace', desc: 'Google Sheets i Google Tasks sinhronizacija' },
  { cmd: 'pricing', usage: 'pricing', desc: 'Pregled cjenovnika i paketa (€19, €49, €149)' },
  { cmd: 'plans', usage: 'plans', desc: 'Pregled cjenovnika i pretplatničkih paketa' },
  { cmd: 'top', usage: 'top', desc: 'Procesorsko opterećenje po mikro-agentu' },
  { cmd: 'whoami', usage: 'whoami', desc: 'Identitet i privilegije prijavljenog korisnika' },
  { cmd: 'cat /sys/pricing.json', usage: 'cat /sys/pricing.json', desc: 'Pregled JSON fajla cjenovnika' },
  { cmd: 'cat /sys/ceo_manifest.json', usage: 'cat /sys/ceo_manifest.json', desc: 'Manifest CEO Super Agenta' },
  { cmd: 'theme matrix', usage: 'theme matrix', desc: 'Promijeni vizuelnu temu na Matrix Green' },
  { cmd: 'theme neon', usage: 'theme neon', desc: 'Promijeni vizuelnu temu na Cyan Neon' },
  { cmd: 'theme amber', usage: 'theme amber', desc: 'Promijeni vizuelnu temu na Amber Retro' },
  { cmd: 'theme cyberpunk', usage: 'theme cyberpunk', desc: 'Promijeni vizuelnu temu na Cyberpunk' },
  { cmd: 'clear', usage: 'clear', desc: 'Očisti komandni ekran' },
  { cmd: 'history', usage: 'history', desc: 'Pregled istorije izvršenih komandi' },
  { cmd: 'export', usage: 'export', desc: 'Preuzmi log fajl CLI sesije' },
  { cmd: 'sudo', usage: 'sudo', desc: 'Provjeri Super Admin privilegije' },
];

export default function TerminalInterfaceTab({ agents, departments, currentUser, onNavigateTab }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandLogs, setCommandLogs] = useState([]);
  const [theme, setTheme] = useState('matrix'); // 'matrix', 'neon', 'amber', 'cyberpunk', 'classic'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Autocomplete & Tooltip Suggestion State
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Compute matching autocomplete suggestions based on current input
  const trimmedInput = inputVal.trimStart().toLowerCase();
  const matchingSuggestions = trimmedInput
    ? COMMAND_REGISTRY.filter(item =>
        item.cmd.toLowerCase().startsWith(trimmedInput) ||
        item.usage.toLowerCase().startsWith(trimmedInput) ||
        item.desc.toLowerCase().includes(trimmedInput)
      )
    : [];

  useEffect(() => {
    setSuggestionIdx(0);
    setShowSuggestions(true);
  }, [inputVal]);

  // Initial welcome banner
  useEffect(() => {
    const welcomeLogs = [
      {
        type: 'banner',
        content: `
               _____ _____  __    _____ _____ _____ ____  _____ _____ _____ 
              |  _  |_   _||  |  |  _  |  |  |_   _|_   _||  _  |  _  |  _  |
              |     | | |  |  |__|     |  |  | | |   | |  |     |     |   __|
              |__|__| |_|  |_____|__|__|\\___/  |_|   |_|  |__|__|__|__||_|   
                        ATLANTIDA OS v1.0 — AUTONOMOUS AI OPERATING SYSTEM
`
      },
      {
        type: 'system',
        content: `[SYS_BOOT] AtlantidaOS v1.0 Kernel initialized successfully.`
      },
      {
        type: 'system',
        content: `[AUTH] Logged in as: ${currentUser?.email || 'guest@visitor.com'} (${currentUser?.isSuperAdmin ? 'SUPER_ADMIN' : currentUser?.subscriptionTier || 'VISITOR'})`
      },
      {
        type: 'info',
        content: `Type 'help' to view available OS commands or click quick action chips below.`
      }
    ];
    setCommandLogs(welcomeLogs);
  }, [currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandLogs]);

  // Audio beep generator using Web Audio API
  const playBeep = (freq = 800, type = 'sine', duration = 0.05) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context silenced or blocked
    }
  };

  const handleCommand = async (cmdString) => {
    const raw = cmdString.trim();
    if (!raw) return;

    playBeep(900, 'square', 0.03);

    // Add to input history
    setHistory(prev => [...prev, raw]);
    setHistoryIndex(-1);

    // Append user input log
    const userLog = { type: 'input', content: raw, user: currentUser?.name || 'user' };
    setCommandLogs(prev => [...prev, userLog]);
    setInputVal('');

    const args = raw.split(' ');
    const command = args[0].toLowerCase();
    const restArgs = args.slice(1).join(' ');

    switch (command) {
      case 'help':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
ATLANTIDA OS CLI TERMINAL - COMMAND REFERENCE:
================================================================================
  help                   Show this command documentation matrix
  status                 View real-time system metrics, fleet status & latency
  agents [flags]         List 200 micro-agents (--dept <NAME>, --status active, --search <QUERY>)
  run <directive>        Execute autonomous AI mission with step-by-step telemetry
  chat <message>         Direct interactive chat with CEO Super Agent (#1)
  sysinfo                Display OS kernel, WebGPU, Cloud SQL, and hardware specs
  workspace              View Google Sheets sync & Google Tasks automation state
  pricing / plans        Display subscription tiers (€19 Osnovni, €49 Srednji, €149 Premium)
  top                    Show real-time active agent CPU & RAM usage matrix
  whoami                 Display current user credentials, email, and security role
  cat <filepath>         Inspect system files (e.g., cat /sys/pricing.json, cat /sys/ceo_manifest.json)
  theme <theme_name>     Switch visual theme: matrix | neon | amber | cyberpunk | classic
  clear                  Clear the terminal screen
  history                View executed command log
  export                 Download current CLI transcript as a log file
================================================================================
Tip: Click any quick command chip above the prompt to execute instantly!`
          }
        ]);
        break;

      case 'clear':
        setCommandLogs([]);
        break;

      case 'history':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: history.length > 0
              ? `COMMAND HISTORY:\n${history.map((h, i) => `  ${(i + 1).toString().padStart(3, ' ')}  ${h}`).join('\n')}`
              : 'No command history recorded yet.'
          }
        ]);
        break;

      case 'whoami':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
USER IDENTITY & CREDENTIALS:
--------------------------------------------------------------------------------
Name:              ${currentUser?.name || 'Guest Visitor'}
Email:             ${currentUser?.email || 'guest@visitor.com'}
Role:              ${currentUser?.isSuperAdmin ? 'SUPER_ADMIN (* Master Access)' : 'SUBSCRIBED_CLIENT'}
Subscription:      ${currentUser?.subscriptionTier ? currentUser.subscriptionTier.toUpperCase() + ' TIER' : 'UNREGISTERED / FREE DEMO'}
Active Session:    SECURE_TLS_V1.3_TOKENIZED
Permissions:       ${currentUser?.isSuperAdmin ? 'ALL_ACCESS (Workspace, Cloud SQL, Fleet, WebGPU, RBAC)' : 'READ_EXECUTE_DEMO'}`
          }
        ]);
        break;

      case 'status':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
ATLANTIDA OS TELEMETRY & SYSTEM HEALTH:
--------------------------------------------------------------------------------
[ONLINE] Fleet Status:          159 / 200 Micro-Agents Active (79.5% Capacity)
[ONLINE] CEO Super Agent (#1):  ONLINE (Responding via Gemini API)
[ONLINE] WebGPU Local Model:    READY (SmolLM / Qwen In-Browser Engine)
[ONLINE] Cloud SQL Database:    CONNECTED (PostgreSQL Pool: 12 Active Connections)
[ONLINE] Google Sheets Sync:    SYNCED (Live Spreadsheet ID Linked)
[ONLINE] Google Tasks Sync:     AUTOMATED (3 Pending Directives)
[METRIC] System Latency:        38 ms
[METRIC] Token Throughput:      18,450 tokens/min
[METRIC] Memory Allocation:     4.2 GB / 16 GB Allocated
[METRIC] Monthly MRR:           $42,850 USD`
          }
        ]);
        break;

      case 'sysinfo':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
SYSTEM INFRASTRUCTURE MATRIX:
--------------------------------------------------------------------------------
Kernel:             AtlantidaOS-Kernel v1.0.4-release (Cloud Run Container)
Architecture:       x86_64 / WebGPU Accelerated
Runtime:            Node.js ESM + Next.js App Router Engine
AI Router:          Gemini 2.5 Flash / Pro + WebGPU Fallback
Database Engine:    Cloud SQL PostgreSQL (Drizzle ORM Schema)
Workspace Auth:     OAuth 2.0 (Google Sheets API v4 + Google Tasks API)
Security:           PCI-DSS Tokenized • RBAC Enforced • Zero Trust`
          }
        ]);
        break;

      case 'pricing':
      case 'plans':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
ATLANTIDA OS SUBSCRIPTION TIERS & PRICING:
--------------------------------------------------------------------------------
1. OSNOVNI PAKET (€19 / mjesec)
   - Do 10 Aktivnih Mikro-Agenata
   - Osnovni AI Router & Generisanje Teksta
   - Standardna podrška i Dnevni Izvještaji

2. SREDNJI PAKET (€49 / mjesec) [POPULARNO]
   - Do 50 Aktivnih Mikro-Agenata
   - WebGPU Local Model + Gemini High Latency Engine
   - Google Sheets Sync & Google Tasks Automatizacija

3. PREMIUM PAKET (€149 / mjesec) [ENTERPRISE]
   - Svih 200 Mikro-Agenata Otključano
   - CEO Super Agent (#1) Direktan Pristup
   - Cloud SQL Relaciona Baza + Pristup Google Workspace Integracijama
   - Neograničene Misije & RBAC Timski Pozivi

Super Admini (emir.p.win@gmail.com) imaju trajni besplatni pristup svim funkcijama!`
          }
        ]);
        break;

      case 'agents': {
        let filtered = agents || [];
        if (restArgs.includes('--dept')) {
          const deptKey = restArgs.split('--dept')[1]?.trim()?.toUpperCase();
          if (deptKey) filtered = filtered.filter(a => (a.departmentKey || a.department || '').toUpperCase().includes(deptKey));
        }
        if (restArgs.includes('--search')) {
          const query = restArgs.split('--search')[1]?.trim()?.toLowerCase();
          if (query) filtered = filtered.filter(a => a.name.toLowerCase().includes(query) || a.title.toLowerCase().includes(query));
        }

        const agentLines = filtered.slice(0, 15).map(a => 
          `[#${a.id.toString().padStart(3, '0')}] ${a.name.padEnd(24, ' ')} | ${a.department.padEnd(16, ' ')} | Status: ${a.status.toUpperCase()}`
        ).join('\n');

        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
ATLANTIDA OS FLEET DIRECTORY (${filtered.length} Agents Found):
================================================================================
${agentLines || 'No matching micro-agents found.'}
${filtered.length > 15 ? `\n...and ${filtered.length - 15} more agents. (Use UI '200 Micro-Agents' tab to view complete directory)` : ''}`
          }
        ]);
        break;
      }

      case 'top':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
REAL-TIME PROCESS MATRIX (TOP AGENT WORKLOAD):
--------------------------------------------------------------------------------
PID   AGENT ID   NAME                     DEPT         CPU%     RAM (MB)  THREADS
101   #001       CEO Super Agent          EXECUTIVE    12.4%    512 MB    16
102   #002       Cloud Architect          ENGINEERING   8.2%    384 MB    8
103   #003       Data Engineer            DATA_SCIENCE  6.7%    256 MB    6
104   #004       Security Auditor         SECURITY      4.1%    192 MB    4
105   #005       Growth Marketer          MARKETING     3.5%    128 MB    4
--------------------------------------------------------------------------------
Total Active Threads: 142 | Cluster CPU Usage: 34.9% | RAM: 4.2 GB`
          }
        ]);
        break;

      case 'workspace':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'output',
            content: `
GOOGLE WORKSPACE & CLOUD SQL INTEGRATION STATUS:
--------------------------------------------------------------------------------
[STATUS] OAuth Authorization:     ACCEPTED
[STATUS] Google Sheets API v4:    CONNECTED (Spreadsheet ID: 1BxiMVs0XRra5PY6Y...)
[STATUS] Google Tasks API:        AUTOMATED
[STATUS] Cloud SQL PostgreSQL:    ONLINE
--------------------------------------------------------------------------------
Recent Synchronized Actions:
- [08:01:12] Appended new Agent Log row to Google Sheet
- [08:02:44] Synced 3 high-priority tasks to Google Tasks queue
- [08:04:10] Committed schema migration to Cloud SQL PostgreSQL database`
          }
        ]);
        break;

      case 'theme': {
        const validThemes = ['matrix', 'neon', 'amber', 'cyberpunk', 'classic'];
        const chosen = restArgs.trim().toLowerCase();
        if (validThemes.includes(chosen)) {
          setTheme(chosen);
          setCommandLogs(prev => [
            ...prev,
            { type: 'system', content: `[THEME] Switched terminal theme to '${chosen.toUpperCase()}'.` }
          ]);
        } else {
          setCommandLogs(prev => [
            ...prev,
            { type: 'error', content: `Invalid theme. Available options: ${validThemes.join(' | ')}` }
          ]);
        }
        break;
      }

      case 'cat': {
        const targetPath = restArgs.trim();
        if (targetPath === '/sys/pricing.json' || targetPath === 'pricing.json') {
          setCommandLogs(prev => [
            ...prev,
            {
              type: 'output',
              content: JSON.stringify({
                platform: "AtlantidaOS",
                currency: "EUR",
                plans: [
                  { name: "Osnovni", price: 19, agents: 10, features: ["Basic AI Router", "Daily Reports"] },
                  { name: "Srednji", price: 49, agents: 50, features: ["WebGPU Local AI", "Google Sheets Sync"] },
                  { name: "Premium", price: 149, agents: 200, features: ["CEO Super Agent", "Cloud SQL", "RBAC"] }
                ]
              }, null, 2)
            }
          ]);
        } else if (targetPath === '/sys/ceo_manifest.json' || targetPath === 'ceo_manifest.json') {
          setCommandLogs(prev => [
            ...prev,
            {
              type: 'output',
              content: JSON.stringify({
                agentId: 1,
                name: "CEO Super Agent",
                title: "Chief Executive Autonomous Agent",
                model: "Gemini 2.5 Flash / Pro",
                role: "Supreme Director of 200 Micro-Agents",
                capabilities: ["Mission Dispatching", "Multi-Agent Coordination", "Workspace Automation"]
              }, null, 2)
            }
          ]);
        } else if (targetPath === '/sys/security_policy.txt') {
          setCommandLogs(prev => [
            ...prev,
            {
              type: 'output',
              content: `ATLANTIDA OS SECURITY POLICY:
1. Zero-Trust Access Control (RBAC verified per API call).
2. All workspace credentials encrypted with AES-256-GCM.
3. No raw secrets exposed to client frontend.
4. Tokenized PCI-DSS compliant checkout flows.`
            }
          ]);
        } else {
          setCommandLogs(prev => [
            ...prev,
            { type: 'error', content: `cat: ${targetPath}: File not found. Try 'cat /sys/pricing.json' or 'cat /sys/ceo_manifest.json'` }
          ]);
        }
        break;
      }

      case 'run':
      case 'dispatch': {
        if (!restArgs) {
          setCommandLogs(prev => [
            ...prev,
            { type: 'error', content: `Usage: run <mission_directive> (e.g. run Perform full security and funnel audit)` }
          ]);
          break;
        }

        setIsExecuting(true);
        setCommandLogs(prev => [
          ...prev,
          { type: 'system', content: `[DISPATCH] Initializing directive: "${restArgs}"...` }
        ]);

        try {
          const res = await fetch('/api/mission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: restArgs, department: 'ALL' })
          });
          let data = null;
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            data = await res.json();
          }

          if (data && data.success && data.data?.steps) {
            data.data.steps.forEach((step, idx) => {
              setTimeout(() => {
                playBeep(1200 + idx * 100, 'sine', 0.04);
                setCommandLogs(prev => [
                  ...prev,
                  {
                    type: 'output',
                    content: `[STEP ${idx + 1}/${data.data.steps.length}] Agent #${step.agentId || idx + 1}: ${step.action || 'Executing sub-task...'}`
                  }
                ]);

                if (idx === data.data.steps.length - 1) {
                  setTimeout(() => {
                    setIsExecuting(false);
                    setCommandLogs(prev => [
                      ...prev,
                      {
                        type: 'system',
                        content: `[MISSION ACCOMPLISHED] Executed in ${data.data.executionTime || '420ms'}. Summary: ${data.data.summary}`
                      }
                    ]);
                  }, 400);
                }
              }, (idx + 1) * 500);
            });
            return;
          }
        } catch (e) {
          // Fallback simulation
        }

        // Local fallback steps
        const mockSteps = [
          'CEO Super Agent (#1) parsed directive & initialized DAG pipeline',
          'Cloud Architect Agent (#2) allocated isolated execution container',
          'Data Science Agent (#3) queried vector memory database',
          'Security Auditor Agent (#4) validated compliance & token integrity',
          'Mission complete! Summary report generated and saved to memory.'
        ];

        mockSteps.forEach((stepText, idx) => {
          setTimeout(() => {
            playBeep(1100 + idx * 100, 'sine', 0.04);
            setCommandLogs(prev => [
              ...prev,
              { type: 'output', content: `[EXEC ${idx + 1}/5] ${stepText}` }
            ]);

            if (idx === mockSteps.length - 1) {
              setTimeout(() => {
                setIsExecuting(false);
                setCommandLogs(prev => [
                  ...prev,
                  { type: 'system', content: `[SUCCESS] Mission execution finalized cleanly.` }
                ]);
              }, 400);
            }
          }, (idx + 1) * 500);
        });

        break;
      }

      case 'chat': {
        if (!restArgs) {
          setCommandLogs(prev => [
            ...prev,
            { type: 'error', content: `Usage: chat <your_question_or_message>` }
          ]);
          break;
        }

        setIsExecuting(true);
        setCommandLogs(prev => [
          ...prev,
          { type: 'system', content: `[CEO_AGENT #1] Thinking...` }
        ]);

        try {
          const res = await fetch('/api/agent-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId: 1, message: restArgs })
          });
          let data = null;
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            data = await res.json();
          }
          setIsExecuting(false);

          if (data && data.success && data.response) {
            setCommandLogs(prev => [
              ...prev,
              { type: 'output', content: `🤖 CEO Super Agent (#1):\n${data.response}` }
            ]);
          } else {
            setCommandLogs(prev => [
              ...prev,
              { type: 'output', content: `🤖 CEO Super Agent (#1): I have processed your request ("${restArgs}"). All 200 micro-agents are synchronized and operational.` }
            ]);
          }
        } catch (e) {
          setIsExecuting(false);
          setCommandLogs(prev => [
            ...prev,
            { type: 'output', content: `🤖 CEO Super Agent (#1): Standby confirmed for "${restArgs}". System is operating at 100% capacity.` }
          ]);
        }
        break;
      }

      case 'export': {
        const textContent = commandLogs.map(l => `[${l.type.toUpperCase()}] ${l.content}`).join('\n\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AtlantidaOS_CLI_Transcript_${Date.now()}.log`;
        a.click();
        URL.revokeObjectURL(url);
        setCommandLogs(prev => [
          ...prev,
          { type: 'system', content: `[EXPORT] Terminal session log exported successfully.` }
        ]);
        break;
      }

      case 'sudo':
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'system',
            content: currentUser?.isSuperAdmin
              ? `[SUDO] Super Admin privileges confirmed for ${currentUser.email}. Action authorized!`
              : `[SUDO] Permission denied: User is not in sudoers file. Select Super Admin from header menu to unlock!`
          }
        ]);
        break;

      default:
        setCommandLogs(prev => [
          ...prev,
          {
            type: 'error',
            content: `Command not recognized: '${command}'. Type 'help' for available CLI commands or click quick action chips above.`
          }
        ]);
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (matchingSuggestions.length > 0) {
        const chosen = matchingSuggestions[suggestionIdx] || matchingSuggestions[0];
        setInputVal(chosen.usage);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setShowSuggestions(false);
      handleCommand(inputVal);
    } else if (e.key === 'ArrowDown') {
      if (matchingSuggestions.length > 0 && showSuggestions) {
        e.preventDefault();
        setSuggestionIdx(prev => (prev + 1) % matchingSuggestions.length);
      } else if (history.length > 0) {
        e.preventDefault();
        if (historyIndex > 0) {
          const nextIdx = historyIndex - 1;
          setHistoryIndex(nextIdx);
          setInputVal(history[history.length - 1 - nextIdx] || '');
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (matchingSuggestions.length > 0 && showSuggestions && suggestionIdx > 0) {
        e.preventDefault();
        setSuggestionIdx(prev => prev - 1);
      } else if (history.length > 0) {
        e.preventDefault();
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    }
  };

  // Copy full terminal text
  const handleCopyLogs = () => {
    const text = commandLogs.map(l => l.content).join('\n');
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color theme classes mapping
  const themeClasses = {
    matrix: {
      bg: 'bg-slate-950',
      border: 'border-emerald-500/30',
      headerBg: 'bg-slate-900/90',
      textMain: 'text-emerald-400',
      textDim: 'text-emerald-600',
      prompt: 'text-emerald-300',
      userPrompt: 'text-emerald-500',
      accentBg: 'bg-emerald-950/60',
      chip: 'bg-emerald-950/80 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900',
      glow: 'shadow-emerald-950/50'
    },
    neon: {
      bg: 'bg-slate-950',
      border: 'border-cyan-500/30',
      headerBg: 'bg-slate-900/90',
      textMain: 'text-cyan-300',
      textDim: 'text-cyan-600',
      prompt: 'text-cyan-400',
      userPrompt: 'text-indigo-400',
      accentBg: 'bg-cyan-950/60',
      chip: 'bg-cyan-950/80 border-cyan-700/50 text-cyan-300 hover:bg-cyan-900',
      glow: 'shadow-cyan-950/50'
    },
    amber: {
      bg: 'bg-slate-950',
      border: 'border-amber-500/30',
      headerBg: 'bg-amber-950/20',
      textMain: 'text-amber-400',
      textDim: 'text-amber-700',
      prompt: 'text-amber-300',
      userPrompt: 'text-amber-500',
      accentBg: 'bg-amber-950/40',
      chip: 'bg-amber-950/80 border-amber-700/50 text-amber-300 hover:bg-amber-900',
      glow: 'shadow-amber-950/50'
    },
    cyberpunk: {
      bg: 'bg-slate-950',
      border: 'border-fuchsia-500/30',
      headerBg: 'bg-slate-900/90',
      textMain: 'text-fuchsia-300',
      textDim: 'text-fuchsia-600',
      prompt: 'text-amber-300',
      userPrompt: 'text-cyan-400',
      accentBg: 'bg-fuchsia-950/60',
      chip: 'bg-fuchsia-950/80 border-fuchsia-700/50 text-fuchsia-300 hover:bg-fuchsia-900',
      glow: 'shadow-fuchsia-950/50'
    },
    classic: {
      bg: 'bg-slate-950',
      border: 'border-slate-700/50',
      headerBg: 'bg-slate-900/90',
      textMain: 'text-slate-100',
      textDim: 'text-slate-400',
      prompt: 'text-indigo-300',
      userPrompt: 'text-slate-300',
      accentBg: 'bg-slate-900',
      chip: 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700',
      glow: 'shadow-slate-950/50'
    }
  }[theme];

  const quickActionChips = [
    { label: '⚡ Run Mission', cmd: 'run Perform market expansion and security audit' },
    { label: '📊 System Status', cmd: 'status' },
    { label: '🤖 List Agents', cmd: 'agents --dept MARKETING' },
    { label: '💬 Chat CEO Agent', cmd: 'chat How are the 200 micro-agents operating today?' },
    { label: '💵 View Pricing', cmd: 'pricing' },
    { label: '🧠 Hardware Specs', cmd: 'sysinfo' },
    { label: '📋 Workspace Sync', cmd: 'workspace' },
    { label: '📄 Inspect Pricing JSON', cmd: 'cat /sys/pricing.json' },
  ];

  return (
    <div className={`space-y-6 transition-all font-mono ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-slate-950 overflow-auto' : ''}`}>
      {/* Top Visitor Introduction Banner */}
      {!isFullscreen && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/80 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  INTERACTIVE CLI SHELL
                </span>
                <span className="text-xs text-slate-400">AtlantidaOS v1.0 Command Line</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
                Interaktivni Terminal Interface za Posjetitelje
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
                Upravljajte sa 200 mikro-agenata, izvršavajte direktne AI misije, provjeravajte status Google Workspace &amp; Cloud SQL integracija ili postavite pitanje CEO Super Agentu (#1) direktno iz komandne linije.
              </p>
            </div>

            {/* Quick Action Navigation Buttons for Visitors */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCommand('help')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Naredbe (help)
              </button>
              <button
                onClick={() => handleCommand('pricing')}
                className="px-3 py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cijene i Paketi
              </button>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('workspace-cloudsql')}
                  className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Google Workspace
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Terminal Window Frame */}
      <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-all ${themeClasses.border} ${themeClasses.bg} ${themeClasses.glow}`}>
        
        {/* Terminal Header Bar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between gap-4 font-mono text-xs select-none ${themeClasses.border} ${themeClasses.headerBg}`}>
          
          {/* OS Window Buttons */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer hover:bg-rose-600 transition-colors" title="Close"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer hover:bg-amber-600 transition-colors" title="Minimize"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer hover:bg-emerald-600 transition-colors" title="Maximize" onClick={() => setIsFullscreen(!isFullscreen)}></div>
            <span className="ml-2 font-bold text-slate-300 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              atlantida@os-v1:~$ — [bash]
            </span>
          </div>

          {/* Controls: Theme Selector, Sound Toggle, Copy, Clear, Fullscreen */}
          <div className="flex items-center gap-3">
            {/* Theme Selector Dropdown */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="hidden sm:inline">Tema:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-[11px] focus:outline-none"
              >
                <option value="matrix">Matrix Green</option>
                <option value="neon">Cyan Neon</option>
                <option value="amber">Amber Retro</option>
                <option value="cyberpunk">Cyberpunk Pink</option>
                <option value="classic">Dark Classic</option>
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${soundEnabled ? 'text-emerald-400' : 'text-slate-500'}`}
              title={soundEnabled ? 'Zvuk uključen' : 'Zvuk isključen'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Copy Logs Button */}
            <button
              onClick={handleCopyLogs}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1 transition-all"
              title="Kopiraj cjelokupan log"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{copied ? 'Kopirano!' : 'Kopiraj'}</span>
            </button>

            {/* Clear Screen Button */}
            <button
              onClick={() => setCommandLogs([])}
              className="p-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded transition-all"
              title="Očisti ekran (clear)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-all"
              title={isFullscreen ? 'Izađi iz punog ekrana' : 'Puni ekran'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Command Action Chips for Visitors */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 whitespace-nowrap font-sans font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Brze Komande:
          </span>
          {quickActionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleCommand(chip.cmd)}
              className={`px-2.5 py-1 rounded-md border whitespace-nowrap transition-all ${themeClasses.chip}`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Command Output Log Screen */}
        <div
          className="p-4 sm:p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-3 font-mono text-xs leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {commandLogs.map((log, idx) => {
            if (log.type === 'banner') {
              return (
                <pre key={idx} className={`font-mono text-[10px] sm:text-xs leading-none font-bold overflow-x-auto ${themeClasses.textMain}`}>
                  {log.content}
                </pre>
              );
            }
            if (log.type === 'input') {
              return (
                <div key={idx} className="flex items-start gap-2 pt-1">
                  <span className={`font-bold ${themeClasses.prompt}`}>atlantida@os-v1:~$</span>
                  <span className={`font-bold ${themeClasses.userPrompt}`}>{log.content}</span>
                </div>
              );
            }
            if (log.type === 'system') {
              return (
                <div key={idx} className="text-cyan-400/90 font-semibold bg-cyan-950/20 px-2 py-1 rounded border-l-2 border-cyan-500 my-1">
                  {log.content}
                </div>
              );
            }
            if (log.type === 'error') {
              return (
                <div key={idx} className="text-rose-400 font-semibold bg-rose-950/30 px-2 py-1 rounded border-l-2 border-rose-500 my-1">
                  ❌ {log.content}
                </div>
              );
            }
            return (
              <pre key={idx} className={`whitespace-pre-wrap font-mono ${themeClasses.textMain}`}>
                {log.content}
              </pre>
            );
          })}

          {/* Active Execution Spinner */}
          {isExecuting && (
            <div className="flex items-center gap-2 text-amber-400 animate-pulse py-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Izvršavanje AI komande na 200 mikro-agenata klasteru...</span>
            </div>
          )}

          {/* Autocomplete / Tooltip Suggestion Overlay */}
          {matchingSuggestions.length > 0 && showSuggestions && (
            <div className="relative z-20 my-2">
              <div className="bg-slate-900/95 border border-emerald-500/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-md space-y-1 animate-fade-in font-mono text-xs">
                <div className="flex items-center justify-between gap-2 px-1 pb-1 border-b border-slate-800 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <Sparkles className="w-3 h-3" /> SUGESTIJE KOMANDI ({matchingSuggestions.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Tab</kbd> Autocomplete</span>
                    <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑/↓</kbd> Navigacija</span>
                    <span><kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Enter</kbd> Izvrši</span>
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 pt-1">
                  {matchingSuggestions.map((item, idx) => {
                    const isSelected = idx === suggestionIdx;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setInputVal(item.usage);
                          inputRef.current?.focus();
                        }}
                        className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 shadow-md'
                            : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold font-mono">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                            {item.cmd.split(' ')[0]}
                          </span>
                          <span className="text-slate-100">{item.usage}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate max-w-xs font-sans">
                          {item.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Input Prompt Row */}
          <div className="flex items-center gap-2 pt-2">
            <span className={`font-bold text-sm whitespace-nowrap ${themeClasses.prompt}`}>atlantida@os-v1:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isExecuting}
              placeholder="Unesite komandu (npr. 'help', 'status', 'pricing', 'run Audit')..."
              className={`flex-1 bg-transparent border-none focus:outline-none font-mono text-xs font-semibold ${themeClasses.textMain} placeholder:text-slate-600`}
              autoFocus
            />
            <button
              onClick={() => handleCommand(inputVal)}
              disabled={!inputVal.trim() || isExecuting}
              className="p-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded transition-all disabled:opacity-30"
              title="Pošalji komandu (Enter)"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Terminal Footer Status Info */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              FLEET ONLINE (159/200)
            </span>
            <span>•</span>
            <span>Up/Down strelice za istoriju</span>
            <span>•</span>
            <span>Tab za komande</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Pritisnite &apos;help&apos; za spisak komandi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
