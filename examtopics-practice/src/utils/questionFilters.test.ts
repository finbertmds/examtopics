import { getFilteredQuestions } from './questionFilters';
import { FilterState, Question, UserProgress } from '../types';

const questions: Question[] = [
  [1, 3], [1, 12], [2, 20], [1, 30],
].map(([topic_number, question_number]) => ({
  topic_number, question_number, answers: {}, suggested_answer: 'A',
  multiple_choice: false, question_text: 'Question',
}));
const progress: UserProgress = {
  examId: 'test', currentTopic: 1, currentQuestion: 30, isRandomized: false,
  markedForTraining: ['1-3'],
  answers: Object.fromEntries(questions.slice(0, 3).map(q => [
    `${q.topic_number}-${q.question_number}`,
    { topicNumber: q.topic_number!, questionNumber: q.question_number,
      selectedAnswers: ['A'], isCorrect: q.question_number !== 12, answeredAt: new Date() },
  ])),
};

it.each([
  ['all', 'all', [3, 12, 20]],
  ['answered', 1, [3, 12]],
  ['correct', 1, [3]],
  ['incorrect', 'all', [12]],
  ['training', 'all', [3]],
  ['unanswered', 'all', []],
  ['all', 99, []],
] as const)('limits answered scroll candidates to %s / topic %s', (type, selectedTopic, expected) => {
  const filter: FilterState = { type, selectedTopic, showCorrect: true, showIncorrect: true };
  const original = { ...filter };
  const answered = getFilteredQuestions(questions, progress, filter)
    .filter(q => progress.answers[`${q.topic_number}-${q.question_number}`]);
  expect(answered.map(q => q.question_number)).toEqual(expected);
  expect(filter).toEqual(original);
});
