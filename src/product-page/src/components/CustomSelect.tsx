import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  accentColor?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

function parseOption(opt: string | SelectOption): SelectOption {
  if (typeof opt !== 'string') {
    if (opt.sublabel) return opt;
    const match = opt.label.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return {
        value: opt.value,
        label: match[1].trim(),
        sublabel: match[2].trim(),
        badge: opt.badge,
      };
    }
    return opt;
  }

  const match = opt.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      value: opt,
      label: match[1].trim(),
      sublabel: match[2].trim(),
    };
  }
  return {
    value: opt,
    label: opt,
  };
}

export function CustomSelect({
  value,
  onChange,
  options,
  accentColor = '#8e1d24',
  placeholder = 'Select option...',
  className = '',
  id,
  name,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedOptions = options.map(parseOption);
  const selectedOption = parsedOptions.find((o) => o.value === value) || parsedOptions[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = parsedOptions.findIndex((o) => o.value === value);
        const nextIndex = (currentIndex + 1) % parsedOptions.length;
        onChange(parsedOptions[nextIndex].value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = parsedOptions.findIndex((o) => o.value === value);
        const prevIndex = (currentIndex - 1 + parsedOptions.length) % parsedOptions.length;
        onChange(parsedOptions[prevIndex].value);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, value, parsedOptions, onChange]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      id={id}
    >
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full px-4 py-3 rounded-xl border bg-white font-sans text-sm flex items-center justify-between gap-2 text-left cursor-pointer transition-all duration-200 select-none shadow-xs"
        style={{
          borderColor: isOpen ? accentColor : 'rgba(0,0,0,0.15)',
          boxShadow: isOpen
            ? `0 0 0 2px ${accentColor}25, 0 2px 8px -2px rgba(0,0,0,0.06)`
            : '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div className="flex items-baseline gap-1.5 min-w-0 truncate">
          <span className="font-sans font-medium text-[#1A1A1A] truncate text-sm">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.sublabel && (
            <span className="font-mono text-[10.5px] text-black/50 truncate hidden sm:inline">
              • {selectedOption.sublabel}
            </span>
          )}
        </div>

        <ChevronDown
          className="w-4 h-4 text-black/45 transition-transform duration-200 shrink-0"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isOpen ? accentColor : undefined,
          }}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-[100] bg-[#FCFCFA] rounded-xl border border-black/12 shadow-2xl overflow-hidden py-1 max-h-64 overflow-y-auto"
          style={{
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          {parsedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 mx-0 flex items-center justify-between gap-3 text-left transition-all duration-150 cursor-pointer border-b border-black/[0.04] last:border-b-0 ${
                  isSelected ? '' : 'hover:bg-black/[0.03]'
                }`}
                style={{
                  backgroundColor: isSelected ? `${accentColor}12` : undefined,
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-sans text-xs sm:text-sm leading-snug ${
                        isSelected ? 'font-semibold' : 'text-[#1A1A1A]'
                      }`}
                      style={{ color: isSelected ? accentColor : '#1A1A1A' }}
                    >
                      {opt.label}
                    </span>
                    {opt.badge && (
                      <span
                        className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sublabel && (
                    <span className="font-mono text-[10px] text-black/55 block mt-0.5 truncate tracking-wide">
                      {opt.sublabel}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${accentColor}18` }}
                  >
                    <Check className="w-3 h-3" style={{ color: accentColor }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
