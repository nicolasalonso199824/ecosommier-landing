import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Ecosommier - Colchones premium con asesoramiento por WhatsApp',
  description: 'Conoce la coleccion Ecosommier y recibe asesoramiento por WhatsApp para elegir el colchon ideal para tu descanso.',
  keywords: 'colchones premium, ecosommier, colchones, descanso, whatsapp',
  authors: [{ name: 'Ecosommier' }],
  robots: 'index, follow',
  alternates: { canonical: 'https://www.ecosommier.com/' },
  openGraph: {
    type: 'website',
    url: 'https://www.ecosommier.com/',
    title: 'Ecosommier - Colchones premium con asesoramiento por WhatsApp',
    description: 'Explora la coleccion Ecosommier y recibe una recomendacion real por WhatsApp.',
    siteName: 'Ecosommier',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecosommier - Colchones premium con asesoramiento por WhatsApp',
    description: 'Coleccion premium, decision mas clara y atencion directa por WhatsApp.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Ecosommier',
              url: 'https://www.ecosommier.com',
              description: 'Colchones premium con asesoramiento humano y atencion por WhatsApp',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
