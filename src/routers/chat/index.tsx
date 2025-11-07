import { useState, useEffect } from 'react';
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

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [relatedModules, setRelatedModules] = useState<IModuleInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Send initial greeting
    handleSendMessage('Hello', true);

    // Listen for suggestion clicks
    const handleSuggestionClick = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.suggestion) {
        handleSendMessage(customEvent.detail.suggestion);
      }
    };

    window.addEventListener('suggestion-clicked', handleSuggestionClick);

    return () => {
      window.removeEventListener('suggestion-clicked', handleSuggestionClick);
    };
  }, []);

  const handleSendMessage = async (message: string, isInitial = false) => {
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
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    chatService.clearHistory();
    setMessages([]);
    setRelatedModules([]);
    toast.success('Chat history cleared');
  };

  const handleModuleClick = (module: IModuleInfo) => {
    handleSendMessage(`Tell me more about ${module.name}`);
  };

  // Quick start suggestions
  const quickStarts = [
    'What modules are available?',
    'How do I manage employees?',
    'Explain the recruitment process',
    'Tell me about payroll',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <Card className="p-4 mb-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Your intelligent guide to the HRMS system. Ask me anything about modules, features, and workflows.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const event = new CustomEvent('suggestion-clicked', {
                  detail: { suggestion: 'What modules are available?' }
                });
                window.dispatchEvent(event);
              }}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Modules
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={messages.length === 0}>
                  <Trash2 className="w-4 h-4 mr-2" />
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
        {messages.length === 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Quick Start:</p>
            <div className="flex flex-wrap gap-2">
              {quickStarts.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <MessageList messages={messages} isLoading={isLoading} />
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

export default Chat;
