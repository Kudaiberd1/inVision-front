import { Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { COPY } from '../../constants';

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  return (
    <div className="flex gap-2 border-t border-[#E5E5E4] bg-white p-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={COPY.chatbot.placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-lg border border-[#E5E5E4] bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-[#C8E63C] disabled:opacity-50"
      />
      <Button
        type="button"
        variant="publicPrimary"
        className="shrink-0 px-4"
        disabled={disabled || !value.trim()}
        onClick={onSend}
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">{COPY.chatbot.send}</span>
      </Button>
    </div>
  );
}
