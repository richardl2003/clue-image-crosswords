
import React from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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
        <Dialog>
          <DialogTrigger asChild>
            <img 
              src={`https://images.unsplash.com/${imageUrl}`} 
              alt={`Clue ${number}`} 
              className="crossword-clue-image cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <img 
              src={`https://images.unsplash.com/${imageUrl}`} 
              alt={`Clue ${number}`}
              className="w-full rounded-lg object-cover" 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CrosswordClue;
