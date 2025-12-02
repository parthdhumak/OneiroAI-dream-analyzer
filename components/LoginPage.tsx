import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // States for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For sign-up
  const [error, setError] = useState('');

  // States for UI control
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between login/signup
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // Check for existing user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('oneiro_user');
    if (!storedUser) {
      setIsLoginView(false); // If no user, default to sign-up view
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error on new submission

    if (isLoginView) {
      // --- Login Logic ---
      const storedUserJSON = localStorage.getItem('oneiro_user');
      if (!storedUserJSON) {
        setError('No account found. Please sign up.');
        return;
      }
      
      const storedUser = JSON.parse(storedUserJSON);
      if (username.toLowerCase() === storedUser.username.toLowerCase() && password === storedUser.password) {
        onLogin();
      } else {
        setError('Invalid username or password.');
      }
    } else {
      // --- Sign-up Logic ---
      if (!username || !password || !confirmPassword) {
        setError('All fields are required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      // Success: save user and log in
      const newUser = { username, password };
      localStorage.setItem('oneiro_user', JSON.stringify(newUser));
      onLogin();
    }
  };

  const toggleView = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setIsLoginView(!isLoginView);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      <div className="flex flex-col items-center text-center animate-fade-in-up">
        <div className="glass-panel rounded-2xl p-8 sm:p-12 shadow-xl border border-white/20 dark:border-slate-700/50 mb-10 relative overflow-hidden group transition-all duration-500 w-full max-w-md">
          {/* Ambient Background Glows */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-dream-500/10 dark:bg-dream-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-mystic-500/10 dark:bg-mystic-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-2.5 bg-gradient-to-br from-dream-500 to-mystic-500 rounded-lg text-white shadow-lg shadow-dream-500/20 mb-6">
              <Moon size={24} fill="currentColor" className="opacity-90" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              {isLoginView ? 'Welcome Back' : 'Create Your Journal'}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed font-light mb-8">
              {isLoginView ? 'Unlock the secrets of your subconscious.' : 'Begin your journey into the dream world.'}
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-4">
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 dark:bg-night-950/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-night-900 focus:ring-2 focus:ring-dream-500/20 focus:border-dream-500 outline-none transition-all duration-300 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm shadow-inner"
                    aria-label="Username"
                  />
                </div>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50/50 dark:bg-night-950/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-night-900 focus:ring-2 focus:ring-dream-500/20 focus:border-dream-500 outline-none transition-all duration-300 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm shadow-inner"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-dream-500 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {!isLoginView && (
                  <div className="relative flex items-center animate-fade-in">
                    <Lock size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50/50 dark:bg-night-950/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-night-900 focus:ring-2 focus:ring-dream-500/20 focus:border-dream-500 outline-none transition-all duration-300 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm shadow-inner"
                      aria-label="Confirm Password"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 dark:text-red-400 text-xs text-center animate-fade-in">{error}</p>}

              <div className="relative group p-[2px] rounded-xl bg-gradient-to-r from-dream-500 via-dream-400 to-mystic-500 shadow-xl shadow-dream-500/20 hover:shadow-dream-500/40 transition-all duration-300 hover:-translate-y-0.5 w-full">
                <button
                  type="submit"
                  className="relative w-full h-full bg-white dark:bg-night-900 rounded-[10px] py-4 px-6 flex items-center justify-center gap-2.5 transition-all duration-300 group-hover:bg-opacity-90 active:bg-opacity-100"
                >
                  <Sparkles size={20} className="text-dream-600 dark:text-dream-400" />
                  <span className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">
                    {isLoginView ? 'Enter the Dreamspace' : 'Create Account'}
                  </span>
                </button>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
                <a 
                  href="#"
                  onClick={toggleView}
                  className="font-bold text-dream-500 hover:underline"
                >
                  {isLoginView ? 'Sign Up' : 'Log In'}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
