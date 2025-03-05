'use client'

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Image } from '@/src/lib/api/type'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'

type Props = {
  timestamp: string
  title: string
  description: string
  images: Image[]
}

export default function MemoryEvent(props: Props) {
  const [viewingImage, setViewingImage] = useState<number | null>(null)

  const openImageViewer = (index: number) => {
    setViewingImage(index)
  }

  const closeImageViewer = () => {
    setViewingImage(null)
  }

  const navigateImage = (direction: 'next' | 'prev') => {
    if (viewingImage === null) return

    if (direction === 'next') {
      setViewingImage((viewingImage + 1) % props.images.length)
    } else {
      setViewingImage(
        (viewingImage - 1 + props.images.length) % props.images.length
      )
    }
  }

  return (
    <div>
      <div className='mb-3 flex items-center md:hidden'>
        <Calendar className='h-4 w-4 mr-2 text-primary' />
        <span className='text-sm font-medium text-primary'>
          {props.timestamp}
        </span>
      </div>

      <Card className='shadow-none'>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {props.images.map((image, index) => (
              <div
                key={index}
                className='aspect-square rounded-md overflow-hidden cursor-pointer'
                onClick={() => openImageViewer(index)}
              >
                <img
                  src={image.url || '/placeholder.svg'}
                  alt={`Memory of ${image.name} - image ${index + 1}`}
                  className='object-cover w-full h-full hover:scale-105 transition-transform'
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full-size image viewer */}
      {viewingImage !== null && (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col'>
          <div className='flex justify-between items-center p-4'>
            <h3 className='text-lg font-medium'>{props.title}</h3>
            <Button variant='ghost' size='icon' onClick={closeImageViewer}>
              <X className='h-5 w-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </div>

          <div className='flex-1 flex items-center justify-center p-4 relative'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-4 rounded-full bg-background/50 hover:bg-background/70'
              onClick={() => navigateImage('prev')}
              disabled={props.images.length <= 1}
            >
              <ChevronLeft className='h-6 w-6' />
              <span className='sr-only'>Previous image</span>
            </Button>

            <div className='max-h-full max-w-full'>
              <img
                src={props.images[viewingImage].url || '/placeholder.svg'}
                alt={`${props.title} - full size image`}
                className='max-h-[80vh] max-w-full object-contain'
              />
            </div>

            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 rounded-full bg-background/50 hover:bg-background/70'
              onClick={() => navigateImage('next')}
              disabled={props.images.length <= 1}
            >
              <ChevronRight className='h-6 w-6' />
              <span className='sr-only'>Next image</span>
            </Button>
          </div>

          <div className='p-4 text-center'>
            {viewingImage + 1} of {props.images.length}
          </div>
        </div>
      )}
    </div>
  )
}
