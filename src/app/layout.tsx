import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Ecosommier — Colchones Premium Naturales | Envío Gratis',
  description: 'Colchones premium ecológicos con materiales 100% naturales. Látex orgánico, algodón certificado GOTS. Envío gratis, 100 noches de prueba y 10 años de garantía.',
  keywords: 'colchones ecológicos, colchón natural, ecosommier, colchón látex natural, sommier premium',
  authors: [{ name: 'Ecosommier' }],
  robots: 'index, follow',
  alternates: { canonical: 'https://www.ecosommier.com/' },
  openGraph: {
    type: 'website',
    url: 'https://www.ecosommier.com/',
    title: 'Ecosommier — Colchones Premium Naturales',
    description: 'Dormí mejor con colchones 100% naturales. Envío gratis, 100 noches de prueba y 10 años de garantía.',
    siteName: 'Ecosommier',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecosommier — Colchones Premium Naturales',
    description: 'Dormí mejor con colchones 100% naturales.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Ecosommier',
          url: 'https://www.ecosommier.com',
          description: 'Colchones premium ecológicos con materiales 100% naturales',
        })}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
