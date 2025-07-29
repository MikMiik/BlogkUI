// components/SearchUser.jsx
import { useState, useRef, useEffect } from "react";
import { useSearchUsersQuery, useSearchPostsQuery } from "@/features/searchApi";
import useDebounce from "@/hooks/useDebounce";
import styles from "./SearchInput.module.scss";
import { Loading } from "..";
import { Link } from "react-router-dom";

function SearchInput() {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);
  const debouncedSearch = useDebounce(search, 500);

  const { data: usersData, isLoading: isLoadingUsers } = useSearchUsersQuery(
    debouncedSearch,
    {
      skip: debouncedSearch === "",
    }
  );
  const { data: postsData, isLoading: isLoadingPosts } = useSearchPostsQuery(
    debouncedSearch,
    {
      skip: debouncedSearch === "",
    }
  );

  // Đóng kết quả khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  // Hiện kết quả khi focus vào input
  const handleFocus = () => {
    if (debouncedSearch) setShowResults(true);
  };

  // Hiện kết quả khi có giá trị tìm kiếm mới
  useEffect(() => {
    if (debouncedSearch) setShowResults(true);
    else setShowResults(false);
  }, [debouncedSearch]);

  return (
    <div className={styles.searchInputWrapper} ref={wrapperRef}>
      <span className={styles.searchIcon}>
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <circle cx="9" cy="9" r="7" stroke="#a0aec0" strokeWidth="2" />
          <path
            d="M15 15L18 18"
            stroke="#a0aec0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        onFocus={handleFocus}
        autoComplete="off"
      />
      {showResults && usersData?.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.resultsRow}>
            {usersData.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className={styles.resultItem}
                key={user.id}
                onClick={() => setShowResults(false)}
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.name || user.username}
                  className={styles.avatar}
                />
                <span className={styles.name}>
                  {user.name ||
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    user.username}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {showResults && postsData?.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.resultsRow}>
            {postsData.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                className={styles.resultItem}
                key={post.id}
                onClick={() => setShowResults(false)}
              >
                <img
                  src={
                    post.thumbnail ||
                    "https://cdn.jsdelivr.net/gh/feathericons/feather/icons/file-text.svg"
                  }
                  alt={post.title}
                  className={styles.avatar}
                  style={{ background: "#f3f4f6" }}
                />
                <div>
                  <span className={styles.name}>{post.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {(isLoadingUsers || isLoadingPosts) && <Loading />}
    </div>
  );
}

export default SearchInput;
