import type { ReactNode } from 'react';

interface ChatBubbleProps {
  message: ReactNode;
  sender: 'bot' | 'user';
  criteriaTag?: string;
}

export function ChatBubble({ message, sender, criteriaTag }: ChatBubbleProps) {
  const isBot = sender === 'bot';
  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] space-y-1 sm:max-w-[70%] ${isBot ? '' : 'items-end'} flex flex-col`}>
        {criteriaTag && isBot && (
          <span className="w-fit rounded-full bg-[#C8E63C]/20 px-2 py-0.5 text-xs font-medium text-[#6B7A12]">
            {criteriaTag}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isBot
              ? 'rounded-tl-sm border border-[#E5E5E4] bg-white text-neutral-900 shadow-sm'
              : 'rounded-tr-sm bg-[#C8E63C] font-medium text-black'
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
