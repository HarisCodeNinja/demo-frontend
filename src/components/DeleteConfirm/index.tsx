import React from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useTranslation } from 'react-i18next';
import { RootState, useAppSelector, useAppDispatch } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DeleteConfirmProps {
  handleDelete: () => void;
  curObjName: string;
  isDeleteLoading?: boolean;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ 
  handleDelete, 
  curObjName, 
  isDeleteLoading = false 
}) => {
  const { t } = useTranslation(['common']);
  const { [curObjName]: { showDelete, label } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    if (!isDeleteLoading) {
      dispatch(resetSelectedObj(curObjName));
    }
  };

  const handleConfirmDelete = () => {
    if (!isDeleteLoading) {
      handleDelete();
    }
  };

  return (
    <Dialog 
      open={showDelete} 
      onOpenChange={(open) => {
        if (!open && !isDeleteLoading) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="flex items-center justify-center gap-3 sm:justify-start text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <span className="font-semibold">{t('confirmDelete')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:items-start">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 dark:bg-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive dark:text-destructive" />
          </div>
          
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('areYouSureToDelete')}
            </p>
            {label && (
              <p className="font-medium text-foreground break-words bg-muted px-3 py-2 rounded-md text-sm">
                "{label}"
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isDeleteLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {t('cancel')}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleConfirmDelete} 
            disabled={isDeleteLoading}
            className={cn(
              "w-full sm:w-auto order-1 sm:order-2 min-w-[100px]",
              isDeleteLoading && "cursor-not-allowed"
            )}
          >
            {isDeleteLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>{t('delete')}</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirm;