import { useCallback, useId, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  maxSizeMB: number;
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  allowedMime?: string[];
  disabled?: boolean;
}

export function FileUpload({
  accept,
  maxSizeMB,
  label,
  value,
  onChange,
  allowedMime,
  disabled = false,
}: FileUploadProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const validate = useCallback(
    (file: File) => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File must be under ${maxSizeMB}MB`);
        return false;
      }
      if (allowedMime?.length && !allowedMime.includes(file.type)) {
        setError('Invalid file type');
        return false;
      }
      const ext = accept.replace(/\./g, '').split(',').map((s) => s.trim());
      const nameOk = ext.some((e) => file.name.toLowerCase().endsWith(`.${e}`));
      if (!nameOk && ext.length) {
        setError(`Only ${accept} files`);
        return false;
      }
      setError(null);
      return true;
    },
    [accept, allowedMime, maxSizeMB],
  );

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (disabled) return;
      const file = list?.[0];
      if (!file) return;
      if (validate(file)) onChange(file);
      else onChange(null);
    },
    [disabled, onChange, validate],
  );

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-neutral-600">{label}</span>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => {
          if (disabled) return;
          document.getElementById(inputId)?.click();
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById(inputId)?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors duration-200 ${
          disabled
            ? 'cursor-not-allowed border-[#E5E5E4] bg-neutral-100 opacity-60'
            : drag
              ? 'cursor-pointer border-[#C8E63C] bg-[#C8E63C]/10'
              : 'cursor-pointer border-[#E5E5E4] bg-neutral-50 hover:border-[#C8E63C]/60'
        }`}
      >
        <Upload className="h-8 w-8 text-[#C8E63C]" aria-hidden />
        <p className="text-sm text-neutral-600">
          Drag and drop or <span className="font-semibold text-[#C8E63C]">browse</span>
        </p>
        <p className="text-xs text-neutral-500">
          {accept} · max {maxSizeMB}MB
        </p>
        <input
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {value && (
        <p className="text-sm text-neutral-600">
          Selected: <span className="font-medium text-neutral-900">{value.name}</span>
        </p>
      )}
      {error && <p className="text-xs text-[#F87171]">{error}</p>}
    </div>
  );
}
