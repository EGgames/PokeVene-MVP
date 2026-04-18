import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SuggestionReview from '../../components/admin/SuggestionReview';

describe('SuggestionReview', () => {
  it('should render suggestions and call approve/reject callbacks', () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const suggestions = [
      {
        id: 's1',
        text: 'Typhlosion',
        category: 'pokemon',
        username: 'ash',
        created_at: '2026-04-18T00:00:00Z',
        status: 'pending',
      },
    ];

    render(
      <SuggestionReview
        suggestions={suggestions}
        onApprove={onApprove}
        onReject={onReject}
        loading={false}
      />
    );

    expect(screen.getByText('Typhlosion')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aprobar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));

    expect(onApprove).toHaveBeenCalledWith('s1');
    expect(onReject).toHaveBeenCalledWith('s1');
  });
});
