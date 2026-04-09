# Ecosommier — Landing Page

Landing page de [Ecosommier](https://ecosommier-landing.vercel.app), emprendimiento de colchones premium naturales.

---

## Stack

- HTML + CSS + JS vanilla (sin dependencias)
- Hosting: [Vercel](https://vercel.com) — auto-deploy desde GitHub
- Formulario: [Formspree](https://formspree.io)

---

## Setup del formulario (Formspree)

El formulario de contacto envía leads a `ni_co801@hotmail.com`.

**Pasos para activarlo:**

1. Crear cuenta gratuita en [formspree.io](https://formspree.io)
2. Crear un nuevo formulario → copiar el ID (formato: `xyzxyzxy`)
3. En `index.html`, buscar esta línea:
   ```html
   action="https://formspree.io/f/xojpzpnk"
   ```
4. Reemplazar `REEMPLAZAR_CON_TU_ID` con tu ID real
5. Hacer `git push` — Vercel redeploya automaticamente

---

## Deploy

Cualquier push a `master` redeploya la pagina automaticamente en Vercel.

```bash
# Ver la pagina localmente
# Abrir index.html en el navegador (no necesita servidor)

# Subir cambios
git add index.html
git commit -m "descripcion del cambio"
git push
```

---

## Estructura del proyecto

```
/
├── index.html       # Todo el sitio (HTML + CSS + JS)
├── .gitignore
├── .vercel/         # Config local de Vercel (no se sube)
└── README.md
```

---

## Configuraciones pendientes

| Tarea | Archivo | Que cambiar |
|---|---|---|
| Formspree | `index.html` | `REEMPLAZAR_CON_TU_ID` |
| WhatsApp | `index.html` | `5491100000000` → tu numero real |
| Dominio propio | Vercel dashboard | Agregar dominio custom |
| Google Analytics | `index.html` | Descomentar bloque GA4, poner `G-XXXXXXXXXX` |
| Meta Pixel | `index.html` | Descomentar bloque Pixel, poner tu ID |
| URL canonical / OG | `index.html` | Reemplazar `ecosommier.com` con tu dominio |

---

## Contacto

**Nicolas Alonso** — ni_co801@hotmail.com
