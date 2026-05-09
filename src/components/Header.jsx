import React from 'react';
import { CreditCard, Menu } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Header({ onOpenSidebar, isScrolled }) {
  return (
    <header className={cn(
      "lg:hidden absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 transition-all duration-300 border-b",
      isScrolled ? "glass border-white/10" : "border-transparent"
    )}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Manazer</span>
      </div>
      <button 
        onClick={onOpenSidebar}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors drop-shadow-md"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </header>
  );
}
