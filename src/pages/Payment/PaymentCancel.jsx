import { Link } from "react-router-dom";
import { XCircle, RefreshCw } from "lucide-react";

const PaymentCancel = () => {
  return (
    // <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
    //   <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
    //     <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
    //       <XCircle className="w-12 h-12 text-red-600" />
    //     </div>

    //     <h1 className="text-3xl font-bold text-gray-900 mb-4">
    //       Payment Cancelled
    //     </h1>
    //     <p className="text-gray-600 text-lg mb-8">
    //       Your payment was not completed for some reason. You can try again if
    //       you wish.
    //     </p>

    //     <div className="space-y-4">
    //       <Link
    //         to="/pricing" 
    //         className="block w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2"
    //       >
    //         <RefreshCw className="w-5 h-5" />
    //         Try Again
    //       </Link>
    //       <Link
    //         to="/"
    //         className="block w-full py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors border border-gray-200"
    //       >
    //         Return to Home
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
  <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
      <XCircle className="w-12 h-12 text-red-600" />
    </div>

    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      Payment Cancelled
    </h1>
    <p className="text-gray-600 text-lg mb-8">
      Your payment was not completed for some reason. You can try again if you wish.
    </p>

    <div className="space-y-4">
      <Link
        to="/pricing"
        aria-label="Retry Payment"
        className="block w-full py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:bg-red-700"
      >
        <RefreshCw className="w-5 h-5" />
        Try Again
      </Link>
      <Link
        to="/"
        aria-label="Return to Home"
        className="block w-full py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors border border-gray-200"
      >
        Return to Home
      </Link>
    </div>
  </div>
</div>

  );
};

export default PaymentCancel;
