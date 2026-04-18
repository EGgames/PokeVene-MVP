import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SuggestionForm from '../../components/dashboard/SuggestionForm';

describe('SuggestionForm', () => {
  it('should render form fields and submit button', () => {
    render(<SuggestionForm onSubmit={vi.fn()} isLoading={false} />);

    expect(screen.getByTestId('suggestion-form')).toBeInTheDocument();
    expect(screen.getByTestId('suggestion-text')).toBeInTheDocument();
    expect(screen.getByTestId('suggestion-category')).toBeInTheDocument();
    expect(screen.getByTestId('suggestion-submit')).toBeInTheDocument();
  });

  it('should call onSubmit with trimmed data when form is submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ id: 's1' });
    render(<SuggestionForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByTestId('suggestion-text'), {
      target: { value: '  Typhlosion  ' },
    });
    fireEvent.change(screen.getByTestId('suggestion-category'), {
      target: { value: 'venezolano' },
    });
    fireEvent.click(screen.getByTestId('suggestion-submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        text: 'Typhlosion',
        category: 'venezolano',
      });
    });
  });

  it('should show loading state and disable controls', () => {
    render(<SuggestionForm onSubmit={vi.fn()} isLoading />);

    expect(screen.getByTestId('suggestion-text')).toBeDisabled();
    expect(screen.getByTestId('suggestion-category')).toBeDisabled();
    expect(screen.getByTestId('suggestion-submit')).toBeDisabled();
    expect(screen.getByText('Enviando…')).toBeInTheDocument();
  });
});
