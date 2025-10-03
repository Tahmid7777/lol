import React, { useState, useEffect, useRef } from 'react';
import type { Match, User } from '../types';
import SendIcon from './icons/SendIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ChatProps {
  match: Match;
  currentUser: User;
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ match, currentUser, onSendMessage, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const otherUser = match.users.find(u => u.id !== currentUser.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [match.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!otherUser) {
    return <div>Error: Match not found.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 flex items-center p-3 border-b border-gray-200 shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <ArrowLeftIcon className="w-6 h-6 text-gray-600"/>
        </button>
        <img src={otherUser.photo} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{otherUser.name}</p>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
            <div className="text-center my-4">
                <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                    It's a Match!
                </p>
                <p className="text-sm text-gray-500">You and {otherUser.name} liked each other.</p>
            </div>
            {match.messages.map(message => {
                const isCurrentUser = message.senderId === currentUser.id;
                return (
                    <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-pink-500 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                        <p>{message.text}</p>
                    </div>
                    </div>
                );
            })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow w-full px-4 py-2 bg-gray-100 border border-transparent rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button type="submit" className="flex-shrink-0 p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-300" disabled={!newMessage.trim()}>
            <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;