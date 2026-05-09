import { createContext, useCallback, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cards, setCards] = useLocalStorage('manazer-cards', []);
  const [toasts, setToasts] = useState([]);

  const addCard = (card) => {
    setCards((prev) => [...prev, { ...card, id: Date.now().toString() }]);
  };

  const updateCard = (id, updatedData) => {
    setCards((prev) => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter(c => c.id !== id));
  };

  const toggleFavorite = (id) => {
    setCards((prev) => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const clearCards = () => setCards([]);

  const importCards = (importedCards) => {
    setCards(importedCards);
  };

  const reorderCards = (newCards) => {
    setCards(newCards);
  };

  const value = {
    cards,
    addCard,
    updateCard,
    deleteCard,
    toggleFavorite,
    toasts,
    addToast,
    clearCards,
    importCards,
    reorderCards
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
