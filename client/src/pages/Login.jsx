import React from 'react';
import { Lock } from 'lucide-react';

const Login = () => {
    const handleGoogleLogin = () => {

        // window.location.href = 'https://sydney-events-backend-lyuu.onrender.com/auth/google';
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
                <p className="text-gray-500 mb-8">Sign in with Google to manage events.</p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition duration-200"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
