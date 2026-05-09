import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import AddCardModal from './components/AddCardModal';
import CardGrid from './components/CardGrid';
import EmptyState from './components/EmptyState';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SettingsPanel from './components/SettingsPanel';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import { AppProvider, useAppContext } from './context/AppContext';

function DashboardContent({ currentView }) {
  const { cards, reorderCards } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCardData, setEditCardData] = useState(null);

  const filteredCards = useMemo(() => {
    let result = cards;
    
    if (currentView === 'favorites') {
      result = result.filter(c => c.favorite);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.bankName && c.bankName.toLowerCase().includes(q)) ||
        (c.cardholderName && c.cardholderName.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [cards, currentView, searchQuery]);

  const handleEdit = (card) => {
    setEditCardData(card);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditCardData(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {(currentView === 'dashboard' || currentView === 'favorites') && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-white capitalize">
              {currentView}
            </h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <button
                onClick={handleAdd}
                className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center transition-transform hover:scale-105 shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {cards.length === 0 && currentView === 'dashboard' ? (
            <EmptyState onAdd={handleAdd} />
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No cards found matching your criteria.</p>
            </div>
          ) : (
            <CardGrid 
              cards={filteredCards} 
              onEdit={handleEdit} 
              onReorder={currentView === 'dashboard' && !searchQuery.trim() ? reorderCards : undefined}
            />
          )}
        </>
      )}

      {currentView === 'settings' && (
        <>
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          <SettingsPanel />
        </>
      )}

      {currentView === 'about' && (
        <div className="max-w-2xl mx-auto glass p-8 rounded-2xl border-white/10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Manazer</h2>
          <p className="text-white/70 mb-6">
            A secure, local-first credit card vault with a beautiful glassmorphic design. 
            All data is stored directly in your browser's local storage and never sent to any server.
          </p>
          <div className="text-sm text-white/50">
            Version 1.0.0
          </div>
        </div>
      )}

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editCardData={editCardData} 
      />
    </div>
  );
}

function MainApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#0B0E14]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob bg-purple-600/30 w-[500px] h-[500px] top-[-100px] left-[-100px]" />
        <div className="blob bg-indigo-600/20 w-[600px] h-[600px] bottom-[-200px] right-[-100px] animation-delay-2000" />
        <div className="blob bg-emerald-600/10 w-[400px] h-[400px] top-[40%] left-[30%] animation-delay-4000" />
      </div>

      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} isScrolled={isScrolled} />
        
        <main 
          className="flex-1 overflow-y-auto p-4 pt-20 md:px-8 md:pb-8 md:pt-24 lg:p-10 custom-scrollbar"
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <DashboardContent currentView={currentView} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
