import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Award,
  Zap,
  TrendingUp,
  AlertTriangle,
  Code2,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';

export const QuizPage: React.FC = () => {
  const {
    quizQuestions,
    recordQuizCompletion,
    setCurrentPage,
    setIsAiDrawerOpen,
    sendChatMessage,
    addToast
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [instantFeedbackMode, setInstantFeedbackMode] = useState(true);
  const [startTime] = useState(Date.now());

  const currentQ: QuizQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optIndex: number) => {
    if (submittedCurrent && instantFeedbackMode) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswers[currentIndex] === undefined) {
      addToast('Select an Answer', 'Please choose an option to continue.', 'warning');
      return;
    }
    setSubmittedCurrent(true);
  };

  const handleNext = () => {
    setShowHint(false);
    setSubmittedCurrent(false);

    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);

    // Calculate score
    let correctCount = 0;
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
        strongTopics.push(q.topic);
      } else {
        weakTopics.push(q.topic);
      }
    });

    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const timeSpent = Math.max(25, Math.round((Date.now() - startTime) / 1000));
    const xpEarned = correctCount * 30 + 20;

    recordQuizCompletion({
      score: correctCount,
      totalQuestions,
      accuracy,
      timeSpentSeconds: timeSpent,
      difficulty: 'Adaptive Matrix',
      xpEarned,
      weakTopicsDetected: weakTopics,
      strongTopics
    });

    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedCurrent(false);
    setShowHint(false);
    setQuizCompleted(false);
  };

  const selectedOpt = selectedAnswers[currentIndex];
  const isCorrect = selectedOpt === currentQ?.correctOptionIndex;

  // ---------------- Render Results Screen ----------------
  if (quizCompleted) {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) correctCount++;
    });
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-500/30 mb-4">
            <Award className="h-10 w-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Adaptive Diagnostic Assessment Complete!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Your performance has updated your personalized mastery score and calibrated your next study priorities.
          </p>

          {/* Metric Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <span className="text-[11px] font-bold uppercase text-slate-400">Score</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{correctCount} / {totalQuestions}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <span className="text-[11px] font-bold uppercase text-emerald-700">Accuracy</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{accuracy}%</p>
            </div>
            <div className="rounded-2xl bg-brand-50 border border-brand-200 p-4">
              <span className="text-[11px] font-bold uppercase text-brand-700">XP Earned</span>
              <p className="text-2xl font-black text-brand-700 mt-1">+{correctCount * 30 + 20} XP</p>
            </div>
            <div className="rounded-2xl bg-violet-50 border border-violet-200 p-4">
              <span className="text-[11px] font-bold uppercase text-violet-700">Difficulty</span>
              <p className="text-xl font-black text-violet-700 mt-1">Adaptive</p>
            </div>
          </div>

          {/* Diagnostics Summary */}
          <div className="mt-8 text-left rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              AI Diagnostic Feedback
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {accuracy >= 80 ? (
                <>
                  Excellent command of algorithmic structures! You demonstrated strong retention in <strong>Attention Mechanisms</strong> and <strong>Subsequence Optimization</strong>. Your Graph Theory mastery has been bumped up by <strong>+18%</strong>.
                </>
              ) : (
                <>
                  Good effort! CogniLearn detected subtle misconceptions around <strong>Bayesian False Positive Rates</strong> and <strong>Cycle conditions in directed graphs</strong>. Targeted flashcards have been queued in your Study Planner.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </button>
            <button
              onClick={() => {
                sendChatMessage(`I just finished the adaptive quiz with ${accuracy}% accuracy. Can you explain the concepts I missed in detail?`);
                setIsAiDrawerOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white hover:bg-violet-700 shadow-md transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Review Wrong Questions with AI
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-xs font-bold text-white hover:bg-brand-700 shadow-md transition-all"
            >
              Return to Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Render Question Screen ----------------
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Quiz Progress & Settings Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700">
              {currentQ.difficulty} Level
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {currentQ.subject}
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 mt-1">{currentQ.topic}</h2>
        </div>

        {/* Immediate feedback toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={instantFeedbackMode}
              onChange={(e) => setInstantFeedbackMode(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Instant Feedback Mode</span>
          </label>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Optional Code snippet */}
          {currentQ.codeSnippet && (
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 font-sans">
                  <Code2 className="h-3.5 w-3.5 text-brand-400" /> Code Snippet
                </span>
                <span>C++ / Python</span>
              </div>
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOpt === optIdx;
            const isRight = optIdx === currentQ.correctOptionIndex;
            const hasRevealed = submittedCurrent && instantFeedbackMode;

            let optionStyle = 'border-slate-200 hover:border-brand-300 hover:bg-slate-50/70 text-slate-800';

            if (isSelected) {
              optionStyle = 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm ring-1 ring-brand-600';
            }

            if (hasRevealed) {
              if (isRight) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500';
              } else if (isSelected && !isRight) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
              }
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-xs font-medium cursor-pointer transition-all ${optionStyle}`}
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-[11px] font-bold ${
                    isSelected
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <div className="flex-1 leading-relaxed">{option}</div>
                {hasRevealed && isRight && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasRevealed && isSelected && !isRight && (
                  <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span>CogniTutor Hint:</span>
            </div>
            <p className="leading-relaxed">{currentQ.hint}</p>
          </div>
        )}

        {/* Instant Feedback Explanation Accordion */}
        {submittedCurrent && instantFeedbackMode && (
          <div
            className={`rounded-2xl border p-5 text-xs animate-in fade-in ${
              isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {isCorrect ? 'Correct Answer! +30 XP' : 'Incorrect Selection'}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Concept: {currentQ.conceptTag}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed font-normal">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{showHint ? 'Hide AI Hint' : 'Need a Hint?'}</span>
          </button>

          <div className="flex items-center gap-2">
            {!submittedCurrent && instantFeedbackMode ? (
              <button
                type="button"
                onClick={handleConfirmAnswer}
                disabled={selectedOpt === undefined}
                className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-40 shadow-sm transition-all"
              >
                <span>Submit Answer</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
              >
                <span>{currentIndex + 1 === totalQuestions ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
