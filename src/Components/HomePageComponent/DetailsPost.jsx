import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePostDetails } from "../../hooks/usePostDetails";
import { PostHeader } from "../PostHeader";
import { CommentSection } from "../CommentSection";
import { PostActions } from "../PostActions";
import { AddComment } from "../AddComment";
import { ToastNotification } from "../ToastNotification";
import { EditPostModal } from "../EditPostModal";
import { TruncateText } from "../TruncateText";
import { LoginPopup } from "../Shared/LoginPopup";
import { usePostStore } from "../../Store/PostStore";
export const DetailsPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userPosts, fetchUserPosts } = usePostStore();
  const BASE_URL = "http://localhost:3000";
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const {
    post,
    isLoading,
    currentUser,
    comment,
    setComment,
    editingComment,
    editText,
    setEditText,
    isLiked,
    showPostOptions,
    setShowPostOptions,
    showCommentOptions,
    setShowCommentOptions,
    showEditModal,
    editCaption,
    setEditCaption,
    editImage,
    showToast,
    previewImage,
    handleLike: originalHandleLike,
    handleCommentSubmit: originalHandleCommentSubmit,
    handleEditComment,
    handleEditSubmit,
    handleDeleteComment,
    handleCancelEdit,
    handleEditPost,
    handlePostEditSubmit,
    handleCloseEditModal,
    handleShare,
    handleDeletePost,
    handleImageChange,
    setEditingComment,
  } = usePostDetails(id);

  // Fetch user's posts
  useEffect(() => {
    if (post?.user?._id) {
      fetchUserPosts(post.user._id);
    }
  }, [post?.user?._id, fetchUserPosts]);
  const handleLike = async () => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
    await originalHandleLike();
  };

  const handleCommentSubmit = async (e) => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
    await originalHandleCommentSubmit(e);
  };

  const handleCommentClick = () => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
  };

  if (isLoading || !post)
    return <div className="text-center mt-10">Loading post...</div>;

  const isOwner = currentUser && post.user && currentUser._id === post.user._id;

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 pt-10 pb-6 px-4 ml-[260px]">
      <div className="bg-white rounded-sm overflow-hidden max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left - Post Image */}
          <div className="w-full md:w-1/2 mr-5 bg-black flex items-center justify-center md:h-[500px]">
            <img
              src={`${BASE_URL}/${post.image}`}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Post Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <PostHeader
              post={post}
              isOwner={isOwner}
              showPostOptions={showPostOptions}
              setShowPostOptions={setShowPostOptions}
              handleEditPost={handleEditPost}
              handleDeletePost={() => handleDeletePost(navigate)}
              BASE_URL={BASE_URL}
            />

            {/* Caption */}
            <div className="p-3 text-sm border-b">
              <TruncateText text={post.caption} limit={100} />
            </div>

            <CommentSection
              post={post}
              currentUser={currentUser}
              editingComment={editingComment}
              editText={editText}
              setEditText={setEditText}
              showCommentOptions={showCommentOptions}
              setShowCommentOptions={setShowCommentOptions}
              handleEditComment={handleEditComment}
              handleEditSubmit={handleEditSubmit}
              handleDeleteComment={handleDeleteComment}
              handleCancelEdit={handleCancelEdit}
              setEditingComment={setEditingComment}
              BASE_URL={BASE_URL}
            />

            <PostActions
              isLiked={isLiked}
              handleLike={handleLike}
              handleShare={handleShare}
              post={post}
              user={currentUser}
            />

            <AddComment
              currentUser={currentUser}
              comment={comment}
              setComment={setComment}
              handleCommentSubmit={handleCommentSubmit}
              handleCommentClick={handleCommentClick}
              BASE_URL={BASE_URL}
            />
          </div>
        </div>

        {/* displaying owner's other posts */}
        {/* displaying owner's other posts */}
        <section className="p-4 border-t border-gray-200 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            More posts from{" "}
            <span className="text-blue-600">{post?.user?.name || "user"}</span>
          </h2>

          {!Array.isArray(userPosts) || userPosts.length === 0 ? (
            <p className="text-gray-600 text-center italic">
              No other posts available.
            </p>
          ) : userPosts.length === 1 && userPosts[0]._id === post._id ? (
            <p className="text-gray-600 text-center italic">
              User has only posted this post.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {userPosts
                .filter((p) => p._id !== post._id) // Exclude current post
                .slice(0, 8) // Show up to 8 posts
                .map((otherPost) => (
                  <div
                    key={otherPost._id}
                    onClick={() => navigate(`/post-details/${otherPost._id}`)}
                    className="relative cursor-pointer group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    title={otherPost.caption || "User post"}
                  >
                    <img
                      src={`${BASE_URL}/${otherPost.image}`}
                      alt={otherPost.caption || "User post"}
                      className="w-full h-36 sm:h-40 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm px-2 text-center">
                      {otherPost.caption?.length > 50
                        ? otherPost.caption.slice(0, 47) + "..."
                        : otherPost.caption || "View post"}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <ToastNotification showToast={showToast} />

        <EditPostModal
          showEditModal={showEditModal}
          handleCloseEditModal={handleCloseEditModal}
          handlePostEditSubmit={handlePostEditSubmit}
          editCaption={editCaption}
          setEditCaption={setEditCaption}
          previewImage={previewImage}
          post={post}
          handleImageChange={handleImageChange}
          editImage={editImage}
          BASE_URL={BASE_URL}
        />

        {/* Login Popup */}
        <LoginPopup
          open={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          redirectPath={window.location.pathname}
        />
      </div>
    </div>
  );
};
