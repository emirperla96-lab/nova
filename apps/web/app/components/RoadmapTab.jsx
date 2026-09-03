import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Clock, Play, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export default function RoadmapTab({ roadmapData }) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(4); // Default Phase 5 (Fleet 200)

  // Use roadmapData or fallback structured phases
  const phases = roadmapData?.launch_roadmap?.phases || [
    {
      phase: 1,
      name: "Foundation & Core Architecture",
      status: "completed",
      progress: 100,
      timeline: "Month 1",
      objective: "Establish system baseline, setup Master Agent controller, and implement core JSON architecture schemas.",
      milestones: [
        "Master JSON architecture finalized",
        "Executive Office (Agents 1-10) configured",
        "Initial memory layout & file tree set up",
        "Basic orchestration runtime deployed"
      ]
    },
    {
      phase: 2,
      name: "Department Setup & Neural Memory",
      status: "completed",
      progress: 100,
      timeline: "Month 2",
      objective: "Deploy 10 functional department command structures and integrate multi-layered neural memory indexing.",
      milestones: [
        "10 Department Chief agents linked",
        "Episodic & Semantic memory layers active",
        "Vector indexing engine integrated",
        "Inter-agent messaging protocol verified"
      ]
    },
    {
      phase: 3,
      name: "Initial Agent Deployment & Workflows",
      status: "completed",
      progress: 100,
      timeline: "Month 3",
      objective: "Deploy Agents 1 to 40 and validate autonomous cross-department task execution.",
      milestones: [
        "40 core micro-agents activated",
        "Cross-department SLA rules enforced",
        "Emergency escalation triggers tested",
        "Daily standup standbys operational"
      ]
    },
    {
      phase: 4,
      name: "Scale to 100 Micro-Agents",
      status: "completed",
      progress: 100,
      timeline: "Month 4-5",
      objective: "Expand fleet to 100 agents, enabling full marketing, sales, & technical compliance automation.",
      milestones: [
        "Agents 41 to 100 deployed",
        "Monetization & yield engines online",
        "Customer success queue automated",
        "QA & self-correction loops enabled"
      ]
    },
    {
      phase: 5,
      name: "Full 200 Micro-Agents Global Fleet Ops",
      status: "in_progress",
      progress: 85,
      timeline: "Month 6 (Current)",
      objective: "Complete deployment of all 200 Supreme Micro-Agents, achieving full autonomous operational coverage.",
      milestones: [
        "Agents 101 to 200 initialized",
        "Autonomous multi-region dispatch enabled",
        "Real-time SLA telemetry dashboard active",
        "Self-learning weight feedback loop tuning"
      ]
    },
    {
      phase: 6,
      name: "Self-Learning Ecosystem & Continuous Optimization",
      status: "upcoming",
      progress: 25,
      timeline: "Month 7-8",
      objective: "Enable deep neural memory self-distillation and automated prompt/weight optimization across all 200 agents.",
      milestones: [
        "Zero-latency memory cache enabled",
        "Self-healing fault recovery protocol",
        "Autonomous A/B experiment engine",
        "Real-time market sentiment adaptation"
      ]
    },
    {
      phase: 7,
      name: "Autonomous Org & Singularity Orchestration",
      status: "upcoming",
      progress: 0,
      timeline: "Month 9+",
      objective: "Reach full autonomous operational singularity with multi-enterprise expansion capabilities.",
      milestones: [
        "100% autonomous business operation",
        "Self-funding treasury & resource allocation",
        "Cross-organizational AI federation",
        "Continuous zero-human-intervention runtime"
      ]
    }
  ];

  const currentPhase = phases[activePhaseIndex] || phases[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/60 rounded-md uppercase">
            Strategic Launch Directive
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            AtlantidaOS v1.0 — 7-Phase Launch Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Track the autonomous deployment lifecycle from core foundation to global 200-agent fleet orchestration and singularity.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right font-mono min-w-[200px]">
          <p className="text-[11px] text-slate-500 uppercase">Overall Progress</p>
          <div className="text-3xl font-extrabold text-amber-400 mt-0.5">71.4%</div>
          <p className="text-[10px] text-slate-400 mt-1">Phase 5 of 7 Active</p>
        </div>
      </div>

      {/* Horizontal Phase Timeline Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {phases.map((p, index) => {
          const isSelected = index === activePhaseIndex;
          const isDone = p.status === 'completed' || p.progress === 100;
          const isInProgress = p.status === 'in_progress' || (p.progress > 0 && p.progress < 100);

          return (
            <button
              key={p.phase}
              onClick={() => setActivePhaseIndex(index)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-amber-500/60 shadow-lg text-slate-100 ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="font-bold">PHASE {p.phase}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isInProgress ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                {p.name}
              </h4>

              <div className="mt-2 w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${isDone ? 'bg-emerald-400' : isInProgress ? 'bg-amber-400' : 'bg-slate-700'}`} 
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detailed Inspector */}
      {currentPhase && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded border border-amber-800/60">
                  PHASE #{currentPhase.phase}
                </span>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded font-semibold capitalize ${
                  currentPhase.status === 'completed' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : currentPhase.status === 'in_progress'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {currentPhase.status.replace('_', ' ')} ({currentPhase.progress}%)
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-100 mt-2">
                {currentPhase.name}
              </h3>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-500">Timeline Target:</span>
              <p className="text-sm font-bold text-cyan-400">{currentPhase.timeline}</p>
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-400">Core Objective</h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {currentPhase.objective}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Phase Key Milestones & Deliverables
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPhase.milestones?.map((m, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-sans leading-snug">
                    {m}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
