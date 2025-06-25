import { FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { TruncateText } from "./TruncateText";

export const CommentSection = ({
  post,
  currentUser,
  editingComment,
  editText,
  setEditText,
  showCommentOptions,
  setShowCommentOptions,
  handleEditComment,
  handleEditSubmit,
  handleDeleteComment,
  handleCancelEdit,
  BASE_URL,
}) => {
  //  (newest first)
  const sortedComments = post.comments
    ? [...post.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  return (
    <div className="comments-section flex-grow p-3 border-b">
      <h3 className="font-bold pb-4">Comments</h3>

      {sortedComments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments available.</p>
      ) : (
        sortedComments.map((c, i) => (
          <div className="flex mb-4" key={c._id || i}>
            <Link
              to={`/user/${c.user?._id}`}
              className="w-8 h-8 rounded-full overflow-hidden bg-white p-[1px] mr-2"
            >
              <img
                src={
                  c.user?.avatar
                    ? `${BASE_URL}/${c.user.avatar}`
                    : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                }
                alt="User"
                className="w-full h-full object-cover rounded-full"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link to={`/user/${c.user?._id}`}>
                  <span className="font-semibold text-sm">{c.user?.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDistanceToNow(new Date(c.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </Link>
                {c.user?._id === currentUser?._id && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowCommentOptions(
                          showCommentOptions === c._id ? null : c._id
                        )
                      }
                      className="text-gray-600 hover:text-gray-800 p-1"
                    >
                      <FaEllipsisH className="h-3 w-3" />
                    </button>

                    {showCommentOptions === c._id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10">
                        <button
                          onClick={() => {
                            handleEditComment(c);
                            setShowCommentOptions(null);
                          }}
                          className="flex items-center w-full px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                        >
                          <FaEdit className="mr-1 h-2 w-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteComment(c._id);
                            setShowCommentOptions(null);
                          }}
                          className="flex items-center w-full px-2 py-1 text-xs text-red-600 hover:bg-gray-100"
                        >
                          <FaTrash className="mr-1 h-2 w-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingComment === c._id ? (
                <form onSubmit={handleEditSubmit} className="mt-2 flex gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="text-sm border rounded px-2 py-1 flex-1"
                  />
                  <button
                    type="submit"
                    className="text-blue-500 text-sm hover:text-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancelEdit(c._id)}
                    className="text-gray-500 text-sm hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <TruncateText text={c.text} limit={100} />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
