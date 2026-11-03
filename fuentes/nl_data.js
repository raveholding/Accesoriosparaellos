/* ===== Demo «Urban · Salta Capital» (compilación `newlook`) — moda sobre la demo final de Sistema VB =====
   Se apoya en TODO lo que ya trae la demo final (POS con F1–F12, cajas, mayorista por presentación, compras y proveedores,
   traspasos, Club de sellos, expediente, auditoría). Suma lo propio de una tienda de indumentaria:
   · cada VARIANTE (modelo × color × talle) es un producto: el POS, el stock y el código de barras siguen funcionando igual;
   · tres UBICACIONES de stock: Local (p.stock), Depósito y Online (p.loc.dep / p.loc.onl);
   · probador virtual + buscador de talle (Fit Finder) + armador de looks, omnicanal con picking/packing/envíos/devoluciones,
     talleres de producción, promociones (2x1, por volumen, looks, cupones por segmento, puntos) y tablero de moda.
   Todos los datos son de EJEMPLO. Nada es fiscal ni de cobro real. */
function isNLBuild(){return!!(typeof window!=='undefined'&&window.RAVE_BUILD&&window.RAVE_BUILD.profile==='newlook');}
const NL_ACC='#0a0a0a';
/* ---- categorías (rubros del menú público: una sola dueña/o, sin rubros por persona) ---- */
function nlCats(){return[
 {id:'nl-rem',name:'Remeras y tops',color:'#0a0a0a',mNom:'Remeras',mTitle:'Remeras y tops',layout:'grid',alcohol:false},
 {id:'nl-cam',name:'Camisas y blusas',color:'#2b2b2b',mNom:'Camisas',mTitle:'Camisas y blusas',layout:'grid',alcohol:false},
 {id:'nl-pan',name:'Jeans y pantalones',color:'#4a4a4a',mNom:'Jeans',mTitle:'Jeans y pantalones',layout:'grid',alcohol:false},
 {id:'nl-ves',name:'Vestidos y polleras',color:'#686868',mNom:'Vestidos',mTitle:'Vestidos y polleras',layout:'grid',alcohol:false},
 {id:'nl-abr',name:'Abrigos y buzos',color:'#868686',mNom:'Abrigos',mTitle:'Abrigos y buzos',layout:'grid',alcohol:false},
 {id:'nl-acc',name:'Accesorios',color:'#a4a4a4',mNom:'Accesorios',mTitle:'Accesorios',layout:'grid',alcohol:false},
 {id:'nl-cal',name:'Calzado',color:'#c2c2c2',mNom:'Calzado',mTitle:'Calzado',layout:'grid',alcohol:false}];}
/* ---- tablas de talles: medidas de CUERPO (cm) para las que está pensado cada talle ---- */
const NL_CHART={
 letra:{XS:{pecho:82,cintura:64,cadera:88},S:{pecho:86,cintura:68,cadera:92},M:{pecho:90,cintura:72,cadera:96},L:{pecho:95,cintura:77,cadera:101},XL:{pecho:100,cintura:82,cadera:106}},
 num:{36:{cintura:64,cadera:90},38:{cintura:68,cadera:94},40:{cintura:72,cadera:98},42:{cintura:76,cadera:102},44:{cintura:80,cadera:106},46:{cintura:85,cadera:110}},
 calz:{35:{pie:22.5},36:{pie:23},37:{pie:23.7},38:{pie:24.3},39:{pie:25},40:{pie:25.6}},
 letraH:{S:{pecho:92,cintura:78,cadera:96},M:{pecho:98,cintura:84,cadera:100},L:{pecho:104,cintura:90,cadera:106},XL:{pecho:110,cintura:96,cadera:112},XXL:{pecho:116,cintura:102,cadera:118}},
 numH:{38:{cintura:76,cadera:96},40:{cintura:80,cadera:100},42:{cintura:84,cadera:104},44:{cintura:88,cadera:108},46:{cintura:93,cadera:112},48:{cintura:98,cadera:116}},
 calzH:{40:{pie:25.6},41:{pie:26.3},42:{pie:27},43:{pie:27.6},44:{pie:28.3},45:{pie:29}},
 ani:{14:{},16:{},18:{},20:{},22:{}},
 u:{U:{}}};
