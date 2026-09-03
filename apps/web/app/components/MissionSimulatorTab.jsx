import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, RefreshCw, Cpu, Sparkles, Send, Shield, Activity, Download, FileText, Share2, Layers, Network } from 'lucide-react';
import AgentNodeGraph from './AgentNodeGraph';

export default function MissionSimulatorTab({ agents, departments, onSelectAgent }) {
  const [missionPrompt, setMissionPrompt] = useState('Execute global market expansion audit and optimize yield funnel for Q3');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [completedReport, setCompletedReport] = useState(null);

  const presetMissions = [
    { label: '🛡️ Full Security Audit', dept: 'SECURITY', prompt: 'Run complete zero-trust security audit across all micro-agent endpoints & container clusters' },
    { label: '🚀 Global Launch Strategy', dept: 'MARKETING', prompt: 'Execute global market expansion audit and optimize yield funnel for Q3 product launch' },
    { label: '💰 Revenue Optimization', dept: 'REVENUE', prompt: 'Analyze enterprise pricing tiers, churn probability matrix, and dynamic discount rules' },
    { label: '⚙️ Fleet Health Check', dept: 'ENGINEERING', prompt: 'Run autonomous 200 micro-agent system health check, latency audit, and auto-scaling verification' },
    { label: '🧠 Vector Compression', dept: 'DATA_SCIENCE', prompt: 'Compress and re-index domain knowledge base into high-density vector memory clusters' }
  ];

  const handleExportMarkdown = () => {
    if (!completedReport) return;
    const content = `# ATLANTIDA OS - MISSION EXECUTION REPORT
**Timestamp**: ${new Date().toLocaleString()}
**Directive**: "${missionPrompt}"
**Department Scope**: ${selectedDept}
**Status**: ${completedReport.status}
**Execution Latency**: ${completedReport.executionTime}
**Agents Involved**: ${completedReport.agentsInvolved} Micro-Agents
**Tokens Processed**: ${completedReport.tokensProcessed.toLocaleString()}

---

## Executive Summary
${completedReport.summary}

---

## Detailed Agent Execution Timeline
${executionLogs.map((l, i) => `${i + 1}. [${l.time}] Micro-Agent #${l.agent.id} ${l.agent.name} (${l.agent.department})
   Action: ${l.action}
   Status: Completed`).join('\n\n')}

---
*Generated autonomously by AtlantidaOS CEO Super Agent (#1) powered by Gemini AI.*
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AtlasOS_Mission_Report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!completedReport) return;
    const data = {
      title: 'ATLAS OS MISSION REPORT',
      timestamp: new Date().toISOString(),
      directive: missionPrompt,
      departmentScope: selectedDept,
      report: completedReport,
      logs: executionLogs.map(l => ({
        id: l.id,
        time: l.time,
        agentId: l.agent.id,
        agentName: l.agent.name,
        department: l.agent.department,
        action: l.action
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AtlasOS_Mission_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunMission = async () => {
    if (!missionPrompt.trim() || isRunning) return;

    setIsRunning(true);
    setExecutionLogs([]);
    setCompletedReport(null);

    try {
      const res = await fetch('/api/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: missionPrompt, department: selectedDept }),
      });
      let resData = null;
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        resData = await res.json();
      }

      if (resData && resData.success && resData.data) {
        const { summary, executionTime, tokensProcessed, steps } = resData.data;

        if (Array.isArray(steps) && steps.length > 0) {
          steps.forEach((step, index) => {
            setTimeout(() => {
              const matchedAgent = agents.find(a => a.id === step.agentId) || agents[index % agents.length];
              setExecutionLogs((prev) => [
                ...prev,
                {
                  id: Date.now() + index,
                  time: new Date().toLocaleTimeString(),
                  agent: matchedAgent,
                  action: step.action,
                  status: 'completed'
                }
              ]);

              if (index === steps.length - 1) {
                setTimeout(() => {
                  setIsRunning(false);
                  setCompletedReport({
                    status: 'Mission Accomplished (AI Engine Powered)',
                    executionTime: executionTime || '380ms',
                    agentsInvolved: steps.length,
                    tokensProcessed: tokensProcessed || 14200,
                    summary: summary || `Directive successfully processed by Gemini AI engine.`
                  });
                }, 600);
              }
            }, (index + 1) * 600);
          });
          return;
        }
      }
    } catch (e) {
      console.log('Using local simulator fallback:', e);
    }

    // Local simulation fallback
    const relevantAgents = selectedDept === 'ALL'
      ? [
          agents.find(a => a.id === 1) || agents[0],
          agents.find(a => a.id === 2) || agents[1],
          agents[Math.floor(Math.random() * 50) + 10],
          agents[Math.floor(Math.random() * 50) + 60],
          agents[Math.floor(Math.random() * 50) + 120]
        ]
      : agents.filter(a => a.departmentKey === selectedDept || a.department === selectedDept).slice(0, 5);

    const steps = [
      { agent: relevantAgents[0] || agents[0], action: 'Parsed prompt directive and created sub-task graph' },
      { agent: relevantAgents[1] || agents[1], action: 'Assigned execution priorities and initialized working memory RAM' },
      { agent: relevantAgents[2] || agents[2], action: 'Queried vector memory layer for historical domain patterns' },
      { agent: relevantAgents[3] || agents[3], action: 'Ran parallel sub-routine simulations & computed optimization weights' },
      { agent: relevantAgents[4] || agents[4], action: 'Validated outputs against SLA compliance rules and rendered summary' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setExecutionLogs((prev) => [
          ...prev,
          {
            id: Date.now() + index,
            time: new Date().toLocaleTimeString(),
            agent: step.agent,
            action: step.action,
            status: 'completed'
          }
        ]);

        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setCompletedReport({
              status: 'Mission Accomplished',
              executionTime: '482ms',
              agentsInvolved: relevantAgents.length,
              tokensProcessed: 14820,
              summary: `Directive successfully dispatched across ${relevantAgents.length} micro-agents. All KPI outputs validated with 100% SLA compliance and zero critical escalation.`
            });
          }, 600);
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-md uppercase">
          Autonomous Dispatch Playground
        </span>
        <h2 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-cyan-400" />
          Autonomous 200 Micro-Agent Mission Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Dispatch natural language directives to the fleet. CEO Agent #1 will orchestrate sub-agents, retrieve memory vectors, and execute multi-agent workflows in real time.
        </p>
      </div>

      {/* Main Input Control Panel */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Mission Directive Prompt:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={missionPrompt}
              onChange={(e) => setMissionPrompt(e.target.value)}
              placeholder="Type mission directive for the 200 micro-agents..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans transition-colors resize-none"
            />
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
            Quick Preset Missions:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetMissions.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMissionPrompt(preset.prompt);
                  if (preset.dept) setSelectedDept(preset.dept);
                }}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors text-left flex items-center gap-1.5 font-sans"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Dept Selector */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Department Scope:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All 10 Departments (Fleet Dispatch)</option>
              {departments.map((d) => (
                <option key={d.key} value={d.key}>{d.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunMission}
            disabled={isRunning || !missionPrompt.trim()}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 font-mono ${
              isRunning || !missionPrompt.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-cyan-950/50'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                Orchestrating Fleet...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-cyan-300 fill-current" />
                Execute Mission Dispatch
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Agent Task Delegation Topology Graph */}
      <AgentNodeGraph
        departments={departments}
        agents={agents}
        onSelectAgent={onSelectAgent}
        isExecuting={isRunning}
      />

      {/* Execution Console & Logs */}
      {(executionLogs.length > 0 || isRunning) && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold text-slate-200">Execution Console Log</span>
            </div>
            <span className="text-slate-500 text-[11px]">{executionLogs.length} Events Logged</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {executionLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-900/90 border border-slate-800/80 rounded-lg space-y-1 animate-fadeIn"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{log.time}</span>
                    <span className="text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 cursor-pointer"
                          onClick={() => onSelectAgent(log.agent)}>
                      #{log.agent.id} - {log.agent.name}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                  </span>
                </div>
                <p className="text-slate-200 font-sans text-xs pt-1">
                  {log.action}
                </p>
              </div>
            ))}
          </div>

          {/* Final Completed Summary Card & Export Options */}
          {completedReport && (
            <div className="bg-emerald-950/40 border border-emerald-800/80 p-5 rounded-xl space-y-4 font-sans mt-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
                <span className="font-mono font-extrabold text-emerald-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {completedReport.status}
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Total Latency: {completedReport.executionTime}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {completedReport.summary}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-emerald-800/60 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-3 text-slate-400">
                  <span>Agents: <strong className="text-white">{completedReport.agentsInvolved}</strong></span>
                  <span>•</span>
                  <span>Tokens: <strong className="text-cyan-300">{completedReport.tokensProcessed.toLocaleString()}</strong></span>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportMarkdown}
                    className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export (.MD)
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export (.JSON)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
