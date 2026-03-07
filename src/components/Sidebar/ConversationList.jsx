import React, { useEffect, useState } from "react";
import "./ConversationList.css";
import { createNewChat } from "../../services/api";

const ConversationList = ({ conversations, setSelectedConversation, currentUser, reloadConversations }) => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [otherUserName, setOtherUserName] = useState("");
  const [reciever, setReciever] = useState("");

  const startNewChat = async () => {
    if (!otherUserName.trim()) return;

    await createNewChat({currentUserId: currentUser.userId, otherUserName})
    
    reloadConversations();
    setShowNewChat(false);
    setOtherUserName("");
  };

  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className="sidebar-header flex justify-between items-center">
        <h2 className="sidebar-title">Chats</h2>

        <button
          className="new-chat-btn font-bold cursor-pointer"
          onClick={() => setShowNewChat(true)}
        >
          + Start New Chat
        </button>
      </div>

      {/* New Chat Input */}
      {showNewChat && (
        <div className="new-chat-box">
          <input
            type="text"
            placeholder="Enter username"
            className="new-chat-input"
            value={otherUserName}
            onChange={(e) => setOtherUserName(e.target.value)}
          />
          {/* {console.log("ChatRequest from JSX file: ", currentUser.userId, ": ", otherUserName)} */}
          <button className="new-chat-start cursor-pointer" onClick={startNewChat}>
            Start
          </button>
        </div>
      )}

      {/* Conversation List */}
      <div className="conversation-list">
        {conversations.map((conv, index) => {

          return (<div
            key={conv.id}
            className="conversation-item"
            onClick={() => setSelectedConversation(conv)}
          >
            <div className="avatar">{
              conv.receiverName.charAt(0)
              }</div>

            <div className="conversation-info">
              <div className="conversation-name">
                {conv.receiverName}
              </div>
              <div className="conversation-last-message">
                {conv.messages.length > 0? conv.messages[conv.messages.length - 1].content : "No messages sent yet."}
              </div>
            </div>
          </div>)
        })}
      </div>
    </div>
  );
};

export default ConversationList;