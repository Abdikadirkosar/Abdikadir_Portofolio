import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Image, Video, FileText, Trash2, Copy, Upload, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { supabase, uploadFile, deleteFileByUrl, isSupabaseEnabled } from "../../../lib/supabase";

const BUCKET = "portfolio-media";

function getFileType(name = "") {
  const ext = name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "mov", "webm", "avi"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
}

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MediaTab = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMedia = useCallback(async () => {
    if (!isSupabaseEnabled) { setLoading(false); return; }
    setLoading(true);

    try {
      // List all folders in the bucket
      const folders = ["projects", "blogs", "certificates", "profiles", "testimonials", "media"];
      const allFiles = [];

      for (const folder of folders) {
        const { data, error } = await supabase.storage.from(BUCKET).list(folder, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
        if (!error && data) {
          data.forEach(file => {
            if (file.name === ".emptyFolderPlaceholder") return;
            const path = `${folder}/${file.name}`;
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
            allFiles.push({
              id: path,
              name: file.name,
              folder,
              type: getFileType(file.name),
              size: formatBytes(file.metadata?.size),
              url: urlData.publicUrl,
              created_at: file.created_at,
            });
          });
        }
      }

      setMediaList(allFiles);
    } catch (err) {
      toast.error("Could not load media: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files, folder = "media") => {
    if (!files || files.length === 0) return;
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`);
    let uploaded = 0;

    for (const file of files) {
      try {
        await uploadFile(file, folder);
        uploaded++;
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    toast.update(toastId, {
      render: `${uploaded} file(s) uploaded successfully!`,
      type: "success", isLoading: false, autoClose: 3000,
    });
    fetchMedia();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    const toastId = toast.loading("Deleting...");
    try {
      await deleteFileByUrl(item.url);
      setMediaList(prev => prev.filter(m => m.id !== item.id));
      toast.update(toastId, { render: "File deleted!", type: "success", isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(toastId, { render: `Delete failed: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  // Drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleUpload(files, "media");
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.folder.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (!isSupabaseEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-5xl">🔌</div>
        <p className="text-white/40 text-sm font-mono text-center max-w-xs">
          Supabase isn't configured. Add your credentials to <span className="text-[#4FFFB0]">.env</span> to use media storage.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Media Library</h1>
          <p className="text-white/40 text-xs mt-0.5">
            Supabase Storage — <span className="text-[#4FFFB0]">{mediaList.length}</span> files across all folders
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input 
              type="text" 
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-xs pl-8 pr-4 py-2 outline-none focus:border-[#4FFFB0]/30 w-44"
            />
          </div>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-xs px-3 py-2 outline-none"
          >
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
          </select>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border border-[#4FFFB0]/25 text-[#4FFFB0] bg-[#4FFFB0]/5 hover:bg-[#4FFFB0]/10 transition-colors cursor-pointer">
            <Upload size={12} /> Upload
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(Array.from(e.target.files), "media")} />
          </label>

          <button onClick={fetchMedia} className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs transition-colors p-2 rounded-lg border border-white/[0.06] hover:border-white/10">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed py-6 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer ${
          dragOver
            ? "border-[#4FFFB0]/60 bg-[#4FFFB0]/5"
            : "border-white/[0.08] hover:border-white/20"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={20} className={dragOver ? "text-[#4FFFB0]" : "text-white/20"} />
        <p className="text-white/30 text-xs font-mono">
          {dragOver ? "Drop files here!" : "Drag & drop files or click to upload"}
        </p>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] animate-spin" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-xs font-mono">
          {mediaList.length === 0 ? "No files in storage yet. Upload something!" : "No files match your criteria."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMedia.map(item => (
            <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden flex flex-col group hover:border-white/[0.12] transition-all">
              {/* Preview */}
              <div className="aspect-video bg-neutral-900 border-b border-white/[0.04] relative flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : item.type === "video" ? (
                  <Video className="text-white/20" size={32} />
                ) : item.type === "pdf" ? (
                  <FileText className="text-white/20" size={32} />
                ) : (
                  <Image className="text-white/20" size={32} />
                )}
                <div className="absolute top-1.5 right-1.5">
                  <span className="bg-black/60 text-white/60 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-3">
                <p className="text-white text-xs font-bold truncate">{item.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-white/30 font-mono">{item.folder}/</span>
                  <span className="text-[10px] text-white/30 font-mono">{item.size}</span>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end gap-1.5 border-t border-white/[0.04] pt-2 mt-3">
                  <button onClick={() => copyLink(item.url)} className="w-6 h-6 flex items-center justify-center rounded bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer" title="Copy URL">
                    <Copy size={10} />
                  </button>
                  <button onClick={() => handleDelete(item)} className="w-6 h-6 flex items-center justify-center rounded bg-red-500/5 border border-red-500/10 text-red-400/60 hover:text-red-400 transition-colors cursor-pointer" title="Delete">
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaTab;
