import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Toast({ message = '', onClose }) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 10000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return createPortal(
    <div
      onClick={onClose}
      className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-slide-in cursor-pointer"
    >
      {message}
    </div>,
    document.body
  )
}
