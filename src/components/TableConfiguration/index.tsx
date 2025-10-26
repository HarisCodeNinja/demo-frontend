import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setTableConfiguration } from '@/store/slice/tableConfigurationSlice';
import { TableColumn } from '@/types/table';

interface TableConfigurationDrawerProps {
  nameSpace: string;
  tableConfigDefault: Record<string, boolean>;
  tableKey: string;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  columns?: TableColumn[];
}

const TableConfigurationDrawer: React.FC<TableConfigurationDrawerProps> = ({ nameSpace, tableConfigDefault, tableKey, title, open, setOpen, columns }) => {
  const dispatch = useAppDispatch();
  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[tableKey] || {});

  const columnKeys = useMemo(() => {
    if (columns && columns.length > 0) {
      return columns.map(col => col.key);
    }
    return Object.keys(tableConfigDefault).filter(key => key !== 'autoSearch' && key !== 'multiSort');
  }, [columns, tableConfigDefault]);

  const handleReset = () => {
    dispatch(setTableConfiguration({ name: tableKey, data: tableConfigDefault }));
  };

  const handleToggle = (key: string, val: boolean) => {
    dispatch(
      setTableConfiguration({
        name: tableKey,
        data: { ...tableConfiguration, [key]: val },
      }),
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {columnKeys.map((key) => (
              <div key={key} className="flex items-center justify-between gap-x-2">
                <Label htmlFor={`switch-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <Switch
                  id={`switch-${key}`}
                  checked={tableConfiguration[key] !== undefined ? tableConfiguration[key] : tableConfigDefault[key]}
                  onCheckedChange={(val) => handleToggle(key, val)}
                />
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TableConfigurationDrawer;
