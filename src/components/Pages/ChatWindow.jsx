// src/components/ChatWindow/ChatWindow.jsx
import React, { useEffect, useState } from "react";
import "./ChatWindow.css";
import { chatHistory } from "../../services/api";

import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { sendMessage } from "../../services/api";

import CreateGroup from "./CreateGroup";

const ChatWindow = ({ conversation, currentUser , loadConversations}) => {
  // var Process = process;
    console.log("selectedConversation: ", conversation);
    console.log("Variable from env: ", import.meta.env.VITE_SOCKJS_URL);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const[connected, setConnected] = useState(false);



    // const conversationid = conversation.id;
    // console.log("ConversationID: ", conversationId);
    // console.log("Why stompClient is Null: ", stompClient);
    // Load message history when conversation changes

  useEffect(() => {
    // console.log("Entering to load messages...")
    if (!conversation.id) return;
    // console.log("But not proceeded till here...")
    async function fetchHistory() {
      console.log("selectedConversation: ", conversation);
      
      const history = await chatHistory({conversationid:conversation.id});
      // console.log("Chat History: ", history)
      setMessageHistory(history);
    }

    fetchHistory();
  }, [conversation.id]);


    useEffect(() => {
    if (!conversation.id) return;
    
    const socket = new SockJS(`${import.meta.env.VITE_PROD_SOCKJS_URL}/ws`);
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
        setConnected(true);
        // setConversationId(conversation.id)

        const subscription = stomp.subscribe(
        `/topic/conversations/${conversation.id}`,
        (msg) => {
            const body = JSON.parse(msg.body);
            setMessages((prev) => [...prev, body]);
        }
        );

        // cleanup subscription when conversation changes
        stomp.subscription = subscription;
    });

    setStompClient(stomp);

    return () => {
        if (stomp && stomp.connected) {
        if (stomp.subscription) {
            stomp.subscription.unsubscribe();
        }
        stomp.disconnect();
        }
    };
    }, [conversation.id]);



  // console.log("messageHistory: ", messageHistory, ", messages: ", messages);
   const allMessages = [...messageHistory, ...messages];
  //  console.log("All Messages: ", allMessages);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title">
          {conversation.receiverName}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
          {allMessages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.userId;

            const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={msg.id}
                className={isCurrentUser ? "message message-sent" : "message message-received"}
              >
                <div className="message-sender">{msg.sender}</div>

                <div className="message-content">{msg.content}</div>

                <div className="message-time">{formattedTime}</div>
              </div>
            );
          })}
       </div>

       <CreateGroup currentUser={currentUser} selectedConversation={conversation} loadConversations={loadConversations}/>

      {/* Input */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage({stompClient, conversationId: conversation.id, senderId: currentUser.userId, message, setMessage})}
        />
        <button className="send-button cursor-pointer" onClick={()=>
            sendMessage({stompClient, conversationId: conversation.id, senderId: currentUser.userId, message, setMessage})
        }>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;