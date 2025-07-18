import { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import CommentItem from "../CommentItem/CommentItem";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./CommentSection.module.scss";
import { useCurrentUser } from "@/utils/useCurrentUser";
import { useCreateCommentMutation } from "@/features/comments/commentsApi";
import { useGetCommentsQuery } from "@/features/posts/postsApi";
import { useInView } from "react-intersection-observer";
import { Loading } from "..";

// T1: commentsPage = 1
//     → API call → commentsData = [comment1, comment2, ...]
//     → allComments = [comment1, comment2, ...]

// T2: User scroll → commentsPage = 2
//     → React Query ngay lập tức return cached data của page 1
//     → isSuccess = true, commentsData = [comment1, comment2, ...] (data cũ)
//     → useEffect chạy với data cũ
//     → allComments = [comment1, comment2, ..., comment1, comment2, ...] (duplicate!)

// T3: API call hoàn thành
//     → commentsData = [comment11, comment12, ...] (data mới)
//     → useEffect chạy lại
//     → allComments được cập nhật với data đúng
// --> thêm isFetching

const CommentSection = ({
  postId,
  onLikeComment,
  isAuthenticated = false,
  className,
  ...props
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { ref: observerRef, inView } = useInView({
    threshold: 1,
    rootMargin: "150px 0px 0px 0px",
  });

  const limitComments = 10;
  const currentUser = useCurrentUser();
  const [createComment] = useCreateCommentMutation();

  const {
    data: { rows: commentsData = [], count = 0 } = {},
    isLoading: isLoadingComments,
    error: errorComments,
    isSuccess: isSuccessComments,
    isFetching,
  } = useGetCommentsQuery(
    { postId, commentsPage, limitComments },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isSuccessComments && commentsData && !isFetching) {
      setAllComments((prev) =>
        commentsPage === 1 ? commentsData : [...prev, ...commentsData]
      );
      setHasMore(commentsData.length === limitComments);
      setLoading(false);
    }
  }, [isSuccessComments, commentsData, commentsPage, isFetching]);

  useEffect(() => {
    if (inView && hasMore && !loading && !isLoadingComments) {
      setLoading(true);
      setCommentsPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading, isLoadingComments]);
  useEffect(() => {
    setCommentsPage(1);
    setAllComments([]);
    setHasMore(true);
    setLoading(false);
  }, [postId]);
  if (isLoadingComments) {
    return (
      <section
        className={`${styles.commentSection} ${className || ""}`}
        {...props}
      >
        <h2 className={styles.title}>Comments</h2>
        <div className={styles.skeleton}>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.skeletonComment}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonText} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (errorComments) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Comments not found</h1>
      </div>
    );
  }

  if (isSuccessComments) {
    const rootComments = allComments.filter(
      (comment) => comment.parentId === null
    );
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const newCommentData = await createComment({
          userId: currentUser.id,
          commentableType: "Post",
          commentableId: postId,
          content: newComment,
        }).unwrap();

        setAllComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
      } catch (error) {
        console.error("Failed to add comment:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <section
        className={`${styles.commentSection} ${className || ""}`}
        {...props}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Comments ({count})</h2>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form className={styles.commentForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className={styles.commentInput}
                rows="4"
                required
              />
            </div>
            <div className={styles.formActions}>
              <div className={styles.guidelines}>
                <span>Be respectful and constructive in your comments.</span>
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={!newComment.trim() || isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <p>
              Please <a href="/login">sign in</a> to leave a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className={styles.commentsList}>
          {rootComments.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No comments yet"
              description="Be the first to share your thoughts!"
            />
          ) : (
            <div>
              {rootComments.map((rootComment) => {
                return (
                  <CommentItem
                    key={rootComment.id}
                    postId={postId}
                    comment={rootComment}
                    allComments={allComments}
                    onLike={isAuthenticated ? onLikeComment : undefined}
                    showActions={isAuthenticated}
                  />
                );
              })}
              {loading && (
                <div className={styles.loadingContainer}>
                  <Loading size="md" text="Loading article..." />
                </div>
              )}

              {hasMore && <div ref={observerRef} style={{ height: "1px" }} />}
            </div>
          )}
        </div>
      </section>
    );
  }
};

// CommentSection.propTypes = {
//   comments: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       author: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         avatar: PropTypes.string.isRequired,
//       }).isRequired,
//       content: PropTypes.string.isRequired,
//       createdAt: PropTypes.string.isRequired,
//       likes: PropTypes.number,
//       isLiked: PropTypes.bool,
//       replies: PropTypes.array,
//       isEdited: PropTypes.bool,
//     })
//   ),
//   loading: PropTypes.bool,
//   onAddComment: PropTypes.func,
//   onReplyComment: PropTypes.func,
//   onLikeComment: PropTypes.func,
//   onEditComment: PropTypes.func,
//   onDeleteComment: PropTypes.func,
//   isAuthenticated: PropTypes.bool,
//   className: PropTypes.string,
// };

export default CommentSection;
