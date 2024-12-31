import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { NavigationSetter } from './utils/navigation';
import { apiRequest } from './lib/api_client'
import { REFRESH_TOKEN_ROUTE } from './utils/constants'
import { Skeleton } from './components/ui/skeleton'

const ProtectedRoute = ({ children }) => {
    const userinfo = useAppStore((state) => state.userinfo);

    return userinfo ? children : <Navigate to="/login" replace />;
}

const AuthRoute = ({ children }) => {
    const userinfo = useAppStore((state) => state.userinfo);

    if (userinfo) {
        const newRoute = userinfo.profileSetup ? '/chat' : '/profile';
        return <Navigate to={newRoute} replace />;
    }

    return children;
}

const authRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> }
];

const protectedRoutes = [
    { path: '/profile', element: <Profile /> },
    { path: '/chat', element: <Chat /> }
];

const App = () => {
    const [loading, setLoading] = useState(false);

    const userinfo = useAppStore((state) => state.userinfo);
    const setUserInfo = useAppStore((state) => state.setUserInfo);
    const setAccessToken = useAppStore((state) => state.setAccessToken);

    // Acquire userinfo and accessToken on page refresh
    useEffect(() => {
        const refreshToken = async () => {
            setLoading(true);

            const response = await apiRequest('post', REFRESH_TOKEN_ROUTE);

            if (response) {
                setUserInfo(response.data.data);
                setAccessToken(response.data.accessToken);
            } else {
                setUserInfo(null);
                setAccessToken(null);
            }

            setLoading(false);
        }

        if (!userinfo) refreshToken();
    }, [userinfo, setUserInfo, setAccessToken]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <div className="flex flex-col space-y-5 w-1/2 max-w-xs items-end">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-[85%]" />
                </div>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <NavigationSetter />
            <Routes>
                {
                    authRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<AuthRoute>{route.element}</AuthRoute>}
                        />
                    ))
                }

                {
                    protectedRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                        />
                    ))
                }

                <Route path='*' element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App