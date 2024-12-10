import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'

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
    return (
        <BrowserRouter>
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