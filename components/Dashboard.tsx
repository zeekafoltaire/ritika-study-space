



import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { quotes } from '../data/quotes';

// --- ICONS ---
const CheckCircleIcon = ({className}:{className?:string}) => <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const TimerIcon = ({className}:{className?:string}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const QuoteIcon = ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/></svg>;


// --- WIDGET COMPONENTS ---

const Welcome: React.FC = () => {
    const [date, setDate] = useState('');
    useEffect(() => {
        setDate(new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Welcome back, Ritika!</h1>
            <p className="text-brand-text-secondary mt-1">{date}</p>
            <p className="text-brand-text-secondary mt-4">Study Smart. Stay Focused. <span className="text-brand-accent font-semibold italic">You Got This.</span></p>
        </div>
    );
};

const TodaysTasks: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
            <h3 className="font-semibold text-brand-text-primary mb-3">Today's Tasks</h3>
            <ul className="space-y-3">
                {tasks.slice(0, 4).map(task => (
                    <li key={task.id} className="flex items-center gap-3">
                        {task.completed
                            ? <CheckCircleIcon className="w-5 h-5 text-brand-primary"/>
                            : <div className="w-5 h-5 rounded-full border-2 border-brand-secondary"></div>
                        }
                        <span className={`flex-1 ${task.completed ? 'line-through text-brand-text-secondary' : 'text-brand-text-primary'}`}>{task.text}</span>
                    </li>
                ))}
                 {tasks.length === 0 && <p className="text-brand-text-secondary text-sm">No tasks for today. Add some!</p>}
            </ul>
        </div>
    );
};

interface TimerWidgetProps {
    timeLeft: number;
    isTimerActive: boolean;
    timerMode: 'work' | 'break';
}

const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TimerWidget: React.FC<TimerWidgetProps> = ({ timeLeft, isTimerActive, timerMode }) => {
    const statusText = isTimerActive ? (timerMode === 'work' ? "Focusing..." : "On a break...") : "Paused";
    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
            <h3 className="font-semibold text-brand-text-primary mb-3">Maalkin's Timer</h3>
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <TimerIcon className="w-6 h-6 text-brand-primary" />
                    <span className="text-3xl font-mono font-bold text-white">{formatTime(timeLeft)}</span>
                </div>
                <p className="text-sm text-brand-text-secondary mt-1">{statusText}</p>
            </div>
        </div>
    )
};

const QuoteOfTheDay: React.FC = () => {
    const [dailyQuote, setDailyQuote] = useState({ quote: '', author: '' });

    useEffect(() => {
        const getDayOfYear = () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 0);
            const diff = now.getTime() - start.getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        };

        const dayIndex = getDayOfYear();
        const quoteIndex = dayIndex % quotes.length;
        setDailyQuote(quotes[quoteIndex]);
    }, []);

    return (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col justify-center items-center text-center col-span-1 md:col-span-2">
            <QuoteIcon className="w-8 h-8 text-brand-primary opacity-50 mb-3" />
            <p className="text-lg font-medium text-brand-text-primary italic">"{dailyQuote.quote}"</p>
            <p className="text-sm text-brand-text-secondary mt-2">- {dailyQuote.author}</p>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
interface DashboardProps {
    tasks: Task[];
    // Timer props
    timeLeft: number;
    isTimerActive: boolean;
    timerMode: 'work' | 'break';
}

const Dashboard: React.FC<DashboardProps> = ({ 
    tasks, 
    timeLeft, 
    isTimerActive, 
    timerMode,
}) => {
  return (
    <div className="p-6">
        <div className="space-y-6">
            <Welcome />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TodaysTasks tasks={tasks} />
                <TimerWidget timeLeft={timeLeft} isTimerActive={isTimerActive} timerMode={timerMode} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuoteOfTheDay />
             </div>
        </div>
    </div>
  );
};

export default Dashboard;