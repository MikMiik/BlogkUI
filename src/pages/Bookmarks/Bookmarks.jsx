import { useState, useEffect } from "react";
import PostCard from "../../components/PostCard/PostCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import styles from "./Bookmarks.module.scss";
import {
  useClearBookmarksMutation,
  useGetBookmarkPostsQuery,
} from "@/features/posts/postsApi";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [clearBookmarks] = useClearBookmarksMutation();
  const { data, isLoading, isSuccess } = useGetBookmarkPostsQuery({
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setBookmarks(data);
    }
  }, [isSuccess, data]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  if (isSuccess) {
    // Get all unique topics from bookmarks
    const availableTopics = [
      ...new Set(bookmarks.flatMap((bookmark) => bookmark.topics)),
    ].sort();
    const uniqueTopics = [
      ...new Set(availableTopics.map((availableTopic) => availableTopic.name)),
    ];

    const filteredBookmarks = bookmarks.filter((bookmark) => {
      const topics = bookmark.topics.map((topic) => topic.name);
      const matchesSearch =
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.author.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTopic =
        selectedTopic === "all" || topics.includes(selectedTopic);

      return matchesSearch && matchesTopic;
    });

    const handleClearAllBookmarks = async () => {
      if (window.confirm("Are you sure you want to remove all bookmarks?")) {
        await clearBookmarks();
        setBookmarks([]);
      }
    };

    return (
      <div className={styles.container}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>My Bookmarks</h1>
              <p className={styles.subtitle}>
                {bookmarks.length} saved{" "}
                {bookmarks.length === 1 ? "article" : "articles"}
              </p>
            </div>
            {bookmarks.length > 0 && (
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearAllBookmarks}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {bookmarks.length > 0 && (
            <div className={styles.controls}>
              <div className={styles.searchContainer}>
                <div className={styles.searchInput}>
                  <svg
                    className={styles.searchIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M7.333 12.667A5.333 5.333 0 100 7.333a5.333 5.333 0 000 5.334zM14 14l-2.9-2.9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search bookmarks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.filterContainer}>
                <label className={styles.filterLabel}>Filter by topic:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className={styles.topicFilter}
                >
                  <option value="all">All Topics</option>
                  {uniqueTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className={styles.content}>
            {filteredBookmarks.length === 0 ? (
              <EmptyState
                title={
                  bookmarks.length === 0
                    ? "No bookmarks yet"
                    : searchTerm || selectedTopic !== "all"
                    ? "No bookmarks found"
                    : "No bookmarks"
                }
                description={
                  bookmarks.length === 0
                    ? "Start bookmarking articles you want to read later"
                    : "Try adjusting your search terms or filters"
                }
              />
            ) : (
              <div className={styles.bookmarksGrid}>
                {filteredBookmarks.map((bookmark) => (
                  <div key={bookmark.id} className={styles.bookmarkItem}>
                    <PostCard
                      postId={bookmark.id}
                      title={bookmark.title}
                      excerpt={bookmark.excerpt}
                      author={bookmark.author}
                      publishedAt={bookmark.publishedAt}
                      readTime={bookmark.readTime}
                      topics={bookmark.topics}
                      slug={bookmark.slug}
                      status={bookmark.status}
                      featuredImage={bookmark.thumbnail}
                      isLiked={bookmark.isLiked}
                      isBookmarked={bookmark.isBookmarked}
                      likesCount={bookmark.likesCount}
                      viewsCount={bookmark.viewsCount}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredBookmarks.length > 0 && (
            <div className={styles.resultsInfo}>
              <p className={styles.resultsText}>
                Showing {filteredBookmarks.length} of {bookmarks.length}{" "}
                bookmarks
                {selectedTopic !== "all" && (
                  <Badge variant="secondary" className={styles.activeTopic}>
                    {selectedTopic}
                    <button
                      onClick={() => setSelectedTopic("all")}
                      className={styles.clearFilter}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
};
export default Bookmarks;
