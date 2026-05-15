insert into public.departments (code, name, slug, sort_order)
values
  ('warehouse',        'Gudang',           'gudang',           1),
  ('finishing',        'Finishing',        'finishing',        2),
  ('design',           'Desain',           'desain',           3),
  ('printing',         'Printing',         'printing',         4),
  ('customer-service', 'Customer Service', 'customer-service', 5),
  ('logistics-driver', 'Logistik / Driver','logistik-driver',  6),
  ('offset',           'Offset',           'offset',           7)
on conflict (code) do nothing;
