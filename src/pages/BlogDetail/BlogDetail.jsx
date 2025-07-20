import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BlogContent,
  AuthorInfo,
  RelatedPosts,
  CommentSection,
  Loading,
} from "../../components";
import styles from "./BlogDetail.module.scss";
import {
  useGetOnePostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from "@/features/posts/postsApi";
import { useCurrentUser } from "@/utils/useCurrentUser";

const BlogDetail = () => {
  const { slug } = useParams();
  const currentUser = useCurrentUser();
  const isAuthenticated = Boolean(currentUser);

  // Like and bookmark states

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);

  const {
    data: { post, relatedPosts, comments, commentsCount } = {},
    isLoading: isLoadingPost,
    error: errorPost,
    isSuccess: isSuccessPost,
  } = useGetOnePostQuery(slug, {
    refetchOnMountOrArgChange: true,
  });

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [isLiked, setIsLiked] = useState(post?.isLiked);
  const [likes, setLikes] = useState(post?.likesCount);
  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked);
      setLikes(post.likesCount);
    }
  }, [post]);
  if (isLoadingPost) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="md" text="Loading article..." />
      </div>
    );
  }
  if (errorPost) {
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
  if (isSuccessPost) {
    const handleLikePost = async () => {
      if (likingInProgress) return;
      setLikingInProgress(true);
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      try {
        if (isLiked) {
          await unlikePost({
            postId: post.id,
          });
        } else {
          await likePost({
            postId: post.id,
          });
        }
      } catch (error) {
        setIsLiked(isLiked);
        setLikes(likes);
      } finally {
        setLikingInProgress(false);
      }
    };

    const handleBookmarkPost = async () => {
      // if (bookmarkingInProgress) return;

      // setBookmarkingInProgress(true);

      // // Optimistic update
      // setIsBookmarked(!isBookmarked);

      // try {
      //   // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      //   console.log("Post bookmark toggled:", !isBookmarked);
      // } catch (error) {
      //   // Revert on error
      //   setIsBookmarked(isBookmarked);
      //   console.error("Failed to toggle bookmark:", error);
      // } finally {
      //   setBookmarkingInProgress(false);
      // }
      console.log("click bookmark");
    };

    return (
      <div className={styles.container}>
        {/* Article Header with Interactions */}
        <div className={styles.articleHeader}>
          <BlogContent {...post} />

          {/* Post Interactions - Moved to top for better UX */}
          <div className={styles.interactions}>
            {/* Stats */}
            <div className={styles.stats}>
              {/* Views */}
              <div className={styles.stat}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="8" r="2" />
                </svg>
                <span>{post.viewsCount} views</span>
              </div>

              {/* Likes */}
              <div className={styles.stat}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{likes} likes</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              {/* Like Button */}
              <button
                className={`${styles.actionButton} ${
                  isLiked ? styles.liked : ""
                } ${likingInProgress ? styles.loading : ""}`}
                onClick={handleLikePost}
                disabled={likingInProgress}
                title={isLiked ? "Unlike" : "Like"}
                aria-label={`${isLiked ? "Unlike" : "Like"} this post`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isLiked ? "Liked" : "Like"}
              </button>

              {/* Bookmark Button */}
              <button
                className={`${styles.actionButton} ${
                  isBookmarked ? styles.bookmarked : ""
                } ${bookmarkingInProgress ? styles.loading : ""}`}
                onClick={handleBookmarkPost}
                disabled={bookmarkingInProgress}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                aria-label={`${
                  isBookmarked ? "Remove bookmark from" : "Bookmark"
                } this post`}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill={isBookmarked ? "currentColor" : "none"}
                >
                  <path
                    d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className={styles.authorSection}>
          <AuthorInfo author={post.author} />
        </div>

        {/* Related Posts */}
        <div className={styles.contentSection}>
          <RelatedPosts posts={relatedPosts} />
        </div>

        {/* Comments */}
        <div className={styles.contentSection}>
          <CommentSection
            postId={post.id}
            count={commentsCount}
            commentsData={comments}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    );
  }
};

export default BlogDetail;
