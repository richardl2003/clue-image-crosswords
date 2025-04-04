import React, { useState, useEffect } from 'react';
import { CrosswordData, CrosswordClue, Cell, CellData, Direction } from '@/types/crossword';
import { toast } from "sonner";

interface CrosswordPuzzleProps {
  data: CrosswordData;
}

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ data }) => {
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentDirection, setCurrentDirection] = useState<Direction>('across');
  const [selectedClue, setSelectedClue] = useState<{ number: number; direction: Direction } | null>(null);
  const [clueStatuses, setClueStatuses] = useState<{ [key: string]: boolean }>({});
  const [incorrectCells, setIncorrectCells] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (data && data.grid) {
      const initialGrid: CellData[][] = data.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          value: '',
          isBlack: cell === null,
          number: getClueNumber(rowIndex, colIndex, data),
          row: rowIndex,
          col: colIndex,
        }))
      );
      setGrid(initialGrid);
    }
  }, [data]);

  const getClueNumber = (row: number, col: number, data: CrosswordData): number | null => {
    if (!data || !data.clues) return null;

    for (const direction of ['across', 'down'] as Direction[]) {
      const clues = data.clues[direction];
      for (const clue of clues) {
        if (clue.row === row && clue.col === col) {
          return clue.number;
        }
      }
    }

    return null;
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });

    // Determine the initial direction based on whether there's an across or down clue
    let initialDirection: Direction = 'across';
    if (data) {
      const acrossClue = data.clues.across.find(clue => clue.row === row && clue.col === col);
      const downClue = data.clues.down.find(clue => clue.row === row && clue.col === col);

      if (!acrossClue && downClue) {
        initialDirection = 'down';
      }
    }
    setCurrentDirection(initialDirection);

    // Find the clue number for the selected cell and direction
    if (data) {
      let foundClueNumber: number | null = null;
      if (initialDirection === 'across') {
        const acrossClue = data.clues.across.find(clue => clue.row === row && clue.col === col);
        if (acrossClue) {
          foundClueNumber = acrossClue.number;
        }
      } else {
        const downClue = data.clues.down.find(clue => clue.row === row && clue.col === col);
        if (downClue) {
          foundClueNumber = downClue.number;
        }
      }

      if (foundClueNumber !== null) {
        setSelectedClue({ number: foundClueNumber, direction: initialDirection });
      } else {
        setSelectedClue(null);
      }
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? { ...cell, value: value.toUpperCase() } : cell
      )
    );
    setGrid(newGrid);
    setIncorrectCells(prev => {
      const key = `${row}-${col}`;
      if (prev[key]) {
        const { [key]: removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  };

  const handleDirectionChange = () => {
    setCurrentDirection(prev => (prev === 'across' ? 'down' : 'across'));

    if (selectedCell) {
      const { row, col } = selectedCell;
      if (data) {
        let foundClueNumber: number | null = null;
        const newDirection = currentDirection === 'across' ? 'down' : 'across';

        if (newDirection === 'across') {
          const acrossClue = data.clues.across.find(clue => clue.row === row && clue.col === col);
          if (acrossClue) {
            foundClueNumber = acrossClue.number;
          }
        } else {
          const downClue = data.clues.down.find(clue => clue.row === row && clue.col === col);
          if (downClue) {
            foundClueNumber = downClue.number;
          }
        }

        if (foundClueNumber !== null) {
          setSelectedClue({ number: foundClueNumber, direction: newDirection });
        } else {
          setSelectedClue(null);
        }
      }
    }
  };

  const checkClue = (clue: CrosswordClue, direction: Direction) => {
    if (!data || !data.grid) return false;
    
    let isCorrect = true;
    const newIncorrectCells: {[key: string]: boolean} = {};
    
    if (direction === 'across') {
      for (let c = 0; c < clue.answer.length; c++) {
        const col = clue.col + c;
        if (
          col < data.grid[clue.row].length &&
          data.grid[clue.row][col] !== null
        ) {
          const cellValue = grid[clue.row][col].value;
          const expectedValue = data.grid[clue.row][col] as string;
          
          // Only mark as incorrect if the cell is not empty
          if (cellValue !== '' && cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${clue.row}-${col}`] = true;
          }
        }
      }
    } else {
      for (let r = 0; r < clue.answer.length; r++) {
        const row = clue.row + r;
        if (
          row < data.grid.length &&
          data.grid[row][clue.col] !== null
        ) {
          const cellValue = grid[row][clue.col].value;
          const expectedValue = data.grid[row][clue.col] as string;
          
          // Only mark as incorrect if the cell is not empty
          if (cellValue !== '' && cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${row}-${clue.col}`] = true;
          }
        }
      }
    }
    
    const clueKey = `${direction}-${clue.number}`;
    setClueStatuses(prev => ({
      ...prev,
      [clueKey]: isCorrect
    }));
    
    setIncorrectCells(prev => ({
      ...prev,
      ...newIncorrectCells
    }));
    
    if (isCorrect) {
      toast.success(`Clue ${clue.number} ${direction} is correct!`);
    } else {
      toast.error(`Clue ${clue.number} ${direction} is incorrect. Keep trying!`);
    }
    
    return isCorrect;
  };

  const checkAnswers = () => {
    if (!data || !data.grid) return;
    
    let isCorrect = true;
    const newStatuses: {[key: string]: boolean} = {};
    const newIncorrectCells: {[key: string]: boolean} = {};
    
    data.clues.across.forEach(clue => {
      for (let c = 0; c < clue.answer.length; c++) {
        const col = clue.col + c;
        if (
          col < data.grid[clue.row].length &&
          data.grid[clue.row][col] !== null
        ) {
          const cellValue = grid[clue.row][col].value;
          const expectedValue = data.grid[clue.row][col] as string;
          
          // Only mark as incorrect if the cell is not empty
          if (cellValue !== '' && cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${clue.row}-${col}`] = true;
          }
        }
      }
      
      const clueKey = `across-${clue.number}`;
      newStatuses[clueKey] = !newIncorrectCells[`${clue.row}-${clue.col}`];
    });
    
    data.clues.down.forEach(clue => {
      for (let r = 0; r < clue.answer.length; r++) {
        const row = clue.row + r;
        if (
          row < data.grid.length &&
          data.grid[row][clue.col] !== null
        ) {
          const cellValue = grid[row][clue.col].value;
          const expectedValue = data.grid[row][clue.col] as string;
          
          // Only mark as incorrect if the cell is not empty
          if (cellValue !== '' && cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${row}-${clue.col}`] = true;
          }
        }
      }
      
      const clueKey = `down-${clue.number}`;
      newStatuses[clueKey] = !newIncorrectCells[`${clue.row}-${clue.col}`];
    });
    
    setClueStatuses(newStatuses);
    setIncorrectCells(newIncorrectCells);
    
    if (isCorrect) {
      setMessage({ text: "Congratulations! All answers are correct!", type: 'success' });
      toast.success("Congratulations! All answers are correct!");
    } else {
      setMessage({ text: "Some answers are incorrect. Keep trying!", type: 'error' });
      toast.error("Some answers are incorrect. Keep trying!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{data?.title}</h2>
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${data?.size.cols}, 1fr)` }}>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    value={cell.value}
                    className={`w-8 h-8 text-center uppercase border border-gray-400 ${cell.isBlack ? 'bg-gray-800 text-white' : 'bg-white'} ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-blue-200' : ''} ${incorrectCells[`${rowIndex}-${colIndex}`] ? 'bg-red-200' : ''}`}
                    readOnly={cell.isBlack}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
            ))}
          </div>
          {selectedCell && (
            <div className="mt-4">
              <button onClick={handleDirectionChange} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Change Direction to {currentDirection === 'across' ? 'Down' : 'Across'}
              </button>
            </div>
          )}
        </div>
        <div>
          <div>
            <h3>Across</h3>
            <ul>
              {data?.clues.across.map(clue => (
                <li key={`across-${clue.number}`} className={`cursor-pointer ${selectedClue?.number === clue.number && selectedClue?.direction === 'across' ? 'font-bold text-blue-500' : ''} ${clueStatuses[`across-${clue.number}`] === true ? 'text-green-500' : ''}`} onClick={() => setSelectedClue({ number: clue.number, direction: 'across' })}>
                  {clue.number}. {clue.clue}
                  {clueStatuses[`across-${clue.number}`] === true && <span className="text-green-500"> (Correct)</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Down</h3>
            <ul>
              {data?.clues.down.map(clue => (
                <li key={`down-${clue.number}`} className={`cursor-pointer ${selectedClue?.number === clue.number && selectedClue?.direction === 'down' ? 'font-bold text-blue-500' : ''} ${clueStatuses[`down-${clue.number}`] === true ? 'text-green-500' : ''}`} onClick={() => setSelectedClue({ number: clue.number, direction: 'down' })}>
                  {clue.number}. {clue.clue}
                  {clueStatuses[`down-${clue.number}`] === true && <span className="text-green-500"> (Correct)</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {selectedClue && (
          <button onClick={() => checkClue(data.clues[currentDirection].find(clue => clue.number === selectedClue.number)!, currentDirection)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            Check Clue {selectedClue.number} {currentDirection}
          </button>
        )}
        <button onClick={checkAnswers} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Check Answers
        </button>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
