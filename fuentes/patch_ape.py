#!/usr/bin/env python3
"""Convierte la demo Urban en «Accesorios para Ellos» (accesorios + ropa de temporada, TikTok).
Orden: 1) python3 fuentes/patch_ur.py  2) python3 fuentes/patch_ape.py"""
import re,sys,os
here=os.path.dirname(os.path.abspath(__file__))
path=sys.argv[1] if len(sys.argv)>1 else os.path.join(here,'..','index.html')
s=open(path,encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c>=1,('no encontrado',a[:80])
    if n and c!=n: print('AVISO',c,'ocurrencias (esperaba',n,')',a[:60])
    s=s.replace(a,b)
# ---- categorías (accesorios primero) ----
i=s.index('function nlCats(){return[');j=s.index("alcohol:false}];}",i)+len("alcohol:false}];}")
# sin ropa: el comercio vende accesorios (gorras, relojes, cadenas, anillos, pulseras, lentes, marroquinería) y calzado
C=[('nl-rel','Relojes','#0a0a0a','Relojes'),('nl-gor','Gorras y gorros','#2b2b2b','Gorras'),('nl-ani','Cadenas, anillos y pulseras','#4a4a4a','Joyería'),('nl-len','Lentes de sol','#686868','Lentes'),('nl-acc','Billeteras, cintos y carteras','#868686','Accesorios'),
 ('nl-cal','Calzado','#a4a4a4','Calzado')]
s=s[:i]+"function nlCats(){return["+",\n ".join("{id:'%s',name:'%s',color:'%s',mNom:'%s',mTitle:'%s',layout:'grid',alcohol:false}"%(a,b,c,d,b) for a,b,c,d in C)+"];}"+s[j:]
rep("floral:['Floral','#c96a85']}","floral:['Floral','#c96a85'],dorado:['Dorado','#c9a24a'],plata:['Plata','#c4c6cc'],marron:['Marrón','#6b4a2f']}")
# ---- promociones, cupón de bienvenida, textos ----
rep("{id:'pr-2x1',name:'2x1 en remeras básicas',type:'2x1',fam:['rem-bas','rem-rib'],on:true,note:'Llevás 2 remeras de estos modelos y la de menor precio va sin cargo (ejemplo).'}",
    "{id:'pr-2x1',name:'2x1 en gorras',type:'2x1',fam:['gor-bei','gor-tru'],on:true,note:'Llevás 2 gorras de estos modelos y la de menor precio va sin cargo (ejemplo).'}")
rep("name:'Volumen: 3 prendas o más −15 %',type:'vol',min:3,pct:15,cats:['nl-rem','nl-cam','nl-pan','nl-ves'],on:true,note:'Desde 3 prendas de estas categorías, 15 % de descuento (ejemplo).'}",
    "name:'Volumen: 3 productos o más −15 %',type:'vol',min:3,pct:15,cats:['nl-gor','nl-rel','nl-ani','nl-len','nl-acc'],on:true,note:'Desde 3 productos de estas categorías, 15 % de descuento (ejemplo).'}")
rep("ac=el.filter(x=>x.p.rubro==='nl-acc');","ac=el.filter(x=>['nl-acc','nl-gor','nl-rel','nl-ani','nl-len'].includes(x.p.rubro));")
rep("{id:'cp1',code:'BIENVENIDA10',type:'pct',value:10,min:0,from:'',to:'',maxUses:0,perCust:1,aud:'todos',active:true,note:'10 % en la primera compra (ejemplo)',uses:[]}",
    "{id:'cp1',code:'TIKTOK10',type:'pct',value:10,min:0,from:'',to:'',maxUses:0,perCust:1,aud:'todos',active:true,note:'Bienvenida: 10 % en el primer pedido para quien llega desde el link de la bio de TikTok (ejemplo)',uses:[]}")
rep("**2x1 en remeras básicas** y **−15 % llevando 3 prendas** (ejemplo).","**2x1 en gorras** y **−15 % llevando 3 productos** (ejemplo).")
rep("**2x1 on basic tees** and **15 % off when you take 3 items** (example).","**2x1 on caps** and **15 % off when you take 3 items** (example).")
rep("Armá tu look desde el celular: elegí la prenda, el color y el talle y **te confirmamos stock y envío por WhatsApp**. Probá el **buscador de talle** en el local.",
    "Lo que viste en TikTok, a un toque: elegí el producto, el color y el talle y **te confirmamos stock y envío por WhatsApp**. Si viste un video, buscalo por su **código**.")
rep("Build your look from your phone: pick the item, colour and size and **we confirm stock and shipping on WhatsApp**.","Seen it on TikTok? Pick the item, colour and size and **we confirm stock and shipping on WhatsApp**. Search by the video **code**.")
rep("if(f.chart==='u'?col[0]","if(f.chart==='u'?col[0]",0) if False else None
rep('featured:(i%9===0)','featured:false')

# ---- mayorista del rubro (no de almacén): presentaciones de ropa/accesorios y venta por mayor según importe ----
rep("{id:'pr-vip',name:'Clientas VIP −8 % (segmento)'","{id:'pr-may1',name:'Compra por mayor desde $ 150.000 −15 %',type:'amt',min:15000000,pct:15,on:true,note:'Precio mayorista: desde $ 150.000 en productos, 15 % de descuento (ejemplo).'},\n {id:'pr-may2',name:'Compra por mayor desde $ 300.000 −25 %',type:'amt',min:30000000,pct:25,on:true,note:'Precio mayorista: desde $ 300.000 en productos, 25 % de descuento (ejemplo).'},\n {id:'pr-vip',name:'Clientas VIP −8 % (segmento)'")
rep("  if(r.type==='seg'){if(cust","  if(r.type==='amt'){const base=el.reduce((a,x)=>a+x.amt,0);if(base>=r.min){d=Math.round(base*r.pct/100);why='compra por mayor';}}\n  if(r.type==='seg'){if(cust")
rep("**2x1 en gorras** y **−15 % llevando 3 productos** (ejemplo).","**2x1 en gorras**, **−15 % llevando 3 productos** y **precio mayorista desde $ 150.000** (ejemplo).")
s=s  # noqa
# ---- 2) datos de TikTok al iframe ----
tk="""function nlTikTok(){return[
 {code:'TK-201',title:'Gorra + reloj: cómo combinarlos',fam:'gor-bei',views:612000},
 {code:'TK-202',title:'El reloj que parece caro y no lo es',fam:'rel-cla',views:884000},
 {code:'TK-203',title:'Apilá tus anillos en 10 segundos',fam:'ani-fin',views:301000},
 {code:'TK-204',title:'Lentes aviador: ¿te quedan?',fam:'len-avi',views:457000},
 {code:'TK-205',title:'Reloj con brillos: el que más nos preguntan',fam:'rel-bri',views:968000},
 {code:'TK-206',title:'Cadena + anillo sello: combo del finde',fam:'ani-sel',views:195000},
 {code:'TK-207',title:'Cadena con dije: el regalo que siempre queda bien',fam:'col-dij',views:342000},
 {code:'TK-208',title:'Cronógrafo de acero: ¿lo usás de día o de noche?',fam:'rel-cro',views:276000}];}
function nlMay(){return NL().promos.filter(r=>r.on&&r.type==='amt').map(r=>({min:Math.round(r.min/100),pct:r.pct}));}
function nlWelcome(){const c=(S.coupons||[]).find(x=>x.active&&/TIKTOK/i.test(x.code));return c?{code:c.code,txt:'10 % en tu primer pedido. Ingresá el código en el carrito (ejemplo).'}:null;}
"""
if 'function nlTikTok' not in s: rep("function nlCuit(",tk+"function nlCuit(")
rep("pay:NL_PUB.pay()};","pay:NL_PUB.pay(),tk:nlTikTok(),welcome:nlWelcome(),may:nlMay()};") if 'tk:nlTikTok()' not in s else None
# ---- 3) marca (sólo fuera de imágenes embebidas) ----
parts=re.split(r'(data:[a-z/+-]+;base64,[A-Za-z0-9+/=]+)',s)
SW=[('#F4EFE7','#F5F5F3'),('#FBF8F3','#FFFFFF'),('#E7DDCF','#E8E8E5'),('#CFC3B2','#CFCFCB'),('#1D1B19','#0A0A0A'),('#6F675C','#6B6B6B'),('#B4553A','#8A6D1F'),('#964329','#6E5517'),('#DDD2C2','#E2E2DF'),('#EFE6D8','#EEEEEC'),('#E2D6C4','#E2E2DF'),('#15130F','#0A0A0A'),('rgba\\(29,27,25,','rgba(10,10,10,'),('rgba\\(251,248,243,','rgba(255,255,255,')]
TX=[('Sistema Urban','Sistema VB'),('raveholding.github.io/SVBUrbanDemo','vincularbusiness.github.io/accesorios-para-ellos-vb'),('SVBUrbanDemo','accesorios-para-ellos-vb'),('rave-svburban-demo-v3','svb-accesorios-demo-v4'),('Urban Salta (demo de ejemplo)','Accesorios para Ellos (demo de ejemplo)'),
 ('Moda · Salta Capital','Relojes, gorras y accesorios · Salta'),('Fashion · Salta, Argentina','Watches, caps & accessories · Salta'),('(dirección de ejemplo) · Salta Capital','Caseros 1036, Salta Capital'),
 ('@urban.ropa','@accesorios_para_ellos'),('URBAN','ACCESORIOS PARA ELLOS'),('Urban','Accesorios para Ellos'),
 ('width:64px;height:25px;object-fit:contain;border-radius:0;background:#F4EFE7','width:34px;height:34px;object-fit:contain;border-radius:0')]
for k in range(0,len(parts),2):
    for a,b in SW: parts[k]=re.sub(a,b,parts[k],flags=re.I)
    for a,b in TX: parts[k]=parts[k].replace(a,b)
s=''.join(parts)

for a,b in [("{id:'d',name:'Display'},{id:'f',name:'Fardo'},{id:'p',name:'Pallet'}","{id:'d',name:'Pack x6'},{id:'f',name:'Caja x12'},{id:'p',name:'Bulto x48'}"),
 ("(Unidad, Display, Fardo, Pallet…)","(Unidad, Pack x6, Caja x12, Bulto x48…)"),("(Unidad, Display, Fardo…)","(Unidad, Pack x6, Caja x12…)"),("(Display, Fardo, Pallet…)","(Pack x6, Caja x12, Bulto x48…)"),
 ("Display/Fardo/Pallet","Pack/Caja/Bulto"),("«2 Pallet + 3 Fardo + 5 u»","«2 Bulto + 3 Caja + 5 u»")]:
    s=s.replace(a,b)
s=s.replace('Vi%20el%20men%C3%BA%20digital%20de%20RAVE%20y%20quiero%20uno%20para%20mi%20negocio.','Vi%20la%20demo%20de%20Accesorios%20para%20Ellos%20(Sistema%20VB)%20y%20quiero%20una%20tienda%20as%C3%AD%20para%20mi%20negocio.')
# ---- 4) tema del panel / acceso: mismo estilo que el menú público ----
HEX=[('#0a0a0a','#14302C'),('#0b0b0b','#14302C'),('#111111','#14302C'),('#111','#14302C'),('#000000','#14302C'),('#000','#14302C'),
 ('#f4f4f4','#F6F4EF'),('#f5f5f3','#F6F4EF'),('#f7f7f5','#F6F4EF'),('#f2f2f0','#EFECE4'),('#ebebe8','#EFECE4'),
 ('#e2e2e2','#E6E1D6'),('#e2e2df','#E6E1D6'),('#e6e6e3','#E6E1D6'),('#e8e8e5','#E6E1D6'),('#e4e4e4','#E6E1D6'),
 ('#cfcfcb','#D9D3C5'),('#6f6f6f','#66706B'),('#666666','#66706B'),('#6b6b6b','#66706B'),('#6e6e6e','#66706B')]
parts=re.split(r'(data:[a-z/+-]+;base64,[A-Za-z0-9+/=]+)',s)
for k in range(0,len(parts),2):
    for a,b in HEX: parts[k]=re.sub(re.escape(a)+r'(?![0-9a-fA-F])',b,parts[k],flags=re.I)
s=''.join(parts)
_css=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'ap_panel.css'),encoding='utf-8').read()
if 'id="ap-theme"' not in s: s=s.replace('</head>','<style id="ap-theme">'+_css+'</style></head>',1)
s=s.replace(' El tabaco queda afuera.','')  # V26.54: el texto de niveles no menciona tabaco en este rubro
rep("phone:'',wa:'',ig:'',fb:'',caja:1,regId:'r1'","phone:'(387) 474-7135',wa:'5493874747135',ig:'accesorios_para_ellos',fb:'',caja:1,regId:'r1'",2)  # WhatsApp e Instagram reales del comercio
# ---- 5) sin ropa: promos, datos de ejemplo, clientes y datos reales del local (2026-11-10) ----
rep("{id:'pr-look',name:'Look completo (parte de arriba + abajo + accesorio) −10 %',type:'look',pct:10,on:true,note:'Si el ticket tiene una prenda de arriba, una de abajo y un accesorio, 10 % de descuento (ejemplo).'}",
    "{id:'pr-combo',name:'Combo reloj + accesorio −10 %',type:'combo',catsA:['nl-rel'],catsB:['nl-gor','nl-ani','nl-len','nl-acc'],pct:10,on:true,note:'Llevando un reloj y una gorra, joya, lentes o accesorio, 10 % de descuento sobre los dos (ejemplo).'}")
