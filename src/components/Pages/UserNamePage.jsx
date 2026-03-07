import React, { useState } from "react";
import { createNewUser } from "../../services/api";
import "./username.css";

const UsernamePage = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) return;

    setLoading(true);

    try {
      const user = await createNewUser({username});
      setCurrentUser(user); // App.jsx handles localStorage
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="username-container">
      <div className="username-box">
        <h2 className="username-title">Enter your username</h2>

        <input
          type="text"
          className="username-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          className="username-button cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Entering..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default UsernamePage;