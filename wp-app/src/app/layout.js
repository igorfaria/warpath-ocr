import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Warpath LoL',
  description: 'For the LoL of Warpath',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name='theme-color' content='#333333'/>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
