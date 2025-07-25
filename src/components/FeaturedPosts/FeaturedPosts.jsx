import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./FeaturedPosts.module.scss";

const FeaturedPosts = ({
  posts = [],
  loading = false,
  title = "Featured Posts",
  showTitle = true,
  maxPosts = 3,
  className,
  ...props
}) => {
  if (loading) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <Loading size="md" text="Loading featured posts..." />
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <EmptyState
          title="No featured posts"
          description="There are no featured posts available at the moment."
          icon="⭐"
        />
      </section>
    );
  }

  const displayPosts = posts.slice(0, maxPosts);
  console.log(displayPosts);

  return (
    <section
      className={`${styles.featuredPosts} ${className || ""}`}
      {...props}
    >
      {showTitle && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.postsGrid}>
        {displayPosts.map((post, index) => (
          <div
            key={post.id || post.slug}
            className={`${styles.postItem} ${
              index === 0 ? styles.featured : ""
            }`}
          >
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
              featuredImage={post.thumbnail}
              isLiked={post.isLiked}
              isBookmarked={post.isBookmarked}
              likesCount={post.likesCount}
              viewsCount={post.viewsCount}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

FeaturedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      author: PropTypes.shape({
        avatar: PropTypes.string,
      }).isRequired,
      publishedAt: PropTypes.string.isRequired,
      readTime: PropTypes.number,
      topic: PropTypes.string,
      slug: PropTypes.string.isRequired,
      featuredImage: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string,
};

export default FeaturedPosts;
