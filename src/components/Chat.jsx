import "../styles/Chat.css"

import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import MessageBox from "../components/MessageBox";
import { sendMessage } from "../services/api";
import { loadMessages } from "../services/api";

const Chat = () => {

  // window.global = window;

  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      setConnected(true);
      stomp.subscribe("/topic/messages", (msg) => {
        const body = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      });
    });

    setStompClient(stomp);

    return () => {
      if (stomp && stomp.connected) stomp.disconnect();
    };
  }, []);

  useEffect(()=>{
        async function fetchHistroy(){
            const messageList = await loadMessages();
            setMessageHistory(messageList);
        }

        fetchHistroy();
    }, []);
    // console.log("Message History from Chat.jsx: ", messageHistory);
    const allMessages = [...messageHistory, ...messages];

  return (
    <div className="chat-container">
      <h1 className="chat-title">Real-Time Chat Application</h1>
      
      <MessageBox messageList={allMessages} sender={sender} />

      <div className="mb-3">
        <input
          type="text"
          className="chat-input"
          placeholder="Your name..."
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
      </div>

      <div className="flex mb-3">
        <input
          type="text"
          className="chat-message-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="chat-send-btn cursor-pointer"
          onClick={() => {
            sendMessage({stompClient, sender, message, setMessage});
            // setMessage("");
            // console.log("Logging the message: ", message);
          }}
          disabled={!connected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;