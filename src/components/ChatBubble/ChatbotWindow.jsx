import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "../ChatWindow/ChatWindow.module.scss";
import {
  useSendMessageMutation,
  useGetConversationHistoryQuery,
  useCreateNewConversationMutation,
} from "../../features/chatbotApi";
import socketClient from "../../utils/socketClient";

const ChatbotWindow = ({ user, isOpen = false, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => {
    // Get sessionId from localStorage on component init
    return localStorage.getItem("chatbot-session-id") || null;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const [sendChatMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [createNewConversation] = useCreateNewConversationMutation();

  const handleCreateNewConversation = async () => {
    try {
      console.log("🔄 Starting to create new conversation...");
      setIsMenuOpen(false); // Close menu immediately for better UX

      // Clear any existing messages first
      setMessages([]);

      // Show loading state with dots animation
      setMessages([
        {
          id: "loading-new-chat",
          role: "assistant",
          content: "Đang tạo đoạn chat mới",
          createdAt: new Date().toISOString(),
          isLoading: true,
        },
      ]);

      console.log("📡 Calling createNewConversation API...");
      const result = await createNewConversation().unwrap();
      console.log("✅ API Response:", result);

      // Update sessionId and clear messages
      setSessionId(result.sessionId);
      setMessages([]);

      // Update localStorage with new sessionId
      localStorage.setItem("chatbot-session-id", result.sessionId);

      console.log("✅ New conversation created successfully:", result);
    } catch (error) {
      console.error("❌ Failed to create new conversation:", error);

      // Show error message
      setMessages([
        {
          id: "error-new-chat",
          role: "assistant",
          content: "Có lỗi xảy ra khi tạo đoạn chat mới. Vui lòng thử lại.",
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    }
  };

  // Load conversation history when sessionId changes
  const { data: historyData } = useGetConversationHistoryQuery(sessionId, {
    skip: !sessionId,
  });

  // Clear session on logout (listen for auth changes)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        // User logged out, clear chatbot session
        setSessionId(null);
        setMessages([]);
        localStorage.removeItem("chatbot-session-id");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Websocket for real-time updates
  useEffect(() => {
    if (!sessionId) return;

    const channel = socketClient.subscribe(`chatbot-session-${sessionId}`);

    channel.bind("new-message", (data) => {
      // Only add bot response (user message already added immediately)
      const botMessage = {
        id: Date.now(),
        role: "assistant",
        content: data.botResponse.content,
        createdAt: data.timestamp,
        metadata: data.metadata,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    });

    return () => {
      socketClient.unsubscribe(`chatbot-session-${sessionId}`);
    };
  }, [sessionId]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      // Scroll instantly to bottom without any animation
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "instant",
          block: "end",
        });
      }
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
      console.log("Loading conversation history:", historyData.history);
      const formattedMessages = historyData.history.map((record, index) => ({
        id: record.id || Date.now() + index,
        role: record.role,
        content: record.content,
        createdAt: record.createdAt || new Date().toISOString(),
        metadata: record.metadata,
      }));
      setMessages(formattedMessages);

      // Immediately scroll to bottom without animation when loading history
      if (isOpen && formattedMessages.length > 0) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
              behavior: "instant",
              block: "end",
            });
          }
        });
      }
    }
  }, [historyData, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const messageContent = message.trim();
    setMessage("");

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageContent,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
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

      // Update sessionId if it changed (first message or new conversation)
      if (result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
        // Persist sessionId to localStorage
        localStorage.setItem("chatbot-session-id", result.sessionId);
      }

      // Bot response will be added via websocket
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
    // Validate message object
    if (!msg || !msg.id) {
      console.warn("Invalid message object:", msg);
      return null;
    }

    const isBot = msg.role === "assistant";
    const isLoading = msg.isLoading;
    const isError = msg.isError;

    // Convert markdown to HTML and handle line breaks
    const formatContent = (content) => {
      // Handle undefined/null content
      if (!content || typeof content !== "string") {
        return content || "";
      }

      // Replace markdown patterns with HTML
      let formattedContent = content
        // Headers: ### text -> <h3>text</h3>, ## text -> <h2>text</h2>, # text -> <h1>text</h1>
        .replace(
          /^### (.*$)/gm,
          '<h3 style="margin: 0.5em 0; font-size: 1.1em; font-weight: 600;">$1</h3>'
        )
        .replace(
          /^## (.*$)/gm,
          '<h2 style="margin: 0.6em 0; font-size: 1.2em; font-weight: 600;">$1</h2>'
        )
        .replace(
          /^# (.*$)/gm,
          '<h1 style="margin: 0.8em 0; font-size: 1.3em; font-weight: 600;">$1</h1>'
        )

        // Bold: **text** or __text__ -> <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")

        // Italic: *text* or _text_ -> <em>text</em>
        .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>")
        .replace(/(?<!_)_([^_]+?)_(?!_)/g, "<em>$1</em>")

        // Code: `text` -> <code>text</code>
        .replace(
          /`(.*?)`/g,
          '<code style="background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>'
        )

        // Lists: - item -> <li>item</li> (wrap in <ul> later)
        .replace(/^- (.*$)/gm, '<li style="margin: 0.2em 0;">$1</li>')

        // Line breaks: convert \n to <br>
        .replace(/\n/g, "<br>");

      // Wrap consecutive <li> elements in <ul>
      formattedContent = formattedContent.replace(
        /(<li[^>]*>.*?<\/li>(?:\s*<br>\s*<li[^>]*>.*?<\/li>)*)/g,
        '<ul style="margin: 0.5em 0; padding-left: 1.2em;">$1</ul>'
      );

      // Remove <br> tags that are immediately before or after block elements
      formattedContent = formattedContent
        .replace(/<br>\s*(<h[1-6][^>]*>)/g, "$1")
        .replace(/(<\/h[1-6]>)\s*<br>/g, "$1")
        .replace(/<br>\s*(<ul[^>]*>)/g, "$1")
        .replace(/(<\/ul>)\s*<br>/g, "$1");

      return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
    };

    return (
      <div
        key={msg.id}
        className={`${styles.message} ${isBot ? styles.other : styles.own} ${
          isError ? styles.error : ""
        } ${isLoading ? styles.loading : ""}`}
      >
        <div className={styles.messageContent}>
          {isLoading ? (
            <div className={styles.loadingMessage}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className={styles.messageText}>{msg.content}</p>
            </div>
          ) : (
            <p className={styles.messageText}>{formatContent(msg.content)}</p>
          )}
          <span className={styles.messageTime}>
            {formatTime(msg.createdAt || new Date().toISOString())}
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
                  onClick={handleCreateNewConversation}
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

        {messages
          .filter((msg) => msg && msg.id && msg.content !== undefined)
          .map(renderMessage)}

        {isTyping && (
          <div className={`${styles.message} ${styles.other}`}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <div className={styles.typingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
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
