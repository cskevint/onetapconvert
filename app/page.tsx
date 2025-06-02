'use client';

import { useState, useEffect } from 'react';
import CurrencyConverter from './components/CurrencyConverter';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <CurrencyConverter />
      </div>
    </main>
  );
}
