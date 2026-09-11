import React from 'react';
import { AlertCircle, CheckCircle, X, Info } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Ya, Lanjutkan', 
  cancelText = 'Batal', 
  isDestructive = false,
  type = 'warning' // 'warning', 'info', 'success'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="text-[#16A34A]" />;
      case 'info':
        return <Info size={24} className="text-primary" />;
      default:
        return <AlertCircle size={24} className={isDestructive ? 'text-error' : 'text-[#F59E0B]'} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-sm border border-primary/20 overflow-hidden flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <h3 className={`font-bold text-lg flex items-center gap-2 ${isDestructive ? 'text-error' : 'text-inverse-surface'}`}>
            {getIcon()}
            {title}
          </h3>
          <button 
            onClick={onCancel} 
            className="text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-error/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-on-surface-variant">
            {message}
          </p>
        </div>
        
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel(); // Auto close after click
            }}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${
              isDestructive 
                ? 'bg-error hover:bg-[#B91C1C]' 
                : 'bg-primary hover:bg-primary-container'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
