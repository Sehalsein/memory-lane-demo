import { CopyToClipboard } from './CopyToClipboard'
import { Input } from './ui/input'
import { Label } from './ui/label'

type Props = {
  url: string
}

export default function ShareLink(props: Props) {
  return (
    <div className='flex items-center space-x-2 pt-4'>
      <div className='grid flex-1 gap-2'>
        <Label htmlFor='link' className='sr-only'>
          Link
        </Label>
        <Input id='link' defaultValue={props.url} readOnly className='h-9' />
      </div>
      <CopyToClipboard content={props.url} />
    </div>
  )
}
