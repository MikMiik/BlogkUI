import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import styles from "./DirectMessages.module.scss";
import socketClient from "@/utils/socketClient";
import {
  useCreateMessageMutation,
  useGetConversationMessagesQuery,
} from "@/features/messageApi";
import { useCurrentUser } from "@/utils/useCurrentUser";
import { useGetAllConversationQuery } from "@/features/conversationApi";
import GroupAvatar from "@/components/GroupAvatar/GroupAvatar";

const DirectMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const conversationId = searchParams.get("conversationId");
  const currentUser = useCurrentUser();

  const { data, isSuccess } = useGetAllConversationQuery(currentUser, {
    refetchOnMountOrArgChange: true,
  });

  const { data: convMessages, isSuccess: convMessagesSuccess } =
    useGetConversationMessagesQuery(conversationId, {
      skip: !conversationId,
      refetchOnMountOrArgChange: true,
    });
  const [createMessage] = useCreateMessageMutation();

  const [conversations, setConversations] = useState([]);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (isSuccess && data) {
      // Không mutate object gốc, tạo bản sao mới cho mỗi conversation
      const processed = data.map((conv) => {
        let newConv = { ...conv };
        if (newConv.isGroup) {
          // Xử lý groupName
          if (!newConv.groupName) {
            const names = (newConv.participants || [])
              .slice(0, 3)
              .map((p) => p.name)
              .join(", ");
            newConv.groupName = `Group of ${names}`;
          }
          // Xử lý groupAvatar
          if (!newConv.groupAvatar) {
            newConv.groupAvatar = (newConv.participants || [])
              .slice(0, 3)
              .map((p) => p.avatar)
              .filter(Boolean);
          }
        }
        return newConv;
      });
      setConversations(processed);
    }
  }, [isSuccess, data, conversationId]);
  useEffect(() => {
    if (convMessagesSuccess && convMessages) {
      setMessages(convMessages);
    }
  }, [convMessagesSuccess, convMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  useEffect(() => {
    const channel = socketClient.subscribe(`conversation-${conversationId}`);
    channel.bind("new-message", function ({ data }) {
      setMessages((prev) => [...prev, data]);
      setConversations((prev) => {
        return prev.map((conv) =>
          conv.id === parseInt(conversationId)
            ? {
                ...conv,
                lastMessage: {
                  content: data.content,
                  createdAt: new Date(),
                  senderId: data.author.id,
                },
              }
            : conv
        );
      });
    });

    return () => {
      channel.unsubscribe(`conversation-${conversationId}`);
      channel.unbind("new-message");
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markAsRead = (conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setSearchParams({ conversationId: conversation.id.toString() });
    markAsRead(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    await createMessage({
      content: newMessage.trim(),
      conversationId,
    });

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    if (!date) return;

    const parsedDate = new Date(date); // Chuyển từ ISO string sang Date
    const now = new Date();
    const diff = now - parsedDate;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return parsedDate.toLocaleDateString("vi-VN");
  };

  if (isSuccess && data && conversations) {
    const filteredConversations = conversations.filter((conv) => {
      const query = searchQuery.toLowerCase();
      // Nếu là group, tìm theo groupName hoặc tên thành viên
      if (conv.isGroup) {
        const groupName = (conv.groupName || "").toLowerCase();
        const memberNames = (conv.participants || [])
          .map((p) => (p.name || "").toLowerCase())
          .join(" ");
        return groupName.includes(query) || memberNames.includes(query);
      }
      // Nếu không phải group, tìm theo tên hoặc username của participant
      if (conv.participant) {
        const name = (conv.participant.name || "").toLowerCase();
        const username = (conv.participant.username || "").toLowerCase();
        return name.includes(query) || username.includes(query);
      }
      return false;
    });

    return (
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Conversations Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h1 className={styles.title}>Messages</h1>
              <Button
                variant="ghost"
                size="sm"
                className={styles.newMessageButton}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </Button>
            </div>

            <div className={styles.searchSection}>
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.conversationsList}>
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`${styles.conversationItem} ${
                    selectedConversation?.id === conversation.id
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className={styles.avatarContainer}>
                    {conversation.groupAvatar ? (
                      <GroupAvatar avatars={conversation.groupAvatar} />
                    ) : (
                      <FallbackImage
                        src={conversation.participant?.avatar}
                        alt={conversation.participant?.name}
                        className={styles.avatar}
                      />
                    )}
                    {conversation.isOnline && (
                      <div className={styles.onlineIndicator} />
                    )}
                  </div>

                  <div className={styles.conversationContent}>
                    <div className={styles.conversationHeader}>
                      <span className={styles.participantName}>
                        {conversation.groupName
                          ? conversation.groupName
                          : conversation.participant?.name}
                      </span>
                      <span className={styles.timestamp}>
                        {formatTime(conversation.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <div className={styles.lastMessage}>
                      <span className={styles.messageText}>
                        {conversation.lastMessage?.content}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                          {conversation.unreadCount || 1}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {selectedConversation ? (
              <>
                {/* Messages Header */}
                <div className={styles.messagesHeader}>
                  <div className={styles.participantInfo}>
                    {selectedConversation.groupAvatar ? (
                      <GroupAvatar avatars={selectedConversation.groupAvatar} />
                    ) : (
                      <FallbackImage
                        src={selectedConversation.participant?.avatar}
                        alt={selectedConversation.participant?.name}
                        className={styles.avatar}
                      />
                    )}
                    <div>
                      <h2 className={styles.participantName}>
                        {selectedConversation.groupName
                          ? selectedConversation.groupName
                          : selectedConversation.participant?.name}
                      </h2>
                      <span className={styles.participantStatus}>
                        {selectedConversation.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className={styles.messagesThread}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.author.id === currentUser.id
                          ? styles.sent
                          : styles.received
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <span className={styles.messageText}>
                          {message.content}
                        </span>
                        <span className={styles.messageTime}>
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className={styles.messageInputContainer}>
                  <div className={styles.messageInputWrapper}>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message ${selectedConversation.participant?.name}...`}
                      className={styles.messageInput}
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={styles.sendButton}
                      size="sm"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateContent}>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.emptyIcon}
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <h3 className={styles.emptyTitle}>Select a conversation</h3>
                  <p className={styles.emptyDescription}>
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default DirectMessages;
