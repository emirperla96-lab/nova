'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import AgentsDirectoryTab from './components/AgentsDirectoryTab';
import DepartmentCommandTab from './components/DepartmentCommandTab';
import RoadmapTab from './components/RoadmapTab';
import MemoryLearningTab from './components/MemoryLearningTab';
import PlaybookTab from './components/PlaybookTab';
import MissionSimulatorTab from './components/MissionSimulatorTab';
import AgentModal from './components/AgentModal';
import LiveTelemetryStream from './components/LiveTelemetryStream';

import TerminalInterfaceTab from './components/TerminalInterfaceTab';
import FloatingTerminalWidget from './components/FloatingTerminalWidget';

import ACOSAiTeamTab from './components/ACOSAiTeamTab';
import AutonomousAiCompanyTab from './components/AutonomousAiCompanyTab';
import AiEngineRouterTab from './components/AiEngineRouterTab';
import AiToolsRegistryTab from './components/AiToolsRegistryTab';
import WebGpuLocalModelTab from './components/WebGpuLocalModelTab';
import GoogleWorkspaceCloudSqlTab from './components/GoogleWorkspaceCloudSqlTab';
import CommerceSubscriptionTab from './components/CommerceSubscriptionTab';
import RbacUserInviteTab from './components/RbacUserInviteTab';
import ChatGptActionTab from './components/ChatGptActionTab';
import KnowledgeMemoryTab from './components/KnowledgeMemoryTab';
import OperationsSecurityTab from './components/OperationsSecurityTab';

import MagicalLogin from './components/MagicalLogin';
import { auth, onAuthStateChanged } from './lib/firebase';

import { getAllAgents, getDepartments, masterData, roadmapData, playbookData, learningData, memoryData } from './lib/atlasData';

export default function AtlasOSApp() {
  const [activeTab, setActiveTab] = useState('autonomous-company');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    setMounted(true);
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const allowedAdmins = ['emirperla96@gmail.com', 'emir.p.win@gmail.com'];
          if (allowedAdmins.includes(firebaseUser.email)) {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              photoURL: firebaseUser.photoURL,
              isSuperAdmin: true,
            });
          } else {
            // Immediately sign out unauthorized users
            auth.signOut();
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      });
    }
    return () => unsubscribe();
  }, []);

  const agents = useMemo(() => getAllAgents(), []);
  const departments = useMemo(() => getDepartments(), []);

  const handleSelectDepartment = (dept) => {
    setSelectedDepartment(dept);
    setActiveTab('departments');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <MagicalLogin onLoginSuccess={setCurrentUser} />;
  }

  const activeAgentCount = agents.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#05050a] to-black text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAgentCount={activeAgentCount}
        totalAgents={agents.length}
        systemStatus="AUTONOMOUS_ONLINE"
        onOpenSimulator={() => setActiveTab('simulator')}
        currentUser={currentUser}
        onLogout={() => {
          if (auth) auth.signOut();
          setCurrentUser(null);
        }}
        onSwitchUser={(usr) => setCurrentUser(usr)}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none mix-blend-screen"></div>
        {activeTab === 'autonomous-company' && <AutonomousAiCompanyTab currentUser={currentUser} />}
        {activeTab === 'terminal' && <TerminalInterfaceTab agents={agents} departments={departments} currentUser={currentUser} onNavigateTab={setActiveTab} />}
        {activeTab === 'acos-team' && <ACOSAiTeamTab onSelectAgent={setSelectedAgent} />}
        {activeTab === 'ai-engine' && <AiEngineRouterTab />}
        {activeTab === 'ai-tools-registry' && <AiToolsRegistryTab />}
        {activeTab === 'chatgpt-action' && <ChatGptActionTab />}
        {activeTab === 'webgpu-local' && <WebGpuLocalModelTab currentUser={currentUser} />}
        {activeTab === 'workspace-cloudsql' && <GoogleWorkspaceCloudSqlTab currentUser={currentUser} />}
        {activeTab === 'commerce' && <CommerceSubscriptionTab />}
        {activeTab === 'rbac-users' && <RbacUserInviteTab />}
        {activeTab === 'overview' && <OverviewTab agents={agents} departments={departments} onSelectAgent={setSelectedAgent} onSelectDept={handleSelectDepartment} onNavigateTab={setActiveTab} />}
        {activeTab === 'agents' && <AgentsDirectoryTab agents={agents} departments={departments} onSelectAgent={setSelectedAgent} />}
        {activeTab === 'departments' && <DepartmentCommandTab departments={departments} agents={agents} onSelectAgent={setSelectedAgent} />}
        {activeTab === 'knowledge' && <KnowledgeMemoryTab />}
        {activeTab === 'roadmap' && <RoadmapTab roadmapData={roadmapData} />}
        {activeTab === 'learning' && <MemoryLearningTab memoryData={memoryData} learningData={learningData} />}
        {activeTab === 'playbook' && <PlaybookTab playbookData={playbookData} />}
        {activeTab === 'operations' && <OperationsSecurityTab />}
        {activeTab === 'simulator' && <MissionSimulatorTab agents={agents} departments={departments} onSelectAgent={setSelectedAgent} />}
      </main>
      <LiveTelemetryStream agents={agents} onSelectAgent={setSelectedAgent} />
      <footer className="border-t border-white/5 bg-black/50 backdrop-blur-xl py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>AtlantidaOS v1.0 • Magical Admin Dashboard</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Admin: {currentUser.email}</span>
            <span>•</span>
            <span className="text-cyan-500 font-bold shadow-cyan-500/50 drop-shadow-md">SUPER_ADMIN (*) Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
