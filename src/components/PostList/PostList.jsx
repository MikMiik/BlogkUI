import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import Pagination from "../Pagination/Pagination";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./PostList.module.scss";

const PostList = ({
  posts = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxPosts = 6,
  showPagination = true,
  layout = "grid",
  className,
  ...props
}) => {
  if (loading) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <Loading size="md" text="Loading posts..." />
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <EmptyState
          title="No posts found"
          description="There are no posts available for this topic."
          icon="📝"
        />
      </div>
    );
  }
  const displayPosts = posts.slice(0, maxPosts);

  return (
    <div className={`${styles.postList} ${className || ""}`} {...props}>
      <div className={`${styles.postsContainer} ${styles[layout]}`}>
        {displayPosts.map((post) => (
          <div key={post.id || post.slug} className={styles.postItem}>
            <PostCard
              postId={post.id}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              publishedAt={post.publishedAt}
              readTime={post.readTime}
              topics={post.topics}
              slug={post.slug}
              status={post.status}
              isLiked={post.isLiked}
              isBookmarked={post.isBookmarked}
              featuredImage={post.thumbnail}
              viewsCount={post.viewsCount}
              likesCount={post.likesCount}
            />
          </div>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

// PostList.propTypes = {
//   posts: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//       title: PropTypes.string.isRequired,
//       excerpt: PropTypes.string,
//       author: PropTypes.shape({
//         avatar: PropTypes.string,
//       }).isRequired,
//       publishedAt: PropTypes.string.isRequired,
//       readTime: PropTypes.number,
//       topic: PropTypes.string,
//       slug: PropTypes.string.isRequired,
//       featuredImage: PropTypes.string,
//     })
//   ),
//   loading: PropTypes.bool,
//   currentPage: PropTypes.number,
//   totalPages: PropTypes.number,
//   onPageChange: PropTypes.func,
//   showPagination: PropTypes.bool,
//   layout: PropTypes.oneOf(["grid", "list"]),
//   className: PropTypes.string,
// };

export default PostList;
