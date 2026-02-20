import { X, Send, Loader2, BotMessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { UIMessage } from 'ai';

interface ChatWindowProps {
  messages: UIMessage[];
  sendMessage: (c: { text: string }) => void;
  input: string;
  setInput: (v: string) => void;
  status: string;
  onClose: () => void;
}

interface MessagePart {
  type: 'text' | 'image';
  text?: string;
  url?: string;
}

export default function ChatWindow({
  messages,
  sendMessage,
  input,
  setInput,
  status,
  onClose,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, status]);
  return (
    <Card
      className="w-95 h-137.5 mb-4 flex flex-col p-0 shadow-2xl
    border-2 border-primary animate-in slide-in-from-bottom-5"
    >
      <CardHeader
        className="bg-linear-to-br from-orange-300 via-primary to-orange-300 
             flex flex-row items-center justify-between p-4 rounded-t-lg shadow-sm"
      >
        <CardTitle className="flex flex-row gap-2 items-center text-primary-foreground">
          {' '}
          <BotMessageSquare className="size-5" />
          AI-assistent - FriturieBot
        </CardTitle>
        <Button
          onClick={onClose}
          size="icon"
          className="hover:cursor-pointer text-primary-foreground bg-transparent
          border-none opacity-70 hover:opacity-100 focus:outline-none"
        >
          <X />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full px-4 py-4">
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="text-center font-sans text-muted-foreground text-sm px-4">
                Hallo! Ik ben de AI-assistent van de Friturie.
                <br />
                <br />
                Ik kan je helpen met het beantwoorden van vragen over ons menu, of het geven van
                informatie over onze openingstijden, locatie en meer.
                <br />
                <br />
                Typ simpelweg je vraag in het tekstvak hieronder en ik zal mijn best doen om je te
                helpen!
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground mb-1 ml-4">
                  {message.role === 'user' ? null : 'FriturieBot'}
                </span>

                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-xs'
                      : 'bg-card border text-card-foreground rounded-tl-xs'
                  }`}
                >
                  {message.parts.map((part, index: number) =>
                    part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                  )}
                </div>
              </div>
            ))}

            {status === 'submitted' && (
              <div className="flex justify-start">
                <div className="bg-card border px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex items-center justify-center p-4 border-t">
        <form
          className="flex w-full items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && status === 'ready') {
              sendMessage({ text: input });
              setInput('');
            }
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tot hoelaat zijn jullie vandaag geopend?"
            className="flex-1 rounded-md border border-input bg-muted px-3 py-2
            focus:ring-2 focus:ring-primary-foreground focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-50 h-12"
          />
          <Button
            type="submit"
            size="icon"
            disabled={status !== 'ready' || !input.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50
             duration-200 size-12 hover:cursor-pointer hover:scale-105 active:scale-95 transition"
          >
            {status === 'submitted' ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
