import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthorInfo from "../../components/AuthorInfo/AuthorInfo";
import PostList from "../../components/PostList/PostList";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

import styles from "./Profile.module.scss";
import {
  useFollowProfileMutation,
  useGetOneProfileQuery,
  useUnfollowProfileMutation,
} from "@/features/profileApi";
import { useCurrentUser } from "@/utils/useCurrentUser";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [page, setPage] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followProfile] = useFollowProfileMutation();
  const [unfollowProfile] = useUnfollowProfileMutation();
  const limit = 6;
  const currentUser = useCurrentUser();
  const {
    data: { user: profile, posts, count: postsCount } = {},
    isLoading: isLoadingProfile,
    error: errorProfile,
    isSuccess: isSuccessProfile,
  } = useGetOneProfileQuery(
    { username, page, limit },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    if (isSuccessProfile && profile) {
      setIsFollowed(profile.isFollowed);
    }
  }, [isSuccessProfile, profile]);
  if (isLoadingProfile) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <Loading size="md" text="Loading profile..." />
        </div>
      </div>
    );
  }
  if (errorProfile) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Article not found</h1>
        <p>
          The article you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }
  if (isSuccessProfile) {
    const totalPages = Math.ceil(postsCount / limit);
    const isOwnProfile = currentUser?.username === profile.username;
    const handlePageChange = (page) => {
      setPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };
    const handleFollow = async () => {
      try {
        if (isFollowed) {
          await unfollowProfile(username);
        } else {
          await followProfile(username);
        }
        setIsFollowed(!isFollowed);
      } catch (error) {
        console.error("Failed to follow:", error);
        setIsFollowed(isFollowed);
      }
    };

    const handleMessageClick = () => {
      setIsChatOpen(true);
      setIsChatMinimized(false);
    };

    const handleChatClose = () => {
      setIsChatOpen(false);
      setIsChatMinimized(false);
    };

    const handleChatMinimize = (minimize) => {
      setIsChatMinimized(minimize);
    };

    if (!profile) {
      return (
        <div className={styles.profile}>
          <div className="container">
            <EmptyState
              title="Profile not found"
              description="The user profile you're looking for doesn't exist or has been removed."
              icon="👤"
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.profile}>
        {/* Cover Section */}
        <div className={styles.coverSection}>
          <div className={styles.coverImage}>
            <FallbackImage src={profile.coverImage} alt="Cover" />
            <div className={styles.coverOverlay}></div>
          </div>

          <div className={styles.profileHeader}>
            <div className="container">
              <div className={styles.headerContent}>
                <div className={styles.avatarSection}>
                  <FallbackImage
                    src={profile.avatar}
                    alt={profile.name}
                    className={styles.avatar}
                  />
                  <div className={styles.basicInfo}>
                    <h1 className={styles.name}>{profile.name}</h1>
                    <p className={styles.username}>@{profile.username}</p>
                    {profile.role && (
                      <p className={styles.title}>{profile.role}</p>
                    )}
                  </div>
                </div>

                <div className={styles.actions}>
                  {isOwnProfile ? (
                    <>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => navigate(`/profile/${username}/edit`)}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => navigate(`/messages`)}
                      >
                        Message
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={!isFollowed ? "primary" : "secondary"}
                        size="md"
                        onClick={handleFollow}
                      >
                        {isFollowed ? "Followed" : "Follow"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={handleMessageClick}
                      >
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container">
          <div className={styles.content}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* Bio */}
              {profile.introduction && (
                <div className={styles.bioCard}>
                  <h3>About</h3>
                  <p>{profile.introduction}</p>
                </div>
              )}

              {/* Stats */}
              <div className={styles.statsCard}>
                <h3>Stats</h3>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <strong>{profile.postsCount}</strong>
                    <span>Posts</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{profile.followersCount.toLocaleString()}</strong>
                    <span>Followers</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{profile.followingCount}</strong>
                    <span>Following</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{profile.likesCount.toLocaleString()}</strong>
                    <span>Likes</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className={styles.skillsCard}>
                  <h3>Skills</h3>
                  <div className={styles.skills}>
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {profile.achievements && profile.achievements.length > 0 && (
                <div className={styles.badgesCard}>
                  <h3>Achievements</h3>
                  <div className={styles.badges}>
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.name} className={styles.badge}>
                        <span className={styles.badgeIcon}>
                          <FallbackImage
                            src={achievement.icon}
                            alt={achievement.name}
                            className={styles.image}
                          />
                        </span>
                        <span className={styles.badgeName}>
                          {achievement.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className={styles.infoCard}>
                <h3>Info</h3>
                <div className={styles.infoItems}>
                  {profile.address && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📍</span>
                      <span>{profile.address}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>🌐</span>
                      <a
                        href={profile.website || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.website?.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📅</span>
                    <span>Joined {formatDate(profile.verifiedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {profile.socials && Object.keys(profile.socials)?.length > 0 && (
                <div className={styles.socialCard}>
                  <h3>Connect</h3>
                  <div className={styles.socialLinks}>
                    {profile.socials.twitter && (
                      <a
                        href={profile.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>🐦</span> Twitter
                      </a>
                    )}
                    {profile.socials.github && (
                      <a
                        href={profile.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>🐙</span> GitHub
                      </a>
                    )}
                    {profile.socials.linkedin && (
                      <a
                        href={profile.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>💼</span> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
              {/* Tabs */}
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${
                    activeTab === "posts" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  Posts ({profile.postsCount})
                </button>
                <button
                  className={`${styles.tab} ${
                    activeTab === "about" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("about")}
                >
                  About
                </button>
              </div>

              {/* Tab Content */}
              <div className={styles.tabContent}>
                {activeTab === "posts" && (
                  <div className={styles.postsTab}>
                    <PostList
                      posts={posts}
                      maxPosts={6}
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      layout="grid"
                    />
                  </div>
                )}

                {activeTab === "about" && (
                  <div className={styles.aboutTab}>
                    <AuthorInfo
                      author={{
                        name: profile.name,
                        title: profile.title,
                        role: profile.role,
                        introduction: profile.introduction,
                        avatar: profile.avatar,
                        socials: profile.socials,
                        postsCount: profile.postsCount,
                        followersCount: profile.followersCount,
                        followingCount: profile.followingCount,
                      }}
                      showFollowButton={false}
                    />
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* Chat Window */}
        {!isOwnProfile && (
          <ChatWindow
            user={{
              id: profile.id,
              name: profile.name,
              avatar: profile.avatar,
              username: profile.username,
            }}
            isOpen={isChatOpen}
            isMinimized={isChatMinimized}
            onClose={handleChatClose}
            onMinimize={handleChatMinimize}
          />
        )}
      </div>
    );
  }
};
export default Profile;
