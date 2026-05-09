// External libraries
import React from 'react';
import { Navigate } from 'react-router-dom';

// Internal
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, hasRole } = useUser();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100 bg-opacity-80 z-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-900 text-lg mt-4">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasRole('regular') && (!user.buildings || user.buildings.length == 0)) {
    return <Navigate to="/no-buildings" replace />;
  }

  if (roles && !roles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
