import React from 'react';

interface FooterProps {
  footerText?: string;
}

export const Footer: React.FC<FooterProps> = ({ footerText }) => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
        {footerText || `© ${new Date().getFullYear()} - All rights reserved.`}
      </div>
    </footer>
  );
};