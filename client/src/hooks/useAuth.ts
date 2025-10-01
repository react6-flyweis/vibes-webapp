import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  subscriptionTier: string;
}

// Simple global auth state
let globalUser: User | null = null;
let authListeners: Array<(user: User | null) => void> = [];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibes_user');
      if (saved) {
        try {
          const userData = JSON.parse(saved);
          setUser(userData);
          globalUser = userData;
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('vibes_user');
        }
      }
    }
    setIsLoading(false);

    const listener = (newUser: User | null) => setUser(newUser);
    authListeners.push(listener);
    return () => {
      authListeners = authListeners.filter(l => l !== listener);
    };
  }, []);

  const login = (userData: User) => {
    globalUser = userData;
    setUser(userData);
    localStorage.setItem('vibes_user', JSON.stringify(userData));
    authListeners.forEach(listener => listener(userData));
  };

  const logout = () => {
    globalUser = null;
    setUser(null);
    localStorage.removeItem('vibes_user');
    authListeners.forEach(listener => listener(null));
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
}