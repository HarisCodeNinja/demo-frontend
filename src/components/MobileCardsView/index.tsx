import React from 'react';
import { LucideIcon } from 'lucide-react';
import Pagination from '@/components/Pagination';
import LoadingCard from '@/components/LoadingCard';
import { MobileCardsViewProps, TableColumn, TableAction } from '@/types/table';

interface CardComponentProps<T> {
  record: T;
  columns: TableColumn<T>[];
  actions: TableAction<T>[];
  scope: string[];
}

interface GenericMobileCardsViewProps<T> extends Omit<MobileCardsViewProps<T>, 'data'> {
  data: T[];
  CardComponent: React.ComponentType<CardComponentProps<T>>;
  emptyStateIcon?: LucideIcon;
  loadingCardVariant?: 'compact' | 'detailed';
  getRecordKey?: (record: T, index: number) => string | number;
}

function MobileCardsView<T>({
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
  entityName,
  CardComponent,
  emptyStateIcon: EmptyStateIcon,
  loadingCardVariant = 'compact',
  getRecordKey
}: GenericMobileCardsViewProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <LoadingCard key={i} variant={loadingCardVariant} showActions />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {data.map((record: T, index: number) => {
        const key = getRecordKey ? getRecordKey(record, index) : index;
        return (
          <CardComponent
            key={key}
            record={record}
            columns={columns}
            actions={actions}
            scope={user.scope}
          />
        );
      })}

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {EmptyStateIcon && <EmptyStateIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />}
            <p className="text-gray-500 font-medium">No {entityName.toLowerCase()}s found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        </div>
      )}

      {showPagination && (
        <Pagination
          page={pager.page}
          pageSize={pager.pageSize}
          totalCount={totalCount || 0}
          totalPages={totalPages}
          onPageChange={(pageNumber: number) => setPager({ page: pageNumber, pageSize: pager.pageSize })}
        />
      )}
    </div>
  );
}

export default MobileCardsView;
