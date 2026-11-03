/* ---------- historial de ejemplo (últimos 28 días): ventas del local y online, probador, devoluciones, ingresos al local ---------- */
function nlExtras(){if(!isNLBuild())return;
 S.customers=nlCustomers();S.loyalty.ledger=[];S.members=[];S.plans=[];S.coupons.forEach(c=>{c.uses=[];});
 S.sales=S.sales.filter(s=>!(s.demo&&/^hs/.test(s.id)));
 const n=NL();n.points={};n.pLog=[];n.fitLog=[];n.returns=[];n.traffic={};
 const r=nlRnd(23);const pool=S.products.filter(p=>p.active&&p.fam);
 const famW={'rem-bas':5,'rem-rib':3,'rem-ove':2,'cam-lin':2,'cam-sat':2,'jea-rec':5,'jea-ski':4,'pan-sas':2,'sho-den':2,'ves-mid':3,'ves-cam':2,'pol-ple':2,'buz-can':3,'cam-jea':1,'tap-pan':1,'acc-cin':2,'acc-buf':1,'acc-car':1,'cal-zap':3};
 const bag=[];pool.forEach(p=>{const w=(famW[p.fam]||1)*((p.talle==='M'||p.talle==='40'||p.talle==='38'||p.talle==='U'||p.talle==='37')?2:1);for(let i=0;i<w;i++)bag.push(p);});
 const hs=S.sessions.find(s=>s.id==='hist-demo');if(!hs)S.sessions.push({id:'hist-demo',caja:S.tenant.caja,openedBy:'ADMIN',openedAt:Date.now()-30*86400000,opening:0,closedAt:Date.now()-86400000,demo:true});
 const custs=S.customers.filter(c=>c.channel!=='mayorista');const metods=['efectivo','efectivo','debito','credito','credito','transferencia','qr'];const cj=S.tenant.caja;
 const bsz={'S':['talle_chico',.5],'36':['talle_chico',.5],'38':['talle_chico',.4],'XL':['talle_grande',.3],'46':['talle_grande',.3]};
 for(let d=28;d>=1;d--){const dow=new Date(Date.now()-d*86400000).getDay();const nS=4+Math.floor(r()*5)+(dow===5||dow===6?3:0);
  n.traffic[dkey(Date.now()-d*86400000)]=38+Math.floor(r()*30)+(dow===5||dow===6?30:0);
  for(let k=0;k<nS;k++){const nl=1+Math.floor(r()*3);const items=[];
   for(let j=0;j<nl;j++){const p=bag[Math.floor(r()*bag.length)];if(items.some(i=>i.pid===p.id))continue;items.push({pid:p.id,name:p.name+' ('+p.sub+')',rubro:p.rubro,qty:1,price:p.price,cost:p.cost,list:p.price,disc:0});}
   if(!items.length)continue;const cu=r()<0.38?custs[Math.floor(r()*custs.length)]:null;const probe=r()<(cu?0.42:0.22);
   let ben=null,total=items.reduce((a,i)=>a+i.qty*i.price,0);
   const q=nlPromoCalc(items.map(i=>({pid:i.pid,qty:i.qty,price:i.price,rubro:i.rubro})),cu?cu.id:'');
   if(q.best){const alloc=allocDisc(items,q.best.disc);items.forEach((i,ix)=>{i.disc=alloc[ix]||0;});total-=q.best.disc;ben={kind:'nlpromo',label:q.best.name,disc:q.best.disc};}
   S.seq[cj]=(S.seq[cj]||0)+1;const ts=Date.now()-d*86400000-Math.floor(r()*9*3600000)-2*3600000;const m=metods[Math.floor(r()*metods.length)];
   const s={id:'hs'+d+'_'+k,n:cj+'-'+S.seq[cj],ts,user:'Vendedora',caja:cj,sessId:'hist-demo',items,total,method:m,doc:'ticket_interno',status:'ok',fee:0,channel:'local',cust:cu?cu.id:'',custName:cu?custFull(cu):'',coupon:'',benefit:ben,recv:0,fiado:false,pays:[{m,a:total,fee:0}],fiadoAmt:0,paid:total,balance:0,vuelto:0,pstate:'pagada',demo:true,nlSrc:probe?'probador':'directa'};
   S.sales.push(s);
   if(cu){const pts=Math.floor(total/100000);if(pts>0){n.points[cu.id]=(n.points[cu.id]||0)+pts;n.pLog.push({ts,cust:cu.id,pts,why:'Compra '+s.n});}}
   if(probe){const it=items[0];const p=prod(it.pid);n.fitLog.push({id:uid(),ts:ts-12*60000,cust:cu?cu.id:'',fam:p.fam,size:p.talle,sale:s.id});}
   items.forEach(it=>{const p=prod(it.pid);const b=bsz[p.talle];const pr=(p.fam==='cal-zap'||p.talle==='U')?0.03:0.075+(b?0.06:0);
    if(r()<pr){const rs=b&&r()<b[1]+0.25?b[0]:['no_gusto','color','defecto','talle_grande','talle_chico'][Math.floor(r()*5)];
     n.returns.push({id:uid(),n:'D-'+(++n.seqR),ts:ts+Math.floor((1+r()*6)*86400000),user:'Vendedora',pid:p.id,name:pfull(p),fam:p.fam,talle:p.talle,qty:1,reason:rs,refund:'vale',sale:s.id,cust:s.cust,value:it.price,toLoc:rs==='defecto'?'merma':'loc',coupon:'',demo:true});}});}
  /* ventas online del día (canal web/Instagram/WhatsApp) */
  if(r()<0.65){const p=bag[Math.floor(r()*bag.length)];const q2=1+(r()<.3?1:0);const tot=p.price*q2+(r()<.5?250000:0);S.seq[cj]=(S.seq[cj]||0)+1;
   S.sales.push({id:'hsw'+d,n:'W'+cj+'-'+S.seq[cj],ts:Date.now()-d*86400000-5*3600000,user:'online',caja:cj,sessId:'',items:[{pid:p.id,name:p.name+' ('+p.sub+')',rubro:p.rubro,qty:q2,price:p.price,cost:p.cost,list:p.price,disc:0}],total:tot,method:'qr',doc:'ticket_interno',status:'ok',fee:0,channel:'online',cust:'',custName:'Compra online (ejemplo)',coupon:'',benefit:null,recv:0,fiado:false,pays:[{m:'qr',a:tot,fee:0}],fiadoAmt:0,paid:tot,balance:0,vuelto:0,pstate:'pagada',demo:true,nlSrc:'web'});}}
 /* sesiones del probador sin compra (curiosidad / no encontró su talle) */
 for(let i=0;i<34;i++){const p=pool[Math.floor(r()*pool.length)];const c=r()<0.4?custs[Math.floor(r()*custs.length)]:null;n.fitLog.push({id:uid(),ts:Date.now()-Math.floor(r()*28*86400000),cust:c?c.id:'',fam:p.fam,size:'',sale:''});}
 n.fitLog.sort((a,b)=>a.ts-b.ts);
 /* pedidos online de ejemplo, en distintas etapas del circuito */
 const find=(fam,col,sz)=>S.products.find(p=>p.fam===fam&&p.color===col&&p.talle===sz);
 S.products.forEach(p=>{if(p.loc&&p.loc.onl<4)p.loc.onl+=3;});
 const mkO=(ch,cu,nm,lines,ship,st)=>{const ol=lines.filter(x=>x[0]).map(([p,q])=>({pid:p.id,qty:q}));const res=nlOrderCreate({channel:ch,cust:cu,name:nm,lines:ol,shipType:ship,addr:ship==='retiro'?'':'Calle de ejemplo 123, Salta',shipCost:ship==='retiro'?0:250000});if(!res.ok)return null;const o=res.o;o.demo=true;
  const adv=(to,t)=>{nlOrderLog(o,t);o.state=to;};
  if(st==='nuevo'){o.pay={state:'pendiente',link:'https://pago.ejemplo/urban/'+o.n,method:''};nlOrderLog(o,'Link de pago generado (simulado)');return o;}
  o.pay={state:'pagado',link:'https://pago.ejemplo/urban/'+o.n,method:'qr'};nlOrderSale(o);adv('pagado','Pago acreditado (simulado) · venta online registrada');
  if(st==='pagado')return o;adv('picking','Picking iniciado');if(st==='picking')return o;adv('packing','Prendas pickeadas y verificadas');if(st==='packing')return o;
  o.ship.track='AR'+Math.floor(100000000+r()*899999999)+'X';adv('despachado','Despachado · guía '+o.ship.track+' (simulada)');if(st==='despachado')return o;adv('entregado','Entregado al cliente');return o;};
 mkO('web','nc2','',[[find('rem-bas','blanco','S'),1],[find('jea-rec','denimo','38'),1]],'envio','nuevo');
 mkO('instagram','nc6','',[[find('ves-mid','floral','M'),1]],'envio','pagado');
 mkO('whatsapp','nc4','',[[find('buz-can','gris','L'),1],[find('acc-buf','gris','U'),1]],'retiro','picking');
 mkO('web','nc1','',[[find('cam-lin','crudo','M'),1],[find('pan-sas','negro','40'),1]],'envio','packing');
 mkO('web','','Cliente web (ejemplo)',[[find('cal-zap','blanco','38'),1]],'envio','despachado');
 mkO('instagram','nc3','',[[find('rem-ove','negro','L'),2]],'envio','entregado');
 S.products.forEach(p=>{if(p.loc&&p.loc.onl<0)p.loc.onl=0;});
 n.talleres=n.talleres||[];}
