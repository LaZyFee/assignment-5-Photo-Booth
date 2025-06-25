import { useState, useEffect } from "react";
import { usePostStore } from "../Store/PostStore";
import { useAuth } from "../Store/AuthStore";
import { copyToClipboard } from "../Utils/clipboard";
import { createImagePreview } from "../Utils/imagePreview";
import Swal from "sweetalert2";

export const usePostDetails = (id) => {
    const {
        fetchPostById,
        updatePost,
        deletePost,
        selectedPost: post,
        isLoading,
        addComment,
        updateComment,
        deleteComment,
        toggleLike,
    } = usePostStore();
    const { user: currentUser } = useAuth();

    const [comment, setComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [showPostOptions, setShowPostOptions] = useState(false);
    const [showCommentOptions, setShowCommentOptions] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCaption, setEditCaption] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchPostById(id);
    }, [id, fetchPostById]);

    useEffect(() => {
        if (post && currentUser) {
            const userLiked = post.likes?.some(
                (like) => like.user === currentUser._id || like === currentUser._id
            );
            setIsLiked(userLiked || false);
        }
    }, [post, currentUser]);

    const handleLike = async () => {
        try {
            const result = await toggleLike(id);
            if (result) {
                setIsLiked(result.liked);
                fetchPostById(id);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        await addComment(id, comment);
        setComment("");
        fetchPostById(id);
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment._id);
        setEditText(comment.text);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editText.trim()) return;
        await updateComment(editingComment, editText);
        setEditingComment(null);
        fetchPostById(id);
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            await deleteComment(commentId);
            fetchPostById(id);
        }
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditText("");
    };

    const handleEditPost = () => {
        setShowEditModal(true);
        setEditCaption(post.caption || "");
        setPreviewImage(null);
        setShowPostOptions(false);
    };

    const handlePostEditSubmit = async (e) => {
        e.preventDefault();
        const updateData = { caption: editCaption };
        if (editImage) {
            updateData.image = editImage;
        }

        await updatePost(id, updateData);
        setShowEditModal(false);
        setEditImage(null);
        fetchPostById(id);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditImage(null);
        setPreviewImage(null);
        setEditCaption("");
    };

    const handleShare = async () => {
        const success = await copyToClipboard(window.location.href);
        if (success) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleDeletePost = async (navigate) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This post will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            await deletePost(id);
            Swal.fire("Deleted!", "Your post has been deleted.", "success");
            navigate("/");
        }

        setShowPostOptions(false);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            const preview = await createImagePreview(file);
            setPreviewImage(preview);
        }
    };

    return {
        // State
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

        // Handlers
        handleLike,
        handleCommentSubmit,
        handleEditComment,
        handleEditSubmit,
        handleCancelEdit,
        handleDeleteComment,
        handleEditPost,
        handlePostEditSubmit,
        handleCloseEditModal,
        handleShare,
        handleDeletePost,
        handleImageChange,
    };
};