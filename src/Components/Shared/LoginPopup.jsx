import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Store/AuthStore";
import { useNavigate, Link } from "react-router-dom";

export const LoginPopup = ({ open, onClose, redirectPath = "/" }) => {
  const { login, isLoading } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
      onClose();
      navigate(redirectPath);
    } catch (error) {
      setLoginError(
        error.response?.status === 401
          ? "Invalid email or password"
          : error.message || "Login error"
      );
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold text-center mb-4">
          Sign in to continue
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <input
              type="text"
              className="form-input"
              placeholder="Email or username"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input pr-16"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-xs text-gray-500"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p className="text-sm text-red-500 text-center">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>

        <button
          onClick={onClose}
          className="block text-sm text-gray-500 hover:underline mt-4 mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
