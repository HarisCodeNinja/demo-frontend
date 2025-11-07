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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMessages, setRelatedModules, clearChat } from '@/store/slice/chatSlice';

const QUICK_START_SUGGESTIONS = ['What modules are available?', 'How do I manage employees?', 'Explain the recruitment process', 'Tell me about payroll'] as const;

interface QuickStartButtonProps {
  readonly suggestion: string;
  readonly onClick: (suggestion: string) => void;
}

const QuickStartButton = memo<QuickStartButtonProps>(({ suggestion, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(suggestion);
  }, [suggestion, onClick]);

  return (
    <Button variant="secondary" size="sm" onClick={handleClick} type="button">
      {suggestion}
    </Button>
  );
});

QuickStartButton.displayName = 'QuickStartButton';

const Chat: FC = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const relatedModules = useAppSelector((state) => state.chat.relatedModules);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        message: message.trim(),
      });

      // Update messages in Redux from service history
      dispatch(setMessages([...chatService.getHistory()]));

      // Update related modules if any
      if (response.relatedModules && response.relatedModules.length > 0) {
        dispatch(setRelatedModules(response.relatedModules));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleClearChat = useCallback(() => {
    chatService.clearHistory();
    dispatch(clearChat());
    toast.success('Chat history cleared');
  }, [dispatch]);

  const handleModuleClick = useCallback(
    (module: IModuleInfo) => {
      handleSendMessage(`Tell me more about ${module.name}`);
    },
    [handleSendMessage],
  );

  const handleExploreModulesClick = useCallback(() => {
    handleSendMessage('What modules are available?');
  }, [handleSendMessage]);

  // Sync Redux state with chat service on mount
  useEffect(() => {
    // If there are persisted messages in Redux, restore them to the service
    if (messages.length > 0) {
      // Restore messages to service
      chatService.clearHistory();
      messages.forEach((msg: IMessage) => {
        // Rebuild service history from Redux
        chatService.getHistory().push(msg);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Only run once on mount

  // Clear chat service when user logs out (when Redux state is cleared)
  useEffect(() => {
    if (messages.length === 0) {
      chatService.clearHistory();
    }
  }, [messages.length]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      {/* Header - Compact */}
      <Card className="flex-shrink-0 p-2.5 mb-3 bg-gradient-to-r from-primary/10 to-primary/5 border-none shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="p-1.5 bg-primary rounded-lg flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold leading-tight">AI Assistant</h1>
              <p className="text-xs text-muted-foreground leading-tight">Your intelligent guide to the HRMS system</p>
            </div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleExploreModulesClick} type="button" disabled={isLoading} className="h-8 text-xs">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              Explore
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={messages.length === 0} type="button" className="h-8 text-xs">
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                  <AlertDialogDescription>This will remove all messages from the current conversation. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearChat}>Clear</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Quick Start - Show only when no messages */}
        {messages.length === 0 && !isLoading && (
          <div className="mt-2.5 pt-2.5 border-t">
            <p className="text-xs font-medium mb-1.5">Quick Start:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_START_SUGGESTIONS.map((suggestion) => (
                <QuickStartButton key={suggestion} suggestion={suggestion} onClick={handleSendMessage} />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Related Modules - Compact */}
      {relatedModules.length > 0 && (
        <div className="mb-2">
          <ModuleSidebar modules={relatedModules} onModuleClick={handleModuleClick} />
        </div>
      )}

      {/* Chat Interface - Maximum space */}
      <Card className="flex-1 flex overflow-hidden min-h-0 border-none shadow-sm">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <MessageList messages={messages} isLoading={isLoading} onSuggestionClick={handleSendMessage} />
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};

export default memo(Chat);
