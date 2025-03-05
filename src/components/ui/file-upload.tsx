'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { Button } from './button'

type FileUploaderProps = {
  value: File[]
  disabled?: boolean
  onChange: (files: File[]) => void
}

export function FileUploader(props: FileUploaderProps) {
  const { value, disabled = false, onChange } = props
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (selectedFiles: File[]) => {
    const existingFiles = new Map(value.map((file) => [file.name, file]))

    selectedFiles.forEach((file) => {
      if (!existingFiles.has(file.name)) {
        existingFiles.set(file.name, file)
      }
    })

    onChange(Array.from(existingFiles.values()))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25',
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer hover:border-primary/50'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
        disabled={disabled}
      />

      <div className='flex flex-col items-center justify-center space-y-2 text-center'>
        <div className='rounded-full bg-primary/10 p-3'>
          <Upload className='h-6 w-6 text-primary' />
        </div>
        <h3 className='text-lg font-medium'>Drag & drop images here</h3>
        <p className='text-sm text-muted-foreground'>
          or click to browse images
        </p>
        <p className='text-xs text-muted-foreground'>
          Upload multiple images (JPEG, PNG)
        </p>
      </div>
    </div>
  )
}

type FilePreviewProps = {
  file: File
  onRemove: (fileName: string) => void
  disabled?: boolean
}

export function FilePreview(props: FilePreviewProps) {
  const { file, onRemove, disabled = false } = props
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onRemove(file.name)
    }
  }

  return (
    <div className='flex items-center justify-between rounded-lg border p-0.5 max-w-52'>
      <div className='flex items-center space-x-3 overflow-hidden'>
        <ImagePreview file={file} />
        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs font-medium'>{file.name}</p>
          <p className='text-[10px] text-muted-foreground'>
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 shrink-0 rounded-full'
        onClick={handleRemove}
        disabled={disabled}
      >
        <X className='h-4 w-4' />
        <span className='sr-only'>Remove file</span>
      </Button>
    </div>
  )
}

function ImagePreview({ file }: { file: File }) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    // Create a preview URL for the image
    const url = URL.createObjectURL(file)
    setPreview(url)

    // Clean up the URL when component unmounts
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <div className='h-6 w-6 shrink-0 rounded-md bg-primary/10 overflow-hidden'>
      {preview ? (
        <img
          src={preview || '/placeholder.svg'}
          alt={file.name}
          className='h-full w-full object-cover'
        />
      ) : (
        <span className='flex h-full w-full items-center justify-center text-xs font-medium'>
          IMG
        </span>
      )}
    </div>
  )
}

/**
 * Helper
 */

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
