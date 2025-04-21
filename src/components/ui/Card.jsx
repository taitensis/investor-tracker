// src/components/ui/Card.jsx
import React from 'react'

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
    {children}
  </div>
)
