import { useState } from "react";
import { useAuth } from "../../Store/AuthStore";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleLogin = async (data) => {
    const { email, password } = data;

    setLoginError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginError("Invalid email or password, please try again");
      } else {
        setLoginError(error.message || "Error logging in");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="login-container rounded-md">
        {/* PhotoBooth Logo */}
        <div className="flex justify-center mb-8">
          <img src="./assets/logo.svg" alt="PhotoBooth" className="h-[51px]" />
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 border border-gray-300 mb-3 rounded-md">
          <form onSubmit={handleSubmit(handleLogin)}>
            {/* Username/Email Field */}
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Phone number, username, or email"
                  aria-label="Phone number, username, or email"
                  {...register("email", {
                    required: "Email or username is required",
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Password"
                  aria-label="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Show login error message */}
            {loginError && (
              <p className="text-red-500 text-center mb-3">{loginError}</p>
            )}

            {/* Login Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>

            {/* OR Separator */}
            <div className="or-separator">OR</div>

            {/* Google Login Button */}
            <div className="mb-4">
              <button
                type="button"
                className="login-button"
                onClick={() => alert("Google login not implemented")}
              >
                Log in with Google
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up Box */}
        <div className="bg-white p-6 border border-gray-300 text-center rounded-md">
          <p className="text-sm">
            Don't have an account? <Link to="/signup"> Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
