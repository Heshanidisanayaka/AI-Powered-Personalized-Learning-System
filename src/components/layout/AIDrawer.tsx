import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Maximize2,
  Bot,
  User,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    chatMessages,
    sendChatMessage,
    setCurrentPage,
    addToast
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiDrawerOpen]);

  if (!isAiDrawerOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Code Copied', 'Snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Explain Kahn’s cycle check intuitively',
    'Why scale dot product in Attention by sqrt(d_k)?',
    'Give me a 2-minute memory drill on Bayes Theorem',
    'Diagnose my weakest study area'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-gradient-to-r from-brand-50/50 via-white to-violet-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-md shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm">CogniTutor AI Assistant</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Online</span>
              </div>
              <p className="text-xs text-slate-500">Context: Senior CS & Machine Learning</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsAiDrawerOpen(false);
                setCurrentPage('ai-chat');
              }}
              title="Expand to Full Page Chat"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm text-xs font-bold">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional code snippet */}
                  {msg.codeSnippet && (
                    <div className="mt-2.5 rounded-xl bg-slate-900 p-2.5 text-slate-100 font-mono text-[11px] relative">
                      <button
                        onClick={() => handleCopy(msg.codeSnippet!, msg.id)}
                        className="absolute right-2 top-2 rounded bg-slate-800 p-1 text-slate-300 hover:text-white"
                        title="Copy code"
                      >
                        {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <pre className="overflow-x-auto pr-6">{msg.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Suggested follow ups */}
                  {!isUser && msg.suggestedFollowUps && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                        <Lightbulb className="h-3 w-3 text-amber-500" /> Suggested next questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => sendChatMessage(prompt)}
                            className="text-left rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-transparent px-2 py-1 text-[11px] text-slate-700 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block mt-1 text-[9px] text-right ${
                      isUser ? 'text-brand-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700 text-xs font-bold">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts Pills */}
        <div className="border-t border-slate-200/80 bg-white px-4 py-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendChatMessage(q)}
                className="shrink-0 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 px-2.5 py-1 text-slate-600 transition-colors font-medium border border-slate-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="border-t border-slate-200 p-3 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything about algorithms, neural nets, or study plan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1.5 rounded-lg bg-brand-600 p-2 text-white hover:bg-brand-700 disabled:opacity-40 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
