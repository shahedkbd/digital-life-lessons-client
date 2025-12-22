import { useMutation } from "@tanstack/react-query";
import { Check, Star, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserPlan from "../../hooks/useUserPlan";
import SectionHeader from "../../components/ui/SectionHeader";

const Pricing = () => {
  const { isPremium } = useUserPlan();
  const axiosSecure = useAxiosSecure();

  const createCheckoutSession = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/payment/create-checkout-session");
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleUpgrade = () => {
    createCheckoutSession.mutate();
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4">
    //   <Helmet>
    //     <title>Pricing | Digital Life Lessons</title>
    //   </Helmet>
    //   <SectionHeader
    //     title="Our Plans"
    //     subtitle="Choose the best plan according to your needs"
    //   />

    //   <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
    //     <div className="overflow-x-auto">
    //       <table className="w-full">
    //         <thead>
    //           <tr className="bg-gray-50 border-b border-gray-100">
    //             <th className="py-6 px-6 text-left text-xl font-bold text-gray-900 w-1/3">
    //               Features
    //             </th>
    //             <th className="py-6 px-6 text-center w-1/3">
    //               <div className="text-xl font-bold text-gray-900">Free</div>
    //               <div className="text-sm text-gray-500 mt-1">
    //                 Tk 0 / lifetime
    //               </div>
    //             </th>
    //             <th className="py-6 px-6 text-center w-1/3 bg-primary-50">
    //               <div className="flex items-center justify-center gap-2">
    //                 <span className="text-xl font-bold text-primary-700">
    //                   Premium
    //                 </span>
    //                 <Star className="w-5 h-5 text-yellow-500 fill-current" />
    //               </div>
    //               <div className="text-sm text-primary-600 mt-1">
    //                 Tk 1500 / lifetime
    //               </div>
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody className="divide-y divide-gray-100">
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Watch Public Lessons
    //             </td>
    //             <td className="py-4 px-6 text-center text-gray-600">
    //               Free Only
    //             </td>
    //             <td className="py-4 px-6 text-center text-primary-700 font-semibold bg-primary-50/30">
    //               All (Free + Premium)
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Create Lessons
    //             </td>
    //             <td className="py-4 px-6 text-center text-gray-600">
    //               Unlimited
    //             </td>
    //             <td className="py-4 px-6 text-center text-primary-700 font-semibold bg-primary-50/30">
    //               Unlimited
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Create Premium Lessons
    //             </td>
    //             <td className="py-4 px-6 text-center">
    //               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
    //                 ✕
    //               </span>
    //             </td>
    //             <td className="py-4 px-6 text-center bg-primary-50/30">
    //               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
    //                 <Check className="w-4 h-4" />
    //               </span>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Ad-free Experience
    //             </td>
    //             <td className="py-4 px-6 text-center">
    //               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
    //                 ✕
    //               </span>
    //             </td>
    //             <td className="py-4 px-6 text-center bg-primary-50/30">
    //               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
    //                 <Check className="w-4 h-4" />
    //               </span>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Profile Badge
    //             </td>
    //             <td className="py-4 px-6 text-center text-gray-600">
    //               None
    //             </td>
    //             <td className="py-4 px-6 text-center text-primary-700 font-semibold bg-primary-50/30">
    //               Premium Badge
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Priority Listing
    //             </td>
    //             <td className="py-4 px-6 text-center">
    //               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
    //                 ✕
    //               </span>
    //             </td>
    //             <td className="py-4 px-6 text-center bg-primary-50/30">
    //               <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
    //                 <Check className="w-4 h-4" />
    //               </span>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td className="py-4 px-6 text-gray-700 font-medium">
    //               Support
    //             </td>
    //             <td className="py-4 px-6 text-center text-gray-600">
    //               Standard
    //             </td>
    //             <td className="py-4 px-6 text-center text-primary-700 font-semibold bg-primary-50/30">
    //               Priority
    //             </td>
    //           </tr>
    //           {/* Action Rows */}
    //           <tr className="bg-gray-50 border-t border-gray-100">
    //             <td className="py-6 px-6"></td>
    //             <td className="py-6 px-6 text-center">
    //               {!isPremium && (
    //                 <button
    //                   disabled
    //                   className="px-6 py-2.5 bg-gray-200 text-gray-600 rounded-lg font-semibold cursor-default"
    //                 >
    //                   Current Plan
    //                 </button>
    //               )}
    //             </td>
    //             <td className="py-6 px-6 text-center bg-primary-50/30">
    //               {isPremium ? (
    //                 <button
    //                   disabled
    //                   className="px-6 py-2.5 bg-green-100 text-green-700 rounded-lg font-bold flex items-center justify-center gap-2 mx-auto cursor-default"
    //                 >
    //                   <Check className="w-5 h-5" />
    //                   Paid
    //                 </button>
    //               ) : (
    //                 <button
    //                   onClick={handleUpgrade}
    //                   disabled={createCheckoutSession.isPending}
    //                   className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-105"
    //                 >
    //                   {createCheckoutSession.isPending
    //                     ? "Processing..."
    //                     : "Upgrade Now"}
    //                 </button>
    //               )}
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-16 px-4">
  <Helmet>
    <title>Pricing | Digital Life Lessons</title>
  </Helmet>

  <SectionHeader
    title="Simple, Transparent Pricing"
    subtitle="No hidden fees. Pay once, learn forever."
  />

  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
    {/* Free Plan */}
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 flex flex-col">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
      <p className="text-gray-500 mb-6">Perfect for getting started</p>

      <div className="text-4xl font-extrabold text-gray-900 mb-6">
        Tk 0 <span className="text-base font-medium text-gray-500">/ lifetime</span>
      </div>

      <ul className="space-y-4 flex-1">
        <li className="flex items-center gap-3 text-gray-700">
          <Check className="w-5 h-5 text-green-500" />
          Watch Public Lessons
        </li>
        <li className="flex items-center gap-3 text-gray-700">
          <Check className="w-5 h-5 text-green-500" />
          Unlimited Lesson Creation
        </li>
        <li className="flex items-center gap-3 text-gray-400">
          ✕ Premium Lessons
        </li>
        <li className="flex items-center gap-3 text-gray-400">
          ✕ Ad-free Experience
        </li>
        <li className="flex items-center gap-3 text-gray-400">
          ✕ Priority Support
        </li>
      </ul>

      <button
        disabled
        className="mt-8 w-full py-3 bg-gray-200 text-gray-600 rounded-xl font-semibold cursor-default"
      >
        Current Plan
      </button>
    </div>

    {/* Premium Plan */}
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white relative">
      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
        BEST VALUE
      </div>

      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
        Premium <Star className="w-5 h-5 fill-current" />
      </h3>
      <p className="text-primary-100 mb-6">
        For serious learners & creators
      </p>

      <div className="text-4xl font-extrabold mb-6">
        Tk 1500 <span className="text-base font-medium text-primary-100">/ lifetime</span>
      </div>

      <ul className="space-y-4 mb-8">
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-white" />
          All Free Features Included
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-white" />
          Create Premium Lessons
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-white" />
          Ad-free Experience
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-white" />
          Premium Profile Badge
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-white" />
          Priority Support & Listing
        </li>
      </ul>

      {isPremium ? (
        <button
          disabled
          className="w-full py-3 bg-white text-primary-700 rounded-xl font-bold cursor-default"
        >
          ✓ Already Activated
        </button>
      ) : (
        <button
          onClick={handleUpgrade}
          disabled={createCheckoutSession.isPending}
          className="w-full py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-100 transition-all"
        >
          {createCheckoutSession.isPending ? "Processing..." : "Upgrade Now"}
        </button>
      )}
    </div>
  </div>
</div>


  );
};

export default Pricing;
