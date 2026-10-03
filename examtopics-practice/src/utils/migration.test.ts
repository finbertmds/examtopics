import { resolveCurrentTopic } from './migration';

describe('resolveCurrentTopic', () => {
  it('prefers the stored current topic over answered topics', () => {
    expect(resolveCurrentTopic({
      currentTopic: 2,
      answers: {
        '2-10': { topicNumber: 2 },
        '5-1': { topicNumber: 5 },
      },
    })).toBe(2);
  });

  it('falls back to the highest answered topic when currentTopic is missing', () => {
    expect(resolveCurrentTopic({
      answers: {
        '1-10': { topicNumber: 1 },
        '4-2': { topicNumber: 4 },
        '2-8': { topicNumber: 2 },
      },
    })).toBe(4);
  });

  it('defaults to topic 1 if neither currentTopic nor answers exist', () => {
    expect(resolveCurrentTopic({ answers: {} })).toBe(1);
  });
});