const NL_SIZES={letra:['XS','S','M','L','XL'],letraH:['S','M','L','XL','XXL'],num:['36','38','40','42','44','46'],numH:['38','40','42','44','46','48'],calz:['35','36','37','38','39','40'],calzH:['40','41','42','43','44','45'],ani:['14','16','18','20','22'],u:['U']};
/* ---- modelos: [id, nombre, categoría, precio $, costo (fracción), tabla, dimensiones, comodidad de corte, comodidad ideal, elástico, colores, mayorista, género (m=mujer, h=hombre, u=unisex)] ---- */
const NL_COL={blanco:['Blanco','#f1efe9'],negro:['Negro','#1c1c1c'],rojo:['Rojo','#b5173f'],azul:['Azul','#2f5d8a'],crudo:['Crudo','#e3d6bd'],verde:['Verde','#4d6b3f'],rosa:['Rosa','#e4a3b4'],gris:['Gris','#8d8f94'],
 denim:['Denim claro','#7fa0c4'],denimo:['Denim oscuro','#26364f'],camel:['Camel','#b08a5b'],floral:['Floral','#c96a85']};
function nlFams(){return[
 ['gor-bei','Gorra béisbol bordada','nl-gor',9900,.33,'u',[],0,0,0,['negro','blanco','azul'],1,'u'],
 ['gor-tru','Gorra trucker rejilla','nl-gor',8900,.32,'u',[],0,0,0,['negro','verde','gris'],1,'u'],
 ['gor-lan','Gorro de lana','nl-gor',7900,.30,'u',[],0,0,0,['negro','gris','rojo'],1,'u'],
 ['rel-cla','Reloj clásico acero','nl-rel',38900,.42,'u',[],0,0,0,['plata','dorado','negro'],0,'h'],
 ['rel-dig','Reloj deportivo digital','nl-rel',24900,.40,'u',[],0,0,0,['negro','azul'],1,'u'],
 ['rel-fem','Reloj mujer malla','nl-rel',32900,.42,'u',[],0,0,0,['dorado','plata','rosa'],0,'m'],
 ['ani-sel','Anillo sello acero','nl-ani',12900,.30,'ani',[],0,0,0,['plata','dorado','negro'],1,'h'],
 ['ani-fin','Anillo fino apilable','nl-ani',8900,.28,'ani',[],0,0,0,['plata','dorado'],1,'m'],
 ['col-cad','Cadena eslabones','nl-ani',15900,.32,'u',[],0,0,0,['plata','dorado'],1,'u'],
 ['pul-cue','Pulsera de cuero trenzado','nl-ani',9900,.30,'u',[],0,0,0,['marron','negro'],1,'h'],
 ['len-avi','Lentes de sol aviador','nl-len',16900,.34,'u',[],0,0,0,['negro','dorado'],0,'u'],
 ['len-ret','Lentes de sol retro','nl-len',14900,.34,'u',[],0,0,0,['negro','marron'],0,'m'],
 ['bil-cue','Billetera de cuero','nl-acc',17900,.34,'u',[],0,0,0,['negro','marron'],1,'h'],
 ['rem-bas','Remera básica algodón','nl-rem',12900,.36,'letra',['pecho'],6,6,0,['blanco','negro','rojo'],1,'m'],
 ['rem-rib','Top rib elástico','nl-rem',9900,.34,'letra',['pecho'],0,0,1,['negro','crudo','rosa'],1,'m'],
 ['rem-ove','Remera oversize estampada','nl-rem',16900,.38,'letra',['pecho'],22,16,0,['blanco','negro'],0,'u'],
 ['cam-lin','Camisa de lino','nl-cam',24900,.40,'letra',['pecho','cintura'],10,8,0,['blanco','azul','crudo'],0,'m'],
 ['cam-sat','Blusa satinada','nl-cam',21900,.39,'letra',['pecho','cintura'],8,8,0,['crudo','negro','rosa'],0,'m'],
 ['jea-rec','Jean recto','nl-pan',39900,.41,'num',['cintura','cadera'],2,2,0,['denim','denimo'],1,'m'],
 ['jea-ski','Jean skinny elastizado','nl-pan',36900,.40,'num',['cintura','cadera'],0,0,1,['denimo','negro'],1,'m'],
 ['pan-sas','Pantalón sastrero','nl-pan',34900,.42,'num',['cintura','cadera'],3,3,0,['negro','camel'],0,'m'],
 ['sho-den','Short de jean','nl-pan',22900,.38,'num',['cintura','cadera'],1,1,0,['denim'],0,'m'],
 ['ves-mid','Vestido midi floral','nl-ves',42900,.43,'letra',['pecho','cintura','cadera'],8,8,0,['floral','negro'],0,'m'],
 ['ves-cam','Vestido camisero','nl-ves',38900,.42,'letra',['pecho','cintura','cadera'],8,8,0,['azul','crudo'],0,'m'],
 ['pol-ple','Pollera plisada','nl-ves',27900,.40,'letra',['cintura','cadera'],6,6,0,['negro','camel'],0,'m'],
 ['buz-can','Buzo canguro friza','nl-abr',29900,.40,'letra',['pecho'],14,12,0,['gris','negro','verde'],1,'u'],
 ['cam-jea','Campera de jean','nl-abr',59900,.44,'letra',['pecho'],12,10,0,['denim'],0,'u'],
 ['tap-pan','Tapado de paño','nl-abr',89900,.46,'letra',['pecho','cadera'],16,14,0,['camel','negro'],0,'m'],
 ['acc-cin','Cinto de cuero','nl-acc',14900,.32,'u',[],0,0,0,['negro','camel'],1,'u'],
 ['acc-buf','Bufanda lana','nl-acc',11900,.30,'u',[],0,0,0,['gris','rojo'],1,'u'],
 ['acc-car','Cartera bandolera','nl-acc',32900,.41,'u',[],0,0,0,['negro','camel'],0,'m'],
 ['cal-zap','Zapatilla urbana','nl-cal',49900,.47,'calz',['pie'],.5,.5,0,['blanco','negro'],0,'m'],
 ['rem-hbo','Remera boxy fit','nl-rem',14900,.36,'letraH',['pecho'],10,8,0,['blanco','negro','gris'],1,'h'],
 ['rem-hpo','Polo piqué','nl-rem',18900,.37,'letraH',['pecho'],6,6,0,['azul','blanco','verde'],1,'h'],
 ['cam-hox','Camisa oxford','nl-cam',28900,.40,'letraH',['pecho','cintura'],6,6,0,['azul','blanco','crudo'],0,'h'],
 ['jea-hre','Jean recto hombre','nl-pan',41900,.41,'numH',['cintura','cadera'],2,2,0,['denim','denimo','negro'],1,'h'],
 ['pan-hca','Pantalón cargo','nl-pan',38900,.40,'numH',['cintura','cadera'],4,4,0,['verde','negro','camel'],0,'h'],
 ['ber-hbe','Bermuda de gabardina','nl-pan',23900,.38,'numH',['cintura','cadera'],2,2,0,['camel','azul'],0,'h'],
 ['abr-hbo','Campera bomber','nl-abr',69900,.44,'letraH',['pecho'],12,10,0,['negro','verde'],0,'h'],
 ['cal-hbo','Botín de cuero','nl-cal',64900,.47,'calzH',['pie'],.5,.5,0,['negro','camel'],0,'h']];}
