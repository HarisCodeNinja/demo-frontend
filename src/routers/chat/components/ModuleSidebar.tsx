import { memo, useCallback, type MouseEvent } from 'react';
import { IModuleInfo } from '../interface';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Layers } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ModuleSidebarProps {
  readonly modules: IModuleInfo[];
  readonly onModuleClick?: (module: IModuleInfo) => void;
}

interface ModuleCardProps {
  readonly module: IModuleInfo;
  readonly onClick: (module: IModuleInfo) => void;
}

const ModuleCard = memo<ModuleCardProps>(({ module, onClick }) => {
  const handleCardClick = useCallback(() => {
    onClick(module);
  }, [module, onClick]);

  const handleLinkClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Card
      className="p-2.5 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50 min-w-[200px] max-w-[240px]"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Learn more about ${module.name}`}>
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <h4 className="font-medium text-xs line-clamp-1">{module.name}</h4>
        <a href={module.path} onClick={handleLinkClick} className="text-primary hover:text-primary/80 transition-colors" aria-label={`Navigate to ${module.name}`}>
          <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
        </a>
      </div>

      <p className="text-[10px] text-muted-foreground mb-1.5 line-clamp-2 leading-tight">{module.description}</p>

      {module.features && module.features.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mb-1.5">
          {module.features.slice(0, 3).map((feature, featureIdx) => (
            <Badge key={`${module.name}-feature-${featureIdx}`} variant="secondary" className="text-[9px] px-1 py-0 h-4">
              {feature}
            </Badge>
          ))}
          {module.features.length > 3 && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
              +{module.features.length - 3}
            </Badge>
          )}
        </div>
      )}

      {module.relatedModules && module.relatedModules.length > 0 && (
        <div className="text-[10px] text-muted-foreground leading-tight">
          <span className="font-medium">Related:</span> {module.relatedModules.slice(0, 2).join(', ')}
          {module.relatedModules.length > 2 && '...'}
        </div>
      )}
    </Card>
  );
});

ModuleCard.displayName = 'ModuleCard';

export const ModuleSidebar = memo<ModuleSidebarProps>(({ modules, onModuleClick }) => {
  // Don't render the sidebar at all if there are no modules
  if (modules.length === 0) {
    return null;
  }

  const handleModuleClick = useCallback(
    (module: IModuleInfo) => {
      onModuleClick?.(module);
    },
    [onModuleClick],
  );

  return (
    <aside className="w-full border rounded-lg bg-muted/30 flex flex-col animate-in slide-in-from-right duration-300 shadow-sm" aria-label="Related modules">
      <div className="px-3 py-2 border-b bg-background/50 flex-shrink-0 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            Related Modules
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {modules.length} module{modules.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <ScrollArea className="whitespace-nowrap">
        <div className="flex w-max space-x-2.5 p-2.5">
          {modules.map((module, idx) => (
            <ModuleCard key={`${module.path}-${idx}`} module={module} onClick={handleModuleClick} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </aside>
  );
});

ModuleSidebar.displayName = 'ModuleSidebar';
