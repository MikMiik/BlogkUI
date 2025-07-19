import { useParams, useSearchParams } from "react-router-dom";
import TopicHeader from "../../components/TopicHeader/TopicHeader";
import PostList from "../../components/PostList/PostList";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import styles from "./Topic.module.scss";
import { useGetOneTopicQuery } from "@/features/topicsApi";

const Topic = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 6;

  const {
    data: { topic, posts, count: postsCount } = {},
    isLoading: isLoadingTopic,
    error: errorTopic,
    isSuccess: isSuccessTopic,
  } = useGetOneTopicQuery(
    { slug, currentPage, limit },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  if (isLoadingTopic) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="md" text="Loading article..." />
      </div>
    );
  }
  if (errorTopic) {
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
  if (isSuccessTopic) {
    console.log(posts);
    const totalPages = Math.ceil(postsCount / limit);
    const handlePageChange = (page) => {
      setSearchParams({ page: page.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (errorTopic || !topic) {
      return (
        <div className={styles.topicPage}>
          <div className="container">
            <EmptyState
              icon="📚"
              title="Topic not found"
              description="The topic you're looking for doesn't exist or has been removed."
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.topicPage}>
        <div className="container">
          {/* Topic Header */}
          <TopicHeader topic={topic} postsCount={postsCount} />

          {/* Posts List */}
          <PostList
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            maxPosts={limit}
            onPageChange={handlePageChange}
            showPagination={true}
            className={styles.postsList}
          />
        </div>
      </div>
    );
  }
};

export default Topic;
