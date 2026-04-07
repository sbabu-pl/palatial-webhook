export const metadata = {
  title: 'Palatial Insurance',
  description: 'Fast, reliable insurance quotes in Kenya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}