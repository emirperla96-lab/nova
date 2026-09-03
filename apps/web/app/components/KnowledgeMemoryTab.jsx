'use client';

import React, { useState } from 'react';
import { Database, Search, FileText, Sparkles, BookOpen, Layers, Cpu, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function KnowledgeMemoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const knowledgeItems = [
    { id: 'KB-001', title: 'SaaS Subscriptions & Stripe Multi-Gateway Integration SOP', category: 'ARCHITECTURE', date: '2026-07-28', tags: ['Stripe', 'PayPal', 'Billing', 'Taxes'] },
    { id: 'KB-002', title: 'Autonomous 5-Agent Executive Team Workflow & Prompt Templates', category: 'PROMPTS', date: '2026-07-27', tags: ['Gemini 3.6', 'Pipeline', 'SOP'] },
    { id: 'KB-003', title: 'Zero-Trust RBAC Security Matrix & Permanent Super Admin Spec', category: 'SECURITY', date: '2026-07-26', tags: ['RBAC', 'Super Admin', '2FA'] },
    { id: 'KB-004', title: '200 Micro-Agents Inter-Subroutine Communication Standard', category: 'ORCHESTRATION', date: '2026-07-25', tags: ['Agents', 'Vector', 'Telemetry'] },
    { id: 'KB-005', title: 'High-Converting SaaS Landing Page Copywriting & SEO Guide', category: 'MARKETING', date: '2026-07-24', tags: ['SEO', 'Copywriting', 'CRO'] },
  ];

  const persistentMemories = [
    { project: 'ACOS Autonomous SaaS', mrr: '$42,850', status: 'Active', learning: 'Gemini 3.6 Flash streaming reduces agent latency by 64%.' },
    { project: 'Microservice Security Sentinel', mrr: '$18,400', status: 'Active', learning: 'Zero-trust rate limiting prevents API key quota exhaustion.' },
    { project: 'AI Video Summarizer Engine', mrr: '$12,900', status: 'Scaling', learning: 'Free trials with automated Stripe conversion increase MRR by +28%.' },
  ];

  const filteredKb = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Top Banner Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Internal Knowledge Base & Persistent Memory Registry
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2 font-mono">
              <Database className="w-5 h-5 text-indigo-400" />
              ACOS Project Knowledge Base & Neural Memory Loop
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-lg">
            Continuous Self-Learning Active
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Maintains persistent memories of all completed projects, architectural SOPs, revenue benchmarks, prompts, and continuous profit optimization rules inside the database.
        </p>
      </div>

      {/* Persistent Project Memory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Persistent Database Memory & Profit Optimization Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {persistentMemories.map((mem, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">{mem.project}</span>
                <span className="text-emerald-400 font-bold">{mem.mrr} MRR</span>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                <strong>Accumulated Learning:</strong> {mem.learning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Base Repository */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Knowledge Base Documents & Templates
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SOPs, templates..."
                className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* List of Knowledge Docs */}
        <div className="space-y-3">
          {filteredKb.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-bold">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-100">{item.title}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <span className="text-slate-500 text-[11px]">{item.date}</span>
                <button
                  onClick={() => alert(`Opened Knowledge Base document ${item.id}`)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold transition-colors"
                >
                  View Document
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