const nlFamMap=()=>Object.fromEntries(nlFams().map(f=>[f[0],{id:f[0],name:f[1],cat:f[2],price:f[3],costF:f[4],chart:f[5],dims:f[6],allow:f[7],ideal:f[8],stretch:!!f[9],colors:f[10],ws:!!f[11],g:f[12]||'m'}]));
function nlEan(i){const b='7799992'+String(10000+i).slice(-5);let s=0;for(let k=0;k<12;k++)s+=(+b[k])*(k%2?3:1);return b+((10-s%10)%10);}
function nlCuit(pref){const w=[5,4,3,2,7,6,5,4,3,2];for(let n=0;n<10;n++){const b=pref.slice(0,9)+String((+pref[9]+n)%10);let s=0;for(let k=0;k<10;k++)s+=(+b[k])*w[k];let d=11-s%11;if(d===11)d=0;if(d===10)continue;return b+d;}return pref+'0';}
/* generador pseudoaleatorio determinista (la demo siempre arranca igual) */
function nlRnd(seed){let s=seed;return()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;};}
function nlCatalog(){const fm=nlFamMap();const r=nlRnd(7);const L=[];let i=0;
 Object.values(fm).forEach(f=>{f.colors.forEach((ck,ci)=>{NL_SIZES[f.chart].forEach((sz,si)=>{
  const col=NL_COL[ck];const price=f.price*100;const cost=Math.round(f.price*f.costF/10)*1000;
  /* stock repartido: algunas combinaciones quedan en cero a propósito (para probar el buscador de talle y los traspasos) */
  const pop=(sz==='M'||sz==='38'||sz==='40'||sz==='L'||sz==='37'||sz==='U')?1.3:0.8;
  let loc=Math.floor(r()*6*pop),dep=Math.floor(r()*14*pop),onl=Math.floor(r()*7*pop);
  if(f.id==='jea-rec'&&ck==='denim'&&sz==='40'){loc=0;dep=6;onl=0;}   /* caso de ejemplo: sin stock en el local, hay en el depósito */
  if(f.id==='rem-bas'&&ck==='negro'&&sz==='M'){loc=0;dep=0;onl=2;}      /* caso de ejemplo: sólo queda stock online */
  const p={id:'nl-'+f.id+'-'+ci+'-'+sz,name:f.name,sub:(f.chart==='u'?col[0]:col[0]+' · '+sz),grupo:'',rubro:f.cat,price,cost,stock:loc,unit:'u',barcode:nlEan(i),plu:'',menu:true,active:true,desc:'',
   featured:(i%9===0),demo:true,fam:f.id,color:ck,talle:sz,loc:{dep,onl}};
  if(f.ws&&sz!=='U'){const u=price;p.pres=[{lv:'d',qty:6,unit:Math.round(u*.90/100)*100,barcode:''},{lv:'f',qty:12,unit:Math.round(u*.82/100)*100,barcode:''},{lv:'p',qty:48,unit:Math.round(u*.72/100)*100,barcode:''}];}
  L.push(p);i++;});});});
 return L;}
