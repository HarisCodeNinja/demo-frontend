import { useEffect, useRef } from 'react';
import { IMessage } from '../interface';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface MessageListProps {
  messages: IMessage[];
  isLoading?: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Bot className="w-16 h-16 mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-2">Welcome to AI Assistant</h3>
          <p className="text-sm max-w-md">
            Ask me anything about the HRMS system. I can help you understand modules,
            navigate features, and guide you through workflows.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-3 items-start',
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
          >
            {message.role === 'user' ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
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
                'rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-primary hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            const href = props.href;
                            if (href?.startsWith('/')) {
                              window.location.href = href;
                            }
                          }}
                        />
                      ),
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
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors flex items-center gap-1"
                    onClick={() => {
                      // Trigger suggestion - this will be handled by parent component
                      const event = new CustomEvent('suggestion-clicked', {
                        detail: { suggestion }
                      });
                      window.dispatchEvent(event);
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Timestamp */}
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 items-start">
          <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-secondary text-secondary-foreground">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-lg px-4 py-2 bg-muted">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
