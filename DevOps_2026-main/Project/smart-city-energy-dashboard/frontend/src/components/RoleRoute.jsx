import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ role }) => {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
