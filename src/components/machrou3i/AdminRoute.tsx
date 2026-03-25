import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminRoute() {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/workspace" replace />;
    }

    return <Outlet />;
}
