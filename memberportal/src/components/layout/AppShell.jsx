import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isForced = user?.must_change_password;

  return (
    <div className="ds-shell">
      <Sidebar user={user} onLogout={logout} />
      <div className="ds-shell__main">
        <Topbar
          adminUser={user}
          notifications={[]} // Add notifications logic later if needed
          unreadCount={0}
          onOpenSettings={() => !isForced && navigate('/settings')}
          onOpenProfile={() => !isForced && navigate('/profile')}
          onChangePassword={() => navigate('/change-password')}
          onLogout={logout}
        />
        <main className="ds-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
