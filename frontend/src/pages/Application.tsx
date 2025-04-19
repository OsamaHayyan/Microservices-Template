import Button from "@/components/UI/Button.tsx";
import Spinner from "@/components/UI/Spinner.tsx";
import {useMutation} from "@tanstack/react-query";
import AuthenticationRepository from "@/repositories/AuthenticationRepository.ts";
import toast from "react-hot-toast";
import IError from "@/interfaces/IError.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/hooks/useAuth.tsx";

const Application = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate();
    const logoutMutation = useMutation({
        mutationFn: () => {
            return AuthenticationRepository.logout()
        },
        onSuccess: () => {
            toast.success("Logged out successfully");
            logout();
            navigate("/");
        },
        onError: (error: IError) => {
            toast.error(error.message || "An error occurred");
        },
    })

    const handleLogout = () => logoutMutation.mutate()
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome to my demo app</h1>
                    <p className="text-green-500">Hi {user?.user?.name}!</p>
                </div>

                <Button
                    onClick={handleLogout}
                    className="w-full"
                    size="lg"
                    disabled={logoutMutation.isPending}
                >
                    {logoutMutation.isPending ? (
                        <div className="flex items-center justify-center">
                            <Spinner/>
                            Loading...
                        </div>
                    ) : (
                        "Logout"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default Application;