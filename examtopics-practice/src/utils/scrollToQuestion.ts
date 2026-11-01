// Keep the initial destination aligned while images above or inside it load.
export function scrollToQuestion(target: Element): () => void {
  const pending = new Set(
    Array.from(document.querySelectorAll('img')).filter(image =>
      !image.complete && (target.contains(image) ||
        !!(image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)),
    ),
  );
  let frame: number | undefined;
  const cancelEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
  const cleanup = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    pending.forEach(image => {
      image.removeEventListener('load', onImageSettled);
      image.removeEventListener('error', onImageSettled);
    });
    cancelEvents.forEach(event => window.removeEventListener(event, cleanup));
  };
  const align = () => {
    frame = undefined;
    if (!target.isConnected) {
      cleanup();
      return;
    }
    target.scrollIntoView({ behavior: 'instant', block: 'center' });
    pending.forEach(image => {
      // An inline error handler may start loading a remote fallback image.
      if (image.complete) {
        image.removeEventListener('load', onImageSettled);
        image.removeEventListener('error', onImageSettled);
        pending.delete(image);
      }
    });
    if (pending.size === 0) cleanup();
  };
  function onImageSettled() {
    if (frame === undefined) frame = requestAnimationFrame(align);
  }
  pending.forEach(image => {
    image.addEventListener('load', onImageSettled);
    image.addEventListener('error', onImageSettled);
  });
  cancelEvents.forEach(event => window.addEventListener(event, cleanup, { passive: true }));
  onImageSettled();
  return cleanup;
}
