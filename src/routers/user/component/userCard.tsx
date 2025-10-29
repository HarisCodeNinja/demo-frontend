import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TableAction } from '@/types/table';
import { hasAccess } from '@/util/AccessControl';
import { formatDate } from '@/util/Time';
import React from 'react';
import { IUserIndex } from '../interface';

interface UserCardProps {
  record: IUserIndex;
  actions?: TableAction<IUserIndex>[];
  scope: string[];
}

export const UserCard: React.FC<UserCardProps> = ({ record, actions = [], scope }) => {
  const filteredActions = actions.filter((action: TableAction<IUserIndex>) => {
    if (action.permission && scope) {
      const { module, resource, action: actionType } = action.permission;
      return hasAccess(scope, module, resource, actionType);
    }
    return true;
  });

  return (
    <Card className="mb-4 py-2 gap-0">
      <CardContent className="px-5">
        <div className="">
          <div className="grid grid-cols-3 text-sm py-3 border-b">
            <span className="font-medium">User Id</span>
            <p className="truncate col-span-2">{record.userId}</p>
          </div>
          <div className="grid grid-cols-3 text-sm py-3 border-b">
            <span className="font-medium">Email</span>
            <p className="truncate col-span-2">{record.email}</p>
          </div>
          <div className="grid grid-cols-3 text-sm py-3 border-b">
            <span className="font-medium">Username</span>
            <p className="truncate col-span-2">{record.username}</p>
          </div>
          <div className="grid grid-cols-3 text-sm py-3 border-b">
            <span className="font-medium">Role</span>
            <p className="truncate col-span-2">{record.role}</p>
          </div>
          <div className="grid grid-cols-3 text-sm py-3 border-b">
            <span className="font-medium">Created At</span>
            <p className="truncate col-span-2">{formatDate(record.createdAt)}</p>
          </div>
          <div className="grid grid-cols-3 text-sm py-3 border-b">
            <span className="font-medium">Updated At</span>
            <p className="truncate col-span-2">{formatDate(record.updatedAt)}</p>
          </div>
        </div>

        {filteredActions.length > 0 && (
          <div className="flex gap-2 mt-4 pb-2">
            {filteredActions.map((action: TableAction<IUserIndex>, index: number) => (
              <Button
                key={`${action.key} ${index}`}
                variant={action.variant || 'outline'}
                size="icon"
                onClick={() => action.onClick(record)}
                className={`flex flex-1 items-center gap-2 text-xs ${action.className || ''}`}>
                {typeof action.icon === 'function' ? action.icon(record) : action.icon}
                <span className="capitalize">{action.key}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
