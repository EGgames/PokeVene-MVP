import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserTable from '../../components/admin/UserTable';

const usersMock = [
  {
    id: 'u1',
    username: 'ash',
    level: 5,
    role: 'user',
    banned_at: null,
  },
  {
    id: 'u2',
    username: 'misty',
    level: 11,
    role: 'admin',
    banned_at: '2026-04-18T00:00:00Z',
  },
];

describe('UserTable', () => {
  it('should render expected columns and users', () => {
    render(
      <UserTable
        users={usersMock}
        onBan={vi.fn()}
        onUnban={vi.fn()}
        onRoleChange={vi.fn()}
        loading={false}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'Usuario' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Nivel' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rol' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument();
    expect(screen.getByText('ash')).toBeInTheDocument();
    expect(screen.getByText('misty')).toBeInTheDocument();
  });

  it('should call onBan and onUnban when action buttons are clicked', () => {
    const onBan = vi.fn();
    const onUnban = vi.fn();

    render(
      <UserTable
        users={usersMock}
        onBan={onBan}
        onUnban={onUnban}
        onRoleChange={vi.fn()}
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Banear' }));
    fireEvent.click(screen.getByRole('button', { name: 'Desbanear' }));

    expect(onBan).toHaveBeenCalledWith('u1');
    expect(onUnban).toHaveBeenCalledWith('u2');
  });

  it('should call onRoleChange when admin changes user role', () => {
    const onRoleChange = vi.fn();

    render(
      <UserTable
        users={usersMock}
        onBan={vi.fn()}
        onUnban={vi.fn()}
        onRoleChange={onRoleChange}
        loading={false}
      />
    );

    fireEvent.change(screen.getByLabelText('Cambiar rol de ash'), {
      target: { value: 'admin' },
    });

    expect(onRoleChange).toHaveBeenCalledWith('u1', 'admin');
  });
});
