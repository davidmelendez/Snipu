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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 bg-fixed">
      <div className="max-w-4xl mx-auto p-8 animate-fade-in">
        <div className="bg-slate-800/30 p-8 rounded-xl backdrop-blur-sm border border-slate-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-6">
            Create New Snippet
          </h1>
          
          <form action={val} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-blue-200 text-sm font-medium">Title</Label>
              <Input 
                type="text" 
                name='title' 
                id='title'
                className="bg-slate-800/50 border-slate-700 text-blue-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-blue-200 text-sm font-medium">Code</Label>
              <Textarea  
                name='code' 
                id='code'
                className="min-h-[200px] bg-slate-800/50 border-slate-700 text-blue-100 font-mono placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            
            {formStateData.message && (
              <div className='p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 mt-4'>
                {formStateData.message}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <Button 
                type='submit'
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Create Snippet
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="border border-slate-700 text-blue-300 hover:bg-blue-500/10 hover:text-blue-100 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateSnippetPage