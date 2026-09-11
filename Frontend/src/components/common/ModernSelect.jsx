import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const ModernSelect = ({ 
  options = [], 
  value, 
  onChange, 
  name, 
  placeholder = "Pilih opsi...",
  className = "",
  disabled = false,
  icon: Icon = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value || String(opt.value) === String(value));

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full py-3.5 px-4 bg-surface-container-lowest border rounded-xl text-sm transition-all cursor-pointer select-none
          ${disabled ? 'opacity-60 cursor-not-allowed bg-surface-container' : 'hover:border-primary/50 focus:ring-2 focus:ring-primary/20'}
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'}
        `}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-5 h-5 text-outline shrink-0" />}
          <span className={`truncate ${selectedOption ? 'text-on-surface' : 'text-outline'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-outline shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2 animate-in fade-in zoom-in-95 duration-100 origin-top">
          <ul className="max-h-60 overflow-y-auto scrollbar-hide py-1">
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg text-sm cursor-pointer transition-colors
                    ${isSelected 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-on-surface hover:bg-surface-container hover:text-primary'}
                  `}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </li>
              );
            })}
            {options.length === 0 && (
              <li className="px-4 py-3 text-sm text-outline text-center italic">Tidak ada opsi</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModernSelect;
