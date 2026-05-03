import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
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
      text: "Hello! I'm Gemini, your non-partisan Election Assistant. I can help you with voter registration, deadlines, or understanding the Indian electoral process. How can I assist you today?",
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
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please check your internet connection or try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="container" style={{ padding: '2rem 0', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem' }}>
          <Bot size={14} /> Powered by Gemini 2.0 Flash
        </div>
        <h1 style={{ fontSize: '2.5rem' }}>Ask <span className="gradient-text">Civic Assistant</span></h1>
      </motion.div>

      <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0 auto', width: '100%', maxWidth: '900px', background: 'rgba(15, 23, 42, 0.9)' }}>
        {/* Chat Header */}
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Civic Intelligence</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Online • Non-partisan</p>
            </div>
          </div>
          <button onClick={clearChat} style={{ color: 'var(--text-dim)', background: 'transparent' }} title="Clear Chat">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{ 
                  background: msg.sender === 'bot' ? 'var(--primary)' : 'var(--secondary)', 
                  padding: '0.6rem', 
                  borderRadius: '12px', 
                  height: 'fit-content',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {msg.sender === 'bot' ? <Bot size={18} color="white" /> : <User size={18} color="white" />}
                </div>
                <div style={{ 
                  padding: '1.25rem 1.5rem', 
                  borderRadius: msg.sender === 'user' ? '24px 4px 24px 24px' : '4px 24px 24px 24px',
                  background: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  color: 'white',
                }}>
                  <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.text}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)' }}
            >
              <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '12px' }}>
                <RefreshCw size={18} className="animate-spin" color="white" />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Assistant is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Disclaimer */}
        <div style={{ padding: '0.75rem 2rem', background: 'rgba(244, 63, 94, 0.05)', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={14} color="var(--accent)" />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Gemini may provide inaccurate info about people, places, or facts. Always cross-verify with official <a href="https://eci.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>ECI resources</a>.</p>
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem 2rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about voter ID, polling dates, or the election process..."
              style={{ 
                flex: 1, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '16px', 
                padding: '1rem 1.5rem',
                color: 'white',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-primary" 
              style={{ padding: '0', width: '54px', height: '54px', borderRadius: '16px', justifyContent: 'center' }}
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAAssistant;
