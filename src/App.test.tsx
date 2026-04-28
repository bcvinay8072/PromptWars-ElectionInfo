import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

window.HTMLElement.prototype.scrollIntoView = function() {};

describe('CivicSync App', () => {
  test('renders the main app header', () => {
    render(<App />);
    const headerElement = screen.getByText(/CivicSync/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the intelligent election guide subtitle', () => {
    render(<App />);
    const subtitleElement = screen.getByText(/The Intelligent Election Guide/i);
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders the interactive timeline section', () => {
    render(<App />);
    const journeyHeader = screen.getByText(/Your Electoral Journey/i);
    expect(journeyHeader).toBeInTheDocument();
  });
});
