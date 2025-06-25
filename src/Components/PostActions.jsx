import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegShareSquare,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const PostActions = ({
  isLiked,
  handleLike,
  handleShare,
  likesCount,
  user,
  post,
}) => (
  <div className="p-3 border-b">
    <div className="flex justify-between mb-2">
      <div className="flex space-x-4">
        <button
          onClick={handleLike}
          className={`transition-colors ${
            isLiked ? "text-red-500" : "text-zinc-600"
          } hover:text-red-500 ${!user ? "cursor-pointer" : ""}`}
          title={!user ? "Sign in to like" : ""}
        >
          {isLiked ? (
            <FaHeart className="h-6 w-6" />
          ) : (
            <FaRegHeart className="h-6 w-6" />
          )}
        </button>
        <button
          className="text-zinc-600 hover:text-gray-800 transition-colors"
          title={!user ? "Sign in to comment" : ""}
        >
          <Link to={`/post-details/${post._id}`}>
            {" "}
            <FaRegComment className="h-6 w-6" />{" "}
          </Link>
        </button>
        <button
          onClick={handleShare}
          className="text-zinc-600 hover:text-gray-800 transition-colors"
        >
          <FaRegShareSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
    <p className="text-sm font-semibold mb-1">
      {likesCount || 0} {likesCount === 1 ? "like" : "likes"}
    </p>
  </div>
);