rep("  if(r.type==='look'){","  if(r.type==='combo'){const a=el.filter(x=>(r.catsA||[]).includes(x.p.rubro)),b=el.filter(x=>(r.catsB||[]).includes(x.p.rubro));if(a.length&&b.length){const mn=q=>Math.min(...q.map(x=>x.l.price));d=Math.round((mn(a)+mn(b))*r.pct/100);why='combo reloj + accesorio';}}\n  if(r.type==='look'){")
rep("why=free?free+' prenda(s) sin cargo':'';","why=free?free+' producto(s) sin cargo':'';")
rep("why=u+' prendas';","why=u+' productos';")
s=s.replace('Clientas VIP','Clientes VIP')
# historial de ventas y pedidos online de ejemplo con accesorios
rep("const famW={'rem-bas':5,'rem-rib':3,'rem-ove':2,'cam-lin':2,'cam-sat':2,'jea-rec':5,'jea-ski':4,'pan-sas':2,'sho-den':2,'ves-mid':3,'ves-cam':2,'pol-ple':2,'buz-can':3,'cam-jea':1,'tap-pan':1,'acc-cin':2,'acc-buf':1,'acc-car':1,'cal-zap':3};",
    "const famW={'rel-bri':6,'rel-cla':4,'rel-cro':4,'rel-dig':3,'rel-fem':3,'gor-bei':6,'gor-tru':4,'gor-pla':5,'gor-lan':2,'col-cad':4,'col-dij':5,'ani-sel':3,'ani-fin':2,'pul-cue':2,'pul-ace':3,'len-avi':3,'len-ret':2,'bil-cue':3,'acc-cin':2,'acc-buf':1,'acc-car':1,'cal-zap':1,'cal-hbo':1};")
