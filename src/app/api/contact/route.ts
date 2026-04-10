import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, whatsapp } = body

    if (!nombre || !whatsapp) {
      return NextResponse.json({ error: 'Nombre y WhatsApp son requeridos.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from('orders').insert({
      customer_name:  nombre.trim(),
      customer_phone: whatsapp.trim(),
      status: 'nuevo',
      source: 'landing',
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact route]', err)
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 })
  }
}
