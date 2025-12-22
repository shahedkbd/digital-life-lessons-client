import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserPlan from "../hooks/useUserPlan";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: planLoading } = useUserPlan();
  const location = useLocation();
  const [hasShownAlert, setHasShownAlert] = useState(false);

  const loading = authLoading || planLoading;

  useEffect(() => {
    if (!loading && user && !isAdmin && !hasShownAlert) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have admin privileges",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Go Back",
      });
      setHasShownAlert(true);
    }
  }, [loading, user, isAdmin, hasShownAlert]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
