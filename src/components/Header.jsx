import React from 'react';
import { CreditCard, Menu } from 'lucide-react';

export default function Header({ onOpenSidebar }) {
  return (
    <header className="lg:hidden glass sticky top-0 z-30 flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Manazer</span>
      </div>
      <button 
        onClick={onOpenSidebar}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </header>
  );
}
