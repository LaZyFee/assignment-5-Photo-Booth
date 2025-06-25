import { useForm } from "react-hook-form";
import { useAuth } from "../../Store/AuthStore";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 6) strength += 30;
  if (/[A-Z]/.test(password)) strength += 30;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[!@#$&*]/.test(password)) strength += 20;
  return Math.min(strength, 100);
};
const getPasswordStrengthColor = (strength) => {
  if (strength < 40) return "bg-red-500"; // weak
  if (strength < 70) return "bg-blue-500"; // medium
  return "bg-green-500"; // strong
};
export const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [signUpError, setSignUPError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const password = watch("password", "");

  const handleSignUp = async (data) => {
    const { name, email, password } = data;

    const formData = {
      name,
      email,
      password,
    };

    try {
      await signup(formData);
      navigate("/edit-profile");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error signing up";
      setSignUPError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/assets/logo-2.svg" alt="PhotoBooth" className="h-[51px]" />
        </div>

        {/* Sign Up Form */}
        <div className="bg-white p-6 border border-gray-300 mb-3 rounded-md">
          <h2 className="text-center font-semibold text-gray-500 text-lg mb-4">
            Sign up to see photos and videos from your friends.
          </h2>

          <form onSubmit={handleSubmit(handleSignUp)}>
            {/* Email / Phone */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Mobile Number or Email"
                aria-label="Mobile Number or Email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Full Name"
                aria-label="Full Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Username"
                aria-label="Username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-3 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be 6 characters long",
                  },
                  pattern: {
                    value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                    message:
                      "Password must have uppercase, number, and special characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            {password && (
              <div className="mb-3">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                        calculatePasswordStrength(password)
                      )}`}
                      style={{
                        width: `${calculatePasswordStrength(password)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {signUpError && (
              <p className="mb-3 text-red-500 text-center">{signUpError}</p>
            )}

            {/* Sign Up Button */}
            <div className="mb-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-md transition disabled:opacity-50"
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
            </div>

            {/* OR Separator */}
            <div className="text-center text-gray-500 text-sm font-medium mb-4">
              OR
            </div>

            {/* Google Sign Up */}
            <div className="mb-4">
              <button
                type="button"
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-md transition"
                onClick={() => alert("Google Sign Up not implemented")}
              >
                Sign up with Google
              </button>
            </div>
          </form>
        </div>

        {/* Login Box */}
        <div className="bg-white p-6 border border-gray-300 text-center rounded-md">
          <p className="text-sm">
            Have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
