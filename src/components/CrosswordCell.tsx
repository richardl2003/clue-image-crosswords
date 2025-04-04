
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CrosswordCellProps {
  value: string;
  onChange: (value: string) => void;
  isBlack: boolean;
  number: number | null;
  isHighlighted: boolean;
  isHighlightedClue: boolean;
  isFocused: boolean;
  isIncorrect?: boolean;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const CrosswordCell: React.FC<CrosswordCellProps> = ({
  value,
  onChange,
  isBlack,
  number,
  isHighlighted,
  isHighlightedClue,
  isFocused,
  isIncorrect,
  onFocus,
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  if (isBlack) {
    return <div className="crossword-cell black" />;
  }

  return (
    <div
      className={cn(
        'crossword-cell',
        isHighlighted && 'highlighted',
        isHighlightedClue && 'highlighted-clue',
        isIncorrect && 'incorrect'
      )}
      onClick={onFocus}
    >
      {number !== null && <div className="crossword-cell-number">{number}</div>}
      <input
        ref={inputRef}
        type="text"
        maxLength={1}
        value={value || ''}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className={cn("crossword-cell-input", isIncorrect && "text-red-600")}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default CrosswordCell;
