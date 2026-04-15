import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginForm from '../../../components/auth/LoginForm';

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username and password inputs when component loads', () => {
    // Arrange + Act
    render(<LoginForm onSubmit={vi.fn()} isLoading={false} error={null} />);

    // Assert
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('calls onSubmit with credentials when input is valid', async () => {
    // Arrange
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} isLoading={false} error={null} />);

    // Act
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'valid_user' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'MyPassword123' } });
    fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith('valid_user', 'MyPassword123');
  });

  it('disables submit button when isLoading is true', () => {
    // Arrange + Act
    render(<LoginForm onSubmit={vi.fn()} isLoading error={null} />);

    // Assert
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays backend error message when error prop exists', () => {
    // Arrange + Act
    render(<LoginForm onSubmit={vi.fn()} isLoading={false} error="credenciales inválidas" />);

    // Assert
    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
  });
});
