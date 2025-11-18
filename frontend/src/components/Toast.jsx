// frontend/src/components/Toast.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Toast({ message = "", type = "info" }) {
  const color = type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : "bg-cyan-600";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`fixed bottom-8 right-8 z-50 ${color} text-white px-4 py-2 rounded-lg shadow-lg`}>
      {message}
    </motion.div>
  );
}
