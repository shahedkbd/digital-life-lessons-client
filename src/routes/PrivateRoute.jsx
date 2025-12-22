import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    if (!loading && !user && !hasShownAlert) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please login to access this page",
        confirmButtonColor: "#0ea5e9",
        confirmButtonText: "Go to Login",
      });
      setHasShownAlert(true);
    }
  }, [loading, user, hasShownAlert]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
