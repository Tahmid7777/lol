
import React, { useState, useEffect, useCallback } from 'react';
import type { User, Match, Message } from './types';
import { Gender } from './types';
import { MOCK_USERS } from './constants';
import ProfileCreation from './components/ProfileCreation';
import Matching from './components/Matching';
import Chat from './components/Chat';

type View = 'profile' | 'matching' | 'chat';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('profile');
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [likes, setLikes] = useState<Record<string, string[]>>({});
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeChat, setActiveChat] = useState<Match | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user: User = JSON.parse(savedUser);
        setCurrentUser(user);
        setView('matching');
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const oppositeGender = currentUser.gender === Gender.Male ? Gender.Female : Gender.Male;
      const filteredUsers = MOCK_USERS.filter(
        user => user.gender === oppositeGender && user.id !== currentUser.id
      );
      setPotentialMatches(filteredUsers);
    }
  }, [currentUser]);

  const handleProfileCreate = (user: User) => {
    const newUser = { ...user, id: `user-${Date.now()}` };
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setView('matching');
  };

  const handleLike = useCallback((likedUser: User) => {
    if (!currentUser) return;

    // Record the like
    const newLikes = { ...likes };
    if (!newLikes[currentUser.id]) {
      newLikes[currentUser.id] = [];
    }
    newLikes[currentUser.id].push(likedUser.id);
    setLikes(newLikes);

    // Check for a match
    if (likes[likedUser.id]?.includes(currentUser.id)) {
      const newMatch: Match = {
        id: `match-${currentUser.id}-${likedUser.id}`,
        users: [currentUser, likedUser],
        messages: [],
      };
      setMatches(prev => [...prev, newMatch]);
      setActiveChat(newMatch);
      setView('chat');
    }
    
    // Remove from potential matches
    setPotentialMatches(prev => prev.filter(u => u.id !== likedUser.id));

  }, [currentUser, likes]);

  const handleDislike = (dislikedUser: User) => {
     setPotentialMatches(prev => prev.filter(u => u.id !== dislikedUser.id));
  };
  
  const handleSendMessage = (text: string) => {
    if (!activeChat || !currentUser) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: Date.now(),
    };
    
    const updatedMatch = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
    };

    setActiveChat(updatedMatch);
    setMatches(prevMatches => prevMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m));
  };
  
  const closeChat = () => {
    setActiveChat(null);
    setView('matching');
  }

  const renderView = () => {
    switch (view) {
      case 'profile':
        return <ProfileCreation onProfileCreate={handleProfileCreate} />;
      case 'matching':
        return currentUser ? (
          <Matching
            currentUser={currentUser}
            users={potentialMatches}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ) : null;
      case 'chat':
        return activeChat && currentUser ? (
          <Chat 
            match={activeChat} 
            currentUser={currentUser} 
            onSendMessage={handleSendMessage}
            onBack={closeChat}
          />
        ) : null;
      default:
        return <ProfileCreation onProfileCreate={handleProfileCreate} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="relative w-full max-w-sm h-[85vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
           <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Gemini Spark
           </h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default App;
