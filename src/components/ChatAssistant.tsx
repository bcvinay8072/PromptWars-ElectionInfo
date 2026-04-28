import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getElectionAssistantChat, sanitizeInput, rateLimiter } from '../lib/gemini';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
  timestamp?: string;
}

/**
 * ChatAssistant component provides an AI-powered conversational interface
 * for election process guidance. Features streaming responses, input sanitization,
 * rate limiting, and full accessibility support.
 */
export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Namaskar! I'm your CivicSync Assistant for Indian elections. Ask me about voter registration (Form 6), EPIC card, polling booth location, EVM voting, or anything about India's election process!", 
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = getElectionAssistantChat();
    setChatSession(session);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = useCallback(async (overrideMessage?: string) => {
    const rawMessage = overrideMessage || input.trim();
    if (!rawMessage || !chatSession) return;

    // Security: Sanitize input
    const messageToSend = sanitizeInput(rawMessage);
    if (!messageToSend) return;

    // Security: Rate limiting
    if (!rateLimiter.canMakeRequest()) {
      setMessages(prev => [...prev, { 
        text: "You're sending messages too quickly. Please wait a moment before trying again.", 
        isUser: false, 
        isError: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
      return;
    }

    if (!overrideMessage) setInput('');
    
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, 
      { text: messageToSend, isUser: true, timestamp }, 
      { text: "", isUser: false, timestamp }
    ]);
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const result = await chatSession.sendMessageStream(messageToSend);
      
      let fullText = "";
      for await (const chunk of result.stream) {
        setIsLoading(false);
        const chunkText = chunk.text();
        fullText += chunkText;
        
        const currentText = fullText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            text: currentText,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
          isUser: false, 
          isError: true,
          timestamp: new Date().toLocaleTimeString()
        };
        return newMessages;
      });
      setIsLoading(false);
    }
  }, [input, chatSession]);

  useEffect(() => {
    const handleExternalQuery = (e: any) => {
      if (e.detail) {
        handleSend(e.detail);
      }
    };
    window.addEventListener('ask-assistant', handleExternalQuery);
    return () => window.removeEventListener('ask-assistant', handleExternalQuery);
  }, [handleSend]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      role="region"
      aria-label="CivicSync AI Chat Assistant"
    >
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        role="log"
        aria-label="Chat message history"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
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
          <div 
            key={idx} 
            role="article"
            aria-label={`${msg.isUser ? 'Your message' : 'Assistant response'}${msg.timestamp ? ` at ${msg.timestamp}` : ''}`}
            style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {!msg.isUser && (
              <div 
                aria-hidden="true"
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'rgba(59, 130, 246, 0.2)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--color-primary)', flexShrink: 0 
                }}
              >
                <Bot size={18} />
              </div>
            )}
            
            <div 
              style={{
                background: msg.isUser ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                color: msg.isError ? '#ef4444' : 'white',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                borderBottomRightRadius: msg.isUser ? '4px' : 'var(--radius-lg)',
                borderBottomLeftRadius: !msg.isUser ? '4px' : 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {msg.text}
            </div>

            {msg.isUser && (
              <div 
                aria-hidden="true"
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'var(--color-surface-hover)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--color-text-secondary)', flexShrink: 0 
                }}
              >
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div 
            role="status" 
            aria-label="Assistant is typing a response"
            style={{ display: 'flex', gap: 'var(--spacing-sm)', alignSelf: 'flex-start' }}
          >
            <div 
              aria-hidden="true"
              style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: 'rgba(59, 130, 246, 0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'var(--color-primary)' 
              }}
            >
              <Bot size={18} />
            </div>
            <div style={{ 
              background: 'var(--color-surface-hover)', 
              padding: 'var(--spacing-sm) var(--spacing-md)', 
              borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: '4px', 
              display: 'flex', alignItems: 'center' 
            }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span className="sr-only">Loading response...</span>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message count indicator */}
      {messageCount > 0 && (
        <div 
          aria-live="polite" 
          style={{ 
            textAlign: 'center', 
            fontSize: 'var(--text-xs)', 
            color: 'var(--color-text-muted)', 
            padding: '2px 0' 
          }}
        >
          {messageCount} message{messageCount !== 1 ? 's' : ''} sent
        </div>
      )}

      {/* Input Area */}
      <div 
        role="form" 
        aria-label="Send a message to CivicSync Assistant"
        style={{ 
          padding: 'var(--spacing-md)', 
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: 'var(--spacing-sm)'
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Type your election question here
        </label>
        <input 
          id="chat-input"
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about elections, registration, or voting..." 
          disabled={isLoading || !chatSession}
          aria-label="Type your election question"
          aria-describedby="chat-input-hint"
          autoComplete="off"
          maxLength={1000}
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
        <span id="chat-input-hint" className="sr-only">
          Press Enter to send your message or click the send button
        </span>
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading || !chatSession}
          aria-label="Send message"
          title="Send message"
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
          <Send size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
