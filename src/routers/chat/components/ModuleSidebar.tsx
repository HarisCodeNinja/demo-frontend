import { memo, useCallback, type MouseEvent } from 'react';
import { IModuleInfo } from '../interface';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Layers } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/50"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Learn more about ${module.name}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm line-clamp-1">{module.name}</h4>
        <a
          href={module.path}
          onClick={handleLinkClick}
          className="text-primary hover:text-primary/80 transition-colors"
          aria-label={`Navigate to ${module.name}`}
        >
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {module.description}
      </p>

      {module.features && module.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {module.features.slice(0, 3).map((feature, featureIdx) => (
            <Badge
              key={`${module.name}-feature-${featureIdx}`}
              variant="secondary"
              className="text-xs px-1.5 py-0"
            >
              {feature}
            </Badge>
          ))}
          {module.features.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{module.features.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {module.relatedModules && module.relatedModules.length > 0 && (
        <div className="text-xs text-muted-foreground">
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

  const handleModuleClick = useCallback((module: IModuleInfo) => {
    onModuleClick?.(module);
  }, [onModuleClick]);

  return (
    <aside
      className="w-80 border-l bg-muted/20 flex flex-col animate-in slide-in-from-right duration-300"
      aria-label="Related modules"
    >
      <div className="p-4 border-b bg-background flex-shrink-0">
        <h3 className="font-semibold flex items-center gap-2">
          <Layers className="w-4 h-4" aria-hidden="true" />
          Related Modules
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {modules.length} module{modules.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {modules.map((module, idx) => (
            <ModuleCard
              key={`${module.path}-${idx}`}
              module={module}
              onClick={handleModuleClick}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
});

ModuleSidebar.displayName = 'ModuleSidebar';
