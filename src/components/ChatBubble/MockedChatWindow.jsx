import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "../ChatWindow/ChatWindow.module.scss";

const MockedChatWindow = ({ user, isOpen = false, onClose, ...props }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
      userId: user.id,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  // Mock current user (as if logged in)
  const me = { id: "current-user" };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [isOpen, messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: message.trim(),
      userId: me.id,
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

  const handleNewChat = () => {
    // Reset messages to start new conversation
    setMessages([
      {
        id: Date.now(),
        content: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
        userId: user.id,
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage("");
    setIsMenuOpen(false);
  };

  if (!isOpen) return null;

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
          {/* Menu button */}
          <div className={styles.menuContainer} ref={menuRef}>
            <button
              className={styles.menuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="More options"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className={styles.menu}>
                <button className={styles.menuItem} onClick={handleNewChat}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Tạo đoạn chat mới
                </button>
              </div>
            )}
          </div>

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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.userId === me?.id ? styles.own : styles.other
            }`}
          >
            <div className={styles.messageContent}>
              <p className={styles.messageText}>{msg.content}</p>
              <span className={styles.messageTime}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
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

MockedChatWindow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default MockedChatWindow;
