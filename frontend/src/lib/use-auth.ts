import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export function useAuth() {
  const { user, accessToken, refreshToken, isInitialized, setAuth, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push("/dashboard");
    },
    [setAuth, router],
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      const res = await api.signup(email, password, name);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push("/dashboard");
    },
    [setAuth, router],
  );

  const logout = useCallback(() => {
    storeLogout();
    router.push("/login");
  }, [storeLogout, router]);

  const refreshTokens = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      const res = await api.refreshToken(refreshToken);
      if (user) {
        setAuth(user, res.accessToken, res.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [refreshToken, user, setAuth]);

  const fetchUser = useCallback(async () => {
    try {
      const fetchedUser = await api.getMe();
      if (fetchedUser) {
        const state = useAuthStore.getState();
        state.setAuth(fetchedUser, state.accessToken!, state.refreshToken!);
      }
    } catch {
      storeLogout();
    }
  }, [storeLogout]);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user && !!accessToken,
    isInitialized,
    login,
    signup,
    logout,
    refreshTokens,
    fetchUser,
  };
}
