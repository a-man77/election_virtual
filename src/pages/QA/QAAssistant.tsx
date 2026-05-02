import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';
import { askGemini } from '../../services/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QAAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Election Assistant. Ask me anything about voter registration, deadlines, or how the election process works.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askGemini(input);
      const botMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Ask <span className="gradient-text">Gemini</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>AI-powered civic guidance at your fingertips.</p>
      </div>

      <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0 auto', width: '100%', maxWidth: '800px' }}>
        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', height: 'fit-content' }}>
                    <Bot size={20} color="white" />
                  </div>
                )}
                <div style={{ 
                  padding: '1rem 1.5rem', 
                  borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '0 20px 20px 20px',
                  background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)'
                }}>
                  <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <div style={{ background: 'var(--secondary)', padding: '0.5rem', borderRadius: '10px', height: 'fit-content' }}>
                    <User size={20} color="white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)' }}
            >
              <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.9rem' }}>Gemini is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer */}
        <div style={{ padding: '0.75rem 2rem', background: 'rgba(244, 63, 94, 0.1)', borderTop: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={14} color="var(--accent)" />
          <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Non-partisan assistance only. This AI provides factual civic information and does not endorse candidates.</p>
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              style={{ 
                flex: 1, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '0.75rem 1.25rem',
                color: 'white',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-primary" 
              style={{ padding: '0.75rem', borderRadius: '12px' }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default QAAssistant;
