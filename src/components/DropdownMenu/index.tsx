import React, { useState } from 'react';

interface DropdownMenuProps {
  children: React.ReactElement[];
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      {React.cloneElement(children[0], { onClick: () => setIsOpen(!isOpen) } as any)}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-card border rounded-md shadow-lg min-w-32">
            {children[1]}
          </div>
        </>
      )}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children, 
  asChild, 
  ...props 
}) => {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, props);
  }
  return <div {...props}>{children}</div>;
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children }) => (
  <>{children}</>
);

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => (
  <button 
    className={`w-full px-3 py-2 text-left hover:bg-muted flex items-center ${className}`} 
    onClick={onClick}
  >
    {children}
  </button>
);