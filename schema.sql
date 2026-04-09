-- ══════════════════════════════════════════════════════
--  ECOSOMMIER — Schema Supabase
--  Correr en: Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════

-- ── PRODUCTOS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  price       NUMERIC(12,2) NOT NULL,
  stock       INTEGER     DEFAULT 0,
  category    TEXT        DEFAULT 'colchones',
  active      BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PEDIDOS / LEADS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name  TEXT        NOT NULL,
  customer_phone TEXT        NOT NULL,
  customer_email TEXT,
  product_id     UUID        REFERENCES products(id) ON DELETE SET NULL,
  quantity       INTEGER     DEFAULT 1,
  total          NUMERIC(12,2),
  status         TEXT        DEFAULT 'nuevo'
                             CHECK (status IN ('nuevo','contactado','confirmado','enviado','entregado','cancelado')),
  notes          TEXT,
  source         TEXT        DEFAULT 'landing',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── MOVIMIENTOS DE INVENTARIO ──────────────────────────
CREATE TABLE IF NOT EXISTS inventory_movements (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID        REFERENCES products(id) ON DELETE CASCADE,
  type        TEXT        CHECK (type IN ('entrada','salida')),
  quantity    INTEGER     NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── DATOS INICIALES ────────────────────────────────────
INSERT INTO products (name, slug, description, price, stock) VALUES
  ('Ecosommier Nature', 'nature', 'Equilibrio perfecto entre suavidad y soporte. Látex natural + resortes ensacados.', 89990, 10),
  ('Ecosommier Luxe',   'luxe',   'Línea de lujo. Lana merino + algodón egipcio + 1000 resortes ensacados.',           149990, 5),
  ('Ecosommier Ortho',  'ortho',  'Diseñado con fisioterapeutas para soporte lumbar y cervical superior.',              119990, 8)
ON CONFLICT (slug) DO NOTHING;

-- ── SEGURIDAD (Row Level Security) ────────────────────
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements  ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer productos activos (para mostrar en la tienda)
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  USING (active = true);

-- Cualquiera puede insertar pedidos (desde el formulario de la landing)
CREATE POLICY "public_insert_orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Solo usuarios autenticados (admin) pueden hacer todo
CREATE POLICY "admin_all_products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_inventory"
  ON inventory_movements FOR ALL
  USING (auth.role() = 'authenticated');
