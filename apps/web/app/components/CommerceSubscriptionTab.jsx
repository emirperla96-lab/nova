'use client';

import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, AlertCircle, RefreshCw, FileText, Download, ShieldCheck, Tag, Zap, ChevronRight, Layers, ArrowUpRight, BarChart3, HelpCircle, Terminal, Activity } from 'lucide-react';

export default function CommerceSubscriptionTab() {
  const [activePlan, setActivePlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedGateway, setSelectedGateway] = useState('stripe');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('Active');
  const [isPaused, setIsPaused] = useState(false);

  // Stripe Webhooks Real-time Event Stream Simulation State
  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 'evt_1M001',
      type: 'customer.subscription.updated',
      plan: 'Pro Membership',
      status: '200 OK',
      timestamp: '2026-08-01 08:30:12',
      payload: { id: 'sub_90244', status: 'active', current_period_end: 1785500000 }
    },
    {
      id: 'evt_1M002',
      type: 'invoice.payment_succeeded',
      plan: 'Pro Membership',
      status: '200 OK',
      timestamp: '2026-08-01 08:30:15',
      payload: { amount_paid: 2999, currency: 'usd', paid: true }
    }
  ]);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  const handleTriggerStripeWebhook = (targetPlanId) => {
    setIsSimulatingWebhook(true);
    setTimeout(() => {
      const planObj = plans.find(p => p.id === targetPlanId) || plans[0];
      const newLog = {
        id: `evt_${Date.now().toString().slice(-5)}`,
        type: 'customer.subscription.updated',
        plan: planObj.name,
        status: '200 OK (RBAC Tier Upgraded)',
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        payload: {
          id: `sub_${Math.floor(Math.random() * 90000 + 10000)}`,
          customer: 'cus_emir_super_admin',
          tier: targetPlanId,
          status: 'active'
        }
      };
      setWebhookLogs(prev => [newLog, ...prev]);
      setActivePlan(targetPlanId);
      setSubscriptionStatus('Active (Upgraded via Stripe Webhook)');
      setIsSimulatingWebhook(false);
    }, 600);
  };

  const plans = [
    {
      id: 'pro',
      name: 'Pro Membership',
      priceMonthly: 29.99,
      priceYearly: 299.90,
      description: 'Full autonomous single-agent & pipeline access for modern SaaS builders.',
      features: [
        'Stripe & PayPal Multi-Gateway Billing',
        'Autonomous 5-Agent Executive Team',
        '200 Micro-Agents Access',
        'Standard Vector Memory & SOPs',
        'PDF Invoice Generation & Taxes',
        'Community Support',
      ],
      badge: 'POPULAR',
    },
    {
      id: 'team',
      name: 'Team Plan',
      priceMonthly: 99.99,
      priceYearly: 999.90,
      description: 'Collaborative AI company environment with multi-user RBAC & team workspaces.',
      features: [
        'Everything in Pro Membership',
        'Up to 10 Team Members & Roles',
        'Bulk Email Invitation System',
        'Custom Domain & Webhook Sync',
        'Advanced Revenue & MRR Analytics',
        '24/7 Priority Support SLA',
      ],
      badge: 'GROWTH',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      priceMonthly: 299.99,
      priceYearly: 2999.90,
      description: 'Dedicated isolated infrastructure, zero-trust security & custom AI model integrations.',
      features: [
        'Everything in Team Plan',
        'Unlimited Super Admin & RBAC Roles',
        'Dedicated Cloud Run Containers',
        'Custom LLM Fine-tuning & Embeddings',
        'Automated Tax & Chargeback Protection',
        'Dedicated AI Engineer Account Manager',
      ],
      badge: 'UNLIMITED',
    },
  ];

  const paymentGateways = [
    { id: 'stripe', name: 'Stripe', logo: '💳', status: 'Active (Default)' },
    { id: 'paypal', name: 'PayPal', logo: '🅿️', status: 'Connected' },
    { id: 'apple', name: 'Apple Pay', logo: '🍏', status: 'Supported' },
    { id: 'google', name: 'Google Pay', logo: '🔍', status: 'Supported' },
    { id: 'klarna', name: 'Klarna (Pay in 4)', logo: '🛍️', status: 'Active' },
    { id: 'sepa', name: 'SEPA Direct Debit', logo: '🏦', status: 'Active' },
    { id: 'ach', name: 'ACH Wire Transfer', logo: '🏛️', status: 'Active' },
  ];

  const invoices = [
    { id: 'INV-2026-001', date: '2026-07-01', plan: 'Pro Membership', amount: '$29.99', tax: '$5.70 (VAT 19%)', status: 'Paid', gateway: 'Stripe' },
    { id: 'INV-2026-002', date: '2026-06-01', plan: 'Pro Membership', amount: '$29.99', tax: '$5.70 (VAT 19%)', status: 'Paid', gateway: 'Stripe' },
    { id: 'INV-2026-003', date: '2026-05-01', plan: 'Pro Membership', amount: '$29.99', tax: '$5.70 (VAT 19%)', status: 'Paid', gateway: 'PayPal' },
  ];

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'ACOS2026' || couponCode.trim().toUpperCase() === 'EMIR') {
      setAppliedDiscount(20); // 20% off
    } else if (couponCode.trim().toUpperCase() === 'FREE100') {
      setAppliedDiscount(100);
    } else {
      alert('Invalid coupon code. Try "ACOS2026" for 20% off!');
    }
  };

  const handleDownloadInvoice = (inv) => {
    const text = `==================================================
ACOS SUPREME SAAS INVOICE - ${inv.id}
==================================================
Customer: emirperla96@gmail.com (SUPER_ADMIN)
Date: ${inv.date}
Plan: ${inv.plan}
Gateway: ${inv.gateway}
Subtotal: ${inv.amount}
Tax Breakdown: ${inv.tax}
Total Paid: ${inv.amount}
Status: ${inv.status} (Verified PCI-DSS Tokenized)

Thank you for building with ACOS Supreme!
==================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessCheckout = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setPaymentSuccess(false);
      setSubscriptionStatus('Active');
      setIsPaused(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Top Banner Analytics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
              Payment & Commerce Infrastructure
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              SaaS Subscriptions, Multi-Gateway & Commerce Engine
            </h2>
          </div>

          {/* Subscription State Pill */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Current Plan Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              subscriptionStatus === 'Active' && !isPaused
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : isPaused
                ? 'bg-amber-950 border-amber-700 text-amber-300'
                : 'bg-rose-950 border-rose-700 text-rose-300'
            }`}>
              ● {isPaused ? 'Paused' : subscriptionStatus}
            </span>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Monthly Recurring (MRR)</span>
            <span className="text-emerald-400 font-extrabold text-base">$42,850.00</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Annual Run Rate (ARR)</span>
            <span className="text-cyan-400 font-extrabold text-base">$514,200.00</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Customer LTV</span>
            <span className="text-indigo-400 font-extrabold text-base">$850.00</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Acquisition Cost (CAC)</span>
            <span className="text-purple-400 font-extrabold text-base">$120.00</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Monthly Churn</span>
            <span className="text-teal-400 font-extrabold text-base">1.4%</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">PCI Compliance</span>
            <span className="text-emerald-400 font-extrabold text-base">PCI-DSS L1</span>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              SaaS Subscription Plans
            </h3>
            <p className="text-xs text-slate-400">Choose or manage your ACOS recurring subscription tier.</p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto font-mono text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yearly Billing
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded">
                2 Months Free
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isSelected = activePlan === plan.id;
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={plan.id}
                className={`bg-slate-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative transition-all ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-100">{plan.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-3xl font-extrabold text-slate-100">${price.toFixed(2)}</span>
                    <span className="text-xs text-slate-400">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Included Features:</span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => {
                      setActivePlan(plan.id);
                      setShowCheckoutModal(true);
                    }}
                    className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Manage / Upgrade Plan' : 'Select Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Payment Gateway & Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods & Gateways */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Supported Payment Methods & Failover Engine
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Automatic Gateway Failover Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {paymentGateways.map((gw) => (
              <div
                key={gw.id}
                onClick={() => setSelectedGateway(gw.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedGateway === gw.id
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{gw.logo}</span>
                  <span className="font-bold">{gw.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{gw.status}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PCI-DSS Tokenized Storage</span>
            <button
              onClick={() => alert('Payment Gateways re-synchronized cleanly!')}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Sync Payment Providers
            </button>
          </div>
        </div>

        {/* Invoice & PDF Download Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Billing History & Tax PDF Invoices
            </h3>
            <span className="text-xs font-mono text-slate-400">VAT & GST Tax Compliant</span>
          </div>

          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between font-mono text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{inv.id}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    {inv.date} • {inv.plan} ({inv.gateway})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-100">{inv.amount}</span>
                  <button
                    onClick={() => handleDownloadInvoice(inv)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition-colors"
                    title="Download Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stripe Webhook Event Stream & Auto-Upgrade Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Real-Time Stripe Webhook Engine &amp; RBAC Upgrade Simulation
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Simulacija pozadinskih Stripe događaja koji nadograđuju nivo pretplate i RBAC dozvole u realnom vremenu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerStripeWebhook('team')}
              disabled={isSimulatingWebhook}
              className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 font-bold rounded-xl transition-all"
            >
              Webhook: Upgrade to Team
            </button>
            <button
              onClick={() => handleTriggerStripeWebhook('enterprise')}
              disabled={isSimulatingWebhook}
              className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-300 font-bold rounded-xl transition-all"
            >
              Webhook: Upgrade to Enterprise
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {webhookLogs.map((log) => (
            <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-cyan-300">{log.type}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {log.plan}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span className="text-emerald-400 font-bold">{log.status}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal Simulator */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                ACOS Commerce Checkout Simulator
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono font-bold"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3 font-mono">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-emerald-300">Payment Processed Successfully!</h4>
                <p className="text-xs text-slate-400 font-sans">
                  Your subscription to ACOS Pro Membership has been activated with PCI-DSS tokenization.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Selected Plan:</span>
                    <strong className="text-slate-100 uppercase">{activePlan} ({billingCycle})</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Gateway Provider:</span>
                    <strong className="text-cyan-400 uppercase">{selectedGateway}</strong>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount Applied:</span>
                      <span>-{appliedDiscount}% OFF</span>
                    </div>
                  )}
                </div>

                {/* Coupon Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (e.g., ACOS2026)..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-mono font-bold"
                  >
                    Apply
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessCheckout}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-mono text-xs font-extrabold rounded-xl shadow-lg transition-all"
                  >
                    Confirm & Complete Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
