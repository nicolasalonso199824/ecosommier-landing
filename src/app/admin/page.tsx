'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type Product, type Order, type InventoryMovement } from '@/lib/supabase'

type Stats = { total: number; newOrders: number; activeProducts: number; lowStock: number }
type Tab = 'productos' | 'pedidos' | 'inventario'

const STATUS_LIST = ['nuevo','contactado','confirmado','enviado','entregado','cancelado'] as const
const STATUS_BADGE: Record<string,string> = { nuevo:'b-nuevo', contactado:'b-contactado', confirmado:'b-confirmado', enviado:'b-enviado', entregado:'b-entregado', cancelado:'b-cancelado' }

export default function AdminPage() {
  const [tab, setTab]           = useState<Tab>('productos')
  const [stats, setStats]       = useState<Stats>({ total:0, newOrders:0, activeProducts:0, lowStock:0 })
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders]     = useState<Order[]>([])
  const [movements, setMov]     = useState<InventoryMovement[]>([])
  const [filter, setFilter]     = useState('all')
  const [modal, setModal]       = useState<'product'|'inv'|null>(null)
  const [editProduct, setEditProduct] = useState<Partial<Product>>({})
  const [invForm, setInvForm]   = useState({ product_id:'', type:'entrada', quantity:0, reason:'' })

  const loadStats = useCallback(async () => {
    const [{ count: total }, { count: newOrders }, { data: prods }] = await Promise.all([
      supabase.from('orders').select('*', { count:'exact', head:true }),
      supabase.from('orders').select('*', { count:'exact', head:true }).eq('status','nuevo'),
      supabase.from('products').select('stock,active').eq('active', true),
    ])
    const lowStock = prods?.filter(p => p.stock < 3).length ?? 0
    setStats({ total: total??0, newOrders: newOrders??0, activeProducts: prods?.length??0, lowStock })
  }, [])

  const loadProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at')
    setProducts(data ?? [])
  }, [])

  const loadOrders = useCallback(async () => {
    const { data } = await supabase.from('orders').select('*, products(name)').order('created_at', { ascending:false })
    setOrders(data ?? [])
  }, [])

  const loadMov = useCallback(async () => {
    const { data } = await supabase.from('inventory_movements').select('*, products(name)').order('created_at', { ascending:false }).limit(100)
    setMov(data ?? [])
  }, [])

  useEffect(() => { loadStats(); loadProducts(); loadOrders(); loadMov() }, [loadStats, loadProducts, loadOrders, loadMov])

  // ── Products ──
  const updateField = async (id: string, field: 'price'|'stock', value: number) => {
    await supabase.from('products').update({ [field]: value }).eq('id', id)
    loadProducts(); loadStats()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('products').update({ active: !current }).eq('id', id)
    loadProducts(); loadStats()
  }

  const saveProduct = async () => {
    const { id, name, description, price, stock } = editProduct
    if (!name || !price || stock === undefined) return alert('Completá nombre, precio y stock.')
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
    if (id) {
      await supabase.from('products').update({ name, description, price, stock }).eq('id', id)
    } else {
      const { error } = await supabase.from('products').insert({ name, slug, description, price, stock })
      if (error) return alert('Error: ' + error.message)
    }
    setModal(null); setEditProduct({}); loadProducts(); loadStats()
  }

  // ── Orders ──
  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as Order['status'] } : o))
    loadStats()
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  // ── Inventory ──
  const saveMovement = async () => {
    const { product_id, type, quantity, reason } = invForm
    if (!product_id || quantity < 1) return alert('Completá producto y cantidad.')
    await supabase.from('inventory_movements').insert({ product_id, type, quantity, reason })
    const prod = products.find(p => p.id === product_id)
    if (prod) {
      const newStock = type === 'entrada' ? prod.stock + quantity : Math.max(0, prod.stock - quantity)
      await supabase.from('products').update({ stock: newStock }).eq('id', product_id)
    }
    setModal(null); setInvForm({ product_id:'', type:'entrada', quantity:0, reason:'' })
    loadProducts(); loadMov(); loadStats()
  }

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#050D1A;--bg2:#0B1829;--bg3:#112240;--blue:#3B82F6;--sky:#93C5FD;--white:#fff;--muted:rgba(255,255,255,.5);--border:rgba(147,197,253,.1);--success:#10b981;--warning:#f59e0b;--danger:#ef4444;--r:10px}
        body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--white);min-height:100vh}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;background:var(--bg2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:10}
        .topbar-logo{font-size:1.1rem;font-weight:700}.topbar-logo span{color:var(--sky)}
        .badge-admin{font-size:.72rem;color:var(--sky);background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);padding:.25rem .7rem;border-radius:50px}
        .statsbar{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--border);border-bottom:1px solid var(--border)}
        .sbox{background:var(--bg2);padding:1.1rem 1.5rem}.sbox .n{font-size:1.8rem;font-weight:700;color:var(--sky)}.sbox .l{font-size:.73rem;color:var(--muted);margin-top:.15rem}
        .sbox.warn .n{color:var(--warning)}.sbox.err .n{color:var(--danger)}
        .tabs{display:flex;border-bottom:1px solid var(--border);padding:0 2rem;background:var(--bg2)}
        .tab{background:none;border:none;color:var(--muted);padding:.9rem 1.3rem;font-size:.88rem;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;transition:color .2s}
        .tab.active{color:var(--sky);border-bottom-color:var(--sky)}.tab:hover{color:var(--white)}
        .panel{padding:1.8rem 2rem}.panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;flex-wrap:wrap;gap:.8rem}
        .panel-header h2{font-size:1rem;font-weight:600}
        .btn-add{background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff;border:none;padding:.5rem 1.2rem;border-radius:50px;font-size:.82rem;font-weight:600;cursor:pointer}
        .tbl-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:.85rem}
        th{text-align:left;padding:.65rem 1rem;color:var(--muted);font-weight:500;border-bottom:1px solid var(--border);white-space:nowrap}
        td{padding:.65rem 1rem;border-bottom:1px solid rgba(147,197,253,.05);vertical-align:middle}
        tr:hover td{background:rgba(255,255,255,.015)}
        .badge{display:inline-block;padding:.2rem .65rem;border-radius:50px;font-size:.72rem;font-weight:600}
        .b-nuevo{background:rgba(59,130,246,.15);color:#93c5fd}.b-contactado{background:rgba(245,158,11,.15);color:#fcd34d}
        .b-confirmado{background:rgba(16,185,129,.15);color:#6ee7b7}.b-enviado{background:rgba(139,92,246,.15);color:#c4b5fd}
        .b-entregado{background:rgba(34,197,94,.15);color:#86efac}.b-cancelado{background:rgba(239,68,68,.15);color:#fca5a5}
        .b-activo{background:rgba(16,185,129,.15);color:#6ee7b7}.b-inactivo{background:rgba(239,68,68,.15);color:#fca5a5}
        .ii{background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:6px;color:var(--white);padding:.28rem .55rem;font-size:.84rem;width:88px;outline:none}
        .btn-save{background:var(--success);border:none;color:#fff;padding:.28rem .65rem;border-radius:6px;font-size:.76rem;cursor:pointer;margin-left:.25rem}
        .btn-act{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;padding:.28rem .65rem;border-radius:6px;font-size:.76rem;cursor:pointer;margin-left:.25rem}
        .sel-status{background:var(--bg3);border:1px solid var(--border);color:var(--white);padding:.3rem .5rem;border-radius:6px;font-size:.78rem;cursor:pointer;outline:none}
        .filters{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.1rem}
        .fbtn{background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--muted);padding:.32rem .85rem;border-radius:50px;font-size:.76rem;cursor:pointer}
        .fbtn.active{background:rgba(59,130,246,.15);border-color:rgba(59,130,246,.4);color:var(--sky)}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center}
        .modal{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:2rem;width:100%;max-width:420px}
        .modal h3{font-size:1rem;font-weight:600;margin-bottom:1.3rem}
        .fg{margin-bottom:.9rem}.fg label{font-size:.78rem;color:var(--muted);display:block;margin-bottom:.4rem}
        .fg input,.fg select{width:100%;padding:.7rem;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:#fff;font-size:.88rem;outline:none}
        .fg select option{background:var(--bg2)}
        .mbtns{display:flex;gap:.7rem;margin-top:1.3rem}
        .btn-primary{flex:1;padding:.85rem;border:none;border-radius:var(--r);font-size:.92rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff}
        .btn-cancel{flex:1;padding:.85rem;border:none;border-radius:var(--r);font-size:.92rem;font-weight:600;cursor:pointer;background:rgba(255,255,255,.07);color:#fff}
        .empty{text-align:center;padding:3rem;color:var(--muted)}.empty .ei{font-size:2.2rem;margin-bottom:.6rem}.empty p{font-size:.85rem}
      `}</style>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-logo">Eco<span>sommier</span> <span style={{ fontSize:'.75rem', fontWeight:400, color:'var(--muted)' }}>Admin</span></div>
        <div style={{ display:'flex', gap:'.8rem', alignItems:'center' }}>
          <span className="badge-admin">Panel de gestión</span>
        </div>
      </div>

      {/* STATS */}
      <div className="statsbar">
        <div className="sbox"><div className="n">{stats.total}</div><div className="l">Pedidos totales</div></div>
        <div className="sbox warn"><div className="n">{stats.newOrders}</div><div className="l">Leads nuevos</div></div>
        <div className="sbox"><div className="n">{stats.activeProducts}</div><div className="l">Productos activos</div></div>
        <div className={`sbox${stats.lowStock > 0 ? ' err' : ''}`}><div className="n">{stats.lowStock}</div><div className="l">Stock bajo (&lt;3 unid.)</div></div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {(['productos','pedidos','inventario'] as Tab[]).map(t => (
          <button key={t} className={`tab${tab===t?' active':''}`} onClick={() => setTab(t)}>
            {t==='productos'?'📦 Productos':t==='pedidos'?'📋 Pedidos':'📊 Inventario'}
          </button>
        ))}
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === 'productos' && (
        <div className="panel">
          <div className="panel-header">
            <h2>Productos</h2>
            <button className="btn-add" onClick={() => { setEditProduct({}); setModal('product') }}>+ Nuevo producto</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Precio ($ARS)</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="empty"><div className="ei">📦</div><p>Sin productos</p></td></tr>
                ) : products.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong><br/><span style={{fontSize:'.75rem',color:'var(--muted)'}}>{p.description}</span></td>
                    <td>
                      <input className="ii" type="number" defaultValue={p.price} id={`price-${p.id}`} style={p.stock<3?{borderColor:'var(--danger)'}:{}}/>
                      <button className="btn-save" onClick={() => { const el = document.getElementById(`price-${p.id}`) as HTMLInputElement; updateField(p.id,'price',parseFloat(el.value)) }}>✓</button>
                    </td>
                    <td>
                      <input className="ii" type="number" defaultValue={p.stock} id={`stock-${p.id}`}/>
                      <button className="btn-save" onClick={() => { const el = document.getElementById(`stock-${p.id}`) as HTMLInputElement; updateField(p.id,'stock',parseInt(el.value)) }}>✓</button>
                    </td>
                    <td><span className={`badge ${p.active?'b-activo':'b-inactivo'}`}>{p.active?'Activo':'Inactivo'}</span></td>
                    <td>
                      <button className="btn-act" onClick={() => { setEditProduct(p); setModal('product') }}>Editar</button>
                      <button className="btn-act" style={{color:p.active?'#fca5a5':'#6ee7b7'}} onClick={() => toggleActive(p.id, p.active)}>{p.active?'Desactivar':'Activar'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === 'pedidos' && (
        <div className="panel">
          <div className="panel-header"><h2>Pedidos y Leads</h2></div>
          <div className="filters">
            {['all','nuevo','contactado','confirmado','entregado','cancelado'].map(f => (
              <button key={f} className={`fbtn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Cliente</th><th>WhatsApp</th><th>Producto</th><th>Estado</th></tr></thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={5} className="empty"><div className="ei">📋</div><p>Sin pedidos</p></td></tr>
                ) : filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{whiteSpace:'nowrap'}}>{new Date(o.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})}</td>
                    <td><strong>{o.customer_name}</strong></td>
                    <td><a href={`https://wa.me/${o.customer_phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{color:'var(--sky)',textDecoration:'none'}}>📱 {o.customer_phone}</a></td>
                    <td>{o.products?.name ?? o.notes ?? '—'}</td>
                    <td>
                      <select className="sel-status" value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                        {STATUS_LIST.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── INVENTORY TAB ── */}
      {tab === 'inventario' && (
        <div className="panel">
          <div className="panel-header">
            <h2>Movimientos de inventario</h2>
            <button className="btn-add" onClick={() => setModal('inv')}>+ Registrar movimiento</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th></tr></thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr><td colSpan={5} className="empty"><div className="ei">📊</div><p>Sin movimientos</p></td></tr>
                ) : movements.map(m => (
                  <tr key={m.id}>
                    <td style={{whiteSpace:'nowrap'}}>{new Date(m.created_at).toLocaleString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})}</td>
                    <td>{m.products?.name ?? '—'}</td>
                    <td><span className={`badge ${m.type==='entrada'?'b-activo':'b-cancelado'}`}>{m.type}</span></td>
                    <td>{m.type==='entrada'?'+':'−'}{m.quantity}</td>
                    <td>{m.reason ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Product */}
      {modal === 'product' && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h3>{editProduct.id ? 'Editar producto' : 'Nuevo producto'}</h3>
            {[['Nombre','text','name'],['Descripción','text','description'],['Precio ($ARS)','number','price'],['Stock','number','stock']].map(([label,type,key]) => (
              <div key={key} className="fg">
                <label>{label}</label>
                <input type={type} value={(editProduct as Record<string,unknown>)[key] as string ?? ''} onChange={e => setEditProduct(prev => ({ ...prev, [key]: type === 'number' ? +e.target.value : e.target.value }))} placeholder={label}/>
              </div>
            ))}
            <div className="mbtns">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={saveProduct}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Inventory */}
      {modal === 'inv' && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h3>Registrar movimiento</h3>
            <div className="fg"><label>Producto</label>
              <select value={invForm.product_id} onChange={e => setInvForm(p => ({ ...p, product_id: e.target.value }))}>
                <option value="">Seleccioná un producto</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="fg"><label>Tipo</label>
              <select value={invForm.type} onChange={e => setInvForm(p => ({ ...p, type: e.target.value }))}>
                <option value="entrada">Entrada (stock entra)</option>
                <option value="salida">Salida (stock sale)</option>
              </select>
            </div>
            <div className="fg"><label>Cantidad</label><input type="number" value={invForm.quantity || ''} onChange={e => setInvForm(p => ({ ...p, quantity: +e.target.value }))} placeholder="5"/></div>
            <div className="fg"><label>Motivo</label><input type="text" value={invForm.reason} onChange={e => setInvForm(p => ({ ...p, reason: e.target.value }))} placeholder="Ej: Compra proveedor"/></div>
            <div className="mbtns">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={saveMovement}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
