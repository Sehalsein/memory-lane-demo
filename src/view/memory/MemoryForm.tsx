'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { cn } from '@/src/lib/utils'
import { Textarea } from '@/src/components/ui/textarea'
import api from '@/src/lib/api'
import { toast } from 'sonner'
import { revalidatePathCache } from '@/app/actions'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'title must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
})

type Props = {
  className?: string
  username: string
  memoryId?: string
  defaultValues?: z.infer<typeof formSchema>
  onClose?: () => void
}

export default function MemoryForm(props: Props) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: parseDefaultValues(props.defaultValues),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      name: values.title,
      description: values.description,
    }
    const fn = props.memoryId
      ? api(props.username).memories.update(props.memoryId, payload)
      : api(props.username).memories.create(payload)

    return fn
      .then((res) => {
        toast.success(
          `Successfully ${props.memoryId ? 'updated' : 'created'} memory`
        )
        revalidatePathCache(`/~${props.username}`)

        if ('memory' in res) {
          router.push(`/~/${props.username}/${res.memory.id}`)
        } else {
          props.onClose?.()
        }
      })
      .catch(() => {
        toast.error('Failed to create memory')
      })
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
                <Textarea
                  className='min-h-32'
                  placeholder='Enter your description'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2'>
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
  }
}