/* ---- clientas/es de ejemplo con medidas corporales y preferencias (Cliente 360) ---- */
function nlCustomers(){const t0=now()-60*86400000;
 const mk=(id,num,name,last,o)=>Object.assign({id,num,name,last,birth:'',wa:'+54938700'+String(20000+num*137).slice(-5),dni:'',cards:[],cardSecrets:{},origin:'ejemplo',
  consent:{club:true,comm:true,analytics:false,version:'v1-2026-demo',ts:t0},ts:t0,status:'activo',limit:0,secret:'nl-ej-'+id+'-0000000000',notes:'',channel:'minorista',taxid:'',term:0,zone:'',seller:'',example:true},o);
 const m=(pecho,cintura,cadera,altura,pie,pref)=>({pecho,cintura,cadera,altura,pie,pref});
 return[
  mk('nc1',1,'Sofía','Álvarez (ejemplo)',{birth:'1994-03-12',nl:{m:m(88,70,95,165,24,'regular'),seg:'vip',style:'casual urbano'}}),
  mk('nc2',2,'Camila','Torres (ejemplo)',{birth:'1999-11-02',nl:{m:m(84,65,90,160,23,'ajustado'),seg:'nueva',style:'minimalista'}}),
  mk('nc3',3,'Lucía','Gómez (ejemplo)',{birth:'1988-07-25',nl:{m:m(98,80,108,172,25.5,'holgado'),seg:'recurrente',style:'cómodo'}}),
  mk('nc4',4,'Valentina','Ruiz (ejemplo)',{birth:'2001-01-30',nl:{m:m(90,72,96,168,24.5,'regular'),seg:'recurrente',style:'tendencia'}}),
  mk('nc5',5,'Martina','Paz (ejemplo)',{birth:'1996-09-09',nl:{m:m(93,75,104,163,24,'regular'),seg:'inactiva',style:'clásico'}}),
  mk('nc6',6,'Julieta','Navarro (ejemplo)',{birth:'1992-05-21',nl:{m:m(86,67,92,170,24.2,'ajustado'),seg:'vip',style:'elegante'}}),
  mk('nc7',7,'Agustina','Medina (ejemplo)',{birth:'2003-12-14',nl:{m:m(81,63,88,158,22.8,'holgado'),seg:'nueva',style:'oversize'}}),
  mk('nc8',8,'Florencia','Cruz (ejemplo)',{birth:'1985-02-18',nl:{m:m(101,84,110,166,25.2,'regular'),seg:'recurrente',style:'casual'}}),
  mk('nc9',9,'Tienda Moda Norte (ejemplo)','',{channel:'mayorista',taxid:nlCuit('3071100001'),limit:90000000,term:15,zone:'Zona norte',seller:'Vendedora 1 (ejemplo)',notes:'Revendedora: compra curvas por pack',nl:{m:{},seg:'mayorista',style:''}})];}
