'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

// ── Floating stars (client only) ──────────────────────
function StarField({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('div')
      s.className = 'star'
      const size = Math.random() * 2.5 + .5
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;--d:${2+Math.random()*4}s;--dl:${Math.random()*4}s`
      ref.current.appendChild(s)
    }
  }, [])
  return <div className="stars-canvas" id={id} ref={ref} />
}

// ── Mattress component ─────────────────────────────────
function Mattress({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`mattress ${className}`} style={style}>
      <div className="mat-top">
        <div className="mat-layers">
          <div className="mat-layer l1" /><div className="mat-layer l2" />
          <div className="mat-layer l3" /><div className="mat-layer l4" />
        </div>
      </div>
      <div className="mat-side" />
      <div className="mat-glow" />
    </div>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formState, setFormState] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const [slide, setSlide] = useState(0)
  const heroImages = ['/hero.jpg','/galeria1.jpg','/galeria2.jpg','/galeria4.jpg','/galeria5.jpg']
  const [cookieShown, setCookieShown] = useState(false)
  const nameRef  = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID

  // Scroll reveal
  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 90)
          ro.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => ro.observe(el))
    return () => ro.disconnect()
  }, [])

  // Cookie banner
  useEffect(() => {
    if (!localStorage.getItem('eco_cookie_consent')) {
      setTimeout(() => setCookieShown(true), 1500)
    }
  }, [])

  // Product card tilt
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.prod-card')
    const handlers: Array<{ el: HTMLElement; mm: (e: MouseEvent) => void; ml: () => void }> = []
    cards.forEach(card => {
      const mm = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width  - .5
        const y = (e.clientY - r.top)  / r.height - .5
        card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-y*8}deg) rotateY(${x*8}deg)`
      }
      const ml = () => { card.style.transform = ''; card.style.transition = 'transform .5s ease'; setTimeout(() => { card.style.transition = '' }, 500) }
      card.addEventListener('mousemove', mm)
      card.addEventListener('mouseleave', ml)
      handlers.push({ el: card, mm, ml })
    })
    return () => handlers.forEach(({ el, mm, ml }) => { el.removeEventListener('mousemove', mm); el.removeEventListener('mouseleave', ml) })
  }, [])

  // Close menu on resize
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nombre   = nameRef.current?.value.trim() ?? ''
    const whatsapp = phoneRef.current?.value.trim() ?? ''
    if (nombre.length < 2 || whatsapp.length < 6) return
    setFormState('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target as HTMLFormElement),
      })
      if (res.ok) {
        setFormState('ok')
        supabase.from('orders').insert({ customer_name: nombre, customer_phone: whatsapp, status: 'nuevo', source: 'landing' })
          .then(({ error }) => { if (error) console.warn('Supabase:', error.message) })
      } else { setFormState('error') }
    } catch { setFormState('error') }
  }

  const testimonials = [
    { q: '"Nunca pensé que un colchón podría cambiar tanto mi calidad de vida. Duermo 8 horas de corrido y me levanto sin dolores."', name: 'María González', city: 'Buenos Aires', i: 'M' },
    { q: '"Las 100 noches de prueba me dieron tranquilidad total. No lo devolvería por nada."', name: 'Carlos Méndez', city: 'Córdoba', i: 'C' },
    { q: '"Suave para mí, firme para mi marido. El Nature resuelve los dos estilos perfectamente."', name: 'Laura Ríos', city: 'Rosario', i: 'L' },
    { q: '"Llevaba años con dolor lumbar. Con el Ortho desapareció en la primera semana."', name: 'Javier Ortiz', city: 'Mendoza', i: 'J' },
    { q: '"El Luxe es una obra de arte. La calidad se siente desde el primer contacto."', name: 'Sofía Bermúdez', city: 'Mar del Plata', i: 'S' },
    { q: '"La entrega fue rapidísima, instalaron todo y se llevaron el colchón viejo. 10/10."', name: 'Roberto Sanz', city: 'Tucumán', i: 'R' },
  ]
  const testiDouble = [...testimonials, ...testimonials]

  return (
    <>
      {/* NAV */}
      <nav role="navigation" aria-label="Menú principal">
        <a href="#hero" className="logo" aria-label="Ecosommier - Inicio">
          <div className="logo-img-wrap">
            <Image src="/logo.png" alt="Ecosommier" width={62} height={62} priority style={{ objectFit: 'contain' }} />
          </div>
          <span className="logo-name">Ecosommier</span>
        </a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
          {['#products','#eco','#testimonials'].map((href, i) => (
            <li key={href}><a href={href} onClick={() => setMenuOpen(false)}>{['Colección','Eco','Reseñas'][i]}</a></li>
          ))}
          <li><a href="#cta" className="nav-btn" onClick={() => setMenuOpen(false)}>Consultar →</a></li>
        </ul>
        <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </nav>

      {/* HERO */}
      <section className="snap-section" id="hero">
        <StarField id="s-hero" />
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="reveal">Dormí mejor.</span><br/>
            <span className="line2 reveal">Viví en armonía.</span>
          </h1>
          <p className="hero-sub reveal">Ecosommier une el bienestar del sueño profundo con materiales ecológicos de alta gama. Cada colchón diseñado para transformar tu descanso.</p>
          <div className="hero-actions reveal">
            <a href="#products" className="btn-main">Ver colección</a>
            <a href="#cta" className="btn-ghost">Asesoría gratuita</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-mat-wrap">
            <div className="hero-carousel">
              <button className="carousel-btn" onClick={() => setSlide(i => (i - 1 + heroImages.length) % heroImages.length)} aria-label="Anterior">&#8249;</button>
              <div>
                <div className="hero-colchon-img">
                  <Image src={heroImages[slide]} alt={`Colchón Ecosommier ${slide + 1}`} width={480} height={380} priority style={{ objectFit: 'cover', borderRadius: '16px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.5))', animation: 'floatImg 5s ease-in-out infinite' }} />
                </div>
                <div className="carousel-dots">
                  {heroImages.map((_, i) => (
                    <div key={i} className={`carousel-dot${i === slide ? ' active' : ''}`} onClick={() => setSlide(i)} />
                  ))}
                </div>
              </div>
              <button className="carousel-btn" onClick={() => setSlide(i => (i + 1) % heroImages.length)} aria-label="Siguiente">&#8250;</button>
            </div>
            <div className="hero-badges hero-badges-low">
              {[['🌙','Sueño profundo','4.5s','0s'],['🛡️','5 años garantía','5s','.6s']].map(([ico,txt,bf,bfd]) => (
                <div key={txt} className="h-badge" style={{ ['--bf' as string]: bf, ['--bfd' as string]: bfd }}>
                  <span className="ico">{ico}</span><span className="txt">{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="scroll-hint" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
          <span>Descubrir</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="snap-section" id="products">
        <StarField id="s-prod" />
        <div className="prod-header reveal">
          <div className="section-tag">Nuestra colección</div>
          <h2 className="section-title">Elegí tu colchón<br/><em>perfecto</em></h2>
        </div>
        <div className="prod-grid">
          {[
            { id: 'eco-platino', name: 'Ecosommier Platino', desc: 'Confort accesible con calidad Ecosommier. Ideal para empezar a dormir mejor sin resignar soporte.', badge: '', badgeStyle: {}, img: '/platino.png' },
            { id: 'eco-confort', name: 'Ecosommier Confort', desc: 'El equilibrio perfecto entre suavidad y firmeza. Resortes ensacados y capas de alta densidad.', badge: 'Más vendido', badgeStyle: {}, img: '/confort.png' },
            { id: 'eco-premium', name: 'Ecosommier Premium', desc: 'Nuestra línea superior. Máximo soporte, materiales de primera y terminaciones de lujo para el mejor descanso.', badge: 'Premium', badgeStyle: { background: 'linear-gradient(135deg,#b8892c,#c9a84c)' }, img: '/premium.png' },
          ].map(p => (
            <div key={p.id} className="prod-card reveal" id={p.id} data-product-id={p.id} data-product-name={p.name} tabIndex={0} role="article" aria-label={p.name}>
              <div className="prod-visual pv-blue">
                <Image src={p.img} alt={p.name} width={320} height={200} style={{ objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.4))' }} />
                {p.badge && <div className="prod-badge" style={p.badgeStyle}>{p.badge}</div>}
              </div>
              <div className="prod-body">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="prod-footer">
                  <a href={`https://wa.me/542302621528?text=${encodeURIComponent('Hola, me interesa este modelo de colchón')}`} target="_blank" rel="noopener noreferrer" className="btn-main prod-wa-btn">Consultar por WhatsApp →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ECO */}
      <section className="snap-section" id="eco">
        <StarField id="s-eco" />
        <div className="eco-left reveal-l">
          <div className="section-tag">Nuestro compromiso</div>
          <h2 className="section-title">Bien para ti.<br/><em>Bien para el planeta.</em></h2>
          <p>Cada decisión en Ecosommier está guiada por el respeto al medioambiente. Producimos localmente, usamos energía renovable y elegimos proveedores responsables.</p>
          <a href="#cta" className="btn-main">Quiero saber más</a>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="snap-section" id="testimonials">
        <StarField id="s-testi" />
        <div className="testi-header reveal">
          <div className="section-tag">Lo que dicen</div>
          <h2 className="section-title">Más de 500 familias<br/><em>duermen mejor</em></h2>
        </div>
        <div className="testi-runner reveal">
          <div className="testi-track">
            {testiDouble.map((t, i) => (
              <div key={i} className="t-card">
                <div className="t-stars">★★★★★</div>
                <blockquote>{t.q}</blockquote>
                <div className="t-author">
                  <div className="t-avatar">{t.i}</div>
                  <div><div className="t-name">{t.name}</div><div className="t-city">{t.city}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="testi-numbers reveal">
          {[['500+','Clientes felices'],['★ 4.9','Valoración media'],['100%','Natural & Eco'],['10 años','Garantía']].map(([n,l]) => (
            <div key={l} className="t-num"><div className="n">{n}</div><div className="l">{l}</div></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="snap-section" id="cta">
        <StarField id="s-cta" />
        <div className="cta-inner">
          <div className="section-tag reveal">Empezá hoy</div>
          <h2 className="reveal">¿Listo para tu<br/><span>mejor noche de sueño?</span></h2>
          <p className="reveal">Dejanos tu contacto y un asesor especializado te ayuda a encontrar el colchón ideal para vos. Sin compromiso.</p>
          <form className="cta-form reveal" id="contactForm" action={`https://formspree.io/f/${formspreeId}`} method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="🛏️ Nuevo lead Ecosommier"/>
            <input type="hidden" name="_replyto" value="ni_co801@hotmail.com"/>
            <input ref={nameRef}  type="text" name="nombre"   placeholder="Tu nombre"   required autoComplete="name"/>
            <input ref={phoneRef} type="tel"  name="whatsapp" placeholder="Tu WhatsApp" required autoComplete="tel"/>
            <button type="submit" disabled={formState === 'sending' || formState === 'ok'}
              style={ formState === 'ok' ? { background: 'linear-gradient(135deg,#059669,#10b981)' } : formState === 'error' ? { background: 'linear-gradient(135deg,#dc2626,#ef4444)' } : {} }>
              { formState === 'idle'    ? 'Quiero asesoría gratis →'
              : formState === 'sending' ? 'Enviando...'
              : formState === 'ok'      ? '✓ ¡Te contactamos pronto!'
              :                           'Error, intentá de nuevo' }
            </button>
          </form>
          <div className="cta-trust reveal">
            <span>🔒 Sin spam</span>
            <span>⚡ Respuesta en menos de 1 hora</span>
            <span>🎁 Asesoría 100% gratuita</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-logo"><Image src="/logo.png" alt="Ecosommier" width={90} height={90} style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'invert(1)' }} /></div>
        <div className="foot-copy">© 2026 Ecosommier · Todos los derechos reservados</div>
        <div className="foot-links">
          {['#products','#eco','#cta'].map((href,i) => (
            <a key={href} href={href}>{['Colección','Eco','Contacto'][i]}</a>
          ))}
        </div>
      </footer>

      {/* WA */}
      <a className="wa-float" href={`https://wa.me/542302621528?text=${encodeURIComponent('Hola, me interesa este modelo de colchón')}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">💬</a>

      {/* COOKIE */}
      <div className={`cookie-banner${cookieShown ? ' show' : ''}`} role="dialog" aria-label="Aviso de cookies">
        <p>Usamos cookies para mejorar tu experiencia. <a href="#">Política de privacidad</a>.</p>
        <div className="cookie-btns">
          <button className="cookie-accept" onClick={() => { localStorage.setItem('eco_cookie_consent','all'); setCookieShown(false) }}>Aceptar</button>
          <button className="cookie-reject" onClick={() => { localStorage.setItem('eco_cookie_consent','essential'); setCookieShown(false) }}>Solo esenciales</button>
        </div>
      </div>
    </>
  )
}
