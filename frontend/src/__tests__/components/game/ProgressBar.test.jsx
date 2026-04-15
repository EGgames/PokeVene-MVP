import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProgressBar from '../../../components/game/ProgressBar';

describe('ProgressBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correct and total numbers when values are provided', () => {
    // Arrange + Act
    render(<ProgressBar current={4} total={10} correctCount={3} />);

    // Assert
    expect(screen.getByText(/4 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ 3/i)).toBeInTheDocument();
  });

  it('sets bar width based on progress percentage', () => {
    // Arrange + Act
    render(<ProgressBar current={2} total={10} correctCount={1} />);

    // Assert
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ width: '20%' });
  });
});