/* ---------- proveedores, talleres, deudas y órdenes de producción: se cargan con el mismo motor que usa la pantalla ---------- */
async function nlRecibirADeposito(payload){const r=await LOCAL.recibir(payload);
 (payload.items||[]).forEach(it=>{const p=prod(it.producto_id);if(!p)return;const q=it.cantidad;nlLocSet(p,'loc',nlLocGet(p,'loc')-q);nlLocSet(p,'dep',nlLocGet(p,'dep')+q);});
 return r;}
async function nlSeedAsync(){if(!isNLBuild()||!S.cfg||S.cfg.nlSeeded)return;S.cfg.nlSeeded=1;
 const prev=user;user=user||{id:'u1',name:'ADMIN',role:'admin'};const n=NL();
 const cost=p=>Math.max(100,Math.round((p.cost||p.price*0.4)/100));
 try{
  const P=[['Textil Norte S.A. (ejemplo)',nlCuit('3071200001'),'Responsable Inscripto','ventas@ejemplo.com','(0387) 400-1001','Telas e insumos (ejemplo)','tela'],
   ['Importadora Accesorios S.R.L. (ejemplo)',nlCuit('3069800002'),'Responsable Inscripto','pedidos@ejemplo.com','(011) 4000-1002','Buenos Aires (ejemplo)','acc'],
   ['Taller Los Pinos (ejemplo)',nlCuit('2030123403'),'Monotributista','','(0387) 400-1003','Salta (ejemplo)','taller'],
   ['Taller Costura Sur (ejemplo)',nlCuit('2740223404'),'Monotributista','','(0387) 400-1004','Salta (ejemplo)','taller']];
  const ids={};
  for(const [rs,cuit,iva,mail,tel,dir,kind] of P){if(!arcaCuitOk(cuit))continue;const r=await LOCAL.supSave({razon_social:rs,cuit,condicion_iva:iva,email:mail||undefined,telefono:tel,direccion:dir});ids[kind+(ids[kind]?'2':'')]=r.id;if(kind==='taller')n.talleres.push(r.id);}
  const acc=S.products.filter(p=>p.fam==='acc-cin'||p.fam==='acc-buf'||p.fam==='acc-car').slice(0,5);
  if(ids.acc)await nlRecibirADeposito({idempotency_key:'nl-ej-rem-1',proveedor_id:ids.acc,tipo_comprobante:'Factura',nro_comprobante:'0001-00004321',condicion_pago:'credito',observaciones:'Compra de accesorios (ejemplo) · a cuenta corriente',
   items:acc.map(p=>({producto_id:p.id,cantidad:24,precio_costo:cost(p)}))});
  /* órdenes de producción en talleres (cada una nace como orden de compra al taller) */
  const mkOP=async(taller,fam,col,sizes,qty,state,recibir)=>{if(!ids[taller])return;const items=sizes.map(sz=>S.products.find(p=>p.fam===fam&&p.color===col&&p.talle===sz)).filter(Boolean).map(p=>({producto_id:p.id,cantidad:qty,precio_costo_pactado:Math.round(cost(p)*0.55)}));
   if(!items.length)return;const oc=await LOCAL.ocSave({idempotency_key:'nl-ej-op-'+(n.prod.length+1),proveedor_id:ids[taller],estado:'Solicitada',observaciones:'Orden de producción (ejemplo)',items});
   const op={id:uid(),n:'OP-'+String(n.prod.length+1).padStart(3,'0'),taller:ids[taller],fam,color:col,lines:items.map(i=>({pid:i.producto_id,qty:i.cantidad,cost:i.precio_costo_pactado})),state,ts:Date.now()-(6-n.prod.length)*86400000*3,eta:Date.now()+(4+n.prod.length)*86400000,oc:oc.id||oc.orden_compra_id||'',demo:true};
   if(recibir){await nlRecibirADeposito({idempotency_key:'nl-ej-rec-'+op.n,proveedor_id:ids[taller],orden_compra_id:op.oc,tipo_comprobante:'Remito',nro_comprobante:'R-'+(1500+n.prod.length),condicion_pago:'credito',
     items:op.lines.map(l=>({producto_id:l.pid,cantidad:l.qty,precio_costo:l.cost}))});}
   n.prod.push(op);};
  await mkOP('taller','rem-bas','rojo',['S','M','L'],36,'confeccion',false);
  await mkOP('taller2','ves-cam','azul',['S','M','L'],18,'terminacion',false);
  await mkOP('taller','buz-can','verde',['M','L'],30,'recibida',true);
  await mkOP('taller2','pol-ple','camel',['S','M'],24,'corte',false);
 }catch(e){console.warn('nlSeed',e&&e.message);}
 user=prev;audit('DEMO_EJEMPLOS','Urban: proveedores, talleres, deudas y órdenes de producción de ejemplo');save();}
