import React, { useState, useEffect, useRef } from 'react';
import { analyzeDream } from './services/geminiService';
import { DreamAnalysis } from './types';
import AnalysisReport from './components/AnalysisReport';
import LoginPage from './components/LoginPage';
import { Moon, Sun, Sparkles, Activity, Wind, CloudMoon, Mic, MicOff, History, Trash2, X } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dreamText, setDreamText] = useState('');
  const [contextText, setContextText] = useState('');
  const [sleepQuality, setSleepQuality] = useState<number | undefined>(undefined);
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [savedDreams, setSavedDreams] = useState<DreamAnalysis[]>([]);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('oneiro_dream_journal');
    if (saved) {
        try {
            setSavedDreams(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse dream journal");
        }
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Your browser does not support speech recognition. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setDreamText(prev => prev + (prev ? ' ' : '') + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError("Microphone access denied. Please check your permissions.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleAnalyze = async () => {
    if (!dreamText.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeDream(dreamText, contextText, sleepQuality);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setDreamText('');
    setContextText('');
    setSleepQuality(undefined);
    setError(null);
    if (isListening) stopListening();
  };

  // History Functions
  const handleSaveDream = (dreamToSave: DreamAnalysis) => {
    const newDream = { 
        ...dreamToSave, 
        id: Date.now().toString(),
        timestamp: Date.now() 
    };
    
    const updatedHistory = [newDream, ...savedDreams];
    setSavedDreams(updatedHistory);
    localStorage.setItem('oneiro_dream_journal', JSON.stringify(updatedHistory));
    
    // Update current analysis with ID so UI knows it's saved
    setAnalysis(newDream);
  };

  const handleDeleteDream = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dream when clicking delete
    const updatedHistory = savedDreams.filter(d => d.id !== id);
    setSavedDreams(updatedHistory);
    localStorage.setItem('oneiro_dream_journal', JSON.stringify(updatedHistory));
    
    if (analysis && analysis.id === id) {
        setAnalysis(null); // Close if currently viewing deleted dream
    }
  };

  const handleLoadDream = (dream: DreamAnalysis) => {
    setAnalysis(dream);
    setShowHistory(false);
  };

  const sleepLabels = ['Poor', 'Unsettled', 'Average', 'Restful', 'Excellent'];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-dream-300 selection:text-dream-900 relative overflow-x-hidden transition-colors duration-500">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-dream-400/10 dark:bg-dream-900/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-mystic-500/10 dark:bg-mystic-900/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <>
          {/* History Sidebar Overlay */}
          {showHistory && (
            <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
                onClick={() => setShowHistory(false)}
            />
          )}
          
          {/* History Sidebar */}
          <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white dark:bg-night-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-night-900">
                <div className="flex items-center gap-2">
                    <History className="text-dream-500" />
                    <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-100">Dream Journal</h2>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-night-950/50">
                {savedDreams.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                        <CloudMoon size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No dreams recorded yet.</p>
                    </div>
                ) : (
                    savedDreams.map((dream) => (
                        <div 
                            key={dream.id || Math.random()} 
                            onClick={() => handleLoadDream(dream)}
                            className="group p-4 rounded-xl bg-white dark:bg-night-800 border border-slate-200 dark:border-slate-700 hover:border-dream-300 dark:hover:border-dream-700 hover:shadow-md transition-all cursor-pointer relative"
                        >
                            <div className="pr-8">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1 text-sm font-serif">{dream.title}</h3>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                                    <span>{new Date(dream.timestamp || 0).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                    <span className="text-dream-600 dark:text-dream-400 font-medium">Level {dream.dreamLevel}</span>
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed opacity-80">
                                    {dream.summary}
                                </p>
                            </div>
                            <button 
                                onClick={(e) => handleDeleteDream(dream.id!, e)}
                                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Entry"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
          </div>

          {/* Header */}
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-night-950/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
                <div className="p-1.5 bg-gradient-to-br from-dream-500 to-mystic-500 rounded-lg text-white shadow-lg shadow-dream-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Moon size={18} fill="currentColor" className="opacity-90" />
                </div>
                <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
                  OneiroAI
                </h1>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white dark:hover:bg-night-800 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-slate-600 dark:text-slate-300 text-sm font-medium"
                >
                    <History size={16} />
                    <span className="hidden sm:inline">Journal</span>
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full hover:bg-white dark:hover:bg-night-800 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-slate-500 dark:text-slate-400 text-dream-500 dark:text-dream-400"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-4 sm:p-6 lg:p-10 relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-dream-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                  <div className="relative p-8 bg-white dark:bg-night-800 rounded-2xl shadow-2xl shadow-dream-500/20 border border-white/50 dark:border-slate-700">
                    <Sparkles className="w-12 h-12 text-dream-500 animate-spin-slow" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-serif font-medium text-slate-800 dark:text-slate-100">Interpreting Symbols...</h2>
                  <p className="text-slate-500 dark:text-slate-400">Consulting the collective unconscious.</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="animate-fade-in-up">
                <div className="max-w-5xl mx-auto mb-8 flex justify-start">
                   <button 
                     onClick={handleReset}
                     className="text-sm flex items-center gap-2 text-slate-500 hover:text-dream-600 dark:text-slate-400 dark:hover:text-dream-300 transition-colors font-medium px-4 py-2 rounded-full hover:bg-white dark:hover:bg-night-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
                   >
                     <span className="group-hover:-translate-x-1 transition-transform">←</span> Analyze another dream
                   </button>
                </div>
                <AnalysisReport 
                    analysis={analysis} 
                    onSave={handleSaveDream}
                    isSaved={!!(analysis.id && savedDreams.some(d => d.id === analysis.id))}
                />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto animate-fade-in-up mt-8 sm:mt-12">
                
                {/* Hero Text */}
                <div className="text-center mb-12 space-y-4">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                    Dream Analysis
                  </h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-light">
                    Uncover the hidden meanings, archetypes, and psychological signals within your subconscious.
                  </p>
                </div>

                {/* Analysis Form */}
                <div className="bg-white/80 dark:bg-night-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 overflow-hidden relative">
                  {/* Decorative top gradient bar */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-dream-500 to-mystic-500"></div>
                  
                  <div className="p-6 md:p-8 space-y-8">
                    
                    {/* Dream Input */}
                    <div className="space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                          The Dream
                        </label>
                        {isListening && (
                           <span className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
                              ● Recording
                           </span>
                        )}
                      </div>
                      <div className="relative group">
                        <textarea
                          className="w-full h-44 p-5 rounded-xl bg-slate-50/50 dark:bg-night-950/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-night-900 focus:ring-2 focus:ring-dream-500/20 focus:border-dream-500 outline-none resize-none transition-all duration-300 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-base leading-relaxed shadow-inner"
                          placeholder="Describe your dream in detail. Every symbol matters..."
                          value={dreamText}
                          onChange={(e) => setDreamText(e.target.value)}
                        ></textarea>
                        <button 
                            onClick={toggleListening}
                            className={`absolute bottom-3 right-3 p-2.5 rounded-lg transition-all duration-300 ${
                                isListening 
                                    ? 'bg-red-500 text-white shadow-lg scale-110' 
                                    : 'text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-dream-500 dark:hover:text-dream-400'
                            }`}
                            title="Voice Input"
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Context Input */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Context <span className="text-slate-400 font-normal ml-1 text-xs">(Optional)</span>
                      </label>
                      <textarea
                        className="w-full h-24 p-4 rounded-xl bg-slate-50/50 dark:bg-night-950/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-night-900 focus:ring-2 focus:ring-dream-500/20 focus:border-dream-500 outline-none resize-none transition-all duration-300 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm shadow-inner"
                        placeholder="Relevant life events, recent stress, or recurring themes..."
                        value={contextText}
                        onChange={(e) => setContextText(e.target.value)}
                      ></textarea>
                    </div>
                    
                    {/* Sleep Quality Selector */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                           Sleep Quality
                        </label>
                        <div className="grid grid-cols-5 gap-2 p-1.5 bg-slate-50/80 dark:bg-night-950/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            {sleepLabels.map((label, index) => {
                                const num = index + 1;
                                const isSelected = sleepQuality === num;
                                
                                // Define gradient colors based on the requested scale
                                let gradientClass = 'bg-gradient-to-r from-dream-500 to-mystic-500';
                                if (index === 0) gradientClass = 'bg-gradient-to-r from-red-500 to-rose-600'; // Poor
                                if (index === 1) gradientClass = 'bg-gradient-to-r from-orange-400 to-orange-600'; // Unsettled
                                if (index === 2) gradientClass = 'bg-gradient-to-r from-yellow-500 to-amber-500'; // Average
                                if (index === 3) gradientClass = 'bg-gradient-to-r from-lime-500 to-green-500'; // Restful
                                if (index === 4) gradientClass = 'bg-gradient-to-r from-emerald-600 to-green-700'; // Excellent

                                return (
                                    <button
                                        key={num}
                                        onClick={() => setSleepQuality(isSelected ? undefined : num)}
                                        className={`py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                                            isSelected
                                            ? `${gradientClass} text-white shadow-lg transform scale-[1.02] ring-2 ring-white/20`
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="sm:hidden">{num}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Analyze Button */}
                    <div className="pt-6">
                        <div className={`relative group p-[2px] rounded-xl bg-gradient-to-r from-dream-500 via-dream-400 to-mystic-500 shadow-xl shadow-dream-500/20 hover:shadow-dream-500/40 transition-all duration-300 hover:-translate-y-0.5 ${!dreamText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <button
                            onClick={handleAnalyze}
                            disabled={!dreamText.trim()}
                            className="relative w-full h-full bg-white dark:bg-night-900 rounded-[10px] py-4 px-6 flex items-center justify-center gap-2.5 transition-all duration-300 group-hover:bg-opacity-90 active:bg-opacity-100"
                          >
                            <Sparkles size={20} className="text-dream-600 dark:text-dream-400 group-hover:animate-pulse" />
                            <span className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">Analyze Dream</span>
                          </button>
                        </div>
                    </div>

                  </div>
                </div>
                
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <div className="space-y-3 group cursor-default">
                        <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-2 text-dream-500 dark:text-dream-400 bg-white dark:bg-night-800 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                            <Wind size={20} />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Psychoanalysis</h3>
                    </div>
                    <div className="space-y-3 group cursor-default">
                        <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-2 text-dream-500 dark:text-dream-400 bg-white dark:bg-night-800 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                            <Activity size={20} />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Health Insights</h3>
                    </div>
                     <div className="space-y-3 group cursor-default">
                        <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-2 text-dream-500 dark:text-dream-400 bg-white dark:bg-night-800 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                            <CloudMoon size={20} />
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Symbol Decoding</h3>
                    </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
