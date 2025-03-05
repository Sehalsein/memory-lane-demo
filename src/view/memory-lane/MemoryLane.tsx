'use client'
import { Event } from '@/src/lib/api/type'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import MemoryEvent from './MemoryEvent'

type Props = {
  events: Event[]
}
export default function MemoryLane(props: Props) {
  const [activeEvent, setActiveEvent] = useState(1)
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const timelineRef = useRef<HTMLDivElement>(null)

  const scrollToEvent = (eventId: number) => {
    setActiveEvent(eventId)
    eventRefs.current[eventId]?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      const eventElements = Object.entries(eventRefs.current).filter(
        ([_, el]) => el !== null
      )

      for (const [id, element] of eventElements) {
        if (!element) continue

        const rect = element.getBoundingClientRect()
        // If the element is in the viewport (with some buffer for better UX)
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveEvent(Number(id))
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='flex flex-col md:flex-row'>
      <Timeline
        ref={timelineRef}
        events={props.events}
        activeEvent={activeEvent}
        scrollToEvent={scrollToEvent}
      />
      <Content refs={eventRefs} events={props.events} />
    </div>
  )
}

type TimelineProps = {
  ref: React.RefObject<HTMLDivElement | null>
  events: Event[]
  activeEvent: number
  scrollToEvent: (id: number) => void
}

function Timeline(props: TimelineProps) {
  return (
    <div className='hidden md:block w-48 lg:w-64 flex-shrink-0'>
      <div
        ref={props.ref}
        className='sticky top-8 pl-4 pr-2 py-8 max-h-[calc(100vh-4rem)] overflow-auto'
      >
        <div className='relative'>
          <div className='absolute top-0 bottom-0 left-3 w-0.5 bg-border'></div>

          <div className='space-y-8'>
            {props.events.map((event) => (
              <button
                key={event.id}
                onClick={() => props.scrollToEvent(event.id)}
                className='relative flex items-start group w-full text-left'
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-3 w-3 h-3 rounded-full -translate-x-1.5 z-10 transition-colors ${
                    props.activeEvent === event.id
                      ? 'bg-primary scale-125'
                      : 'bg-muted-foreground/50 group-hover:bg-primary/70'
                  }`}
                ></div>

                {/* Date text */}
                <div
                  className={`pl-8 text-sm transition-colors ${
                    props.activeEvent === event.id
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {format(event.timestamp, 'PPP')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type ContentProps = {
  events: Event[]
  refs: React.RefObject<{ [key: string]: HTMLDivElement | null }>
}

function Content(props: ContentProps) {
  return (
    <div className='flex-1 md:border-l md:pl-8'>
      <div className='space-y-12 px-4 md:px-0 py-4'>
        {props.events.map((event) => (
          <div
            key={event.id}
            id={event.id.toString()}
            ref={(el) => {
              if (!el) return
              return (props.refs.current[event.id] = el) as any
            }}
            className='scroll-mt-4'
          >
            <MemoryEvent
              description={event.description}
              images={event.images}
              timestamp={event.timestamp}
              title={event.name}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
