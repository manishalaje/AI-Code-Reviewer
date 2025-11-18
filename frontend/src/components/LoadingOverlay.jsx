// frontend/src/components/LoadingOverlay.jsx
import React from "react";
import { motion } from "framer-motion";

export default function LoadingOverlay() {
  const steps = ["Scanning structure...", "Checking best practices...", "Assessing security patterns..."];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-auto w-full h-full bg-black/60 flex items-center justify-center">
        <div className="bg-[#00101a] border border-cyan-600/20 rounded-2xl p-8 w-[520px] text-center shadow-xl">
          <div className="text-cyan-300 text-2xl font-semibold mb-3">Analyzing your code…</div>
          <div className="text-sm text-gray-300 mb-6">This uses an external AI model — results may take a few seconds.</div>

          <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ x: "-100%" }} animate={{ x: "120%" }} transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-cyan-400/70 to-cyan-400/40"></motion.div>
          </div>

          <div className="mt-4 text-xs text-gray-400 space-y-1">
            {steps.map((s, i) => <div key={i} className={`text-xs ${i===0 ? "text-cyan-200" : "text-gray-400"}`}>{s}</div>)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
