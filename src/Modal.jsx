import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {children}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl"
              onClick={onClose}
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
