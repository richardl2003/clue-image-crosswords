
import React from 'react';
import { cn } from '@/lib/utils';

interface CrosswordClueProps {
  number: number;
  imageUrl: string;
  isActive: boolean;
  onClick: () => void;
}

const CrosswordClue: React.FC<CrosswordClueProps> = ({
  number,
  imageUrl,
  isActive,
  onClick,
}) => {
  return (
    <div 
      className={cn('crossword-clue-item', isActive && 'active')} 
      onClick={onClick}
    >
      <div className="crossword-clue-number">{number}.</div>
      <div className="flex-1">
        <img 
          src={`https://images.unsplash.com/${imageUrl}`} 
          alt={`Clue ${number}`} 
          className="crossword-clue-image" 
        />
      </div>
    </div>
  );
};

export default CrosswordClue;
