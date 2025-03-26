import { useState } from "react";
import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const REFRESH_TIME = 4000; // 5 seconds

const CustomClipboard = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), REFRESH_TIME);
  };

  return (
    <div
      role="button"
      className={`relative w-full flex justify-between p-3 rounded-lg shadow ${
        copied ? "bg-s2" : "bg-s1"
      }`}
      onClick={handleCopy}
    >
      <span className={`text-sm ${copied ? "text-s4" : "text-s6"} truncate overflow-hidden max-w-[80%]`}>{textToCopy}</span>

      {copied ? (
        <ClipboardDocumentCheckIcon className="size-5 text-green-600" />
      ) : (
        <ClipboardDocumentListIcon className="size-5 text-s7" />
      )}
    </div>
  );
};

export default CustomClipboard;
