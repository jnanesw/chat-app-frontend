import axios from "axios";
import { useEffect, useState } from "react"

const PreviousChat = ({sender})=>{
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(()=>{
        

        loadMessages();
    }, [])

    return(
        <div>
            {chatHistory.map((msg, index) => {
                <div
                key={index}
                className={`chat-message ${
                msg.sender === sender ? "chat-message-right" : "chat-message-left"
                }`}
            >
                <div
                className={`${
                    msg.sender === sender ? "chat-bubble-right" : "chat-bubble-left"
                }`}
                >
                <strong>{msg.sender}:</strong> {msg.content}
                </div>
            </div>
            })}
        </div>
    )
}

export default PreviousChat;