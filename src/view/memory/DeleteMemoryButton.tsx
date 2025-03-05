'use client'

import { revalidatePathCache } from '@/app/actions'
import DeleteConfirmation from '@/src/components/DeleteConfirmation'
import Dialog from '@/src/components/Dialog'
import { Button } from '@/src/components/ui/button'
import api from '@/src/lib/api'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  className?: string
  username: string
  memoryId: string
}

export default function DeleteMemoryButton(props: Props) {
  const router = useRouter()
  const onDelete = async () => {
    return api(props.username)
      .memories.delete(props.memoryId)
      .then(() => {
        router.push(`/~/${props.username}`)
      })
  }
  return (
    <Dialog
      title='Delete memory'
      description='Are you sure you want to delete this memory? This action cannot be undone.'
      trigger={
        <Button
          variant='ghost'
          size='sm'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 />
          Delete
        </Button>
      }
    >
      <DeleteConfirmation className='mt-4' onConfirm={onDelete} />
    </Dialog>
  )
}
