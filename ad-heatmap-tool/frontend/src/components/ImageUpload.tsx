"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isUploading?: boolean;
  maxSize?: number; // in bytes
}

export function ImageUpload({
  onImageUpload,
  isUploading = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const errorMessages = fileRejections[0].errors.map((e) => e.message).join(", ");
        setError(errorMessages);
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxSize,
    multiple: false,
    disabled: isUploading,
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  if (preview) {
    return (
      <div className="relative animate-reveal-heatmap">
        <div className="relative rounded-lg overflow-hidden shadow-lg border border-[hsl(var(--border))]">
          <img
            src={preview}
            alt="Uploaded ad preview"
            className="w-full h-auto max-h-[500px] object-contain bg-[hsl(var(--muted))]"
          />
          {!isUploading && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 bg-[hsl(var(--background))]/80 hover:bg-[hsl(var(--background))] backdrop-blur-sm"
              onClick={clearPreview}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-[hsl(var(--background))]/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin" />
                <p className="text-sm font-medium">Analyzing your ad...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-150 ease-out",
          "hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5 hover:-translate-y-0.5 hover:shadow-lg",
          isDragActive && !isDragReject && "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 -translate-y-0.5 shadow-lg",
          isDragReject && "border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/5",
          isUploading && "pointer-events-none opacity-50",
          !isDragActive && !isDragReject && "border-[hsl(var(--muted-foreground))]/30"
        )}
      >
        <input {...getInputProps()} aria-label="Upload image" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "p-4 rounded-full transition-colors duration-150",
              isDragActive && !isDragReject
                ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
            )}
          >
            {isDragActive && !isDragReject ? (
              <ImageIcon className="w-12 h-12" />
            ) : (
              <Upload className="w-12 h-12" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium mb-1">
              {isDragActive && !isDragReject
                ? "Drop your ad here"
                : isDragReject
                ? "Invalid file type"
                : "Drop your ad here"}
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              or click to browse
            </p>
          </div>

          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            PNG, JPG, WebP up to 10MB
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-[hsl(var(--destructive))] text-center animate-slide-in-up">
          {error}
        </p>
      )}
    </div>
  );
}
