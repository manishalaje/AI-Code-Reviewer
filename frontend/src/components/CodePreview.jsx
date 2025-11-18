// frontend/src/components/CodePreview.jsx
import React from "react";

export default function CodePreview({ code }) {
  return (
    <pre className="whitespace-pre-wrap text-xs leading-snug font-mono">
      {code}
    </pre>
  );
}
