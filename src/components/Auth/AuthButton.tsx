import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import { LogIn, LogOut } from 'lucide-react';

const AuthButton: React.FC = () => {
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
            <img src={user.photoURL || ''} alt={user.displayName || ''} style={{ width: '100%', height: '100%' }} />
          </div>
          <span style={{ display: 'none' }} className="desktop-nav">{user.displayName}</span>
        </div>
        <button onClick={handleSignOut} className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <LogOut size={18} /> <span className="desktop-nav">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleSignIn} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <LogIn size={18} /> <span>Sign In</span>
    </button>
  );
};

export default AuthButton;
