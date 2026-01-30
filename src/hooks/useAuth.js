import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "@/lib/auth-service";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const useAuthProvider = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    const checkAuth = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            await authService.login(email, password);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: error.message || "Login failed"
            };
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email, password, name) => {
        setIsLoading(true);
        try {
            await authService.createAccount(email, password, name);
            // Auto-login after signup
            await authService.login(email, password);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                error: error.message || "Signup failed"
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        checkAuth
    };
};

export { AuthContext };
