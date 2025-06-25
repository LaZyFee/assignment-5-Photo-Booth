import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/AuthStore";
import { LoginPopup } from "../Components/Shared/LoginPopup";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (!user?._id) {
      setShowLoginPopup(true);
    }
  }, [user, location.pathname]);

  if (user?._id) {
    return children;
  }

  const handleClose = () => {
    setShowLoginPopup(false);
    navigate("/");
  };

  return (
    <>
      <LoginPopup
        open={showLoginPopup}
        onClose={handleClose}
        redirectPath={location.pathname}
      />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Please log in to continue...</p>
      </div>
    </>
  );
};
