import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Shield,
  GraduationCap,
  BrainCircuit,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { switchRole, login, register, isAuthLoading } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('Sarah Chen');
  const [email, setEmail] = useState('sarah.chen@stanford.edu');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isRegister) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      const success = await register({ name, email, password });
      if (!success) {
        setErrorMessage('Registration could not be completed. The email might already be in use.');
      }
    } else {
      const success = await login(email, password);
      if (!success) {
        setErrorMessage('Invalid email or password. Please verify your credentials or use the 1-click demo buttons above.');
      }
    }
  };

  const handleDemoStudent = async () => {
    setEmail('sarah.chen@stanford.edu');
    setPassword('password');
    setErrorMessage(null);
    await switchRole('student');
  };

  const handleDemoAdmin = async () => {
    setEmail('m.vance@cognilearn.ai');
    setPassword('password');
    setErrorMessage(null);
    await switchRole('admin');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">
        {/* Left Side: SaaS Brand Presentation */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LearnSmart AI</span>
            </div>

            <div className="mt-12 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Next-Gen Adaptive Learning Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Master complex STEM topics with your personal AI tutor.
              </h2>
              <p className="text-xs sm:text-sm text-brand-100/90 leading-relaxed">
                Dynamic difficulty calibration, diagnostic weak-area remediation, and real-time concept scaffolding tailored to your learning pace.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Sarah Chen"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40"
              />
              <div>
                <p className="text-xs font-bold text-white">"Cut my exam study time by 40%."</p>
                <p className="text-[11px] text-brand-200">Sarah Chen • Stanford University CS</p>
              </div>
            </div>
          </div>

          {/* Background subtle radial glow */}
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
        </div>

        {/* Right Side: Auth Form & Demo Logins */}
        <div className="flex flex-col justify-between p-8">
          <div>
            {/* Header Tabs */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {isRegister ? 'Create Student Account' : 'Welcome to LearnSmart'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRegister ? 'Start your personalized learning journey today' : 'Enter your credentials or choose a quick demo account'}
                </p>
              </div>
            </div>

            {/* Demo Account Quick Switch Buttons */}
            <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/50 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Instant Demo Access (1-Click Real Auth)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isAuthLoading}
                  onClick={handleDemoStudent}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white py-2 px-2 text-xs font-bold text-brand-700 hover:bg-brand-50 shadow-sm transition-all disabled:opacity-50"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Sarah (Student)
                </button>
                <button
                  type="button"
                  disabled={isAuthLoading}
                  onClick={handleDemoAdmin}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-white py-2 px-2 text-xs font-bold text-violet-700 hover:bg-violet-50 shadow-sm transition-all disabled:opacity-50"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Dr. Vance (Admin)
                </button>
              </div>
            </div>

            {/* Validation Error Banner */}
            {errorMessage && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {errorMessage}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Chen"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 transition-all disabled:opacity-60"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting to Server...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? 'Create My Account' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage(null);
              }}
              className="text-xs text-slate-600 hover:text-brand-600 font-medium"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account yet? Register Free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
