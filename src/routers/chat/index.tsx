import { useState, useEffect, useCallback, memo, type FC } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { ModuleSidebar } from './components/ModuleSidebar';
import { chatService } from './service';
import { IMessage, IModuleInfo } from './interface';
import { Trash2, BookOpen, Sparkles } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const QUICK_START_SUGGESTIONS = [
  'What modules are available?',
  'How do I manage employees?',
  'Explain the recruitment process',
  'Tell me about payroll',
] as const;

interface QuickStartButtonProps {
  readonly suggestion: string;
  readonly onClick: (suggestion: string) => void;
}

const QuickStartButton = memo<QuickStartButtonProps>(({ suggestion, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(suggestion);
  }, [suggestion, onClick]);

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      type="button"
    >
      {suggestion}
    </Button>
  );
});

QuickStartButton.displayName = 'QuickStartButton';

const Chat: FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [relatedModules, setRelatedModules] = useState<IModuleInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        message: message.trim()
      });

      // Update messages from service history
      setMessages([...chatService.getHistory()]);

      // Update related modules if any
      if (response.relatedModules && response.relatedModules.length > 0) {
        setRelatedModules(response.relatedModules);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearChat = useCallback(() => {
    chatService.clearHistory();
    setMessages([]);
    setRelatedModules([]);
    toast.success('Chat history cleared');
  }, []);

  const handleModuleClick = useCallback((module: IModuleInfo) => {
    handleSendMessage(`Tell me more about ${module.name}`);
  }, [handleSendMessage]);

  const handleExploreModulesClick = useCallback(() => {
    handleSendMessage('What modules are available?');
  }, [handleSendMessage]);

  // Send initial greeting on mount
  useEffect(() => {
    handleSendMessage('Hello');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // We only want this to run once on mount, not when handleSendMessage changes

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <Card className="flex-shrink-0 p-4 mb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-primary rounded-lg flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Your intelligent guide to the HRMS system. Ask me anything about modules, features, and workflows.
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExploreModulesClick}
              type="button"
              disabled={isLoading}
            >
              <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
              Explore Modules
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={messages.length === 0}
                  type="button"
                >
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Clear Chat
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all messages from the current conversation. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearChat}>
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Quick Start - Show only when no messages */}
        {messages.length === 0 && !isLoading && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Quick Start:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_START_SUGGESTIONS.map((suggestion) => (
                <QuickStartButton
                  key={suggestion}
                  suggestion={suggestion}
                  onClick={handleSendMessage}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onSuggestionClick={handleSendMessage}
          />
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        <ModuleSidebar
          modules={relatedModules}
          onModuleClick={handleModuleClick}
        />
      </Card>
    </div>
  );
};

export default memo(Chat);
