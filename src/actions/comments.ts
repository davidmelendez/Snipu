"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addComment(
  snippetId: number,
  content: string,
  authorId: string
) {
  try {
    // Validate inputs
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        snippetId,
        authorId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    revalidatePath(`/snippets/${snippetId}`);
    return { success: true, data: comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function getSnippetComments(snippetId: number) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        snippetId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, error: "Failed to fetch comments" };
  }
}

export async function deleteComment(commentId: number, authorId: string) {
  try {
    // Verify comment ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== authorId) {
      throw new Error("Unauthorized to delete this comment");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/snippets/${comment.snippetId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

export async function updateComment(
  commentId: number,
  content: string,
  authorId: string
) {
  try {
    // Validate input
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    // Verify comment ownership
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.authorId !== authorId) {
      throw new Error("Unauthorized to update this comment");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    revalidatePath(`/snippets/${existingComment.snippetId}`);
    return { success: true, data: updatedComment };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { success: false, error: "Failed to update comment" };
  }
}