for a,b in [("[[find('rem-bas','blanco','S'),1],[find('jea-rec','denimo','38'),1]]","[[find('rel-bri','dorado','U'),1],[find('col-dij','dorado','U'),1]]"),
 ("[[find('ves-mid','floral','M'),1]]","[[find('gor-pla','negro','U'),2]]"),
 ("[[find('buz-can','gris','L'),1],[find('acc-buf','gris','U'),1]]","[[find('rel-cro','plata','U'),1],[find('pul-ace','plata','U'),1]]"),
 ("[[find('cam-lin','crudo','M'),1],[find('pan-sas','negro','40'),1]]","[[find('gor-bei','azul','U'),1],[find('len-avi','negro','U'),1]]"),
 ("[[find('cal-zap','blanco','38'),1]]","[[find('col-cad','plata','U'),1]]"),
 ("[[find('rem-ove','negro','L'),2]]","[[find('rel-cla','dorado','U'),1]]")]:
    rep(a,b)
rep("Calle de ejemplo 123, Salta","Calle de ejemplo 123, Salta Capital")
# proveedores del rubro (sin talleres de confección)
rep("""const P=[['Textil Norte S.A. (ejemplo)',nlCuit('3071200001'),'Responsable Inscripto','ventas@ejemplo.com','(0387) 400-1001','Telas e insumos (ejemplo)','tela'],""",
    """const P=[['Distribuidora de Relojes Norte S.A. (ejemplo)',nlCuit('3071200001'),'Responsable Inscripto','ventas@ejemplo.com','(0387) 400-1001','Salta (ejemplo)','rel'],""")
