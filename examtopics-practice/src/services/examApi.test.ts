import { afterEach, expect, test, vi } from 'vitest';
import { examApi } from './examApi';

// ARCH-003: admin mutations must surface server failures instead of resolving silently.

function stubFetch(status: number, body: unknown) {
  const fetch = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(body === undefined ? '' : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

afterEach(() => vi.unstubAllGlobals());

test('createExam rejects with the server error for 4xx responses', async () => {
  stubFetch(409, { success: false, error: 'Exam code already exists. Please use a different code or name.' });
  await expect(examApi.createExam({ name: 'N' }, 'token')).rejects.toThrow('Exam code already exists');

  stubFetch(400, { success: false, error: 'Name and description are required' });
  await expect(examApi.createExam({}, 'token')).rejects.toThrow('Name and description are required');
});

test('mutations reject a legacy HTTP 200 success:false body', async () => {
  stubFetch(200, { success: false, message: 'Invalid JSON format in questions array' });
  await expect(examApi.createExam({}, 'token')).rejects.toThrow('Invalid JSON format in questions array');

  stubFetch(200, { success: false, message: 'Questions must be an array' });
  await expect(examApi.updateExam('aws', {}, 'token')).rejects.toThrow('Questions must be an array');
});

test('updateExam, updateQuestion and deleteExam reject with server errors or a fallback', async () => {
  stubFetch(403, { success: false, error: 'Forbidden' });
  await expect(examApi.updateExam('aws', {}, 'token')).rejects.toThrow('Forbidden');

  stubFetch(400, { success: false, error: 'Provide at least one field to update' });
  await expect(examApi.updateQuestion('aws', 1, 2, {}, 'token')).rejects.toThrow('Provide at least one field to update');

  stubFetch(500, undefined);
  await expect(examApi.deleteExam('aws', 'token')).rejects.toThrow('Failed to delete exam');
});

test('successful mutations resolve with the response payload', async () => {
  const fetch = stubFetch(201, { success: true, exam: { code: 'aws' } });
  await expect(examApi.createExam({ name: 'N' }, 'token')).resolves.toEqual({ success: true, exam: { code: 'aws' } });
  expect(fetch.mock.calls[0][1]).toMatchObject({ method: 'POST', headers: { Authorization: 'Bearer token' } });

  stubFetch(200, { success: true, exam: { code: 'aws', name: 'N' } });
  await expect(examApi.updateExam('aws', {}, 'token')).resolves.toEqual({ code: 'aws', name: 'N' });

  stubFetch(200, { success: true, question: { question_number: 2 } });
  await expect(examApi.updateQuestion('aws', 1, 2, { link: 'https://x' }, 'token')).resolves.toEqual({ question_number: 2 });

  stubFetch(200, { success: true, message: 'Exam deleted successfully' });
  await expect(examApi.deleteExam('aws', 'token')).resolves.toBeUndefined();
});
