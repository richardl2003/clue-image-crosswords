
export type Cell = string | null;

export interface CrosswordSize {
  rows: number;
  cols: number;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface CrosswordData {
  title: string;
  author: string;
  date: string;
  size: CrosswordSize;
  grid: Cell[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

export interface CellData {
  value: string;
  isBlack: boolean;
  number: number | null;
  row: number;
  col: number;
}

export type Direction = 'across' | 'down';
