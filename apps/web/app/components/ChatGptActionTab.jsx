'use client';

import React, { useState } from 'react';
import { Bot, Copy, Check, ExternalLink, Code2, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function ChatGptActionTab() {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);

  const openApiUrl = 'https://ais-dev-dgzodvgs4p6cylsnh6mspz-224382426458.europe-west2.run.app/openapi.json';

  const gptInstructions = `You are the official AtlantidaOS AI Orchestrator assistant.
You connect ChatGPT directly to the AtlantidaOS micro-agent fleet, autonomous company CEO pipeline (ACOS), and operational departments.

When the user asks you to execute tasks:
1. To dispatch autonomous missions, invoke 'dispatchMission' with the directive and department code (DEV, MKT, OPS, SEC, ALL).
2. To chat directly with specialized agents (e.g. Architect, Security Engineer), use 'chatWithAgent'.
3. To trigger the 6-stage autonomous company deployment pipeline, invoke 'runAcosPipeline'.

Always present logs and agent telemetry in clean, structured Markdown tables or lists.`;

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-700/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">ChatGPT Custom GPT Action Integration</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-full">
                  OPENAPI 3.1.0 READY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Povežite AtlantidaOS direktno u ChatGPT kao Custom GPT sa live akcijama prema vašoj floti agenata.
              </p>
            </div>
          </div>

          <a
            href="https://chat.openai.com/gpts/editor"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <span>Otvori ChatGPT GPT Builder</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3-Step Setup Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 font-mono font-bold flex items-center justify-center text-xs">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-200">Kreirajte Novi GPT</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Otvorite <strong className="text-slate-300">ChatGPT &gt; Explore GPTs &gt; Create</strong> i pređite na karticu <em>Configure</em>.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-200">Dodajte OpenAPI Akciju</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kliknite <strong>Create new action</strong> i unesite URL našeg OpenAPI schema fajla ispod ili zalijepite JSON.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-200">Testirajte i Objavite</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ChatGPT će direktno pozivati <code className="text-emerald-300">/api/mission</code> i <code className="text-emerald-300">/api/agent-chat</code>!
          </p>
        </div>
      </div>

      {/* Schema & URL Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">OpenAPI Schema URL (Import from URL u GPT Action)</h3>
          </div>
          <button
            onClick={() => copyToClipboard(openApiUrl, setCopiedSchema)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSchema ? 'Kopirano!' : 'Kopiraj OpenAPI URL'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs text-emerald-400 break-all select-all">
          {openApiUrl}
        </div>
      </div>

      {/* Instructions Prompt for Custom GPT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200">Preporučene ChatGPT Instrukcije (System Prompt)</h3>
          </div>
          <button
            onClick={() => copyToClipboard(gptInstructions, setCopiedInstructions)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-all"
          >
            {copiedInstructions ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedInstructions ? 'Kopirano!' : 'Kopiraj Instrukcije'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 border border-slate-800 p-4 rounded-lg font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {gptInstructions}
        </pre>
      </div>
    </div>
  );
}
