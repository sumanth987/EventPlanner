import React, { useState, useRef } from 'react';
import { Trash2, Edit3 } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  children, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwipeActive) return;
    
    currentX.current = e.touches[0].clientX;
    const distance = startX.current - currentX.current;
    setSwipeDistance(Math.max(0, Math.min(distance, 120)));
  };

  const handleTouchEnd = () => {
    setIsSwipeActive(false);
    
    if (swipeDistance > 60) {
      setSwipeDistance(120);
    } else {
      setSwipeDistance(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Action buttons */}
      <div 
        className="absolute right-0 top-0 bottom-0 flex items-center"
        style={{ width: '120px' }}
      >
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-16 h-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-16 h-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Card content */}
      <div
        className={`relative bg-white transition-transform duration-200 ${className}`}
        style={{ 
          transform: `translateX(-${swipeDistance}px)`,
          transition: isSwipeActive ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};