/* ---- estado propio de la moda (S.nl) ---- */
function nlEmpty(d){d.nl={v:1,orders:[],returns:[],fitLog:[],points:{},moves:[],counts:[],prod:[],seqW:1000,seqP:0,seqR:0,promos:nlPromosDef(),talleres:[]};return d;}
function NL(){if(!S.nl)nlEmpty(S);const n=S.nl;n.orders=n.orders||[];n.returns=n.returns||[];n.fitLog=n.fitLog||[];n.points=n.points||{};n.moves=n.moves||[];n.counts=n.counts||[];n.prod=n.prod||[];n.promos=n.promos||nlPromosDef();n.talleres=n.talleres||[];n.notify=n.notify||[];return n;}
function nlPromosDef(){return[
 {id:'pr-2x1',name:'2x1 en remeras básicas',type:'2x1',fam:['rem-bas','rem-rib'],on:true,note:'Llevás 2 remeras de estos modelos y la de menor precio va sin cargo (ejemplo).'},
 {id:'pr-vol',name:'Volumen: 3 prendas o más −15 %',type:'vol',min:3,pct:15,cats:['nl-rem','nl-cam','nl-pan','nl-ves'],on:true,note:'Desde 3 prendas de estas categorías, 15 % de descuento (ejemplo).'},
 {id:'pr-look',name:'Look completo (parte de arriba + abajo + accesorio) −10 %',type:'look',pct:10,on:true,note:'Si el ticket tiene una prenda de arriba, una de abajo y un accesorio, 10 % de descuento (ejemplo).'},
 {id:'pr-vip',name:'Clientas VIP −8 % (segmento)',type:'seg',seg:'vip',pct:8,on:true,note:'Descuento por segmento para clientas VIP (ejemplo).'}];}
