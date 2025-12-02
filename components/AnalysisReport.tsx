import React, { useState } from 'react';
import { DreamAnalysis } from '../types';
import DreamLevelBadge from './DreamLevelBadge';
import { StressChart, CompositionChart } from './Charts';
import { 
  Sparkles, 
  Brain, 
  HeartPulse, 
  ChevronDown, 
  Save,
  Check
} from 'lucide-react';

interface SectionProps {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children, defaultOpen = true, className = "" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <section className={`bg-white dark:bg-night-800 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:border-slate-700 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          {Icon && (
              <div className="p-2 rounded-lg bg-dream-50 dark:bg-dream-900/20 text-dream-500 dark:text-dream-400 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={20} />
              </div>
          )}
          <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h2>
        </div>
        <div className={`transform transition-transform duration-300 text-slate-300 group-hover:text-slate-500 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 pb-8 pt-2">
           {children}
        </div>
      </div>
    </section>
  );
};

interface Props {
  analysis: DreamAnalysis;
  onSave: (analysis: DreamAnalysis) => void;
  isSaved: boolean;
}

const AnalysisReport: React.FC<Props> = ({ analysis, onSave, isSaved }) => {

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-20 px-0 sm:px-4">
      
      {/* Header Section */}
      <div className="glass-panel rounded-2xl p-8 sm:p-12 shadow-xl border border-white/20 dark:border-slate-700/50 mb-10 relative overflow-hidden group transition-all duration-500">
        {/* Ambient Background Glows */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-dream-500/10 dark:bg-dream-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-mystic-500/10 dark:bg-mystic-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"></div>

        <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                <div className="space-y-4 max-w-2xl">
                    <DreamLevelBadge level={analysis.dreamLevel} label={analysis.dreamLevelLabel} />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                        {analysis.title}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                      onClick={() => onSave(analysis)}
                      disabled={isSaved}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all flex-shrink-0 shadow-lg ${
                          isSaved 
                          ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900 cursor-default shadow-none'
                          : 'bg-gradient-to-r from-dream-500 to-mystic-500 hover:from-dream-600 hover:to-mystic-600 text-white shadow-dream-500/20 hover:shadow-dream-500/40 border border-transparent hover:-translate-y-0.5'
                      }`}
                  >
                      {isSaved ? <Check size={16} /> : <Save size={16} />}
                      {isSaved ? 'Saved' : 'Save Analysis'}
                  </button>
                </div>
            </div>
            
            <div className="relative">
                <span className="absolute -left-4 -top-2 text-6xl text-dream-200 dark:text-dream-900 font-serif opacity-50 select-none">“</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-serif text-lg sm:text-xl italic pl-6 pr-4 relative z-10">
                    {analysis.summary}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Interpretation */}
          <Section title="Interpretation" icon={Sparkles} defaultOpen={true}>
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-8 font-serif">
                  {analysis.interpretation}
              </p>
            </div>
          </Section>

          {/* Symbol Table */}
          <div className="bg-white dark:bg-night-800 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
                <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-100">Symbolic Decoding</h2>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-700">
                            <th className="py-4 px-8 w-[20%]">Symbol</th>
                            <th className="py-4 px-4 w-[25%]">Archetype</th>
                            <th className="py-4 px-8">Meaning</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {analysis.symbols.map((symbol, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors duration-200">
                                <td className="py-5 px-8 align-top">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b-2 border-transparent group-hover:border-dream-300 transition-all">{symbol.name}</span>
                                </td>
                                <td className="py-5 px-4 align-top">
                                    <div className="inline-block transform group-hover:scale-105 transition-transform duration-200">
                                      <div className="px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-300 block text-center">
                                            {symbol.archetype}
                                        </span>
                                      </div>
                                    </div>
                                </td>
                                <td className="py-5 px-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed align-top">
                                    {symbol.meaning}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
          
          {/* Waking Life Correlation */}
          <Section title="Waking Life Correlation" icon={Brain} defaultOpen={true}>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                {analysis.healthReport.wakingLifeCorrelation}
            </p>
          </Section>

        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Metrics Card */}
          <div className="bg-white dark:bg-night-800 rounded-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Oneirometrics</h2>
                <div className="h-px flex-grow bg-slate-100 dark:bg-slate-800 ml-4"></div>
            </div>
            
            <div className="space-y-10">
                <StressChart value={analysis.psychologicalState.stressLevel} />
                <CompositionChart dreamLevel={analysis.dreamLevel} stressLevel={analysis.psychologicalState.stressLevel} />
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="mb-6">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-2">Burnout Risk</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                        analysis.psychologicalState.burnoutRisk === 'Severe' || analysis.psychologicalState.burnoutRisk === 'High'
                        ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400'
                        : analysis.psychologicalState.burnoutRisk === 'Moderate'
                        ? 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/20 dark:border-orange-900 dark:text-orange-400'
                        : 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${
                             analysis.psychologicalState.burnoutRisk === 'Severe' || analysis.psychologicalState.burnoutRisk === 'High' ? 'bg-red-500' :
                             analysis.psychologicalState.burnoutRisk === 'Moderate' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                        <span className="font-bold text-sm">{analysis.psychologicalState.burnoutRisk}</span>
                    </div>
                </div>
                
                {/* Emotions List */}
                <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-3">Emotions Detected</span>
                    <div className="flex flex-wrap gap-2">
                        {analysis.psychologicalState.emotions.map((emotion, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-dream-300 dark:hover:border-dream-600 transition-colors cursor-default">
                                {emotion}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Health Card */}
          <div className="bg-white dark:bg-night-800 rounded-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-teal-50 dark:bg-teal-900/20 rounded-md">
                    <HeartPulse size={16} className="text-teal-500" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sleep Health</h2>
            </div>

             <div className="space-y-6">
                <div className="pb-4 border-b border-slate-50 dark:border-slate-800/50">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Quality Forecast</h4>
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        {analysis.healthReport.sleepQualityLikelihood}
                    </p>
                </div>

                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Suggested Routine</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {analysis.healthReport.suggestedBedtimeRoutine}
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;