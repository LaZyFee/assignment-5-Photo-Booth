import { FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

export const PostHeader = ({
  post,
  isOwner,
  showPostOptions,
  setShowPostOptions,
  handleEditPost,
  handleDeletePost,
  BASE_URL,
}) => (
  <div className="flex items-center justify-between p-3 border-b">
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
        <img
          src={
            post.user?.avatar
              ? `${BASE_URL}/${post.user.avatar}`
              : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
          }
          alt={post.user?.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="ml-2">
        <span className="font-semibold text-sm">{post.user?.name}</span>
        <div className="text-[10px] text-gray-600">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>

    {isOwner && (
      <div className="relative">
        <button
          onClick={() => setShowPostOptions(!showPostOptions)}
          className="text-gray-600 hover:text-gray-800 p-1"
        >
          <FaEllipsisH className="h-4 w-4" />
        </button>

        {showPostOptions && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
            <button
              onClick={handleEditPost}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEdit className="mr-2 h-3 w-3" />
              Edit Post
            </button>
            <button
              onClick={handleDeletePost}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <FaTrash className="mr-2 h-3 w-3" />
              Delete Post
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);
