"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const saveSnippet = async (id: number, code: string) => {
  await prisma.snippet.update({
    where: {
      id,
    },
    data: {
      code,
    },
  });

  revalidatePath(`/snippet/${id}`);
  redirect(`/snippet/${id}`);
};

export const deleteSnippet = async (id: number) => {
  await prisma.snippet.delete({
    where: { id },
  });
  revalidatePath("/");
  redirect("/");
};

export async function createSnippet(
  prevState: { message: string },
  formData: FormData
) {
  try {
    const title = formData.get("title");
    const code = formData.get("code");
    const language = formData.get("language");
    const authorId = formData.get("authorId");
    const tags = formData.get("tags");

    // Validation
    if (typeof title !== "string" || title.length < 2) {
      return { message: "Title is required and must be longer" };
    }

    if (typeof code !== "string" || code.length < 8) {
      return { message: "Code is required and must be longer" };
    }

    // Send data to the backend API to create the snippet
    const response = await fetch("/pages/api/snippets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        code,
        language,
        authorId,
        tags,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { message: data.message || "Something went wrong" };
    }

    // Revalidate path and redirect if successful
    revalidatePath("/");
    redirect("/");
  } catch (error: unknown) {
    // Directly return message if error instance matches
    if (error instanceof Error) {
      return { message: error.message };
    }

    // Return fallback message for other errors
    return { message: "Something went wrong" };
  }
}
