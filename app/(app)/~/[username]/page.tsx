import Dialog from '@/src/components/Dialog'
import { Button } from '@/src/components/ui/button'
import Empty from '@/src/components/ui/empty'
import api from '@/src/lib/api'
import CreateMemoryForm from '@/src/view/memory/MemoryForm'
import MemoryCoverCard from '@/src/view/memory/MemoryCoverCard'
import { BookPlus, TriangleAlert } from 'lucide-react'

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
    <div className='flex flex-col h-full container mx-auto py-12'>
      <div className='flex flex-row justify-between items-center'>
        <div className=''>
          <h1 className='text-4xl font-bold'>{username}'s Memory Lane</h1>
          <p>A place to store your memories, and share them with the world.</p>
        </div>

        <Dialog
          trigger={
            <Button size='sm'>
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

      {memories?.memories.length === 0 ? (
        <Empty
          className='h-full mt-32'
          title='No memories yet'
          description='Create a new memory to get started'
        />
      ) : null}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
        {memories?.memories.map((memory) => (
          <MemoryCoverCard
            key={memory.id}
            username={username}
            id={memory.id}
            name={memory.name}
            description={memory.description}
          />
        ))}
      </div>
    </div>
  )
}
