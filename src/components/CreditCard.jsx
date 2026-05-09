import { motion } from 'framer-motion';
import { Copy, Edit, Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { gradients } from '../data/gradients';
import { cn } from '../utils/cn';
import { formatCardNumber, formatExpiry, maskCardNumber } from '../utils/formatters';

export default function CreditCard({ card, onEdit }) {
  const { deleteCard, toggleFavorite, addToast } = useAppContext();
  const [showSensitive, setShowSensitive] = useState(false);

  const gradient = gradients.find(g => g.id === card.gradientId)?.css || gradients[0].css;

  const handleCopy = (e, text, fieldName) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    addToast(`${fieldName} copied`);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative group w-full aspect-[1.586/1] rounded-2xl perspective-1000"
    >
      <div className={cn("absolute inset-0 rounded-2xl shadow-xl shadow-black/40 overflow-hidden", gradient)}>
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] border border-white/20" />
        
        {/* Reflections */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between p-6 z-10 text-white">
          <div className="flex justify-between items-start">
            <span className="text-lg font-bold tracking-wider uppercase opacity-90">{card.bankName || 'Bank Name'}</span>
            
            <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSensitive(!showSensitive); }}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                title="Toggle visibility"
              >
                {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(card.id); }}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
              >
                <Star className={cn("w-4 h-4", card.favorite ? "fill-yellow-400 text-yellow-400" : "")} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteCard(card.id); addToast('Card deleted', 'info'); }}
                className="p-1.5 hover:bg-red-500/80 hover:text-white rounded-full transition-colors backdrop-blur-md text-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-12 h-8 bg-yellow-100/30 rounded-md backdrop-blur-sm border border-yellow-200/40 relative overflow-hidden my-2">
             <div className="absolute top-1/2 left-0 w-full h-px bg-black/20"></div>
             <div className="absolute top-0 left-1/2 w-px h-full bg-black/20"></div>
          </div>

          <div className="flex-1 flex items-center">
            <div 
              className="text-2xl sm:text-3xl font-mono tracking-widest cursor-pointer group/number hover:text-white/80 transition-colors"
              onClick={(e) => handleCopy(e, card.cardNumber.replace(/\s+/g, ''), 'Card number')}
            >
              {showSensitive ? formatCardNumber(card.cardNumber) : maskCardNumber(card.cardNumber)}
              <Copy className="w-4 h-4 inline-block ml-2 opacity-100 lg:opacity-0 lg:group-hover/number:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <div 
              className="flex flex-col cursor-pointer group/name hover:text-white/80 transition-colors"
              onClick={(e) => handleCopy(e, card.cardholderName, 'Cardholder name')}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-70">Card Holder</span>
              <span className="font-medium tracking-wide uppercase flex items-center">
                {card.cardholderName || 'NAME SURNAME'}
                <Copy className="w-3 h-3 ml-2 opacity-100 lg:opacity-0 lg:group-hover/name:opacity-100 transition-opacity" />
              </span>
            </div>
            
            <div className="flex gap-6">
              <div 
                className="flex flex-col items-end cursor-pointer group/exp hover:text-white/80 transition-colors"
                onClick={(e) => handleCopy(e, card.expiryDate, 'Expiry date')}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-70">Expires</span>
                <span className="font-medium tracking-wider font-mono flex items-center">
                  <Copy className="w-3 h-3 mr-1 opacity-100 lg:opacity-0 lg:group-hover/exp:opacity-100 transition-opacity" />
                  {formatExpiry(card.expiryDate) || 'MM/YY'}
                </span>
              </div>

              <div 
                className="flex flex-col items-end cursor-pointer group/cvv hover:text-white/80 transition-colors"
                onClick={(e) => handleCopy(e, card.cvv, 'CVV')}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-70">CVV</span>
                <span className="font-medium tracking-wider font-mono flex items-center">
                  <Copy className="w-3 h-3 mr-1 opacity-100 lg:opacity-0 lg:group-hover/cvv:opacity-100 transition-opacity" />
                  {showSensitive ? card.cvv || '***' : '***'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
