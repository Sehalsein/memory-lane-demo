'use client'

import { Copy } from 'lucide-react'

import { Button } from './ui/button'
import { toast } from 'sonner'

export type Props = Omit<React.ComponentProps<typeof Button>, 'children'> & {
  content: string
}

export function CopyToClipboard({ content, onClick, ...rest }: Props) {
  return (
    <Button
      size='icon'
      onClick={(e) => {
        navigator.clipboard.writeText(content)
        toast('Copied to clipboard')
        onClick?.(e)
      }}
      {...rest}
    >
      <Copy className='h-4 w-4' />
    </Button>
  )
}
