import React, { useState } from 'react';
import { Zap, AlertTriangle, ShieldCheck, CheckCircle2, Siren, ArrowRight, Activity, Clock } from 'lucide-react';

export default function PlaybookTab({ playbookData }) {
  const [activeAlert, setActiveAlert] = useState(null);

  const protocols = [
    {
      level: 'Level 1',
      title: 'Standard Operational Variance',
      trigger: 'Agent response latency > 100ms or memory cache hit < 95%',
      action: 'Automated agent restarts, cache flush, local load re-balancing.',
      escalateTo: 'Department Chief Agent',
      sla: 'Self-healed in < 2 seconds'
    },
    {
      level: 'Level 2',
      title: 'Cross-Department Conflict / Resource Stalling',
      trigger: 'Two agents request conflicting lock resources or priority stall',
      action: 'COO Agent (#2) intervenes, re-assigns priority weightings.',
      escalateTo: 'COO Agent (#2)',
      sla: 'Resolved in < 5 seconds'
    },
    {
      level: 'Level 3',
      title: 'Critical System Anomaly / SLA Threat',
      trigger: 'Unresolvable exception, API outage, or yield drop > 10%',
      action: 'CEO Super Agent (#1) triggers emergency protocol and shifts traffic.',
      escalateTo: 'CEO Super Agent (#1)',
      sla: 'Resolved in < 15 seconds'
    },
    {
      level: 'Level 4',
      title: 'Irreversible Human Governance Escalation',
      trigger: 'Public launch approval, major financial spend, legal commitments',
      action: 'Freeze action, generate executive summary report, notify project owner.',
      escalateTo: 'Human Project Owner',
      sla: 'Awaits Owner Confirmation'
    }
  ];

  const handleSimulateAlert = (title) => {
    setActiveAlert({
      title,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Executing Automated Mitigation...',
      steps: [
        'Detected anomaly threshold trigger',
        'Notified COO Agent (#2) and Department Chief',
        'Redirected sub-routine requests to standby micro-agents',
        'Applied self-healing patch & verified system integrity',
        'Incident cleared with zero downtime'
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800/60 rounded-md uppercase">
            Emergency Governance & Protocols
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-rose-400" />
            AtlantidaOS v1.0 Operational Playbook & SLA Rules
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Strict operational rules, SLA thresholds, conflict resolution pathways, and emergency escalation trees governing all 200 agents.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleSimulateAlert('Latency Spike Anomaly')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Test Latency Drill
          </button>
          <button 
            onClick={() => handleSimulateAlert('API Security Probe Intercept')}
            className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-lg border border-rose-800 transition-all flex items-center gap-1.5"
          >
            <Siren className="w-3.5 h-3.5 text-rose-400" />
            Test Security Drill
          </button>
        </div>
      </div>

      {/* Simulated Drill Output Banner */}
      {activeAlert && (
        <div className="bg-rose-950/40 border border-rose-800 p-5 rounded-xl shadow-lg space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-rose-800/60 pb-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <Siren className="w-4 h-4 animate-pulse text-rose-400" />
              <span>SIMULATED INCIDENT DRILL: {activeAlert.title}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{activeAlert.timestamp}</span>
          </div>

          <p className="text-xs text-emerald-400 font-mono font-bold">
            STATUS: {activeAlert.status}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs font-mono">
            {activeAlert.steps.map((step, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 p-2 rounded text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] leading-tight">{step}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setActiveAlert(null)}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline"
          >
            Dismiss Drill Output
          </button>
        </div>
      )}

      {/* Protocols & Escalation Levels Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Escalation Hierarchy & Resolution SLA Protocols
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((p, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 rounded">
                  {p.level}
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  SLA: {p.sla}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-100">
                {p.title}
              </h4>

              <div className="space-y-1 text-xs">
                <p className="text-slate-400">
                  <strong className="text-slate-300 font-mono">Trigger Condition:</strong> {p.trigger}
                </p>
                <p className="text-slate-400 mt-1">
                  <strong className="text-slate-300 font-mono">Action Protocol:</strong> {p.action}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Escalates To:</span>
                <span className="text-purple-300 font-bold">{p.escalateTo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
