import LoginForm from '@/src/view/auth/LoginForm'

export const metadata = {
  title: 'Auth | Memory Lane',
}

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-6xl font-bold mb-2'>Memory Lane</h1>
      <p className='text-muted-foreground'>
        A place to store your memories, and share them with the world.
      </p>
      <LoginForm className='mt-12 w-full max-w-sm mx-auto' />
    </div>
  )
}
