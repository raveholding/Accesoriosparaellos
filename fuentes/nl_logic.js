/* ---------- Motor de calce (Fit Finder) ----------
   Para cada talle de un modelo compara la medida del CUERPO de la persona con la del talle y con la comodidad (ease) del corte.
   · comodidad real  = (cuerpo del talle + holgura de corte) − medida de la persona
   · comodidad ideal = comodidad ideal del modelo + ajuste por preferencia (ajustado −3 cm · regular 0 · holgado +4 cm)
   · desvío = real − ideal. Si el desvío es NEGATIVO (la prenda queda más chica que lo ideal) se penaliza ×4 (×2 si el tejido es elástico).
   El puntaje es 100 − 4 × (desvío promedio ponderado). Si faltan medidas se usan sólo las que hay y se avisa. */
const NL_PREF={ajustado:-3,regular:0,holgado:4};
function nlFitCalc(fam,m){
 const f=nlFamMap()[fam];if(!f)return null;m=m||{};const chart=NL_CHART[f.chart];const out=[];const shift=NL_PREF[m.pref]!==undefined?NL_PREF[m.pref]:0;
 const dims=f.dims.filter(d=>+m[d]>0);const missing=f.dims.filter(d=>!(+m[d]>0));
 NL_SIZES[f.chart].forEach(sz=>{
  const body=chart[sz]||{};let tot=0,det={},n=0;
  dims.forEach(d=>{const real=(body[d]+f.allow)-(+m[d]);const ideal=f.ideal+shift;const dev=real-ideal;det[d]=Math.round(dev*10)/10;
   const pen=dev<0?Math.abs(dev)*4*(f.stretch?.5:1):dev;tot+=pen;n++;});
  const avg=n?tot/n:0;const score=n?Math.max(0,Math.round(100-avg*4)):0;
  const dv=n?Object.values(det).reduce((a,b)=>a+b,0)/n:0;
  const label=!n?'Faltan medidas':(Math.abs(dv)<=1.5?'Calce ideal':dv<0?(dv<-4?'Queda chico':'Algo ajustado'):(dv>6?'Queda grande':'Algo holgado'));
  out.push({size:sz,score,dev:det,avgDev:Math.round(dv*10)/10,label});});
 let best=out.slice().sort((a,b)=>b.score-a.score)[0];
 const note=[];
 if(missing.length)note.push('Faltan medidas ('+missing.join(', ')+'): el resultado es aproximado.');
 if(+m.altura>0){if((f.chart==='num'||fam==='ves-mid'||fam==='ves-cam')&&m.altura>=175)note.push('Por la altura, el largo puede quedar corto.');if((f.chart==='num'||fam==='pol-ple')&&m.altura<=158)note.push('Por la altura, el largo puede quedar largo: consultá el ruedo.');}
 return{fam:f,rows:out,best,missing,note};}