rep("""   ['Taller Los Pinos (ejemplo)',nlCuit('2030123403'),'Monotributista','','(0387) 400-1003','Salta (ejemplo)','taller'],
   ['Taller Costura Sur (ejemplo)',nlCuit('2740223404'),'Monotributista','','(0387) 400-1004','Salta (ejemplo)','taller']];""",
    """   ['Bijouterie Mayorista del Norte (ejemplo)',nlCuit('2030123403'),'Monotributista','','(0387) 400-1003','Salta (ejemplo)','bij']];""")
rep("  /* órdenes de producción en talleres (cada una nace como orden de compra al taller) */",
    "  const rel=S.products.filter(p=>p.fam==='rel-bri'||p.fam==='rel-cro').slice(0,4);\n  if(ids.rel)await nlRecibirADeposito({idempotency_key:'nl-ej-rel-1',proveedor_id:ids.rel,tipo_comprobante:'Factura',nro_comprobante:'0002-00001877',condicion_pago:'contado',observaciones:'Compra de relojes (ejemplo)',items:rel.map(p=>({producto_id:p.id,cantidad:6,precio_costo:cost(p)}))});\n  const bij=S.products.filter(p=>p.fam==='col-dij'||p.fam==='pul-ace').slice(0,4);\n  if(ids.bij)await nlRecibirADeposito({idempotency_key:'nl-ej-bij-1',proveedor_id:ids.bij,tipo_comprobante:'Factura',nro_comprobante:'0001-00000315',condicion_pago:'credito',observaciones:'Compra de cadenas y pulseras (ejemplo) · a cuenta corriente',items:bij.map(p=>({producto_id:p.id,cantidad:12,precio_costo:cost(p)}))});\n  /* (sin talleres: el comercio no confecciona) */")
