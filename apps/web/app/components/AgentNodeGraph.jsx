'use client';

import React, { useState } from 'react';
import { Cpu, Shield, Zap, Sparkles, Network, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

export default function AgentNodeGraph({ departments, agents, onSelectAgent, isExecuting }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Define department positions in SVG coordinate system (relative 600x400 viewbox)
  const ceoNode = { id: 1, name: 'CEO Super Agent (#1)', x: 300, y: 190 };

  const deptNodes = [
    { key: 'EXECUTIVE', name: 'Executive', x: 300, y: 50, color: '#ec4899', count: 10 },
    { key: 'ENGINEERING', name: 'Engineering', x: 480, y: 80, color: '#3b82f6', count: 35 },
    { key: 'SECURITY', name: 'Cybersecurity', x: 530, y: 190, color: '#ef4444', count: 20 },
    { key: 'MARKETING', name: 'Marketing', x: 480, y: 300, color: '#f59e0b', count: 25 },
    { key: 'REVENUE', name: 'Revenue', x: 300, y: 330, color: '#10b981', count: 20 },
    { key: 'PRODUCT', name: 'Product UI', x: 120, y: 300, color: '#8b5cf6', count: 20 },
    { key: 'INFRASTRUCTURE', name: 'Cloud Ops', x: 70, y: 190, color: '#06b6d4', count: 25 },
    { key: 'SUPPORT', name: 'Customer SLA', x: 120, y: 80, color: '#14b8a6', count: 20 },
    { key: 'DATA_SCIENCE', name: 'Data & ML', x: 200, y: 50, color: '#6366f1', count: 15 },
    { key: 'LEGAL', name: 'Legal Guard', x: 400, y: 50, color: '#64748b', count: 10 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Network className="w-4 h-4 text-cyan-400" />
            Interactive Agent Task Delegation Node Graph
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time topology map showing CEO Agent #1 delegating tasks to 10 autonomous department clusters.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
            {isExecuting ? 'Delegation In-Progress...' : 'Fleet Topology Active'}
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden">
        <svg viewBox="0 0 600 380" className="w-full h-auto max-h-[380px] select-none">
          <defs>
            <linearGradient id="ceoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid Lines */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 2" />
          </pattern>
          <rect width="600" height="380" fill="url(#grid)" opacity="0.4" />

          {/* Connecting Delegation Lines */}
          {deptNodes.map((node) => {
            const isSelected = selectedNode?.key === node.key;
            return (
              <g key={node.key}>
                <line
                  x1={ceoNode.x}
                  y1={ceoNode.y}
                  x2={node.x}
                  y2={node.y}
                  stroke={isSelected ? '#38bdf8' : node.color}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray={isExecuting ? '6 4' : 'none'}
                  className={isExecuting ? 'animate-pulse' : 'opacity-60 hover:opacity-100'}
                />
                {isExecuting && (
                  <circle r="3" fill="#38bdf8">
                    <animateMotion
                      path={`M ${ceoNode.x} ${ceoNode.y} L ${node.x} ${node.y}`}
                      dur={`${1.5 + Math.random() * 1.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Department Peripheral Nodes */}
          {deptNodes.map((node) => {
            const isSelected = selectedNode?.key === node.key;
            return (
              <g
                key={node.key}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => setSelectedNode(node)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill="#0f172a"
                  stroke={isSelected ? '#38bdf8' : node.color}
                  strokeWidth={isSelected ? '3' : '1.5'}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill={node.color}
                />
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.name} ({node.count})
                </text>
              </g>
            );
          })}

          {/* Central CEO Agent Node */}
          <g
            className="cursor-pointer"
            onClick={() => {
              const ceo = agents.find(a => a.id === 1);
              if (ceo && onSelectAgent) onSelectAgent(ceo);
            }}
          >
            <circle cx={ceoNode.x} cy={ceoNode.y} r="48" fill="url(#pulseGlow)" className="animate-pulse" />
            <circle cx={ceoNode.x} cy={ceoNode.y} r="32" fill="url(#ceoGrad)" stroke="#38bdf8" strokeWidth="2" />
            <text
              x={ceoNode.x}
              y={ceoNode.y - 2}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="900"
            >
              CEO #1
            </text>
            <text
              x={ceoNode.x}
              y={ceoNode.y + 12}
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="8"
              fontFamily="monospace"
            >
              Supreme Hub
            </text>
          </g>
        </svg>

        {/* Selected Node Details Box Overlay */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-700 p-3 rounded-xl backdrop-blur flex items-center justify-between font-mono text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
              <div>
                <span className="font-bold text-slate-100">{selectedNode.name} Cluster</span>
                <span className="text-slate-400 text-[11px] block">
                  {selectedNode.count} Active Micro-Agents • SLA Target: 99.99%
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const deptAgent = agents.find(a => a.departmentKey === selectedNode.key || a.department === selectedNode.name);
                if (deptAgent && onSelectAgent) onSelectAgent(deptAgent);
              }}
              className="px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded hover:bg-cyan-900 font-mono text-[11px] flex items-center gap-1"
            >
              Inspect Cluster Agent <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
