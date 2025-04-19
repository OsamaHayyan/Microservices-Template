import Button from "@/components/UI/Button.tsx";
import {zodResolver} from '@hookform/resolvers/zod';
import {Link, useNavigate} from "react-router-dom";
import {SignUpReq} from "@/types/AuthenticationTypes/SignUpTypes.ts";
import {signUpSchema} from "@/utils/validations/auth.ts";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import AuthenticationRepository from "@/repositories/AuthenticationRepository.ts";
import toast from "react-hot-toast";
import IError from "@/interfaces/IError.ts";
import InputForm from "@/components/UI/InputForm.tsx";
import Spinner from "@/components/UI/Spinner.tsx";

const SignUp = () => {
    const navigate = useNavigate();
    const signUpMutation = useMutation({
        mutationFn: (data: SignUpReq) => AuthenticationRepository.signUp(data),
        onSuccess: ()=>{
            toast.success("Account created successfully");
            navigate("/login");
        },
        onError: (error: IError) => {
            toast.error(error.message || "An error occurred");
        },
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpReq>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpReq) => {
        signUpMutation.mutate(data)
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="space-y-2 text-center">
                    <p className="text-green-500">Enter your information to get started</p>
                    <h1 className="text-3xl font-bold">Create an account</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputForm
                        id="name"
                        type="text"
                        placeholder="Please enter your name"
                        disabled={signUpMutation.isPending}
                        errorMessage={errors.name?.message}
                        {...register("name")}
                    />
                    <InputForm
                        id="email"
                        type="email"
                        placeholder="Please enter your email"
                        disabled={signUpMutation.isPending}
                        className={errors.email ? "border-red-500" : ""}
                        errorMessage={errors.email?.message}
                        {...register("email")}
                    />
                    <InputForm
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={signUpMutation.isPending}
                        className={errors.password ? "border-red-500" : ""}
                        errorMessage={errors.password?.message}
                        {...register("password")}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={signUpMutation.isPending}
                    >
                        {signUpMutation.isPending ? (
                            <div className="flex items-center justify-center">
                                <Spinner/>
                                Creating account...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;