for a in ["  await mkOP('taller','rem-bas','rojo',['S','M','L'],36,'confeccion',false);\n","  await mkOP('taller2','ves-cam','azul',['S','M','L'],18,'terminacion',false);\n",
          "  await mkOP('taller','buz-can','verde',['M','L'],30,'recibida',true);\n","  await mkOP('taller2','pol-ple','camel',['S','M'],24,'corte',false);\n"]:
    rep(a,'')
rep("proveedores, talleres, deudas y órdenes de producción de ejemplo","proveedores, compras y deudas de ejemplo")
# clientes: el local es «para ellos» (también damas); sin medidas de cuerpo (no hay ropa)
i=s.index('function nlCustomers(){');j=s.index('/* ---- estado propio de la moda',i)
blk=re.sub(r"m:m\([^)]*\)","m:{}",s[i:j])
for a,b in [("'Sofía','Álvarez (ejemplo)'","'Matías','Álvarez (ejemplo)'"),("'Lucía','Gómez (ejemplo)'","'Facundo','Gómez (ejemplo)'"),("'Martina','Paz (ejemplo)'","'Joaquín','Paz (ejemplo)'"),
            ("'Agustina','Medina (ejemplo)'","'Nicolás','Medina (ejemplo)'"),("'Tienda Moda Norte (ejemplo)'","'Bijou Norte, revendedora (ejemplo)'"),("Revendedora: compra curvas por pack","Revendedora: compra por pack")]:
    assert a in blk,a; blk=blk.replace(a,b)
