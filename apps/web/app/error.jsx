'use client';

import React, { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('AtlantidaOS Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-xl border border-red-900/50 bg-slate-900/80 shadow-2xl">
        <h2 className="text-2xl font-bold text-rose-400 mb-2">Runtime Anomaly Detected</h2>
        <p className="text-slate-400 text-sm mb-6">
          An unexpected exception occurred during execution.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Re-initialize Workspace
        </button>
      </div>
    </div>
  );
}
