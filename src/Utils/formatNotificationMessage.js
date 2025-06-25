export const formatNotificationMessage = (notification) => {
    switch (notification.type) {
        case "like":
            return "liked your post";
        case "comment":
            return "commented on your post";
        default:
            return "interacted with your post";
    }
};
