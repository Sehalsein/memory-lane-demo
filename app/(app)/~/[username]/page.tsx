import Dialog from '@/src/components/Dialog'
import { Button } from '@/src/components/ui/button'
import Empty from '@/src/components/ui/empty'
import api from '@/src/lib/api'
import CreateMemoryForm from '@/src/view/memory/MemoryForm'
import MemoryCoverCard from '@/src/view/memory/MemoryCoverCard'
import { BookPlus, TriangleAlert } from 'lucide-react'
import MemoryCard from '@/src/view/memory/MemoryCard'

type Props = {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata(props: Props) {
  const { username } = await props.params

  return {
    title: `${username}'s Memory Lane`,
  }
}

export default async function Page(props: Props) {
  const { username } = await props.params
  const memories = await api(username).memories.list()

  return (
    <div className='flex flex-col h-full container mx-auto py-12 px-2 xl:px-0'>
      <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
        <div className=''>
          <h1 className='text-4xl font-bold'>{username}'s Memory Lane</h1>
          <p>A place to store your memories, and share them with the world.</p>
        </div>

        <Dialog
          trigger={
            <Button size='sm' className='w-full md:w-auto'>
              <BookPlus />
              New memory
            </Button>
          }
          title='Create a new memory lane'
          description='Memories are a way to capture and share your experiences with
                the world. Create a new memory lane to get started.'
        >
          <CreateMemoryForm className='mt-6' username={username} />
        </Dialog>
      </div>

      {!memories || memories?.memories.length === 0 ? (
        <Empty
          className='h-full mt-32'
          title='No memories yet'
          description='Create a new memory to get started'
        />
      ) : null}

      {/* {memories?.memories[0] ? (
        <MemoryCoverCard
          className='mt-8'
          imageClassName='h-96'
          key={memories.memories[0].id}
          username={username}
          id={memories.memories[0].id}
          name={memories.memories[0].name}
          description={memories.memories[0].description}
          slug={memories.memories[0].slug}
        />
      ) : null} */}

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8'>
        {memories?.memories.slice(1).map((memory) => (
          <MemoryCard
            key={memory.id}
            username={username}
            id={memory.id}
            name={memory.name}
            description={memory.description}
            slug={memory.slug}
            eventCount={memory.eventCount}
            images={memory.images}
          />
        ))}
      </div>
    </div>
  )
}
