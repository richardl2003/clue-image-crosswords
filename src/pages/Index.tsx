
import React, { useState, useEffect } from 'react';
import CrosswordPuzzle from '@/components/CrosswordPuzzle';
import CrosswordSelector from '@/components/CrosswordSelector';
import { CrosswordData } from '@/types/crossword';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [availableCrosswords, setAvailableCrosswords] = useState<{ name: string; path: string }[]>([
    { name: 'Sample Crossword', path: '/crosswords/sample-crossword.json' },
    { name: 'Mini Crossword', path: '/crosswords/mini-crossword.json' }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the default crossword when the component mounts
    loadCrossword('/crosswords/sample-crossword.json');
  }, []);

  const loadCrossword = async (path: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Failed to load crossword: ${response.statusText}`);
      }
      
      const data: CrosswordData = await response.json();
      setCrosswordData(data);
    } catch (error) {
      console.error('Error loading crossword:', error);
      toast.error('Failed to load crossword puzzle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCrossword = (path: string) => {
    loadCrossword(path);
  };

  const handleUploadCrossword = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: CrosswordData = JSON.parse(content);
        
        // Validate the required structure
        if (!data.title || !data.grid || !data.clues || 
            !data.clues.across || !data.clues.down || !data.size) {
          throw new Error('Invalid crossword file format');
        }
        
        setCrosswordData(data);
        
        // Add to available crosswords temporarily
        const newCrosswordName = data.title || `Custom Crossword ${new Date().toISOString()}`;
        const newPath = URL.createObjectURL(file);
        
        setAvailableCrosswords([
          ...availableCrosswords,
          { name: newCrosswordName, path: newPath }
        ]);
        
        toast.success(`Loaded custom crossword: ${newCrosswordName}`);
      } catch (error) {
        console.error('Error parsing uploaded file:', error);
        toast.error('Invalid crossword puzzle format');
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the uploaded file');
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen py-8 bg-crossword-bg">
      <CrosswordSelector
        availableCrosswords={availableCrosswords}
        onSelectCrossword={handleSelectCrossword}
        onUploadCrossword={handleUploadCrossword}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading puzzle...</div>
        </div>
      ) : crosswordData ? (
        <CrosswordPuzzle data={crosswordData} />
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">No crossword puzzle loaded</div>
        </div>
      )}

      <div className="mt-12 max-w-2xl mx-auto px-4 text-center text-muted-foreground">
        <h3 className="text-lg font-medium mb-4">How to Create Custom Puzzles</h3>
        <p className="mb-2">
          To create your own crossword puzzle, prepare a JSON file with the following structure:
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
          Use null for black squares. For image clues, use Unsplash image IDs (like "photo-1234567890").
        </p>
      </div>
    </div>
  );
};

export default Index;
