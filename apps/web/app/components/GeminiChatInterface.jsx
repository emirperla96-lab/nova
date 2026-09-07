'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Download,
  Sliders,
  ChevronDown,
  ArrowDown,
  Cpu,
  Shield,
  Zap,
  Info,
  ExternalLink,
  MessageSquare,
  Flame,
  Terminal,
  Clock,
  Settings2
} from 'lucide-react';

const PERSONAS = [
  {
    id: 'ceo-super-agent',
    name: 'Chief Executive Super Agent',
    badge: 'ACOS Leader',
    role: 'Autonomous Corporate Strategy & Orchestration',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    prompt: 'You are the Chief Executive Super Agent of AtlantidaOS. Provide authoritative, executive-level strategic decisions, business model breakdowns, and project milestones.'
  },
  {
    id: 'code-architect',
    name: 'Full-Stack Software Architect',
    badge: 'Engineering',
    role: 'System Design, Typescript & Cloud Infrastructure',
    icon: Terminal,
    color: 'from-cyan-400 to-blue-500',
    prompt: 'You are the Lead Systems Architect of AtlantidaOS. Deliver production-ready code snippets, database schemas, API designs, and architectural patterns with complete explanations.'
  },
  {
    id: 'research-intelligence',
    name: 'Research Intelligence AI',
    badge: 'Intelligence',
    role: 'Market Analysis, Data Discovery & Synthesis',
    icon: Cpu,
    color: 'from-emerald-400 to-teal-500',
    prompt: 'You are the Research Intelligence AI of AtlantidaOS. Perform deep technical and commercial research, competitor teardowns, and actionable data synthesis.'
  },
  {
    id: 'security-engineer',
    name: 'Cybersecurity & Guardrails AI',
    badge: 'Security',
    role: 'Zero-Trust Auditing & Protocol Hardening',
    icon: Shield,
    color: 'from-purple-400 to-indigo-500',
    prompt: 'You are the Chief Security Engineer of AtlantidaOS. Audit workflows, ensure zero-trust compliance, validate data isolation, and verify safety bounds.'
  }
];

const PROMPT_SUGGESTIONS = [
  {
    title: 'Analyze Multi-Agent Workflow',
    subtitle: 'Optimize DAG dependencies across 200 workers',
    prompt: 'Review the AtlantidaOS 6-stage autonomous workflow and propose 3 concrete optimizations for task dispatch latency and error recovery.'
  },
  {
    title: 'Design Cloud SQL Schema',
    subtitle: 'High-throughput analytics & mission logs',
    prompt: 'Create a production PostgreSQL schema for storing agent execution logs, token usage metrics, and multi-tenant user permissions.'
  },
  {
    title: 'Compare WebGPU vs Server AI',
    subtitle: 'Evaluate client-side latency vs API costs',
    prompt: 'Explain the trade-offs of in-browser WebGPU local model inference versus server-side Gemini 3.8 Flash execution for high-frequency operations.'
  },
  {
    title: 'Draft Executive Briefing',
    subtitle: 'Autonomous company performance summary',
    prompt: 'Generate an executive summary report for AtlantidaOS operations, detailing autonomous team performance, cost savings, and next quarter roadmap.'
  }
];

