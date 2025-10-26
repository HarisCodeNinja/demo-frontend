import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  logoPath?: string;
  title: string;
  layoutType: 'admin' | 'default';
  logoClasses: string;
}

export const Logo: React.FC<LogoProps> = ({ logoPath, title, layoutType, logoClasses }) => {
  const logoElement = (
    <img
      src={logoPath || "/logo.png"}
      alt="Logo"
      className={`${logoClasses} object-contain`}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );

  return (
    <div>
      {layoutType === 'default' ? (
        <Link to="/">{logoElement}</Link>
      ) : logoElement}
    </div>
  );
};