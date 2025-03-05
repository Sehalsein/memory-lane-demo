import Link from 'next/link'
import { CopyToClipboard } from './CopyToClipboard'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ExternalLink } from 'lucide-react'
import { buttonVariants } from './ui/button'

type Props = {
  url: string
  onClose?: () => void
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
      <Link
        href={props.url}
        target='_blank'
        className={buttonVariants({ variant: 'outline', size: 'icon' })}
      >
        <ExternalLink />
      </Link>
      <CopyToClipboard content={props.url} onClick={props.onClose} />
    </div>
  )
}
