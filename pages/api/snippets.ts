import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const language = req.query.language as string;
      const tags = req.query.tags as string;

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build filter conditions
      const where: any = {};
      if (language) {
        where.language = language;
      }
      if (tags) {
        where.tags = {
          contains: tags,
        };
      }

      // Get total count for pagination
      const total = await prisma.snippet.count({ where });

      // Get paginated and filtered snippets
      const snippets = await prisma.snippet.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({
        snippets,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  } else if (req.method === "POST") {
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
