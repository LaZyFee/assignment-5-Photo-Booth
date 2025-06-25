import { FaTimes, FaImage, FaCheckCircle } from "react-icons/fa";

export const EditPostModal = ({
  showEditModal,
  handleCloseEditModal,
  handlePostEditSubmit,
  editCaption,
  setEditCaption,
  previewImage,
  post,
  handleImageChange,
  editImage,
  BASE_URL,
}) => {
  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-2xl flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <button
            onClick={handleCloseEditModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handlePostEditSubmit} className="space-y-6">
          {/* Image Preview Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Image
            </label>

            {/* Current/Preview Image */}
            <div className="relative mb-4 w-1/3 mx-auto">
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                <img
                  src={previewImage || `${BASE_URL}/${post.image}`}
                  alt="Post preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Overlay for image change */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <label className="cursor-pointer bg-white/90 hover:bg-white px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Change Image
                </label>
              </div>
            </div>

            {/* Image Upload Button */}
            <div className="flex items-center justify-center">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg cursor-pointer transition-colors border border-blue-200">
                <FaImage className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewImage ? "Change Image" : "Upload New Image"}
              </label>
            </div>

            {editImage && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">
                    New image selected:{" "}
                    <span className="font-medium">{editImage.name}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Caption Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows="4"
              placeholder="Edit caption..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCloseEditModal}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
