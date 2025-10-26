import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { hasAccess } from '@/util/AccessControl';
import { TableProps, TableColumn } from '@/types/table';

const GenericTable: React.FC<TableProps> = ({
  data,
  isLoading,
  columns,
  showPagination,
  pager,
  setPager,
  totalPages,
  totalCount,
  actions = [],
  user,
  handleSort,
  getSortDirection,
  getSortIndex,
}) => {
  const renderCellValue = (value: any, dataIndex: string, record: any, column: TableColumn) => {
    if (column.render) {
      return column.render(value, record);
    }

    if (dataIndex === 'isAvailable' || dataIndex === 'isActive') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>;
    }

    return value?.toString() || '-';
  };

  const getSortIcon = (column: TableColumn) => {
    if (!column.sortable || !getSortDirection) return null;

    const direction = getSortDirection(column.dataIndex);
    const sortIndex = getSortIndex?.(column.dataIndex);

    if (!direction) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-muted-foreground" />;
    }

    return (
      <div className="flex items-center ml-1">
        {direction === 'asc' ? <ArrowUp className="w-4 h-4 text-blue-600" /> : <ArrowDown className="w-4 h-4 text-blue-600" />}
        {sortIndex && sortIndex > 1 && <span className="text-xs bg-blue-100 text-blue-600 rounded-full w-4 h-4 flex items-center justify-center ml-1">{sortIndex}</span>}
      </div>
    );
  };

  const handleColumnSort = (column: TableColumn, event: React.MouseEvent) => {
    if (!column.sortable || !handleSort) return;

    const forceMultiSort = event.ctrlKey || event.metaKey;
    handleSort(column.dataIndex, forceMultiSort);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''} onClick={(e) => handleColumnSort(column, e)}>
                  <div className="flex items-center">
                    {column.title}
                    {getSortIcon(column)}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record: any, index: number) => (
              <TableRow key={record.id || record.userId || index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{renderCellValue(record[column.dataIndex], column.dataIndex, record, column)}</TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className="">
                    <div className="flex gap-2">
                      {actions.map((action) => {
                        if (action.permission && user) {
                          const { module, resource, action: actionType } = action.permission;
                          if (!hasAccess(user.scope, module, resource, actionType)) {
                            return null;
                          }
                        }

                        return (
                          <Button key={action.key} variant={action.variant || 'outline'} size="sm" className={action.className} onClick={() => action.onClick(record)}>
                            {typeof action.icon === 'function' ? action.icon(record) : action.icon}
                          </Button>
                        );
                      })}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(pager.page - 1) * pager.pageSize + 1} to {Math.min(pager.page * pager.pageSize, totalCount || 0)} of {totalCount || 0} entries
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPager({ page: pager.page - 1, pageSize: pager.pageSize })} disabled={pager.page <= 1}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, pager.page - 2)) + i;
                if (pageNumber > totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === pager.page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPager({ page: pageNumber, pageSize: pager.pageSize })}>
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button variant="outline" size="sm" onClick={() => setPager({ page: pager.page + 1, pageSize: pager.pageSize })} disabled={pager.page >= totalPages}>
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default GenericTable;
