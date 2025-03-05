import Empty from '@/src/components/ui/empty'
import api from '@/src/lib/api'
import MemoryLane from '@/src/view/memory-lane/MemoryLane'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params

  const lane = await api('').lanes.get(params.slug)

  if (!lane) {
    return (
      <Empty
        title='Memory lane not found'
        description='The memory lane you are looking for does not exist.'
      />
    )
  }

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold'>{lane.name}</h1>
          <p>{lane.description}</p>
        </div>
        {/* <div className='flex gap-3'>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Download
          </Button>
        </div> */}
      </div>
      <MemoryLane events={lane.events} />
    </>
  )
}
