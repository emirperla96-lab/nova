'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Bot,
  Layers,
  Briefcase,
  Search,
  Code,
  Server,
  PenTool,
  Shield,
  Zap,
  Database,
  CheckSquare,
  Wrench,
  Brain,
  Workflow,
  Terminal,
  FileText,
  LineChart,
  TrendingUp,
  Activity
} from 'lucide-react';

// ==========================================
// 20 Specialized AI Workers Baseline Data
// ==========================================
export const INITIAL_WORKERS = [
  {
    id: 1,
    name: 'Chief AI',
    role: 'Chief Executive Officer & Orchestrator',
    category: 'Executive & Strategy',
    description: 'Overall leadership, task prioritization, resource allocation, bottleneck detection, conflict resolution and executive summaries.',
    status: 'Running',
    currentTask: 'Orchestrating 20-agent master execution cycle & monitoring system ROI',
    progress: 88,
    tasksCompleted: 412,
    cpuUsage: '4.2%',
    memUsage: '128 MB',
    iconName: 'Bot',
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M1-1', timestamp: '2026-08-03 02:00', title: 'Master Directive Standardized', details: 'Established 20-worker coordination protocol with immutable log approvals.', type: 'Architecture Decision' },
      { id: 'M1-2', timestamp: '2026-08-03 01:15', title: 'Bottleneck Detected & Cleared', details: 'Reallocated Database Engineer bandwidth to speed up PostgreSQL index re-building.', type: 'Learned Solution' }
    ]
  },
  {
    id: 2,
    name: 'Product Architect',
    role: 'Product & Roadmap Architect',
    category: 'Executive & Strategy',
    description: 'Designs products, new features, system modules and maintains the long-term OS roadmap.',
    status: 'Running',
    currentTask: 'Architecting WebGPU + Local LLM fallback module & offline storage schema',
    progress: 81,
    tasksCompleted: 295,
    cpuUsage: '3.0%',
    memUsage: '115 MB',
    iconName: 'Layers',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M2-1', timestamp: '2026-08-03 01:50', title: 'Local AI Hybrid Architecture V2', details: 'Designed fallback hierarchy: WebGPU -> WebAssembly -> Server Gemini API.', type: 'Architecture Decision' }
    ]
  },
  {
    id: 3,
    name: 'Project Manager',
    role: 'Task & Milestone Coordinator',
    category: 'Executive & Strategy',
    description: 'Creates tasks, manages milestones, tracks deadlines and coordinates cross-worker dependencies.',
    status: 'Running',
    currentTask: 'Tracking 14 active background jobs & daily sprint velocity',
    progress: 74,
    tasksCompleted: 350,
    cpuUsage: '2.8%',
    memUsage: '95 MB',
    iconName: 'Briefcase',
    color: 'from-indigo-500 to-blue-600',
    borderColor: 'border-indigo-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M3-1', timestamp: '2026-08-03 02:10', title: 'Milestone Alpha Verified', details: '100% of 20 AI worker baseline schedules executed without queue backlogs.', type: 'Completed Task' }
    ]
  },
  {
    id: 4,
    name: 'Research Intelligence AI',
    role: 'Competitive & Trend Analyst',
    category: 'Research & Product',
    description: 'Researches markets, competitors, emerging technologies and growth opportunities daily.',
    status: 'Running',
    currentTask: 'Analyzing WebGPU shaders, Web Assembly acceleration & Google Workspace REST APIs',
    progress: 92,
    tasksCompleted: 184,
    cpuUsage: '3.1%',
    memUsage: '110 MB',
    iconName: 'Search',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M4-1', timestamp: '2026-08-03 01:30', title: 'Browser AI Benchmarks', details: 'WebGPU compute shaders yield 4.2x faster inference over CPU WASM fallback.', type: 'Learned Solution' }
    ]
  },
  {
    id: 5,
    name: 'Frontend Engineer',
    role: 'UI & Component Specialist',
    category: 'Design & Frontend',
    description: 'Maintains UI, Next.js components, responsiveness, hydration speed and rendering efficiency.',
    status: 'Running',
    currentTask: 'Memoizing heavy re-charts and optimizing state selectors in React',
    progress: 80,
    tasksCompleted: 489,
    cpuUsage: '5.6%',
    memUsage: '140 MB',
    iconName: 'Code',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M5-1', timestamp: '2026-08-03 01:45', title: 'Hydration Lag Eliminated', details: 'Applied lazy client-side initialization for heavy chart visualizers.', type: 'Performance Optimization' }
    ]
  },
  {
    id: 6,
    name: 'Backend Engineer',
    role: 'API & Service Specialist',
    category: 'Engineering & Data',
    description: 'Maintains APIs, serverless handlers, databases, authentication, and backend integrations.',
    status: 'Running',
    currentTask: 'Handling Cloud SQL lazy initialization & Firebase auth listeners',
    progress: 78,
    tasksCompleted: 520,
    cpuUsage: '4.8%',
    memUsage: '135 MB',
    iconName: 'Server',
    color: 'from-blue-500 to-indigo-700',
    borderColor: 'border-blue-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M6-1', timestamp: '2026-08-03 01:20', title: 'Lazy Cloud SQL Client Pattern', details: 'Prevented startup crash when SQL secrets are missing by instantiating on first request.', type: 'Learned Solution' }
    ]
  },
  {
    id: 7,
    name: 'Full Stack Engineer',
    role: 'End-to-End Feature Developer',
    category: 'Engineering & Data',
    description: 'Builds complete features across the stack from frontend UI to backend persistence.',
    status: 'Running',
    currentTask: 'Connecting Stripe Webhook handlers to RBAC tier upgrade pipeline',
    progress: 85,
    tasksCompleted: 310,
    cpuUsage: '4.5%',
    memUsage: '125 MB',
    iconName: 'Briefcase',
    color: 'from-sky-600 to-blue-800',
    borderColor: 'border-sky-600/40',
    requiresApproval: true,
    memory: [
      { id: 'M7-1', timestamp: '2026-08-03 02:05', title: 'RBAC Sync Verified', details: 'User permission levels automatically update on Stripe invoice payment event.', type: 'Completed Task' }
    ]
  },
  {
    id: 8,
    name: 'UX Designer',
    role: 'Usability & Accessibility Specialist',
    category: 'Design & Frontend',
    description: 'Improves usability, user experience, WCAG 2.1 contrast ratios and responsive touch targets.',
    status: 'Running',
    currentTask: 'Auditing dark/light contrast ratios & 44px mobile touch targets',
    progress: 65,
    tasksCompleted: 230,
    cpuUsage: '1.9%',
    memUsage: '82 MB',
    iconName: 'PenTool',
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M8-1', timestamp: '2026-08-03 00:50', title: 'WCAG AAA Contrast Standard', details: 'Adjusted Slate-400 muted text to Slate-300 on dark containers for 7.1:1 contrast ratio.', type: 'User Feedback' }
    ]
  },
  {
    id: 9,
    name: 'Security Engineer',
    role: 'Vulnerability & Audit Auditor',
    category: 'Security & QA',
    description: 'Runs vulnerability scans, dependency checks, OAuth permission audits and security hardening.',
    status: 'Running',
    currentTask: 'Auditing Firestore firestore.rules & JWT token verification',
    progress: 96,
    tasksCompleted: 310,
    cpuUsage: '3.5%',
    memUsage: '105 MB',
    iconName: 'Shield',
    color: 'from-red-500 to-amber-600',
    borderColor: 'border-red-500/40',
    requiresApproval: true,
    memory: [
      { id: 'M9-1', timestamp: '2026-08-03 01:15', title: 'OAuth Scope Isolation', details: 'Restricted Gmail API scopes strictly to read-only metadata for email notifications.', type: 'Security Finding' }
    ]
  },
  {
    id: 10,
    name: 'Performance Engineer',
    role: 'Core Web Vitals & Resource Lead',
    category: 'Engineering & Data',
    description: 'Optimizes loading speed, memory usage, HTTP caching headers, WebGPU shaders and resource consumption.',
    status: 'Running',
    currentTask: 'Achieving sub-50ms render latency & image compression',
    progress: 85,
    tasksCompleted: 275,
    cpuUsage: '2.4%',
    memUsage: '98 MB',
    iconName: 'Zap',
    color: 'from-teal-500 to-cyan-600',
    borderColor: 'border-teal-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M10-1', timestamp: '2026-08-03 01:40', title: 'Sub-50ms Frame Render Benchmark', details: 'Render tree optimized to avoid layout thrashing during live chart updates.', type: 'Performance Optimization' }
    ]
  },
  {
    id: 11,
    name: 'Database Engineer',
    role: 'PostgreSQL & Cloud SQL DBA',
    category: 'Engineering & Data',
    description: 'Maintains schemas, indexing, automated backups, Drizzle migrations and data integrity.',
    status: 'Running',
    currentTask: 'Optimizing B-tree index queries for user activity logs',
    progress: 90,
    tasksCompleted: 195,
    cpuUsage: '3.9%',
    memUsage: '118 MB',
    iconName: 'Database',
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-500/40',
    requiresApproval: true,
    memory: [
      { id: 'M11-1', timestamp: '2026-08-03 01:55', title: 'Index Migration Applied', details: 'Added composite index on (worker_id, created_at) reducing scan time from 85ms to 3ms.', type: 'Architecture Decision' }
    ]
  },
  {
    id: 12,
    name: 'QA Engineer',
    role: 'Automated E2E Testing Specialist',
    category: 'Security & QA',
    description: 'Runs automated tests continuously across all routes, tabs and interactive modals after changes.',
    status: 'Running',
    currentTask: 'Executing 48 E2E test scenarios across all 15 app tabs',
    progress: 70,
    tasksCompleted: 440,
    cpuUsage: '4.1%',
    memUsage: '110 MB',
    iconName: 'CheckSquare',
    color: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M12-1', timestamp: '2026-08-03 02:20', title: 'E2E Suite Passed (48/48)', details: 'Validated tab switching, terminal commands, modal popups, and dark mode toggles.', type: 'Completed Task' }
    ]
  },
  {
    id: 13,
    name: 'Bug Hunter',
    role: 'Automated Bug Detection & Patching',
    category: 'Security & QA',
    description: 'Finds, classifies and fixes low-risk bugs, memory leaks and unhandled exceptions automatically.',
    status: 'Running',
    currentTask: 'Scanning global error boundaries & missing null checks',
    progress: 88,
    tasksCompleted: 320,
    cpuUsage: '2.9%',
    memUsage: '88 MB',
    iconName: 'Wrench',
    color: 'from-rose-500 to-red-700',
    borderColor: 'border-rose-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M13-1', timestamp: '2026-08-03 01:10', title: 'Null Safety Guard Added', details: 'Patched optional chaining in terminal output parser for unknown command strings.', type: 'Discovered Bug' }
    ]
  },
  {
    id: 14,
    name: 'AI Engineer',
    role: 'Prompts & Model Reasoning Specialist',
    category: 'Executive & Strategy',
    description: 'Improves prompts, context windows, model reasoning quality, memory recall and output accuracy.',
    status: 'Running',
    currentTask: 'Fine-tuning Gemini 1.5 Pro zero-shot instructions & JSON schema parsers',
    progress: 87,
    tasksCompleted: 260,
    cpuUsage: '3.8%',
    memUsage: '130 MB',
    iconName: 'Brain',
    color: 'from-yellow-500 to-amber-700',
    borderColor: 'border-yellow-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M14-1', timestamp: '2026-08-03 01:25', title: 'Prompt Token Reduction (-28%)', details: 'Structured system context into structured JSON schemas, reducing latency and cost.', type: 'Self Improvement' }
    ]
  },
  {
    id: 15,
    name: 'Automation Engineer',
    role: 'Workflow Automator & Integrator',
    category: 'Engineering & Data',
    description: 'Builds new automations, triggers, Webhook endpoints and eliminates repetitive manual effort.',
    status: 'Running',
    currentTask: 'Wiring Stripe Webhook triggers to RBAC user tier upgrades',
    progress: 89,
    tasksCompleted: 380,
    cpuUsage: '3.2%',
    memUsage: '100 MB',
    iconName: 'Workflow',
    color: 'from-cyan-600 to-blue-700',
    borderColor: 'border-cyan-600/40',
    requiresApproval: false,
    memory: [
      { id: 'M15-1', timestamp: '2026-08-03 01:15', title: 'Google Calendar Auto-Sync Trigger', details: 'Connected event creation webhooks directly to Gmail task notification pipeline.', type: 'Completed Task' }
    ]
  },
  {
    id: 16,
    name: 'DevOps Engineer',
    role: 'Infrastructure & Container Specialist',
    category: 'Engineering & Data',
    description: 'Maintains deployments, Cloud Run containers, nginx reverse proxy on port 3000, and CI/CD.',
    status: 'Running',
    currentTask: 'Monitoring Cloud Run memory limits & static file server health',
    progress: 95,
    tasksCompleted: 210,
    cpuUsage: '2.1%',
    memUsage: '92 MB',
    iconName: 'Terminal',
    color: 'from-slate-600 to-zinc-800',
    borderColor: 'border-slate-500/40',
    requiresApproval: true,
    memory: [
      { id: 'M16-1', timestamp: '2026-08-03 01:00', title: 'Port 3000 Health Check OK', details: 'Nginx proxy routing verified with sub-5ms response time.', type: 'Learned Solution' }
    ]
  },
  {
    id: 17,
    name: 'Documentation AI',
    role: 'Technical Knowledge Specialist',
    category: 'Growth & Content',
    description: 'Maintains documentation, technical knowledge base, help pages and onboarding guides.',
    status: 'Running',
    currentTask: 'Drafting 33-Step Chief AI Master Workflow documentation',
    progress: 82,
    tasksCompleted: 215,
    cpuUsage: '1.8%',
    memUsage: '72 MB',
    iconName: 'FileText',
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M17-1', timestamp: '2026-08-03 00:45', title: 'API Documentation Updated', details: 'Generated interactive REST schema docs for all 20 worker webhook endpoints.', type: 'Completed Task' }
    ]
  },
  {
    id: 18,
    name: 'Analytics AI',
    role: 'Metrics & User Behavior Analyst',
    category: 'Growth & Content',
    description: 'Tracks KPIs, user behavior, session duration, feature adoption and business performance.',
    status: 'Running',
    currentTask: 'Aggregating real-time telemetry stream data points',
    progress: 91,
    tasksCompleted: 290,
    cpuUsage: '2.7%',
    memUsage: '90 MB',
    iconName: 'LineChart',
    color: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-400/40',
    requiresApproval: false,
    memory: [
      { id: 'M18-1', timestamp: '2026-08-03 02:00', title: 'User Engagement Surge (+42%)', details: 'Autonomous AI Company tab gained highest session duration across active users.', type: 'User Feedback' }
    ]
  },
  {
    id: 19,
    name: 'Growth AI',
    role: 'Product & Marketing Growth Lead',
    category: 'Growth & Content',
    description: 'Suggests product improvements, viral campaigns, CRO models and monetization opportunities.',
    status: 'Running',
    currentTask: 'Evaluating Stripe checkout conversion rates (+34.2% CRO lift)',
    progress: 76,
    tasksCompleted: 160,
    cpuUsage: '2.2%',
    memUsage: '85 MB',
    iconName: 'TrendingUp',
    color: 'from-fuchsia-500 to-pink-600',
    borderColor: 'border-fuchsia-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M19-1', timestamp: '2026-08-03 01:35', title: 'Freemium Tier Upgrade Strategy', details: 'Proposed automated 14-day Enterprise trial trigger upon 100 worker executions.', type: 'Self Improvement' }
    ]
  },
  {
    id: 20,
    name: 'Maintenance AI',
    role: 'System Cleanup & Health Specialist',
    category: 'Engineering & Data',
    description: 'Runs maintenance, cache cleanup, log rotation, unused asset removal and health checks.',
    status: 'Running',
    currentTask: 'Clearing temp cache buffers & optimizing local storage index',
    progress: 99,
    tasksCompleted: 680,
    cpuUsage: '1.6%',
    memUsage: '75 MB',
    iconName: 'Activity',
    color: 'from-green-500 to-emerald-700',
    borderColor: 'border-green-500/40',
    requiresApproval: false,
    memory: [
      { id: 'M20-1', timestamp: '2026-08-03 02:25', title: 'Cache Buffer Purged', details: 'Reclaimed 140MB transient memory from old log streams.', type: 'Performance Optimization' }
    ]
  }
];

