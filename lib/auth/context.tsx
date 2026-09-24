'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Profile, UserRole } from '@/types/nyaya';
import { DEMO_PROFILES } from '@/lib/supabase/mockData';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { AuditService } from '@/lib/services/audit';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  getRoleDashboardPath: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_DASHBOARDS: Record<UserRole, string> = {
  ADMIN: '/admin',
  INVESTIGATOR: '/investigator',
  LEGAL: '/legal',
  FORENSIC: '/forensic',
  COURT: '/court',
};

const LOCAL_AUTH_KEY = 'nyayavault_active_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = RouterHook();
  const pathname = usePathname();

  function RouterHook() {
    return useRouter();
  }

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            setLoading(false);
            return;
          }
        }
      }

      // Check local storage demo persistence
      const savedUser = localStorage.getItem(LOCAL_AUTH_KEY);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // Default demo user is investigator
          setUser(DEMO_PROFILES['investigator@nyayavault.demo']);
        }
      } else {
        // Default demo user if not explicitly logged out
        setUser(DEMO_PROFILES['investigator@nyayavault.demo']);
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const getRoleDashboardPath = (role: UserRole): string => {
    return ROLE_DASHBOARDS[role] || '/investigator';
  };

  const login = async (email: string, requestedRole?: UserRole): Promise<boolean> => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      // Note: for production Supabase auth, standard email/password is called.
      // If user logs in with demo credentials, we look up or provision profile.
    }

    // Demo lookup or fallback based on email role tag
    let matchedProfile = DEMO_PROFILES[normalizedEmail];

    if (!matchedProfile) {
      const roleToAssign = requestedRole || 'INVESTIGATOR';
      matchedProfile = {
        id: `usr-custom-${Date.now()}`,
        full_name: normalizedEmail.split('@')[0].toUpperCase(),
        email: normalizedEmail,
        role: roleToAssign,
        department: 'Legal Operations',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    setUser(matchedProfile);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(matchedProfile));

    await AuditService.createAuditLog({
      userId: matchedProfile.id,
      userName: matchedProfile.full_name,
      action: 'LOGIN',
      description: `User ${matchedProfile.full_name} logged in with role ${matchedProfile.role}`,
      metadata: { role: matchedProfile.role, email: matchedProfile.email }
    });

    setLoading(false);
    router.push(getRoleDashboardPath(matchedProfile.role));
    return true;
  };

  const logout = async () => {
    setLoading(true);
    if (user) {
      await AuditService.createAuditLog({
        userId: user.id,
        userName: user.full_name,
        action: 'LOGOUT',
        description: `User ${user.full_name} logged out from ${user.role} workspace`,
      });
    }

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }

    setUser(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setLoading(false);
    router.push('/login');
  };

  const switchRole = (role: UserRole) => {
    const roleEmailMap: Record<UserRole, string> = {
      ADMIN: 'admin@nyayavault.demo',
      INVESTIGATOR: 'investigator@nyayavault.demo',
      LEGAL: 'legal@nyayavault.demo',
      FORENSIC: 'forensic@nyayavault.demo',
      COURT: 'court@nyayavault.demo',
    };

    const targetEmail = roleEmailMap[role];
    const newProfile = DEMO_PROFILES[targetEmail];
    if (newProfile) {
      setUser(newProfile);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(newProfile));
      router.push(getRoleDashboardPath(role));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        switchRole,
        getRoleDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
