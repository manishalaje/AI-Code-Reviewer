// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import FeedbackDisplay from "./components/FeedbackDisplay";
import LoadingOverlay from "./components/LoadingOverlay";
import Toast from "./components/Toast";
import "./index.css";

export default function App() {
  const [feedback, setFeedback] = useState(null);          // markdown string
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("cyan"); // "cyan" or "purple"

  // simple toast helper
  const showToast = (msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // theme apply
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-hero">
      {/* animated particles background is in index.css */}
      <div className="min-h-screen flex flex-col items-center p-8">
        <header className="w-full max-w-5xl flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-cyan-300 drop-shadow-lg select-none">
            ⚡ AI Code Review Assistant
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTheme((t) => (t === "cyan" ? "purple" : "cyan"));
                showToast("Theme switched", "info");
              }}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-white/80 hover:bg-white/10 transition"
            >
              Toggle theme
            </button>
          </div>
        </header>

        <main className="w-full max-w-5xl">
          {!feedback ? (
            <UploadForm
              setLoading={setLoading}
              onUploadResult={(md) => setFeedback(md)}
              showToast={showToast}
            />
          ) : (
            <FeedbackDisplay
              feedback={feedback}
              onBack={() => setFeedback(null)}
              showToast={showToast}
            />
          )}
        </main>

        {/* Footer centered at bottom */}
        <footer className="mt-12 w-full flex justify-center">
          <a
            href="https://www.linkedin.com/in/manish-a-m/"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-300 font-medium px-4 py-2 rounded-lg backdrop-blur-md bg-cyan-700/10 border border-cyan-500/30 shadow-lg hover:bg-cyan-800/20 hover:text-white transition"
          >
            Built by Manish A M
          </a>
        </footer>
      </div>

      {loading && <LoadingOverlay />}

      {toast && <Toast message={toast.msg} type={toast.type} key={toast.id} />}
    </div>
  );
}
