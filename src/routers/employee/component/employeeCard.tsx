import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hash, Heart } from 'lucide-react';
import { hasAccess } from '@/util/AccessControl';
import { TableAction } from '@/types/table';
import { IEmployeeIndex } from '../interface';
import EMPLOYEE_CONSTANTS from '../constants';

interface EmployeeCardProps {
  record: IEmployeeIndex;
  actions?: TableAction<IEmployeeIndex>[];
  scope: string[];
}

const getEmployeeInitials = (firstName: string = 'E'): string => firstName.substring(0, EMPLOYEE_CONSTANTS.CARD.INITIALS_LENGTH).toUpperCase();

/**
 * Card component for displaying employee information in mobile view
 */
export const EmployeeCard: React.FC<EmployeeCardProps> = ({ record, actions = [], scope }) => {
  const initials = useMemo(() => getEmployeeInitials(record.firstName), [record.firstName]);

  const filteredActions = useMemo(
    () =>
      actions.filter((action) => {
        if (action.permission && scope) {
          const { module, resource, action: actionType } = action.permission;
          return hasAccess(scope, module, resource, actionType);
        }
        return true;
      }),
    [actions, scope],
  );

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-pink-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${EMPLOYEE_CONSTANTS.CARD.GRADIENT_COLORS.FROM} ${EMPLOYEE_CONSTANTS.CARD.GRADIENT_COLORS.TO} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate">{record.firstName || 'Unknown Employee'}</h3>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Hash className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{record.employeeId || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg">
            <Heart className="w-4 h-4 mr-3 text-pink-500 flex-shrink-0" />
            <span className="truncate font-medium">{record.firstName}</span>
          </div>
        </div>

        {filteredActions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              {filteredActions.map((action, index) => (
                <Button
                  key={`${action.key}-${index}`}
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
