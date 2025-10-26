import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ComponentType = 'drawer' | 'modal' | 'card';

interface FormState {
  handleSubmit: (onSubmit: (data: any) => void) => (e?: React.FormEvent) => void;
  formState: {
    isSubmitting: boolean;
    isValid: boolean;
  };
}

interface ControlsProps {
  title: string;
  open: boolean;
  onClose: () => void;
  form?: FormState;
  onSubmit?: (data: any) => void;
  loading?: boolean;
  width?: number;
  children: React.ReactNode;
  type: ComponentType;
  style?: React.CSSProperties;
  description?: string;
}

const Controls: React.FC<ControlsProps> = ({ title, open, form, onSubmit, loading = false, children, type, style, width = 800, onClose, description }) => {
  const { t } = useTranslation(['common']);

  const isSubmitting = loading || form?.formState.isSubmitting;

  const handleSubmit = React.useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (onSubmit) {
        form?.handleSubmit(onSubmit)(e);
      }
    },
    [form, onSubmit],
  );

  const actions = React.useMemo(
    () => (
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting} type="button" className="min-w-[80px]">
          {t('cancel')}
        </Button>
        {onSubmit && (
          <Button onClick={handleSubmit} disabled={isSubmitting} type="submit" className="min-w-[100px] bg-primary hover:bg-primary/90">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Saving...' : t('submit')}
          </Button>
        )}
      </div>
    ),
    [t, onClose, handleSubmit, isSubmitting],
  );

  const wrappedContent = React.useMemo(
    () => (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-1">
          {children}
        </form>
      </div>
    ),
    [loading, handleSubmit, children],
  );

  const headerContent = ({ title, description }: { title?: string; description?: string }) => (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );

  const components = React.useMemo(
    () => ({
      drawer: (
        <Sheet open={open} onOpenChange={onClose}>
          <SheetContent side="right" className={cn('flex flex-col h-full p-0 gap-0 border-l', 'backdrop-blur')} style={{ width, maxWidth: '90vw' }}>
            <SheetHeader className="flex-shrink-0 px-6 py-4 border-b border-border/40">
              <div className="text-left">
                <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">{wrappedContent}</div>
            </div>

            <SheetFooter className="flex-shrink-0 px-6 py-4 border-t border-border/40 bg-muted/20">{actions}</SheetFooter>
          </SheetContent>
        </Sheet>
      ),

      modal: (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className={cn('max-h-[90vh] flex flex-col gap-0 p-0', 'backdrop-blur', 'border border-border/40 shadow-lg')} style={{ width }}>
            <DialogHeader className="flex-shrink-0 px-6 py-4 border-b border-border/40">{headerContent({ title, description })}</DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">{wrappedContent}</div>

            <DialogFooter className="flex-shrink-0 px-6 py-4 border-t border-border/40 bg-muted/10">{actions}</DialogFooter>
          </DialogContent>
        </Dialog>
      ),

      card: open ? (
        <Card style={style} className="border border-border/40 shadow-sm bg-background/50 backdrop-blur">
          <CardHeader className="border-b border-border/20">{headerContent({ description })}</CardHeader>
          <CardContent className="p-6">{wrappedContent}</CardContent>
        </Card>
      ) : null,
    }),
    [open, onClose, width, title, description, wrappedContent, actions, style, isSubmitting],
  );

  return components[type] ?? null;
};

export default Controls;
