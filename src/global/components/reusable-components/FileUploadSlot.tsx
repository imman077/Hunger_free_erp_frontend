import React, { useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle,
  X,
  Eye,
  ShieldCheck,
  FileText,
  Download,
  Camera,
  Link as LinkIcon,
  Globe,
} from "lucide-react";
import FilePreviewModal from "./FilePreviewModal";

interface FileUploadSlotProps {
  label: string;
  value: File | string | null;
  onChange: (value: File | string | null) => void;
  mandatory?: boolean;
  accept?: string;
  subtitle?: string;
  icon?: "shield" | "file" | "camera";
  showActions?: boolean; // Show view/download buttons
  variant?: "default" | "circle";
  allowUrl?: boolean; // Allow image URL input tab option
}

const FileUploadSlot: React.FC<FileUploadSlotProps> = ({
  label,
  value,
  onChange,
  mandatory = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  subtitle,
  icon = "file",
  showActions = true,
  variant = "default",
  allowUrl = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Tab state when no file/URL is selected
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleSlotClick = () => {
    if (!value && activeTab === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
    if (e.target) e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!value && activeTab === "file") {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!value && activeTab === "file") {
      const file = e.dataTransfer.files?.[0];
      if (file) {
        onChange(file);
      }
    }
  };

  const handleApplyUrl = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError("Please enter a valid photo/image URL");
      return;
    }
    setUrlError("");
    onChange(trimmed);
    setUrlInput("");
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setUrlError("");
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value && downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      if (typeof value === "string") {
        link.target = "_blank";
        link.download = value.split("/").pop() || "download";
      } else {
        link.download = value.name;
      }
      link.click();
    }
  };

  const isImage = typeof value === "string" 
    ? true 
    : value?.type?.startsWith("image/");

  // Create download URL and cleanup
  React.useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setDownloadUrl(value);
        return;
      }
      if (typeof value !== "string") {
        const url = URL.createObjectURL(value as any);
        setDownloadUrl(url);
        return () => {
          URL.revokeObjectURL(url);
          setDownloadUrl(null);
        };
      }
    } else {
      setDownloadUrl(null);
    }
  }, [value]);

  if (variant === "circle") {
    return (
      <>
        <div
          onClick={handleSlotClick}
          className={`flex items-center gap-4 cursor-pointer group/circle`}
        >
          <div
            className={`w-14 h-14 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden shrink-0 ${
              value ? "border-[#22c55e] bg-[#22c55e]/5" : ""
            }`}
            style={{
              borderColor: value ? "#22c55e" : "var(--border-color)",
              backgroundColor: value
                ? "rgb(34 197 94 / 0.05)"
                : "var(--bg-tertiary)",
            }}
          >
            {value && isImage && downloadUrl ? (
              <img
                src={downloadUrl}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className={`flex flex-col items-center ${
                  value ? "text-[#22c55e]" : ""
                }`}
                style={{ color: value ? "#22c55e" : "var(--text-muted)" }}
              >
                {icon === "camera" ? (
                  <Camera size={18} />
                ) : (
                  <UploadCloud size={18} />
                )}
              </div>
            )}

            {/* Hover Overlay */}
            {value && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 opacity-0 group-hover/circle:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleView}
                  className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
                >
                  <Eye size={10} />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 bg-white/20 hover:bg-red-500 rounded-full text-white transition-all"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="text-left hidden md:block">
            <p
              className="text-[10px] font-black uppercase tracking-tight leading-none mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {label} {mandatory && <span className="text-red-500">*</span>}
            </p>
            <p
              className="text-[8px] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {value ? "Tap to Change" : "Identification"}
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
          />
        </div>

        <FilePreviewModal
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          file={value}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleSlotClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-300 min-h-[170px] group ${
          value
            ? "border-[#22c55e] bg-[#22c55e]/10 shadow-inner"
            : isDragging
            ? "border-[#22c55e] bg-[#22c55e]/10 scale-[1.01]"
            : activeTab === "file"
            ? "hover:border-[#22c55e]/60 cursor-pointer"
            : "cursor-default"
        }`}
        style={{
          borderColor: value
            ? "#22c55e"
            : isDragging
            ? "#22c55e"
            : "var(--border-color)",
          backgroundColor: value
            ? "rgb(34 197 94 / 0.08)"
            : "var(--bg-tertiary)",
        }}
      >
        {/* Mode Switcher Tabs when unfilled */}
        {!value && allowUrl && (
          <div
            className="absolute top-3 right-3 flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg z-20 gap-0.5 border border-slate-200/60 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("file");
                setUrlError("");
              }}
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
                activeTab === "file"
                  ? "bg-white dark:bg-slate-700 text-[#22c55e] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <UploadCloud size={12} />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("url");
                setUrlError("");
              }}
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md transition-all ${
                activeTab === "url"
                  ? "bg-white dark:bg-slate-700 text-[#22c55e] shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LinkIcon size={12} />
              <span>Paste URL</span>
            </button>
          </div>
        )}

        {/* Background Preview for Images */}
        {value && isImage && downloadUrl && (
          <div
            className="absolute inset-2 rounded-lg bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ backgroundImage: `url(${downloadUrl})` }}
          />
        )}

        {/* Unfilled State - File Upload Tab */}
        {!value && activeTab === "file" && (
          <>
            <div
              className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-[#22c55e] shadow-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-muted)",
              }}
            >
              {icon === "camera" ? (
                <Camera size={24} />
              ) : icon === "shield" ? (
                <ShieldCheck size={24} />
              ) : (
                <UploadCloud size={24} />
              )}
            </div>

            <div className="relative z-10 text-center">
              <p
                className="text-[11px] font-black uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {label} {mandatory && <span className="text-red-500">*</span>}
              </p>
              <p
                className="text-[9px] font-bold mt-1 uppercase tracking-widest leading-none truncate max-w-[260px] mx-auto"
                style={{ color: "var(--text-muted)" }}
              >
                {isDragging ? "Drop photo file here" : subtitle || "Click or drop photo here"}
              </p>
            </div>
          </>
        )}

        {/* Unfilled State - Image URL Tab */}
        {!value && activeTab === "url" && (
          <div
            className="relative z-10 w-full max-w-sm flex flex-col items-center gap-2 pt-3 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-[11px] font-black uppercase tracking-tight text-center"
              style={{ color: "var(--text-primary)" }}
            >
              {label} (Image URL) {mandatory && <span className="text-red-500">*</span>}
            </p>
            <div className="w-full flex items-center gap-2 mt-1">
              <div className="relative flex-1">
                <Globe
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (urlError) setUrlError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleApplyUrl(e);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:border-[#22c55e] transition-all"
                  style={{
                    borderColor: urlError ? "#ef4444" : "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3.5 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>Attach</span>
              </button>
            </div>
            {urlError ? (
              <p className="text-[10px] text-red-500 font-bold self-start pl-1">
                {urlError}
              </p>
            ) : (
              <p
                className="text-[9px] font-bold tracking-wide uppercase self-start pl-1 opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Paste direct web link to image (JPG, PNG, WEBP)
              </p>
            )}
          </div>
        )}

        {/* Filled State */}
        {value && (
          <>
            <div
              className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/20 overflow-hidden"
            >
              {isImage && downloadUrl ? (
                <img
                  src={downloadUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : icon === "shield" ? (
                <ShieldCheck size={24} />
              ) : icon === "camera" ? (
                <Camera size={24} />
              ) : (
                <FileText size={24} />
              )}
            </div>

            <div className="relative z-10 text-center">
              <p
                className="text-[11px] font-black uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {label} {mandatory && <span className="text-red-500">*</span>}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span
                  className="text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider text-emerald-700 bg-emerald-100"
                >
                  {typeof value === "string" ? "URL" : "FILE"}
                </span>
                <p
                  className="text-[9px] font-bold uppercase tracking-widest leading-none truncate max-w-[200px]"
                  style={{ color: "var(--text-muted)" }}
                  title={typeof value === "string" ? value : value.name}
                >
                  {typeof value === "string"
                    ? value.split("/").pop() || value
                    : value.name}
                </p>
              </div>
            </div>

            {/* Actions Overlay when filled */}
            {showActions ? (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={handleView}
                  className="p-1.5 border rounded-full transition-all shadow-sm hover:scale-110"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  title="Preview Photo"
                >
                  <Eye size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 border rounded-full transition-all shadow-sm hover:scale-110"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  title="Open / Download Photo"
                >
                  <Download size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 border rounded-full transition-all shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  title="Remove Photo"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 border rounded-full transition-all shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  title="Remove Photo"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Success Indicator */}
            <div className="absolute bottom-3 right-3 text-[#22c55e] animate-in zoom-in duration-300">
              <CheckCircle size={16} />
            </div>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
      </div>

      <FilePreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        file={value}
      />
    </>
  );
};

export default FileUploadSlot;
