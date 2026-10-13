alter table public.menu_items
  add column is_demo boolean not null default false,
  add column feature_image_url text,
  add column is_spicy boolean,
  add column is_vegetarian boolean;
alter table public.menu_categories add column is_demo boolean not null default false;

with c as (
  insert into public.menu_categories (name, position, is_demo) values
  ('Entradas',1,true),('Pratos Principais',2,true),('Especialidades Africanas',3,true),
  ('Acompanhamentos',4,true),('Sobremesas',5,true),('Bebidas',6,true)
  returning id, name
)
insert into public.menu_items (category_id, name, description, image_url, feature_image_url, is_special, position, is_demo)
select c.id, v.name, v.descr, v.img, v.feat, v.special, v.pos, true
from c join (values
  ('Entradas','Chamuças','Um petisco muito presente nas mesas lusófonas africanas, ideal para partilhar.','/images/menu/chamucas.jpg',null,false,1),
  ('Pratos Principais','Peixe grelhado com acompanhamentos','Peixe na grelha, servido à maneira africana com acompanhamentos tradicionais.','/images/menu/peixe.jpg',null,false,1),
  ('Pratos Principais','Feijoada à moda angolana','A versão angolana de um prato de conforto, cozinhado lentamente.','/images/menu/feijoada.jpg',null,false,2),
  ('Pratos Principais','Mufete','Um prato emblemático de Luanda, pensado para ser partilhado à mesa.','/images/menu/mufete.jpg',null,false,3),
  ('Especialidades Africanas','Moamba de galinha','O prato que muitos consideram a alma da cozinha angolana.','/images/menu/moamba.jpg','/images/menu/feature-moamba.jpg',true,1),
  ('Especialidades Africanas','Calulu','Receita tradicional de Angola e São Tomé, passada de geração em geração.','/images/menu/calulu.jpg','/images/menu/feature-calulu.jpg',true,2),
  ('Especialidades Africanas','Muamba com funge','A combinação clássica que reúne a família à volta da mesa.','/images/menu/funge.jpg','/images/menu/feature-funge.jpg',true,3),
  ('Acompanhamentos','Banana-pão frita','Um acompanhamento indispensável em muitas cozinhas africanas.','/images/menu/banana.jpg',null,false,1),
  ('Sobremesas','Cocada','Um doce tradicional, simples e cheio de memória.','/images/menu/cocada.jpg',null,false,1),
  ('Bebidas','Bebida de hibisco','Uma bebida refrescante muito apreciada em várias regiões de África.','/images/menu/bissap.jpg',null,false,1)
) as v(cat,name,descr,img,feat,special,pos) on v.cat = c.name;