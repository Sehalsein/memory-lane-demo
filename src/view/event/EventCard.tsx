import { Image } from '@/src/lib/api/type'
import { cn } from '@/src/lib/utils'
import DeleteEventButton from './DeleteEventButton'
import Dialog from '@/src/components/Dialog'
import { Button } from '@/src/components/ui/button'
import EventForm from './EventForm'
import { Clock, Pencil } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
  images: Image[]
  id: string
  title: string
  description: string
  timestamp: string
  username: string
  memoryId: string
}

export default function EventCard(props: Props) {
  return (
    <div className='border border-border rounded-md overflow-hidden p-2 group bg-background flex flex-col md:flex-row justify-between items-center'>
      <div className='flex items-start justify-between'>
        <div className='p-2'>
          <div className='flex items-center'>
            <h3 className='text-xl'>{props.title}</h3>
            <div className='flex justify-between invisible group-hover:visible transition-all ml-2'>
              <Dialog
                title='Edit event'
                description='Edit the details of this event.'
                trigger={
                  <Button size='icon' className='p-0.5 h-6' variant='ghost'>
                    <Pencil />
                    <span className='sr-only'>Edit</span>
                  </Button>
                }
              >
                <EventForm
                  memoryId={props.memoryId}
                  username={props.username}
                  defaultValues={{
                    description: props.description,
                    title: props.title,
                    timestamp: new Date(props.timestamp),
                    images: props.images,
                    files: [],
                  }}
                  eventId={props.id}
                />
              </Dialog>
              <DeleteEventButton
                className='p-0.5 h-6'
                eventId={props.id}
                username={props.username}
                memoryId={props.memoryId}
              />
            </div>
          </div>
          <p className='text-muted-foreground text-sm'>{props.description}</p>
          <div className='text-muted-foreground flex items-center gap-1 text-sm mt-2'>
            <Clock className='inline-block h-4 w-4' />
            <time dateTime={props.timestamp}>
              {format(props.timestamp, 'PPP')}
            </time>
          </div>
        </div>
      </div>
      <div>
        <CoverImage images={props.images} />
      </div>
    </div>
  )
}

type CoverImageProps = {
  className?: string
  images: Image[]
}

function CoverImage(props: CoverImageProps) {
  return (
    <div className={cn('flex items-center gap-1', props.className)}>
      {props.images.slice(0, 3).map((image) => {
        return (
          <img
            key={image.id}
            src={image.url}
            alt={image.name} // TODO: Add alt text
            className='h-16 w-16 rounded object-cover border border-border'
          />
        )
      })}
      {props.images.length > 3 && (
        <Button
          className='h-16 w-16 flex items-center justify-center'
          variant='outline'
        >
          +{props.images.length - 3}
        </Button>
      )}
    </div>
  )
}
