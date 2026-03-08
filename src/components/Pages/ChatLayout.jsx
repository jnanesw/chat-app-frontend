
import React, { useEffect, useState } from "react";
import ConversationList from "../Sidebar/ConversationList";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";
import ChatWindow from "./ChatWindow";
import { getConversations } from "../../services/api";

const ChatLayout = ({currentUser}) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState({});
  
  // console.log("CurrentUser: ", currentUser);
  const userId = currentUser.userId ;

  const loadConversations = async ()=>{
    
    const resData = await getConversations({userId});
    console.log("ConversationList: ", resData);
    setConversations(resData);
  }
  
  useEffect(()=>{
    loadConversations();
  }, [userId]);

  return (
    <div className="flex h-screen">
      <ConversationList
        conversations={conversations} 
        setSelectedConversation={setSelectedConversation} 
        currentUser={currentUser}
        reloadConversations={loadConversations}
      />

      {conversations.length>0 && selectedConversation?.id ? (
        <ChatWindow conversation={selectedConversation} currentUser={currentUser} loadConversations={loadConversations} />
      ) : (
        <EmptyChatPlaceholder />
      )}
    </div>
  );
};

export default ChatLayout;