import {LoginRes} from "@/types/AuthenticationTypes/LoginTypes.ts";

export const setTokenLocalStorage = (data: LoginRes) =>
    localStorage.setItem("authUser", JSON.stringify(data));

export const getTokenLocalStorage = (): LoginRes | null => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
}

export const removeTokenLocalStorage = () => localStorage.removeItem("authUser");