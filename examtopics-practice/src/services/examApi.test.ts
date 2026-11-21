import { afterEach, expect, test, vi } from 'vitest';
import { networkService } from './networkService';
import { apiRequest } from '../utils/apiClient';
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
  const init = fetch.mock.calls[0][1]!;
  expect(init.method).toBe('POST');
  expect(new Headers(init.headers).get('Authorization')).toBe('Bearer token');
  expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
  expect(init.body).toBe(JSON.stringify({ name: 'N' }));

  stubFetch(200, { success: true, exam: { code: 'aws', name: 'N' } });
  await expect(examApi.updateExam('aws', {}, 'token')).resolves.toEqual({ code: 'aws', name: 'N' });

  stubFetch(200, { success: true, question: { question_number: 2 } });
  await expect(examApi.updateQuestion('aws', 1, 2, { link: 'https://x' }, 'token')).resolves.toEqual({ question_number: 2 });

  stubFetch(200, { success: true, message: 'Exam deleted successfully' });
  await expect(examApi.deleteExam('aws', 'token')).resolves.toBeUndefined();
});

// ARCH-002: read paths use the shared apiClient transport with the same URLs and behaviour.
function sentRequest(fetch: ReturnType<typeof stubFetch>, index = 0) {
  const [url, init] = fetch.mock.calls[index];
  return { url: String(url), init: init!, auth: new Headers(init?.headers).get('Authorization') };
}

test('read methods call the expected API paths with optional authentication', async () => {
  let fetch = stubFetch(200, { exams: [{ code: 'aws' }] });
  await expect(examApi.getExams()).resolves.toEqual([{ code: 'aws' }]);
  expect(sentRequest(fetch).url).toMatch(/\/api\/exams$/);
  expect(sentRequest(fetch).auth).toBeNull();

  fetch = stubFetch(200, { exams: [] });
  await examApi.getMyExams('token');
  expect(sentRequest(fetch)).toMatchObject({ auth: 'Bearer token' });
  expect(sentRequest(fetch).url).toMatch(/\/api\/exams\/me\/created$/);

  fetch = stubFetch(200, { categories: ['Cloud'] });
  await expect(examApi.getMetadata('token')).resolves.toEqual({ categories: ['Cloud'], tags: [] });
  expect(sentRequest(fetch).url).toMatch(/\/api\/exams\/metadata\/info$/);

  fetch = stubFetch(200, { exam: { _id: 'id-1' } });
  await expect(examApi.getExam('aws', null)).resolves.toEqual({ _id: 'id-1', code: 'id-1' });
  expect(sentRequest(fetch).url).toMatch(/\/api\/exams\/aws$/);

  fetch = stubFetch(200, { question: { question_number: 3 } });
  await expect(examApi.getQuestion('aws', 2, 3)).resolves.toEqual({ question_number: 3, topic_number: 1 });
  expect(sentRequest(fetch).url).toMatch(/\/api\/questions\/aws\/3\?topicNumber=2$/);
});

test('read failures keep their existing error messages', async () => {
  stubFetch(404, { success: false, error: 'Exam not found' });
  await expect(examApi.getExam('missing')).rejects.toThrow('Exam not found');
  stubFetch(500, undefined);
  await expect(examApi.getExams()).rejects.toThrow('Failed to fetch exams');
  stubFetch(403, { success: false, error: 'Forbidden' });
  await expect(examApi.downloadExam('aws', 'token')).rejects.toThrow('Forbidden');
  stubFetch(404, { success: false, error: 'UserNotFound' });
  await expect(examApi.transferExamOwnership('a b', 'x@example.com', 'token')).rejects.toThrow('UserNotFound');
});

test('question pages pass the abort signal and encode the exam code', async () => {
  const fetch = stubFetch(200, { data: [{ question_number: 1 }], pagination: { page: 1, totalPages: 1, revision: 'r1' } });
  const controller = new AbortController();
  await expect(examApi.getAllQuestions('a b', 'token', controller.signal)).resolves.toEqual([{ question_number: 1, topic_number: 1 }]);
  expect(sentRequest(fetch).url).toMatch(/\/api\/questions\/a%20b\?page=1&limit=100$/);
  expect(sentRequest(fetch).init.signal).toBe(controller.signal);
});

test('requests fail fast while the network is offline', async () => {
  const fetch = stubFetch(200, { exams: [] });
  vi.spyOn(networkService, 'isNetworkOnline').mockReturnValue(false);
  try {
    await expect(examApi.getExams()).rejects.toThrow('Network is offline');
    expect(fetch).not.toHaveBeenCalled();
  } finally {
    vi.restoreAllMocks();
  }
});

test('the shared transport never sends the bearer outside the backend origin', async () => {
  const fetch = stubFetch(200, {});
  for (const endpoint of ['@evil.test/x', '.evil.test/x', '//evil.test/x', 'https://evil.test/x', 'api/exams']) {
    await expect(apiRequest(endpoint, { token: 'token' })).rejects.toThrow('Invalid API endpoint');
  }
  expect(fetch).not.toHaveBeenCalled();
  await apiRequest('/api/exams', { token: 'token' });
  expect(fetch).toHaveBeenCalledTimes(1);
});
