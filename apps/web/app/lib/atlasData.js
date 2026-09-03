import masterData from '../../../../atlas_os_supreme_master.json';
import roadmapData from '../../../../atlas_os_launch_roadmap.json';
import playbookData from '../../../../atlas_os_operational_playbook.json';
import learningData from '../../../../atlas_os_self_learning_loop.json';
import memoryData from '../../../../atlas_os_memory_architecture.json';

import agents1to40 from '../../../../atlas_os_supreme_agents_1_40.json';
import agents41to85 from '../../../../atlas_os_supreme_agents_41_85.json';
import agents86to130 from '../../../../atlas_os_supreme_agents_86_130.json';
import agents131to170 from '../../../../atlas_os_supreme_agents_131_170.json';
import agents171to200 from '../../../../atlas_os_supreme_agents_171_200.json';

// Helper to aggregate all agents from slices
export function getAllAgents() {
  const allAgents = [];

  const slices = [agents1to40, agents41to85, agents86to130, agents131to170, agents171to200];

  slices.forEach((slice) => {
    Object.keys(slice).forEach((deptKey) => {
      const dept = slice[deptKey];
      if (dept && dept.agents && Array.isArray(dept.agents)) {
        dept.agents.forEach((agent) => {
          allAgents.push({
            ...agent,
            department: dept.name || deptKey.replace(/_/g, ' ').toUpperCase(),
            departmentKey: deptKey,
            status: agent.status || (agent.id % 7 === 0 ? 'idle' : agent.id % 13 === 0 ? 'training' : 'active'),
            load: agent.id % 5 === 0 ? 92 : (agent.id * 17) % 95 + 5,
            latency: `${12 + (agent.id % 35)}ms`,
            tokensPerSec: 140 + (agent.id * 7) % 320,
          });
        });
      }
    });
  });

  return allAgents;
}

export function getDepartments() {
  const depts = [];
  const slices = [agents1to40, agents41to85, agents86to130, agents131to170, agents171to200];

  slices.forEach((slice) => {
    Object.keys(slice).forEach((deptKey) => {
      const dept = slice[deptKey];
      if (dept) {
        depts.push({
          key: deptKey,
          name: dept.name,
          agentCount: dept.agent_count || (dept.agents ? dept.agents.length : 0),
          mission: dept.mission,
          agents: dept.agents || []
        });
      }
    });
  });

  return depts;
}

export { masterData, roadmapData, playbookData, learningData, memoryData };
