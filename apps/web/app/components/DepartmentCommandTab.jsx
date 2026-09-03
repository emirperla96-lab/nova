import React, { useState } from 'react';
import { Shield, Users, Target, Activity, CheckCircle2, ArrowRight, ChevronRight, Cpu } from 'lucide-react';

export default function DepartmentCommandTab({ departments, agents, onSelectAgent }) {
  const [selectedDeptKey, setSelectedDeptKey] = useState(departments[0]?.key || '');

  const activeDept = departments.find(d => d.key === selectedDeptKey) || departments[0];
  const deptAgents = agents.filter(a => a.departmentKey === activeDept?.key || a.department === activeDept?.name);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          10 Supreme Command Departments
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          AtlantidaOS v1.0 organizes its 200 micro-agents across 10 specialized functional departments, each commanded by a Chief Agent and monitored by real-time SLA metrics.
        </p>
      </div>

      {/* Main Split View: Department Selector Sidebar + Active Department Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Department Tabs List */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Department Index ({departments.length})
          </h3>

          <div className="space-y-1.5">
            {departments.map((dept, index) => {
              const count = agents.filter(a => a.departmentKey === dept.key || a.department === dept.name).length;
              const isSelected = dept.key === activeDept?.key;

              return (
                <button
                  key={dept.key || index}
                  onClick={() => setSelectedDeptKey(dept.key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-800 to-indigo-950/40 border-cyan-500/50 shadow-md text-slate-100'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' : 'bg-slate-800 text-slate-500'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-cyan-300 transition-colors">
                        {dept.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {count || dept.agentCount || 0} Micro-Agents
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Department Detailed Roster & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {activeDept && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-6">
              
              {/* Dept Header */}
              <div className="border-b border-slate-800 pb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50 rounded-md uppercase">
                    Department Command Core
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Operational SLA: 99.9%
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-100">
                  {activeDept.name}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="font-semibold text-cyan-400 block text-xs uppercase tracking-wider mb-1 font-mono">Mission Directive:</span>
                  {activeDept.mission}
                </p>
              </div>

              {/* Department Agent Roster */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Agent Roster ({deptAgents.length} Agents)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deptAgents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => onSelectAgent(agent)}
                      className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 p-3.5 rounded-xl transition-all cursor-pointer group hover:bg-slate-950"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/50">
                          #{agent.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {agent.latency}
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mt-2">
                        {agent.name}
                      </h5>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {agent.title}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-snug">
                        {agent.mission}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Load: {agent.load}%</span>
                        <span className="text-cyan-400 font-semibold group-hover:underline">
                          View Specs &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
