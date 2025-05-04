import { Search } from "lucide-react";
import Image from "next/image";
import Funnel from "../../public/Funnel.svg";
import Grid from "../../public/Grid.svg";
import Menu from "../../public/Menu.svg";

interface SearchAndFilterSectionProps {
  searchQuery: string;
  languageFilter: string;
  viewMode: "grid" | "list";
  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onViewModeToggle: () => void;
}

export function SearchAndFilterSection({
  searchQuery,
  languageFilter,
  viewMode,
  onSearchChange,
  onLanguageChange,
  onViewModeToggle,
}: SearchAndFilterSectionProps) {
  return (
    <div className="flex gap-2 relative w-full max-w-sm justify-between flex-wrap md:flex-nowrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A6A] w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Snippets..."
          className="rounded-[8px] pl-10 pr-4 py-2 bg-[#251A44] h-10 border border-[#6A6A6A] text-[#6A6A6A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:border-indigo-500"
        />
      </div>
      <div className="relative">
        <Image
          src={Funnel}
          alt="Funnel Icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
        />
        <input
          type="text"
          onChange={(e) => onLanguageChange(e.target.value)}
          value={languageFilter}
          placeholder="Filter"
          className="rounded-[8px] pl-10 pr-4 py-2 bg-[#251A44] h-10 border border-[#6A6A6A] text-[#6A6A6A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 w-32  hover:border-indigo-500"
        />
      </div>
      <div className="relative">
        <button
          onClick={onViewModeToggle}
          className="rounded-[8px] pl-10 pr-2 py-2 bg-[#251A44] h-10 border border-[#6A6A6A] text-[#6A6A6A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:border-indigo-500"
        >
          <Image
            src={viewMode === "grid" ? Grid : Menu}
            alt="Funnel Icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
}
