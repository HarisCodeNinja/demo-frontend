import { Action } from "@/config/authAccess";
import { SortDirection } from "@/hooks/useTableOperations";

export interface TableColumn<T> {
    key: string;
    title: string;
    dataIndex: string;
    sortable?: boolean;
    render?: (value: any, record: T) => React.ReactNode;
}

export interface TableAction<T> {
    key: string;
    icon: React.ReactNode | ((record: T) => React.ReactNode);
    onClick: (record: T) => void;
    variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
    className?: string;
    permission?: {
        scope: string;
        module: string;
        resource: string;
        action: Action;
    };
}

export interface GenericTableProps<T> {
  data: any[];
  isLoading: boolean;
  columns: TableColumn<T>[];
  showPagination: boolean;
  pager: { page: number; pageSize: number };
  setPager: (pager: { page: number; pageSize: number }) => void;
  totalPages: number;
  totalCount?: number;
  openConfigDrawer: boolean;
  setOpenConfigDrawer: (open: boolean) => void;
  isConfigModified: boolean;
  tableConfigKey: string;
  tableConfiguration: Record<string, boolean>;
  defaultTableConfig?: Record<string, boolean>;
  actions?: TableAction<T>[];
  handleDelete?: () => void;
  isDeleteLoading?: boolean;
  user: any;
  entityName: string;
  entityKey: string;
  CreateComponent?: React.ComponentType;
  UpdateComponent?: React.ComponentType;
  handleSort?: (columnKey: string, multiSort?: boolean) => void;
  getSortDirection?: (columnKey: string) => SortDirection | null;
  getSortIndex?: (columnKey: string) => number | null;
}

export type MobileCardsViewProps<T> = Pick<
  GenericTableProps<T>,
  | "data"
  | "isLoading"
  | "columns"
  | "showPagination"
  | "pager"
  | "setPager"
  | "totalPages"
  | "totalCount"
  | "actions"
  | "user"
  | "entityName"
>;
