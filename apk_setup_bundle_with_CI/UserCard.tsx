
import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';

interface UserCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSwipe, isActive }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [cardStyle, setCardStyle] = useState({});
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isActive) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    setCurrentPos({ x: dx, y: dy });

    const rotate = dx * 0.1;
    setCardStyle({
      transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`,
      transition: 'none',
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isActive) return;
    
    setIsDragging(false);
    cardRef.current?.releasePointerCapture(e.pointerId);

    const dx = e.clientX - startPos.x;
    if (Math.abs(dx) > 100) {
      const direction = dx > 0 ? 'right' : 'left';
      const flyOutX = direction === 'right' ? 500 : -500;
      setCardStyle({
        transform: `translate(${flyOutX}px, ${currentPos.y}px) rotate(${dx*0.2}deg)`,
        transition: 'transform 0.5s ease-out',
        opacity: 0,
      });
      setTimeout(() => onSwipe(direction), 200);
    } else {
      // Return to center
      setCardStyle({
        transform: 'translate(0, 0) rotate(0deg)',
        transition: 'all 0.3s ease-in-out',
      });
    }
  };
  
  const zIndex = isActive ? 10 : 1;

  return (
    <div
      ref={cardRef}
      className={`absolute w-11/12 h-full rounded-2xl overflow-hidden shadow-xl bg-gray-300 cursor-grab ${isActive ? 'active:cursor-grabbing' : 'cursor-default'}`}
      style={{ ...cardStyle, touchAction: 'none', zIndex }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
        <h3 className="text-3xl font-bold">{user.name}, {user.age}</h3>
        <p className="text-lg mt-1">{user.occupation}</p>
      </div>
       {isDragging && isActive && (
         <>
          <div className={`absolute top-8 left-8 border-4 border-green-400 text-green-400 font-bold p-2 rounded-lg text-2xl transform -rotate-12 transition-opacity ${currentPos.x > 20 ? 'opacity-100' : 'opacity-0'}`}>LIKE</div>
          <div className={`absolute top-8 right-8 border-4 border-red-500 text-red-500 font-bold p-2 rounded-lg text-2xl transform rotate-12 transition-opacity ${currentPos.x < -20 ? 'opacity-100' : 'opacity-0'}`}>NOPE</div>
         </>
      )}
    </div>
  );
};

export default UserCard;
