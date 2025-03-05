import { PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  return <main className='min-h-screen'>{props.children}</main>
}
