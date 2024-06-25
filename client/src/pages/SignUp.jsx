import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const { signup } = useUser();
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                <form className="space-y-4" onSubmit={signup}>
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
                    <div className="flex flex-col">
                        <label htmlFor="c_password" className="text-sm font-semibold">Confirm Password</label>
                        <input 
                            type="password" 
                            id="c_password" 
                            name="c_password" 
                            className="w-full px-4 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div className="">
                        <button 
                            type="submit" 
                            className="w-full px-4 py-2 font-semibold text-white bg-slate-900 rounded transition duration-300 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            Sign Up
                        </button>
                        <p className="text-xs text-center text-blue-700 mt-2">Already have an account? Click <a className="underline hover:cursor-pointer" onClick={(e) => {e.preventDefault(); navigate('/login')}}>here</a> to login.</p>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default SignUp;