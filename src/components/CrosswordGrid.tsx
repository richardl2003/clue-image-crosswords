
import React, { useState, useEffect } from 'react';
import CrosswordCell from './CrosswordCell';
import { CellData, Direction, CrosswordClue } from '@/types/crossword';

interface CrosswordGridProps {
  grid: CellData[][];
  activeRow: number;
  activeCol: number;
  activeDirection: Direction;
  activeClue: CrosswordClue | null;
  onCellFocus: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: string) => void;
  onDirectionChange: () => void;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  activeRow,
  activeCol,
  activeDirection,
  activeClue,
  onCellFocus,
  onCellChange,
  onDirectionChange,
}) => {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  // Safety check for empty grid
  if (!grid || grid.length === 0 || !grid[0]) {
    return <div className="p-4 text-center">Loading crossword puzzle...</div>;
  }

  useEffect(() => {
    setFocusedCell({ row: activeRow, col: activeCol });
  }, [activeRow, activeCol]);

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      onDirectionChange();
      return;
    }
    
    const moveNext = (row: number, col: number) => {
      if (activeDirection === 'across') {
        for (let c = col + 1; c < grid[0].length; c++) {
          if (!grid[row][c].isBlack) {
            onCellFocus(row, c);
            return;
          }
        }
      } else {
        for (let r = row + 1; r < grid.length; r++) {
          if (r < grid.length && !grid[r][col].isBlack) {
            onCellFocus(r, col);
            return;
          }
        }
      }
    };

    const movePrev = (row: number, col: number) => {
      if (activeDirection === 'across') {
        for (let c = col - 1; c >= 0; c--) {
          if (!grid[row][c].isBlack) {
            onCellFocus(row, c);
            return;
          }
        }
      } else {
        for (let r = row - 1; r >= 0; r--) {
          if (!grid[r][col].isBlack) {
            onCellFocus(r, col);
            return;
          }
        }
      }
    };

    switch (e.key) {
      case 'ArrowRight':
        if (col + 1 < grid[0].length && !grid[row][col + 1].isBlack) {
          onCellFocus(row, col + 1);
        }
        break;
      case 'ArrowLeft':
        if (col - 1 >= 0 && !grid[row][col - 1].isBlack) {
          onCellFocus(row, col - 1);
        }
        break;
      case 'ArrowDown':
        if (row + 1 < grid.length && !grid[row + 1][col].isBlack) {
          onCellFocus(row + 1, col);
        }
        break;
      case 'ArrowUp':
        if (row - 1 >= 0 && !grid[row - 1][col].isBlack) {
          onCellFocus(row - 1, col);
        }
        break;
      case 'Backspace':
        if (grid[row][col].value === '') {
          movePrev(row, col);
        }
        break;
      case 'Delete':
        if (grid[row][col].value !== '') {
          onCellChange(row, col, '');
        }
        break;
      default:
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
          onCellChange(row, col, e.key.toUpperCase());
          moveNext(row, col);
        }
    }
  };

  const isHighlightedClue = (row: number, col: number) => {
    if (!activeClue) return false;
    
    if (activeDirection === 'across' && row === activeClue.row) {
      return col >= activeClue.col && col < activeClue.col + activeClue.answer.length;
    } else if (activeDirection === 'down' && col === activeClue.col) {
      return row >= activeClue.row && row < activeClue.row + activeClue.answer.length;
    }
    return false;
  };

  const isHighlighted = (row: number, col: number) => {
    return (activeDirection === 'across' && row === activeRow) || 
           (activeDirection === 'down' && col === activeCol);
  };

  // Get grid dimensions safely
  const rows = grid.length;
  const cols = grid[0] ? grid[0].length : 0;

  return (
    <div 
      className="crossword-grid" 
      style={{ 
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`, 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        width: '100%',
        maxWidth: `${cols * 40}px`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <CrosswordCell
            key={`${rowIndex}-${colIndex}`}
            value={cell.value}
            onChange={(value) => onCellChange(rowIndex, colIndex, value)}
            isBlack={cell.isBlack}
            number={cell.number}
            isHighlighted={isHighlighted(rowIndex, colIndex)}
            isHighlightedClue={isHighlightedClue(rowIndex, colIndex)}
            isFocused={
              focusedCell?.row === rowIndex && focusedCell?.col === colIndex
            }
            onFocus={() => onCellFocus(rowIndex, colIndex)}
            onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
          />
        ))
      )}
    </div>
  );
};

export default CrosswordGrid;
