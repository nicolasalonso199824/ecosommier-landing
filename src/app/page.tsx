'use client'

import { startTransition, useEffect, useState } from 'react'
import Image from 'next/image'

const whatsappNumber = '542302621528'
const callNumber = '+542302628744'
const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const
const instagramUrl = 'https://www.instagram.com/ecosommier?igsh=dm5yZ2hkN3lrOThs'
const facebookUrl = 'https://www.facebook.com/share/18LpEui3eJ/?mibextid=wwXIfr'

const whatsappHref = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

const heroImages = ['/hero.jpg', '/galeria1.jpg', '/galeria4.jpg']

const products = [
  {
    id: 'eco-platino',
    name: 'Ecosommier Platino',
    badge: 'Densidad media',
    tone: 'tone-silver',
    image: '/platino.png',
    specs: [
      'Tapa en tela tejida de punto o jacquard plus matelaseada, con banda matelaseada en tela jacquard y vivos perimetrales.',
      'Marco perimetral de espuma de 26 kg/m3 de densidad.',
      'Placa superior e inferior de espuma de 24 kg/m3, aislada con tela de fibra.',
      'Resortes bicónicos tipo Bonell, con sistema solidario reforzado y 13 columnas de espuma de alta densidad.',
    ],
    message: 'Hola, quiero consultar por Ecosommier Platino y saber si es el modelo indicado para mí.',
  },
  {
    id: 'eco-confort',
    name: 'Ecosommier Confort',
    badge: 'Densidad alta',
    tone: 'tone-blue',
    image: '/confort.png',
    specs: [
      'Tapa en tela tejida de punto o jacquard plus matelaseada, con banda matelaseada en tela jacquard y vivos perimetrales.',
      'Marco perimetral de espuma de 28 kg/m3 de densidad.',
      'Placa superior e inferior de espuma de 28 kg/m3, aislada con tela de fibra.',
      'Resortes bicónicos tipo Bonell, con sistema solidario reforzado y 13 columnas de espuma de alta densidad.',
    ],
    message: 'Hola, quiero consultar por Ecosommier Confort y saber si es el modelo que mejor me conviene.',
  },
  {
    id: 'eco-premium',
    name: 'Ecosommier Premium',
    badge: 'Densidad extrema',
    tone: 'tone-gold',
    image: '/premium.png',
    specs: [
      'Tela tejida de punto o jacquard plus matelaseada, con banda matelaseada en tela jacquard y vivos perimetrales.',
      'Marco perimetral de espuma de 35 kg/m3 de densidad.',
      'Placa superior e inferior de espuma de 35 kg/m3, aislada con tela de fibra.',
      'Resortes bicónicos tipo Bonell, con sistema solidario reforzado y 13 columnas de espuma de alta densidad.',
    ],
    message: 'Hola, quiero consultar por Ecosommier Premium y conocer medidas, terminaciones y opciones.',
  },
]

const measureOptions = [
  {
    id: '1x190x30',
    label: '1 x 190 x 30',
    name: '1 plaza',
    width: '100 cm',
    length: '190 cm',
    height: '30 cm',
    summary: 'La medida justa para habitaciones compactas, adolescentes o espacios donde cada centímetro importa.',
    ideal: 'Perfecta para uso individual y cuartos con circulación más libre.',
    image: '/measures/100x190x30.jpeg',
    photoWidth: '470px',
    photoScale: 1.12,
    photoShiftY: '8px',
  },
  {
    id: '140x190x30',
    label: '140 x 190 x 30',
    name: 'Matrimonial',
    width: '140 cm',
    length: '190 cm',
    height: '30 cm',
    summary: 'Una opción equilibrada para parejas que quieren más comodidad sin pasar a un formato demasiado grande.',
    ideal: 'Ideal para dormitorios medianos y una compra práctica con look premium.',
    image: '/measures/140x190x30.jpeg',
    photoWidth: '485px',
    photoScale: 1.08,
    photoShiftY: '6px',
  },
  {
    id: '160x190x30',
    label: '160 x 190 x 30',
    name: 'Queen',
    width: '160 cm',
    length: '190 cm',
    height: '30 cm',
    summary: 'La medida más versátil para quienes quieren amplitud real y una experiencia de descanso más cómoda.',
    ideal: 'Excelente para parejas que priorizan confort diario y mejor presencia visual.',
    image: '/measures/160x190x30.jpeg',
    photoWidth: '500px',
    photoScale: 1.06,
    photoShiftY: '4px',
  },
  {
    id: '180x190x30',
    label: '180 x 190 x 30',
    name: 'King',
    width: '180 cm',
    length: '190 cm',
    height: '30 cm',
    summary: 'Más superficie, más libertad al dormir y una presencia fuerte para dormitorios principales.',
    ideal: 'Recomendada para quienes comparten cama y quieren espacio sin resignar estética.',
    image: '/measures/180x190x30.jpeg',
    photoWidth: '495px',
    photoScale: 1.1,
    photoShiftY: '8px',
  },
  {
    id: '2x2x30',
    label: '2 x 2 x 30',
    name: 'Super King',
    width: '200 cm',
    length: '200 cm',
    height: '30 cm',
    summary: 'La opción más amplia de la línea para una experiencia de descanso superior, con escala y presencia premium.',
    ideal: 'Pensada para quienes quieren el máximo nivel de amplitud y confort.',
    image: '/measures/2x2x30.jpeg',
    photoWidth: '510px',
    photoScale: 1.1,
    photoShiftY: '10px',
  },
] as const

