export const getCorrectAnswers = (suggestedAnswer: string): string[] => {
  return suggestedAnswer.includes('_')
    ? suggestedAnswer.split('_').filter(Boolean).sort()
    : suggestedAnswer.split('').sort();
};