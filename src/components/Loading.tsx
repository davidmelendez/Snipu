import React from "react";
import { Loader2 } from "lucide-react";
function Loading() {
  return (
    <div className="bg-[#190B2D73] border border-[#6A6A6A] rounded-lg overflow-hidden hover:border-indigo-500 transition-colors w-[1200px] h-[508px] flex-col items-center justify-items-center">
      <div className="bg-[#251A44] rounded-full w-[143px] h-[143] mt-14 flex items-center justify-center">
        <Loader2 className="animate-spin w-[100px] h-[100px] flex items-center justify-center text-white" />
      </div>
      <div className="text-center mb-12"></div>{" "}
    </div>
  );
}

export default Loading;
