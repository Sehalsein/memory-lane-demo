'use client'

import { PropsWithChildren } from 'react'
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Slot } from '@radix-ui/react-slot'
import { useState } from 'react'
import { useMemo } from 'react'

type Props = PropsWithChildren & {
  trigger: React.ReactNode
  title: string
  description: string
}

export default function Dialog(props: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = useMemo(() => () => setIsOpen(false), [])

  const slotProps = {
    onClose,
  }
  return (
    <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
          <Slot {...slotProps}>{props.children}</Slot>
        </DialogHeader>
      </DialogContent>
    </DialogRoot>
  )
}
