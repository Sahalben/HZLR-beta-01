import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type OnboardingState =
  | 'ANONYMOUS'
  | 'ROLE_SELECTED'
  | 'OTP_REQUESTED'
  | 'OTP_VERIFIED'
  | 'PROFILE_DATA_COLLECTED'
  | 'E_KYC_PENDING'
  | 'E_KYC_VERIFIED'
  | 'ONBOARDING_COMPLETE';

type UserRole = 'worker' | 'employer';

interface Profile {
  id: string;
  user_id: string;
  role: UserRole | null;
  phone: string | null;
  full_name: string | null;
  photo_url: string | null;
  location_lat: number | null;
  location_lng: number | null;
  radius_km: number | null;
  preferred_categories: string[] | null;
  company_name: string | null;
  business_email: string | null;
  company_address: string | null;
  hiring_role: string | null;
  onboarding_state: OnboardingState;
}

interface AuthContextType {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateOnboardingState: (newState: OnboardingState) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<any>;
  loginWithEmail: (email: string, password: string) => Promise<any>;
  signupWithEmail: (email: string, password: string, role: UserRole) => Promise<any>;
  sendEmailOtp: (email: string) => Promise<any>;
  verifyEmailOtp: (email: string, otp: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/', '/login', '/signup'];
const SIGNUP_ROUTES = ['/signup/role', '/signup/otp', '/signup/profile', '/signup/kyc', '/signup/complete'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 401 || res.status === 403) {
        // Try getting new token if blocked
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
           const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ refreshToken })
           });
           if (refreshRes.ok) {
             const rtData = await refreshRes.json();
             localStorage.setItem('token', rtData.accessToken);
             localStorage.setItem('refreshToken', rtData.refreshToken);
             return await fetchProfile(); // Retry
           }
        }
        throw new Error("Session expired and refresh failed");
      }

      if (res.ok) {
        const data = await res.json();
        return data.user as Profile;
      }
    } catch (err) {
      console.error(err);
      // Clean up corrupt tokens to not lock user
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    return null;
  }, []);

  const refreshProfile = useCallback(async () => {
    const profileData = await fetchProfile();
    setProfile(profileData);
    setUser(profileData);
    if (profileData) {
      setSession({ access_token: localStorage.getItem('token') });
    }
  }, [fetchProfile]);

  const loginWithOtp = async (phone: string, otp: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      await refreshProfile();
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      await refreshProfile();
      return data.user;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const signupWithEmail = async (email: string, password: string, role: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: role.toUpperCase() })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      await refreshProfile();
      return email;
    } else {
      throw new Error(data.error || 'Signup failed');
    }
  };

  const sendEmailOtp = async (email: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/v1/auth/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to send code');
    return data;
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const res = await fetch(`${API_URL}/api/v1/auth/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      await refreshProfile();
      return data;
    } else {
      throw new Error(data.error || 'Verification failed');
    }
  };

  const updateOnboardingState = useCallback(async (newState: OnboardingState) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    await fetch(`${API_URL}/api/v1/auth/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ state: newState })
    });
    await refreshProfile();
  }, [refreshProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    await fetch(`${API_URL}/api/v1/auth/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(updates)
    });
    await refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
           // Token expired synchronously -> fast fail and force refresh loop on fetchProfile
           console.log("Access token proactively expired on load.");
        }
      } catch (e) {
        console.error("Token parse error", e);
      }
    }
    refreshProfile().finally(() => setLoading(false));
  }, [refreshProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signOut,
        refreshProfile,
        updateOnboardingState,
        updateProfile,
        loginWithOtp,
        loginWithEmail,
        signupWithEmail,
        sendEmailOtp,
        verifyEmailOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useOnboardingGuard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);
    const isSignupRoute = SIGNUP_ROUTES.some(route => currentPath.startsWith(route));
    const isDashboardRoute = currentPath.startsWith('/worker') || currentPath.startsWith('/employer');

    if (!user) {
      if (isDashboardRoute) {
        navigate('/login', { replace: true });
      }
      return;
    }
  }, [user, profile, loading, navigate, location.pathname]);
}

export { type OnboardingState, type UserRole, type Profile };
