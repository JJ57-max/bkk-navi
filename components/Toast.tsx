// components/Toast.tsx
'use client';

import React from 'react';

interface ToastProps {
    message: string | null;
}

export default function Toast({ message }: ToastProps) {
    if (!message) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
            <div className="bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10">
                <span className="text-emerald-400">✨</span>
                <span>{message}</span>
            </div>
        </div>
    );
}