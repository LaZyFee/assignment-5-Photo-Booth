import { useState, useEffect } from "react";
import { usePostStore } from "../../Store/PostStore";
import { Link } from "react-router-dom";
import { useAuth } from "../../Store/AuthStore";
import { formatDistanceToNow, format } from "date-fns";
import { PostActions } from "../PostActions";
import { AddComment } from "../AddComment";
import { ToastNotification } from "../ToastNotification";
import { copyToClipboard } from "../../Utils/clipboard";
import { TruncateText } from "../TruncateText";
import { LoginPopup } from "../Shared/LoginPopup";

export const SinglePost = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { toggleLike, addComment } = usePostStore();
  const { user } = useAuth();

  const profilePath =
    user?._id === post.user?._id ? "/profile" : `/user/${post.user?._id}`;

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    if (user && post.likes) {
      const userHasLiked = post.likes.includes(user._id);
      setIsLiked(userHasLiked);
    }
  }, [user, post.likes]);

  const handleLike = async () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      await toggleLike(post._id);
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    if (!comment.trim()) return;

    try {
      await addComment(post._id, comment);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShare = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCommentClick = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
  };

  return (
    <article className="border-b pb-4 mb-4 max-w-[560px] mx-auto border rounded-md bg-white">
      {/* Header */}
      <Link to={profilePath}>
        <div className="flex items-center p-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
            <img
              src={
                post.user?.avatar
                  ? `${BASE_URL}/${post.user.avatar}`
                  : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
              }
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2">
            <p className="font-semibold text-sm">{post.user?.name}</p>
            <span
              className="text-gray-500 text-xs"
              title={format(new Date(post.createdAt), "PPpp")}
            >
              •{" "}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </Link>

      <Link
        to={`/post-details/${post._id}`}
        className="relative cursor-pointer"
      >
        <img
          src={`${BASE_URL}/${post.image}`}
          alt="Post content"
          className="w-full object-cover max-h-[600px]"
        />
      </Link>

      {/* Post Actions */}
      <PostActions
        isLiked={isLiked}
        handleLike={handleLike}
        handleShare={handleShare}
        likesCount={post.likesCount?.length || 0}
        post={post}
        user={user}
      />

      {/* Caption */}
      <div className="px-3 mt-1">
        <p className="text-sm font-semibold">{post.user?.name}</p>
        <TruncateText text={post.caption} limit={100} />
      </div>

      {/* Comment link */}
      <Link to={`/post-details/${post._id}`} className="px-3 mt-1">
        <button className="text-gray-500 text-sm hover:underline">
          View all {post.commentsCount || 0} comments
        </button>
      </Link>

      {/* Add Comment */}
      <AddComment
        currentUser={user}
        comment={comment}
        setComment={setComment}
        handleCommentSubmit={handleCommentSubmit}
        handleCommentClick={handleCommentClick}
        BASE_URL={BASE_URL}
      />

      {/* Toast Notification */}
      <ToastNotification showToast={showToast} />

      {/* Login Popup */}
      <LoginPopup
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        redirectPath={window.location.pathname}
      />
    </article>
  );
};
