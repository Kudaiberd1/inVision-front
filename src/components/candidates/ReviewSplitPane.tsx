import type { ReactNode } from 'react';

interface ReviewSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
}

export function ReviewSplitPane({ left, right }: ReviewSplitPaneProps) {
  return (
    <div className="flex max-h-[min(85vh,calc(100dvh-9rem))] min-h-[min(45vh,400px)] w-full flex-col gap-5 overflow-hidden lg:flex-row">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-b border-[#E5E5E4] bg-white lg:border-b-0 lg:border-r">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 md:p-8 [scrollbar-gutter:stable]">
          {left}
        </div>
      </div>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-[#FAFAFA]">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-6 md:p-8 [scrollbar-gutter:stable]">
          {right}
        </div>
      </div>
    </div>
  );
}