export const INITIAL_TASK_QUEUE = [
  {
    id: 'TSK-2001',
    title: 'Run hourly log scan & bug detection',
    assignee: 'Bug Hunter',
    workerId: 13,
    priority: 'High',
    schedule: 'Hourly',
    status: 'In Progress',
    time: '10m remaining',
    riskLevel: 'Low'
  },
  {
    id: 'TSK-2002',
    title: 'PostgreSQL database query optimization',
    assignee: 'Database Engineer',
    workerId: 11,
    priority: 'High',
    schedule: 'Daily',
    status: 'Queued',
    time: 'Scheduled',
    riskLevel: 'Medium'
  },
  {
    id: 'TSK-2003',
    title: 'Deep security audit & Firestore rules validation',
    assignee: 'Security Engineer',
    workerId: 9,
    priority: 'Critical',
    schedule: 'Weekly',
    status: 'Queued',
    time: 'Scheduled',
    riskLevel: 'High'
  },
  {
    id: 'TSK-2004',
    title: 'Technical debt cleanup & bundle refactoring',
    assignee: 'DevOps Engineer',
    workerId: 16,
    priority: 'Medium',
    schedule: 'Monthly',
    status: 'Queued',
    time: 'Scheduled',
    riskLevel: 'Medium'
  },
  {
    id: 'TSK-2005',
    title: 'A/B test onboarding conversion UX',
    assignee: 'UX Designer',
    workerId: 8,
    priority: 'Low',
    schedule: 'Daily',
    status: 'Queued',
    time: 'Scheduled',
    riskLevel: 'Low'
  }
];

