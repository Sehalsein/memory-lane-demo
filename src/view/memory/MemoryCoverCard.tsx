import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { cn } from '@/src/lib/utils'
import { Share2 } from 'lucide-react'
import Link from 'next/link'
import ShareButton from './ShareButton'

type Props = {
  className?: string
  username: string
  id: string
  name: string
  description: string
  slug: string
  imageClassName?: string
}

export default function MemoryCoverCard(props: Props) {
  return (
    <Card
      className={cn(
        'shadow-none pt-0 overflow-hidden rounded-sm',
        props.className
      )}
    >
      <Link href={`/~/${props.username}/${props.id}`}>
        <CardHeader className='px-0'>
          <div
            className={cn('h-96 w-full bg-gray-200 p-0', props.imageClassName)}
          />
        </CardHeader>
      </Link>
      <CardContent>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col'>
            <h2 className='font-semibold text-2xl'>{props.name}</h2>
            <p className='text-muted-foreground'>{props.description}</p>
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <ShareButton slug={props.slug} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
