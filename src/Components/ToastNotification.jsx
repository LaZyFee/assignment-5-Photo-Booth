import { FaCheckCircle } from "react-icons/fa";

export const ToastNotification = ({ showToast }) => {
  if (!showToast) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-slide-in">
      <div className="flex items-center">
        <FaCheckCircle className="w-4 h-4 mr-2" />
        Link copied to clipboard!
      </div>
    </div>
  );
};