/* ---- base de datos de la demo ---- */
function nlBase(d){
 d.tenant=Object.assign({},d.tenant,{name:'Urban',legal:'Urban Salta (demo de ejemplo)',slogan:'Moda · Salta Capital',address:'(dirección de ejemplo) · Salta Capital',phone:'',wa:'',ig:'',fb:'',caja:1,regId:'r1'});
 d.cfg.biz='owner';d.cfg.bizLocked=1;d.cfg.kiniV=2;d.cfg.cashProfile='main';d.cfg.xfer=Object.assign({},d.cfg.xfer||{},{strict:false,selfAuth:true,ownerV:1});
 d.menu=Object.assign({},d.menu,{title:'URBAN',sub:{es:'Moda · Salta Capital',en:'Fashion · Salta, Argentina'},
  pitch:{es:'Armá tu look desde el celular: elegí la prenda, el color y el talle y **te confirmamos stock y envío por WhatsApp**. Probá el **buscador de talle** en el local.',en:'Build your look from your phone: pick the item, colour and size and **we confirm stock and shipping on WhatsApp**.'},
  promo:{on:true,es:'**2x1 en remeras básicas** y **−15 % llevando 3 prendas** (ejemplo).',en:'**2x1 on basic tees** and **15 % off when you take 3 items** (example).'},
  footer:{es:'Urban · Salta Capital · demo de evaluación',en:'Urban · Salta · evaluation demo'},
  mapQuery:'',mapUrl:'',reviewUrl:'',wifi:{on:false,ssid:'',pass:'',example:false},social:[],clubOn:false});
 d.cfg.tax={};d.cfg.ticket=Object.assign({},d.cfg.ticket,{msg:'¡Gracias por elegir Urban! Cambios dentro de los 30 días con ticket (ejemplo).'});
 const keep=d.rubros.filter(r=>r.kind==='cobr'||r.kind==='shared');
 d.rubros=nlCats().map(c=>Object.assign({owner:'',reparte:false,kind:'rubro',mHint:''},c)).concat(keep);
 if(!d.rubros.some(r=>r.id==='sys-gen'))d.rubros.push({id:'sys-gen',name:'Caja del negocio',kind:'sysgen',color:'#6b7280',sys:true,reparte:false,owner:'',active:true});
 d.rubros.forEach(r=>{r.owner='';r.reparte=false;});
 d.products=nlCatalog();
 if(d.cfg.wholesale){const w=d.cfg.wholesale;w.on=true;w.example=true;w.seeded=1;w.allowClub=false;w.levels=[{id:'d',name:'Pack x6'},{id:'f',name:'Curva x12'},{id:'p',name:'Bulto x48'}];}
 d.cfg.comboSeeded=1;
 d.customers=nlCustomers();
 d.agreements=[];
 d.loyalty=Object.assign({},d.loyalty,{reward:'Un accesorio de regalo (hasta $ 12.000) — ejemplo',ledger:[],usedOtp:{}});
 d.coupons=[{id:'cp1',code:'BIENVENIDA10',type:'pct',value:10,min:0,from:'',to:'',maxUses:0,perCust:1,aud:'todos',active:true,note:'10 % en la primera compra (ejemplo)',uses:[]},
  {id:'cp2',code:'CUMPLE15',type:'pct',value:15,min:0,from:'',to:'',maxUses:0,perCust:1,aud:'cumpleaños',active:true,note:'15 % en la semana de tu cumpleaños (ejemplo)',uses:[]}];
 d.plans=[];d.members=[];
 d.employees=[{id:'e1',name:'Vendedora de salón (ejemplo)',puestoId:'pu_sal',rate:250000,pin:'1234',active:true},{id:'e2',name:'Encargada de depósito (ejemplo)',puestoId:'pu_dep',rate:260000,pin:'4321',active:true}];
 d.puestos=[{id:'pu_soc',name:'Dueña/o',parent:'',holders:''},{id:'pu_sal',name:'Salón y probadores',parent:'pu_soc',holders:''},{id:'pu_dep',name:'Depósito y online',parent:'pu_soc',holders:''}];
 d.tasks=[{id:'t1',title:'Reponer salón desde el depósito (traspaso)',puestoId:'pu_dep',freq:'daily',active:true},
  {id:'t2',title:'Preparar y despachar pedidos online (picking y packing)',puestoId:'pu_dep',freq:'daily',active:true},
  {id:'t3',title:'Ordenar probadores y devolver prendas al salón',puestoId:'pu_sal',freq:'daily',active:true},
  {id:'t4',title:'Toma de inventario cíclica (una categoría por semana)',puestoId:'pu_dep',freq:'weekly',dow:1,active:true},
  {id:'t5',title:'Seguimiento de talleres y órdenes de producción',puestoId:'pu_soc',freq:'weekly',dow:3,active:true}];
 d.registers=[{id:'r1',code:'1',name:'Caja salón',type:'operational',branchId:'',parentId:'rp',active:true},
  {id:'r2',code:'2',name:'Caja 2',type:'operational',branchId:'',parentId:'rp',active:true},
  {id:'rp',code:'P',name:'Caja principal',type:'main',branchId:'',parentId:'',active:true}];
 const t=Math.max(Date.now()-2*3600000,new Date().setHours(0,5,0,0));
 d.sessions=[{id:'k-s1',caja:1,regId:'r1',regName:'Caja salón',branchId:'',openedBy:'ADMIN',openedAt:t,opening:12000000,closedAt:0},
  {id:'k-s2',caja:2,regId:'r2',regName:'Caja 2',branchId:'',openedBy:'Vendedora (ejemplo)',openedAt:t,opening:8000000,closedAt:0},
  {id:'k-sp',caja:3,regId:'rp',regName:'Caja principal',branchId:'',openedBy:'ADMIN',openedAt:t,opening:60000000,closedAt:0}];
 nlEmpty(d);
 return d;}
