import { useEffect, useRef, useCallback, memo } from 'react';
import { IMessage } from '../interface';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface MessageListProps {
  readonly messages: IMessage[];
  readonly isLoading?: boolean;
  readonly onSuggestionClick: (suggestion: string) => void;
}

interface SuggestionButtonProps {
  readonly suggestion: string;
  readonly onClick: (suggestion: string) => void;
}

const SuggestionButton = memo<SuggestionButtonProps>(({ suggestion, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(suggestion);
  }, [suggestion, onClick]);

  return (
    <button
      type="button"
      className="text-xs px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors flex items-center gap-1"
      onClick={handleClick}
      aria-label={`Ask: ${suggestion}`}
    >
      <Sparkles className="w-3 h-3" aria-hidden="true" />
      {suggestion}
    </button>
  );
});

SuggestionButton.displayName = 'SuggestionButton';

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
    <Bot className="w-16 h-16 mb-4 opacity-20" aria-hidden="true" />
    <h3 className="text-lg font-medium mb-2">Welcome to AI Assistant</h3>
    <p className="text-sm max-w-md">
      Ask me anything about the HRMS system. I can help you understand modules,
      navigate features, and guide you through workflows.
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';

const LoadingIndicator = memo(() => (
  <div className="flex gap-3 items-start">
    <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-secondary text-secondary-foreground">
      <Bot className="w-4 h-4" aria-hidden="true" />
    </div>
    <div className="flex flex-col gap-2">
      <div className="rounded-lg px-4 py-2 bg-muted" role="status" aria-label="Loading response">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
));

LoadingIndicator.displayName = 'LoadingIndicator';

export const MessageList = memo<MessageListProps>(({ messages, isLoading = false, onSuggestionClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const markdownComponents: Components = {
    a: ({ node, ...props }) => {
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const href = props.href;
        if (href?.startsWith('/')) {
          window.location.href = href;
        } else if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      };

      return (
        <a
          {...props}
          className="text-primary hover:underline cursor-pointer"
          onClick={handleClick}
          rel="noopener noreferrer"
        />
      );
    },
    code: ({ node, className, children, ...props }) => {
      const isInline = !className;
      return isInline ? (
        <code
          className="px-1 py-0.5 rounded bg-secondary text-secondary-foreground font-mono text-xs"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.length === 0 && !isLoading && <EmptyState />}

      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-3 items-start animate-in fade-in slide-in-from-bottom-4 duration-300',
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}
            aria-label={message.role === 'user' ? 'User' : 'AI Assistant'}
          >
            {message.role === 'user' ? (
              <User className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Bot className="w-4 h-4" aria-hidden="true" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={cn(
              'flex flex-col gap-2 max-w-[80%]',
              message.role === 'user' ? 'items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'rounded-lg px-4 py-2 break-words',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown components={markdownComponents}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1" role="group" aria-label="Suggested questions">
                {message.suggestions.map((suggestion, idx) => (
                  <SuggestionButton
                    key={`${message.id}-suggestion-${idx}`}
                    suggestion={suggestion}
                    onClick={onSuggestionClick}
                  />
                ))}
              </div>
            )}

            {/* Timestamp */}
            <time
              className="text-xs text-muted-foreground"
              dateTime={message.timestamp.toISOString()}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </time>
          </div>
        </div>
      ))}

      {isLoading && <LoadingIndicator />}

      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
});

MessageList.displayName = 'MessageList';
