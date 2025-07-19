import TopicList from "../../components/TopicList/TopicList";
import Loading from "../../components/Loading/Loading";
import styles from "./TopicsListing.module.scss";
import { useGetAllTopicsQuery } from "@/features/topicsApi";

const TopicsListing = () => {
  const {
    data: { topics } = {},
    isLoading: isLoadingTopics,
    error: errorTopics,
    isSuccess: isSuccessTopics,
  } = useGetAllTopicsQuery({
    refetchOnMountOrArgChange: true,
  });

  if (isLoadingTopics) {
    return (
      <div className={styles.topicsListing}>
        <div className="container">
          <Loading size="md" text="Loading topics..." />
        </div>
      </div>
    );
  }
  if (errorTopics) {
    console.error(errorTopics);
  }
  if (isSuccessTopics) {
    return (
      <div className={styles.topicsListing}>
        <div className="container">
          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.title}>All Topics</h1>
            <p className={styles.description}>
              Explore all available topics and find content that interests you.
            </p>
          </header>

          {/* Topics Grid */}
          <section className={styles.content}>
            <TopicList topics={topics} />
          </section>
        </div>
      </div>
    );
  }
};

export default TopicsListing;
