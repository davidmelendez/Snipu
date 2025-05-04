"use client";

import { Eye, Copy, MoreVertical, Globe } from "lucide-react";
import { useState, useRef, useEffect, JSX } from "react";
import { ProgrammingLanguage, Snippet } from "@/app/types";
import { getRelativeTime } from "@/lib/utils";

interface SnippetCardProps {
  snippet: Snippet;
  viewMode: "grid" | "list";
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  viewMode,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLanguageIcon = (language: ProgrammingLanguage) => {
    const languageIcons: Record<string, JSX.Element> = {
      JavaScript: (
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-black">
          JS
        </div>
      ),
      Python: (
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
          PY
        </div>
      ),
      CSS: (
        <div className="w-6 h-5 flex items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white">
          CSS
        </div>
      ),
      SQL: (
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
          SQL
        </div>
      ),
      TypeScript: (
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
          TS
        </div>
      ),
      HTML: (
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          HTML
        </div>
      ),
    };

    return languageIcons[language] || <Globe size={16} />;
  };

  // Dynamic classes based on view mode
  const cardClasses =
    viewMode === "grid"
      ? "bg-[#190B2D73] border border-[#6A6A6A] rounded-lg overflow-hidden hover:border-indigo-500 transition-colors"
      : "bg-[#190B2D73] border border-[#6A6A6A] rounded-lg overflow-hidden hover:border-indigo-500 transition-colors flex flex-row w-full mb-10";

  const contentClasses = viewMode === "grid" ? "p-4" : "p-4 flex-1 min-w-0"; // min-w-0 prevents flex items from overflowing

  const codePreviewClasses =
    viewMode === "grid"
      ? "bg-[#190B2D] rounded p-3 mb-4 overflow-hidden h-[76px]"
      : "bg-[#190B2D] rounded p-3 mb-4 overflow-hidden h-[76px] flex-1";

  const titleClasses =
    viewMode === "grid"
      ? "font-normal text-xl text-white mb-6"
      : "font-normal text-xl text-white mb-6 truncate"; // truncate for long titles in list view

  return (
    <div className={cardClasses}>
      <div className={contentClasses}>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-3">
            {viewMode === "list" && (
              <div className="flex items-center mr-4">
                <span className="bg-[#251A44] text-indigo-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  {getLanguageIcon(snippet.language)}
                  {snippet.language}
                </span>
              </div>
            )}
            {viewMode === "grid" && (
              <div className="flex items-center space-x-2">
                <span className="bg-[#251A44] text-indigo-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                  {snippet.language}
                  {getLanguageIcon(snippet.language)}
                </span>
              </div>
            )}

            <button
              className="text-gray-400 hover:text-white p-1 rounded-full"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <h3 className={titleClasses}>{snippet.title}</h3>

          <div className={codePreviewClasses}>
            <pre className="text-sm text-[#6A6A6A] whitespace-pre-wrap">
              <code>{snippet.code}</code>
            </pre>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-400 ml-1">
            <span>{getRelativeTime(snippet.createdAt)}</span>

            <div className="flex space-x-4 mr-1">
              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{snippet.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Copy size={16} />
                <span>{snippet.copies}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
