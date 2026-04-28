import React, { useState, useEffect, useRef } from 'react';
import { getElectionAssistantChat } from '../lib/gemini';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
}

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your Civic Assistant. What would you like to know about the election process?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    const session = getElectionAssistantChat();
    setChatSession(session);
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input.trim();
    if (!messageToSend || !chatSession) return;

    if (!overrideMessage) setInput('');
    
    // Add user message and a placeholder for the bot response
    setMessages(prev => [...prev, { text: messageToSend, isUser: true }, { text: "", isUser: false }]);
    setIsLoading(true);

    try {
      // Use streaming response
      const result = await chatSession.sendMessageStream(messageToSend);
      
      let fullText = "";
      for await (const chunk of result.stream) {
        setIsLoading(false); // Hide loader once we get the first chunk
        const chunkText = chunk.text();
        fullText += chunkText;
        
        // Update the last message (the bot placeholder) with the current streamed text
        const currentText = fullText;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = currentText;
            return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        // Replace the placeholder with the error message
        newMessages[newMessages.length - 1] = { text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", isUser: false, isError: true };
        return newMessages;
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleExternalQuery = (e: any) => {
      if (e.detail) {
        handleSend(e.detail);
      }
    };
    window.addEventListener('ask-assistant', handleExternalQuery);
    return () => window.removeEventListener('ask-assistant', handleExternalQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSession]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 'var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)', 
            alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
            maxWidth: '85%'
          }}>
            {!msg.isUser && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Bot size={18} />
              </div>
            )}
            
            <div style={{
              background: msg.isUser ? 'var(--color-primary)' : 'var(--color-surface-hover)',
              color: msg.isError ? '#ef4444' : 'white',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-lg)',
              borderBottomRightRadius: msg.isUser ? '4px' : 'var(--radius-lg)',
              borderBottomLeftRadius: !msg.isUser ? '4px' : 'var(--radius-lg)',
              fontSize: 'var(--text-sm)',
              lineHeight: '1.4'
            }}>
              {msg.text}
            </div>

             {msg.isUser && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignSelf: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Bot size={18} />
            </div>
            <div style={{ background: 'var(--color-surface-hover)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: '4px', display: 'flex', alignItems: 'center' }}>
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: 'var(--spacing-md)', 
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 'var(--spacing-sm)'
      }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about elections..." 
          disabled={isLoading || !chatSession}
          style={{ 
            flex: 1, 
            padding: 'var(--spacing-sm) var(--spacing-md)', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid var(--color-border)', 
            background: 'var(--color-bg-base)', 
            color: 'white',
            outline: 'none'
          }} 
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading || !chatSession}
          style={{ 
            padding: 'var(--spacing-sm)', 
            background: input.trim() ? 'var(--color-primary)' : 'var(--color-surface-hover)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white', 
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            transition: 'var(--transition-fast)'
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
