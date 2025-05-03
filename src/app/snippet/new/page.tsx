"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Code2,
  Share2,
  Copy,
  Edit,
  Globe,
  Lock,
  Check,
  Bookmark,
  BookmarkX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const CreateSnippetPage = () => {
  const [language, setLanguage] = useState("JavaScript + CSS");
  const [visibility, setVisibility] = useState("Secret/Public");
  const [framework, setFramework] = useState("React");
  const [description, setDescription] = useState("");
  const [code, setCode] =
    useState(`<button class="btn" onclick="this.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16)">Click</button>

<style>
.btn {
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  background: #5141A4;
  color: white;
  border-radius: 5px;
  transition: background 0.3s;
}
</style>`);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [initialDescription, setInitialDescription] = useState("");
  const [initialCode, setInitialCode] = useState(code);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if there are unsaved changes to enable the save button
  useEffect(() => {
    const hasDescriptionChanged = description !== initialDescription;
    const hasCodeChanged = code !== initialCode;

    setIsSaveEnabled(isEditing || hasDescriptionChanged || hasCodeChanged);
  }, [isEditing, description, code, initialDescription, initialCode]);

  // Function to save changes and exit edit mode
  const handleSave = async () => {
    try {
      // Make API request to save snippet
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: description || "Untitled Snippet",
          code: code,
          language: language,
          authorId: "user123", // Hardcoded for now
          tags: framework,
          isBookmarked: isBookmarked, // Add this line
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save snippet");
      }

      const savedSnippet = await response.json();
      console.log("Saving snippet with the details:", savedSnippet);

      // Save the current values as the new initial values
      setInitialDescription(description);
      setInitialCode(code);

      if (isEditing) {
        setIsEditing(false);
      }

      // Show save success indicator
      setShowSaveSuccess(true);

      // Hide success indicator after 3 seconds
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);

      // Disable save button as changes are now saved
      setIsSaveEnabled(false);

      // Show success toast
      toast({
        title: "Success!",
        description: "Snippet saved successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error saving snippet:", error);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to save snippet",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  // Function to copy code to clipboard with visual feedback
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
      duration: 2000,
    });
  };

  // Add this with your other functions
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked
        ? "Snippet removed from your bookmarks"
        : "Snippet saved to your bookmarks",
      duration: 2000,
    });
  };
  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto">
        {/* Main container with visible border */}
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333333]">
          {/* Header with controls */}
          <div className="flex items-center gap-2 p-3 border-b border-[#333333]">
            <Input
              placeholder="Enter Description here..."
              className="bg-[#121212] border-[#333333] text-gray-300 h-10 text-sm placeholder:italic placeholder:text-gray-500 rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#121212] border-[#333333] text-gray-300 h-10 flex items-center gap-1 hover:bg-[#1A1A1A] hover:text-white transition-colors rounded-lg"
                >
                  {visibility === "Secret/Public" ? (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>/</span>
                      <Globe className="h-4 w-4" />
                    </>
                  ) : visibility === "Secret" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  <span>{visibility}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A1A1A] border-[#333333] text-gray-300 rounded-lg">
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setVisibility("Secret")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Secret
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setVisibility("Public")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Public
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#121212] border-[#333333] text-gray-300 h-10 flex items-center gap-1 hover:bg-[#1A1A1A] hover:text-white transition-colors rounded-lg"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                    R
                  </div>
                  <span className="mx-1">{framework}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A1A1A] border-[#333333] text-gray-300 rounded-lg">
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setFramework("React")}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white mr-2">
                    R
                  </div>
                  React
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setFramework("Vue")}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-xs text-white mr-2">
                    V
                  </div>
                  Vue
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setFramework("Angular")}
                >
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white mr-2">
                    A
                  </div>
                  Angular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#121212] border-[#333333] text-gray-300 h-10 flex items-center gap-1 hover:bg-[#1A1A1A] hover:text-white transition-colors rounded-lg"
                >
                  <span>{language}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A1A1A] border-[#333333] text-gray-300 rounded-lg">
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setLanguage("JavaScript + CSS")}
                >
                  JavaScript + CSS
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setLanguage("TypeScript")}
                >
                  TypeScript
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setLanguage("HTML")}
                >
                  HTML
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#252525] hover:text-white focus:bg-[#252525] focus:text-white"
                  onClick={() => setLanguage("Python")}
                >
                  Python
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="bg-[#121212] border-[#333333] text-gray-300 h-10 flex items-center gap-1 hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 hover:scale-105 rounded-lg shadow-sm"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share/Export
            </Button>

            <Button
              className={`${
                showSaveSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#8B5CF6] hover:bg-[#7C3AED]"
              } text-white h-10 ml-auto transition-all duration-200 hover:scale-105 rounded-lg shadow-md flex items-center gap-2`}
              onClick={handleSave}
              disabled={!isSaveEnabled}
            >
              {showSaveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>

          {/* Code snippet area */}
          <div className="p-6 bg-[#1A1A1A]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-300 font-medium flex items-center text-base">
                <Code2 className="h-5 w-5 mr-2" />
                Code Snippet
              </h2>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-transparent transition-colors flex items-center"
                  onClick={handleCopyCode}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  <span>Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-transparent transition-colors flex items-center"
                  onClick={handleToggleBookmark}
                  title="Bookmark this Snippet"
                >
                  {isBookmarked ? (
                    <>
                      <Bookmark className="h-4 w-4 mr-2 fill-current" />
                      <span>Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <BookmarkX className="h-4 w-4 mr-2" />
                      <span>Bookmark</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-transparent transition-colors flex items-center"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </Button>
              </div>
            </div>

            <div className="bg-[#121212] rounded-lg p-5 font-mono text-sm">
              {isEditing ? (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[300px] bg-transparent border-0 text-green-400 font-mono resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                  style={{
                    whiteSpace: "pre",
                    color: "inherit",
                    lineHeight: 1.5,
                  }}
                  placeholder="// Write your code here..."
                />
              ) : (
                <pre className="text-left whitespace-pre overflow-x-auto">
                  <code>
                    {code.split("\n").map((line, index) => {
                      // Handle comments (ensure they are in English)
                      if (line.trim().startsWith("//")) {
                        return (
                          <div key={index}>
                            <span className="text-gray-500">{line}</span>
                          </div>
                        );
                      }

                      // Process HTML tags, CSS, and other code
                      if (line.includes("<button")) {
                        return (
                          <div key={index}>
                            <span className="text-red-400">{"<"}</span>
                            <span className="text-orange-400">button </span>
                            <span className="text-yellow-400">class</span>
                            <span className="text-white">{"="}</span>
                            <span className="text-green-400">{'"btn"'} </span>
                            <span className="text-yellow-400">onclick</span>
                            <span className="text-white">{"="}</span>
                            <span className="text-green-400">
                              {
                                "\"this.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16)\""
                              }
                            </span>
                            <span className="text-red-400">{">"}</span>
                            <span className="text-white">Click</span>
                            <span className="text-red-400">{"</"}</span>
                            <span className="text-orange-400">button</span>
                            <span className="text-red-400">{">"}</span>
                          </div>
                        );
                      }

                      if (line.includes("<style>")) {
                        return (
                          <div key={index}>
                            <span className="text-red-400">{"<"}</span>
                            <span className="text-orange-400">style</span>
                            <span className="text-red-400">{">"}</span>
                          </div>
                        );
                      }

                      if (line.includes(".btn {")) {
                        return (
                          <div key={index}>
                            <span className="text-yellow-400">{".btn"} </span>
                            <span className="text-white">{"{"}</span>
                          </div>
                        );
                      }

                      // CSS properties - fix for additional semicolon issue
                      if (
                        line.trim().startsWith("padding:") ||
                        line.trim().startsWith("font-size:") ||
                        line.trim().startsWith("border:") ||
                        line.trim().startsWith("cursor:") ||
                        line.trim().startsWith("background:") ||
                        line.trim().startsWith("color:") ||
                        line.trim().startsWith("border-radius:") ||
                        line.trim().startsWith("transition:")
                      ) {
                        const [property, value] = line.trim().split(":");
                        // Check if value already has a semicolon to prevent duplicates
                        const valueWithoutSemicolon = value.trim().endsWith(";")
                          ? value.trim().slice(0, -1)
                          : value.trim();

                        return (
                          <div key={index}>
                            <span className="text-green-400">
                              {`  ${property}:`}{" "}
                            </span>
                            <span className="text-orange-400">
                              {valueWithoutSemicolon}
                            </span>
                            <span className="text-white">;</span>
                          </div>
                        );
                      }

                      if (line.trim() === "}") {
                        return (
                          <div key={index}>
                            <span className="text-white">{"}"}</span>
                          </div>
                        );
                      }

                      if (line.includes("</style>")) {
                        return (
                          <div key={index}>
                            <span className="text-red-400">{"</"}</span>
                            <span className="text-orange-400">style</span>
                            <span className="text-red-400">{">"}</span>
                          </div>
                        );
                      }

                      // Default for any other lines
                      return <div key={index}>{line}</div>;
                    })}
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSnippetPage;
