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
}
