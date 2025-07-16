import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  BlogContent,
  AuthorInfo,
  RelatedPosts,
  CommentSection,
  Loading,
} from "../../components";
import styles from "./BlogDetail.module.scss";
import { useGetOnePostQuery } from "@/features/posts/postsAPI";

const mockComments = [
  {
    id: 1,
    author: {
      name: "Alex Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    content:
      "Great article! I've been using React Hooks for a while now, and this guide really helps clarify some of the more advanced concepts. The useState examples are particularly helpful for beginners.",
    createdAt: "2024-01-15T14:30:00Z",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 2,
        author: {
          name: "John Smith",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        content:
          "Thank you! I'm glad you found it helpful. I'll be writing more about advanced hook patterns soon.",
        createdAt: "2024-01-15T15:45:00Z",
        likes: 5,
        isLiked: true,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Lisa Park",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    content:
      "Could you write a follow-up article about custom hooks? I'm still struggling with when and how to create them effectively.",
    createdAt: "2024-01-15T16:20:00Z",
    likes: 8,
    isLiked: false,
    replies: [],
  },
  {
    id: 4,
    author: {
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    content:
      "The useEffect explanation is spot on. I wish I had this guide when I was first learning React Hooks. The best practices section is golden!",
    createdAt: "2024-01-15T18:10:00Z",
    likes: 15,
    isLiked: true,
    replies: [],
  },
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [comments, setComments] = useState([]);
  const [isAuthenticated] = useState(true); // Mock authentication

  // Like and bookmark states
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);

  const {
    data: postData,
    isLoading: isLoadingPost,
    error: errorPost,
    isSuccess: isSuccessPost,
  } = useGetOnePostQuery(slug, {
    refetchOnMountOrArgChange: true,
  });
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
    const { post, relatedPosts } = postData;
    console.log(post);
    const handleAddComment = async (content) => {
      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 500));

      // const newComment = {
      //   id: Date.now(),
      //   author: {
      //     name: "You",
      //     avatar:
      //       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      //   },
      //   content,
      //   createdAt: new Date().toISOString(),
      //   likes: 0,
      //   isLiked: false,
      //   replies: [],
      // };

      // setComments((prev) => [newComment, ...prev]);
      console.log("click addComment");
    };

    const handleReplyComment = async (parentId, content) => {
      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 500));

      // const newReply = {
      //   id: Date.now(),
      //   author: {
      //     name: "You",
      //     avatar:
      //       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      //   },
      //   content,
      //   createdAt: new Date().toISOString(),
      //   likes: 0,
      //   isLiked: false,
      //   replies: [],
      // };

      // setComments((prev) =>
      //   prev.map((comment) =>
      //     comment.id === parentId
      //       ? { ...comment, replies: [...comment.replies, newReply] }
      //       : comment
      //   )
      // );
      console.log("click reply");
    };

    const handleLikeComment = async (commentId) => {
      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 200));

      // setComments((prev) =>
      //   prev.map((comment) =>
      //     comment.id === commentId
      //       ? {
      //           ...comment,
      //           isLiked: !comment.isLiked,
      //           likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
      //         }
      //       : comment
      //   )
      // );
      console.log("click like");
    };

    const handleEditComment = async (commentId, newContent) => {
      // try {
      //   // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 500));

      //   const updateCommentRecursively = (comments) => {
      //     return comments.map((comment) => {
      //       if (comment.id === commentId) {
      //         return {
      //           ...comment,
      //           content: newContent,
      //           isEdited: true,
      //         };
      //       }
      //       if (comment.replies && comment.replies.length > 0) {
      //         return {
      //           ...comment,
      //           replies: updateCommentRecursively(comment.replies),
      //         };
      //       }
      //       return comment;
      //     });
      //   };

      //   setComments((prev) => updateCommentRecursively(prev));
      //   console.log("Comment edited:", commentId, newContent);
      // } catch (error) {
      //   console.error("Failed to edit comment:", error);
      // }
      console.log("click edit");
    };

    const handleDeleteComment = async (commentId) => {
      // try {
      //   // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 500));

      //   const deleteCommentRecursively = (comments) => {
      //     return comments
      //       .filter((comment) => comment.id !== commentId)
      //       .map((comment) => {
      //         if (comment.replies && comment.replies.length > 0) {
      //           return {
      //             ...comment,
      //             replies: deleteCommentRecursively(comment.replies),
      //           };
      //         }
      //         return comment;
      //       });
      //   };

      //   setComments((prev) => deleteCommentRecursively(prev));

      //   console.log("Comment deleted:", commentId);
      // } catch (error) {
      //   console.error("Failed to delete comment:", error);
      // }
      console.log("click delete");
    };

    const handleLikePost = async () => {
      // if (likingInProgress) return;

      // setLikingInProgress(true);

      // // Optimistic update
      // setIsLiked(!isLiked);
      // // setLikes(isLiked ? likes - 1 : likes + 1);

      // try {
      //   // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      //   console.log("Post like toggled:", !isLiked);
      // } catch (error) {
      //   // Revert on error
      //   setIsLiked(isLiked);
      //   // setLikes(likes);
      //   console.error("Failed to toggle like:", error);
      // } finally {
      //   setLikingInProgress(false);
      // }
      console.log("click like");
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
                <span>{post.likesCount} likes</span>
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
            comments={post.comments}
            onAddComment={handleAddComment}
            onReplyComment={handleReplyComment}
            onLikeComment={handleLikeComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    );
  }
};

export default BlogDetail;
