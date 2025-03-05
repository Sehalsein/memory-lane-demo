import {
  CreateEvent,
  CreateMemory,
  Memory,
  Event,
  MessageResponse,
  Image,
} from './type'
import fetcher from './fetcher'

const createAPI = (username: string) => {
  const defaultOptions = {
    headers: {
      'x-api-username': username,
    },
  }

  return {
    memories: {
      list: () => {
        return fetcher.get<{ memories: Memory[] }>('/memories', defaultOptions)
      },
      get: (id: string) => {
        return fetcher.get<{ memory: Memory }>(
          `/memories/${id}`,
          defaultOptions
        )
      },
      create: (data: CreateMemory) => {
        return fetcher.post<{ memory: Memory }>(
          '/memories',
          data,
          defaultOptions
        )
      },
      update: (id: string, data: Partial<Omit<CreateMemory, 'username'>>) => {
        return fetcher.put<MessageResponse>(
          `/memories/${id}`,
          data,
          defaultOptions
        )
      },
      delete: (id: string) => {
        return fetcher.delete<MessageResponse>(
          `/memories/${id}`,
          defaultOptions
        )
      },
    },

    events: {
      list: (memoryId: string) => {
        return fetcher.get<{ events: Event[] }>(
          `/events?memoryId=${memoryId}`,
          defaultOptions
        )
      },
      get: (id: string) => {
        return fetcher.get<Event>(`/events/${id}`, defaultOptions)
      },
      create: (data: CreateEvent) => {
        return fetcher.post<Event>('/events', data, defaultOptions)
      },
      update: (id: number, data: Partial<Omit<CreateEvent, 'memoryId'>>) => {
        return fetcher.put<Event>(`/events/${id}`, data, defaultOptions)
      },
      delete: (id: number) => {
        return fetcher.delete<Event>(`/events/${id}`, defaultOptions)
      },
    },

    file: {
      upload: (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
          formData.append('images', file)
        })

        return fetcher.post<{
          message: string
          files: Omit<Image, 'eventId'>[]
        }>('/files/upload', formData, defaultOptions)
      },
    },

    lanes: {
      get: (slug: string) => {
        return fetcher.get<
          Omit<Memory, 'eventCount' | 'images'> & {
            events: Event[]
          }
        >(`/lanes/${slug}`, defaultOptions)
      },
    },
  }
}

export default createAPI