/* stock por talle y ubicación de un modelo+color */
function nlStockOf(fam,color,size){const p=S.products.find(x=>x.fam===fam&&x.color===color&&x.talle===size&&x.active);return p?{p,loc:p.stock,dep:(p.loc&&p.loc.dep)||0,onl:(p.loc&&p.loc.onl)||0}:null;}
const nlTotal=p=>(p.stock||0)+((p.loc&&p.loc.dep)||0)+((p.loc&&p.loc.onl)||0);
function nlLocGet(p,w){return w==='loc'?(p.stock||0):((p.loc&&p.loc[w])||0);}
function nlLocSet(p,w,v){v=Math.round(v*1000)/1000;if(w==='loc')p.stock=v;else{p.loc=p.loc||{dep:0,onl:0};p.loc[w]=v;}}
const NL_LN={loc:'Local (salón)',dep:'Depósito',onl:'Online / fulfillment'};
/* ---------- muñeco SVG a escala de las medidas ---------- */
function nlAvatar(m,o){o=o||{};m=m||{};const pecho=+m.pecho||90,cint=+m.cintura||72,cad=+m.cadera||96,alt=+m.altura||165;
 const k=alt/165;const cx=100;const hw=c=>Math.max(14,c/Math.PI*1.0);   /* medio ancho frontal aproximado */
 const sh=hw(pecho)*1.18,ch=hw(pecho),wa=hw(cint),hi=hw(cad);
 const yH=34*k,yN=62*k,yS=78*k,yC=112*k,yW=150*k,yHi=190*k,yK=270*k,yF=345*k;
 const ease=o.topEase||0,eHalf=Math.max(-6,Math.min(14,ease))/2;
 const skin='#e9c9ad';const body=`M${cx-sh},${yS} Q${cx-sh-2},${yC} ${cx-ch},${yC} Q${cx-wa-2},${(yC+yW)/2} ${cx-wa},${yW} Q${cx-hi-1},${yHi-14} ${cx-hi},${yHi} L${cx-hi+4},${yK} L${cx-hi+9},${yF} L${cx-6},${yF} L${cx-4},${yK} L${cx},${yHi+8} L${cx+4},${yK} L${cx+6},${yF} L${cx+hi-9},${yF} L${cx+hi-4},${yK} L${cx+hi},${yHi} Q${cx+hi+1},${yHi-14} ${cx+wa},${yW} Q${cx+wa+2},${(yC+yW)/2} ${cx+ch},${yC} Q${cx+sh+2},${yC} ${cx+sh},${yS} Q${cx},${yS-12} ${cx-sh},${yS}Z`;
 const arms=`<path d="M${cx-sh},${yS} L${cx-sh-10},${yC+30} L${cx-sh-6},${yW+20}" stroke="${skin}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M${cx+sh},${yS} L${cx+sh+10},${yC+30} L${cx+sh+6},${yW+20}" stroke="${skin}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
 let top='',bot='';
 if(o.top){const tw=ch+eHalf+3,hemW=(o.long?hi:wa)+eHalf+3,yb=o.long?yHi+30:(o.crop?yW-6:yHi-8);
  top=`<path d="M${cx-sh-2},${yS} Q${cx},${yS-12} ${cx+sh+2},${yS} L${cx+tw},${yC} L${cx+hemW},${yb} L${cx-hemW},${yb} L${cx-tw},${yC}Z" fill="${esc(o.top)}" opacity=".92" stroke="#0003" stroke-width="1"/>`;}
 if(o.bot){const bw=hi+Math.max(-4,Math.min(8,(o.botEase||0)/2))+2;bot=`<path d="M${cx-wa-2},${yW-4} L${cx+wa+2},${yW-4} L${cx+bw},${yHi} L${cx+hi-2},${o.short?yHi+46:yF-14} L${cx+6},${o.short?yHi+46:yF-14} L${cx},${yHi+10} L${cx-6},${o.short?yHi+46:yF-14} L${cx-hi+2},${o.short?yHi+46:yF-14} L${cx-bw},${yHi}Z" fill="${esc(o.bot)}" opacity=".93" stroke="#0003" stroke-width="1"/>`;}
 if(o.skirt){const bw=hi+10;bot=`<path d="M${cx-wa-2},${yW-4} L${cx+wa+2},${yW-4} L${cx+bw+8},${yK} L${cx-bw-8},${yK}Z" fill="${esc(o.skirt)}" opacity=".93" stroke="#0003" stroke-width="1"/>`;}
 const acc=o.acc?`<ellipse cx="${cx+sh+14}" cy="${yW+24}" rx="11" ry="14" fill="${esc(o.acc)}" stroke="#0004"/>`:'';
 const shoe=o.shoe?`<ellipse cx="${cx-hi+3}" cy="${yF+3}" rx="12" ry="5" fill="${esc(o.shoe)}"/><ellipse cx="${cx+hi-3}" cy="${yF+3}" rx="12" ry="5" fill="${esc(o.shoe)}"/>`:'';
 return `<svg viewBox="0 0 200 ${Math.round(366*k)}" role="img" aria-label="Muñeco virtual con las medidas cargadas" style="width:100%;max-width:220px;height:auto;display:block;margin:0 auto"><rect width="200" height="${Math.round(366*k)}" rx="14" fill="#f6f3f0"/><circle cx="${cx}" cy="${yH}" r="${17*k}" fill="${skin}"/><rect x="${cx-5}" y="${yH+12}" width="10" height="${yN-yH-6}" fill="${skin}"/>${arms}<path d="${body}" fill="${skin}"/>${top}${bot}${acc}${shoe}</svg>`;}
/* ---------- promociones (motor de reglas) ---------- */
function nlLineProd(l){return prod(l.pid)||{};}
function nlPromoCalc(lines,custId){
 const n=NL();const res=[];const cust=custId?custById(custId):null;
 const el=lines.map(l=>({l,p:nlLineProd(l),amt:(typeof lnAmt==='function'?lnAmt(l):Math.round(l.qty*l.price))})).filter(x=>x.p.fam&&!noPromo(x.l));
 if(!el.length)return{disc:0,rules:[],best:null};
 n.promos.filter(r=>r.on).forEach(r=>{let d=0,why='';
  if(r.type==='2x1'){const units=[];el.filter(x=>(r.fam||[]).includes(x.p.fam)).forEach(x=>{for(let i=0;i<Math.floor(x.l.qty);i++)units.push(x.l.price);});units.sort((a,b)=>a-b);const free=Math.floor(units.length/2);d=units.slice(0,free).reduce((a,b)=>a+b,0);why=free?free+' prenda(s) sin cargo':'';}
  if(r.type==='vol'){const sel=el.filter(x=>(r.cats||[]).includes(x.p.rubro));const u=sel.reduce((a,x)=>a+x.l.qty,0);if(u>=r.min){const base=sel.reduce((a,x)=>a+x.amt,0);d=Math.round(base*r.pct/100);why=u+' prendas';}}
  if(r.type==='look'){const top=el.filter(x=>['nl-rem','nl-cam','nl-abr'].includes(x.p.rubro)),bot=el.filter(x=>x.p.rubro==='nl-pan'||x.p.fam==='pol-ple'||x.p.fam==='ves-mid'||x.p.fam==='ves-cam'),ac=el.filter(x=>x.p.rubro==='nl-acc');
   if(top.length&&bot.length&&ac.length){const mn=a=>Math.min(...a.map(x=>x.l.price));const base=mn(top)+mn(bot)+mn(ac);d=Math.round(base*r.pct/100);why='look completo';}}
  if(r.type==='seg'){if(cust&&cust.nl&&cust.nl.seg===r.seg){const base=el.reduce((a,x)=>a+x.amt,0);d=Math.round(base*r.pct/100);why='segmento '+r.seg;}}
  if(d>0)res.push({id:r.id,name:r.name,disc:d,why});});
 res.sort((a,b)=>b.disc-a.disc);return{disc:res[0]?res[0].disc:0,rules:res,best:res[0]||null};}
/* se engancha en el beneficio único de la demo: gana el MAYOR entre cupón/membresía y promoción (nunca se acumulan) */
function applyBenefit(lines,custId,code){const r=applyBenefit0(lines,custId,code);
 try{if(!isNLBuild())return r;const q=nlPromoCalc(lines,custId);
  if(q.best&&q.best.disc>r.disc){const prevNote=r.disc>0?'Se aplicó la promoción «'+q.best.name+'» (mayor beneficio): no se acumula con '+(r.label||'el cupón')+'.':'';
   return Object.assign({},r,{disc:q.best.disc,kind:'nlpromo',label:q.best.name+' · '+q.best.why,code:'',couponId:'',couponErr:'',note:prevNote||r.note,nlRule:q.best.id});}
 }catch(e){console.warn('nlPromo',e);}
 return r;}
/* puntos de fidelidad: 1 punto cada $ 1.000 pagados; se registran al cerrar la venta */
function commitSale(method,arca,channel,lines,opts){const src=(typeof pos!=='undefined'&&pos.nlSrc)||'';const r=commitSale0(method,arca,channel,lines,opts);
 try{if(isNLBuild()&&r&&r.sale){const s=r.sale;s.nlSrc=src||'directa';
  if(s.cust){const n=NL();const pts=Math.floor(s.total/100000);if(pts>0){n.points[s.cust]=(n.points[s.cust]||0)+pts;(n.pLog=n.pLog||[]).push({ts:now(),cust:s.cust,pts,why:'Compra '+s.n});}}
  if(src){const fl=NL().fitLog.slice().reverse().find(x=>!x.sale&&x.cust===(s.cust||''));if(fl)fl.sale=s.id;}
  if(typeof pos!=='undefined')pos.nlSrc='';}}catch(e){console.warn('nlCommit',e);}
 return r;}
/* ---------- movimientos entre ubicaciones, mermas y toma de inventario ---------- */
function nlMove(pid,from,to,qty,motivo){const p=prod(pid);if(!p)return{err:'Producto inexistente.'};qty=Math.round(+qty);if(!(qty>0))return{err:'Cantidad inválida.'};if(from===to)return{err:'Origen y destino son iguales.'};
 if(nlLocGet(p,from)<qty&&from!=='loc')return{err:'No alcanza el stock en '+NL_LN[from]+' (hay '+nlLocGet(p,from)+').'};
 nlLocSet(p,from,nlLocGet(p,from)-qty);nlLocSet(p,to,nlLocGet(p,to)+qty);
 const m={id:uid(),ts:now(),user:user?user.name:'sistema',type:'traspaso',pid,name:pfull(p),from,to,qty,motivo:motivo||''};NL().moves.push(m);
 audit('TRASPASO_UBICACION',pfull(p)+' · '+qty+' u · '+NL_LN[from]+' → '+NL_LN[to]+(motivo?' · '+motivo:''));save();return{ok:1,m};}
function nlMerma(pid,w,qty,motivo){const p=prod(pid);if(!p)return{err:'Producto inexistente.'};qty=Math.round(+qty);if(!(qty>0))return{err:'Cantidad inválida.'};if(!motivo||motivo.length<3)return{err:'El motivo es obligatorio.'};
 if(w!=='loc'&&nlLocGet(p,w)<qty)return{err:'No alcanza el stock en '+NL_LN[w]+'.'};
 nlLocSet(p,w,nlLocGet(p,w)-qty);const m={id:uid(),ts:now(),user:user?user.name:'sistema',type:'merma',pid,name:pfull(p),from:w,to:'',qty,motivo,cost:(p.cost||0)*qty};NL().moves.push(m);
 audit('MERMA',pfull(p)+' · '+qty+' u · '+NL_LN[w]+' · '+motivo+' · costo '+money(m.cost));save();return{ok:1,m};}
function nlApplyCount(w,counted,label){let adj=0,val=0,rows=[];counted.forEach(([pid,c])=>{const p=prod(pid);if(!p)return;const sys=nlLocGet(p,w);const d=c-sys;if(!d)return;
  nlLocSet(p,w,c);adj++;val+=d*(p.cost||0);rows.push({pid,name:pfull(p),sys,counted:c,diff:d,val:d*(p.cost||0)});NL().moves.push({id:uid(),ts:now(),user:user?user.name:'sistema',type:'conteo',pid,name:pfull(p),from:w,to:'',qty:d,motivo:'Toma de inventario '+(label||'')});});
 const rec={id:uid(),ts:now(),user:user?user.name:'sistema',loc:w,label:label||'',items:counted.length,adj,val,rows};NL().counts.push(rec);audit('TOMA_INVENTARIO',NL_LN[w]+' · '+(label||'')+' · '+counted.length+' prendas contadas · '+adj+' con diferencia · '+money(val));save();return rec;}
/* ---------- pedidos omnicanal ---------- */
const NL_OST={nuevo:'Nuevo',pagado:'Pagado',picking:'En picking',packing:'En packing',despachado:'Despachado',entregado:'Entregado',cancelado:'Cancelado',devuelto:'Devolución'};
function nlOrderTotal(o){return o.lines.reduce((a,l)=>a+l.qty*l.price,0)-(o.disc||0)+(o.ship&&o.ship.cost||0);}
function nlOrderCreate(f){const n=NL();const lines=[];const miss=[];
 for(const l of f.lines){const p=prod(l.pid);if(!p||!(l.qty>0))continue;lines.push({pid:p.id,name:pfull(p),qty:l.qty,price:p.price,cost:p.cost,fam:p.fam,talle:p.talle});
  const have=nlLocGet(p,'onl');if(have<l.qty)miss.push(pfull(p)+' (online: '+have+', pedido: '+l.qty+')');}
 if(!lines.length)return{err:'El pedido no tiene prendas.'};
 if(miss.length)return{err:'No alcanza el stock online para: '+miss.join('; ')+'. Traspasá desde el Depósito en «Moda y stock».'};
 const q=nlPromoCalc(lines.map(l=>({pid:l.pid,qty:l.qty,price:l.price,rubro:(prod(l.pid)||{}).rubro})),f.cust||'');
 lines.forEach(l=>{const p=prod(l.pid);nlLocSet(p,'onl',nlLocGet(p,'onl')-l.qty);});   /* reserva: sale del bucket online */
 const o={id:uid(),n:'W-'+(++n.seqW),ts:now(),channel:f.channel||'web',cust:f.cust||'',name:f.name||'',lines,disc:q.best?q.best.disc:0,discTxt:q.best?q.best.name:'',
  ship:{type:f.shipType||'envio',addr:f.addr||'',carrier:f.shipType==='retiro'?'':'Correo/Andreani (ejemplo)',cost:f.shipType==='retiro'?0:(+f.shipCost||0),track:''},pay:{state:'pendiente',link:'',method:''},state:'nuevo',log:[{ts:now(),user:user?user.name:'sistema',t:'Pedido creado · stock reservado en Online'}]};
 n.orders.push(o);audit('PEDIDO_ONLINE',o.n+' · '+o.lines.length+' prendas · '+money(nlOrderTotal(o)));save();return{ok:1,o};}
function nlOrderLog(o,t){o.log.push({ts:now(),user:user?user.name:'sistema',t});}
function nlOrderRestore(o){o.lines.forEach(l=>{const p=prod(l.pid);if(p)nlLocSet(p,'onl',nlLocGet(p,'onl')+l.qty);});}
function nlOrderSale(o){   /* al confirmarse el pago online nace la venta (canal «online»): no toca la caja física */
 const total=nlOrderTotal(o);const c=S.tenant.caja;S.seq[c]=(S.seq[c]||0)+1;
 const sale={id:uid(),n:'W'+c+'-'+S.seq[c],ts:now(),user:'online',caja:c,sessId:'',items:o.lines.map(l=>({pid:l.pid,name:l.name,rubro:(prod(l.pid)||{}).rubro,qty:l.qty,price:l.price,cost:l.cost,list:l.price,disc:0})),total,method:'qr',doc:'ticket_interno',status:'ok',fee:0,channel:'online',
  cust:o.cust||'',custName:o.cust?custFull(custById(o.cust)):o.name,coupon:'',benefit:o.disc?{kind:'nlpromo',label:o.discTxt,disc:o.disc}:null,recv:0,fiado:false,pays:[{m:'qr',a:total,fee:0}],fiadoAmt:0,paid:total,balance:0,vuelto:0,pstate:'pagada',nlOrder:o.id,nlSrc:'web'};
 S.sales.push(sale);o.sale=sale.id;
 if(o.cust){const n=NL();const pts=Math.floor(total/100000);if(pts>0){n.points[o.cust]=(n.points[o.cust]||0)+pts;}}
 return sale;}
/* ---------- devoluciones por talle / motivo ---------- */
const NL_RSN={talle_chico:'Talle chico',talle_grande:'Talle grande',no_gusto:'No le gustó',defecto:'Defecto de fábrica',color:'Color distinto',otro:'Otro'};
function nlReturn(f){const p=prod(f.pid);if(!p)return{err:'Producto inexistente.'};const qty=Math.round(+f.qty||1);if(!(qty>0))return{err:'Cantidad inválida.'};
 const n=NL();const r={id:uid(),n:'D-'+(++n.seqR),ts:now(),user:user?user.name:'sistema',pid:p.id,name:pfull(p),fam:p.fam,talle:p.talle,qty,reason:f.reason||'otro',refund:f.refund||'vale',sale:f.sale||'',cust:f.cust||'',value:p.price*qty,toLoc:f.reason==='defecto'?'merma':(f.toLoc||'loc'),coupon:''};
 if(r.toLoc==='merma'){n.moves.push({id:uid(),ts:now(),user:r.user,type:'merma',pid:p.id,name:pfull(p),from:'',to:'',qty,motivo:'Devolución por defecto '+r.n,cost:(p.cost||0)*qty});}
 else nlLocSet(p,r.toLoc,nlLocGet(p,r.toLoc)+qty);
 if(r.refund==='vale'){const code='VALE'+String(n.seqR).padStart(3,'0')+Math.random().toString(36).slice(2,5).toUpperCase();
  S.coupons.push({id:uid(),code,type:'amt',value:r.value,min:0,from:'',to:'',maxUses:1,perCust:1,aud:'todos',active:true,note:'Vale por devolución '+r.n+' (ejemplo)',uses:[]});r.coupon=code;}
 n.returns.push(r);audit('DEVOLUCION_MODA',r.n+' · '+pfull(p)+' ×'+qty+' · '+NL_RSN[r.reason]+' · '+(r.refund==='vale'?'vale '+r.coupon:r.refund));save();return{ok:1,r};}
