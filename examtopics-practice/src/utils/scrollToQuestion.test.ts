import { scrollToQuestion } from './scrollToQuestion';

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(callback, 16));
  vi.stubGlobal('cancelAnimationFrame', clearTimeout);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

function fixture() {
  document.body.innerHTML = '<img id="before"><section><img id="inside"></section><img id="after">';
  const target = document.querySelector('section')!;
  const scroll = vi.fn();
  target.scrollIntoView = scroll;
  const images = Array.from(document.querySelectorAll('img'));
  images.forEach(image => Object.defineProperty(image, 'complete', { configurable: true, value: false }));
  return { target, scroll, images };
}

it('realigns after question and answer images load, ignoring images below the target', () => {
  const { target, scroll, images } = fixture();
  const cancel = scrollToQuestion(target);
  vi.runAllTimers();
  expect(scroll).toHaveBeenCalledTimes(1);
  images[2].dispatchEvent(new Event('load'));
  vi.runAllTimers();
  expect(scroll).toHaveBeenCalledTimes(1);
  for (const image of images.slice(0, 2)) {
    Object.defineProperty(image, 'complete', { value: true });
    image.dispatchEvent(new Event('load'));
    vi.runAllTimers();
  }
  expect(scroll).toHaveBeenCalledTimes(3);
  expect(scroll).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'center' });
  cancel();
});

it('continues tracking a remote fallback after a local image error', () => {
  const { target, scroll, images } = fixture();
  const cancel = scrollToQuestion(target);
  vi.runAllTimers();
  images[0].dispatchEvent(new Event('error'));
  vi.runAllTimers();
  Object.defineProperty(images[0], 'complete', { value: true });
  images[0].dispatchEvent(new Event('load'));
  vi.runAllTimers();
  expect(scroll).toHaveBeenCalledTimes(3);
  cancel();
});

it.each(['wheel', 'touchstart', 'pointerdown', 'keydown'])('stops correcting after user %s input', event => {
  const { target, scroll, images } = fixture();
  scrollToQuestion(target);
  vi.runAllTimers();
  window.dispatchEvent(new Event(event));
  images[0].dispatchEvent(new Event('load'));
  vi.runAllTimers();
  expect(scroll).toHaveBeenCalledTimes(1);
});

it('cancels pending scrolling on cleanup', () => {
  const { target, scroll } = fixture();
  const cancel = scrollToQuestion(target);
  cancel();
  vi.runAllTimers();
  expect(scroll).not.toHaveBeenCalled();
});
