DROP POLICY IF EXISTS "settings public read" ON public.restaurant_settings;
DROP POLICY IF EXISTS "hours public read" ON public.opening_hours;
REVOKE SELECT ON public.restaurant_settings FROM anon, authenticated;
REVOKE SELECT ON public.opening_hours FROM anon, authenticated;
GRANT ALL ON public.restaurant_settings TO service_role;
GRANT ALL ON public.opening_hours TO service_role;

DROP POLICY IF EXISTS "items public read" ON public.menu_items;
CREATE POLICY "items public read available" ON public.menu_items
  FOR SELECT TO anon, authenticated USING (is_available = true);

DROP POLICY IF EXISTS "cats public read" ON public.menu_categories;
CREATE POLICY "cats public read with items" ON public.menu_categories
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.menu_items mi WHERE mi.category_id = menu_categories.id AND mi.is_available = true)
  );