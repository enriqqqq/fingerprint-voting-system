import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const { login } = useUser();
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form className="space-y-4" onSubmit={login}>
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-sm font-semibold">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-semibold">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div className="">
                        <button 
                            type="submit" 
                            className="w-full px-4 py-2 font-semibold text-white bg-slate-900 rounded transition duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            Login
                        </button>
                        <p className="text-xs text-center text-blue-700 mt-2">Don&apos;t have an account? Click <a className="underline hover:cursor-pointer" onClick={(e) => {e.preventDefault(); navigate('/signup')}}>here</a> to sign up.</p>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default LoginPage;