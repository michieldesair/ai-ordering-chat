'use client';

import { DefaultChatTransport } from 'ai';
import { ChatButton } from './ChatButton';
import ChatWindow from './ChatWindow';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end">
      {isOpen ? (
        <ChatWindow
          messages={messages}
          sendMessage={sendMessage}
          input={input}
          setInput={setInput}
          status={status}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <ChatButton onClick={() => setIsOpen(!isOpen)} />
      )}
    </div>
  );
}
