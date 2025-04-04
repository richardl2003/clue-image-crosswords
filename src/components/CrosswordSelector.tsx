import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface CrosswordSelectorProps {
  availableCrosswords: { name: string; path: string }[];
  onSelectCrossword: (path: string) => void;
  onUploadCrossword: (file: File) => void;
}

const CrosswordSelector: React.FC<CrosswordSelectorProps> = ({ 
  availableCrosswords, 
  onSelectCrossword, 
  onUploadCrossword 
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(availableCrosswords[0]?.path || '');
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
      toast.error('Please upload a JSON file');
      return;
    }
    
    onUploadCrossword(file);
  };
  
  const handleChange = (value: string) => {
    setSelectedValue(value);
    onSelectCrossword(value);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-8 max-w-xl mx-auto">
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger className="w-full md:w-[300px]">
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
      
      <div className="flex-1 flex items-center space-x-2">
        <Input
          type="file"
          accept=".json"
          id="crossword-upload"
          className="hidden"
          onChange={handleUpload}
        />
        <label
          htmlFor="crossword-upload"
          className="cursor-pointer flex-1 px-4 py-2 text-center bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          Upload Custom JSON
        </label>
      </div>
    </div>
  );
};

export default CrosswordSelector;
