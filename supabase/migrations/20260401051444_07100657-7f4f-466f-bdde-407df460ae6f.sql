-- Allow public read access to template-hub-pro
CREATE POLICY "Anyone can read template-hub-pro"
  ON public."template-hub-pro"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert template-hub-pro"
  ON public."template-hub-pro"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update template-hub-pro"
  ON public."template-hub-pro"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete template-hub-pro"
  ON public."template-hub-pro"
  FOR DELETE
  TO authenticated
  USING (true);