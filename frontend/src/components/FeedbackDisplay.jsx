// frontend/src/components/FeedbackDisplay.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";

export default function FeedbackDisplay({ feedback, onBack, showToast }) {
  const [expanded, setExpanded] = useState(true);

  // Try to parse feedback into sections heuristically (if markdown has headings)
  // If not, show whole feedback.
  const sections = [];
  try {
    const parts = String(feedback).split(/\n## |\n### /).filter(Boolean);
    if (parts.length > 1) {
      for (const p of parts) {
        const lines = p.split("\n");
        const title = lines[0].trim();
        const body = lines.slice(1).join("\n").trim();
        sections.push({ title, body });
      }
    }
  } catch {
    // fallback: single block
  }
  if (sections.length === 0) sections.push({ title: "Review", body: feedback });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast?.("Copied to clipboard", "success");
    } catch (e) {
      showToast?.("Copy failed", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-cyan-500/10 shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-semibold text-cyan-300">🧠 AI Code Review Report</h2>
          <div className="text-xs text-gray-400 mt-1">Readable suggestions, issues, and score</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => { setExpanded((v) => !v); }} className="px-3 py-1 bg-white/5 rounded text-sm text-white/80">
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button onClick={onBack} className="px-3 py-1 bg-white/5 rounded text-sm text-white/80">Back</button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="p-4 rounded-lg bg-[#041021] border border-cyan-500/6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-cyan-200 font-semibold">{s.title}</div>
                <div className="text-xs text-gray-400">{/* optional subtitle */}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(s.body)}
                  className="px-2 py-1 rounded bg-white/5 text-sm text-white/80 hover:bg-white/8"
                >
                  <Copy className="w-4 h-4 inline" /> Copy
                </button>
                <button onClick={() => {
                  const el = document.getElementById(`section-${i}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }} className="px-2 py-1 rounded bg-white/5 text-sm text-white/80 hover:bg-white/8">
                  View
                </button>
              </div>
            </div>

            {expanded && (
              <div id={`section-${i}`} className="mt-3 prose prose-invert max-w-none text-cyan-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.body}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
