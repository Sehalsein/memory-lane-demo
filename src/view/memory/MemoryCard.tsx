import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { cn } from '@/src/lib/utils'
import { Share2, SquareStack } from 'lucide-react'
import Link from 'next/link'
import ShareButton from './ShareButton'
import { Image } from '@/src/lib/api/type'

type Props = {
  className?: string
  username: string
  id: string
  name: string
  description: string
  slug: string
  imageClassName?: string
  eventCount?: number
  images?: Image[]
}

export default function MemoryCard(props: Props) {
  return (
    <Card
      className={cn(
        'shadow-none p-0 overflow-hidden rounded-sm relative group',
        props.className
      )}
    >
      <Link href={`/~/${props.username}/${props.id}`}>
        <CardHeader className='px-0'>
          <CoverImage images={props.images} className={props.imageClassName} />
        </CardHeader>
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 transition-opacity duration-300' />
        <div className='absolute bottom-0 left-0 right-0 p-3 pb-4 transform  translate-y-0 transition-transform duration-300 flex items-center justify-between'>
          <div className='flex flex-col text-white'>
            <h2 className='font-semibold text-2xl'>{props.name}</h2>
            <p className='text-white'>{props.description}</p>
            {props.eventCount ? (
              <div className='flex items-center mt-2'>
                <SquareStack className='mr-2 h-4 w-4' />
                <p>
                  {props.eventCount} event{props.eventCount > 1 ? 's' : ''}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </Link>

      <div className='flex items-center gap-2 text-sm text-muted-foreground absolute bottom-6 right-4'>
        <ShareButton slug={props.slug} />
      </div>
    </Card>
  )
}

type CoverImageProps = {
  className?: string
  images?: Image[]
}

function CoverImage(props: CoverImageProps) {
  if (props.images && props.images.length > 0) {
    return (
      <img
        className={cn('h-96 w-full object-cover', props.className)}
        src={props.images[0].url}
        alt='Cover image'
      />
    )
  }

  return (
    <div
      className={cn(
        'h-96 w-full bg-linear-to-bl',
        'from-sky-200 to-indigo-200',
        // 'from-blue-200 to-fuchsia-200',
        props.className
      )}
    />
  )
}
