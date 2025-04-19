import { Navigate, Outlet } from "react-router-dom";

import {useAuth} from "@/hooks/useAuth.tsx";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 100 100">
                </svg>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;