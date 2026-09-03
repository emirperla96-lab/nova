'use client';

import React, { useState } from 'react';
import {
  Shield,
  Users,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Copy,
  RefreshCw,
  Lock,
  Trash2,
  Key,
  Sparkles,
  Send,
  DollarSign,
  CreditCard,
  Download,
  CheckSquare,
  AlertTriangle,
  FileText,
  Activity,
  Globe,
  Smartphone,
  Check,
  Building2,
  ArrowUpRight,
  TrendingUp,
  PieChart,
  UserCheck,
  ShieldCheck,
  Sliders
} from 'lucide-react';

export default function RbacUserInviteTab() {
  const [activeGovernanceSection, setActiveGovernanceSection] = useState('super-admins'); // super-admins, payouts, revenue, approvals, audit, rbac
  const [activeAdminProfile, setActiveAdminProfile] = useState('emir.p.win@gmail.com');

  // Super Admin Accounts Data
  const superAdmins = [
    {
      id: 'SUPER-001',
      email: 'emir.p.win@gmail.com',
      name: 'Emir Perla',
      title: 'Co-Founder & Executive Super Admin',
      role: 'SUPER_ADMIN',
      permissions: '*',
      isPermanent: true,
      status: 'Active & Protected',
      country: 'United States',
      timezone: 'America/Los_Angeles (UTC-7)',
      language: 'English (US)',
      twoFactorEnabled: true,
      twoFactorMethod: 'YubiKey 5C Hardware Key + TOTP',
      apiKeysCount: 4,
      connectedServices: ['Stripe Connect', 'Google Cloud Run', 'GitHub Enterprise', 'Supabase'],
      payoutMethods: [
        { id: 'PAY-1', type: 'Bank Account (ACH / Wire)', details: 'Chase Business Checking ****4892', isDefault: true, status: 'Verified' },
        { id: 'PAY-2', type: 'Stripe Connect Direct', details: 'acct_1M89X20491823901', isDefault: false, status: 'Verified' },
        { id: 'PAY-3', type: 'PayPal Business', details: 'emir.p.win@gmail.com', isDefault: false, status: 'Verified' },
      ],
      pendingPayout: 14250.00,
      completedPayouts: 68400.00,
      approvalHistoryCount: 142
    },
    {
      id: 'SUPER-002',
      email: 'emirperla96@gmail.com',
      name: 'Emir Perla',
      title: 'Managing Director & Executive Super Admin',
      role: 'SUPER_ADMIN',
      permissions: '*',
      isPermanent: true,
      status: 'Active & Protected',
      country: 'United States',
      timezone: 'America/Los_Angeles (UTC-7)',
      language: 'English (US)',
      twoFactorEnabled: true,
      twoFactorMethod: 'Google Authenticator + WebAuthn',
      apiKeysCount: 6,
      connectedServices: ['Wise Enterprise', 'Binance Pay', 'Coinbase Commerce', 'Vercel Enterprise'],
      payoutMethods: [
        { id: 'PAY-4', type: 'Wise Business Multi-Currency', details: 'IBAN US89WISE9021039102', isDefault: true, status: 'Verified' },
        { id: 'PAY-5', type: 'Coinbase Commerce Crypto', details: '0x71C...489F (USDC / USDT)', isDefault: false, status: 'Verified' },
        { id: 'PAY-6', type: 'Binance Pay Corporate', details: 'BINANCE-ID #90481029', isDefault: false, status: 'Verified' },
      ],
      pendingPayout: 18600.00,
      completedPayouts: 58100.00,
      approvalHistoryCount: 189
    }
  ];

  // Business Revenue Stats
  const revenueMetrics = {
    grossRevenue: 184250.00,
    netRevenue: 168900.00,
    mrr: 42850.00,
    arr: 514200.00,
    subscriptions: 124500.00,
    oneTimePayments: 44400.00,
    refunds: 1250.00,
    taxes: 14100.00,
    pendingRevenue: 32850.00,
    completedPayouts: 126500.00,
    netProfit: 142300.00,
    profitMargin: '84.3%',
    customerLtv: 4850.00
  };

  // Approval Workflow State (1 of 2 Super Admin Rule)
  const [approvalItems, setApprovalItems] = useState([
    {
      id: 'APP-901',
      action: 'Public Production Cloud Run Deployment (v2.4.0)',
      project: 'ACOS Enterprise Core',
      requestedBy: 'DevOps Engineer (Worker #14)',
      requestedAt: '2026-07-29 18:30',
      riskLevel: 'High',
      requiredApprovals: 1,
      currentApprovals: 0,
      approvedBy: [],
      status: 'Pending Super Admin Sign-Off'
    },
    {
      id: 'APP-902',
      action: 'Subscription Pricing Tier Update (Pro $29.99 -> $34.99/mo)',
      project: 'ACOS Billing Engine',
      requestedBy: 'Pricing Strategist (Worker #37)',
      requestedAt: '2026-07-29 17:15',
      riskLevel: 'Medium',
      requiredApprovals: 1,
      currentApprovals: 1,
      approvedBy: ['emir.p.win@gmail.com'],
      status: 'Approved & Executed'
    },
    {
      id: 'APP-903',
      action: 'Withdrawal Transfer $25,000 to Chase Business Checking',
      project: 'Treasury & Payouts',
      requestedBy: 'Finance Analyst (Worker #35)',
      requestedAt: '2026-07-29 16:00',
      riskLevel: 'Critical',
      requiredApprovals: 1,
      currentApprovals: 1,
      approvedBy: ['emirperla96@gmail.com'],
      status: 'Approved & Executed'
    },
    {
      id: 'APP-904',
      action: 'Permanent Deletion of Legacy Staging Database (db_stage_v1)',
      project: 'Database Engine',
      requestedBy: 'Database Engineer (Worker #13)',
      requestedAt: '2026-07-29 14:45',
      riskLevel: 'High',
      requiredApprovals: 1,
      currentApprovals: 0,
      approvedBy: [],
      status: 'Pending Super Admin Sign-Off'
    }
  ]);

  // Immutable Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'LOG-8801',
      approvalId: 'APP-903',
      action: 'Withdrawal Transfer $25,000 to Chase Business Checking',
      project: 'Treasury & Payouts',
      timestamp: '2026-07-29 16:02:14',
      approvingAdmin: 'emirperla96@gmail.com',
      reason: 'Monthly executive treasury disbursement approved via 1/2 Super Admin rule',
      status: 'SUCCESS'
    },
    {
      id: 'LOG-8802',
      approvalId: 'APP-902',
      action: 'Subscription Pricing Tier Update (Pro $29.99 -> $34.99/mo)',
      project: 'ACOS Billing Engine',
      timestamp: '2026-07-29 17:18:05',
      approvingAdmin: 'emir.p.win@gmail.com',
      reason: 'Pricing adjustment approved based on Q3 margin analysis',
      status: 'SUCCESS'
    },
    {
      id: 'LOG-8803',
      approvalId: 'SYSTEM-INIT',
      action: 'Permanent Super Admin Governance Bootstrapped',
      project: 'ACOS Security Policy',
      timestamp: '2026-07-29 00:00:00',
      approvingAdmin: 'emir.p.win@gmail.com & emirperla96@gmail.com',
      reason: 'Root privilege lock enabled for dual Super Admin accounts',
      status: 'PROTECTED'
    }
  ]);

  // Payout Transaction History
  const payoutHistory = [
    { id: 'TX-701', date: '2026-07-28', method: 'Chase Business Checking (ACH)', amount: '$25,000.00', recipient: 'emir.p.win@gmail.com', status: 'Completed', ref: 'ACH-9018241' },
    { id: 'TX-702', date: '2026-07-25', method: 'Wise Business (USD/EUR)', amount: '$18,500.00', recipient: 'emirperla96@gmail.com', status: 'Completed', ref: 'WISE-881920' },
    { id: 'TX-703', date: '2026-07-20', method: 'Stripe Connect Direct', amount: '$32,000.00', recipient: 'emir.p.win@gmail.com', status: 'Completed', ref: 'STRIPE-771829' },
    { id: 'TX-704', date: '2026-07-15', method: 'Coinbase Commerce (USDC)', amount: '$15,000.00', recipient: 'emirperla96@gmail.com', status: 'Completed', ref: 'CRYPTO-0x90a' },
  ];

  // Invitations State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('DEVELOPER');
  const [invitations, setInvitations] = useState([
    { id: 'INV-101', email: 'developer@acos.io', role: 'DEVELOPER', status: 'Pending', invitedAt: '2026-07-29 17:30', expiresAt: '7 days left' },
    { id: 'INV-102', email: 'client.admin@partner.com', role: 'CLIENT', status: 'Accepted', invitedAt: '2026-07-28 14:10', expiresAt: 'Accepted' },
    { id: 'INV-103', email: 'sec.auditor@cyber.org', role: 'ANALYST', status: 'Expired', invitedAt: '2026-07-15 09:00', expiresAt: 'Expired' },
  ]);

  const rbacPermissions = [
    { key: 'users.*', description: 'User management & permissions override', scope: 'Full User Control' },
    { key: 'roles.*', description: 'Role creation & RBAC hierarchy rules', scope: 'Security Management' },
    { key: 'projects.*', description: 'Autonomous SaaS projects & code repo access', scope: 'Project Engine' },
    { key: 'agents.*', description: '50 AI Workers & 200 Micro-Agents dispatch', scope: 'AI Orchestration' },
    { key: 'billing.*', description: 'Subscription plans, pricing & tax rules', scope: 'Finance' },
    { key: 'subscriptions.*', description: 'Customer portal & plan upgrades/downgrades', scope: 'Finance' },
    { key: 'payments.*', description: 'Stripe/PayPal gateways & payout authority', scope: 'Commerce' },
    { key: 'storage.*', description: 'Vector memory storage & persistent artifacts', scope: 'Infrastructure' },
    { key: 'database.*', description: 'PostgreSQL migrations & schema updates', scope: 'Database' },
    { key: 'analytics.*', description: 'MRR/ARR reporting & growth telemetry', scope: 'Analytics' },
    { key: 'automation.*', description: 'Autonomous pipeline trigger & SOP execution', scope: 'Automation' },
    { key: 'logs.*', description: 'Audit logs & telemetry stream inspection', scope: 'Audit' },
    { key: 'security.*', description: '2FA enforcement, rate limits & zero-trust rules', scope: 'Security' },
    { key: 'deployment.*', description: 'Cloud Run deployment & container management', scope: 'DevOps' },
    { key: 'api.*', description: 'Gemini API keys & external webhooks config', scope: 'Integrations' },
  ];

  // Handle Approval Action (1 of 2 Super Admin Rule)
  const handleApproveAction = (itemId, adminEmail) => {
    setApprovalItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedApprovedBy = [...item.approvedBy, adminEmail];
          const newCurrentApprovals = updatedApprovedBy.length;
          const isDone = newCurrentApprovals >= item.requiredApprovals;

          // Add to audit log
          const newLog = {
            id: `LOG-${Math.floor(8000 + Math.random() * 1000)}`,
            approvalId: item.id,
            action: item.action,
            project: item.project,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            approvingAdmin: adminEmail,
            reason: `Approved via 1/2 Super Admin Rule by ${adminEmail}`,
            status: 'APPROVED & EXECUTED'
          };
          setAuditLogs([newLog, ...auditLogs]);

          return {
            ...item,
            currentApprovals: newCurrentApprovals,
            approvedBy: updatedApprovedBy,
            status: isDone ? 'Approved & Executed' : 'Pending 2nd Approval'
          };
        }
        return item;
      })
    );
  };

  const handleRejectAction = (itemId, adminEmail) => {
    setApprovalItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLog = {
            id: `LOG-${Math.floor(8000 + Math.random() * 1000)}`,
            approvalId: item.id,
            action: item.action,
            project: item.project,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            approvingAdmin: adminEmail,
            reason: `Vetoed / Rejected by Super Admin ${adminEmail}`,
            status: 'REJECTED'
          };
          setAuditLogs([newLog, ...auditLogs]);

          return {
            ...item,
            status: `Rejected by ${adminEmail}`
          };
        }
        return item;
      })
    );
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newInvite = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Pending',
      invitedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      expiresAt: '7 days left',
    };

    setInvitations([newInvite, ...invitations]);
    setInviteEmail('');
    alert(`Email invitation link dispatched to ${newInvite.email} with role [${newInvite.role}]!`);
  };

  const selectedAdminObj = superAdmins.find(a => a.email === activeAdminProfile) || superAdmins[0];

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* SUPER ADMIN GOVERNANCE HEADER CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 border border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-full text-xs font-mono font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              PERMANENT DUAL SUPER ADMIN GOVERNANCE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/90 border border-indigo-700/60 rounded-full text-indigo-300 text-xs font-mono font-bold">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              1 of 2 Approval Rule Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-sans tracking-tight">
            Super Admin Governance & Payout System
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-4xl">
            Two permanent Super Admin accounts (<code className="text-amber-300 font-mono font-bold">emir.p.win@gmail.com</code> &amp; <code className="text-amber-300 font-mono font-bold">emirperla96@gmail.com</code>) possess unrestricted root privileges (<code className="text-cyan-400 font-mono font-bold">*</code>) across all system resources. Neither account can be deleted, suspended, or downgraded by any user or AI worker. Critical operations follow the 1-of-2 approval threshold with immutable audit logs.
          </p>

          {/* Sub Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveGovernanceSection('super-admins')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeGovernanceSection === 'super-admins'
                  ? 'bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Super Admin Profiles (2)
            </button>
            <button
              onClick={() => setActiveGovernanceSection('payouts')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeGovernanceSection === 'payouts'
                  ? 'bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Payouts & Withdrawal
            </button>
            <button
              onClick={() => setActiveGovernanceSection('revenue')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeGovernanceSection === 'revenue'
                  ? 'bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Revenue & Profit Dashboard
            </button>
            <button
              onClick={() => setActiveGovernanceSection('approvals')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeGovernanceSection === 'approvals'
                  ? 'bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              1/2 Approval Workflow ({approvalItems.filter(a => a.status.includes('Pending')).length})
            </button>
            <button
              onClick={() => setActiveGovernanceSection('audit')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeGovernanceSection === 'audit'
                  ? 'bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Immutable Audit Logs
            </button>
            <button
              onClick={() => setActiveGovernanceSection('rbac')}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                activeGovernanceSection === 'rbac'
                  ? 'bg-amber-600 text-slate-950 font-extrabold border-amber-400 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              RBAC Matrix & Invites
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: SUPER ADMIN PROFILES */}
      {activeGovernanceSection === 'super-admins' && (
        <div className="space-y-6">
          {/* Dual Super Admin Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {superAdmins.map((admin) => (
              <div
                key={admin.id}
                onClick={() => setActiveAdminProfile(admin.email)}
                className={`bg-slate-900 border rounded-2xl p-6 shadow-xl cursor-pointer transition-all space-y-4 ${
                  activeAdminProfile === admin.email
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-lg">
                      EP
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                        {admin.name}
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                      </h3>
                      <p className="text-xs text-amber-300 font-mono font-bold">{admin.email}</p>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">{admin.title}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-mono font-extrabold rounded-lg">
                    PERMANENT OWNER
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Role &amp; Permissions</span>
                    <span className="text-cyan-400 font-bold">{admin.role} (*)</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">2FA Security</span>
                    <span className="text-emerald-400 font-bold">Enabled (YubiKey)</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Pending Payout</span>
                    <span className="text-amber-400 font-bold">${admin.pendingPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Approvals Signed</span>
                    <span className="text-indigo-400 font-bold">{admin.approvalHistoryCount} Actions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Profile Full Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  Super Admin Profile Configuration: {selectedAdminObj.email}
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Manage personal parameters, security tokens, payout routing, 2FA credentials, and connected enterprise APIs.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-lg">
                IMMUTABLE SUPER ADMIN
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              {/* Profile Details */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
                  <Users className="w-4 h-4" /> Personal Profile
                </h4>
                <div className="space-y-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Display Name</span>
                    <strong className="text-slate-100">{selectedAdminObj.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Primary Email</span>
                    <strong className="text-amber-300">{selectedAdminObj.email}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Country &amp; Timezone</span>
                    <span className="text-slate-200">{selectedAdminObj.country} ({selectedAdminObj.timezone})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Preferred Language</span>
                    <span className="text-slate-200">{selectedAdminObj.language}</span>
                  </div>
                </div>
              </div>

              {/* Security & 2FA */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Security &amp; 2FA Settings
                </h4>
                <div className="space-y-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Two-Factor Authentication</span>
                    <strong className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedAdminObj.twoFactorMethod}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Active API Keys</span>
                    <span className="text-cyan-300 font-bold">{selectedAdminObj.apiKeysCount} Live Enterprise Keys</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Account Status</span>
                    <span className="text-emerald-400 font-bold">PROTECTED &amp; UNTOUCHABLE</span>
                  </div>
                </div>
              </div>

              {/* Connected Services */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Connected Enterprise APIs
                </h4>
                <div className="space-y-1.5">
                  {selectedAdminObj.connectedServices.map((srv, idx) => (
                    <div key={idx} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center justify-between text-[11px]">
                      <span>{srv}</span>
                      <span className="text-[9px] text-emerald-400 font-bold">CONNECTED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PAYOUTS & WITHDRAWAL SETTINGS */}
      {activeGovernanceSection === 'payouts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                Super Admin Payout &amp; Withdrawal Console
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Connect and manage payout methods (Bank Account, PayPal, Wise, Stripe Connect, Binance Pay, Coinbase Commerce). All credentials stored using AES-256 GCM encrypted secret vaults.
              </p>
            </div>
            <button
              onClick={() => alert('Connect Payout Provider modal initialized. Select Bank, Wise, PayPal or Crypto.')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Connect Payout Method
            </button>
          </div>

          {/* Connected Payout Methods Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-300">Configured Payout Methods ({selectedAdminObj.email})</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedAdminObj.payoutMethods.map((pm) => (
                <div key={pm.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 relative">
                  {pm.isDefault && (
                    <span className="absolute top-3 right-3 text-[9px] bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                      DEFAULT
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">{pm.type}</span>
                  <div className="text-sm font-bold text-slate-100">{pm.details}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {pm.status}
                    </span>
                    <button className="text-slate-400 hover:text-rose-400 transition-colors">Disconnect</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payout History & Download Reports */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-300">Super Admin Completed Payout History</h4>
              <button
                onClick={() => alert('Downloading official PDF & CSV Payout Settlement Report...')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Download className="w-3.5 h-3.5" /> Download Payout Report (PDF/CSV)
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-3">Tx ID</th>
                    <th className="p-3">Settlement Date</th>
                    <th className="p-3">Payout Method</th>
                    <th className="p-3">Super Admin Recipient</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {payoutHistory.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-bold text-slate-200">{tx.id}</td>
                      <td className="p-3 text-slate-400">{tx.date}</td>
                      <td className="p-3 text-slate-200">{tx.method}</td>
                      <td className="p-3 text-amber-300 font-bold">{tx.recipient}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{tx.amount}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: REVENUE & PROFIT DASHBOARD */}
      {activeGovernanceSection === 'revenue' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Executive Business Revenue &amp; Profit Engine
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Real-time financial telemetry tracking Gross Revenue, Net Profit, MRR, ARR, Subscriptions, Refunds, and Taxes.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-xl">
              Net Profit Margin: {revenueMetrics.profitMargin}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Gross Revenue</span>
              <span className="text-xl font-extrabold text-slate-100">${revenueMetrics.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Net Revenue</span>
              <span className="text-xl font-extrabold text-emerald-400">${revenueMetrics.netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Monthly Recurring (MRR)</span>
              <span className="text-xl font-extrabold text-cyan-400">${revenueMetrics.mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Annual Run Rate (ARR)</span>
              <span className="text-xl font-extrabold text-indigo-400">${revenueMetrics.arr.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Subscription Revenue</span>
              <span className="text-lg font-bold text-slate-200">${revenueMetrics.subscriptions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">One-Time Payments</span>
              <span className="text-lg font-bold text-slate-200">${revenueMetrics.oneTimePayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Pending Revenue</span>
              <span className="text-lg font-bold text-amber-400">${revenueMetrics.pendingRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Completed Payouts</span>
              <span className="text-lg font-bold text-emerald-400">${revenueMetrics.completedPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: 1 OF 2 APPROVAL WORKFLOW */}
      {activeGovernanceSection === 'approvals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                1-of-2 Super Admin Protected Approval Center
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Protected actions (Deployments, Pricing adjustments, DB deletions, Transfers) require sign-off from at least 1 of 2 Super Admins (<code className="text-amber-300">emir.p.win@gmail.com</code> or <code className="text-amber-300">emirperla96@gmail.com</code>).
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1.5 rounded-xl">
              Rule: 1/2 Super Admins Required
            </span>
          </div>

          <div className="space-y-4">
            {approvalItems.map((item) => (
              <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{item.id}: {item.action}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                      item.riskLevel === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {item.riskLevel} Risk
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                    item.status.includes('Approved') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                  <div>Project: <strong className="text-slate-200">{item.project}</strong> | Requested By: <span className="text-cyan-300">{item.requestedBy}</span> ({item.requestedAt})</div>

                  {item.status.includes('Pending') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveAction(item.id, 'emir.p.win@gmail.com')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-xs transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve as emir.p.win
                      </button>
                      <button
                        onClick={() => handleApproveAction(item.id, 'emirperla96@gmail.com')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-xs transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve as emirperla96
                      </button>
                      <button
                        onClick={() => handleRejectAction(item.id, 'emir.p.win@gmail.com')}
                        className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs transition-all"
                      >
                        Veto / Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: IMMUTABLE AUDIT LOGS */}
      {activeGovernanceSection === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Immutable Governance &amp; Approval Audit Ledger
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Every Super Admin approval, project deletion, financial payout, and policy update is permanently logged. Logs cannot be edited or erased.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-lg font-bold">
              Append-Only Ledger Active
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Details</th>
                  <th className="p-3">Project / Domain</th>
                  <th className="p-3">Approving Super Admin</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-slate-200">{log.id}</td>
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 text-slate-100 font-bold">{log.action}</td>
                    <td className="p-3 text-cyan-300">{log.project}</td>
                    <td className="p-3 text-amber-300 font-bold">{log.approvingAdmin}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: RBAC MATRIX & EMAIL INVITATIONS */}
      {activeGovernanceSection === 'rbac' && (
        <div className="space-y-6">
          {/* Email Invitation System */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Email Invitation System
                </h3>
                <p className="text-xs text-slate-400">Invite new team members, developers, clients, or organizations with granular role selection.</p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                Secure Invitation Tokens
              </span>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Recipient Email Address:</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g., developer@company.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Assigned Role:</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (*)</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="ANALYST">ANALYST</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Invitation
                </button>
              </div>
            </form>

            {/* Active Invitations */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-300">Active Invitation Tracking</h4>
              <div className="overflow-x-auto border border-slate-800 rounded-xl font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="p-3">Invite ID</th>
                      <th className="p-3">Recipient Email</th>
                      <th className="p-3">Assigned Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Invited At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-950/50">
                        <td className="p-3 font-bold text-slate-200">{inv.id}</td>
                        <td className="p-3 text-slate-100">{inv.email}</td>
                        <td className="p-3 font-bold text-indigo-400">{inv.role}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'Accepted'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{inv.invitedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RBAC Permission Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  Role-Based Access Control (RBAC) Permission Matrix
                </h3>
                <p className="text-xs text-slate-400 font-sans">Granular permission keys governing API endpoints, storage, agents, billing, and database layers.</p>
              </div>
              <span className="text-xs text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-lg">
                RBAC Engine v1.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {rbacPermissions.map((perm) => (
                <div key={perm.key} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">{perm.key}</span>
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {perm.scope}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans">{perm.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
