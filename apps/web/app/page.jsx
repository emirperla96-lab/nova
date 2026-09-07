'use client';
if (typeof window !== "undefined") { localStorage.clear(); }

import React, { useState, useMemo, Suspense } from 'react';
import Header from './components/Header';
import MainDashboardLayout from './components/MainDashboardLayout';
import GeminiChatInterface from './components/GeminiChatInterface';
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
  const [activeTab, setActiveTab] = useState('gemini-chat');
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
    <div className="h-screen w-full bg-[#05060b] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden">
      <MainDashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => {
          if (auth) auth.signOut();
          setCurrentUser(null);
        }}
        onSwitchUser={(usr) => setCurrentUser(usr)}
      >
        {activeTab === 'gemini-chat' && (
          <div className="h-full w-full max-w-5xl mx-auto flex flex-col min-h-[560px]">
            <GeminiChatInterface currentUser={currentUser} />
          </div>
        )}
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
      </MainDashboardLayout>

      {selectedAgent && (
        <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
      <LiveTelemetryStream agents={agents} onSelectAgent={setSelectedAgent} />
    </div>
  );
}
