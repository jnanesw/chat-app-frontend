import { useState } from 'react'
import './App.css'
import ChatLayout from './components/Pages/ChatLayout.jsx';
import UsernamePage from './components/Pages/UserNamePage.jsx';

import { useEffect } from 'react';

const STORAGE_KEY = "chat_current_user";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load → check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const handleSetUser = (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  if (loading) return null; // or spinner

  return (
    <>
      {!currentUser ? (
        <UsernamePage setCurrentUser={handleSetUser} />
      ) : (
        <ChatLayout currentUser={currentUser} />
      )}
    </>
  );
}

export default App;