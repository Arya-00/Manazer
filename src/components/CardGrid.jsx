import React from 'react';
import { motion, Reorder } from 'framer-motion';
import CreditCard from './CreditCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CardGrid({ cards, onEdit, onReorder }) {
  if (onReorder) {
    return (
      <Reorder.Group 
        axis="y"
        values={cards} 
        onReorder={onReorder}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {cards.map(card => (
          <Reorder.Item key={card.id} value={card} variants={item} className="cursor-grab active:cursor-grabbing relative">
            <CreditCard card={card} onEdit={onEdit} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {cards.map(card => (
        <motion.div key={card.id} variants={item}>
          <CreditCard card={card} onEdit={onEdit} />
        </motion.div>
      ))}
    </motion.div>
  );
}
