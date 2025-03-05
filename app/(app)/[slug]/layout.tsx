import { PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  return (
    <div className='flex flex-col space-y-4 py-12 container px-2 md:px-4 xl:px-0 mx-auto'>
      {props.children}
    </div>
  )
}
