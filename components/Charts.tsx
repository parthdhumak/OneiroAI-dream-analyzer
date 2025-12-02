import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';

interface ChartsProps {
  stressLevel: number;
  dreamLevel: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-night-900 border border-slate-100 dark:border-slate-700 px-3 py-2 rounded shadow-xl text-xs">
        <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
        <p className="text-dream-600 dark:text-dream-400">{`${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const StressChart: React.FC<{ value: number }> = ({ value }) => {
  const data = [
    { name: 'Relaxed', value: 100 - value, type: 'Buffer' },
    { name: 'Stress', value: value, type: 'Load' },
  ];

  const isHigh = value > 70;
  const isMed = value > 40;
  const color = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';

  return (
    <div className="h-48 w-full">
      <h3 className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-semibold text-center">
        Stress Load
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.5} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={5} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.name === 'Stress' ? color : '#e2e8f0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-[-15px] relative z-10 pointer-events-none">
        <span className="text-lg font-bold text-slate-700 dark:text-white drop-shadow-sm">{value}%</span>
      </div>
    </div>
  );
};

export const CompositionChart: React.FC<{ dreamLevel: number; stressLevel: number }> = ({ dreamLevel, stressLevel }) => {
    // Synthesizing data for the radar based on the two real inputs for visual flair
    const intensity = (dreamLevel / 5) * 100;
    const clarity = Math.max(10, 100 - stressLevel); 
    const emotion = Math.min(100, stressLevel + 20);
    const symbolism = dreamLevel * 20;
    const prophecy = dreamLevel === 5 ? 90 : dreamLevel * 10;

    const data = [
        { subject: 'Intensity', A: intensity, fullMark: 100 },
        { subject: 'Clarity', A: clarity, fullMark: 100 },
        { subject: 'Emotion', A: emotion, fullMark: 100 },
        { subject: 'Symbolism', A: symbolism, fullMark: 100 },
        { subject: 'Abstract', A: prophecy, fullMark: 100 },
    ];

    return (
        <div className="h-56 w-full -ml-4">
            <h3 className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-semibold text-center pl-4">
                Composition
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Dream Factor"
                        dataKey="A"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="#8b5cf6"
                        fillOpacity={0.2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}