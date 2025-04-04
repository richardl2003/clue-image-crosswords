import React, { useState, useEffect } from "react";
import CrosswordGrid from "./CrosswordGrid";
import CrosswordClue from "./CrosswordClue";
import {
  CrosswordData,
  CellData,
  Direction,
  CrosswordClue as CrosswordClueType,
} from "@/types/crossword";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckIcon } from "lucide-react";

interface CrosswordPuzzleProps {
  data: CrosswordData;
}

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ data }) => {
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [activeCol, setActiveCol] = useState<number>(0);
  const [activeDirection, setActiveDirection] = useState<Direction>("across");
  const [activeClue, setActiveClue] = useState<CrosswordClueType | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [clueStatuses, setClueStatuses] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [incorrectCells, setIncorrectCells] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (!data || !data.grid) return;

    const initialGrid: CellData[][] = [];

    // Create a map of cell coordinates to clue numbers
    const numberMap: { [key: string]: number } = {};

    // Add across clue numbers
    data.clues.across.forEach((clue) => {
      numberMap[`${clue.row}-${clue.col}`] = clue.number;
    });

    // Add down clue numbers (only if not already added by across clues)
    data.clues.down.forEach((clue) => {
      const key = `${clue.row}-${clue.col}`;
      if (!numberMap[key]) {
        numberMap[key] = clue.number;
      }
    });

    for (let r = 0; r < data.grid.length; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < data.grid[r].length; c++) {
        const cell: CellData = {
          value: "",
          isBlack: data.grid[r][c] === null,
          number: numberMap[`${r}-${c}`] || null,
          row: r,
          col: c,
        };
        row.push(cell);
      }
      initialGrid.push(row);
    }

    setGrid(initialGrid);

    // Find first non-black cell and set it as active
    for (let r = 0; r < initialGrid.length; r++) {
      for (let c = 0; c < initialGrid[r].length; c++) {
        if (!initialGrid[r][c].isBlack) {
          setActiveRow(r);
          setActiveCol(c);

          const acrossClue = data.clues.across.find(
            (clue) =>
              clue.row === r &&
              clue.col <= c &&
              c < clue.col + clue.answer.length
          );

          if (acrossClue) {
            setActiveClue(acrossClue);
            setActiveDirection("across");
          } else {
            const downClue = data.clues.down.find(
              (clue) =>
                clue.col === c &&
                clue.row <= r &&
                r < clue.row + clue.answer.length
            );
            if (downClue) {
              setActiveClue(downClue);
              setActiveDirection("down");
            }
          }
          return;
        }
      }
    }
  }, [data]);

  const handleCellFocus = (row: number, col: number) => {
    setActiveRow(row);
    setActiveCol(col);

    let clue: CrosswordClueType | undefined;

    if (activeDirection === "across") {
      clue = data.clues.across.find(
        (c) => c.row === row && c.col <= col && col < c.col + c.answer.length
      );

      if (!clue) {
        setActiveDirection("down");
        clue = data.clues.down.find(
          (c) => c.col === col && c.row <= row && row < c.row + c.answer.length
        );
      }
    } else {
      clue = data.clues.down.find(
        (c) => c.col === col && c.row <= row && row < c.row + c.answer.length
      );

      if (!clue) {
        setActiveDirection("across");
        clue = data.clues.across.find(
          (c) => c.row === row && c.col <= col && col < c.col + c.answer.length
        );
      }
    }

    setActiveClue(clue || null);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col].value = value;
    setGrid(newGrid);

    if (activeClue) {
      const clueKey = `${activeDirection}-${activeClue.number}`;
      setClueStatuses((prev) => ({
        ...prev,
        [clueKey]: null,
      }));

      setIncorrectCells((prev) => {
        const newIncorrect = { ...prev };
        delete newIncorrect[`${row}-${col}`];
        return newIncorrect;
      });
    }
  };

  const handleDirectionChange = () => {
    const newDirection = activeDirection === "across" ? "down" : "across";
    setActiveDirection(newDirection);

    const clues =
      newDirection === "across" ? data.clues.across : data.clues.down;
    const clue = clues.find(
      (c) =>
        (newDirection === "across" &&
          c.row === activeRow &&
          c.col <= activeCol &&
          activeCol < c.col + c.answer.length) ||
        (newDirection === "down" &&
          c.col === activeCol &&
          c.row <= activeRow &&
          activeRow < c.row + c.answer.length)
    );

    setActiveClue(clue || null);
  };

  const handleClueClick = (clue: CrosswordClueType, direction: Direction) => {
    setActiveDirection(direction);
    setActiveClue(clue);
    setActiveRow(clue.row);
    setActiveCol(clue.col);
  };

  const checkClue = (clue: CrosswordClueType, direction: Direction) => {
    if (!data || !data.grid) return false;

    let isCorrect = true;
    const newIncorrectCells: { [key: string]: boolean } = {};

    if (direction === "across") {
      for (let c = 0; c < clue.answer.length; c++) {
        const col = clue.col + c;
        if (
          col < data.grid[clue.row].length &&
          data.grid[clue.row][col] !== null
        ) {
          const cellValue = grid[clue.row][col].value;
          const expectedValue = data.grid[clue.row][col] as string;

          if (cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${clue.row}-${col}`] = true;
          }
        }
      }
    } else {
      for (let r = 0; r < clue.answer.length; r++) {
        const row = clue.row + r;
        if (row < data.grid.length && data.grid[row][clue.col] !== null) {
          const cellValue = grid[row][clue.col].value;
          const expectedValue = data.grid[row][clue.col] as string;

          if (cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${row}-${clue.col}`] = true;
          }
        }
      }
    }

    const clueKey = `${direction}-${clue.number}`;
    setClueStatuses((prev) => ({
      ...prev,
      [clueKey]: isCorrect,
    }));

    setIncorrectCells((prev) => ({
      ...prev,
      ...newIncorrectCells,
    }));

    if (isCorrect) {
      toast.success(`Clue ${clue.number} ${direction} is correct!`);
    } else {
      toast.error(
        `Clue ${clue.number} ${direction} is incorrect. Keep trying!`
      );
    }

    return isCorrect;
  };

  const checkCurrentClue = () => {
    if (activeClue) {
      checkClue(activeClue, activeDirection);
    }
  };

  const checkAnswers = () => {
    if (!data || !data.grid) return;

    let isCorrect = true;
    const newStatuses: { [key: string]: boolean } = {};
    const newIncorrectCells: { [key: string]: boolean } = {};

    data.clues.across.forEach((clue) => {
      for (let c = 0; c < clue.answer.length; c++) {
        const col = clue.col + c;
        if (
          col < data.grid[clue.row].length &&
          data.grid[clue.row][col] !== null
        ) {
          const cellValue = grid[clue.row][col].value;
          const expectedValue = data.grid[clue.row][col] as string;

          if (cellValue !== expectedValue) {
            isCorrect = false;
            newIncorrectCells[`${clue.row}-${col}`] = true;
          }
        }
      }

      const clueKey = `across-${clue.number}`;
      newStatuses[clueKey] = !newIncorrectCells[`${clue.row}-${clue.col}`];
    });

    data.clues.down.forEach((clue) => {
      for (let r = 0; r < clue.answer.length; r++) {
        const row = clue.row + r;
        if (row < data.grid.length && data.grid[row][clue.col] !== null) {
          const cellValue = grid[row][clue.col].value;
          const expectedValue = data.grid[row][clue.col] as string;

          if (cellValue !== expectedValue) {
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
      setMessage({
        text: "Congratulations! All answers are correct!",
        type: "success",
      });
      toast.success("Congratulations! All answers are correct!");
    } else {
      setMessage({
        text: "Some answers are incorrect. Keep trying!",
        type: "error",
      });
      toast.error("Some answers are incorrect. Keep trying!");
    }
  };

  const revealLetter = () => {
    if (data.grid[activeRow][activeCol] === null) return;

    const newGrid = [...grid];
    newGrid[activeRow][activeCol].value = data.grid[activeRow][
      activeCol
    ] as string;
    setGrid(newGrid);
  };

  const revealWord = () => {
    if (!activeClue) return;

    const newGrid = [...grid];

    if (activeDirection === "across") {
      for (let c = 0; c < activeClue.answer.length; c++) {
        const col = activeClue.col + c;
        if (
          col < data.grid[activeClue.row].length &&
          data.grid[activeClue.row][col] !== null
        ) {
          newGrid[activeClue.row][col].value = data.grid[activeClue.row][
            col
          ] as string;
        }
      }
    } else {
      for (let r = 0; r < activeClue.answer.length; r++) {
        const row = activeClue.row + r;
        if (row < data.grid.length && data.grid[row][activeClue.col] !== null) {
          newGrid[row][activeClue.col].value = data.grid[row][
            activeClue.col
          ] as string;
        }
      }
    }

    setGrid(newGrid);
  };

  const resetPuzzle = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        value: "",
      }))
    );
    setGrid(newGrid);
    setMessage(null);
    setClueStatuses({});
    setIncorrectCells({});
  };

  return (
    <div className="crossword-container">
      <h1 className="crossword-title">{data.title}</h1>
      <p className="crossword-subtitle">
        By {data.author} | {data.date}
      </p>

      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center">
          <CrosswordGrid
            grid={grid}
            activeRow={activeRow}
            activeCol={activeCol}
            activeDirection={activeDirection}
            activeClue={activeClue}
            incorrectCells={incorrectCells}
            onCellFocus={handleCellFocus}
            onCellChange={handleCellChange}
            onDirectionChange={handleDirectionChange}
          />

          <div className="crossword-controls">
            <Button
              onClick={checkCurrentClue}
              variant="outline"
              className="crossword-button"
              disabled={!activeClue}
            >
              <CheckIcon size={16} />
              Check Word
            </Button>
            <Button
              onClick={checkAnswers}
              variant="default"
              className="crossword-button"
            >
              <CheckIcon size={16} />
              Check All
            </Button>
            <Button
              onClick={revealLetter}
              variant="outline"
              className="crossword-button"
            >
              Reveal Letter
            </Button>
            <Button
              onClick={revealWord}
              variant="outline"
              className="crossword-button"
            >
              Reveal Word
            </Button>
            <Button
              onClick={resetPuzzle}
              variant="destructive"
              className="crossword-button"
            >
              Reset
            </Button>
          </div>

          {message && (
            <div className={`crossword-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="crossword-clues-container">
          <div className="crossword-clue-section">
            <h2 className="crossword-clue-title">Across</h2>
            <div className="crossword-clue-list">
              {data.clues.across.map((clue) => {
                const clueKey = `across-${clue.number}`;
                return (
                  <CrosswordClue
                    key={clueKey}
                    number={clue.number}
                    imageUrl={clue.clue}
                    isActive={
                      activeClue?.number === clue.number &&
                      activeDirection === "across"
                    }
                    isCorrect={clueStatuses[clueKey]}
                    onClick={() => handleClueClick(clue, "across")}
                    onCheck={() => checkClue(clue, "across")}
                  />
                );
              })}
            </div>
          </div>

          <div className="crossword-clue-section">
            <h2 className="crossword-clue-title">Down</h2>
            <div className="crossword-clue-list">
              {data.clues.down.map((clue) => {
                const clueKey = `down-${clue.number}`;
                return (
                  <CrosswordClue
                    key={clueKey}
                    number={clue.number}
                    imageUrl={clue.clue}
                    isActive={
                      activeClue?.number === clue.number &&
                      activeDirection === "down"
                    }
                    isCorrect={clueStatuses[clueKey]}
                    onClick={() => handleClueClick(clue, "down")}
                    onCheck={() => checkClue(clue, "down")}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-2xl mx-auto px-4 text-center text-muted-foreground">
        <h3 className="text-lg font-medium mb-4">
          How to Create Custom Puzzles
        </h3>
        <p className="mb-2">
          To create your own crossword puzzle, prepare a JSON file with the
          following structure:
        </p>
        <pre className="text-left p-4 bg-secondary rounded-md overflow-auto text-sm mb-6">
          {`{
  "title": "Your Puzzle Title",
  "author": "Your Name",
  "date": "Date Created",
  "size": { "rows": 5, "cols": 5 },
  "grid": [
    ["C", "A", "T", null, "D"],
    ["O", null, "R", "E", "A"],
    [null, null, null, null, null],
    // Additional rows...
  ],
  "clues": {
    "across": [
      {
        "number": 1,
        "clue": "photo-filename",
        "answer": "CAT",
        "row": 0,
        "col": 0
      }
      // Additional across clues...
    ],
    "down": [
      // Down clues...
    ]
  }
}`}
        </pre>
        <p>
          Use null for black squares. For image clues, use Unsplash image IDs
          (like "photo-1234567890").
        </p>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
