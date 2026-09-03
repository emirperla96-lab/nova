import React from 'react';
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'AtlantidaOS v1.0 — CEO Super Agent & 200 Micro-Agents AI Operating System',
  description: 'Autonomous AI Operating System & SaaS Platform with 200 Micro-Agents, WebGPU Local AI, Cloud SQL, Google Sheets & Tasks, Commerce, and Interactive Terminal CLI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
