import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BadgeListProps {
  items: string[];
  maxVisible?: number;
  title?: string;
  emptyText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  itemClassName?: string;
  popoverWidth?: string;
  maxPopoverHeight?: string;
  capitalize?: boolean;
  onItemClick?: (item: string, index: number) => void;
}

export const BadgeList: React.FC<BadgeListProps> = ({
  items,
  maxVisible = 3,
  title,
  emptyText = "No items",
  badgeVariant = "secondary",
  className = "",
  itemClassName = "",
  popoverWidth = "w-80",
  maxPopoverHeight = "max-h-40",
  capitalize = true,
  onItemClick
}) => {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground text-xs">{emptyText}</span>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  const badgeClasses = `text-xs ${capitalize ? 'capitalize' : ''} ${itemClassName}`;
  const handleItemClick = (item: string, index: number) => {
    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleItems.map((item, index) => (
        <Badge 
          key={index} 
          variant={badgeVariant} 
          className={`${badgeClasses} ${onItemClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
          onClick={() => handleItemClick(item, index)}
        >
          {item}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge 
              variant="outline" 
              className="text-xs cursor-pointer hover:bg-muted transition-colors"
            >
              +{remainingCount} more
            </Badge>
          </PopoverTrigger>
          <PopoverContent className={popoverWidth}>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {title ? `${title} (${items.length})` : `All Items (${items.length})`}
              </h4>
              <div className={`flex flex-wrap gap-1 ${maxPopoverHeight} overflow-y-auto`}>
                {items.map((item, index) => (
                  <Badge 
                    key={index} 
                    variant={badgeVariant} 
                    className={`${badgeClasses} ${onItemClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                    onClick={() => handleItemClick(item, index)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};