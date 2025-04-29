"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addComment,
  getSnippetComments,
  deleteComment,
  updateComment,
} from "@/actions/comments";
import { useUser } from "@/hooks/useUser"; // Assuming you have a user hook
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
  authorId: string;
}

interface CommentSectionProps {
  snippetId: number;
}

// Add this type for backend comments
// createdAt and updatedAt can be string or Date

type BackendComment = Omit<Comment, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function CommentSection({ snippetId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useUser();

  const loadComments = useCallback(async () => {
    const result = await getSnippetComments(snippetId);
    if (result.success) {
      const comments = (result.data ?? []).map((comment: BackendComment) => ({
        ...comment,
        createdAt:
          comment.createdAt instanceof Date
            ? comment.createdAt.toISOString()
            : comment.createdAt,
        updatedAt:
          comment.updatedAt instanceof Date
            ? comment.updatedAt.toISOString()
            : comment.updatedAt,
      }));
      setComments(comments);
    }
  }, [snippetId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    const result = await addComment(snippetId, newComment, user.id);
    if (result.success) {
      setNewComment("");
      await loadComments();
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return;

    const result = await deleteComment(commentId, user.id);
    if (result.success) {
      await loadComments();
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!user || !editContent.trim()) return;

    const result = await updateComment(commentId, editContent, user.id);
    if (result.success) {
      setEditingComment(null);
      setEditContent("");
      await loadComments();
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-semibold">Comments</h3>

      {/* Add Comment Form */}
      {user && (
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full"
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
            {editingComment === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full"
                />
                <div className="space-x-2">
                  <Button onClick={() => handleUpdateComment(comment.id)}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.author.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                  {user && user.id === comment.authorId && (
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
