import "./CreateGroup.css"
import AddUser from "../../assets/AddUser.png"
import React, { useEffect, useState } from "react";
import { createNewGroup } from "../../services/api";


const CreateGroup = ({currentUser, selectedConversation, loadConversations})=>{

    const [showGroupBox, setShowGroupBox] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupUser, setGroupUser] = useState("");

    const createGroup = async () => {
      if (!groupName || !groupUser) return;
        var usernames;
        if(selectedConversation.conversationType === "ONE_TO_ONE"){
            usernames = [
                currentUser.username,
                selectedConversation.receiverName,
                groupUser
            ];
        }else if(selectedConversation.conversationType === "GROUP"){
            usernames = [groupUser]
        }

      await createNewGroup({
        userId: currentUser.userId,
        groupName: selectedConversation.conversationType === "GROUP" ? selectedConversation.receiverName : groupName,
        participants: usernames,
        conversationId: selectedConversation.id
      });

      loadConversations();
      setShowGroupBox(false);
      setGroupName("");
      setGroupUser("");
    };
    return(
        <div>
            <div className="group-button-container">
                <button
                className="group-create-btn"
                onClick={() => setShowGroupBox(prev => !prev)}
                >
                <img src={AddUser} />
                </button>
            </div>

            {showGroupBox && (
                <div className="group-create-box">
                <h3 className="font-black">Create Group</h3>

                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={groupUser}
                    onChange={(e) => setGroupUser(e.target.value)}
                />

                <button onClick={createGroup}>Create</button>
                </div>
            )}
        </div>
    )
}

export default CreateGroup;