import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";

interface CrosswordClueProps {
  number: number;
  imageUrl: string;
  isActive: boolean;
  onClick: () => void;
  onCheck?: () => void;
  isCorrect?: boolean | null;
}

const CrosswordClue: React.FC<CrosswordClueProps> = ({
  number,
  imageUrl,
  isActive,
  onClick,
  onCheck,
  isCorrect,
}) => {
  return (
    <div
      className={cn(
        "crossword-clue-item group",
        isActive && "active",
        isCorrect === true && "correct",
        isCorrect === false && "incorrect"
      )}
      onClick={onClick}
    >
      <div className="crossword-clue-number">{number}.</div>
      <div className="flex-1">
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={`/images/${imageUrl}`}
              alt={`Clue ${number}`}
              className="crossword-clue-image cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <img
              src={`/images/${imageUrl}`}
              alt={`Clue ${number}`}
              className="w-full rounded-lg object-cover"
            />
          </DialogContent>
        </Dialog>
      </div>
      {onCheck && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheck();
          }}
          className="crossword-check-button"
          aria-label="Check clue"
        >
          <CheckIcon size={16} />
        </button>
      )}
    </div>
  );
};

export default CrosswordClue;
