import { Navigate, Outlet } from "react-router-dom";

import useAuthStore from "../stores/authStore";

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    isInitializing,
  } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="auth-loading">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;