import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function MobileActionSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxHeight = 'max-h-[80vh]' 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />
      
      {/* Action Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 md:hidden transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FaTimes size={16} className="text-gray-500" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className={`overflow-y-auto ${maxHeight} px-4 py-4`}>
          {children}
        </div>
      </div>
    </>
  );
}

export function ActionSheetItem({ icon: Icon, label, onClick, variant = 'default' }) {
  const variants = {
    default: 'text-gray-900 hover:bg-gray-50',
    danger: 'text-red-600 hover:bg-red-50',
    primary: 'text-yellow-400 hover:bg-orange-50'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${variants[variant]}`}
    >
      {Icon && <Icon size={20} />}
      <span className="font-medium">{label}</span>
    </button>
  );
}