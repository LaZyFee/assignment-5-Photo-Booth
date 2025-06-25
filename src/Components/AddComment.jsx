import { FaRegPaperPlane } from "react-icons/fa";

export const AddComment = ({
  currentUser,
  comment,
  setComment,
  handleCommentSubmit,
  handleCommentClick,
  BASE_URL,
}) => (
  <div className="p-3 flex items-center">
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 mr-2">
      <img
        src={
          currentUser?.avatar
            ? `${BASE_URL}/${currentUser.avatar}`
            : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
        }
        alt="Your avatar"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 flex items-center justify-between">
      <input
        type="text"
        placeholder={currentUser ? "Add a comment..." : "Sign in to comment"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(e)}
        onClick={handleCommentClick}
        className="text-sm w-full outline-none placeholder-gray-400"
        disabled={!currentUser}
      />
      <button
        onClick={handleCommentSubmit}
        className="text-zinc-600 hover:text-blue-500 transition-colors ml-2"
        disabled={!comment.trim() || !currentUser}
      >
        <FaRegPaperPlane className="h-5 w-5" />
      </button>
    </div>
  </div>
);
