import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "../ChatWindow/ChatWindow.module.scss";
import {
  useSendMessageMutation,
  useGetConversationHistoryQuery,
  useCreateSessionMutation,
} from "../../features/chatbotApi";
import socketClient from "../../utils/socketClient";

const ChatbotWindow = ({ user, isOpen = false, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const [sendChatMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [createSession] = useCreateSessionMutation();

  // Load conversation history when sessionId changes
  const { data: historyData } = useGetConversationHistoryQuery(sessionId, {
    skip: !sessionId,
  });

  const initializeSession = useCallback(async () => {
    try {
      const result = await createSession().unwrap();
      setSessionId(result.sessionId);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  }, [createSession]);

  // Initialize session when component mounts
  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeSession();
    }
  }, [isOpen, sessionId, initializeSession]);

  // Websocket for real-time updates
  useEffect(() => {
    if (!sessionId) return;

    const channel = socketClient.subscribe(`chatbot-session-${sessionId}`);

    channel.bind("new-message", (data) => {
      // Add both user message and bot response
      const newMessages = [
        {
          id: Date.now(),
          role: "user",
          content: data.userMessage.content,
          createdAt: data.timestamp,
        },
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.botResponse.content,
          createdAt: data.timestamp,
          metadata: data.metadata,
        },
      ];

      setMessages((prev) => [...prev, ...newMessages]);
      setIsTyping(false);
    });

    return () => {
      socketClient.unsubscribe(`chatbot-session-${sessionId}`);
    };
  }, [sessionId]);

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

  // Load messages from history
  useEffect(() => {
    if (historyData?.history) {
      const formattedMessages = historyData.history.map((record, index) => ({
        id: index,
        role: record.role,
        content: record.content,
        createdAt: new Date().toISOString(),
        metadata: record.metadata,
      }));
      setMessages(formattedMessages);
    }
  }, [historyData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const messageContent = message.trim();
    setMessage("");
    setIsTyping(true);

    try {
      const result = await sendChatMessage({
        message: messageContent,
        sessionId,
        options: {
          includeContext: true,
          autoTrain: true,
        },
      }).unwrap();

      // Update sessionId if it changed (first message)
      if (result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
      }

      // Messages will be added via websocket
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (msg) => {
    const isBot = msg.role === "assistant";

    return (
      <div
        key={msg.id}
        className={`${styles.message} ${isBot ? styles.other : styles.own}`}
      >
        <div className={styles.messageContent}>
          <p className={styles.messageText}>{msg.content}</p>
          <span className={styles.messageTime}>
            {formatTime(msg.createdAt)}
          </span>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatWindow}>
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
            <span className={styles.status}>
              {isTyping ? "Đang trả lời..." : "Đang hoạt động"}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
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
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    setMessages([]);
                    setSessionId(null);
                    setIsMenuOpen(false);
                  }}
                >
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
        {messages.length === 0 && (
          <div className={styles.message + " " + styles.other}>
            <div className={styles.messageContent}>
              <p className={styles.messageText}>
                Xin chào! Chúng tôi có thể giúp gì cho bạn?
              </p>
              <span className={styles.messageTime}>
                {formatTime(new Date().toISOString())}
              </span>
            </div>
          </div>
        )}

        {messages.map(renderMessage)}

        {isTyping && (
          <div className={`${styles.message} ${styles.other}`}>
            <div className={styles.messageContent}>
              <p className={styles.messageText}>
                <span className={styles.typing}>Đang trả lời...</span>
              </p>
            </div>
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
          disabled={isSending}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!message.trim() || isSending}
          className={styles.sendButton}
        >
          {isSending ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 6v3l4-4-4-4v3c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10h-2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </Button>
      </form>
    </div>
  );
};

ChatbotWindow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default ChatbotWindow;
