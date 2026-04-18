import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TermManager from '../../components/admin/TermManager';

describe('TermManager', () => {
  it('should render and call onAdd when adding a valid term', async () => {
    const onAdd = vi.fn().mockResolvedValue({ id: 't1' });

    render(<TermManager onAdd={onAdd} onDelete={vi.fn()} loading={false} />);

    fireEvent.change(screen.getByTestId('term-text'), {
      target: { value: 'Totodile' },
    });
    fireEvent.change(screen.getByTestId('term-category'), {
      target: { value: 'pokemon' },
    });
    fireEvent.click(screen.getByTestId('term-add-btn'));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith({
        text: 'Totodile',
        category: 'pokemon',
      });
    });
  });
});
