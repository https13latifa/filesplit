import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
  };
  const modal = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black z-40"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
