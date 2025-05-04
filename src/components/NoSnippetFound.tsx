import React from "react";
import { CodeXml } from "lucide-react";
function NoSnippetFound() {
  return (
    <div className="bg-[#190B2D73] border border-[#6A6A6A] rounded-lg overflow-hidden hover:border-indigo-500 transition-colors w-[1200px] h-[508px] flex-col items-center justify-items-center">
      <div className="bg-[#251A44] rounded-full w-[143px] h-[143] mt-14 flex items-center justify-center">
        <CodeXml className="w-[100px] h-[100px] flex items-center justify-center text-white" />
      </div>
      <div className="text-center mb-12">
        <h1 className="text-2xl font-extrabold text-white mt-16">
          No snippets found, create your first one{" "}
        </h1>
        <p className="mt-4 text-lg text-[#BABABA]">
          Start building your collection of code snippets. Create, <br />{" "}
          organize, and share your code efficiently.
        </p>
      </div>{" "}
    </div>
  );
}

export default NoSnippetFound;
