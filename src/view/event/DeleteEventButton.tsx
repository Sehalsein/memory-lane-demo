'use client'

import { revalidatePathCache } from '@/app/actions'
import DeleteConfirmation from '@/src/components/DeleteConfirmation'
import Dialog from '@/src/components/Dialog'
import { Button } from '@/src/components/ui/button'
import api from '@/src/lib/api'
import { Trash2 } from 'lucide-react'

type Props = {
  className?: string
  eventId: string
  username: string
  memoryId: string
}

export default function DeleteEventButton(props: Props) {
  const onDelete = async () => {
    return api(props.username)
      .events.delete(props.eventId)
      .then(() => {
        revalidatePathCache(`/~/${props.username}/${props.memoryId}`)
      })
  }
  return (
    <Dialog
      title='Delete event'
      description='Are you sure you want to delete this event? This action cannot be undone.'
      trigger={
        <Button variant='ghost' size='sm' className={props.className}>
          <Trash2 className='text-destructive hover:text-destructive' />
          <span className='sr-only'>Delete</span>
        </Button>
      }
    >
      <DeleteConfirmation className='mt-4' onConfirm={onDelete} />
    </Dialog>
  )
}
