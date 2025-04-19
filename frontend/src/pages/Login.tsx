import Button from "@/components/UI/Button.tsx";
import {zodResolver} from '@hookform/resolvers/zod';
import {Link, useNavigate} from "react-router-dom";
import {loginSchema} from "@/utils/validations/auth.ts";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import AuthenticationRepository from "@/repositories/AuthenticationRepository.ts";
import toast from "react-hot-toast";
import IError from "@/interfaces/IError.ts";
import {LoginReq} from "@/types/AuthenticationTypes/LoginTypes.ts";
import {useAuth} from "@/hooks/useAuth.tsx";
import InputForm from "@/components/UI/InputForm.tsx";
import Spinner from "@/components/UI/Spinner.tsx";

const Login = () => {
    const {login} = useAuth()
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: (data: LoginReq) => AuthenticationRepository.login(data),
        onSuccess: (data)=>{
            toast.success("Logged In successfully");
            login(data);
            navigate("/app");
        },
        onError: (error: IError) => {
            toast.error(error.message || "An error occurred");
        },
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginReq>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginReq) => {
        loginMutation.mutate(data)
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="space-y-2 text-center">
                    <p className="text-green-500">Enter your information to get started</p>
                    <h1 className="text-3xl font-bold">Open your account</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputForm
                        id="email"
                        type="email"
                        placeholder="Please enter your email"
                        disabled={loginMutation.isPending}
                        className={errors.email ? "border-red-500" : ""}
                        errorMessage={errors.email?.message}
                        {...register("email")}
                    />
                    <InputForm
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={loginMutation.isPending}
                        className={errors.password ? "border-red-500" : ""}
                        errorMessage={errors.password?.message}
                        {...register("password")}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? (
                            <div className="flex items-center justify-center">
                                <Spinner/>
                                Loading...
                            </div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-medium hover:underline"
                    >
                        Signup
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;