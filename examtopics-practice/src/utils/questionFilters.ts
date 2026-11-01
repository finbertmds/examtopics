import { FilterState, Question, UserProgress } from '../types';

export const getFilteredQuestions = (
  questions: Question[],
  progress: UserProgress,
  filterState: FilterState,
): Question[] => {
  let filtered = questions;

  // First filter by selected topic
  if (filterState.selectedTopic !== 'all') {
    filtered = filtered.filter(q => q.topic_number === filterState.selectedTopic);
  }

  // Then apply other filters
  switch (filterState.type) {
    case 'answered':
      filtered = filtered.filter(q => {
        const key = `${q.topic_number}-${q.question_number}`;
        return progress.answers[key];
      });
      break;
    case 'unanswered':
      filtered = filtered.filter(q => {
        const key = `${q.topic_number}-${q.question_number}`;
        return !progress.answers[key];
      });
      break;
    case 'correct':
      filtered = filtered.filter(q => {
        const key = `${q.topic_number}-${q.question_number}`;
        const answer = progress.answers[key];
        return answer && answer.isCorrect;
      });
      break;
    case 'incorrect':
      filtered = filtered.filter(q => {
        const key = `${q.topic_number}-${q.question_number}`;
        const answer = progress.answers[key];
        return answer && !answer.isCorrect;
      });
      break;
    case 'training':
      filtered = filtered.filter(q => {
        const key = `${q.topic_number}-${q.question_number}`;
        return progress.markedForTraining.includes(key);
      });
      break;
    default:
      break;
  }

  return filtered;
};
