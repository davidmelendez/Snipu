import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'


const CreateSnippetPage = () => {
  return (
    <form>
        <div>
            <Label>Title</Label>
            <Input type="text" name='title' id='title'/>
        </div>
        <div>
            <Label>Code</Label>
            <Textarea  name='code' id='code'/>
        </div>
        <Button type='submit' className='my-4'>Create</Button>
    </form>
  )
}

export default CreateSnippetPage