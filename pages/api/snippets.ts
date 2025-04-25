import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      title,
      code,
      language,
      authorId,
      tags,
    }: {
      title: string;
      code: string;
      language: string;
      authorId: string;
      tags: string;
    } = req.body;

    // Validation
    if (typeof title !== "string" || title.length < 2) {
      return res
        .status(400)
        .json({ message: "Title is required and must be longer" });
    }

    if (typeof code !== "string" || code.length < 8) {
      return res
        .status(400)
        .json({ message: "Code is required and must be longer" });
    }

    try {
      const snippet = await prisma.snippet.create({
        data: {
          title,
          code,
          language,
          authorId,
          tags,
        },
      });

      res.status(201).json(snippet); // Successfully created
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
