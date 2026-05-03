export const metadata = {
  title: 'CLI Starter — Next.js',
  description: 'Deployed on cli.cloud',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
