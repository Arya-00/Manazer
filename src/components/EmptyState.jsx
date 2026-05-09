import { motion } from 'framer-motion';
import { CreditCard, Plus } from 'lucide-react';

export default function EmptyState({ onAdd }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
        <div className="relative w-full h-full glass rounded-3xl flex items-center justify-center border-white/20">
          <CreditCard className="w-16 h-16 text-white/50" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">No Cards Saved Yet</h3>
      <p className="text-white/60 max-w-md mb-8">
        Add your first credit or debit card to securely store it in your Manazer vault. All data is encrypted and stored locally.
      </p>
      
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
      >
        <Plus className="w-5 h-5" />
        Add New Card
      </button>
    </motion.div>
  );
}
