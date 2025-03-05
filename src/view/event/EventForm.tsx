'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'

import { Button } from '@/src/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import {
  FilePreview,
  FileUploader,
  formatFileSize,
} from '@/src/components/ui/file-upload'
import { cn } from '@/src/lib/utils'
import api from '@/src/lib/api'
import { toast } from 'sonner'
import { revalidatePathCache } from '@/app/actions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { Calendar } from '@/src/components/ui/calendar'
import { Textarea } from '@/src/components/ui/textarea'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'title must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
  timestamp: z.coerce.date({
    required_error: 'A date is required.',
  }),
  images: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string().optional(),
    })
  ),
  files: z.array(z.instanceof(File)).refine(
    (images) => {
      const totalSize = images.reduce((sum, img) => sum + img.size, 0)
      return totalSize <= 200 * 1024 * 1024 // 100 MB total limit
    },
    {
      message: 'Total file size exceeds 200 MB limit',
    }
  ),
})

type Props = {
  username: string
  memoryId: string
  className?: string
  eventId?: number
  onClose?: () => void
  defaultValues?: z.infer<typeof formSchema>
}

export default function EventForm(props: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: parseDefaultValues(props.defaultValues),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.files.length && !values.images.length) {
      form.setError('files', {
        message: 'Please select at least one image',
      })
      return
    }

    const images = values.images

    if (values.files.length > 0) {
      const files = await api(props.username)
        .file.upload(values.files)
        .catch(() => null)

      if (!files) {
        toast.error('Failed to upload images')
        return
      }

      images.push(...files.files)
    }

    const { title, description } = values
    const payload = {
      name: title,
      description,
      images,
      memoryId: props.memoryId,
      timestamp: values.timestamp.toISOString(),
    }

    const fn = props.eventId
      ? api(props.username).events.update(props.eventId, payload)
      : api(props.username).events.create(payload)

    const event = await fn.catch(() => {
      toast.error('Failed to create event')
      return null
    })

    if (!event) return

    toast.success(`Event ${props.eventId ? 'updated' : 'created'} successfully`)
    revalidatePathCache(`~/${props.username}/${props.memoryId}`)
    props.onClose?.()
    return
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', props.className)}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter your title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Enter your description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='timestamp'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Photos</FormLabel>
              <FormControl>
                <div className='flex flex-col space-y-2'>
                  <FileUploader disabled={false} {...field} />
                  {field.value.length > 0 && (
                    <div className='space-y-6'>
                      <span className='text-xs text-muted-foreground'>
                        Selected Files ({field.value.length})
                      </span>
                      <div className='flex flex-wrap gap-2'>
                        {field.value.map((file) => (
                          <FilePreview
                            key={file.name}
                            file={file}
                            onRemove={(fileName) => {
                              field.onChange(
                                field.value.filter((f) => f.name !== fileName)
                              )
                            }}
                            disabled={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className='text-left' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='images'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Photos</FormLabel>
              <FormControl>
                <ImagePreview form={form} />
              </FormControl>
              <FormMessage className='text-left' />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2'>
          <Button type='button' variant='ghost' onClick={props.onClose}>
            Cancel
          </Button>
          <Button type='submit'>Submit</Button>
        </div>
      </form>
    </Form>
  )
}

/**
 * Helper
 */
function parseDefaultValues(
  val?: Partial<z.infer<typeof formSchema>>
): z.infer<typeof formSchema> {
  return {
    title: val?.title ?? '',
    description: val?.description ?? '',
    timestamp: val?.timestamp ?? new Date(),
    images: val?.images ?? [],
    files: val?.files ?? [],
  }
}

type ImagePreviewProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>
}
function ImagePreview(props: ImagePreviewProps) {
  const { fields, remove } = useFieldArray({
    control: props.form.control,
    name: 'images',
  })

  return (
    <div className='flex flex-wrap gap-2'>
      {fields.map((image, i) => {
        return (
          <div
            className='flex items-center justify-between rounded-lg border p-0.5 max-w-52'
            key={image.id}
          >
            <div className='flex items-center space-x-3 overflow-hidden'>
              <div className='h-6 w-6 shrink-0 rounded-md bg-primary/10 overflow-hidden'>
                <img
                  src={image.url}
                  alt={image.name}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-xs font-medium'>{image.name}</p>
                <p className='text-[10px] text-muted-foreground'>
                  {formatFileSize(image.size)}
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              type='button'
              className='h-8 w-8 shrink-0 rounded-full'
              onClick={(e) => {
                e.stopPropagation()
                remove(i)
              }}
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Remove file</span>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
