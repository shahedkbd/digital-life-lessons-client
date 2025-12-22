import { Loader2 } from "lucide-react";

const Loading = ({ fullScreen = true, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
