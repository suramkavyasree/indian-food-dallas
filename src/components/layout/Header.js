'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/auth/useSession';
import './Header.css'; // Import your CSS file for styling

export default function Header() {
  const router = useRouter();
  const { session } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabaseSession'); // Optional: if you're storing anything
    router.replace('/login');
  };

  // Function to get the initials of the user (first letter of the first name + first letter of the last name)
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
    return initials;
  };

  return (
    <header className={`header-container ${!session ? 'no-bg' : ''}`}>
      <div className="header-content">
        {/* Header Title only if logged in */}
        {session && (
          <h1 className="header-title">Welcome to Indian Food Marketplace at Dallas</h1>
        )}
      </div>

      {session && (
        <div className="header-user-section">
          {/* User Info */}
          <div className="user-info">
            {/* User Avatar - Display initials inside a circle */}
            <div className="user-avatar">{getInitials(session.user.email)}</div>
            {/* User Email */}
            <span className="user-email">{session.user.email}</span>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
