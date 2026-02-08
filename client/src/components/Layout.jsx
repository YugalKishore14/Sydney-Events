import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut } from 'lucide-react';
import api from '../api';

const Layout = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/auth/current_user');
                if (data) setUser(data);
            } catch (err) {
                // Not logged in
                setUser(null);
            }
        };
        fetchUser();
    }, [location.pathname]); // Re-check on nav change

    const handleLogout = () => {

        // window.location.href = 'https://sydney-events-backend-lyuu.onrender.com/auth/logout';
        window.location.href = 'http://localhost:5000/auth/logout';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-primary p-2 rounded-lg text-white">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold text-gray-800 tracking-tight">Sydney Events</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition">
                                Browse Events
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/admin/dashboard" className="text-sm font-medium text-primary hover:text-accent transition">
                                        Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {user.name ? user.name[0] : 'A'}
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition">
                                    <User className="w-4 h-4" />
                                    Admin Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-primary text-slate-400 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm">© {new Date().getFullYear()} Sydney Events Platform. Assignment Project.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
