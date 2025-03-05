'use client'
import { useEffect } from 'react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { useState } from 'react'
import { useCallback } from 'react'

type Props = {
  className?: string
  onConfirm?: () => Promise<unknown>
  onClose?: () => void
}

export default function DeleteConfirmation(props: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const onConfirm = useCallback(async () => {
    setIsDeleting(true)
    await props.onConfirm?.()
    setIsDeleting(false)
    props.onClose?.()
  }, [props.onConfirm, props.onClose])

  return (
    <div className={cn('flex gap-4 justify-end', props.className)}>
      <Button variant='ghost' onClick={props.onClose}>
        Cancel
      </Button>
      <Button variant='destructive' onClick={onConfirm} loading={isDeleting}>
        Delete
      </Button>
    </div>
  )
}
