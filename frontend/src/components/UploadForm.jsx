// frontend/src/components/UploadForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, FilePlus } from "lucide-react";
import CodePreview from "./CodePreview";

/**
Props:
- setLoading(fn)
- onUploadResult(mdString)
- showToast(msg, type)
*/
export default function UploadForm({ setLoading, onUploadResult, showToast }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState(null); // code text
  const fileRef = useRef();

  useEffect(() => {
    const raw = localStorage.getItem("uploadHistory");
    if (raw) setHistory(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (file) {
      // read first ~2000 characters for preview (avoid huge files)
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "");
        const smallPreview = text.split("\n").slice(0, 80).join("\n");
        setPreview(smallPreview);
      };
      reader.readAsText(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const onFileSelect = (f) => {
    setError("");
    if (!f) return;
    const allowed = [".py", ".js", ".ts", ".jsx", ".java", ".cpp", ".c", ".cs"];
    const ext = "." + f.name.split(".").pop();
    if (!allowed.includes(ext.toLowerCase())) {
      setError("Unsupported file type. Supported: py, js, ts, java, cpp, c, cs");
      showToast("Unsupported file type", "error");
      return;
    }
    setFile(f);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    onFileSelect(f);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a file first.");
      showToast("Pick a file to upload", "error");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file);

      const resp = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: form,
      });

      const data = await resp.json();

      if (!resp.ok) {
        const detail = data.detail || data.error || "Server error";
        throw new Error(detail);
      }

      const md = data.feedback || data.review || data.results || JSON.stringify(data);
      onUploadResult(md);

      // save to history
      const item = { name: file.name, at: new Date().toISOString() };
      const newHist = [item, ...history].slice(0, 10);
      setHistory(newHist);
      localStorage.setItem("uploadHistory", JSON.stringify(newHist));
      showToast("Review generated", "success");
    } catch (err) {
      console.error(err);
      setError(String(err.message || err));
      showToast(String(err.message || "Upload failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    showToast("Fetching file from repo not supported—upload again", "info");
    // placeholder: could fetch file via GitHub integration later
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      className="w-full max-w-4xl p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 border border-cyan-500/10 shadow-xl backdrop-blur"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-cyan-300">Upload Code for AI Review</h3>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <FilePlus className="w-4 h-4" />
          <span>History</span>
        </div>
      </div>

      <div
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={(e) => { if (e.target.tagName !== "INPUT") fileRef.current?.click(); }}
        className={`relative p-6 rounded-xl border-2 transition select-none cursor-pointer
          ${dragActive ? "border-cyan-400 bg-cyan-400/6" : "border-cyan-600/5 bg-gray-900/20"}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.cs"
          onChange={(e) => onFileSelect(e.target.files?.[0])}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <UploadCloud className="w-10 h-10 text-cyan-300" />
              <div>
                {file ? (
                  <>
                    <div className="text-cyan-200 font-medium">{file.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{(file.size/1024).toFixed(1)} KB</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-300">Drag & drop your code file here, or <span className="text-cyan-300 underline">browse</span></div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">Allowed: .py .js .ts .java .cpp .c .cs — max size set by backend</div>
          </div>

          <div className="w-[340px]">
            <div className="bg-gray-900/40 border border-cyan-500/10 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">Preview (first 80 lines)</div>
              <div className="h-40 overflow-auto rounded-md bg-[#020617] p-3 text-sm text-cyan-100 font-mono">
                {preview ? <CodePreview code={preview} /> : <div className="text-gray-500">No file selected</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-400 mt-3">{error}</div>}

      <div className="mt-5 flex gap-3 items-center">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Submit for Review
        </button>

        <button
          type="button"
          onClick={() => { setFile(null); setPreview(null); setError(""); }}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/7 text-sm text-white/80"
        >
          Clear
        </button>

        <div className="ml-auto text-xs text-gray-400">Uploads saved in local history (client-side)</div>
      </div>

      {/* History list */}
      {history.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {history.map((h, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-900/30 border border-cyan-500/5 flex items-center justify-between">
              <div>
                <div className="text-sm text-cyan-200 font-medium">{h.name}</div>
                <div className="text-xs text-gray-400">{new Date(h.at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => loadFromHistory(h)} className="text-sm text-gray-300 px-3 py-1 rounded bg-white/5">Load</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.form>
  );
}
