import axios from "axios";

// const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;
const BACKEND_API_BASE_URL="http://localhost:8080/api"

export const loadMessages =  async()=>{
    const response  = await axios.get("http://localhost:8080/api/chatHistory");
    // console.log("Message History: ", response.data);
    return response.data;
}

export const sendMessage = ({
        stompClient,
        conversationId,
        senderId,
        message,
        setMessage,
    }) => {
        // console.log("The sendMessage is stopped here!!");
        // console.log("Check all parameters: ", stompClient, ": ", conversationId, ": ", senderId, ": ", message, ": ", setMessage);
    if (!stompClient || !conversationId || !senderId || !message) return ;

    const chatMessage = {
        senderId: senderId,
        conversationId: conversationId,
        content: message,
    };

    stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
    );

    setMessage("");
};


// Get All the conversations for the current logged in user
export const getConversations = async ({userId})=>{
    const response = await axios.get(`${BACKEND_API_BASE_URL}/users/${userId}/conversations`);
    const resData = response.data;

    return resData;
}

export const createNewUser = async ({username})=>{
    const user = {
        "username": username
    }
    const response = await axios.post(`${BACKEND_API_BASE_URL}/user/newUser`, user);

    // console.log("Created the new user: ", response.data);
    return response.data;
}

export const addParticipant = async ({conversationid})=>{
    const response = await axios.post(`conversations/${conversationid}/addParticipant`);
    return response.data;
}

export const createNewGroup = async ({userId, groupName, participants, conversationId})=>{
    const groupRequest = {
        "currentUserId": userId,
        "groupName": groupName,
        "participants": [...participants],
        "conversationID":conversationId
    }

    const response = await axios.post(`${BACKEND_API_BASE_URL}/conversations/newGroup`, groupRequest);
    return response.data;
}

export const createNewChat = async ({currentUserId, otherUserName})=>{
    // console.log("CreateRequest: ", currentUserId, ": ", otherUserName);
    const chatRequest = {
        "currentUserId": currentUserId,
        "otherUserName": otherUserName,
        "conversationType": "ONE_TO_ONE"
    }

    // console.log("ChatRequest: ", chatRequest);

    const response = await axios.post(`${BACKEND_API_BASE_URL}/conversations/newChat`, chatRequest);
    return response.data;
}

export const chatHistory = async ({conversationid})=>{
    // console.log("Not entered this chatHistory")
    const response = await axios.get(`${BACKEND_API_BASE_URL}/chatHistory/${conversationid}/messages`);
    // console.log("Response of chatHistory: ", response.data);
    return response.data;
}

