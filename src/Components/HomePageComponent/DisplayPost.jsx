import { useEffect, useRef, useState } from "react";
import { usePostStore } from "../../Store/PostStore";
import { SinglePost } from "./SinglePost";
import { useAuth } from "../../Store/AuthStore";
import { LoginPopup } from "../Shared/LoginPopup";
import InfiniteScroll from "react-infinite-scroll-component";

export const DisplayPost = () => {
  const { user } = useAuth();
  const {
    posts,
    fetchPosts,
    isLoading,
    error,
    currentPage,
    hasMore,
    resetPosts,
  } = usePostStore();

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Initial fetch
  useEffect(() => {
    resetPosts();
    fetchPosts(1);
  }, [fetchPosts]);

  // Load next page for infinite scroll
  const loadMore = () => {
    if (user?._id) {
      fetchPosts(currentPage + 1);
    }
  };

  const postRef = useRef(null);
  useEffect(() => {
    if (user?._id) return;

    const handleScroll = () => {
      if (!postRef.current || showLoginPopup) return;

      const rect = postRef.current.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom >= 0;

      if (inViewport) {
        setShowLoginPopup(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, showLoginPopup]);

  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? "hidden" : "auto";
  }, [showLoginPopup]);

  useEffect(() => {
    if (showLoginPopup) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showLoginPopup]);

  const visiblePosts = user?._id ? posts : posts.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="space-y-4 max-w-[600px] mx-auto">
        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {user?._id ? (
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <p className="text-center text-gray-500">Loading more...</p>
            }
            endMessage={
              <p className="text-center text-gray-400">
                No more posts to load.
              </p>
            }
          >
            {posts.map((post) => (
              <SinglePost key={post._id} post={post} />
            ))}
          </InfiniteScroll>
        ) : visiblePosts?.length > 0 ? (
          visiblePosts.map((post, idx) => (
            <div key={post._id} ref={idx === 3 ? postRef : null}>
              <SinglePost post={post} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts found.</p>
        )}
      </div>

      <LoginPopup
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </div>
  );
};
