import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
  showInlineMessage?: boolean;
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;
  
  const strengthMap = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500' },
    { label: 'Good', color: 'bg-blue-500' },
    { label: 'Strong', color: 'bg-green-500' }
  ];
  
  return {
    score,
    label: strengthMap[Math.min(score, 4)].label,
    color: strengthMap[Math.min(score, 4)].color
  };
};

const isPasswordValid = (password: string): boolean => {
  return password.length >= 8 && 
         /[a-z]/.test(password) && 
         /[A-Z]/.test(password) && 
         /\d/.test(password) && 
         /[@$!%*?&]/.test(password);
};

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className,
  showInlineMessage = true
}) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const isValid = isPasswordValid(password);

  if (showInlineMessage) {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Strength Indicator Bars */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                bar <= strength.score ? strength.color : "bg-gray-200"
              )}
            />
          ))}
        </div>
        
        {/* Error Message */}
        {!isValid && (
          <p className="text-sm text-red-600">
            Use at least 8 characters with a mix of uppercase, lowercase, numbers, and special symbols (e.g., @, #, $).
          </p>
        )}
      </div>
    );
  }

  // Fallback to detailed requirements list
  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              bar <= strength.score ? strength.color : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Password strength: {strength.label}
      </p>
    </div>
  );
};
