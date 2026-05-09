import { motion, Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
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

function DraggableCard({ card, onEdit }) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={card} 
      variants={item} 
      dragListener={false} 
      dragControls={controls}
      className="relative group"
    >
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 p-2 cursor-grab active:cursor-grabbing touch-none text-white/40 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-xl backdrop-blur-md opacity-70 group-hover:opacity-100"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical className="w-5 h-5 drop-shadow-md" />
      </div>
      <CreditCard card={card} onEdit={onEdit} />
    </Reorder.Item>
  );
}

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
          <DraggableCard key={card.id} card={card} onEdit={onEdit} />
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
