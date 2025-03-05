import LoginForm from '@/src/view/auth/LoginForm'

export const metadata = {
  title: 'Auth | Memory Lane',
}

export default function Page() {
  return (
    <div>
      <h1>Memory Lane</h1>
      <p>A place to store your memories, and share them with the world.</p>
      <LoginForm />
    </div>
  )
}