export default function GeminiChatInterface({ currentUser }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to AtlantidaOS Gemini AI Command Center\n\nI am connected to the **Gemini 3.8 Flash** engine through your server-side API bus. I can generate production code, analyze complex architectures, evaluate multi-agent workflows, and synthesize strategic intelligence.\n\n*Choose a specialized persona above or type any prompt below to begin.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.8-flash',
      persona: 'Chief Executive Super Agent'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [temperature, setTemperature] = useState(0.7);
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [apiError, setApiError] = useState(null);

  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Check backend Gemini status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetch('/api/gemini/status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setConnectionStatus(data.isKeyConfigured ? 'live' : 'standby');
          }
        } else {
          if (isMounted) setConnectionStatus('standby');
        }
      } catch (e) {
        if (isMounted) setConnectionStatus('standby');
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll to bottom when messages update if user was already at bottom
  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, isAtBottom]);

  // Monitor scroll position to show/hide "Scroll to Bottom" button
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 60;
    setIsAtBottom(atBottom);
  }, []);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setIsAtBottom(true);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Handle message sending
  const handleSendMessage = async (textToSend) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    setApiError(null);
    const userMsgId = `user-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage = {
      id: userMsgId,
      role: 'user',
      content: prompt,
      timestamp,
      userName: currentUser?.name || 'User'
    };

    const newMessagesHistory = [...messages, newUserMessage];
    setMessages(newMessagesHistory);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);
    setIsAtBottom(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: newMessagesHistory.map(m => ({ role: m.role, content: m.content })),
          persona: selectedPersona.name,
          temperature,
          systemInstruction: customSystemPrompt.trim() || selectedPersona.prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMsgId = `assistant-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: data.model || 'gemini-3.8-flash',
          persona: selectedPersona.name,
          isSimulated: data.isSimulated || false
        }
      ]);
    } catch (err) {
      console.error('[Chat Error]:', err);
      setApiError(err.message || 'Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      setMessages([
        {
          id: 'fresh-start',
          role: 'assistant',
          content: `### New Session Initialized\n\nI am ready for your next directive using **${selectedPersona.name}** mode. What would you like to build or analyze?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'gemini-3.8-flash',
          persona: selectedPersona.name
        }
      ]);
      setApiError(null);
    }
  };

  const handleExportChat = () => {
    const formatted = messages.map(m => `[${m.timestamp}] ${m.role === 'user' ? 'User' : m.persona || 'Gemini'}:\n${m.content}\n\n---\n`).join('\n');
    const blob = new Blob([formatted], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlantida-gemini-chat-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="gemini-chat-interface-root" className="flex flex-col h-full w-full bg-slate-950/70 rounded-2xl border border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden font-sans">
      {/* Top Controls & Persona Selector */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${connectionStatus === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 tracking-tight">Gemini 3.8 Flash Assistant</h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                Official GenAI SDK
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${connectionStatus === 'live' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' : 'bg-amber-950/60 text-amber-300 border-amber-700/50'}`}>
                {connectionStatus === 'live' ? 'Live Online' : 'Standby Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Persona: <span className="text-slate-200 font-medium">{selectedPersona.name}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="chat-settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors border ${showSettings ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40' : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'}`}
            title="Model & Prompt Settings"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden md:inline font-medium">Config</span>
          </button>

          <button
            id="chat-export-btn"
            onClick={handleExportChat}
            className="p-2 rounded-lg text-xs flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
            title="Export Conversation (.md)"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline font-medium">Export</span>
          </button>

          <button
            id="chat-clear-history-btn"
            onClick={handleClearHistory}
            className="p-2 rounded-lg text-xs flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
            title="Reset Chat History"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline font-medium">Clear</span>
          </button>
        </div>
      </div>

      {/* Expandable Model Configuration Drawer */}
      {showSettings && (
        <div className="border-b border-slate-800/80 bg-slate-900/90 px-4 py-3.5 animate-in slide-in-from-top-2 duration-150 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Persona Switcher */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Specialized Persona</label>
              <div className="space-y-1">
                {PERSONAS.map((persona) => {
                  const Icon = persona.icon;
                  const isSelected = selectedPersona.id === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona)}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-colors border ${isSelected ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200' : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800 text-slate-300'}`}
                    >
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-tr ${persona.color} flex items-center justify-center text-black flex-shrink-0`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs truncate">{persona.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{persona.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-400 font-medium">Creativity / Temperature</label>
                <span className="font-mono text-indigo-400 font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Deterministic (0.0)</span>
                <span>Balanced (0.7)</span>
                <span>Creative (1.5)</span>
              </div>

              <div className="mt-3 p-2 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-indigo-300">
                <span className="font-semibold">Engine:</span> Google Gemini 3.8 Flash via server-side proxy with User-Agent verification.
              </div>
            </div>

            {/* Custom System Instruction Override */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">System Instruction (Optional)</label>
              <textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                placeholder="Override default system instruction for custom behavior..."
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/70"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Message Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        id="gemini-message-scroll-container"
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCopied = copiedMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 pt-0.5">
                {isUser ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Message Content Card */}
              <div className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Header info */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-300">
                    {isUser ? msg.userName || 'You' : msg.persona || 'Gemini 3.8 Flash'}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {msg.timestamp}
                  </span>
                  {!isUser && msg.isSimulated && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                      Standby Mode
                    </span>
                  )}
                </div>

                {/* Message Body Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg relative border ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500/30 rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-200 border-slate-800/80 rounded-tl-none'
                  }`}
                >
                  {/* Formatted Markdown simulation */}
                  <div className="whitespace-pre-wrap break-words font-sans space-y-2">
                    {msg.content}
                  </div>

                  {/* Copy button on hover */}
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-slate-400 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy message"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-slate-900/90 border border-slate-800/80 text-slate-300 text-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400 font-mono">Gemini 3.8 Flash is generating...</span>
            </div>
          </div>
        )}

        {/* Error Notification Banner */}
        {apiError && (
          <div className="max-w-4xl mx-auto p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {!isAtBottom && (
        <div className="relative flex justify-center">
          <button
            onClick={scrollToBottom}
            className="absolute -top-12 z-20 px-3 py-1.5 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-medium shadow-xl flex items-center gap-1.5 transition-all animate-in fade-in"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Scroll to latest</span>
          </button>
        </div>
      )}

      {/* Prompt Suggestions Bar (Shown when history is short) */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 py-2 border-t border-slate-800/50 bg-slate-900/30 overflow-x-auto">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Prompts:
            </span>
            <div className="flex items-center gap-2 pb-1">
              {PROMPT_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 text-xs text-left whitespace-nowrap transition-all shadow-sm"
                >
                  <div className="font-medium text-xs">{sug.title}</div>
                  <div className="text-[10px] text-slate-500">{sug.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="border-t border-slate-800/80 bg-slate-900/70 p-3 sm:p-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-slate-950/90 border border-slate-800/90 rounded-2xl p-2 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all shadow-inner">
            {/* Auto-growing Textarea */}
            <textarea
              ref={textareaRef}
              id="gemini-chat-input-textarea"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${selectedPersona.name} (Enter to send, Shift+Enter for newline)...`}
              rows={1}
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm px-3 py-1.5 resize-none focus:outline-none max-h-44 leading-relaxed"
            />

            {/* Send Button */}
            <button
              id="gemini-chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Footer status helper */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Model: gemini-3.8-flash</span>
              <span className="text-slate-600">•</span>
              <span>Temp: {temperature.toFixed(1)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span>Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
