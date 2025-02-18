"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useActionState } from 'react'
import * as actions from '@/actions'

const CreateSnippetPage = () => {

  const [formStateData, val] = useActionState(actions.createSnippet, {message: ''});



  return (
    <form action={val}>
        <div>
            <Label>Title</Label>
            <Input type="text" name='title' id='title'/>
        </div>
        <div>
            <Label>Code</Label>
            <Textarea  name='code' id='code'/>
        </div>
        {formStateData.message &&
        <div className='p-2 bg-red-200 border-2 border-red-600 mt-2'>{formStateData.message}</div>}
        <Button type='submit' className='my-4'>Create</Button>
    </form>
  )
}

export default CreateSnippetPage