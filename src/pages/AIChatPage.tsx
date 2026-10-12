import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Download,
  Mic,
  MicOff,
  Code2,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AIChatPage: React.FC = () => {
  const { chatMessages, sendChatMessage, user, addToast } = useApp();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Code Snippet Copied', 'Copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      addToast('Voice Input Activated 🎙️', 'Listening to your voice prompt...', 'info');
      setTimeout(() => {
        setInput('How do I calculate posterior false positive rate using Bayes Theorem?');
        setIsRecording(false);
      }, 2400);
    } else {
      setIsRecording(false);
    }
  };

  const suggestedQuestions = [
    { title: 'Graph Invariants', prompt: 'Explain Kahn’s cycle detection algorithm with a real-life analogy' },
    { title: 'Deep Learning', prompt: 'Why scale dot product in Attention by sqrt(d_k)?' },
    { title: 'Bayes Theorem', prompt: 'Give me a tricky quiz question on Base Rate Fallacy' },
    { title: 'Code Debugging', prompt: 'How does memoization change time complexity in recursive knapsack?' },
    { title: 'Personalized Gaps', prompt: 'What are my top 3 knowledge gaps right now and how do I fix them?' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] rounded-3xl border border-slate-200 bg-white shadow-card overflow-hidden">
      {/* Tutor Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-brand-50/70 via-white to-violet-50/70 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-md shadow-brand-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">CogniTutor AI Learning Assistant</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Online & Contextual</span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized for {user.name} • Learning Style: {user.learningStyle} • Target: {user.targetExam || 'Senior CS'}
            </p>
          </div>
        </div>

        {/* Top Chat Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('Chat Exported', 'Session notes saved to your downloads', 'success')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export Notes</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Starter Prompts Chips */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-amber-500" /> Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(q.prompt)}
              className="shrink-0 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors shadow-2xl shadow-black/5"
            >
              {q.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-sm font-bold">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-2xl rounded-3xl p-5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line space-y-2">{msg.text}</div>

                {/* Optional Syntax Box */}
                {msg.codeSnippet && (
                  <div className="mt-4 rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-100 relative border border-slate-800">
                    <button
                      onClick={() => handleCopy(msg.codeSnippet!, msg.id)}
                      className="absolute right-3 top-3 rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-white transition-colors"
                      title="Copy code"
                    >
                      {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <pre className="overflow-x-auto pr-8">{msg.codeSnippet}</pre>
                  </div>
                )}

                {/* Follow-up Prompts */}
                {!isUser && msg.suggestedFollowUps && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-brand-600" /> Next Explorations:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestedFollowUps.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => sendChatMessage(prompt)}
                          className="rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-transparent px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`mt-2 text-[10px] text-right ${isUser ? 'text-brand-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-700 font-bold overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Footer */}
      <form onSubmit={handleSend} className="border-t border-slate-200 bg-white p-4">
        <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={toggleMic}
            className={`rounded-2xl p-3 border transition-colors ${
              isRecording
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
            title="Speech to text input"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            placeholder="Ask CogniTutor anything (e.g. explain attention gradients, debug Kahn's algorithm, quiz me)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-2xl bg-brand-600 p-3 text-white hover:bg-brand-700 disabled:opacity-40 transition-colors shadow-md shadow-brand-500/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
