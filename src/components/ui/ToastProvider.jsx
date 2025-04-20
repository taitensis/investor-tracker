import { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const maxToasts = 3
  const duration = 4000

  const showToast = useCallback((message, type = 'info', options = {}) => {
    const id = uuidv4()
    const toast = { id, message, type, ...options }

    setToasts((prev) => {
      const next = [...prev, toast]
      return next.slice(-maxToasts)
    })

    if (!options.persistent) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const contextValue = {
    toast: showToast,
    success: (msg, opts) => showToast(msg, 'success', opts),
    error: (msg, opts) => showToast(msg, 'error', opts),
    warn: (msg, opts) => showToast(msg, 'warn', opts),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-5 right-5 space-y-2 z-50 w-full max-w-xs">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between gap-4 px-4 py-2 rounded shadow text-sm transition-opacity text-white ${
                toast.type === 'success'
                  ? 'bg-green-600'
                  : toast.type === 'error'
                  ? 'bg-red-600'
                  : toast.type === 'warn'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800'
              }`}
            >
              <span>{toast.message}</span>
              {toast.onUndo && (
                <button
                  onClick={() => {
                    toast.onUndo()
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }}
                  className="underline text-xs ml-auto"
                >
                  Undo
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
