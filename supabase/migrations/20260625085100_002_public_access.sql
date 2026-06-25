-- Drop existing restrictive policies
DROP POLICY IF EXISTS "select_own_categories" ON categories;
DROP POLICY IF EXISTS "insert_own_categories" ON categories;
DROP POLICY IF EXISTS "update_own_categories" ON categories;
DROP POLICY IF EXISTS "delete_own_categories" ON categories;

DROP POLICY IF EXISTS "select_own_gilt_items" ON gilt_items;
DROP POLICY IF EXISTS "insert_own_gilt_items" ON gilt_items;
DROP POLICY IF EXISTS "update_own_gilt_items" ON gilt_items;
DROP POLICY IF EXISTS "delete_own_gilt_items" ON gilt_items;

DROP POLICY IF EXISTS "select_own_price_history" ON price_history;
DROP POLICY IF EXISTS "insert_own_price_history" ON price_history;
DROP POLICY IF EXISTS "delete_own_price_history" ON price_history;

-- Create public access policies (no authentication required)
CREATE POLICY "public_select_categories" ON categories FOR SELECT
  USING (true);
CREATE POLICY "public_insert_categories" ON categories FOR INSERT
  WITH CHECK (true);
CREATE POLICY "public_update_categories" ON categories FOR UPDATE
  USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_categories" ON categories FOR DELETE
  USING (true);

CREATE POLICY "public_select_gilt_items" ON gilt_items FOR SELECT
  USING (true);
CREATE POLICY "public_insert_gilt_items" ON gilt_items FOR INSERT
  WITH CHECK (true);
CREATE POLICY "public_update_gilt_items" ON gilt_items FOR UPDATE
  USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_gilt_items" ON gilt_items FOR DELETE
  USING (true);

CREATE POLICY "public_select_price_history" ON price_history FOR SELECT
  USING (true);
CREATE POLICY "public_insert_price_history" ON price_history FOR INSERT
  WITH CHECK (true);
CREATE POLICY "public_delete_price_history" ON price_history FOR DELETE
  USING (true);

-- Make user_id nullable since we won't have auth
ALTER TABLE categories ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE gilt_items ALTER COLUMN user_id DROP NOT NULL;