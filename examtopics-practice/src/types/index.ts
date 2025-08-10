export interface Question {
  question_text: string;
  question_number: number;
  answers: Record<string, string>;
  suggested_answer: string;
  answer: string;
  view_link: string;
  multiple_choice: boolean;
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  file: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tags: string[];
}

export interface UserAnswer {
  questionNumber: number;
  selectedAnswers: string[];
  isCorrect: boolean;
  answeredAt: Date;
}

export interface UserProgress {
  examId: string;
  answers: Record<number, UserAnswer>;
  markedForTraining: number[];
  currentQuestion: number;
  isRandomized: boolean;
  startTime?: Date;
  lastSessionTime?: Date;
}

export type FilterType = 'all' | 'answered' | 'unanswered' | 'correct' | 'incorrect' | 'training';

export interface FilterState {
  type: FilterType;
  showCorrect: boolean;
  showIncorrect: boolean;
}
