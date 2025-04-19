import {createContext, ReactNode, useEffect, useState} from "react";
import {LoginRes} from "@/types/AuthenticationTypes/LoginTypes.ts";
import {getTokenLocalStorage, removeTokenLocalStorage, setTokenLocalStorage} from "@/utils/TokenLocalStorage";

interface AuthContextType {
    user: LoginRes | null;
    isAuthenticated: boolean;
    login: (user: LoginRes) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<LoginRes | null>(null);

    useEffect(() => {
        const storedUser = getTokenLocalStorage();
        if (storedUser) {
            setUser(storedUser);
        }

        const handleTokenRefresh = (e: Event) => {
            const event = e as CustomEvent<LoginRes>;
            console.log("update user", event.detail);
            setUser(event.detail);
        };

        window.addEventListener('tokenRefreshed', handleTokenRefresh);

        setLoading(false);

        return () => {
            window.removeEventListener('tokenRefreshed', handleTokenRefresh);
        };
    }, []);

    const login = (newUser: LoginRes) => {
        setUser(newUser);
        setTokenLocalStorage(newUser)
    };

    const logout = () => {
        setUser(null);
        removeTokenLocalStorage();
    };

    return (
        <AuthContext
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext>
    );
};

export default AuthProvider;