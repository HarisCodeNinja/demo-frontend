import { useState, useRef, useCallback, memo, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  readonly onSendMessage: (message: string) => void;
  readonly isLoading?: boolean;
  readonly placeholder?: string;
}

export const MessageInput = memo<MessageInputProps>(({ onSendMessage, isLoading = false, placeholder = 'Ask me anything about the system...' }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      resetTextareaHeight();
    }
  }, [message, isLoading, onSendMessage, resetTextareaHeight]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  }, []);

  const isMessageEmpty = !message.trim();

  return (
    <div className="border-t px-3 pt-3 pb-2 bg-background">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="min-h-[48px] max-h-[180px] resize-none text-sm"
          rows={1}
          aria-label="Message input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="true"
        />
        <Button onClick={handleSend} disabled={isMessageEmpty || isLoading} size="icon" className="h-[48px] w-[48px] flex-shrink-0" aria-label="Send message" type="button">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4" aria-hidden="true" />}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight" role="note">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';
