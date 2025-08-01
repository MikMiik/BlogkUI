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
import {
  useGetAllConversationQuery,
  useMarkReadMutation,
  useDeleteConversationMutation,
} from "@/features/conversationApi";
import GroupAvatar from "@/components/GroupAvatar/GroupAvatar";

const DirectMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const messagesEndRef = useRef(null);
  const dropdownRefs = useRef({});
  const conversationId = searchParams.get("conversationId");
  const currentUser = useCurrentUser();
  const [markRead] = useMarkReadMutation();
  const [deleteConversation] = useDeleteConversationMutation();
  const [conversations, setConversations] = useState([]);
  const { data, isSuccess } = useGetAllConversationQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: convMessages, isSuccess: convMessagesSuccess } =
    useGetConversationMessagesQuery(conversationId, {
      skip: !conversationId,
      refetchOnMountOrArgChange: true,
    });
  const [createMessage] = useCreateMessageMutation();

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (isSuccess && data) {
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
  }, [isSuccess, data]);
  useEffect(() => {
    if (convMessagesSuccess && convMessages) {
      setMessages(convMessages);
    }
  }, [convMessagesSuccess, convMessages]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideAnyDropdown = Object.values(
        dropdownRefs.current
      ).every((ref) => ref && !ref.contains(event.target));

      if (clickedOutsideAnyDropdown) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  useEffect(() => {
    if (!conversations) return;

    const channels = conversations.map((conv) => {
      const channel = socketClient.subscribe(`conversation-${conv.id}`);

      channel.bind("new-message", (newMessage) => {
        if (conv.id === selectedConversation?.id) {
          setMessages((prev) => {
            return [...prev, newMessage];
          });
        }
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== newMessage.conversationId) return c;
            if (selectedConversation?.id === c.id) {
              return {
                ...c,
                lastMessage: newMessage,
                unreadCount: 0,
              };
            }
            return {
              ...c,
              lastMessage: newMessage,
              unreadCount: (c.unreadCount || 0) + 1,
            };
          })
        );
      });
      return channel;
    });

    return () => {
      channels.forEach((channel) => {
        channel.unsubscribe(channel.name);
        channel.unbind_all();
      });
    };
  }, [conversations, selectedConversation?.id, currentUser.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleConversationSelect = async (conversation) => {
    conversation.unreadCount = 0;
    setSelectedConversation(conversation);
    setSearchParams({ conversationId: conversation.id.toString() });
    await markRead(conversation.id);
  };

  const toggleDropdown = (conversationId) => {
    setShowDropdown(showDropdown === conversationId ? null : conversationId);
  };

  const handleDeleteConfirm = async (conversationId) => {
    try {
      await deleteConversation(conversationId);

      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );

      // If the deleted conversation was selected, clear selection
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setSearchParams({});
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setShowDeleteConfirm(null);
      setShowDropdown(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    await createMessage({
      content: newMessage.trim(),
      conversationId: selectedConversation.id,
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
      if (!conv.isGroup && conv.participant) {
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
                      <div className={styles.headerRight}>
                        {/* Actions Dropdown */}
                        <div
                          className={styles.actionsDropdown}
                          ref={(el) =>
                            (dropdownRefs.current[conversation.id] = el)
                          }
                        >
                          <button
                            className={styles.moreButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(conversation.id);
                            }}
                            aria-expanded={showDropdown === conversation.id}
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

                          {showDropdown === conversation.id && (
                            <div className={styles.dropdown}>
                              <button
                                className={`${styles.dropdownItem} ${styles.deleteItem}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteConfirm(conversation.id);
                                  setShowDropdown(null);
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                >
                                  <path d="M6.5 1h3a.5.5 0 01.5.5v1H6v-1a.5.5 0 01.5-.5zM11 2.5v-1A1.5 1.5 0 009.5 0h-3A1.5 1.5 0 005 1.5v1H2.506a.58.58 0 000 1.162H3.36l.776 9.162A1.5 1.5 0 005.63 14h4.741a1.5 1.5 0 001.494-1.339L12.64 3.5h.854a.58.58 0 000-1.162H11z" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <span className={styles.timestamp}>
                          {formatTime(conversation.lastMessage?.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.lastMessage}>
                      <span className={styles.messageText}>
                        {conversation.lastMessage?.content}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                          {conversation.unreadCount}
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmModal}>
              <h3 className={styles.confirmTitle}>Delete Conversation</h3>
              <p className={styles.confirmMessage}>
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </p>
              <div className={styles.confirmActions}>
                <Button variant="ghost" size="sm" onClick={handleDeleteCancel}>
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
    );
  }
};

export default DirectMessages;
