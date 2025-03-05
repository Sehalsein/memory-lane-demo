import { cn } from '@/src/lib/utils'
import { TriangleAlert } from 'lucide-react'

type Props = {
  className?: string
  title: string
  description: string
}

export default function Empty(props: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        props.className
      )}
    >
      <TriangleAlert className='h-24 w-24' strokeWidth={1} />
      <h2 className='text-xl font-medium'>{props.title}</h2>
      <p className='text-muted-foreground'>{props.description}</p>
    </div>
  )
}
