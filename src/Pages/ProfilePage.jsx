import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Store/AuthStore";
import { HiOutlineLink } from "react-icons/hi";
import { Link } from "react-router-dom";
import { usePostStore } from "../Store/PostStore";
import { formatDistanceToNow } from "date-fns";
import { useProfile } from "../Store/ProfileStore";

export const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const BASE_URL = "http://localhost:3000";
  const { userPosts, fetchUserPosts, isLoading: postsLoading } = usePostStore();
  const { getUserById } = useProfile();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        if (!id) {
          setProfileUser(currentUser);
          // Fetch current user's posts
          await fetchUserPosts();
        } else {
          const userData = await getUserById(id);
          setProfileUser(userData);
          await fetchUserPosts(id);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (currentUser) {
      loadProfile();
    }
  }, [id, currentUser, fetchUserPosts, getUserById]);

  if (isLoadingProfile || !profileUser) {
    return <p className="text-center mt-6">Loading profile...</p>;
  }

  const isOwnProfile = currentUser?._id === profileUser?._id;

  return (
    <div className="main-container px-4 py-6">
      <div className="profile-container">
        <div className="flex flex-col md:flex-row mb-10">
          <div className="flex justify-center md:justify-start md:w-1/3 mb-6 md:mb-0 relative">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-300 mx-auto">
              <img
                src={
                  profileUser.avatar
                    ? `${BASE_URL}/${profileUser.avatar}`
                    : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
                }
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
              <h2 className="text-xl font-normal mb-1 sm:mb-0 sm:mr-4">
                {profileUser.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">@{profileUser.name}</p>
            </div>

            {/* Only show edit button for your own profile */}
            {isOwnProfile && (
              <div className="flex space-x-2 mb-2">
                <Link
                  to="/edit-profile"
                  className="bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium"
                >
                  Edit profile
                </Link>
              </div>
            )}

            <div className="flex justify-center sm:justify-start space-x-8 mb-4 mt-2">
              <div>
                <span className="font-semibold">{userPosts?.length || 0}</span>{" "}
                posts
              </div>
              <div>
                <span className="font-semibold">
                  {profileUser.followersCount || 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">
                  {profileUser.followingCount || 0}
                </span>{" "}
                following
              </div>
            </div>

            <div className="text-sm">
              <p>{profileUser.bio || "No bio available."}</p>
              {profileUser.link && (
                <p className="text-blue-900">
                  <a
                    href={profileUser.link}
                    target="_blank"
                    className="flex items-center"
                    rel="noopener noreferrer"
                  >
                    <HiOutlineLink className="h-3 w-3 mr-1" />
                    {profileUser.link}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <section>
          <h3 className="font-semibold text-lg mb-4">Posts</h3>
          {postsLoading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {userPosts && userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <Link to={`/post-details/${post._id}`} key={post._id}>
                    <div className="relative">
                      <img
                        src={`${BASE_URL}/${post.image}`}
                        alt="Post"
                        className="w-full grid-image aspect-square object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center">
                  <p className="text-sm text-gray-500">No posts yet.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
