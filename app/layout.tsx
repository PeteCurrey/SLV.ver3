import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "SLVC | Storforth Lane Valeting Centre — Chesterfield",
  description:
    "Chesterfield's premier auto detailing, paint correction, ceramic coating and valeting centre. 18+ years of showroom-quality results. Unit 9, Vanguard Trading Estate, S40 2TZ.",
  keywords: "car valeting Chesterfield, auto detailing Derbyshire, paint correction, ceramic coating, SLVC, Storforth Lane Valeting",
  openGraph: {
    title: 'SLVC | Storforth Lane Valeting Centre',
    description: "Chesterfield's premier detailing centre — 18+ years of showroom-quality results.",
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