export const INITIAL_MEMORY_LOGS = [
  {
    id: 'MEM-001',
    timestamp: '2026-08-03 02:00:15',
    worker: 'Chief AI',
    workerId: 1,
    type: 'Architecture Decision',
    summary: 'Established 20-worker autonomous company structure with shared JSON memory bus and RBAC safeguards.',
    status: 'Success'
  },
  {
    id: 'MEM-002',
    timestamp: '2026-08-03 01:45:00',
    worker: 'Frontend Engineer',
    workerId: 5,
    type: 'Learned Solution',
    summary: 'Optimized environment variable fallbacks so preview loads instantly without blocking modal dialogs.',
    status: 'Success'
  },
  {
    id: 'MEM-003',
    timestamp: '2026-08-03 01:30:22',
    worker: 'Automation Engineer',
    workerId: 15,
    type: 'Completed Task',
    summary: 'Connected Google Calendar REST API sync with Gmail message auto-scheduling workflow.',
    status: 'Success'
  },
  {
    id: 'MEM-004',
    timestamp: '2026-08-03 01:15:10',
    worker: 'Security Engineer',
    workerId: 9,
    type: 'Discovered Bug',
    summary: 'Detected unhandled AuthState change listener null check. Fixed lazily inside useEffect.',
    status: 'Resolved'
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'LOG-1001',
    timestamp: '2026-08-04 14:25:30',
    workerId: 1,
    workerName: 'Chief AI',
    workerRole: 'Chief Executive Officer & Orchestrator',
    category: 'Executive & Strategy',
    actionType: 'Master Orchestration',
    actionDescription: 'Executed 20-worker coordination pulse & verified 0 bottleneck locks across parallel subroutines.',
    impact: 'High',
    latencyMs: 14,
    status: 'Success'
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-08-04 14:25:12',
    workerId: 5,
    workerName: 'Frontend Engineer',
    workerRole: 'UI & Component Specialist',
    category: 'Design & Frontend',
    actionType: 'UI Optimization',
    actionDescription: 'Memoized re-charts re-render selector, saving 38ms per frame update on low-spec hardware.',
    impact: 'Medium',
    latencyMs: 22,
    status: 'Success'
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-08-04 14:24:50',
    workerId: 9,
    workerName: 'Security Engineer',
    workerRole: 'Vulnerability & Audit Auditor',
    category: 'Security & QA',
    actionType: 'Security Scan',
    actionDescription: 'Ran zero-trust firestore.rules audit. Confirmed 0 unauthorized read/write vectors.',
    impact: 'Critical',
    latencyMs: 65,
    status: 'Success'
  },
  {
    id: 'LOG-1004',
    timestamp: '2026-08-04 14:24:30',
    workerId: 11,
    workerName: 'Database Engineer',
    workerRole: 'PostgreSQL & Cloud SQL DBA',
    category: 'Engineering & Data',
    actionType: 'Index Maintenance',
    actionDescription: 'Reindexed B-tree activity log table, reducing query scan time from 45ms to 2ms.',
    impact: 'High',
    latencyMs: 34,
    status: 'Success'
  },
  {
    id: 'LOG-1005',
    timestamp: '2026-08-04 14:24:10',
    workerId: 13,
    workerName: 'Bug Hunter',
    workerRole: 'Automated Bug Detection & Patching',
    category: 'Security & QA',
    actionType: 'Null-Check Patch',
    actionDescription: 'Scanned global window bounds for unhandled rejection event listener. Applied safe guard.',
    impact: 'Medium',
    latencyMs: 18,
    status: 'Resolved'
  },
  {
    id: 'LOG-1006',
    timestamp: '2026-08-04 14:23:45',
    workerId: 14,
    workerName: 'AI Engineer',
    workerRole: 'Prompts & Model Reasoning Specialist',
    category: 'Executive & Strategy',
    actionType: 'Prompt Tuning',
    actionDescription: 'Optimized system prompt token budget. Reduced inference latency by 24% on Gemini 1.5 Pro.',
    impact: 'Medium',
    latencyMs: 88,
    status: 'Success'
  },
  {
    id: 'LOG-1007',
    timestamp: '2026-08-04 14:23:20',
    workerId: 12,
    workerName: 'QA Engineer',
    workerRole: 'Automated E2E Testing Specialist',
    category: 'Security & QA',
    actionType: 'E2E Test Execution',
    actionDescription: 'Ran automated test suite across 15 Atlantida OS tabs. All 48 test assertions passed cleanly.',
    impact: 'High',
    latencyMs: 120,
    status: 'Success'
  },
  {
    id: 'LOG-1008',
    timestamp: '2026-08-04 14:23:00',
    workerId: 16,
    workerName: 'DevOps Engineer',
    workerRole: 'Infrastructure & Container Specialist',
    category: 'Engineering & Data',
    actionType: 'Port & Proxy Check',
    actionDescription: 'Verified port 3000 nginx reverse proxy route stability & Cloud Run health endpoint.',
    impact: 'High',
    latencyMs: 12,
    status: 'Success'
  }
];

