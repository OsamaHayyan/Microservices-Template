import Button from "@/components/UI/Button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-2xl shadow-md text-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Secure App</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        A demo authentication system with protected routes and refresh token mechanism
                    </p>
                </div>

                <div className="space-y-4">
                    {isAuthenticated ? (
                        <Button intent={"primary"} size={"lg"} className="w-full">
                            <Link className={"w-full"} to="/app">Go to Application</Link>
                        </Button>
                    ) : (
                        <>
                            <Button intent="primary" className="w-full">
                                <Link className="w-full" to={'/login'}>Login</Link>
                            </Button>
                            <Button intent="outline" className="w-full">
                                <Link className="w-full" to={'/signup'}>Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;