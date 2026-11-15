import { fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import CollapsibleQuestionText from './CollapsibleQuestionText';

function renderQuestion(text: string, images: string[]) {
  return render(
    <LanguageProvider>
      <CollapsibleQuestionText text={text} images={images} />
    </LanguageProvider>
  );
}

it('displays markup as text and preserves line breaks', () => {
  const { container } = renderQuestion('before<br><example>\nafter', []);

  expect(screen.getByText(/<example>/)).toBeInTheDocument();
  expect(container.querySelectorAll('br')).toHaveLength(2);
});

it('loads local exam images first and falls back to the remote URL without inline script', () => {
  const remote = 'https://img.examtopics.com/exam/image.png?size=large';
  renderQuestion('//IMG//', [remote]);

  const image = screen.getByRole('img', { hidden: true });
  expect(image).toHaveAttribute('src', '/img/exam/image.png');
  expect(image).not.toHaveAttribute('onerror');

  fireEvent.error(image);
  expect(image).toHaveAttribute('src', remote);
});

it('renders relative image sources and leaves unsupported image references as text', () => {
  const { container } = renderQuestion('//IMG//<br/>//IMG//', [
    '/img/exam/image.png',
    'file:///exam/image.png'
  ]);

  const image = container.querySelector('img');
  expect(image).toHaveAttribute('src', '/img/exam/image.png');
  expect(container.querySelectorAll('img')).toHaveLength(1);
  expect(screen.getByText('//IMG//')).toBeInTheDocument();
});
