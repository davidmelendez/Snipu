import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { deleteSnippet } from "@/actions";

type SnippetDetailsProps = {
  params: Promise<{id: string}>;
}


const SnippetDetailPage : React.FC<SnippetDetailsProps> = async ({
  params}) => {
  const id = parseInt((await params).id);

  const snippet = await prisma.snippet.findUnique({
    where: {
      id
    },
  });

  if(!snippet) {
    return <h1>Snippet not found</h1>
  }

  const deleteSnippetActions = deleteSnippet.bind(null, snippet.id);



  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl">{snippet.title}</h1>
        <div className="flex items-center gap-2">
        <Link href={`/snippet/${snippet.id}/edit`}><Button>Edit</Button></Link>
        
        <form action={deleteSnippetActions}>
        <Button variant={"destructive"} type="submit">Delete</Button>
        </form>
        
        </div>
      </div>
      
      <pre className="p-3 bg-gray-300 rounded border-gray-300">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
};

export default SnippetDetailPage;