s=s[:i]+blk+s[j:]
rep("{id:'e1',name:'Vendedora de salón (ejemplo)'","{id:'e1',name:'Vendedor de mostrador (ejemplo)'")
rep("{id:'pu_sal',name:'Salón y probadores'","{id:'pu_sal',name:'Mostrador y ventas'")
# datos reales del local: dirección, horario, envíos, medios de pago, Instagram y mapa
rep("mapQuery:'',mapUrl:'',reviewUrl:'',wifi:{on:false,ssid:'',pass:'',example:false},social:[],clubOn:false});",
    "mapQuery:'Caseros 1036, Salta, Argentina',mapUrl:'https://www.google.com/maps/search/?api=1&query=Caseros+1036+Salta+Argentina',reviewUrl:'',wifi:{on:false,ssid:'',pass:'',example:false},"
    "social:[{k:'instagram',label:'Instagram',handle:'@accesorios_para_ellos',url:'https://www.instagram.com/accesorios_para_ellos/'}],clubOn:false,"
    "ship:{mode:'tienda',pickup:{on:true,place:'Caseros 1036, Salta Capital',hours:'Lunes a sábados de 10 a 14 y de 17 a 22'},local:{on:true,fee:250000,free:0,zones:'Salta Capital (cadetería)'},zones:[],"
    "rest:{on:true,quote:true,fee:0,eta:'Correo Argentino a todo el país'},min:0,note:'Envíos a domicilio por cadetería y por Correo Argentino a todo el país.',alcohol:'no'}});")
rep("function nlMay(){","function nlInfo(){const t=S.tenant||{},sh=(S.menu&&S.menu.ship)||{},pk=sh.pickup||{};const ship=[sh.local&&sh.local.on?'cadetería':'',sh.rest&&sh.rest.on?'Correo Argentino a todo el país':''].filter(Boolean);\n return{addr:t.address||'',city:'Salta · Argentina',hours:pk.hours?'Lunes a sábados · '+pk.hours.replace(/^Lunes a sábados de /,'de '):'',ship:ship.length?'Envíos a domicilio por '+ship.join(' y por '):'',ship2:pk.on?'Retiro sin cargo en el local':'',pay:'Todos los medios de pago',wa:t.wa||'',map:(S.menu&&S.menu.mapUrl)||''};}\nfunction nlMay(){")
rep("tk:nlTikTok(),welcome:nlWelcome(),may:nlMay()};","tk:nlTikTok(),welcome:nlWelcome(),may:nlMay(),info:nlInfo()};")
# ---- 6) textos: sin ropa (2026-11-10) ----
for a,b in [('Hola! El jean recto denim claro lo tienen en talle 40?','¡Hola! ¿El reloj con brillos dorado lo tienen en el local?'),
 ('¿Tienen guía de talles para el vestido midi?','¿Tienen guía de talles para los anillos?'),
 ('Entró stock de curvas completas. ¿Te mando la lista?','Entraron relojes y gorras nuevas. ¿Te mando la lista?'),
 ('Ordenar probadores y devolver prendas al salón','Ordenar vitrinas y reponer exhibidores'),
 ('sesiones de probador','consultas de talle'),('Conversión con probador','Conversión con guía de talle'),('Curva x12','Caja x12')]:
    s=s.replace(a,b)
