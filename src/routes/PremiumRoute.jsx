import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserPlan from "../hooks/useUserPlan";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const PremiumRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: planLoading } = useUserPlan();
  const location = useLocation();
  const [hasShownAlert, setHasShownAlert] = useState(false);

  const loading = authLoading || planLoading;

  useEffect(() => {
    if (!loading && user && !isPremium && !hasShownAlert) {
      Swal.fire({
        icon: "info",
        title: "Premium Feature",
        text: "This feature requires a Premium subscription",
        confirmButtonColor: "#0ea5e9",
        confirmButtonText: "Upgrade Now",
        showCancelButton: true,
        cancelButtonText: "Maybe Later",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/pricing";
        }
      });
      setHasShownAlert(true);
    }
  }, [loading, user, isPremium, hasShownAlert]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Checking subscription...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isPremium) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

export default PremiumRoute;
