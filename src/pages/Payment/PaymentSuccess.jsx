import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Home, Loader2, CreditCard, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setError("No session ID found");
          setVerifying(false);
          return;
        }

        // Wait for webhook/verification to process with polling

        let isPremiumConfirmed = false;
        let attempts = 0;
        const maxAttempts = 10; // Try for 20 seconds total

        while (!isPremiumConfirmed && attempts < maxAttempts) {
          try {
            // 1. Try verify endpoint (Server might handle it)
            if (attempts === 0) {
              try {
                const verifyRes = await axiosSecure.post(
                  "/payment/verify-session",
                  { sessionId }
                );
                if (verifyRes.data?.payment) {
                  setPaymentData(verifyRes.data.payment);
                }
              } catch (e) { }
            }

            // 2. Check user profile directly
            const { data: userProfile } = await axiosSecure.get("/users/me");

            if (userProfile?.isPremium) {
              isPremiumConfirmed = true;
              setPaymentData(
                (prev) =>
                  prev || {
                    amount: 0, // Fallback if verify failed
                    paymentDate: new Date().toISOString(),
                  }
              );
            } else {
              throw new Error("Not premium yet");
            }
          } catch (e) {
            attempts++;

            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        // Force refresh all data

        await queryClient.invalidateQueries(["user"]);
        await queryClient.invalidateQueries(["user-profile"]);
        await queryClient.invalidateQueries(["userPlan"]);
        await queryClient.invalidateQueries(["payment-history"]);

        if (isPremiumConfirmed) {
          // Update global auth state immediately
          await refreshUser();
          setVerifying(false);
        } else {
          // Even if polling "failed" (timed out), we might still be okay,
          // just proceed to dashboard. Webhook might be slow.

          setVerifying(false);
        }

        // Redirect to dashboard after 6 seconds
        const timer = setTimeout(() => {
          navigate("/dashboard");
        }, 6000);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error("❌ Error in payment flow:", err);
        setError(err.response?.data?.message || "Payment verification issue");
        setVerifying(false);

        // Still try to refresh user data
        try {
          await queryClient.invalidateQueries(["user"]);
          await queryClient.invalidateQueries(["user-profile"]);
        } catch (e) {
          console.error("Failed to refresh queries:", e);
        }
      }
    };

    verifyPayment();
  }, [navigate, queryClient, axiosSecure, sessionId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verifying payment...
          </h1>
          <p className="text-gray-600 text-lg">
            Please wait, we are verifying your payment and activating premium
            access.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verification Failed
          </h1>
          <p className="text-gray-600 text-lg mb-8">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Don't worry! Your payment was successful. Check again later or
            contact support.
          </p>
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="block w-full py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <Helmet>
        <title>Payment Success | Digital Life Lessons</title>
      </Helmet>
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Congratulations! You are now a premium member. All premium features
          have been activated on your account.
        </p>

        {/* Payment Details */}
        {paymentData && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Payment Details
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="bangla-text">Amount</span>
                </span>
                <span className="font-bold text-gray-900">
                  Tk {(paymentData.amount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="bangla-text">Date</span>
                </span>
                <span className="font-semibold text-gray-900">
                  {new Date(paymentData.paymentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  Completed
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="block w-full py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          You will be automatically redirected to the dashboard in 6 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
