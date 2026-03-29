export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1.5 px-4 py-3"
      role="status"
      aria-label="Assistant is typing"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#6B7A12] [animation:chat-dot_1.05s_ease-in-out_infinite] [animation-delay:-0.24s]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#C8E63C] [animation:chat-dot_1.05s_ease-in-out_infinite] [animation-delay:-0.12s]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#6B7A12] [animation:chat-dot_1.05s_ease-in-out_infinite]" />
    </div>
  );
}