export const INITIAL_REPORTS = {
  daily: {
    title: 'Automated Daily System Health & Optimization Report',
    date: '2026-08-03',
    dbOptimization: 'Completed - 0 missing indexes, query latency under 12ms',
    frontendOptimization: 'Completed - Dynamic code splitting & sub-50ms WebGPU execution',
    backendOptimization: 'Completed - Zero crash rate, 100% route fallback ready',
    healthScore: '99/100',
    suggestions: [
      'Enable automated Webhook retry queues for Stripe subscriptions',
      'Expand Google Workspace Calendar attendees auto-suggestion',
      'Increase WebGPU shader cache buffer to 256MB for desktop browsers'
    ]
  },
  weekly: {
    title: 'Weekly Deep Audit & Architecture Benchmark',
    date: '2026-08-01 - 2026-08-03',
    securityAudit: 'Passed - 0 high risk vulnerabilities, OAuth 2.0 scopes aligned',
    dependencyUpdates: 'Up to date - Lucide-react, Next.js 14, React 18',
    seoAudit: 'Score 97/100 - OpenGraph & Structured Schema verified',
    uxReview: '4.9/5 UX Rating - responsive on mobile, desktop, and preview iframe'
  },
  monthly: {
    title: 'Monthly Autonomous Scalability & Cost Optimization Report',
    date: 'August 2026',
    technicalDebt: 'Reduced by 42% via automated refactoring micro-agents',
    scalabilityReview: 'Cloud Run horizontal autoscaling validated for 50,000 requests/min',
    costSavings: '$342,850/month productivity gain via 20 AI Workers'
  }
};

// Create the Context
const AutonomousAiCompanyContext = createContext(null);

