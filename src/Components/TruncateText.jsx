import { useState } from "react";

export const TruncateText = ({ text, limit = 100 }) => {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return (
      <p className="text-sm text-gray-800 break-words whitespace-pre-line">
        {text}
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-800 break-words whitespace-pre-line">
      {expanded ? text : `${text.slice(0, limit)}... `}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-500 hover:underline text-xs"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </p>
  );
};
