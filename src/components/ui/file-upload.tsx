import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesSelected: (files: File[]) => void;
  preview?: boolean;
  multiple?: boolean;
  value?: File[];
  className?: string;
}

export function FileUpload({
  accept = "image/*",
  maxFiles = 5,
  maxSize = 5,
  onFilesSelected,
  preview = true,
  multiple = true,
  value = [],
  className,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(value);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList | null): File[] => {
    if (!files || files.length === 0) return [];

    const validFiles: File[] = [];
    let errorMsg = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errorMsg = `File ${file.name} exceeds ${maxSize}MB limit`;
        continue;
      }

      // Check max files
      if (selectedFiles.length + validFiles.length >= maxFiles) {
        errorMsg = `Maximum ${maxFiles} files allowed`;
        break;
      }

      validFiles.push(file);
    }

    setError(errorMsg);
    return validFiles;
  };

  const handleFiles = (files: FileList | null) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);

    // Generate previews for images
    if (preview && accept.includes("image")) {
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    onFilesSelected(newFiles);
    setError("");
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive
            ? "border-[#6C4DE6] bg-[#6C4DE6]/5"
            : "border-[#E4E7EB] hover:border-[#6C4DE6]/50",
          selectedFiles.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple && selectedFiles.length < maxFiles}
          onChange={handleChange}
          className="hidden"
          disabled={selectedFiles.length >= maxFiles}
        />

        <Upload className="w-12 h-12 text-[#7C7C7C] mx-auto mb-4" />
        <p className="text-[#1E1E1E] font-medium mb-1">
          {dragActive
            ? "Drop files here"
            : "Drag and drop files here, or click to browse"}
        </p>
        <p className="text-sm text-[#7C7C7C] mb-4">
          {accept === "image/*"
            ? `Images up to ${maxSize}MB (max ${maxFiles} files)`
            : `Files up to ${maxSize}MB (max ${maxFiles} files)`}
        </p>
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={selectedFiles.length >= maxFiles}
          className="bg-[#6C4DE6] hover:bg-[#593CC9] text-white"
        >
          Select Files
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {/* File Info */}
      {selectedFiles.length > 0 && (
        <p className="text-sm text-[#7C7C7C] mt-2">
          {selectedFiles.length} of {maxFiles} files selected
        </p>
      )}

      {/* Preview Grid */}
      {preview && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#E4E7EB]">
                {accept.includes("image") ? (
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F8F9FC]">
                    <ImageIcon className="w-8 h-8 text-[#7C7C7C]" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-[#7C7C7C] mt-1 truncate">
                {selectedFiles[index]?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
