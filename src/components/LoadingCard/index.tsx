import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingCardProps {
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  className?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ 
  variant = 'default', 
  showActions = false,
  className = '' 
}) => {
  return (
    <Card className={`mb-4 animate-pulse ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded-full"></div>
            <div className="flex-1">
              <div className="h-5 bg-muted rounded w-28 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
          </div>
          <div className="h-6 bg-muted rounded w-20"></div>
        </div>
        
        <div className="space-y-3">
          <div className="h-12 bg-muted rounded-lg"></div>
          
          {variant === 'detailed' && (
            <>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded-md"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 bg-muted rounded-md"></div>
                  <div className="h-8 bg-muted rounded-md"></div>
                  <div className="h-8 bg-muted rounded-md"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 pt-2">
                <div className="h-8 bg-muted rounded-md"></div>
                <div className="h-8 bg-muted rounded-md"></div>
              </div>
            </>
          )}
          
          {variant === 'compact' && (
            <div className="h-8 bg-muted rounded-md"></div>
          )}
          
          {variant === 'default' && (
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded-md"></div>
              <div className="h-8 bg-muted rounded-md"></div>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoadingCard;