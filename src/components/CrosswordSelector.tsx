import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CrosswordSelectorProps {
  availableCrosswords: { name: string; path: string }[];
  onSelectCrossword: (path: string) => void;
  onUploadCrossword: (file: File) => void;
}

const CrosswordSelector: React.FC<CrosswordSelectorProps> = ({
  availableCrosswords,
  onSelectCrossword,
  onUploadCrossword,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    availableCrosswords[0]?.path || ""
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast.error("Please upload a JSON file");
      return;
    }

    onUploadCrossword(file);
  };

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onSelectCrossword(value);
  };

  return (
    <div className="flex justify-center items-center mb-8">
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a crossword" />
        </SelectTrigger>
        <SelectContent>
          {availableCrosswords.map((crossword) => (
            <SelectItem key={crossword.path} value={crossword.path}>
              {crossword.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CrosswordSelector;
