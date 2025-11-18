import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

export default function ReviewReport({ feedback, onBack }) {
  if (!feedback) {
    return (
      <div className="mt-6 p-6 bg-red-900/40 text-red-300 rounded-xl shadow text-center text-lg">
        ❌ No feedback available.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10 w-full max-w-4xl bg-gray-900/70 backdrop-blur-xl text-white p-10 rounded-2xl shadow-2xl border border-blue-500/40"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-400 transition text-lg"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Header */}
      <h2 className="text-4xl font-bold text-blue-400 mb-6">
        🚀 AI Code Review Report
      </h2>

      {/* Markdown Box */}
      <div className="prose prose-invert max-w-none leading-relaxed text-blue-100">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {feedback}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
