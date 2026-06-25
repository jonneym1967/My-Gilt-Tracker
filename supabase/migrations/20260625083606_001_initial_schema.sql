-- Categories for organizing gilt items
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main gilt tracking items
CREATE TABLE gilt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  isin TEXT,
  issuer TEXT,
  face_value DECIMAL(15,2),
  current_value DECIMAL(15,2),
  purchase_date DATE,
  maturity_date DATE,
  coupon_rate DECIMAL(5,4),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history tracking
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gilt_item_id UUID REFERENCES gilt_items(id) ON DELETE CASCADE,
  price DECIMAL(15,2) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gilt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "select_own_categories" ON categories FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_categories" ON categories FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_categories" ON categories FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for gilt_items
CREATE POLICY "select_own_gilt_items" ON gilt_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_gilt_items" ON gilt_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_gilt_items" ON gilt_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_gilt_items" ON gilt_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for price_history (derived from gilt_items ownership)
CREATE POLICY "select_own_price_history" ON price_history FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM gilt_items WHERE gilt_items.id = price_history.gilt_item_id AND gilt_items.user_id = auth.uid())
  );
CREATE POLICY "insert_own_price_history" ON price_history FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM gilt_items WHERE gilt_items.id = price_history.gilt_item_id AND gilt_items.user_id = auth.uid())
  );
CREATE POLICY "delete_own_price_history" ON price_history FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM gilt_items WHERE gilt_items.id = price_history.gilt_item_id AND gilt_items.user_id = auth.uid())
  );

-- Index for performance
CREATE INDEX idx_gilt_items_user_id ON gilt_items(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_price_history_gilt_item_id ON price_history(gilt_item_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gilt_items_updated_at
  BEFORE UPDATE ON gilt_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();