const serviceSteps = [
  {
    step: '01',
    title: 'Nos escribís por WhatsApp',
    copy: 'Contanos cómo dormís, si compartís cama, qué medida buscás y qué presupuesto querés explorar.',
  },
  {
    step: '02',
    title: 'Te recomendamos el modelo correcto',
    copy: 'No te dejamos solo con un catálogo. Te guiamos hacia la opción con más sentido para vos.',
  },
  {
    step: '03',
    title: 'Coordinamos compra y entrega',
    copy: 'Seguimos con vos hasta resolver precios, financiación, tiempos y cualquier duda final.',
  },
]

const metrics = [
  { value: '500+', label: 'Hogares acompañados' },
]

const testimonialGallery = [
  { src: '/testimonios-nuevos/cliente-real-1.jpeg', alt: 'Cliente feliz Ecosommier 1' },
  { src: '/testimonios-nuevos/cliente-real-2.jpeg', alt: 'Cliente feliz Ecosommier 2' },
  { src: '/testimonios-nuevos/cliente-real-3.jpeg', alt: 'Cliente feliz Ecosommier 3' },
  { src: '/testimonios-nuevos/cliente-real-4.jpeg', alt: 'Cliente feliz Ecosommier 4' },
  { src: '/testimonios-nuevos/cliente-real-5.jpeg', alt: 'Cliente feliz Ecosommier 5' },
]

