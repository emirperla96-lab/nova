import React, { useState, useMemo } from 'react';
import { Search, Filter, Cpu, ArrowUpRight, CheckCircle, Shield, Activity, Sparkles, AlertCircle } from 'lucide-react';

export default function AgentsDirectoryTab({ agents, departments, onSelectAgent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch = 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.mission?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(agent.id).includes(searchTerm);

      const matchesDept = 
        selectedDeptFilter === 'ALL' || 
        agent.departmentKey === selectedDeptFilter ||
        agent.department === selectedDeptFilter;

      const matchesStatus = 
        selectedStatusFilter === 'ALL' || 
        agent.status === selectedStatusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [agents, searchTerm, selectedDeptFilter, selectedStatusFilter]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              200 Supreme Micro-Agents Roster
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Search and inspect all 200 autonomous agents powering AtlantidaOS v1.0.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID, name, title or mission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Department:</span>
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Departments (10)</option>
            {departments.map((d) => (
              <option key={d.key} value={d.key}>
                {d.name} ({d.agentCount || d.agents?.length || 0})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-slate-400 ml-0 md:ml-4">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Status:</span>
          </div>

          <div className="flex items-center gap-1 font-mono">
            {['ALL', 'active', 'idle', 'training'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize transition-all ${
                  selectedStatusFilter === st
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="ml-auto text-xs text-slate-400 font-mono">
            Showing <span className="text-cyan-400 font-bold">{filteredAgents.length}</span> of {agents.length} Agents
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-xl">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-bold text-slate-200">No Micro-Agents Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or adjusting the department filters.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedDeptFilter('ALL'); setSelectedStatusFilter('ALL'); }}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 rounded-lg border border-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => {
            const isActive = agent.status === 'active';
            const isTraining = agent.status === 'training';

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent)}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl shadow-lg transition-all hover:translate-y-[-2px] cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded">
                        #{agent.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-semibold capitalize ${
                        isActive 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : isTraining
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {agent.status}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {agent.latency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mt-2">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {agent.title}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    Department: <span className="text-slate-300">{agent.department}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {agent.mission}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500 font-mono">
                    KPIs: <span className="text-cyan-400 font-bold">{agent.kpis?.length || 0} Defined</span>
                  </div>
                  <span className="text-indigo-400 group-hover:underline text-xs font-semibold flex items-center gap-1">
                    Inspect Specs <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
