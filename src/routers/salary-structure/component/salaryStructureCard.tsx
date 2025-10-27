import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hash, Heart } from 'lucide-react';
import { hasAccess } from '@/util/AccessControl';
import { TableAction } from '@/types/table';
import { ISalaryStructureIndex } from '../interface';

interface SalaryStructureCardProps {
  record: ISalaryStructureIndex;
  actions?: TableAction<ISalaryStructureIndex>[];
  scope: string[];
}

export const SalaryStructureCard: React.FC<SalaryStructureCardProps> = ({ record, actions = [], scope }) => {
  const getInitials = () => {
    const init = record.salaryStructureId || 's';
    return init.toString().substring(0, 2).toUpperCase();
  };

  const filteredActions = actions.filter((action: TableAction<ISalaryStructureIndex>) => {
    if (action.permission && scope) {
      const { module, resource, action: actionType } = action.permission;
      return hasAccess(scope, module, resource, actionType);
    }
    return true;
  });

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-300 bg-card border border-border hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg truncate">{record.salaryStructureId || 'Unknown SalaryStructure'}</h3>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Hash className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{record.salaryStructureId || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-foreground bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded-lg">
            <Heart className="w-4 h-4 mr-3 text-accent flex-shrink-0" />
            <span className="truncate font-medium">{record.salaryStructureId}</span>
          </div>
        </div>

        {filteredActions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex gap-2">
              {filteredActions.map((action: TableAction<ISalaryStructureIndex>, index: number) => (
                <Button
                  key={`${action.key} ${index}`}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={() => action.onClick(record)}
                  className={`flex flex-1 items-center gap-2 text-xs ${action.className || ''}`}>
                  {typeof action.icon === 'function' ? action.icon(record) : action.icon}
                  <span className="capitalize">{action.key}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
