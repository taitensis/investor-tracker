import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'default') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warn: (msg) => addToast(msg, 'warning'),
    default: (msg) => addToast(msg),
  }

  const toastStyles = {
    success: {
      bg: '#22c55e', // green
      icon: '✅',
    },
    error: {
      bg: '#ef4444', // red
      icon: '❌',
    },
    info: {
      bg: '#3b82f6', // blue
      icon: 'ℹ️',
    },
    warning: {
      bg: '#facc15', // yellow
      icon: '⚠️',
    },
    default: {
      bg: '#6b7280', // gray
      icon: '💬',
    },
  }

  const toastElements = (
    <div className="fixed top-4 right-4 flex flex-col space-y-2 z-[99999] w-[320px] pointer-events-none">
      {toasts.map((toastObj) => {
        const style = toastStyles[toastObj.type] || toastStyles.default
        return (
          <div
            key={toastObj.id}
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toastObj.id))}
            className="flex items-start gap-3 pointer-events-auto animate-slide-in cursor-pointer shadow-xl rounded-lg"
            style={{
              backgroundColor: style.bg,
              color: '#fff',
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{style.icon}</span>
            <span>{toastObj.message}</span>
          </div>
        )
      })}
    </div>
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(toastElements, document.getElementById('root'))}
    </ToastContext.Provider>
  )
}