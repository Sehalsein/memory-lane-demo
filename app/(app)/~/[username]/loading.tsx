import { Skeleton } from '@/src/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <>
      <div className='flex flex-col h-full container mx-auto py-12 px-2 xl:px-0 items-center'>
        <div className='flex flex-col md:flex-row gap-4 justify-between items-start md:items-center md:justify-start w-full'>
          <div className='space-y-2'>
            <Skeleton className='w-[100px] h-[20px] rounded' />
            <Skeleton className='w-[100px] h-[20px] rounded' />
            <Skeleton className='w-[300px] h-[20px] rounded' />
            <Skeleton className='w-[300px] h-[20px] rounded' />
          </div>
        </div>
        <Loader2 className='h-10 w-10 animate-spin mt-12' />
      </div>
    </>
  )
}
