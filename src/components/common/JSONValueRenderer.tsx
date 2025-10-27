import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode } from 'lucide-react';

interface JSONValueRendererProps {
  value: any;
  maxPreviewLength?: number;
}

const isEmptyValue = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

const getFieldCount = (value: any): number => {
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length;
  }
  return 0;
};

const formatKey = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function JSONValueRenderer({ value, maxPreviewLength = 30 }: JSONValueRendererProps) {
  if (isEmptyValue(value)) {
    return <span className="text-muted-foreground text-xs">-</span>;
  }

  const fieldCount = getFieldCount(value);
  const jsonString = JSON.stringify(value, null, 2);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 font-normal justify-start">
          <FileCode className="h-3 w-3 mr-1.5 text-muted-foreground" />
          <span className="text-xs">
            {fieldCount > 0 ? (
              <>
                {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
              </>
            ) : (
              'View'
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">JSON Data</h4>
            {fieldCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="p-4">
            {typeof value === 'object' && value !== null ? (
              <div className="space-y-2">
                {Object.entries(value).map(([key, val], index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-muted/50 p-3"
                  >
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {formatKey(key)}
                    </div>
                    <div className="text-sm font-mono break-all">
                      {typeof val === 'object' ? (
                        <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                          {JSON.stringify(val, null, 2)}
                        </pre>
                      ) : (
                        <span>{String(val)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="text-xs font-mono bg-muted p-3 rounded-lg overflow-x-auto">
                {jsonString}
              </pre>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
