import {
  HiArrowLeft,
  HiOutlineEmojiHappy,
  HiOutlineLocationMarker,
  HiOutlineUserAdd,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { usePostStore } from "../Store/PostStore";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { useAuth } from "../Store/AuthStore";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const { createPost, isLoading } = usePostStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = async (data) => {
    const hasCaption = data.caption?.trim();
    const hasImage = selectedFile;

    // Validation
    if (!hasCaption || !hasImage) {
      if (!hasCaption) {
        setError("caption", {
          type: "manual",
          message: "Caption is required",
        });
      }
      if (!hasImage) {
        Swal.fire("Error", "Image is required", "error");
      }
      return;
    }

    try {
      await createPost({
        caption: data.caption,
        image: selectedFile,
      });

      Swal.fire({
        title: "Success",
        text: "Post created successfully",
        icon: "success",
        position: "top",
        showConfirmButton: false,
        timer: 2000,
      });

      reset();
      setPreview(null);
      setSelectedFile(null);
      navigate("/");
    } catch (err) {
      console.error("Create post error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setValue("image", file);
    } else {
      setPreview(null);
      setSelectedFile(null);
      setValue("image", null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-h-screen bg-white"
    >
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4">
        <button type="button" className="p-1">
          <HiArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-base font-semibold">Create new post</h1>
        <button
          type="submit"
          className="text-blue-500 font-semibold disabled:text-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </header>

      {/* Main Content */}
      <div className="upload-container flex flex-col md:flex-row flex-1">
        {/* Left - Image Preview */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative min-h-[300px]">
          {preview ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={preview}
                alt="Upload preview"
                className="object-contain max-h-[300px] max-w-full"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                  setValue("image", null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="cursor-pointer bg-black bg-opacity-75 text-white text-sm py-2 px-4 rounded-md hover:bg-opacity-90 transition-all">
              Select Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Right - Post Details */}
        <div className="w-full md:w-1/2 bg-white flex flex-col">
          {/* User Info */}
          <div className="flex items-center p-4 border-b">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
              <img
                src={
                  user.avatar
                    ? `http://localhost:3000/${user.avatar}`
                    : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-3 font-semibold text-sm">{user.name}</span>
          </div>

          {/* Caption Section */}
          <div className="p-4 border-b flex-grow">
            <div className="mb-2">
              <p className="font-medium text-base mb-2">Caption Section</p>
              <textarea
                className="w-full resize-none border-0 outline-none text-sm"
                placeholder="Write a caption..."
                {...register("caption")}
                rows={4}
              />
              {errors.caption && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.caption.message}
                </p>
              )}
            </div>

            {/* Character Count and Emoji */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                title="Add emoji (not implemented)"
              >
                <HiOutlineEmojiHappy className="h-6 w-6" />
              </button>
              <span className="text-gray-400 text-xs">
                {watch("caption")?.length || 0}/2,200
              </span>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex flex-col divide-y">
            <button
              type="button"
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-base text-gray-600">Add location</span>
              <HiOutlineLocationMarker className="h-5 w-5 text-gray-600" />
            </button>

            <button
              type="button"
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-base text-gray-600">Add collaborators</span>
              <HiOutlineUserAdd className="h-5 w-5 text-gray-600" />
            </button>

            <button
              type="button"
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-base text-gray-600">Accessibility</span>
              <HiOutlineChevronDown className="h-5 w-5 text-gray-600" />
            </button>

            <button
              type="button"
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-base text-gray-600">Advanced settings</span>
              <HiOutlineChevronDown className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
