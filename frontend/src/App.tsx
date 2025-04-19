import {Toaster} from "react-hot-toast";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp";
import Application from "./pages/Application";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthProvider from "@/context/AuthContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <Toaster/>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/app" element={<Application/>}/>
                    </Route>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
