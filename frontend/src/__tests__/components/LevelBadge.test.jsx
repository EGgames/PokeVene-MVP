import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LevelBadge from '../../components/ui/LevelBadge';

describe('LevelBadge', () => {
  it('should render level 0 and xp 0 progress', () => {
    render(<LevelBadge level={0} xp={0} />);

    expect(screen.getByTestId('level-badge')).toBeInTheDocument();
    expect(screen.getByText('Nv. 0')).toBeInTheDocument();
    expect(screen.getByText('0 / 100 XP')).toBeInTheDocument();
    expect(screen.getByLabelText('XP: 0 / 100')).toBeInTheDocument();
    expect(screen.getByTestId('xp-bar')).toHaveStyle({ width: '0%' });
  });

  it('should render level 5 and xp 550 with correct current level progress', () => {
    render(<LevelBadge level={5} xp={550} />);

    expect(screen.getByText('Nv. 5')).toBeInTheDocument();
    expect(screen.getByText('50 / 100 XP')).toBeInTheDocument();
    expect(screen.getByLabelText('XP: 50 / 100')).toBeInTheDocument();
    expect(screen.getByTestId('xp-bar')).toHaveStyle({ width: '50%' });
  });
});
