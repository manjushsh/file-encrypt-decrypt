import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '.';

describe('App', () => {
  it('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});
