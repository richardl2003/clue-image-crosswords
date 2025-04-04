import React, { useState, useEffect } from "react";
import CrosswordPuzzle from "@/components/CrosswordPuzzle";
import CrosswordSelector from "@/components/CrosswordSelector";
import { CrosswordData } from "@/types/crossword";
import { toast } from "sonner";

const Index = () => {
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(
    null
  );
  const [availableCrosswords, setAvailableCrosswords] = useState<
    { name: string; path: string }[]
  >([
    // { name: "Mini Crossword", path: "/crosswords/mini-crossword.json" },
    { name: "Baoze Fun Lil Crossword", path: "/crosswords/baoze-bday-crossword.json" },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the default crossword when the component mounts
    loadCrossword("/crosswords/baoze-bday-crossword.json");
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
      console.error("Error loading crossword:", error);
      toast.error("Failed to load crossword puzzle");
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
        if (
          !data.title ||
          !data.grid ||
          !data.clues ||
          !data.clues.across ||
          !data.clues.down ||
          !data.size
        ) {
          throw new Error("Invalid crossword file format");
        }

        setCrosswordData(data);

        // Add to available crosswords temporarily
        const newCrosswordName =
          data.title || `Custom Crossword ${new Date().toISOString()}`;
        const newPath = URL.createObjectURL(file);

        setAvailableCrosswords([
          ...availableCrosswords,
          { name: newCrosswordName, path: newPath },
        ]);

        toast.success(`Loaded custom crossword: ${newCrosswordName}`);
      } catch (error) {
        console.error("Error parsing uploaded file:", error);
        toast.error("Invalid crossword puzzle format");
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the uploaded file");
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
    </div>
  );
};

export default Index;
