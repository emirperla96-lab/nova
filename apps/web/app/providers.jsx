'use client';

import React from 'react';
import { AutonomousAiCompanyProvider } from './context/AutonomousAiCompanyContext';

export default function Providers({ children }) {
  return (
    <AutonomousAiCompanyProvider>
      {children}
    </AutonomousAiCompanyProvider>
  );
}
