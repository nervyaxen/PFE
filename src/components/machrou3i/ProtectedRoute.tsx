import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
    requiredRole?: 'user' | 'manager' | 'admin';
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    // Handle specific roles
    if (requiredRole === 'admin' && user.role !== 'admin') {
        return <Navigate to="/workspace" replace />;
    }

    if (requiredRole === 'manager' && user.role === 'user') {
        return <Navigate to="/workspace" replace />;
    }

    return <Outlet />;
}
