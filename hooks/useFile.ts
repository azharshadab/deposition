import { useState, useCallback } from 'react';

type ValidTypes = 'text/plain' | 'application/zip';

const useFile = (validTypes: ValidTypes[] = []) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      const submittedFiles = Array.from(event.target.files);
      const validFiles = submittedFiles.filter(file =>
        validTypes.includes(file.type as ValidTypes),
      );
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(validFiles)]);
      const filesAreAllValid = validFiles.length === submittedFiles.length;
      return filesAreAllValid;
    },
    [],
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const items = event.dataTransfer.items;

    if (!items) return;

    const files: File[] = Array.from(items).reduce((acc: File[], item) => {
      if (item.kind !== 'file') return acc;
      const file = item.getAsFile();
      if (!file) return acc;
      if (!validTypes.includes(file.type as ValidTypes)) return acc;
      return [...acc, file];
    }, []);

    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    handleFileUpload,
    handleDragOver,
    handleDrop,
    removeFile,
    reset,
  };
};

export default useFile;
