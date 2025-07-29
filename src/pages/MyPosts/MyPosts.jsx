import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import PostCard from "../../components/PostCard/PostCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import styles from "./MyPosts.module.scss";
import {
  useDeletePostMutation,
  useGetOwnPostsQuery,
} from "@/features/posts/postsApi";

const MyPosts = () => {
  const {
    data: { posts } = {},
    isLoading: isLoadingPosts,
    error: errorPosts,
    isSuccess: isSuccessPosts,
  } = useGetOwnPostsQuery({
    refetchOnMountOrArgChange: true,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePost] = useDeletePostMutation();

  if (isLoadingPosts) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }
  if (errorPosts) {
    console.error(errorPosts);
  }
  if (isSuccessPosts) {
    const filteredPosts = posts.filter((post) => {
      const matchesTab = activeTab === "all" || post.status === activeTab;
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });

    const handleDeleteCancel = () => {
      setShowDeleteConfirm(false);
    };
    const handleDeleteConfirm = async (id) => {
      if (deletePost) {
        await deletePost(id);
      }
      setShowDeleteConfirm(false);
    };

    const getStatusBadgeVariant = (status) => {
      switch (status) {
        case "published":
          return "success";
        case "draft":
          return "warning";
        default:
          return "secondary";
      }
    };

    const tabs = [
      { key: "all", label: "All Posts", count: posts.length },
      {
        key: "published",
        label: "Published",
        count: posts.filter((p) => p.status === "published").length,
      },
      {
        key: "draft",
        label: "Drafts",
        count: posts.filter((p) => p.status === "draft").length,
      },
    ];

    return (
      <div className={styles.container}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>My Posts</h1>
              <p className={styles.subtitle}>
                Manage and track your published articles and drafts
              </p>
            </div>
            <div className={styles.actions}>
              <Link to="/write">
                <Button variant="primary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 2V14M2 8H14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Write New Post
                </Button>
              </Link>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`${styles.tab} ${
                    activeTab === tab.key ? styles.tabActive : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  <span className={styles.tabCount}>{tab.count}</span>
                </button>
              ))}
            </div>

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
                  placeholder="Search your posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.content}>
            {filteredPosts.length === 0 ? (
              <EmptyState
                title={searchTerm ? "No posts found" : "No posts yet"}
                description={
                  searchTerm
                    ? "Try adjusting your search terms or filters"
                    : "Start writing your first blog post to see it here"
                }
                actionButton={
                  !searchTerm && (
                    <Link to="/write">
                      <Button variant="primary">Write Your First Post</Button>
                    </Link>
                  )
                }
              />
            ) : (
              <div className={styles.postsGrid}>
                {filteredPosts.map((post) => (
                  <div key={post.id} className={styles.postItem}>
                    <PostCard
                      postId={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      author={post.author}
                      publishedAt={post.publishedAt}
                      status={post.status}
                      readTime={post.readTime}
                      topics={post.topics}
                      slug={post.slug}
                      featuredImage={post.thumbnail}
                      isLiked={post.isLiked}
                      isBookmarked={post.isBookmarked}
                      likesCount={post.likesCount}
                      viewsCount={post.viewsCount}
                    >
                      <div className={styles.postMeta}>
                        <div className={styles.postStatus}>
                          <Badge variant={getStatusBadgeVariant(post.status)}>
                            {post.status}
                          </Badge>
                        </div>

                        <div className={styles.postActions}>
                          <button
                            className={styles.actionButton}
                            onClick={() => setShowDeleteConfirm(post.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="28"
                              height="28"
                              viewBox="0 0 50 50"
                            >
                              <path d="M 21.800781 10.099609 C 20.916781 10.099609 20.199219 10.815219 20.199219 11.699219 L 20.199219 12.099609 L 9.8007812 12.099609 C 9.5247813 12.099609 9.3007812 12.323609 9.3007812 12.599609 C 9.3007812 12.875609 9.5247813 13.099609 9.8007812 13.099609 L 11.740234 13.099609 L 13.857422 38.507812 C 14.017422 40.410812 15.636922 41.900391 17.544922 41.900391 L 32.455078 41.900391 C 34.363078 41.900391 35.982625 40.410812 36.140625 38.507812 L 38.257812 13.099609 L 40.199219 13.099609 C 40.476219 13.099609 40.699219 12.875609 40.699219 12.599609 C 40.699219 12.323609 40.475219 12.099609 40.199219 12.099609 L 29.800781 12.099609 L 29.800781 11.699219 C 29.800781 10.815219 29.083219 10.099609 28.199219 10.099609 L 21.800781 10.099609 z M 12.742188 13.099609 L 37.255859 13.099609 L 35.144531 38.423828 C 35.028531 39.812828 33.848078 40.900391 32.455078 40.900391 L 17.542969 40.900391 C 16.150969 40.900391 14.969516 39.811828 14.853516 38.423828 L 12.742188 13.099609 z"></path>
                            </svg>
                          </button>
                          <Link
                            to={`/write/${post.slug}`}
                            className={styles.actionButton}
                            title="Edit post"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M11.333 2a1.885 1.885 0 012.667 2.667L4.667 14 1 14.333l.333-3.666L11.333 2z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                          {post.status === "published" && (
                            <Link
                              to={`/blog/${post.slug}`}
                              className={styles.actionButton}
                              title="View post"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M6 12l6-6-6-6"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </PostCard>
                  </div>
                ))}
              </div>
            )}
          </div>
          {showDeleteConfirm && (
            <div className={styles.confirmOverlay}>
              <div className={styles.confirmModal}>
                <h3 className={styles.confirmTitle}>Delete Comment</h3>
                <p className={styles.confirmMessage}>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
                <div className={styles.confirmActions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                    className={styles.deleteConfirmButton}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default MyPosts;
