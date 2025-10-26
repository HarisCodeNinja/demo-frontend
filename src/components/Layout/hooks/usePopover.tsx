import { useState, useRef, useEffect, useCallback } from 'react';

export const usePopover = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopover = useCallback(() => {
    setPopoverOpen(prev => !prev);
  }, []);

  const closePopover = useCallback(() => {
    setPopoverOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        closePopover();
      }
    };

    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [popoverOpen, closePopover]);

  return {
    popoverOpen,
    popoverRef,
    togglePopover,
    closePopover,
    setPopoverOpen
  };
};