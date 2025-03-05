import { Toaster } from 'sonner'
import './globals.css'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memory Lane',
  description: 'A place to store your memories, and share them with the world.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
