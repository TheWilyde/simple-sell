import { useRef, useState } from "react";
import { Upload } from "lucide-react";

type ImageDropzoneProps = {
  onImageSelected: (file: File) => void;
};

function ImageDropzone({ onImageSelected }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  function acceptFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Choose an image file.");
      return;
    }

    setFileError(null);
    onImageSelected(file);
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex min-h-64 w-full cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed px-8 py-16 text-center transition-all duration-200 ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/45 hover:bg-secondary/70"
        }`}
      >
        <span
          className={`transition-colors duration-200 ${
            dragging ? "text-primary" : "text-muted-foreground"
          }`}
          aria-hidden="true"
        >
          <Upload size={30} strokeWidth={1.5} />
        </span>
        <span>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            {dragging ? "Release to upload" : "Click or drag image here"}
          </span>
          <span className="block text-[11px] text-muted-foreground">
            JPG, PNG, WEBP, GIF
          </span>
        </span>
        {dragging && (
          <span className="absolute inset-0 animate-pulse border-2 border-primary" aria-hidden="true" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => acceptFile(event.target.files?.[0])}
      />

      {fileError && (
        <p className="text-[11px] font-medium text-danger" role="alert">
          {fileError}
        </p>
      )}
    </div>
  );
}

export default ImageDropzone;
