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
C=[('nl-gor','Gorras y gorros','#0a0a0a','Gorras'),('nl-rel','Relojes','#2b2b2b','Relojes'),('nl-ani','Anillos y joyas','#4a4a4a','Anillos'),('nl-len','Lentes de sol','#686868','Lentes'),('nl-acc','Accesorios','#868686','Accesorios'),
 ('nl-rem','Remeras y tops','#a4a4a4','Remeras'),('nl-cam','Camisas y blusas','#b4b4b4','Camisas'),('nl-pan','Jeans y pantalones','#c2c2c2','Jeans'),('nl-ves','Vestidos y polleras','#cfcfcf','Vestidos'),('nl-abr','Abrigos y buzos','#dadada','Abrigos'),('nl-cal','Calzado','#e4e4e4','Calzado')]
s=s[:i]+"function nlCats(){return["+",\n ".join("{id:'%s',name:'%s',color:'%s',mNom:'%s',mTitle:'%s',layout:'grid',alcohol:false}"%(a,b,c,d,b) for a,b,c,d in C)+"];}"+s[j:]
rep("floral:['Floral','#c96a85']}","floral:['Floral','#c96a85'],dorado:['Dorado','#c9a24a'],plata:['Plata','#c4c6cc'],marron:['Marrón','#6b4a2f']}")
# ---- promociones, cupón de bienvenida, textos ----
rep("{id:'pr-2x1',name:'2x1 en remeras básicas',type:'2x1',fam:['rem-bas','rem-rib'],on:true,note:'Llevás 2 remeras de estos modelos y la de menor precio va sin cargo (ejemplo).'}",
    "{id:'pr-2x1',name:'2x1 en gorras',type:'2x1',fam:['gor-bei','gor-tru'],on:true,note:'Llevás 2 gorras de estos modelos y la de menor precio va sin cargo (ejemplo).'}")
rep("name:'Volumen: 3 prendas o más −15 %',type:'vol',min:3,pct:15,cats:['nl-rem','nl-cam','nl-pan','nl-ves'],on:true,note:'Desde 3 prendas de estas categorías, 15 % de descuento (ejemplo).'}",
    "name:'Volumen: 3 productos o más −15 %',type:'vol',min:3,pct:15,cats:['nl-gor','nl-rel','nl-ani','nl-len','nl-acc','nl-rem','nl-cam','nl-pan','nl-ves'],on:true,note:'Desde 3 productos de estas categorías, 15 % de descuento (ejemplo).'}")
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
 {code:'TK-201',title:'Cómo combina una gorra con un look básico',fam:'gor-bei',views:612000},
 {code:'TK-202',title:'El reloj que parece caro y no lo es',fam:'rel-cla',views:884000},
 {code:'TK-203',title:'Apilá tus anillos en 10 segundos',fam:'ani-fin',views:301000},
 {code:'TK-204',title:'Lentes aviador: ¿te quedan?',fam:'len-avi',views:457000},
 {code:'TK-205',title:'Outfit de temporada: bomber + cargo',fam:'abr-hbo',views:268000},
 {code:'TK-206',title:'Cadena + anillo sello: combo del finde',fam:'ani-sel',views:195000},
 {code:'TK-207',title:'Camisa de lino para el calor',fam:'cam-lin',views:142000},
 {code:'TK-208',title:'Vestido midi floral: look de primavera',fam:'ves-mid',views:220000}];}
function nlMay(){return NL().promos.filter(r=>r.on&&r.type==='amt').map(r=>({min:Math.round(r.min/100),pct:r.pct}));}
function nlWelcome(){const c=(S.coupons||[]).find(x=>x.active&&/TIKTOK/i.test(x.code));return c?{code:c.code,txt:'10 % en tu primer pedido. Ingresá el código en el carrito (ejemplo).'}:null;}
"""
if 'function nlTikTok' not in s: rep("function nlCuit(",tk+"function nlCuit(")
rep("pay:NL_PUB.pay()};","pay:NL_PUB.pay(),tk:nlTikTok(),welcome:nlWelcome(),may:nlMay()};") if 'tk:nlTikTok()' not in s else None
# ---- 3) marca (sólo fuera de imágenes embebidas) ----
parts=re.split(r'(data:[a-z/+-]+;base64,[A-Za-z0-9+/=]+)',s)
SW=[('#F4EFE7','#F5F5F3'),('#FBF8F3','#FFFFFF'),('#E7DDCF','#E8E8E5'),('#CFC3B2','#CFCFCB'),('#1D1B19','#0A0A0A'),('#6F675C','#6B6B6B'),('#B4553A','#8A6D1F'),('#964329','#6E5517'),('#DDD2C2','#E2E2DF'),('#EFE6D8','#EEEEEC'),('#E2D6C4','#E2E2DF'),('#15130F','#0A0A0A'),('rgba\\(29,27,25,','rgba(10,10,10,'),('rgba\\(251,248,243,','rgba(255,255,255,')]
TX=[('Sistema Urban','Sistema VB'),('SVBUrbanDemo','SVBAccesoriosDemo'),('rave-svburban-demo-v3','svb-accesorios-demo-v2'),('Urban Salta (demo de ejemplo)','Accesorios para Ellos (demo de ejemplo)'),
 ('Moda · Salta Capital','Accesorios y moda'),('Fashion · Salta, Argentina','Accessories & fashion'),('(dirección de ejemplo) · Salta Capital','(dirección de ejemplo)'),
 ('@urban.ropa','@accesorios_para_ellos'),('URBAN','ACCESORIOS PARA ELLOS'),('Urban','Accesorios para Ellos'),
 ('width:64px;height:25px;object-fit:contain;border-radius:0;background:#F4EFE7','width:34px;height:34px;object-fit:contain;border-radius:0')]
for k in range(0,len(parts),2):
    for a,b in SW: parts[k]=re.sub(a,b,parts[k],flags=re.I)
    for a,b in TX: parts[k]=parts[k].replace(a,b)
s=''.join(parts)

for a,b in [("{id:'d',name:'Display'},{id:'f',name:'Fardo'},{id:'p',name:'Pallet'}","{id:'d',name:'Pack x6'},{id:'f',name:'Curva x12'},{id:'p',name:'Bulto x48'}"),
 ("(Unidad, Display, Fardo, Pallet…)","(Unidad, Pack x6, Curva x12, Bulto x48…)"),("(Display, Fardo, Pallet…)","(Pack x6, Curva x12, Bulto x48…)"),
 ("Display/Fardo/Pallet","Pack/Curva/Bulto"),("«2 Pallet + 3 Fardo + 5 u»","«2 Bulto + 3 Curva + 5 u»")]:
    s=s.replace(a,b)
s=s.replace('Vi%20el%20men%C3%BA%20digital%20de%20RAVE%20y%20quiero%20uno%20para%20mi%20negocio.','Vi%20la%20demo%20de%20Accesorios%20para%20Ellos%20(Sistema%20VB)%20y%20quiero%20una%20tienda%20as%C3%AD%20para%20mi%20negocio.')
open(path,'w',encoding='utf-8').write(s)
print('ok',len(s))