TX3=[('Prendas pickeadas y verificadas','Productos pickeados y verificados'),('Prendas agrupadas','Productos agrupados'),('Prendas más vendidas','Productos más vendidos'),
 ('Prendas listas','Productos listos'),('prendas contadas','productos contados'),('de la prenda','del producto'),('De la prenda','Del producto'),('a la prenda','al producto'),
 ('las prendas','los productos'),('Las prendas','Los productos'),('la prenda','el producto'),('La prenda','El producto'),('una prenda','un producto'),('Una prenda','Un producto'),
 ('esta prenda','este producto'),('Esta prenda','Este producto'),('cada prenda','cada producto'),('prenda(s)','producto(s)'),('PRENDAS','PRODUCTOS'),('Prendas','Productos'),('prendas','productos'),('PRENDA','PRODUCTO'),('Prenda','Producto'),('prenda','producto')]
parts=re.split(r'(data:[a-z/+-]+;base64,[A-Za-z0-9+/=]+)',s)
for k in range(0,len(parts),2):
    for a,b in TX3: parts[k]=parts[k].replace(a,b)
s=''.join(parts)
# accesorios de talle único: stock de vidriera realista (algunos quedan bajos a propósito para ver el aviso)
rep("  let loc=Math.floor(r()*6*pop),dep=Math.floor(r()*14*pop),onl=Math.floor(r()*7*pop);\n","  let loc=Math.floor(r()*6*pop),dep=Math.floor(r()*14*pop),onl=Math.floor(r()*7*pop);\n  if(sz==='U'){loc=(i%7===3)?Math.floor(r()*4):6+Math.floor(r()*16);dep=4+Math.floor(r()*20);}else{loc=(i%9===4)?Math.floor(r()*3):5+Math.floor(r()*8);dep=3+Math.floor(r()*10);}\n")
# sin PedidosYa: el comercio reparte por cadetería propia y Correo Argentino (2026-11-10)
rep('<div class="card kpi ux-k"><span>Pedidos delivery (PedidosYa)</span><b>${T.pya}</b><small>en curso</small></div>',
    '<div class="card kpi ux-k"><span>Pedidos online por enviar</span><b>${(()=>{try{return NL().orders.filter(o=>!["entregado","cancelado","devuelto"].includes(o.status)).length;}catch(e){return 0;}})()}</b><small>cadetería y Correo Argentino</small></div>')
s=s.replace('Nada se envía a Mercado Pago, MODO, PedidosYa ni Google','Nada se envía a Mercado Pago, MODO, Correo Argentino ni Google')
# (2026-11-13) la Configuración por grupos ahora viene del sistema base (V26.66); fuentes/ap_config.js ya no se inyecta
# V26.69 · en la tienda (#menu) se instala la app del CLIENTE (manifiesto del Club), no la del sistema
rep("const appKind=()=>/^#(mitarjeta|tarjeta|sello=)/.test(location.hash||'')","const appKind=()=>/^#(mitarjeta|tarjeta|sello=|menu)/.test(location.hash||'')")
rep("const name=kind==='club'?'la app del Club':'la app del sistema';","const name=kind==='club'?'la app de Accesorios para Ellos':'la app del sistema';")
# Ingreso con Google en la demo sin nube: botón explicativo en el acceso y tarjeta en Configuración (fuentes/ap_google.js)
_gj=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'ap_google.js'),encoding='utf-8').read()
if 'id="ap-google"' not in s:
    _i=s.rfind('</body>');assert _i>0
    s=s[:_i]+'<script id="ap-google">'+_gj+'</script>'+s[_i:]
s=s.replace('const inj=`<script>try{sessionStorage','const inj=`<style>html:not(.ap-on) body{opacity:0}</style><script>try{sessionStorage',1)
s=s.replace('display:block;background:#0a0a0a"></ifr','display:block;background:#F6F4EF"></ifr')
open(path,'w',encoding='utf-8').write(s)
print('ok',len(s))
