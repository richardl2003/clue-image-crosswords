
  const checkClue = (clue: CrosswordClueType, direction: Direction) => {
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
