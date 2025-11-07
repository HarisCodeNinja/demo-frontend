import { IModuleInfo } from '../interface';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Layers } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModuleSidebarProps {
  modules: IModuleInfo[];
  onModuleClick?: (module: IModuleInfo) => void;
}

export const ModuleSidebar = ({ modules, onModuleClick }: ModuleSidebarProps) => {
  if (modules.length === 0) {
    return (
      <div className="w-80 border-l p-4 bg-muted/20">
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Layers className="w-12 h-12 mb-3 opacity-20" />
          <h3 className="text-sm font-medium mb-1">Related Modules</h3>
          <p className="text-xs">
            Ask about a module to see related information here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-muted/20">
      <div className="p-4 border-b bg-background">
        <h3 className="font-semibold flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Related Modules
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {modules.length} module{modules.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 space-y-3">
          {modules.map((module, idx) => (
            <Card
              key={idx}
              className="p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onModuleClick?.(module)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm">{module.name}</h4>
                <a
                  href={module.path}
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {module.description}
              </p>

              {module.features && module.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {module.features.slice(0, 3).map((feature, featureIdx) => (
                    <Badge
                      key={featureIdx}
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
                  Related: {module.relatedModules.slice(0, 2).join(', ')}
                  {module.relatedModules.length > 2 && '...'}
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
