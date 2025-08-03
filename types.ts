

export enum Page {
    Dashboard = 'Dashboard',
    TodoList = 'To-Do List',
    SubjectNotes = 'Subject Notes',
    ProblemSolver = 'Problem Solver',
    ExamTracker = 'Exam Tracker',
    PomodoroTimer = "Maalkin's Timer",
    PeriodicTable = 'Periodic Table',
    Calculator = 'Calculator',
    UnitConverter = 'Unit Converter',
    EquationBalancer = 'Equation Balancer',
    Settings = 'Settings',
}

export type AIHelperTab = 'ask' | 'diary';


export interface Task {
  id: number;
  text: string;
  completed: boolean;
  subject: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface Doubt {
    id: number;
    question: string;
    answer: string;
    type: 'text';
}

export interface Exam {
  id: number;
  name: string;
  date: string; // The exam date
  start_date: string; // The date preparation starts
  progress: number; // This will be kept in DB for reference but UI will calculate dynamically
}

export interface Subject {
  id: number;
  name: string;
}

export interface Profile {
  id: number;
  username: string;
  avatar_url: string;
}

export interface Problem {
  id: number;
  question: string;
  subject: string;
  topic: string;
  status: 'correct' | 'incorrect' | 'unsolved';
  is_bookmarked: boolean;
  user_solution: string | null;
  ai_solution: string | null;
}

// For RevisionHub
export interface Deck {
  id: number;
  name: string;
  subject: string;
}

export interface Card {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  // For spaced repetition
  due_date: string;
  interval: number; // in days
  ease_factor: number; // multiplier for next interval
}

// For FormulaSheets
export interface Formula {
  id: number;
  subject: string;
  topic: string;
  formula_text: string;
  description: string;
}

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task & { created_at: string };
        Insert: Omit<Task, 'id'>;
        Update: {
          id?: number;
          text?: string;
          completed?: boolean;
          subject?: string;
        };
      };
      exams: {
        Row: Exam & { created_at: string };
        Insert: Omit<Exam, 'id'>;
        Update: {
          id?: number;
          name?: string;
          date?: string;
          start_date?: string;
          progress?: number;
        };
      };
      doubts: {
        Row: Doubt & { created_at: string };
        Insert: Omit<Doubt, 'id'>;
        Update: {
          id?: number;
          question?: string;
          answer?: string;
          type?: "text";
        };
      };
      subjects: {
        Row: Subject & { created_at: string };
        Insert: Omit<Subject, 'id'>;
        Update: {
          id?: number;
          name?: string;
        };
      };
      profiles: {
        Row: Profile & { created_at: string };
        Insert: Omit<Profile, 'id'>;
        Update: {
          id?: number;
          username?: string;
          avatar_url?: string;
        };
      };
      problems: {
        Row: Problem & { created_at: string };
        Insert: Omit<Problem, 'id'>;
        Update: {
          id?: number;
          question?: string;
          subject?: string;
          topic?: string;
          status?: "correct" | "incorrect" | "unsolved";
          is_bookmarked?: boolean;
          user_solution?: string | null;
          ai_solution?: string | null;
        };
      };
      decks: {
        Row: Deck & { created_at: string };
        Insert: Omit<Deck, 'id'>;
        Update: {
          id?: number;
          name?: string;
          subject?: string;
        };
      };
      cards: {
        Row: Card & { created_at: string };
        Insert: Omit<Card, 'id'>;
        Update: {
          id?: number;
          deck_id?: number;
          front?: string;
          back?: string;
          due_date?: string;
          interval?: number;
          ease_factor?: number;
        };
      };
      formulas: {
        Row: Formula & { created_at: string };
        Insert: Omit<Formula, 'id'>;
        Update: {
          id?: number;
          subject?: string;
          topic?: string;
          formula_text?: string;
          description?: string;
        };
      };
    };
    Functions: {};
    Enums: {};
  };
};