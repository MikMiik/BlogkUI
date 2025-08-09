import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ChatbotWindow from "./ChatbotWindow";
import styles from "./ChatBubble.module.scss";

const ChatBubble = ({
  allowedPaths = ["/", "/blog", "/topics", "/posts", "/contact"],
  user = {
    id: "support",
    name: "Customer Support",
    avatar: "https://cdn-icons-png.flaticon.com/512/3079/3079840.png",
    username: "support",
  },
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Check if current path is allowed
  useEffect(() => {
    const currentPath = location.pathname;
    const shouldShow = allowedPaths.some((path) => {
      if (path === "/") {
        return currentPath === "/" || currentPath === "";
      }
      return currentPath.startsWith(path);
    });
    setIsVisible(shouldShow);
  }, [location.pathname, allowedPaths]);

  const handleBubbleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <div className={styles.chatBubble} onClick={handleBubbleClick}>
          <div className={styles.bubbleIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>

          {/* Notification dot for new messages */}
          <div className={styles.notificationDot}></div>

          {/* Tooltip */}
          <div className={styles.tooltip}>Chat với chúng tôi</div>
        </div>
      )}

      {/* Chat Window */}
      <div className={styles.chatWindowWrapper}>
        <ChatbotWindow
          user={user}
          isOpen={isOpen}
          onClose={handleClose}
          {...props}
        />
      </div>
    </>
  );
};

ChatBubble.propTypes = {
  allowedPaths: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default ChatBubble;
