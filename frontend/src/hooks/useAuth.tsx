import {AuthContext} from "@/context/AuthContext";
import {useContext, useDebugValue} from "react";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    useDebugValue(context, ctx => ctx.isAuthenticated ? "Logged In" : "Logged Out")
    return context;
};