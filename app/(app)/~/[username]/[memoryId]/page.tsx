import { Button } from '@/src/components/ui/button'
import Dialog from '@/src/components/Dialog'
import api from '@/src/lib/api'
import EventCard from '@/src/view/event/EventCard'
import CreateMemoryForm from '@/src/view/memory/MemoryForm'
import MemoryCard from '@/src/view/memory/MemoryCard'
import MemoryCoverCard from '@/src/view/memory/MemoryCoverCard'
import { BookPlus, CalendarRange, Eye, Pencil, Share2 } from 'lucide-react'
import Empty from '@/src/components/ui/empty'
import EventForm from '@/src/view/event/EventForm'
import MemoryForm from '@/src/view/memory/MemoryForm'
import DeleteMemoryButton from '@/src/view/memory/DeleteMemoryButton'
import ShareLink from '@/src/components/ShareLink'

type Props = {
  params: Promise<{
    username: string
    memoryId: string
  }>
}

export default async function Page(props: Props) {
  const { username, memoryId } = await props.params
  const [memory, events] = await Promise.all([
    api(username).memories.get(memoryId),
    api(username).events.list(memoryId),
  ])

  return (
    <div className='flex flex-col h-full container mx-auto py-12'>
      <div className='flex flex-row justify-between items-center group'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-4xl font-bold'>{memory.memory.name}</h1>
            <Dialog
              title='Edit memory'
              description='Update the title and description of this memory lane'
              trigger={
                <Button
                  variant='ghost'
                  size='sm'
                  className='group-hover:inline-flex hidden'
                >
                  <Pencil />
                  <span className='sr-only'>Edit</span>
                </Button>
              }
            >
              <MemoryForm
                className='mt-6'
                username={username}
                defaultValues={{
                  title: memory.memory.name,
                  description: memory.memory.description,
                }}
                memoryId={memoryId}
              />
            </Dialog>
          </div>
          <p className='text-muted-foreground'>{memory.memory.description}</p>
        </div>

        <div className='flex items-center gap-2'>
          <DeleteMemoryButton memoryId={memoryId} username={username} />
          <Dialog
            trigger={
              <Button variant='outline' size='sm'>
                <Share2 />
                Share
              </Button>
            }
            title='Share memory'
            description='Share this memory lane with others by copying the link below. Anyone with the link can view this memory lane.'
          >
            <ShareLink url={`http://localhost:3000/${memory.memory.slug}`} />
          </Dialog>

          <Dialog
            trigger={
              <Button size='sm'>
                <CalendarRange />
                Add event
              </Button>
            }
            title='Add a new event'
            description='Events are moments in time that you want to remember. Add a
                  new event to this memory lane.'
          >
            <EventForm
              className='mt-6'
              username={username}
              memoryId={memoryId}
            />
          </Dialog>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 mt-8'>
        {events.events.length === 0 && (
          <Empty
            className='h-full mx-auto'
            title='No events yet'
            description='Add a new event to this memory lane.'
          />
        )}
        {events.events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            username={username}
            images={event.images}
            title={event.name}
            description={event.description}
            timestamp={event.timestamp}
            memoryId={memoryId}
          />
        ))}
      </div>
    </div>
  )
}
