import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Optionally verify token is still valid
        // You can add a token verification endpoint call here

        return;
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }

    setUser(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  // Initial auth check - runs only once
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };

    initAuth();
  }, [checkAuthStatus]);

  // Token refresh interval - runs only once
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      const currentUser = localStorage.getItem("user");

      if (refreshToken && currentUser) {
        try {
          const response = await authService.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        } catch (error) {
          console.error("Token refresh failed:", error);
          await logout();
        }
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [logout]); // Only depends on logout function

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      // Navigate based on role
      if (userData.role === "admin") {
        window.location.href = "/admin";
      } else if (userData.role === "vendor") {
        window.location.href = "/vendor";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUser = useCallback((userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
