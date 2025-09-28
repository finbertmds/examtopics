export interface Question {
  title: string;
  topic_number: number;
  question_number: number;
  answers: Record<string, string>;
  suggested_answer: string;
  answer: string;
  link: string;
  multiple_choice: boolean;
  question_text: string;
  question_images: string[];
  answer_images: string[];
}

export interface Exam {
  id: string;
  name: string | {
    en: string;
    vi: string;
    ja: string;
  };
  slug: string;
  description: string | {
    en: string;
    vi: string;
    ja: string;
  };
  questionCount: number;
  file: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tags: string[];
}

export interface UserAnswer {
  topicNumber: number;
  questionNumber: number;
  selectedAnswers: string[];
  isCorrect: boolean;
  answeredAt: Date;
}

export interface UserProgress {
  examId: string;
  answers: Record<string, UserAnswer>; // Key format: "topicNumber-questionNumber"
  markedForTraining: string[]; // Changed from number[] to string[] with format "topicNumber-questionNumber"
  currentTopic: number;
  currentQuestion: number;
  isRandomized: boolean;
}

export type FilterType = 'all' | 'answered' | 'unanswered' | 'correct' | 'incorrect' | 'training';

export interface FilterState {
  type: FilterType;
  showCorrect: boolean;
  showIncorrect: boolean;
  selectedTopic: number | 'all'; // 'all' means show all topics, number means specific topic
}

export interface HistoryEntry {
  _id: string;
  examId: string;
  progress: Record<string, any>;
  markedForTraining: string[];
  score: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
  };
  answeredCount: number;
  submittedAt: string;
}

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProgressData {
  examId: string;
  answers: Record<string, any>;
  markedForTraining: string[]; // Changed to string[] to match UserProgress
  currentQuestion: number;
  isRandomized: boolean;
  lastUpdated: string;
}

export interface AllProgressData {
  progress: Record<string, ProgressData>;
}

export interface HistoryData {
  history: HistoryEntry[];
}

export interface StatsData {
  stats: {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    accuracy: number;
    markedForTraining: number;
  }
}

export interface ReportData {
  topicNumber: number;
  questionNumber: number;
  examId: string;
  reason: string;
  comment: string;
  user: string | null;
  url: string;
}

export interface UserData {
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string; // Google profile picture URL
}