export function AutonomousAiCompanyProvider({ children }) {
  // Workers state
  const [workers, setWorkers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atlantida_ai_workers');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_WORKERS;
  });

  // Task Queue state
  const [taskQueue, setTaskQueue] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atlantida_ai_tasks');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_TASK_QUEUE;
  });

  // Shared Memory logs state
  const [memoryLogs, setMemoryLogs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atlantida_ai_memory');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_MEMORY_LOGS;
  });

  // Real-time Activity Logs state
  const [activityLogs, setActivityLogs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atlantida_ai_activity_logs');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Executive Reports
  const [reports, setReports] = useState(INITIAL_REPORTS);

  // System Controls
  const [isSystemRunning, setIsSystemRunning] = useState(true);
  const [selectedWorkerId, setSelectedWorkerId] = useState(1); // Default Chief AI

  // Telemetry scores
  const [systemScores, setSystemScores] = useState({
    healthScore: 99,
    performanceScore: 98,
    securityScore: 99,
    reliabilityScore: 100,
    codeQualityScore: 97,
    aiConfidenceScore: 98,
    cpuUsage: 14.2,
    memUsage: 48.6,
    storageUsage: '1.2 GB / 20 GB'
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('atlantida_ai_workers', JSON.stringify(workers));
        localStorage.setItem('atlantida_ai_tasks', JSON.stringify(taskQueue));
        localStorage.setItem('atlantida_ai_memory', JSON.stringify(memoryLogs));
        localStorage.setItem('atlantida_ai_activity_logs', JSON.stringify(activityLogs));
      } catch (err) {
        console.warn('LocalStorage save warning:', err);
      }
    }
  }, [workers, taskQueue, memoryLogs, activityLogs]);

  // Helper to append a single activity log entry
  const addActivityLog = useCallback((logData) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: nowStr,
      impact: 'Medium',
      status: 'Success',
      latencyMs: Math.floor(Math.random() * 45) + 10,
      ...logData
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 99)]); // Keep last 100
  }, []);

  const clearActivityLogs = useCallback(() => {
    setActivityLogs([]);
  }, []);

  // Helper to simulate instant random worker activity
  const simulateRandomWorkerActivity = useCallback((overrideWorkerId = null) => {
    const activeWorker = overrideWorkerId 
      ? workers.find(w => w.id === overrideWorkerId) || workers[0]
      : workers[Math.floor(Math.random() * workers.length)];

    const actionTemplates = [
      { type: 'Task Execution', desc: `Finalized sub-module execution for ${activeWorker.currentTask}`, impact: 'Low' },
      { type: 'Code Optimization', desc: `Optimized component re-rendering tree in ${activeWorker.name} module.`, impact: 'Medium' },
      { type: 'Security Scan', desc: `Performed automated policy check on endpoint headers & bearer auth.`, impact: 'High' },
      { type: 'Database Indexing', desc: `Re-built index parameters for fast local storage cache access.`, impact: 'Medium' },
      { type: 'E2E Test Run', desc: `Ran health assertions across worker queue. Result: 100% Pass rate.`, impact: 'High' },
      { type: 'Prompt Tuning', desc: `Adjusted system instructions to reduce model hallucinations & token cost.`, impact: 'Low' },
      { type: 'Bug Patch', desc: `Applied null-safety guard to dynamic state subscriber in worker thread.`, impact: 'Critical' }
    ];

    const chosen = actionTemplates[Math.floor(Math.random() * actionTemplates.length)];

    addActivityLog({
      workerId: activeWorker.id,
      workerName: activeWorker.name,
      workerRole: activeWorker.role,
      category: activeWorker.category,
      actionType: chosen.type,
      actionDescription: chosen.desc,
      impact: chosen.impact,
      latencyMs: Math.floor(Math.random() * 60) + 8,
      status: chosen.type === 'Bug Patch' ? 'Resolved' : 'Success'
    });
  }, [workers, addActivityLog]);

  // Background Autonomous Execution Cycle (Simulates continuous live activity)
  useEffect(() => {
    if (!isSystemRunning) return;

    const interval = setInterval(() => {
      // 1. Progress active workers
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) => {
          if (worker.status !== 'Running') return worker;

          const delta = Math.floor(Math.random() * 3) + 1;
          let newProgress = worker.progress + delta;
          let newCompleted = worker.tasksCompleted;
          let newCurrentTask = worker.currentTask;

          if (newProgress >= 100) {
            newProgress = Math.floor(Math.random() * 15) + 5;
            newCompleted += 1;
            
            // Generate next task contextually
            const taskVariants = [
              `Refactoring ${worker.name} core subroutines for sub-10ms response`,
              `Executing automated audit cycle for ${worker.category}`,
              `Synchronizing memory logs with Chief AI orchestrator`,
              `Optimizing resource footprint and clearing temporary cache buffers`
            ];
            newCurrentTask = taskVariants[Math.floor(Math.random() * taskVariants.length)];

            // Add an entry to shared memory on cycle completion
            const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const memoryTypes = ['Learned Solution', 'Completed Task', 'Performance Optimization', 'Self Improvement'];
            const chosenType = memoryTypes[Math.floor(Math.random() * memoryTypes.length)];

            setMemoryLogs((prevLogs) => [
              {
                id: `MEM-${Date.now().toString().slice(-4)}`,
                timestamp: nowStr,
                worker: worker.name,
                workerId: worker.id,
                type: chosenType,
                summary: `${worker.name} successfully finalized: ${worker.currentTask}`,
                status: 'Success'
              },
              ...prevLogs.slice(0, 49) // Keep last 50 entries
            ]);
          }

          return {
            ...worker,
            progress: newProgress,
            tasksCompleted: newCompleted,
            currentTask: newCurrentTask
          };
        })
      );

      // 2. Generate a real-time activity log entry for a random running worker
      const runningWorkers = workers.filter((w) => w.status === 'Running');
      if (runningWorkers.length > 0) {
        const randomWorker = runningWorkers[Math.floor(Math.random() * runningWorkers.length)];
        const actionPool = [
          { type: 'Task Subroutine', desc: `Executing background step: "${randomWorker.currentTask}"`, impact: 'Low' },
          { type: 'Telemetry Sync', desc: `Synchronized memory & state metrics with Central Orchestrator.`, impact: 'Low' },
          { type: 'Cache Clear', desc: `Purged stale local storage cache buffer for ${randomWorker.name}.`, impact: 'Medium' },
          { type: 'Performance Audit', desc: `Verified sub-50ms latency across worker dispatch queue.`, impact: 'High' }
        ];
        const selectedAction = actionPool[Math.floor(Math.random() * actionPool.length)];

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setActivityLogs((prev) => [
          {
            id: `LOG-${Date.now().toString().slice(-5)}`,
            timestamp: nowStr,
            workerId: randomWorker.id,
            workerName: randomWorker.name,
            workerRole: randomWorker.role,
            category: randomWorker.category,
            actionType: selectedAction.type,
            actionDescription: selectedAction.desc,
            impact: selectedAction.impact,
            latencyMs: Math.floor(Math.random() * 40) + 12,
            status: 'Success'
          },
          ...prev.slice(0, 99)
        ]);
      }

      // Slightly fluctuate telemetry
      setSystemScores((prev) => ({
        ...prev,
        cpuUsage: Number((12 + Math.random() * 5).toFixed(1)),
        memUsage: Number((47 + Math.random() * 3).toFixed(1))
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, [isSystemRunning, workers]);

  // Actions
  const updateWorkerStatus = useCallback((workerId, newStatus) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: newStatus } : w))
    );
  }, []);

  const pauseWorker = useCallback((workerId) => {
    updateWorkerStatus(workerId, 'Paused');
  }, [updateWorkerStatus]);

  const resumeWorker = useCallback((workerId) => {
    updateWorkerStatus(workerId, 'Running');
  }, [updateWorkerStatus]);

  const pauseAllWorkers = useCallback(() => {
    setIsSystemRunning(false);
    setWorkers((prev) => prev.map((w) => ({ ...w, status: 'Paused' })));
  }, []);

  const resumeAllWorkers = useCallback(() => {
    setIsSystemRunning(true);
    setWorkers((prev) => prev.map((w) => ({ ...w, status: 'Running' })));
  }, []);

  const emergencyStop = useCallback(() => {
    setIsSystemRunning(false);
    setWorkers((prev) => prev.map((w) => ({ ...w, status: 'Stopped' })));
  }, []);

  const assignTaskToWorker = useCallback((workerId, taskTitle, priority = 'Medium', schedule = 'Daily') => {
    const targetWorker = workers.find((w) => w.id === workerId);
    if (!targetWorker) return;

    const newTask = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: taskTitle,
      assignee: targetWorker.name,
      workerId: targetWorker.id,
      priority,
      schedule,
      status: 'In Progress',
      time: 'Just assigned',
      riskLevel: targetWorker.requiresApproval ? 'High' : 'Low'
    };

    setTaskQueue((prev) => [newTask, ...prev]);

    // Update worker currentTask
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              currentTask: taskTitle,
              progress: 10,
              status: 'Running'
            }
          : w
      )
    );

    // Log to Shared Memory
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setMemoryLogs((prev) => [
      {
        id: `MEM-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        worker: targetWorker.name,
        workerId: targetWorker.id,
        type: 'Assigned Task',
        summary: `Assigned new task to ${targetWorker.name}: "${taskTitle}" (${priority} priority)`,
        status: 'Success'
      },
      ...prev
    ]);
  }, [workers]);

  const addWorkerMemory = useCallback((workerId, memoryItem) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        const newMemory = [
          {
            id: `M${workerId}-${Date.now().toString().slice(-4)}`,
            timestamp: nowStr,
            ...memoryItem
          },
          ...(w.memory || [])
        ];
        return { ...w, memory: newMemory };
      })
    );

    // Also push to shared logs
    const targetWorker = workers.find((w) => w.id === workerId);
    if (targetWorker) {
      setMemoryLogs((prev) => [
        {
          id: `MEM-${Date.now().toString().slice(-4)}`,
          timestamp: nowStr,
          worker: targetWorker.name,
          workerId: targetWorker.id,
          type: memoryItem.type || 'Learned Solution',
          summary: `${targetWorker.name}: ${memoryItem.title || memoryItem.type} — ${memoryItem.details || memoryItem.summary || ''}`,
          status: 'Success'
        },
        ...prev
      ]);
    }
  }, [workers]);

  const deleteWorkerMemory = useCallback((memoryId) => {
    setMemoryLogs((prev) => prev.filter((m) => m.id !== memoryId));
  }, []);

  const clearAllMemories = useCallback(() => {
    setMemoryLogs([]);
  }, []);

  const broadcastMemoryNode = useCallback((memoryNode) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setMemoryLogs((prev) => [
      {
        id: `MEM-SYNC-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        worker: 'Global Memory Bus',
        workerId: 0,
        type: 'Shared Broadcast',
        summary: `Synchronized memory across 20 Workers: "${memoryNode.summary || memoryNode.title}"`,
        status: 'Success'
      },
      ...prev
    ]);
  }, []);

  const approveHighRiskAction = useCallback((workerId, actionTitle) => {
    const targetWorker = workers.find((w) => w.id === workerId);
    if (!targetWorker) return;

    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: 'Running' } : w))
    );

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setMemoryLogs((prev) => [
      {
        id: `MEM-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        worker: 'Administrator',
        workerId: 0,
        type: 'Admin Approval',
        summary: `Admin approved high-risk action for ${targetWorker.name}: "${actionTitle}"`,
        status: 'Success'
      },
      ...prev
    ]);
  }, [workers]);

  // State for Stripe Monetization & Usage Analytics
  const [stripeTier, setStripeTier] = useState('Enterprise'); // 'Free', 'Pro', 'Enterprise'
  const [creditsRemaining, setCreditsRemaining] = useState(1250000);

  // State for Master Orchestrator
  const [orchestratorConfig, setOrchestratorConfig] = useState({
    maxConcurrency: 8,
    autoRebalance: true,
    pulseIntervalSec: 5,
    autoScalePolicy: 'Dynamic Load Balancing',
    emergencyStopMode: false
  });

  // ==========================================
  // FEATURE 1: Drag-and-Drop Visual Workflows (DAGs)
  // ==========================================
  const [dagWorkflows, setDagWorkflows] = useState([
    {
      id: 'dag-1',
      name: 'Production CI/CD & Security Gate',
      description: 'Automated code review, unit testing, security vulnerability audit and Cloud Run auto-deployment pipeline.',
      status: 'Active',
      nodes: [
        { id: 'node-1', workerId: 1, workerName: 'Chief AI', role: 'Orchestrator Trigger', position: { x: 50, y: 100 } },
        { id: 'node-2', workerId: 2, workerName: 'Product Architect', role: 'Architecture Spec Check', position: { x: 280, y: 50 } },
        { id: 'node-3', workerId: 6, workerName: 'QA & Test Automation AI', role: 'Automated Test Suite', position: { x: 510, y: 50 } },
        { id: 'node-4', workerId: 9, workerName: 'Security Sentinel AI', role: 'Vulnerability Audit', position: { x: 510, y: 180 } },
        { id: 'node-5', workerId: 8, workerName: 'DevOps Infrastructure AI', role: 'Cloud Run Auto Deploy', position: { x: 760, y: 100 } }
      ],
      connections: [
        { from: 'node-1', to: 'node-2', condition: 'Always' },
        { from: 'node-2', to: 'node-3', condition: 'Spec Verified' },
        { from: 'node-3', to: 'node-4', condition: 'Tests Passed (>95%)' },
        { from: 'node-4', to: 'node-5', condition: 'Zero Vulnerabilities' }
      ],
      lastRun: '12 mins ago',
      executionCount: 142
    },
    {
      id: 'dag-2',
      name: 'Autonomous SDR & Lead Outreach Sequence',
      description: 'Market research, lead scoring, personalized messaging creation, and automated Google Workspace calendar scheduling.',
      status: 'Active',
      nodes: [
        { id: 'node-1', workerId: 17, workerName: 'Growth Hacker AI', role: 'Target List Generator', position: { x: 50, y: 100 } },
        { id: 'node-2', workerId: 19, workerName: 'Content Strategist AI', role: 'Copywriting & Personalization', position: { x: 300, y: 100 } },
        { id: 'node-3', workerId: 18, workerName: 'Sales SDR AI', role: 'Outreach Dispatch', position: { x: 550, y: 100 } }
      ],
      connections: [
        { from: 'node-1', to: 'node-2', condition: 'Lead Score > 80' },
        { from: 'node-2', to: 'node-3', condition: 'Copy Approved' }
      ],
      lastRun: '1 hour ago',
      executionCount: 88
    }
  ]);

  const addDagWorkflow = useCallback((newWorkflow) => {
    setDagWorkflows((prev) => [newWorkflow, ...prev]);
  }, []);

  const executeDagWorkflow = useCallback((workflowId) => {
    setDagWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== workflowId) return w;
        return {
          ...w,
          lastRun: 'Just now',
          executionCount: w.executionCount + 1
        };
      })
    );
    addActivityLog({
      worker: 'Master Orchestrator',
      action: 'DAG Workflow Execution',
      summary: `Manually triggered execution cycle for DAG Workflow #${workflowId}`,
      status: 'In Progress'
    });
  }, [addActivityLog]);

  // ==========================================
  // FEATURE 2: RAG & Vector Search Memory Vault
  // ==========================================
  const [ragDocuments, setRagDocuments] = useState([
    {
      id: 'rag-101',
      title: 'PostgreSQL Indexing & Partitioning Strategy',
      category: 'Database Architecture',
      workerName: 'Database Engineer AI',
      tags: ['postgresql', 'indexing', 'performance', 'cloudsql'],
      vectorChunkCount: 14,
      embeddingModel: 'text-embedding-004 (768-dim)',
      content: 'Configured composite B-tree indices on (worker_id, created_at) and GIN indices on JSONB task payloads to maintain sub-10ms query latency under heavy write load.',
      indexedAt: '2026-08-04 14:20'
    },
    {
      id: 'rag-102',
      title: 'WebGPU Local LLM Fallback & Shader Optimization',
      category: 'System Core OS',
      workerName: 'Core System Engine AI',
      tags: ['webgpu', 'wasm', 'local-llm', 'fallback'],
      vectorChunkCount: 22,
      embeddingModel: 'text-embedding-004 (768-dim)',
      content: 'Implemented browser-side WebGPU matrix multiplication kernels allowing local inference when API rate limits or network disconnections occur.',
      indexedAt: '2026-08-05 09:15'
    },
    {
      id: 'rag-103',
      title: 'Google Workspace OAuth Token Refresh Protocol',
      category: 'Security & OAuth',
      workerName: 'Security Sentinel AI',
      tags: ['oauth', 'google-workspace', 'security', 'tokens'],
      vectorChunkCount: 8,
      embeddingModel: 'text-embedding-004 (768-dim)',
      content: 'OAuth access tokens automatically rotate every 50 minutes using encrypted refresh tokens stored in secure server-side HTTP-only cookies.',
      indexedAt: '2026-08-05 18:30'
    }
  ]);

  const addRagDocument = useCallback((docData) => {
    const newDoc = {
      id: `rag-${Date.now()}`,
      title: docData.title,
      category: docData.category || 'General Knowledge',
      workerName: docData.workerName || 'Chief AI',
      tags: docData.tags || ['vector', 'memory'],
      vectorChunkCount: Math.floor(Math.random() * 15) + 5,
      embeddingModel: 'text-embedding-004 (768-dim)',
      content: docData.content,
      indexedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setRagDocuments((prev) => [newDoc, ...prev]);
  }, []);

  const performRagSearch = useCallback((query) => {
    if (!query || !query.trim()) return ragDocuments;
    const qLower = query.toLowerCase();
    return ragDocuments.map((doc) => {
      const matchScore = (
        (doc.title.toLowerCase().includes(qLower) ? 40 : 0) +
        (doc.content.toLowerCase().includes(qLower) ? 35 : 0) +
        (doc.tags.some(t => t.toLowerCase().includes(qLower)) ? 25 : 0)
      );
      const simPercent = Math.min(99, Math.max(65, matchScore + 55));
      return {
        ...doc,
        similarityScore: simPercent,
        distance: (1 - simPercent / 100).toFixed(4)
      };
    }).sort((a, b) => b.similarityScore - a.similarityScore);
  }, [ragDocuments]);

  // ==========================================
  // FEATURE 3: Governance, Budget Guardrails & Approval Gates
  // ==========================================
  const [budgetGuardrails, setBudgetGuardrails] = useState({
    maxDailyTokens: 2500000,
    currentDailyTokens: 1142000,
    maxDailyCostUsd: 500,
    currentDailyCostUsd: 228.40,
    autoPauseOnThreshold: true,
    requireApprovalForDeploy: true,
    requireApprovalForDbMutation: true,
    alertEmail: 'admin@atlantida.ai'
  });

  const [approvalQueue, setApprovalQueue] = useState([
    {
      id: 'app-101',
      title: 'Production Deploy to Cloud Run (WebGPU WebAssembly Engine)',
      workerName: 'DevOps & Infrastructure AI',
      riskLevel: 'HIGH',
      category: 'Cloud Infrastructure',
      timestamp: '15 mins ago',
      details: 'Modifies active container build target and updates ingress reverse proxy configuration.',
      status: 'Pending'
    },
    {
      id: 'app-102',
      title: 'PostgreSQL Database Index Mutation & Table Vacuuming',
      workerName: 'Database Engineer AI',
      riskLevel: 'CRITICAL',
      category: 'Database Alteration',
      timestamp: '32 mins ago',
      details: 'Executes ALTER TABLE on primary vector memory vault to add composite HNSW indexes.',
      status: 'Pending'
    }
  ]);

  const updateBudgetGuardrails = useCallback((newConfig) => {
    setBudgetGuardrails((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const approveGateAction = useCallback((approvalId, adminNote = '') => {
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? { ...item, status: 'Approved', adminNote, processedAt: 'Just now' }
          : item
      )
    );
    addActivityLog({
      worker: 'Human CEO / Admin',
      action: 'Approval Gate Granted',
      summary: `Approved action #${approvalId}. Note: ${adminNote || 'Authorized for execution'}`,
      status: 'Success'
    });
  }, [addActivityLog]);

  const rejectGateAction = useCallback((approvalId, adminNote = '') => {
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? { ...item, status: 'Rejected', adminNote, processedAt: 'Just now' }
          : item
      )
    );
    addActivityLog({
      worker: 'Human CEO / Admin',
      action: 'Approval Gate Rejected',
      summary: `Rejected action #${approvalId}. Note: ${adminNote || 'Denied by CEO policy'}`,
      status: 'Rejected'
    });
  }, [addActivityLog]);

  // ==========================================
  // FEATURE 4: External API Keys & Webhooks
  // ==========================================
  const [apiKeys, setApiKeys] = useState([
    {
      id: 'key-101',
      name: 'GitHub Actions Auto-CI Integration',
      key: 'at_live_8f9a7b6c5d4e3f2a1b0c9d8e7f6a',
      created: '2026-08-01',
      lastUsed: '3 mins ago',
      permissions: ['task:assign', 'worker:read', 'telemetry:read'],
      status: 'Active'
    },
    {
      id: 'key-102',
      name: 'Jira & Slack Trigger Bot Key',
      key: 'at_live_3c2b1a0f9e8d7c6b5a4f3e2d1c0b',
      created: '2026-08-03',
      lastUsed: '1 hour ago',
      permissions: ['task:assign', 'memory:read'],
      status: 'Active'
    }
  ]);

  const [webhookSettings, setWebhookSettings] = useState([
    {
      id: 'wh-101',
      name: 'Slack #atlantida-alerts Channel',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
      events: ['task.completed', 'security.vulnerability_alert', 'approval.required'],
      status: 'Active',
      lastTriggered: '12 mins ago'
    },
    {
      id: 'wh-102',
      name: 'Discord Executive Operations Feed',
      url: 'https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz',
      events: ['budget.threshold_reached', 'system.emergency_stop'],
      status: 'Active',
      lastTriggered: '1 hour ago'
    }
  ]);

  const createApiKey = useCallback((name, permissions = ['task:assign']) => {
    const randomHex = Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18);
    const newKey = {
      id: `key-${Date.now()}`,
      name: name || 'New API Key',
      key: `at_live_${randomHex}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions,
      status: 'Active'
    };
    setApiKeys((prev) => [newKey, ...prev]);
    return newKey;
  }, []);

  const revokeApiKey = useCallback((keyId) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
  }, []);

  const addWebhook = useCallback((webhookData) => {
    const newWh = {
      id: `wh-${Date.now()}`,
      name: webhookData.name,
      url: webhookData.url,
      events: webhookData.events || ['task.completed'],
      status: 'Active',
      lastTriggered: 'Never'
    };
    setWebhookSettings((prev) => [newWh, ...prev]);
  }, []);

  const deleteWebhook = useCallback((whId) => {
    setWebhookSettings((prev) => prev.filter((w) => w.id !== whId));
  }, []);

  const simulateApiTaskAssign = useCallback((payload) => {
    const targetWorker = workers.find((w) => w.name.toLowerCase().includes((payload.assignee || '').toLowerCase())) || workers[0];
    assignTaskToWorker(targetWorker.id, payload.title || 'External Webhook Assignment', payload.priority || 'High');
    addActivityLog({
      worker: targetWorker.name,
      action: 'API REST Trigger (POST /api/v1/tasks/assign)',
      summary: `External task received via API key "${payload.apiKeyName || 'at_live_...'}" for: ${payload.title}`,
      status: 'Success'
    });
    return {
      status: 200,
      statusText: 'OK',
      data: {
        success: true,
        taskId: `task-${Date.now()}`,
        assignedWorker: targetWorker.name,
        estimatedTimeMs: 14,
        timestamp: new Date().toISOString()
      }
    };
  }, [workers, assignTaskToWorker, addActivityLog]);

  // ==========================================
  // FEATURE 5: Advanced Analytics & PDF Audit Reports
  // ==========================================
  const [auditReports, setAuditReports] = useState([
    {
      id: 'rep-201',
      title: 'Q3 Executive AI Operations & Financial ROI Report',
      type: 'Executive Review',
      generatedAt: '2026-08-05 14:00',
      totalTokens: 1420800,
      costSavings: '$342,850',
      efficiencyRatio: '98.4%',
      activeWorkers: 20,
      summary: 'Automated AI company operational report demonstrating 98.4% latency efficiency and 20 parallel worker threads executed without downtime.'
    },
    {
      id: 'rep-202',
      title: 'SOC2 & OWASP Security Compliance Audit',
      type: 'Security Audit',
      generatedAt: '2026-08-06 02:30',
      totalTokens: 980400,
      costSavings: '$120,500',
      efficiencyRatio: '99.9%',
      activeWorkers: 4,
      summary: 'Automated vulnerability scanner verified 0 critical CVEs across all API endpoints, Google Workspace OAuth integrations and Cloud SQL instances.'
    }
  ]);

  const generateAuditReport = useCallback((type = 'Executive Review') => {
    const newReport = {
      id: `rep-${Date.now()}`,
      title: `${type} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      type,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      totalTokens: budgetGuardrails.currentDailyTokens * 30,
      costSavings: `$${(342850 + Math.floor(Math.random() * 15000)).toLocaleString()}`,
      efficiencyRatio: `${(98 + Math.random() * 1.8).toFixed(1)}%`,
      activeWorkers: workers.length,
      summary: `Automated ${type} generated by Atlantida OS Master Orchestrator covering token budget telemetry, security score (${systemScores.securityScore}), and worker throughput.`
    };
    setAuditReports((prev) => [newReport, ...prev]);
    return newReport;
  }, [budgetGuardrails.currentDailyTokens, workers.length, systemScores.securityScore]);

  const downloadReportCsv = useCallback((report) => {
    const csvRows = [
      ['Report ID', 'Report Title', 'Type', 'Generated At', 'Total Tokens', 'Cost Savings', 'Efficiency', 'Active Workers'],
      [report.id, `"${report.title}"`, report.type, report.generatedAt, report.totalTokens, report.costSavings, report.efficiencyRatio, report.activeWorkers],
      [],
      ['Worker Name', 'Category', 'Status', 'Tasks Completed', 'CPU Usage', 'Memory Usage'],
      ...workers.map(w => [w.name, `"${w.category}"`, w.status, w.tasksCompleted, w.cpuUsage, w.memUsage])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [workers]);

  const downloadReportPdf = useCallback((report) => {
    // Open a print preview window styled as an executive PDF report
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title} - Executive PDF Audit</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 40px; }
            .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: 800; color: #1e1b4b; }
            .meta { font-size: 12px; color: #64748b; margin-top: 5px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
            .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; }
            .kpi-value { font-size: 20px; font-weight: 700; color: #4338ca; }
            .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; font-weight: 700; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">⚡ Atlantida OS - ${report.title}</div>
              <div class="meta">Report Type: ${report.type} | Date: ${report.generatedAt} | Document ID: ${report.id}</div>
            </div>
            <div style="font-weight: bold; color: #6366f1;">STRICTLY CONFIDENTIAL</div>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 25px;">
            ${report.summary}
          </p>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-value">${report.totalTokens.toLocaleString()}</div>
              <div class="kpi-label">Tokens Processed</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${report.costSavings}</div>
              <div class="kpi-label">Financial ROI Savings</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${report.efficiencyRatio}</div>
              <div class="kpi-label">Sub-50ms Efficiency</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-value">${report.activeWorkers} Workers</div>
              <div class="kpi-label">Parallel Thread Count</div>
            </div>
          </div>

          <h3 style="margin-top: 30px; font-size: 16px; color: #1e293b;">20 Autonomous AI Workers Status Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Tasks Completed</th>
                <th>CPU</th>
                <th>Memory</th>
              </tr>
            </thead>
            <tbody>
              ${workers.map(w => `
                <tr>
                  <td><strong>${w.name}</strong></td>
                  <td>${w.category}</td>
                  <td><span style="color: ${w.status === 'Running' ? '#16a34a' : '#d97706'};">${w.status}</span></td>
                  <td>${w.tasksCompleted}</td>
                  <td>${w.cpuUsage}</td>
                  <td>${w.memUsage}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            Generated automatically by Atlantida OS Master Autonomous AI Orchestrator. Verified with WebGPU &amp; Google Gemini API Grounding.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [workers]);

  const updateStripeTier = useCallback((newTier) => {
    setStripeTier(newTier);
    if (newTier === 'Pro') setCreditsRemaining(500000);
    if (newTier === 'Enterprise') setCreditsRemaining(5000000);
    if (newTier === 'Free') setCreditsRemaining(50000);
  }, []);

  const updateOrchestratorConfig = useCallback((newConfig) => {
    setOrchestratorConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const updateWorkerPersona = useCallback((workerId, personaData) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          modelAlias: personaData.modelAlias || w.modelAlias || 'Gemini 1.5 Pro',
          temperature: personaData.temperature !== undefined ? personaData.temperature : (w.temperature || 0.7),
          systemInstructions: personaData.systemInstructions || w.systemInstructions || w.description,
          priorityLevel: personaData.priorityLevel || w.priorityLevel || 'High'
        };
      })
    );
  }, []);

  const exportAllWorkerData = useCallback(() => {
    const exportBundle = {
      exportTimestamp: new Date().toISOString(),
      atlantidaOSVersion: '2.4.0-Autonomous',
      stripeTier,
      creditsRemaining,
      orchestratorConfig,
      systemScores,
      totalWorkersCount: workers.length,
      workers,
      taskQueue,
      memoryLogs,
      activityLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `atlantida_ai_master_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [workers, taskQueue, memoryLogs, activityLogs, systemScores, stripeTier, creditsRemaining, orchestratorConfig]);

  const deleteTask = useCallback((taskId) => {
    setTaskQueue((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const completeTask = useCallback((taskId) => {
    setTaskQueue((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'Completed', time: 'Finished' } : t))
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setWorkers(INITIAL_WORKERS);
    setTaskQueue(INITIAL_TASK_QUEUE);
    setMemoryLogs(INITIAL_MEMORY_LOGS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setReports(INITIAL_REPORTS);
    setIsSystemRunning(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('atlantida_ai_workers');
      localStorage.removeItem('atlantida_ai_tasks');
      localStorage.removeItem('atlantida_ai_memory');
      localStorage.removeItem('atlantida_ai_activity_logs');
    }
  }, []);

  const value = {
    workers,
    taskQueue,
    memoryLogs,
    activityLogs,
    reports,
    isSystemRunning,
    selectedWorkerId,
    setSelectedWorkerId,
    systemScores,
    stripeTier,
    creditsRemaining,
    orchestratorConfig,
    // Feature 1: DAG Workflows
    dagWorkflows,
    addDagWorkflow,
    executeDagWorkflow,
    // Feature 2: RAG Vector Vault
    ragDocuments,
    addRagDocument,
    performRagSearch,
    // Feature 3: Governance & Approval Gates
    budgetGuardrails,
    updateBudgetGuardrails,
    approvalQueue,
    approveGateAction,
    rejectGateAction,
    // Feature 4: API Keys & Webhooks
    apiKeys,
    createApiKey,
    revokeApiKey,
    webhookSettings,
    addWebhook,
    deleteWebhook,
    simulateApiTaskAssign,
    // Feature 5: Advanced Analytics & Reports
    auditReports,
    generateAuditReport,
    downloadReportCsv,
    downloadReportPdf,
    // Core Methods
    updateStripeTier,
    updateOrchestratorConfig,
    updateWorkerPersona,
    exportAllWorkerData,
    updateWorkerStatus,
    pauseWorker,
    resumeWorker,
    pauseAllWorkers,
    resumeAllWorkers,
    emergencyStop,
    assignTaskToWorker,
    addWorkerMemory,
    deleteWorkerMemory,
    clearAllMemories,
    broadcastMemoryNode,
    addActivityLog,
    clearActivityLogs,
    simulateRandomWorkerActivity,
    approveHighRiskAction,
    completeTask,
    deleteTask,
    resetToDefaults
  };

  return (
    <AutonomousAiCompanyContext.Provider value={value}>
      {children}
    </AutonomousAiCompanyContext.Provider>
  );
}

// Custom hook to consume the context anywhere in Atlantida OS
export function useAutonomousAiCompany() {
  const context = useContext(AutonomousAiCompanyContext);
  if (!context) {
    throw new Error('useAutonomousAiCompany must be used within an AutonomousAiCompanyProvider');
  }
  return context;
}
