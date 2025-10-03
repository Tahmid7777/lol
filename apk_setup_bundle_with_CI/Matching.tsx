
import React, { useState } from 'react';
import type { User } from '../types';
import UserCard from './UserCard';
import XIcon from './icons/XIcon';
import HeartIcon from './icons/HeartIcon';

interface MatchingProps {
  currentUser: User;
  users: User[];
  onLike: (user: User) => void;
  onDislike: (user: User) => void;
}

const Matching: React.FC<MatchingProps> = ({ users, onLike, onDislike }) => {
  const [userQueue, setUserQueue] = useState(users);

  const handleSwipe = (direction: 'left' | 'right', user: User) => {
    setUserQueue(prev => prev.filter(u => u.id !== user.id));
    if (direction === 'right') {
      onLike(user);
    } else {
      onDislike(user);
    }
  };

  const handleButtonClick = (action: 'like' | 'dislike') => {
    if (userQueue.length > 0) {
      const userToActOn = userQueue[userQueue.length - 1];
       setUserQueue(prev => prev.filter(u => u.id !== userToActOn.id));
       if (action === 'like') {
         onLike(userToActOn);
       } else {
         onDislike(userToActOn);
       }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full flex-grow flex items-center justify-center">
        {userQueue.length > 0 ? (
          userQueue.map((user, index) => (
             <UserCard
              key={user.id}
              user={user}
              onSwipe={(dir) => handleSwipe(dir, user)}
              isActive={index === userQueue.length - 1}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">
            <h3 className="text-xl font-semibold">That's everyone for now!</h3>
            <p className="mt-2">Check back later for new profiles.</p>
          </div>
        )}
      </div>
      
      {userQueue.length > 0 && (
         <div className="flex items-center justify-center space-x-8 mt-4 z-10">
          <button onClick={() => handleButtonClick('dislike')} className="bg-white rounded-full p-4 shadow-lg transform transition hover:scale-110 active:scale-95">
            <XIcon className="w-8 h-8 text-yellow-500" />
          </button>
          <button onClick={() => handleButtonClick('like')} className="bg-white rounded-full p-5 shadow-lg transform transition hover:scale-110 active:scale-95">
            <HeartIcon className="w-10 h-10 text-pink-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Matching;
