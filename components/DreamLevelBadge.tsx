import React from 'react';
import { Activity, Zap, Moon, Star, Eye } from 'lucide-react';

interface DreamLevelBadgeProps {
  level: number;
  label: string;
}

const DreamLevelBadge: React.FC<DreamLevelBadgeProps> = ({ level, label }) => {
  // Using gradient classes for higher visual impact
  const getLevelColor = (lvl: number) => {
      if (lvl === 5) return 'bg-gradient-to-r from-red-500 to-orange-500';
      if (lvl === 4) return 'bg-gradient-to-r from-orange-400 to-yellow-400';
      return 'bg-gradient-to-r from-dream-500 to-mystic-500';
  };
  
  const activeClass = getLevelColor(level);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Intensity Level {level}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="text-xs font-semibold text-dream-600 dark:text-dream-400">{label}</span>
        </div>
        
        {/* Visual Level Bar */}
        <div className="flex gap-1.5 h-1.5 w-24">
            {[1, 2, 3, 4, 5].map((i) => (
                <div 
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                        i <= level 
                            ? activeClass
                            : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                />
            ))}
        </div>
    </div>
  );
};

export default DreamLevelBadge;