function StarField({ id }: { id: string }) {
  return <div className="stars-canvas" id={id} aria-hidden="true" />
}

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [reviewSlide, setReviewSlide] = useState(0)
  const [measureIndex, setMeasureIndex] = useState(2)
  const [isMeasureMenuOpen, setIsMeasureMenuOpen] = useState(false)
  const [cookieShown, setCookieShown] = useState(false)
  const selectedMeasure = measureOptions[measureIndex]

  useEffect(() => {
    const fields = document.querySelectorAll<HTMLElement>('.stars-canvas')

    fields.forEach((field) => {
      for (let i = 0; i < 22; i += 1) {
        const star = document.createElement('div')
        const size = Math.random() * 2.4 + 0.6
        star.className = 'star'
        star.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;--d:${2 + Math.random() * 4}s;--dl:${Math.random() * 4}s`
        field.appendChild(star)
      }
    })

    return () => {
      fields.forEach((field) => {
        field.innerHTML = ''
      })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return
        window.setTimeout(() => entry.target.classList.add('visible'), index * 80)
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12 })

    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('eco_cookie_consent')) return
    const timeoutId = window.setTimeout(() => setCookieShown(true), 1200)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const goToSlide = (nextIndex: number) => {
    startTransition(() => setSlide(nextIndex))
  }

  const nextSlide = () => {
    startTransition(() => setSlide((current) => (current + 1) % heroImages.length))
  }

  const previousSlide = () => {
    startTransition(() => setSlide((current) => (current - 1 + heroImages.length) % heroImages.length))
  }

  const nextReviewSlide = () => {
    startTransition(() => setReviewSlide((current) => (current + 1) % testimonialGallery.length))
  }

  const previousReviewSlide = () => {
    startTransition(() => setReviewSlide((current) => (current - 1 + testimonialGallery.length) % testimonialGallery.length))
  }

  const goToReviewSlide = (nextIndex: number) => {
    startTransition(() => setReviewSlide(nextIndex))
  }

  const selectMeasure = (nextIndex: number) => {
    startTransition(() => setMeasureIndex(nextIndex))
    setIsMeasureMenuOpen(false)
  }

  const acceptCookies = () => {
    localStorage.setItem('eco_cookie_consent', 'all')
    setCookieShown(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('eco_cookie_consent', 'essential')
    setCookieShown(false)
  }

  return (
    <>
      <nav role="navigation" aria-label="Menú principal">
        <div className="nav-shell">
          <a href="#hero" className="logo" aria-label="Ecosommier - Inicio">
            <div className="logo-img-wrap" aria-hidden="true">
              <div className="logo-img-shell">
                <Image src="/logo-icon.png" alt="Ecosommier" width={54} height={54} priority style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <span className="logo-copy">
              <span className="logo-kicker">Descanso premium</span>
              <span className="logo-name"><span>Eco</span>sommier</span>
            </span>
          </a>
        </div>
      </nav>

      <main>
        <section className="hero-section" id="hero">
          <StarField id="hero-stars" />

          <div className="section-shell hero-shell">
            <div className="hero-copy-block">
              <h1 className="hero-title">
                <span className="reveal">Dormí mejor.</span><br />
                <span className="line2 reveal">Elegí sin dudas.</span>
              </h1>
              <p className="hero-sub reveal">
                Colchones premium, asesoramiento real y una elección mucho más clara.
              </p>

              <div className="hero-actions reveal">
                <a href={whatsappHref('Hola, quiero que me ayuden a elegir el colchón ideal para mí.')} className="btn-wa" {...externalLinkProps}>
                  Hablar por WhatsApp
                </a>
                <a href="#products" className="btn-main">Ver colección</a>
              </div>

              <p className="hero-note reveal">Respuesta ágil. Recomendación concreta. Compra acompañada.</p>
            </div>

            <div className="hero-visual reveal-r">
              <div className="hero-frame">
                <div className="hero-carousel">
                  <button className="carousel-btn" onClick={previousSlide} aria-label="Imagen anterior" type="button">&#8249;</button>

                  <div className="hero-media">
                    <Image
                      src={heroImages[slide]}
                      alt={`Ambiente Ecosommier ${slide + 1}`}
                      width={620}
                      height={470}
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <button className="carousel-btn" onClick={nextSlide} aria-label="Imagen siguiente" type="button">&#8250;</button>
                </div>

                <div className="carousel-dots" role="tablist" aria-label="Galería principal">
                  {heroImages.map((image, index) => (
                    <button
                      key={image}
                      className={`carousel-dot${index === slide ? ' active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-pressed={index === slide}
                      type="button"
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="page-section collection-section" id="products">
          <StarField id="products-stars" />

          <div className="section-shell">
            <div className="section-head reveal">
              <div className="section-tag">Nuestra colección</div>
              <h2 className="section-title">Tres modelos claros,<br /><em>una elección mejor guiada.</em></h2>
            </div>

            <div className="density-guide reveal">
              <span className="density-guide-tag">Guía breve</span>
              <p>La densidad determina la calidad, la comodidad y la durabilidad de un colchón. Al elegir, es clave mirar ese dato.</p>
            </div>

            <div className="prod-grid">
              {products.map((product) => (
                <article key={product.id} className="prod-card reveal" id={product.id}>
                  <div className={`prod-visual ${product.tone}`}>
                    <Image src={product.image} alt={product.name} width={380} height={240} style={{ objectFit: 'contain' }} />
                    <div className="prod-badge">{product.badge}</div>
                  </div>

                  <div className="prod-body">
                    <h3>{product.name}</h3>

                    <ul className="prod-points prod-specs-list">
                      {product.specs.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>

                    <div className="prod-footer">
                      <a href={whatsappHref(product.message)} className="btn-wa prod-btn" {...externalLinkProps}>
                        Consultar {product.name.replace('Ecosommier ', '')}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section measure-section" id="measures">
          <StarField id="measures-stars" />

          <div className="section-shell">
            <div className="section-head reveal">
              <div className="section-tag">Elegí tu medida</div>
              <h2 className="section-title">Una medida clara,<br /><em>según tu espacio y tu forma de dormir.</em></h2>
              <p className="section-copy">Te dejamos una guía rápida para que visualices mejor el tamaño que necesitás. Después te asesoramos por WhatsApp con el modelo que más te conviene.</p>
            </div>

            <div className="measure-picker reveal">
              <div className={`measure-select${isMeasureMenuOpen ? ' open' : ''}`}>
                <button
                  className="measure-select-trigger"
                  onClick={() => setIsMeasureMenuOpen((current) => !current)}
                  aria-expanded={isMeasureMenuOpen}
                  aria-controls="measure-options"
                  type="button"
                >
                  <span className="measure-select-copy">
                    <span className="measure-select-kicker">Seleccioná una medida</span>
                    <span className="measure-select-value">{selectedMeasure.name} · {selectedMeasure.label}</span>
                  </span>
                  <span className="measure-select-icon" aria-hidden="true">▾</span>
                </button>

                <div className="measure-select-menu" id="measure-options" role="listbox" aria-label="Seleccionar medida">
                  {measureOptions.map((measure, index) => (
                    <button
                      key={measure.id}
                      className={`measure-option${index === measureIndex ? ' active' : ''}`}
                      onClick={() => selectMeasure(index)}
                      aria-selected={index === measureIndex}
                      role="option"
                      type="button"
                    >
                      <span className="measure-option-name">{measure.name}</span>
                      <span className="measure-option-label">{measure.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="measure-panel">
                <div className="measure-visual-stage reveal-l">
                  <div className="measure-visual-glow" aria-hidden="true" />
                  <div className="measure-bed-shell">
                    {selectedMeasure.image ? (
                      <div className="measure-photo-wrap" style={{ maxWidth: selectedMeasure.photoWidth }}>
                        <Image
                          src={selectedMeasure.image}
                          alt={`Ecosommier medida ${selectedMeasure.label}`}
                          width={1217}
                          height={1600}
                          className="measure-photo"
                          style={{ ['--measure-photo-transform' as string]: `translateY(${selectedMeasure.photoShiftY}) scale(${selectedMeasure.photoScale})` }}
                        />
                      </div>
                    ) : (
                      <div className="measure-placeholder" aria-hidden="true">
                        <div className="measure-placeholder-bed" />
                        <div className="measure-placeholder-copy">Imagen en carga</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="measure-copy reveal-r">
                  <div className="measure-copy-head">
                    <span className="measure-kicker">Medida seleccionada</span>
                    <h3>{selectedMeasure.name}</h3>
                    <p>{selectedMeasure.summary}</p>
                  </div>

                  <div className="measure-specs">
                    <div className="measure-spec-card">
                      <span>Ancho</span>
                      <strong>{selectedMeasure.width}</strong>
                    </div>
                    <div className="measure-spec-card">
                      <span>Largo</span>
                      <strong>{selectedMeasure.length}</strong>
                    </div>
                    <div className="measure-spec-card">
                      <span>Altura</span>
                      <strong>{selectedMeasure.height}</strong>
                    </div>
                  </div>

                  <p className="measure-ideal"><strong>Ideal para:</strong> {selectedMeasure.ideal}</p>

                  <div className="measure-actions">
                    <a
                      href={whatsappHref(`Hola, quiero consultar por la medida ${selectedMeasure.label} y cuál modelo me recomiendan entre Platino, Confort y Premium.`)}
                      className="btn-wa"
                      {...externalLinkProps}
                    >
                      Consultar esta medida
                    </a>
                    <a href="#products" className="btn-main">Ver modelos</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section experience-section" id="experience">
          <div className="section-shell experience-grid">
            <div className="experience-copy reveal-l">
              <div className="section-tag">Compra simple, atención real</div>
              <h2 className="section-title">Una experiencia premium,<br /><em>sin fricción ni dudas.</em></h2>
              <a href={whatsappHref('Hola, quiero que me asesoren por WhatsApp para elegir entre Platino, Confort y Premium.')} className="btn-main" {...externalLinkProps}>
                Quiero asesoramiento
              </a>
            </div>

            <div className="experience-side reveal-r">
              <div className="steps-grid">
                {serviceSteps.map((item) => (
                  <div key={item.step} className="step-card reveal">
                    <span className="step-index">{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-section reviews-section" id="reviews">
          <StarField id="reviews-stars" />

          <div className="section-shell">
            <div className="reviews-stage">
              <div className="section-head reveal">
                <h2 className="section-title">Clientes felices,<br /><em>compras reales.</em></h2>
                <p className="section-copy review-copy">Fotos compartidas por clientes después de recibir su Ecosommier en casa.</p>
              </div>

              <div className="metrics-grid reveal">
                {metrics.map((metric) => (
                  <div key={metric.label} className="metric-card reveal">
                    <div className="metric-value">{metric.value}</div>
                    <div className="metric-label">{metric.label}</div>
                  </div>
                ))}
              </div>

              <div className="reviews-carousel reveal">
                <button className="carousel-btn review-nav" onClick={previousReviewSlide} aria-label="Testimonio anterior" type="button">&#8249;</button>
                <article className="review-shot review-shot-active">
                  <div className="review-shot-frame">
                    <Image src={testimonialGallery[reviewSlide].src} alt={testimonialGallery[reviewSlide].alt} width={1080} height={1920} style={{ objectFit: 'contain' }} />
                  </div>
                </article>
                <button className="carousel-btn review-nav" onClick={nextReviewSlide} aria-label="Siguiente testimonio" type="button">&#8250;</button>
              </div>

              <div className="review-thumbs reveal" role="tablist" aria-label="Clientes felices">
                {testimonialGallery.map((item, index) => (
                  <button
                    key={item.src}
                    className={`review-thumb${index === reviewSlide ? ' active' : ''}`}
                    onClick={() => goToReviewSlide(index)}
                    aria-label={`Ver cliente ${index + 1}`}
                    aria-pressed={index === reviewSlide}
                    type="button"
                  >
                    <span className="review-thumb-frame">
                      <Image src={item.src} alt={item.alt} width={260} height={360} style={{ objectFit: 'contain' }} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-section social-section" id="redes">
          <div className="section-shell">
            <div className="section-head reveal">
              <div className="section-tag">Redes y contacto</div>
              <h2 className="section-title">Seguinos donde<br /><em>se ve todo.</em></h2>
            </div>

            <div className="social-grid">
              <a href={facebookUrl} className="social-card social-card-primary reveal" {...externalLinkProps}>
                <span className="social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H7.5v3h2.8v8h3.2Z"/></svg>
                </span>
                <span className="social-eyebrow">Canal principal</span>
                <h3>Facebook Ecosommier</h3>
                <p>El canal más fuerte del emprendimiento. Ahí compartimos entregas, novedades y el movimiento real de cada venta.</p>
                <span className="social-link">Ir a Facebook</span>
              </a>

              <a href={instagramUrl} className="social-card reveal" {...externalLinkProps}>
                <span className="social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>
                </span>
                <span className="social-eyebrow">Contenido visual</span>
                <h3>Instagram</h3>
                <p>Mirá más fotos, publicaciones y seguí de cerca la identidad visual de Ecosommier.</p>
                <span className="social-link">Ver Instagram</span>
              </a>

              <div className="social-card social-contact-card reveal">
                <span className="social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h2.3a1.5 1.5 0 0 1 1.45 1.13l.7 2.8a1.5 1.5 0 0 1-.4 1.46l-1.24 1.24a15.8 15.8 0 0 0 5.04 5.04l1.24-1.24a1.5 1.5 0 0 1 1.46-.4l2.8.7A1.5 1.5 0 0 1 20 16.2v2.3A1.5 1.5 0 0 1 18.5 20h-1C9.6 20 4 14.4 4 7.5v-2Z"/></svg>
                </span>
                <span className="social-eyebrow">Contacto directo</span>
                <h3>Hablá con nosotros</h3>
                <div className="contact-lines">
                  <a href={whatsappHref('Hola, quiero asesoramiento para elegir un colchón Ecosommier.')} className="contact-line" {...externalLinkProps}>
                    <span className="contact-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.1 4.9A9.9 9.9 0 0 0 3.5 17.2L2 22l4.95-1.3A9.9 9.9 0 1 0 19.1 4.9Zm-7.2 15.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-2.9.76.78-2.82-.2-.3a8 8 0 1 1 7 3.78Zm4.39-6.03c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.16-1.38-1.3-1.62-.14-.24-.01-.37.11-.49.11-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.52.58.18 1.1.15 1.52.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>
                    </span>
                    <strong>WhatsApp</strong>
                    <span>+54 2302 62-1528</span>
                  </a>
                  <a href={`tel:${callNumber}`} className="contact-line">
                    <span className="contact-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18h2"/></svg>
                    </span>
                    <strong>Llamadas</strong>
                    <span>+54 2302 62-8744</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-shell">
          <div className="foot-brand">
            <div className="foot-brand-copy">
              <span className="foot-kicker">Descanso premium</span>
              <span className="foot-wordmark">Ecosommier</span>
            </div>
          </div>
        </div>
      </footer>

      <a
        className="wa-float"
        href={whatsappHref('Hola, quiero asesoramiento para elegir un colchón Ecosommier.')}
        {...externalLinkProps}
        aria-label="Contactar por WhatsApp"
      >
        💬
      </a>

      <div className={`cookie-banner${cookieShown ? ' show' : ''}`} role="dialog" aria-label="Aviso de cookies">
        <p>Usamos cookies mínimas para mejorar la experiencia del sitio. Podés aceptar todas o quedarte solo con las esenciales.</p>
        <div className="cookie-btns">
          <button className="cookie-accept" onClick={acceptCookies} type="button">Aceptar</button>
          <button className="cookie-reject" onClick={rejectCookies} type="button">Solo esenciales</button>
        </div>
      </div>
    </>
  )
}
