


import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import ExamTracker from './components/ExamTracker';
import SubjectList from './components/SubjectList';
import NoteEditor from './components/NoteEditor';
import PomodoroTimer from './components/PomodoroTimer';
import ChatbotWidget from './components/ChatbotWidget';
import Settings from './components/Settings';
import PeriodicTable from './components/PeriodicTable';
import ProblemSolver from './components/ProblemSolver';
import ProblemView from './components/ProblemView';
import Calculator from './components/Calculator';
import UnitConverter from './components/UnitConverter';
import EquationBalancer from './components/EquationBalancer';
import DailyChallenge from './components/DailyChallenge';


import { Page, Task, Exam, Doubt, Subject, Profile, Problem, ChatMessage } from './types';
import { getCollection, addDocument, updateDocument, deleteDocument } from './services/supabaseService';
import { supabase } from './services/supabase';


const App: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data state
    const [tasks, setTasks] = useState<Task[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    
    // View-specific state
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    
    // --- Timer State ---
    const [workDuration, setWorkDuration] = useState(25 * 60);
    const [breakDuration, setBreakDuration] = useState(5 * 60);
    const [timeLeft, setTimeLeft] = useState(workDuration);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
    const targetTimeRef = useRef<number | null>(null);
    const timerAudioRef = useRef<HTMLAudioElement>(null);


    // Fetch initial data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tasksData, examsData, doubtsData, subjectsData, profileData, problemsData] = await Promise.all([
                getCollection('tasks'),
                getCollection('exams', 'date', 'asc'),
                getCollection('doubts'),
                getCollection('subjects', 'name', 'asc'),
                getCollection('profiles'),
                getCollection('problems'),
            ]);
            setTasks(tasksData.reverse());
            setExams(examsData);
            setDoubts(doubtsData.reverse());
            setSubjects(subjectsData);
            setProblems(problemsData);
            setProfile(profileData[0] || null);

        } catch (err) {
            console.error("Failed to fetch data from Supabase:", err);
            const friendlyError = "Database connection failed. This might be due to security policies or missing tables. Check the browser's developer console (F12) for the full error.";
            setError(friendlyError);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset selections when changing page
    useEffect(() => {
        if(activePage !== Page.SubjectNotes) setSelectedSubject(null);
        if(activePage !== Page.ProblemSolver) setSelectedProblem(null);
    }, [activePage])

    // --- Timer Logic (robust against tab changes) ---
    const notifyUser = useCallback((message: string) => {
        timerAudioRef.current?.play().catch(e => console.error("Audio play failed", e));
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            new Notification(message);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') new Notification(message);
            });
        }
    }, []);
    
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isTimerActive) {
            if (targetTimeRef.current === null) {
                targetTimeRef.current = Date.now() + timeLeft * 1000;
            }

            interval = setInterval(() => {
                const remaining = targetTimeRef.current! - Date.now();
                if (remaining <= 0) {
                    setTimeLeft(0);
                    const newMode = timerMode === 'work' ? 'break' : 'work';
                    const newDuration = newMode === 'work' ? workDuration : breakDuration;
                    const message = newMode === 'work' ? "Break's over! Time to focus." : "Time for a break!";
                    
                    notifyUser(message);
                    setTimerMode(newMode);
                    setTimeLeft(newDuration);
                    setIsTimerActive(false); 
                    targetTimeRef.current = null;
                } else {
                    setTimeLeft(Math.round(remaining / 1000));
                }
            }, 500);
        }

        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft, timerMode, workDuration, breakDuration, notifyUser]);

    const handleStartTimer = () => setIsTimerActive(true);
    const handlePauseTimer = () => {
        setIsTimerActive(false);
        targetTimeRef.current = null;
    };

    const handleResetTimer = useCallback(() => {
        setIsTimerActive(false);
        targetTimeRef.current = null;
        setTimerMode('work');
        setTimeLeft(workDuration);
    }, [workDuration]);

    const handleSetDurations = (newWork: number, newBreak: number) => {
        setWorkDuration(newWork);
        setBreakDuration(newBreak);
        setTimerMode('work');
        setTimeLeft(newWork);
        setIsTimerActive(false);
        targetTimeRef.current = null;
    }

    // --- CRUD Handlers ---
    const handleAddTask = async (text: string, subject: string) => {
        try {
            const newTask = await addDocument('tasks', { text, completed: false, subject });
            setTasks(prev => [newTask, ...prev]);
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleToggleTask = async (id: number, completed: boolean) => {
        try {
            await updateDocument('tasks', id, { completed });
            setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleDeleteTask = async (id: number) => {
        try {
            await deleteDocument('tasks', id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleAddExam = async (name: string, date: string) => {
        try {
            const newExam = await addDocument('exams', { 
              name, 
              date, 
              progress: 0, 
              start_date: new Date().toISOString() // Set start date to now
            });
            setExams(prev => [...prev, newExam].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleUpdateExam = async (id: number, data: Partial<Exam>) => {
        try {
            const updateData = { ...data };
            delete updateData.progress;

            await updateDocument('exams', id, updateData);
            setExams(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleDeleteExam = async (id: number) => {
        try {
            await deleteDocument('exams', id);
            setExams(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleAddDoubt = async (doubt: Omit<Doubt, 'id'>) => {
        try {
            const newDoubt = await addDocument('doubts', doubt);
            setDoubts(prev => [newDoubt, ...prev]);
        } catch (err) {
            console.error("Failed to save doubt:", err);
        }
    };
    const handleAddSubject = async (name: string) => {
        try {
            const newSubject = await addDocument('subjects', { name });
            setSubjects(prev => [...prev, newSubject].sort((a,b) => a.name.localeCompare(b.name)));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleUpdateSubject = async (id: number, name: string) => {
        try {
            await updateDocument('subjects', id, { name });
            setSubjects(prev => prev.map(s => s.id === id ? { ...s, name } : s));
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    const handleDeleteSubject = async (id: number) => {
        try {
            const { error: storageError } = await supabase.storage.from('notes').remove([id.toString()]);
            if (storageError && storageError.message !== 'The resource was not found') {
                 console.warn(`Could not delete note file for subject ${id}, but proceeding with DB deletion:`, storageError.message);
            }
            
            await deleteDocument('subjects', id);
            setSubjects(prev => prev.filter(s => s.id !== id));
            if (selectedSubject?.id === id) setSelectedSubject(null);
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    
    // --- PROBLEM HANDLERS ---
    const handleAddProblem = async (question: string, subject: string, topic: string) => {
        try {
            const newProblem = await addDocument('problems', { question, subject, topic, status: 'unsolved', is_bookmarked: false, user_solution: null, ai_solution: null });
            setProblems(prev => [newProblem, ...prev]);
        } catch (err) {
            alert(`Error adding problem: ${(err as Error).message}`);
        }
    };
    const handleUpdateProblem = async (id: number, data: Partial<Problem>) => {
        try {
            await updateDocument('problems', id, data);
            const updatedProblems = problems.map(p => p.id === id ? { ...p, ...data } : p);
            setProblems(updatedProblems);
            if(selectedProblem?.id === id) {
                setSelectedProblem(updatedProblems.find(p => p.id === id) || null);
            }
        } catch (err) {
            alert(`Error updating problem: ${(err as Error).message}`);
        }
    };
    const handleDeleteProblem = async (id: number) => {
        try {
            await deleteDocument('problems', id);
            setProblems(prev => prev.filter(p => p.id !== id));
            setSelectedProblem(null);
        } catch (err) {
            alert(`Error deleting problem: ${(err as Error).message}`);
        }
    };

    const handleUpdateProfile = async (data: Partial<Profile>) => {
        if (!profile) return;
        try {
            await updateDocument('profiles', profile.id, data);
            setProfile(p => p ? { ...p, ...data } : null);
            alert("Profile updated successfully!");
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
    };


    const renderPage = () => {
        if (isLoading) {
            return (
                <div className="p-8 text-center flex items-center justify-center h-full">
                    <div className="flex items-center gap-2 text-brand-text-secondary">
                        <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading Ritika's Space...</span>
                    </div>
                </div>
            );
        }
        
        if (error) {
            return (
                 <div className="p-8 text-center flex items-center justify-center h-full">
                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-6 rounded-lg max-w-lg text-center">
                        <h3 className="font-bold text-lg mb-2">Database Connection Error</h3>
                        <p className="text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchData}
                            className="bg-brand-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-brand-primary-hover transition-colors"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            )
        }

        switch (activePage) {
            case Page.Dashboard:
                return <Dashboard
                    tasks={tasks} 
                    timeLeft={timeLeft} 
                    isTimerActive={isTimerActive} 
                    timerMode={timerMode} 
                    onStartChallenge={() => setActivePage(Page.DailyChallenge)}
                />;
            case Page.TodoList:
                return <div className="p-4 md:p-6"><TaskList tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} /></div>;
            case Page.ExamTracker:
                return <div className="p-4 md:p-6"><ExamTracker exams={exams} onAddExam={handleAddExam} onUpdateExam={handleUpdateExam} onDeleteExam={handleDeleteExam} /></div>;
            case Page.SubjectNotes:
                 return (
                    <div className="p-4 md:p-6">
                        {selectedSubject ? (
                            <NoteEditor 
                                subject={selectedSubject} 
                                onBack={() => setSelectedSubject(null)}
                            />
                        ) : (
                            <SubjectList 
                                subjects={subjects} 
                                onAddSubject={handleAddSubject} 
                                onUpdateSubject={handleUpdateSubject} 
                                onDeleteSubject={handleDeleteSubject}
                                onSelectSubject={setSelectedSubject}
                            />
                        )}
                    </div>
                 );
            case Page.ProblemSolver:
                 return (
                    <div className="p-4 md:p-6">
                       {selectedProblem ? (
                            <ProblemView
                                problem={selectedProblem}
                                onBack={() => setSelectedProblem(null)}
                                onUpdate={handleUpdateProblem}
                                onDelete={handleDeleteProblem}
                            />
                       ) : (
                           <ProblemSolver
                                problems={problems}
                                subjects={subjects}
                                onAddProblem={handleAddProblem}
                                onSelectProblem={setSelectedProblem}
                           />
                       )}
                    </div>
                );
            case Page.DailyChallenge:
                return <div className="p-4 md:p-6"><DailyChallenge onBackToDashboard={() => setActivePage(Page.Dashboard)} /></div>;
            case Page.PeriodicTable:
                return <div className="p-4 md:p-6"><PeriodicTable /></div>;
            case Page.Calculator:
                return <div className="p-4 md:p-6"><Calculator /></div>;
            case Page.UnitConverter:
                return <div className="p-4 md:p-6"><UnitConverter /></div>;
            case Page.EquationBalancer:
                return <div className="p-4 md:p-6"><EquationBalancer /></div>;
            case Page.PomodoroTimer:
                return <div className="p-4 md:p-6"><PomodoroTimer timeLeft={timeLeft} isTimerActive={isTimerActive} timerMode={timerMode} workDuration={workDuration} breakDuration={breakDuration} onStart={handleStartTimer} onPause={handlePauseTimer} onReset={handleResetTimer} onSetDurations={handleSetDurations} /></div>;
            case Page.Settings:
                return <div className="p-4 md:p-6"><Settings profile={profile} onUpdateProfile={handleUpdateProfile} /></div>;
            default:
                return <div className="p-8 text-center"><h1 className="text-2xl font-bold">Welcome to {activePage}</h1><p>This page is under construction.</p></div>;
        }
    };

    return (
        <div className="flex h-screen bg-brand-bg text-brand-text-primary font-sans">
            <audio ref={timerAudioRef} src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3" preload="auto" />
            <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} profile={profile} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
            <ChatbotWidget onAddDoubt={handleAddDoubt} profile={profile} messages={chatMessages} setMessages={setChatMessages} />
        </div>
    );
};

export default App;