import { useState } from "react";
import PropTypes from "prop-types";
import CommentItem from "../CommentItem/CommentItem";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./CommentSection.module.scss";
import { useCurrentUser } from "@/utils/useCurrentUser";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/features/comments/commentsApi";
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
  commentsData,
  count,
  loading = false,
  isAuthenticated = false,
  className,
  ...props
}) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(commentsData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const currentUser = useCurrentUser();

  if (loading) {
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
  if (!comments) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Comments not found</h1>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await createComment({
        userId: currentUser?.id,
        commentableType: "Post",
        commentableId: postId,
        content: newComment,
      }).unwrap();
      setComments((prev) => [res, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyComment = async (parentId, content) => {
    const newReply = await createComment({
      userId: currentUser?.id,
      parentId,
      commentableType: "Post",
      commentableId: postId,
      content,
    }).unwrap();
    setComments((prev) => [newReply, ...prev]);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ id: commentId });
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await updateComment({
        id: commentId,
        data: { content: newContent, isEdited: true },
      });
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content: newContent,
              isEdited: true,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked
                ? comment.likes - 1
                : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const rootComments = comments.filter((comment) => comment?.parentId === null);
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
                  allComments={comments}
                  onReply={handleReplyComment}
                  onDelete={handleDeleteComment}
                  onEdit={handleEditComment}
                  onLike={handleLikeComment}
                  showActions={isAuthenticated}
                />
              );
            })}
            {loading && (
              <div className={styles.loadingContainer}>
                <Loading size="md" text="Loading article..." />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  commentsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      commenter: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string,
      }).isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
        .isRequired,
      createdAt: PropTypes.string.isRequired,
      likesCount: PropTypes.number,
      isLiked: PropTypes.bool,
      isEdited: PropTypes.bool,
    })
  ).isRequired,

  count: PropTypes.number,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  className: PropTypes.string,
};

export default CommentSection;
