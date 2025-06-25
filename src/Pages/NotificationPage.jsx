import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../Store/NotificationStore";
import { usePostStore } from "../Store/PostStore";
import { formatNotificationMessage } from "../Utils/formatNotificationMessage";
import { formatTime } from "../Utils/formateTime";

export const NotificationPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    isLoading,
    error,
  } = useNotificationStore();
  const { fetchPostById, selectedPost } = usePostStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const fetchPostImages = async () => {
      const postIds = notifications
        .filter((n) => n.postId)
        .map((n) => n.postId);

      const uniquePostIds = [...new Set(postIds)];

      for (const id of uniquePostIds) {
        try {
          await fetchPostById(id);
        } catch (err) {
          console.error(`Failed to fetch post ${id}:`, err);
        }
      }
    };

    if (notifications.length > 0) {
      fetchPostImages();
    }
  }, [notifications, fetchPostById]);

  // Filter and group notifications (only likes and comments)
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.type === "like" || notification.type === "comment"
  );

  const groupedNotifications = filteredNotifications.reduce(
    (acc, notification) => {
      const section = notification.type === "like" ? "Likes" : "Comments";

      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(notification);
      return acc;
    },
    {}
  );

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate to post details
    if (notification.postId) {
      navigate(`/post-details/${notification.postId}`);
    }
  };

  const handleProfileClick = (e, fromUserId) => {
    e.stopPropagation();
    navigate(`/user/${fromUserId}`);
  };

  const toggleReadStatus = async (e, notification) => {
    e.stopPropagation();
    if (notification.isRead) {
      await markAsUnread(notification._id);
    } else {
      await markAsRead(notification._id);
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    if (avatar.startsWith("uploads\\")) {
      return `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/${avatar.replace(/\\/g, "/")}`;
    }
    return avatar;
  };

  if (isLoading) {
    return (
      <div className="notifications-container">
        <header className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
        </header>
        <div className="p-4 text-sm text-gray-500 text-center">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <header className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
        </header>
        <div className="p-4 text-red-500 text-sm text-center">{error}</div>
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <div className="notifications-container">
        <header className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
        </header>
        <div className="p-4 text-sm text-gray-500 text-center">
          No notifications found.
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <header className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Notifications</h1>
          <span className="text-sm text-gray-500">
            {filteredNotifications.filter((n) => !n.isRead).length} unread
          </span>
        </div>
      </header>

      <div className="notifications-list">
        {Object.entries(groupedNotifications).map(([section, items]) => (
          <div key={section} className="mb-4">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-700">
                {section} ({items.length})
              </h2>
            </div>

            {items.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* User Avatar - Click to visit profile */}
                <div
                  className="w-11 h-11 rounded-full overflow-hidden mr-3 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                  onClick={(e) =>
                    handleProfileClick(e, notification.fromUserId)
                  }
                >
                  <img
                    src={getAvatarUrl(notification.fromUser?.avatar)}
                    alt={notification.fromUser?.name || "User"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>

                {/* Notification Content */}
                <div className="flex-1 mr-3 min-w-0">
                  <p className="text-sm">
                    <span
                      className="font-semibold hover:text-blue-600 cursor-pointer"
                      onClick={(e) =>
                        handleProfileClick(e, notification.fromUserId)
                      }
                    >
                      {notification.fromUser?.name || "Someone"}
                    </span>{" "}
                    <span className="text-gray-700">
                      {formatNotificationMessage(notification)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>

                {/* Post Thumbnail - Click to view post */}
                <div
                  className="w-11 h-11 rounded overflow-hidden flex-shrink-0 mr-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (notification.postId) {
                      navigate(`/post-details/${notification.postId}`);
                    }
                  }}
                >
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center ">
                    {notification.postId && (
                      <img
                        src={getAvatarUrl(selectedPost?.image)}
                        alt="Post Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Read/Unread Toggle */}
                <button
                  onClick={(e) => toggleReadStatus(e, notification)}
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    notification.isRead
                      ? "bg-gray-300 hover:bg-blue-400"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition-colors`}
                  title={
                    notification.isRead ? "Mark as unread" : "Mark as read"
                  }
                />
              </div>
            ))}
          </div>
        ))}
        <div className="h-20"></div>
      </div>
    </div>
  );
};
