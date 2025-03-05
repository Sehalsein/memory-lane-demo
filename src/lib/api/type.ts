export type Memory = {
  id: string
  name: string
  description: string
  timestamp: string
  username: string
  slug: string
  eventCount?: number
  images?: Image[]
}

export type Event = {
  id: number
  name: string
  description: string
  timestamp: string
  memoryId: string
  images: Image[]
}

export type Image = {
  id: number
  name: string
  size: number
  type: string
  eventId: string
  url?: string
}

export type CreateMemory = {
  name: string
  description: string
}

export type CreateEvent = {
  name: string
  description: string
  images: Omit<Image, 'eventId'>[]
  memoryId: string
  timestamp: string
}

export type MessageResponse = {
  message: string
}
