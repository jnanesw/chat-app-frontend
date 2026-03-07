import { useEffect } from "react";
import { loadMessages } from "../services/api";

const MessageBox = ({messageList, sender})=>{
    return(
        <div className="chat-box">
            {messageList.map((msg, index) => (
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
            ))}
        </div>
    )
}

export default MessageBox;