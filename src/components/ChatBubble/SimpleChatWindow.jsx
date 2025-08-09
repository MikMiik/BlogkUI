import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "./SimpleChatWindow.module.scss";

const SimpleChatWindow = ({
  user,
  isOpen = false,
  onClose,
  onMinimize,
  isMinimized = false,
  ...props
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: message.trim(),
      userId: "me",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        content:
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className={styles.minimizedWindow} onClick={() => onMinimize(false)}>
        <FallbackImage
          src={user?.avatar}
          alt={user?.name}
          className={styles.minimizedAvatar}
        />
        <span className={styles.minimizedName}>{user?.name}</span>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow} {...props}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <FallbackImage
            src={user?.avatar}
            alt={user?.name}
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <span className={styles.name}>{user?.name}</span>
            <span className={styles.status}>Đang hoạt động</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          {/* Minimize button */}
          <button
            className={styles.minimizeButton}
            onClick={() => onMinimize(true)}
            aria-label="Minimize"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h12v2H6z" />
            </svg>
          </button>

          {/* Close button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.userId === "me" ? styles.own : styles.other
              }`}
            >
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{msg.content}</p>
                <span className={styles.messageTime}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>Bắt đầu cuộc trò chuyện</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className={styles.inputForm} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className={styles.input}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!message.trim()}
          className={styles.sendButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </Button>
      </form>
    </div>
  );
};

SimpleChatWindow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onMinimize: PropTypes.func.isRequired,
  isMinimized: PropTypes.bool,
};

export default SimpleChatWindow;
