import React from 'react';
import { prisma } from '@/lib/prisma';
import EditSnippetForm from "@/components/EditSnippetForm";


const EditPageSnippet = async({
  params,
} : {
  params: Promise<{id: string}>;
}) => {
  const id = parseInt((await params).id);
  const snippet = await prisma.snippet.findUnique({
    where: {
      id,
    },
  })

  if(!snippet) {
    return (
      <div>
        <h1>Snippet not found</h1>
      </div>
    )
  }

  return (
    <EditSnippetForm snippet = {snippet}/>
  )
}

export default EditPageSnippet;