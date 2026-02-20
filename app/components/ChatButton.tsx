'use client';

import { BotMessageSquare, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          size="icon"
          className="size-16 rounded-full border border-primary
          shadow-2xl transition-all hover:scale-110 active:scale-95 duration-200
          bg-linear-to-br from-orange-200 via-primary to-orange-200"
        >
          <BotMessageSquare className="size-7 text-primary-foreground" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent side="left">Praat met onze AI-assistent</TooltipContent>
    </Tooltip>
  );
}
