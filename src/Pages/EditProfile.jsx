import { useForm } from "react-hook-form";
import { useAuth } from "../Store/AuthStore";
import Swal from "sweetalert2";
import { HiChevronDown } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useProfile } from "../Store/ProfileStore";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
  const { user, initializeAuth } = useAuth();
  const { updateProfile, updateAvatar, changePassword, isLoading, fetchUser } =
    useProfile();
  const { register, handleSubmit, reset, watch } = useForm();
  const navigate = useNavigate();

  // Watch the new password field for strength meter
  const newPassword = watch("newPassword", "");

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
    bgColor: "",
  });

  // Password strength checker function
  const checkPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: "", color: "", bgColor: "" };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate score based on criteria met
    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    // Additional points for longer passwords
    if (password.length >= 12) score += 0.5;
    if (password.length >= 16) score += 0.5;

    // Determine strength level
    let label, color, bgColor;
    if (score < 2) {
      label = "Weak";
      color = "text-red-600";
      bgColor = "bg-red-500";
    } else if (score < 3) {
      label = "Fair";
      color = "text-orange-600";
      bgColor = "bg-orange-500";
    } else if (score < 4) {
      label = "Good";
      color = "text-yellow-600";
      bgColor = "bg-yellow-500";
    } else {
      label = "Strong";
      color = "text-green-600";
      bgColor = "bg-green-500";
    }

    return { score: Math.min(score, 4), label, color, bgColor };
  };

  // Update password strength when newPassword changes
  useEffect(() => {
    const strength = checkPasswordStrength(newPassword);
    setPasswordStrength(strength);
  }, [newPassword]);

  useEffect(() => {
    if (user) {
      reset({
        website: user.website || "",
        name: user.name || "",
        bio: user.bio || "",
        link: user.link || "",
        gender: user.gender || "Prefer not to say",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const onSubmitProfile = async (data) => {
    try {
      // Include all fields that might be updated
      const updateData = {
        name: data.name,
        bio: data.bio,
        link: data.link,
        gender: data.gender,
      };

      const updatedUser = await updateProfile(updateData);

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        initializeAuth();
      }
      await fetchUser();
      Swal.fire({
        title: "Success",
        text: "Profile updated successfully!",
        icon: "success",
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/profile");
    } catch (err) {
      console.error("Profile update error:", err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: err.message || "Update failed",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match!", "error");
    }

    // Check password strength before submission
    if (passwordStrength.score < 2) {
      return Swal.fire(
        "Error",
        "Password is too weak. Please choose a stronger password.",
        "error"
      );
    }

    try {
      const success = await changePassword(
        data.currentPassword,
        data.newPassword
      );

      if (success) {
        Swal.fire({
          title: "Success",
          text: "Password changed successfully!",
          icon: "success",
          position: "top",
          showConfirmButton: false,
          timer: 1500,
        });
        // Only reset password fields, keep profile data
        reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          name: user?.name || "",
          bio: user?.bio || "",
          link: user?.link || "",
          website: user?.website || "",
          gender: user?.gender || "Prefer not to say",
        });
      }
    } catch (err) {
      console.error("Password change error:", err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: err.message || "Update failed",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const updatedUser = await updateAvatar(file);

      // Update localStorage with the new user data
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        initializeAuth(); // Refresh auth state
      }

      // Fetch fresh user data
      await fetchUser();

      Swal.fire({
        title: "Success",
        text: "Avatar updated successfully!",
        icon: "success",
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error("Avatar update error:", err);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: err.message || "Update failed",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Updating profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitProfile)}
      className="edit-container px-4 py-8 max-w-3xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

      {/* Profile Picture */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img
              src={
                user?.avatar
                  ? `http://localhost:3000/${user.avatar}`
                  : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-base">{user?.name}</h2>
            <p className="text-gray-500">@{user?.name}</p>
          </div>
          <label className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Updating..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {/* Name Field - Add this if missing */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          {...register("name")}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
      </div>

      {/* Website */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Website</label>
        <input
          type="text"
          {...register("link")}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
          disabled={isLoading}
        />
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Bio</label>
        <textarea
          {...register("bio")}
          className="form-input w-full border border-gray-300 rounded-md px-3 py-2 resize-none h-24"
          disabled={isLoading}
        />
      </div>

      {/* Gender */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">Gender</label>
        <div className="relative">
          <select
            {...register("gender")}
            className="form-input w-full border border-gray-300 rounded-md px-3 py-2 pr-8 appearance-none"
            disabled={isLoading}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
            <option>Custom</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <HiChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-100 text-blue-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg p-6 my-8">
        <h2 className="font-medium text-lg mb-4">Change Password</h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Current Password</label>
          <input
            type="password"
            {...register("currentPassword")}
            className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">New Password</label>
          <input
            type="password"
            {...register("newPassword")}
            className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
            disabled={isLoading}
          />

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">
                  Password Strength:
                </span>
                <span
                  className={`text-xs font-medium ${passwordStrength.color}`}
                >
                  {passwordStrength.label}
                </span>
              </div>

              {/* Strength Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                ></div>
              </div>

              {/* Password Requirements */}
              <div className="mt-3 text-xs text-gray-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div
                    className={
                      newPassword.length >= 8
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ At least 8 characters
                  </div>
                  <div
                    className={
                      /[a-z]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Lowercase letter
                  </div>
                  <div
                    className={
                      /[A-Z]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Uppercase letter
                  </div>
                  <div
                    className={
                      /\d/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Number
                  </div>
                  <div
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Special character
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="form-input w-full border border-gray-300 rounded-md px-3 py-2"
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmitPassword)}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </form>
  );
};
