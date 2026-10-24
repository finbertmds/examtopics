import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/Home', () => ({ default: () => <h1>Exam practice</h1> }));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

test('renders the home route with app providers', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Exam practice' })).toBeInTheDocument();
});
