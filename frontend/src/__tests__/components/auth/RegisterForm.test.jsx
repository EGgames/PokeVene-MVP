import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RegisterForm from '../../../components/auth/RegisterForm';

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username password and confirm password inputs when component loads', () => {
    // Arrange + Act
    render(<RegisterForm onSubmit={vi.fn()} isLoading={false} error={null} />);

    // Assert
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
  });

  it('shows username error when username length is below minimum', async () => {
    // Arrange
    render(<RegisterForm onSubmit={vi.fn()} isLoading={false} error={null} />);

    // Act
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'ab' } });
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }));

    // Assert
    expect(await screen.findByText(/el usuario debe tener entre 3 y 20 caracteres/i)).toBeInTheDocument();
  });

  it('shows password error when password has fewer than 8 characters', async () => {
    // Arrange
    render(<RegisterForm onSubmit={vi.fn()} isLoading={false} error={null} />);

    // Act
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'valid_user' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: '1234567' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: '1234567' } });
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }));

    // Assert
    expect(await screen.findByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
  });

  it('shows mismatch error when confirm password is different', async () => {
    // Arrange
    render(<RegisterForm onSubmit={vi.fn()} isLoading={false} error={null} />);

    // Act
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'valid_user' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'MyPassword123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'OtherPassword123' } });
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }));

    // Assert
    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it('calls onSubmit with username and password when input is valid', async () => {
    // Arrange
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RegisterForm onSubmit={onSubmit} isLoading={false} error={null} />);

    // Act
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'valid_user' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'MyPassword123' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'MyPassword123' } });
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith('valid_user', 'MyPassword123');
  });

  it('disables submit button when isLoading is true', () => {
    // Arrange + Act
    render(<RegisterForm onSubmit={vi.fn()} isLoading error={null} />);

    // Assert
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays backend error message when error prop exists', () => {
    // Arrange + Act
    render(<RegisterForm onSubmit={vi.fn()} isLoading={false} error="error backend" />);

    // Assert
    expect(screen.getByText(/error backend/i)).toBeInTheDocument();
  });
});
