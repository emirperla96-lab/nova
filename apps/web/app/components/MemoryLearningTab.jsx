import React, { useState } from 'react';
import { Database, Cpu, RefreshCw, Zap, ShieldAlert, GitBranch, Layers, Activity } from 'lucide-react';

export default function MemoryLearningTab({ memoryData, learningData }) {
  const [selectedMemoryLayer, setSelectedMemoryLayer] = useState('episodic');

  const memoryLayers = [
    {
      id: 'episodic',
      name: 'Episodic Memory Layer',
      size: '1.4 TB',
      recall: '12ms',
      description: 'Stores sequential agent task execution history, historical agent logs, and step-by-step resolution traces.',
      nodesCount: '480,210 Entries',
      status: 'Active Indexing'
    },
    {
      id: 'semantic',
      name: 'Semantic Knowledge Base',
      size: '850 GB',
      recall: '8ms',
      description: 'Domain knowledge graphs, enterprise rules, product taxonomies, and strategic business directives.',
      nodesCount: '1,240,000 Embeddings',
      status: 'Synchronized'
    },
    {
      id: 'working',
      name: 'Working Memory (Short-Term)',
      size: '128 GB (RAM)',
      recall: '1.2ms',
      description: 'In-memory multi-agent scratchpad for active sub-routines, current mission contexts, and intermediate variables.',
      nodesCount: '200 Active Slots',
      status: 'Real-Time Sync'
    },
    {
      id: 'vector',
      name: 'Vector Indexing Cluster',
      size: '2.1 TB',
      recall: '15ms',
      description: 'HNSW vector store powering semantic nearest-neighbor retrieval across all 200 micro-agents.',
      nodesCount: '15,000,000 Vectors',
      status: 'Optimal'
    }
  ];

  const selfLearningMetrics = [
    { label: 'Auto-Correction Efficiency', value: '99.82%', change: '+0.4%' },
    { label: 'Neural Weight Distillation', value: 'Cycle #4,821', change: 'Active' },
    { label: 'Self-Healing Error Rate', value: '0.001%', change: '-0.005%' },
    { label: 'Knowledge Transfer Latency', value: '4.2ms', change: 'Ultra-Fast' }
  ];

  const recentSelfTuningLogs = [
    { id: 1, time: '17:34:12', agent: 'Agent #87 (Self-Correction QA)', note: 'Auto-adjusted weight bias on yield calculation script', delta: 'Accuracy +0.12%' },
    { id: 2, time: '17:30:45', agent: 'Agent #14 (Neural Memory Chief)', note: 'Pruned redundant episodic traces in cache cluster #3', delta: 'Memory Freed: 14GB' },
    { id: 3, time: '17:25:01', agent: 'Agent #142 (Model Optimizer)', note: 'Re-distilled domain prompts for Customer Success team', delta: 'Latency -3.1ms' },
    { id: 4, time: '17:18:22', agent: 'Agent #2 (COO Agent)', note: 'Re-balanced operational workload across Technical Core', delta: 'Throughput +8%' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/60 rounded-md uppercase">
            Neural Infrastructure
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            Neural Memory & Autonomous Self-Learning Loop
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            AtlantidaOS v1.0 continuously refines its collective intelligence via multi-tier memory layers and an autonomous neural weight update cycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Trigger Learning Loop
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selfLearningMetrics.map((m, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{m.label}</span>
            <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{m.value}</div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono mt-1 block">{m.change}</span>
          </div>
        ))}
      </div>

      {/* Memory Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Memory Layer Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Memory Layers ({memoryLayers.length})
          </h3>

          <div className="space-y-3">
            {memoryLayers.map((layer) => {
              const isSelected = selectedMemoryLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedMemoryLayer(layer.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-purple-500/60 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100">
                      {layer.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                      {layer.size}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {layer.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Recall: <strong className="text-emerald-400">{layer.recall}</strong></span>
                    <span>{layer.nodesCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 cols: Self-Learning Log & Neural Matrix Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                Autonomous Self-Tuning Activity Log
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Cycle #4,821 Running
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {recentSelfTuningLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>[{log.time}]</span>
                      <span className="text-indigo-400 font-bold">{log.agent}</span>
                    </div>
                    <p className="text-slate-200 font-sans text-xs mt-0.5">{log.note}</p>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50 whitespace-nowrap self-start md:self-auto">
                    {log.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
