import * as Lucide from 'lucide-react';
import fs from 'fs';

const files = [
  'app/components/Header.jsx',
  'app/components/AiToolsRegistryTab.jsx',
  'app/components/GoogleWorkspaceCloudSqlTab.jsx',
  'app/components/ACOSAiTeamTab.jsx',
  'app/components/ChatGptActionTab.jsx',
  'app/components/GeminiChatInterface.jsx',
  'app/components/MissionSimulatorTab.jsx',
  'app/components/PlaybookTab.jsx',
  'app/components/DepartmentCommandTab.jsx',
  'app/components/AiEngineRouterTab.jsx',
  'app/components/CommerceSubscriptionTab.jsx',
  'app/components/AgentNodeGraph.jsx',
  'app/components/AutonomousAiCompanyTab.jsx',
  'app/components/AgentModal.jsx',
  'app/components/MainDashboardLayout.jsx',
  'app/components/RoadmapTab.jsx',
  'app/components/MemoryLearningTab.jsx',
  'app/components/RbacUserInviteTab.jsx',
  'app/components/LiveTelemetryStream.jsx',
  'app/components/MagicalLogin.jsx',
  'app/components/WebGpuLocalModelTab.jsx',
  'app/components/RealTimeActivityLog.jsx',
  'app/components/OverviewTab.jsx',
  'app/components/FloatingTerminalWidget.jsx',
  'app/components/AgentsDirectoryTab.jsx',
  'app/components/TerminalInterfaceTab.jsx',
  'app/components/OperationsSecurityTab.jsx',
  'app/components/KnowledgeMemoryTab.jsx'
];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lucideImports = content.match(/import\s+{([^}]+)}\s+from\s+'lucide-react'/g);
    if (lucideImports) {
      for (const match of lucideImports) {
        const icons = match.match(/{([^}]+)}/)[1].split(',').map(s => s.trim().split(' as ')[0]);
        for (const icon of icons) {
          if (icon && !Lucide[icon]) {
            console.log(`Missing icon ${icon} in ${file}`);
          }
        }
      }
    }
  } catch(e) { }
}
