import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { gradients } from '../data/gradients';
import GradientPicker from './GradientPicker';
import { formatCardNumber, formatExpiry } from '../utils/formatters';
// A simplified preview component used only in the modal

// A simplified preview component used only in the modal
function CreditCardPreview({ card }) {
  const gradient = gradients.find(g => g.id === card.gradientId)?.css || gradients[0].css;
  return (
    <div className={`relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl shadow-lg overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] border border-white/20" />
      <div className="relative h-full flex flex-col justify-between p-6 z-10 text-white">
        <span className="text-sm font-bold tracking-wider uppercase opacity-90">{card.bankName || 'Bank Name'}</span>
        <div className="w-10 h-7 bg-yellow-100/30 rounded-md backdrop-blur-sm border border-yellow-200/40" />
        <div className="text-xl sm:text-2xl font-mono tracking-widest">
          {card.cardNumber ? formatCardNumber(card.cardNumber) : '**** **** **** ****'}
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest opacity-70">Card Holder</span>
            <span className="text-sm font-medium tracking-wide uppercase truncate max-w-[150px]">
              {card.cardholderName || 'NAME SURNAME'}
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest opacity-70">Expires</span>
              <span className="text-sm font-medium tracking-wider font-mono">
                {card.expiryDate ? formatExpiry(card.expiryDate) : 'MM/YY'}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest opacity-70">CVV</span>
              <span className="text-sm font-medium tracking-wider font-mono">
                {card.cvv ? card.cvv.replace(/./g, '*') : '***'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultCardState = {
  bankName: '',
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  notes: '',
  gradientId: gradients[0].id,
  favorite: false
};

export default function AddCardModal({ isOpen, onClose, editCardData = null }) {
  const { addCard, updateCard, addToast } = useAppContext();
  const [formData, setFormData] = useState(defaultCardState);

  useEffect(() => {
    if (isOpen) {
      setFormData(editCardData || defaultCardState);
    }
  }, [isOpen, editCardData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value).substring(0, 19);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiry(value).substring(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cardNumber || !formData.expiryDate) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    
    if (editCardData) {
      updateCard(editCardData.id, formData);
      addToast('Card updated successfully');
    } else {
      addCard(formData);
      addToast('Card added successfully');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass-panel rounded-2xl border-white/10 shadow-2xl shadow-black/50 flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left side: Preview */}
          <div className="w-full md:w-5/12 bg-black/20 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 w-full text-left hidden md:block">
              {editCardData ? 'Edit Card' : 'Add New Card'}
            </h3>
            <CreditCardPreview card={formData} />
          </div>

          {/* Right side: Form */}
          <div className="w-full md:w-7/12 p-6 overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold text-white mb-6 md:hidden">
              {editCardData ? 'Edit Card' : 'Add New Card'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80">Bank Name</label>
                  <input
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. Chase, Monzo"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80">Cardholder Name</label>
                  <input
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    placeholder="JOHN DOE"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Card Number *</label>
                <input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80">Expiry Date *</label>
                  <input
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80">CVV</label>
                  <input
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              <GradientPicker 
                selectedId={formData.gradientId} 
                onChange={(id) => setFormData(prev => ({ ...prev, gradientId: id }))} 
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Subscription card, Netflix, etc."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editCardData ? 'Save Changes' : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
