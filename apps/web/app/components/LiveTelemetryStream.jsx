'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Radio, Play, Pause, ChevronRight, Zap, Shield, Cpu, Terminal } from 'lucide-react';

export default function LiveTelemetryStream({ agents, onSelectAgent }) {
  const [isLive, setIsLive] = useState(true);
  const [streamEvents, setStreamEvents] = useState([]);

  useEffect(() => {
    // Generate initial stream events
    const initialEvents = [
      { id: 1, agentId: 1, action: 'Synchronized memory vector index across 10 department nodes', time: '17:54:10', type: 'system' },
      { id: 2, agentId: 42, action: 'Intercepted anomalous API rate spikes; enforced zero-trust policy', time: '17:54:12', type: 'security' },
      { id: 3, agentId: 105, action: 'Re-allocated ad spend budget towards high-converting audience segment (+14.2% ROI)', time: '17:54:15', type: 'marketing' },
      { id: 4, agentId: 18, action: 'Automated database index re-balancing on shard #4', time: '17:54:18', type: 'engineering' },
      { id: 5, agentId: 88, action: 'Computed real-time yield optimization weights for Q3 SaaS plans', time: '17:54:21', type: 'revenue' },
    ];
    setStreamEvents(initialEvents);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const sampleActions = [
      { text: 'Optimized vector search latency down to 2.4ms in cluster #7', type: 'engineering' },
      { text: 'Ran automated threat scanning on public API endpoints', type: 'security' },
      { text: 'Resolved user onboarding ticket #4089 automatically', type: 'support' },
      { text: 'Published updated API documentation to developer portal', type: 'product' },
      { text: 'Calculated 30-day churn probability matrix across enterprise accounts', type: 'revenue' },
      { text: 'Deployed hotfix patch for container cluster #09', type: 'engineering' },
      { text: 'Audited compliance rules against GDPR/CCPA data policy', type: 'legal' },
      { text: 'Simulated 5,000 parallel user queries for stress analysis', type: 'system' },
    ];

    const interval = setInterval(() => {
      if (!agents || agents.length === 0) return;
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomAction = sampleActions[Math.floor(Math.random() * sampleActions.length)];

      const newEvent = {
        id: Date.now(),
        agentId: randomAgent.id,
        agentName: randomAgent.name,
        department: randomAgent.department,
        action: randomAction.text,
        type: randomAction.type,
        time: new Date().toLocaleTimeString(),
      };

      setStreamEvents((prev) => [newEvent, ...prev.slice(0, 14)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLive, agents]);

  return (
    <div className="bg-slate-900 border-t border-b border-slate-800 py-2.5 px-4 font-mono text-xs shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Stream Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
            <span className="font-bold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Live Telemetry Activity Feed
            </span>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 transition-colors ${
              isLive
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isLive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            {isLive ? 'STREAMING' : 'PAUSED'}
          </button>
        </div>

        {/* Rolling Latest Event Ticker */}
        {streamEvents.length > 0 && (
          <div className="flex-1 w-full overflow-hidden flex items-center gap-3 bg-slate-950/70 border border-slate-800/80 px-3 py-1 rounded-lg">
            <span className="text-cyan-400 font-bold shrink-0 text-[11px] flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {streamEvents[0].time}
            </span>

            <button
              onClick={() => {
                const found = agents.find(a => a.id === streamEvents[0].agentId);
                if (found && onSelectAgent) onSelectAgent(found);
              }}
              className="text-indigo-400 font-bold hover:underline shrink-0 text-[11px]"
            >
              #{streamEvents[0].agentId} {streamEvents[0].agentName || `Agent #${streamEvents[0].agentId}`}
            </button>

            <span className="text-slate-500 shrink-0">•</span>

            <p className="text-slate-300 text-[11px] font-sans truncate flex-1">
              {streamEvents[0].action}
            </p>

            <span className="text-[10px] text-slate-500 uppercase bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded shrink-0">
              {streamEvents[0].department || streamEvents[0].type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
