/* ===== Pedidos online / omnicanal, talleres, tablero de moda y Cliente 360 ===== */
const nlSupName=id=>{const s=(S.suppliers||[]).find(x=>x.id===id);return s?s.razon:'—';};
const nlStTag=s=>`<span class="tag ${s==='cancelado'||s==='devuelto'?'bad':s==='entregado'?'ok':s==='nuevo'?'warn':''}">${esc(NL_OST[s]||s)}</span>`;
/* ---- nuevo pedido online (modal reutilizable desde el probador) ---- */
function nlOrderModal(lines,cust){
 const L=(lines&&lines.length?lines:[]).map(l=>({pid:l.pid,qty:l.qty||1}));
 const cs=S.customers.filter(c=>!c.elim);
 const body=()=>`<div class="tw"><table><thead><tr><th>Prenda</th><th class="r">Online</th><th class="r">Cant.</th><th class="r">Precio</th></tr></thead><tbody>${L.map((l,i)=>{const p=prod(l.pid);return `<tr><td>${esc(pfull(p))}</td><td class="r">${nlLocGet(p,'onl')}</td><td class="r"><input data-nlinp="olq" data-i="${i}" inputmode="numeric" value="${l.qty}" style="width:60px;text-align:right"></td><td class="r">${money(p.price*l.qty)}</td></tr>`;}).join('')||'<tr><td colspan="4" class="mut">Sin prendas.</td></tr>'}</tbody></table></div>
  <label for="no-p">Agregar prenda</label><select id="no-p"><option value="">— elegir —</option>${nlProdOpts('')}</select>
  <div class="grid g2"><div><label for="no-c">Clienta</label><select id="no-c"><option value="">— nueva / sin ficha —</option>${cs.map(c=>`<option value="${c.id}" ${c.id===cust?'selected':''}>${esc(custFull(c))}</option>`).join('')}</select></div><div><label for="no-n">Nombre (si no tiene ficha)</label><input id="no-n" maxlength="60"></div>
  <div><label for="no-t">Entrega</label><select id="no-t">${nlOpt([['envio','Envío a domicilio'],['retiro','Retiro en el local']],'envio')}</select></div><div><label for="no-k">Canal de venta</label><select id="no-k">${nlOpt([['web','Tienda web'],['ig','Instagram'],['wa','WhatsApp']],'web')}</select></div></div>
  <label for="no-a">Dirección de entrega</label><input id="no-a" maxlength="120" placeholder="Calle y número, barrio (ejemplo)"><label for="no-s">Costo de envío ($)</label><input id="no-s" inputmode="decimal" placeholder="3500">
  <p class="sm mut">Al crear el pedido se <b>reserva el stock del bucket Online</b>. Si no alcanza, traspasá desde el Depósito en «Moda: talles y stock».</p>`;
 const w=modal('Nuevo pedido online',body(),{wide:true,okText:'Crear pedido',onOk:w=>{
  const f={lines:L.filter(l=>l.qty>0),cust:val('no-c'),name:val('no-n').trim(),shipType:val('no-t'),channel:val('no-k'),addr:val('no-a').trim(),shipCost:Math.round((parseNum(val('no-s')||'0')||0)*100)};
  if(!f.cust&&!f.name)return w._err('Falta la clienta o el nombre.'),false;if(f.shipType==='envio'&&!f.addr)return w._err('Falta la dirección de entrega.'),false;
  const r=nlOrderCreate(f);if(r.err)return w._err(r.err),false;toast('Pedido '+r.o.n+' creado');nlUI.omni.tab='kan';go('omni');rerender();}});
 const repaint=()=>{const mb=w.querySelector('.mb');const keep={c:val('no-c'),n:val('no-n'),t:val('no-t'),k:val('no-k'),a:val('no-a'),s:val('no-s')};mb.innerHTML=body();['c','n','t','k','a','s'].forEach(k=>{const e=document.getElementById('no-'+k);if(e)e.value=keep[k];});};
 w.addEventListener('change',e=>{if(e.target.id==='no-p'&&e.target.value){const ex=L.find(l=>l.pid===e.target.value);if(ex)ex.qty++;else L.push({pid:e.target.value,qty:1});repaint();}});
 w.addEventListener('input',e=>{const el=e.target.closest('[data-nlinp="olq"]');if(el){const q=Math.round(parseNum(el.value)||0);L[+el.dataset.i].qty=q;}});
 return w;}
nlIn.olq=()=>{};
/* ---- pantalla omnicanal ---- */
const NL_FLOW=['nuevo','pagado','picking','packing','despachado','entregado'];
function nlCardHTML(o){const idx=NL_FLOW.indexOf(o.state);const c=o.cust?custById(o.cust):null;const nm=c?custFull(c):o.name;
 return `<div class="card" style="margin:.4rem 0;padding:.6rem"><div class="row"><b class="sp">${esc(o.n)}</b>${nlStTag(o.state)}</div><div class="sm">${esc(nm)} · ${o.lines.reduce((a,l)=>a+l.qty,0)} prenda(s) · <b>${money(nlOrderTotal(o))}</b></div><div class="sm mut">${o.ship.type==='retiro'?'Retiro en local':'Envío'} · ${esc({web:'Web',ig:'Instagram',wa:'WhatsApp'}[o.channel]||o.channel)}${o.pay.state==='pagado'?' · pago confirmado':' · pago pendiente'}</div><div style="margin-top:.4rem"><button class="btn sm" data-act="nlOrdOpen" data-id="${o.id}">Abrir</button></div></div>`;}
reg('omni','Pedidos online y envíos','cart','sell',()=>{const n=NL();const t=nlUI.omni.tab;const T=[['kan','Tablero de pedidos'],['dev','Devoluciones']];let body='';
 if(t==='kan'){const act=n.orders.filter(o=>!['cancelado','devuelto'].includes(o.state));
  body=`<div class="row" style="margin:.4rem 0"><span class="sp mut sm">Los pedidos reservan stock del bucket <b>Online</b>. Al confirmarse el pago nace una venta de canal online que <b>no toca la caja física</b>.</span><button class="btn gold" data-act="nlOrdNew">+ Nuevo pedido</button></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:.6rem;align-items:start">${NL_FLOW.map(s=>{const L=act.filter(o=>o.state===s);return `<div><h4 style="margin:.2rem 0">${NL_OST[s]} <span class="tag">${L.length}</span></h4>${L.map(nlCardHTML).join('')||'<p class="sm mut">—</p>'}</div>`;}).join('')}</div>
  ${n.orders.some(o=>['cancelado','devuelto'].includes(o.state))?`<h4>Cancelados / devueltos</h4>${n.orders.filter(o=>['cancelado','devuelto'].includes(o.state)).map(nlCardHTML).join('')}`:''}`;}
 else{body=`<div class="card"><h3>Registrar devolución</h3><div class="grid g3"><div><label for="dv-p">Prenda</label><select id="dv-p">${nlProdOpts('')}</select></div><div><label for="dv-q">Cantidad</label><input id="dv-q" inputmode="numeric" placeholder="1"></div><div><label for="dv-r">Motivo</label><select id="dv-r">${nlOpt(Object.entries(NL_RSN),'talle_chico')}</select></div>
  <div><label for="dv-c">Clienta</label><select id="dv-c"><option value="">— sin ficha —</option>${S.customers.filter(c=>!c.elim).map(c=>`<option value="${c.id}">${esc(custFull(c))}</option>`).join('')}</select></div><div><label for="dv-f">Reintegro</label><select id="dv-f">${nlOpt([['vale','Vale de compra'],['efectivo','Efectivo'],['cambio','Cambio de talle']],'vale')}</select></div><div style="align-self:end"><button class="btn gold" data-act="nlDoReturn">Registrar</button></div></div>
  <p class="sm mut">La prenda vuelve al salón; si el motivo es «Defecto de fábrica» se registra como merma. El vale se emite como cupón de un solo uso.</p></div>
  <div class="card"><h3>Historial</h3><div class="tw"><table><thead><tr><th>N.º</th><th>Fecha</th><th>Prenda</th><th class="r">Cant.</th><th>Motivo</th><th>Reintegro</th><th class="r">Valor</th></tr></thead><tbody>${n.returns.slice().reverse().slice(0,80).map(r=>`<tr><td>${esc(r.n)}</td><td class="sm">${fmtDT(r.ts)}</td><td>${esc(r.name)}</td><td class="r">${r.qty}</td><td>${esc(NL_RSN[r.reason]||r.reason)}</td><td>${esc(r.refund)}${r.coupon?' <span class="sm mut">'+esc(r.coupon)+'</span>':''}</td><td class="r">${money(r.value)}</td></tr>`).join('')||'<tr><td colspan="7" class="mut">Sin devoluciones.</td></tr>'}</tbody></table></div></div>`;}
 return `<div class="row"><h1 class="sp">Pedidos online y envíos</h1><span class="tag sim">LINK DE PAGO, ENVÍOS Y GUÍAS SIMULADOS</span></div><div class="rtabs">${T.map(([k,x])=>`<button class="rtab ${t===k?'on':''}" data-act="nlOmniTab" data-t="${k}">${x}</button>`).join('')}</div>${body}`;},null,'Moda');
A.nlOmniTab=el=>{nlUI.omni.tab=el.dataset.t;rerender();};
A.nlOrdNew=()=>nlOrderModal([],'');
A.nlDoReturn=()=>{const r=nlReturn({pid:val('dv-p'),qty:parseNum(val('dv-q')||'1'),reason:val('dv-r'),cust:val('dv-c'),refund:val('dv-f')});if(r.err)return toast(r.err,1);toast('Devolución '+r.r.n+(r.r.coupon?' · vale '+r.r.coupon:''));rerender();};
A.nlOrdOpen=el=>{const o=NL().orders.find(x=>x.id===el.dataset.id);if(!o)return;const c=o.cust?custById(o.cust):null;const st=o.state;
 const link=o.pay.link||'';
 const btn=(a,t,cls)=>`<button class="btn ${cls||''}" data-act="${a}" data-id="${o.id}">${t}</button>`;
 let acts='';
 if(st==='nuevo')acts=(o.pay.link?'':btn('nlOrdLink','Generar link de pago','gold'))+(o.pay.link?btn('nlOrdPaid','Simular pago aprobado','gold')+btn('nlOrdCopy','Copiar link'):'')+(o.pay.link?`<a class="btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent('Hola! Tu pedido '+o.n+' de Urban por '+moneyTxt(nlOrderTotal(o))+' (ejemplo). Pagalo acá: '+link)}">Enviar por WhatsApp</a>`:'');
 if(st==='pagado')acts=btn('nlOrdPick','Pasar a picking','gold')+btn('nlOrdPrint','Imprimir lista de picking');
 if(st==='picking')acts=btn('nlOrdPack','Pasar a packing','gold')+btn('nlOrdPrint','Imprimir lista de picking');
 if(st==='packing')acts=btn('nlOrdShip',o.ship.type==='retiro'?'Listo para retirar':'Despachar (genera guía simulada)','gold');
 if(st==='despachado')acts=btn('nlOrdDeliv','Marcar entregado','gold');
 if(!['entregado','cancelado','devuelto'].includes(st))acts+=btn('nlOrdCancel','Cancelar pedido','red');
 const w=modal('Pedido '+o.n,`<div class="row">${nlStTag(st)}<span class="sp"></span><b>${money(nlOrderTotal(o))}</b></div>
  <p class="sm">${esc(c?custFull(c):o.name)} · ${o.ship.type==='retiro'?'Retiro en local':esc(o.ship.addr||'')+' · '+esc(o.ship.carrier||'')}${o.ship.track?' · guía <b>'+esc(o.ship.track)+'</b>':''}</p>
  <div class="tw"><table><thead><tr><th>Prenda</th><th class="r">Cant.</th><th class="r">Precio</th></tr></thead><tbody>${o.lines.map(l=>`<tr><td>${esc(l.name)}</td><td class="r">${l.qty}</td><td class="r">${money(l.price*l.qty)}</td></tr>`).join('')}${o.disc?`<tr><td>Promo: ${esc(o.discTxt)}</td><td></td><td class="r neg">−${money(o.disc)}</td></tr>`:''}${o.ship.cost?`<tr><td>Envío</td><td></td><td class="r">${money(o.ship.cost)}</td></tr>`:''}</tbody></table></div>
  ${link?`<p class="sm">Link de pago (simulado): <code>${esc(link)}</code></p>`:''}
  <div class="row" style="flex-wrap:wrap;gap:.4rem;margin:.5rem 0">${acts}</div>
  <h4>Historial</h4><ul class="sm">${o.log.slice().reverse().map(x=>`<li>${fmtDT(x.ts)} · ${esc(x.user)} · ${esc(x.t)}</li>`).join('')}</ul>`,{wide:true,okText:'Cerrar',onOk:()=>true});};
const moneyTxt=c=>money(c);
const nlOrdAct=(el,fn)=>{const o=NL().orders.find(x=>x.id===el.dataset.id);if(!o)return;fn(o);save();document.querySelectorAll('#modal-root .ov').forEach(x=>x.remove());rerender();};
A.nlOrdLink=el=>nlOrdAct(el,o=>{o.pay.link='https://pagos.urban-ejemplo.test/p/'+o.n+'-'+Math.random().toString(36).slice(2,8);nlOrderLog(o,'Link de pago generado (simulado)');toast('Link generado (simulado)');setTimeout(()=>A.nlOrdOpen(el),50);});
A.nlOrdCopy=el=>{const o=NL().orders.find(x=>x.id===el.dataset.id);try{navigator.clipboard.writeText(o.pay.link);toast('Link copiado');}catch(_){toast('Copialo a mano: '+o.pay.link);}};
A.nlOrdPaid=el=>nlOrdAct(el,o=>{o.pay={state:'pagado',link:o.pay.link,method:'qr'};o.state='pagado';nlOrderSale(o);nlOrderLog(o,'Pago aprobado (simulado) · se generó la venta online');audit('PEDIDO_PAGADO',o.n+' · simulado');toast('Pago simulado: venta online creada');});
A.nlOrdPick=el=>nlOrdAct(el,o=>{o.state='picking';nlOrderLog(o,'En picking');});
A.nlOrdPack=el=>nlOrdAct(el,o=>{o.state='packing';nlOrderLog(o,'En packing');});
A.nlOrdShip=el=>nlOrdAct(el,o=>{o.state='despachado';if(o.ship.type!=='retiro')o.ship.track='AR'+String(Math.floor(Math.random()*1e9)).padStart(9,'0')+' (ejemplo)';nlOrderLog(o,o.ship.type==='retiro'?'Listo para retirar':'Despachado · guía '+o.ship.track);});
A.nlOrdDeliv=el=>nlOrdAct(el,o=>{o.state='entregado';nlOrderLog(o,'Entregado');});
A.nlOrdCancel=el=>{const o=NL().orders.find(x=>x.id===el.dataset.id);if(!o)return;confirmBox('Cancelar pedido '+o.n,'Se devuelve el stock reservado al bucket Online.'+(o.sale?' El pedido ya estaba pagado: se anula también la venta online.':''),()=>{nlOrderRestore(o);o.state='cancelado';if(o.sale){const s=S.sales.find(x=>x.id===o.sale);if(s)s.status='anulada';}nlOrderLog(o,'Cancelado · stock restituido');audit('PEDIDO_CANCELADO',o.n);save();document.querySelectorAll('#modal-root .ov').forEach(x=>x.remove());rerender();},'Cancelar pedido');};
A.nlOrdPrint=el=>{const o=NL().orders.find(x=>x.id===el.dataset.id);if(!o)return;const w=window.open('','_blank');if(!w)return toast('El navegador bloqueó la ventana de impresión',1);
 w.document.write(`<html><head><title>Picking ${esc(o.n)}</title><style>body{font:14px sans-serif;padding:20px}td,th{border-bottom:1px solid #999;padding:6px;text-align:left}</style></head><body><h2>Lista de picking ${esc(o.n)}</h2><p>Urban · ${esc(o.ship.type==='retiro'?'Retiro':'Envío')} · ${esc(o.ship.addr||'')}</p><table><tr><th>Prenda</th><th>Cant.</th><th>OK</th></tr>${o.lines.map(l=>`<tr><td>${esc(l.name)}</td><td>${l.qty}</td><td>☐</td></tr>`).join('')}</table><p style="margin-top:30px;font-size:11px">${esc(VB.name)} · ${esc(VB.phone)} · ${esc(VB.mail)}</p></body></html>`);w.document.close();w.focus();w.print();};

/* ===== Talleres y producción ===== */
const NL_PST=['corte','confeccion','terminacion','recibida'];const NL_PSL={corte:'Corte',confeccion:'Confección',terminacion:'Terminación',recibida:'Recibida'};
const NL_CURVAS={'1-2-2-2-1':[1,2,2,2,1],'2-3-3-2-1':[2,3,3,2,1],'1-1-1-1-1':[1,1,1,1,1]};
reg('taller','Talleres y producción','factory','purchases',()=>{const n=NL();const ops=n.prod;
 const debt=(n.talleres||[]).reduce((a,id)=>{const s=(S.suppliers||[]).find(x=>x.id===id);return a+(s&&s.saldo>0?s.saldo:0);},0);
 const inProc=ops.filter(o=>o.state!=='recibida').reduce((a,o)=>a+o.lines.reduce((b,l)=>b+l.qty,0),0);
 return `<div class="row"><h1 class="sp">Talleres y producción</h1><button class="btn gold" data-act="nlOpNew">+ Nueva orden de producción</button></div>
 <div class="grid g3"><div class="kpi"><small>Deuda a talleres</small><b>${money(debt)}</b></div><div class="kpi"><small>Órdenes en curso</small><b>${ops.filter(o=>o.state!=='recibida').length}</b></div><div class="kpi"><small>Prendas en proceso</small><b>${inProc}</b></div></div>
 <p class="sm mut">Cada orden nace como <b>orden de compra al taller</b> (con su costo pactado) y avanza de corte a recibida. Al recibirla entra al Depósito y la deuda queda en la cuenta corriente del taller. <button class="btn sm" data-act="nlGoProv">Ir a Proveedores y compras</button></p>
 <div class="card"><div class="tw"><table><thead><tr><th>Orden</th><th>Taller</th><th>Modelo</th><th class="r">Prendas</th><th class="r">Costo pactado</th><th>Entrega</th><th>Estado</th><th></th></tr></thead><tbody>${ops.slice().reverse().map(o=>{const f=nlFamMap()[o.fam];const q=o.lines.reduce((a,l)=>a+l.qty,0),c=o.lines.reduce((a,l)=>a+l.qty*l.cost,0);const i=NL_PST.indexOf(o.state);
  return `<tr><td>${esc(o.n)}${o.demo?' <span class="tag sim">ejemplo</span>':''}</td><td>${esc(nlSupName(o.taller))}</td><td>${esc(f?f.name:o.fam)} ${nlSw(o.color)} ${esc(nlColName(o.color))}</td><td class="r">${q}</td><td class="r">${money(c)}</td><td class="sm">${o.state==='recibida'?'—':esc(new Date(o.eta).toLocaleDateString('es-AR'))}</td><td><span class="tag ${o.state==='recibida'?'ok':''}">${NL_PSL[o.state]}</span></td><td class="r">${o.state==='recibida'?'':`<button class="btn sm gold" data-act="nlOpNext" data-id="${o.id}">${i<2?'Pasar a '+NL_PSL[NL_PST[i+1]]:'Recibir en Depósito'}</button>`}</td></tr>`;}).join('')||'<tr><td colspan="8" class="mut">Sin órdenes.</td></tr>'}</tbody></table></div></div>`;},null,'Moda');
A.nlGoProv=()=>go('proveedores');
A.nlOpNext=async el=>{const n=NL();const o=n.prod.find(x=>x.id===el.dataset.id);if(!o)return;const i=NL_PST.indexOf(o.state);
 if(i<2){o.state=NL_PST[i+1];audit('PRODUCCION',o.n+' → '+NL_PSL[o.state]);save();rerender();return;}
 try{await nlRecibirADeposito({idempotency_key:'nl-op-'+o.id,proveedor_id:o.taller,tipo_comprobante:'Remito',nro_comprobante:'R-'+o.n,condicion_pago:'credito',orden_compra_id:o.oc,observaciones:'Recepción '+o.n,items:o.lines.map(l=>({producto_id:l.pid,cantidad:l.qty,precio_costo:l.cost}))});
  o.state='recibida';audit('PRODUCCION',o.n+' recibida en Depósito');save();toast(o.n+' recibida en el Depósito');rerender();}catch(e){toast(String(e&&e.message||e),1);}};
A.nlOpNew=()=>{const tal=(NL().talleres||[]).map(id=>[id,nlSupName(id)]);if(!tal.length)return toast('Primero cargá un taller en Proveedores y compras',1);
 const fams=Object.values(nlFamMap()).filter(f=>f.chart!=='u'&&f.chart!=='calz');
 modal('Nueva orden de producción',`<div class="grid g2"><div><label for="op-t">Taller</label><select id="op-t">${nlOpt(tal,'')}</select></div><div><label for="op-f">Modelo</label><select id="op-f">${fams.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select></div>
  <div><label for="op-c">Color</label><select id="op-c"></select></div><div><label for="op-k">Curva de talles (por talle, de menor a mayor)</label><select id="op-k">${nlOpt(Object.keys(NL_CURVAS).map(k=>[k,k]),'1-2-2-2-1')}</select></div>
  <div><label for="op-m">Múltiplo (curvas)</label><input id="op-m" inputmode="numeric" value="3"></div><div><label for="op-p">Costo pactado por prenda ($)</label><input id="op-p" inputmode="decimal" placeholder="8000"></div></div><p class="sm mut">Se crea una orden de compra al taller por cada talle de la curva.</p>`,
  {okText:'Crear orden',onOk:async w=>{const fam=val('op-f'),col=val('op-c'),tal=val('op-t'),mult=Math.max(1,Math.round(parseNum(val('op-m')||'1'))),cost=Math.round((parseNum(val('op-p')||'0')||0)*100);
   if(!(cost>0))return w._err('Ingresá el costo pactado.'),false;const f=nlFamMap()[fam];const sizes=NL_SIZES[f.chart];const cv=NL_CURVAS[val('op-k')];
   const items=[];sizes.slice(0,cv.length).forEach((sz,i)=>{const p=S.products.find(x=>x.fam===fam&&x.color===col&&x.talle===sz);if(p)items.push({producto_id:p.id,cantidad:cv[i]*mult,precio_costo_pactado:cost});});
   if(!items.length)return w._err('No hay variantes para ese modelo y color.'),false;
   try{const n=NL();const oc=await LOCAL.ocSave({idempotency_key:'nl-op-n-'+uid(),proveedor_id:tal,estado:'Solicitada',observaciones:'Orden de producción',items});
    n.prod.push({id:uid(),n:'OP-'+String(n.prod.length+1).padStart(3,'0'),taller:tal,fam,color:col,lines:items.map(i=>({pid:i.producto_id,qty:i.cantidad,cost:i.precio_costo_pactado})),state:'corte',ts:now(),eta:now()+7*86400000,oc:oc.id||oc.orden_compra_id||''});
    audit('PRODUCCION','Nueva orden · '+f.name);save();toast('Orden creada');rerender();}catch(e){w._err(String(e&&e.message||e));return false;}}});
 const sync=()=>{const f=nlFamMap()[val('op-f')];const c=document.getElementById('op-c');if(c&&f)c.innerHTML=f.colors.map(k=>`<option value="${k}">${esc(nlColName(k))}</option>`).join('');};
 sync();document.getElementById('op-f').addEventListener('change',sync);};

/* ===== Tablero de moda (BI) ===== */
reg('bimoda','Tablero de moda','chart','view_cost',()=>{const n=NL();const days=nlUI.bi.days;const since=dkey(now()-(days-1)*86400000);
 const sales=S.sales.filter(s=>s.status==='ok'&&dkey(s.ts)>=since&&s.items.some(i=>(prod(i.pid)||{}).fam));
 const gmv=sales.reduce((a,s)=>a+s.total,0),tk=sales.length?Math.round(gmv/sales.length):0;
 const units=sales.reduce((a,s)=>a+s.items.reduce((b,i)=>b+i.qty,0),0),upt=sales.length?units/sales.length:0;
 const cost=sales.reduce((a,s)=>a+s.items.reduce((b,i)=>b+(i.cost||0)*i.qty,0),0),mg=gmv>0?(gmv-cost)/gmv*100:0;
 const fit=n.fitLog.filter(f=>dkey(f.ts)>=since);const sesions=new Set(fit.map(f=>dkey(f.ts)+'|'+(f.cust||f.id))).size;
 const viaP=sales.filter(s=>s.nlSrc==='probador').length,dir=sales.filter(s=>s.nlSrc!=='probador').length;
 const visits=Object.entries(n.traffic).filter(([k])=>k>=since).reduce((a,[,v])=>a+v,0);
 const convP=sesions>0?viaP/sesions*100:null,convD=(visits-sesions)>0?dir/(visits-sesions)*100:null;
 const rets=n.returns.filter(r=>dkey(r.ts)>=since);const retU=rets.reduce((a,r)=>a+r.qty,0),retPct=units>0?retU/units*100:0;
 const byDay={};sales.forEach(s=>{const k=dkey(s.ts);byDay[k]=(byDay[k]||0)+s.total;});const dk=[];for(let i=days-1;i>=0;i--)dk.push(dkey(now()-i*86400000));const mx=Math.max(1,...dk.map(k=>byDay[k]||0));
 const ch={loc:0,onl:0};sales.forEach(s=>{ch[s.channel==='online'?'onl':'loc']+=s.total;});
 const rt={};rets.forEach(r=>{rt[r.talle||'?']=(rt[r.talle||'?']||0)+r.qty;});const rr={};rets.forEach(r=>{rr[r.reason]=(rr[r.reason]||0)+r.qty;});
 const fam={};sales.forEach(s=>s.items.forEach(i=>{const p=prod(i.pid);if(!p||!p.fam)return;const f=fam[p.fam]=fam[p.fam]||{u:0,v:0,c:0};f.u+=i.qty;f.v+=i.price*i.qty;f.c+=(i.cost||0)*i.qty;}));
 const abc=Object.entries(fam).sort((a,b)=>b[1].v-a[1].v);let acc=0;const tot=abc.reduce((a,[,x])=>a+x.v,0)||1;
 const abcR=abc.map(([id,x])=>{acc+=x.v;const pc=acc/tot*100;return{id,x,cls:pc-x.v/tot*100<80?'A':pc-x.v/tot*100<95?'B':'C'};});
 const sold={};S.sales.filter(s=>s.status==='ok'&&dkey(s.ts)>=since).forEach(s=>s.items.forEach(i=>{sold[i.pid]=(sold[i.pid]||0)+i.qty;}));
 const slow=S.products.filter(p=>p.fam&&p.active&&nlTotal(p)>0&&!(sold[p.id]>0)).sort((a,b)=>nlTotal(b)*b.cost-nlTotal(a)*a.cost);
 const slowVal=slow.reduce((a,p)=>a+nlTotal(p)*(p.cost||0),0);
 const stv={loc:0,dep:0,onl:0};S.products.filter(p=>p.fam&&p.active).forEach(p=>{['loc','dep','onl'].forEach(w=>{stv[w]+=Math.max(0,nlLocGet(p,w))*(p.cost||0);});});
 const stU=S.products.filter(p=>p.fam&&p.active).reduce((a,p)=>a+Math.max(0,nlTotal(p)),0);const sell=(units+stU)>0?units/(units+stU)*100:0;
 const pc=v=>v==null?'N/D':String(Math.round(v*10)/10).replace('.',',')+' %';
 return `<div class="row"><h1 class="sp">Tablero de moda</h1><span class="tag sim">${IS_CLIENT?'':'DATOS DE EJEMPLO'}</span><button class="btn sm gold" data-act="nlVisit">+1 ingreso al local</button></div>
 <div class="row" style="flex-wrap:wrap">${[7,14,30].map(d=>`<button class="btn sm ${days===d?'gold':''}" data-act="nlBiDays" data-d="${d}">${d} días</button>`).join('')}<span class="sm mut">Del ${since} a hoy · zona horaria de Salta</span></div>
 <div class="grid g4">
  <div class="kpi"><small>GMV (ventas brutas)</small><b>${money(gmv)}</b><span class="sm mut">Σ total de ventas de moda</span></div>
  <div class="kpi"><small>Ticket promedio</small><b>${money(tk)}</b><span class="sm mut">GMV ÷ ${sales.length} ventas</span></div>
  <div class="kpi"><small>Prendas por ticket (UPT)</small><b>${String(Math.round(upt*100)/100).replace('.',',')}</b><span class="sm mut">${units} u ÷ ${sales.length}</span></div>
  <div class="kpi"><small>Margen bruto estimado</small><b>${pc(mg)}</b><span class="sm mut">(ventas − costo) ÷ ventas · no descuenta gastos</span></div>
  <div class="kpi"><small>Conversión con probador</small><b>${pc(convP)}</b><span class="sm mut">${viaP} ventas ÷ ${sesions} sesiones de probador</span></div>
  <div class="kpi"><small>Conversión directa</small><b>${pc(convD)}</b><span class="sm mut">${dir} ventas ÷ (${visits} ingresos − ${sesions} sesiones)</span></div>
  <div class="kpi"><small>Devoluciones</small><b>${pc(retPct)}</b><span class="sm mut">${retU} u devueltas ÷ ${units} vendidas</span></div>
  <div class="kpi"><small>Sell-through</small><b>${pc(sell)}</b><span class="sm mut">vendidas ÷ (vendidas + stock actual)</span></div></div>
 <div class="grid g2"><div class="card"><h3>Ventas por día</h3><div style="display:flex;align-items:flex-end;gap:2px;height:120px" role="img" aria-label="Ventas por día">${dk.map(k=>`<i title="${k}: ${money(byDay[k]||0)}" style="flex:1;background:var(--gold,#0a0a0a);height:${Math.round((byDay[k]||0)/mx*100)}%;min-height:1px"></i>`).join('')}</div>
  <details><summary class="sm">Ver como tabla</summary><div class="tw"><table><thead><tr><th>Día</th><th class="r">Ventas</th></tr></thead><tbody>${dk.slice().reverse().map(k=>`<tr><td>${k}</td><td class="r">${money(byDay[k]||0)}</td></tr>`).join('')}</tbody></table></div></details></div>
  <div class="card"><h3>Mix de canal</h3><div class="tw"><table><thead><tr><th>Canal</th><th class="r">Ventas</th><th class="r">Participación</th></tr></thead><tbody><tr><td>Local</td><td class="r">${money(ch.loc)}</td><td class="r">${pc(gmv?ch.loc/gmv*100:null)}</td></tr><tr><td>Online</td><td class="r">${money(ch.onl)}</td><td class="r">${pc(gmv?ch.onl/gmv*100:null)}</td></tr></tbody></table></div>
  <h3>Stock valorizado a costo</h3><div class="tw"><table><tbody>${['loc','dep','onl'].map(w=>`<tr><td>${NL_LN[w]}</td><td class="r">${money(stv[w])}</td></tr>`).join('')}</tbody></table></div></div></div>
 <div class="grid g2"><div class="card"><h3>Devoluciones por talle</h3><div class="tw"><table><thead><tr><th>Talle</th><th class="r">Unidades</th></tr></thead><tbody>${Object.entries(rt).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<tr><td>${esc(k)}</td><td class="r">${v}</td></tr>`).join('')||'<tr><td colspan="2" class="mut">Sin devoluciones.</td></tr>'}</tbody></table></div>
  <h3>Por motivo</h3><div class="tw"><table><tbody>${Object.entries(rr).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<tr><td>${esc(NL_RSN[k]||k)}</td><td class="r">${v}</td></tr>`).join('')||'<tr><td class="mut">—</td></tr>'}</tbody></table></div></div>
  <div class="card"><h3>Ranking ABC por modelo</h3><div class="tw"><table><thead><tr><th>Modelo</th><th class="r">Unid.</th><th class="r">Ventas</th><th class="r">Margen</th><th>Clase</th></tr></thead><tbody>${abcR.slice(0,14).map(({id,x,cls})=>`<tr><td>${esc((nlFamMap()[id]||{}).name||id)}</td><td class="r">${x.u}</td><td class="r">${money(x.v)}</td><td class="r">${pc(x.v?(x.v-x.c)/x.v*100:null)}</td><td><span class="tag ${cls==='A'?'ok':cls==='C'?'warn':''}">${cls}</span></td></tr>`).join('')||'<tr><td colspan="5" class="mut">Sin datos suficientes.</td></tr>'}</tbody></table></div><p class="sm mut">A = hasta el 80 % acumulado de ventas · B = hasta 95 % · C = el resto.</p></div></div>
 <div class="card"><h3>Slow movers (sin ventas en ${days} días) · capital inmovilizado ${money(slowVal)}</h3><div class="tw"><table><thead><tr><th>Prenda</th><th class="r">Stock total</th><th class="r">Valor a costo</th></tr></thead><tbody>${slow.slice(0,15).map(p=>`<tr><td>${esc(pfull(p))}</td><td class="r">${nlTotal(p)}</td><td class="r">${money(nlTotal(p)*(p.cost||0))}</td></tr>`).join('')||'<tr><td colspan="3" class="mut">Todo rota.</td></tr>'}</tbody></table></div></div>${nlNotifyCard()}`;},null,'Moda');
A.nlBiDays=el=>{nlUI.bi.days=+el.dataset.d;rerender();};
A.nlVisit=()=>{const n=NL();const k=dkey(now());n.traffic[k]=(n.traffic[k]||0)+1;save();toast('Ingreso registrado');rerender();};

/* ===== Cliente 360 y reglas de promoción ===== */
reg('cli360','Cliente 360 y promos','users','customers',()=>{const n=NL();const C=nlUI.c360;const q=asFold(C.q||'');
 const list=S.customers.filter(c=>!c.elim&&(!q||asFold(custFull(c)).includes(q))).slice(0,40);const c=C.id?custById(C.id):null;
 let card='<p class="sm mut">Elegí una clienta de la lista para ver su ficha completa.</p>';
 if(c){const nl=c.nl||{};const m=nl.m||{};const sales=S.sales.filter(s=>s.cust===c.id&&s.status==='ok');const tot=sales.reduce((a,s)=>a+s.total,0);const pts=n.points[c.id]||0;
  const rets=n.returns.filter(r=>r.cust===c.id);const ords=n.orders.filter(o=>o.cust===c.id);const plog=(n.pLog||[]).filter(x=>x.cust===c.id).slice(-8).reverse();
  const sug=['rem-bas','jea-rec','cam-lin'].map(f=>{const r=nlFitCalc(f,m);return r.best&&Object.keys(m).some(k=>k!=='pref'&&m[k])?`${esc((nlFamMap()[f]||{}).name)}: <b>${esc(r.best.size)}</b>`:null;}).filter(Boolean);
  card=`<div class="row"><h3 class="sp">${esc(custFull(c))}</h3><span class="tag">${esc({vip:'VIP',frecuente:'Frecuente',nueva:'Nueva',ocasional:'Ocasional'}[nl.seg]||nl.seg||'Sin segmento')}</span></div>
  <div class="grid g4"><div class="kpi"><small>Compras</small><b>${sales.length}</b></div><div class="kpi"><small>Total comprado</small><b>${money(tot)}</b></div><div class="kpi"><small>Puntos</small><b>${pts}</b></div><div class="kpi"><small>Devoluciones</small><b>${rets.length}</b></div></div>
  <div class="grid g3" style="margin-top:.6rem"><div><label for="c3-s">Segmento</label><select id="c3-s">${nlOpt([['','Sin segmento'],['nueva','Nueva'],['ocasional','Ocasional'],['frecuente','Frecuente'],['vip','VIP']],nl.seg||'')}</select></div><div><label for="c3-y">Estilo</label><input id="c3-y" maxlength="60" value="${esc(nl.style||'')}" placeholder="Casual, formal…"></div><div style="align-self:end"><button class="btn gold" data-act="nlC360Save">Guardar</button></div></div>
  <p class="sm">Medidas: ${['pecho','cintura','cadera','altura','pie'].map(k=>m[k]?k+' '+m[k]:'').filter(Boolean).join(' · ')||'sin cargar'} · calce ${esc(m.pref||'regular')} <button class="btn sm" data-act="nlC360Fit">Abrir en el probador</button></p>
  ${sug.length?`<p class="sm">Talle sugerido: ${sug.join(' · ')}</p>`:''}
  <div class="card" style="background:#fbf0f3"><b>Puntos: ${pts}</b> (1 punto cada $ 1.000 de compra) <button class="btn sm gold" data-act="nlRedeem" ${pts>=100?'':'disabled'}>Canjear 100 pts → vale $ 5.000</button>
  <ul class="sm">${plog.map(x=>`<li>${fmtDT(x.ts)} · ${x.pts>0?'+':''}${x.pts} · ${esc(x.why)}</li>`).join('')||'<li class="mut">Sin movimientos.</li>'}</ul></div>
  <h4>Últimas compras</h4><div class="tw"><table><tbody>${sales.slice(-6).reverse().map(s=>`<tr><td>${fmtDT(s.ts)}</td><td>${esc(s.n)}</td><td>${esc(s.channel==='online'?'Online':'Local')}${s.nlSrc==='probador'?' · probador':''}</td><td class="r">${money(s.total)}</td></tr>`).join('')||'<tr><td class="mut">Sin compras.</td></tr>'}</tbody></table></div>
  ${ords.length?`<p class="sm">Pedidos online: ${ords.map(o=>esc(o.n)+' ('+esc(NL_OST[o.state])+')').join(', ')}</p>`:''}
  ${rets.length?`<p class="sm">Devoluciones: ${rets.map(r=>esc(r.name)+' – '+esc(NL_RSN[r.reason])).join('; ')}</p>`:''}`;}
 return `<div class="row"><h1 class="sp">Cliente 360 y promociones</h1></div>
 <div class="grid g2" style="align-items:start"><div class="card"><label for="c3-q">Buscar clienta</label><input id="c3-q" data-nlinp="c3q" value="${esc(C.q||'')}" placeholder="Nombre"><div style="max-height:360px;overflow:auto;margin-top:.4rem">${list.map(x=>`<button class="btn sm ${x.id===C.id?'gold':''}" style="display:block;width:100%;text-align:left;margin:2px 0" data-act="nlC360Pick" data-id="${x.id}">${esc(custFull(x))}${x.channel==='mayorista'?' · mayorista':''}</button>`).join('')||'<p class="sm mut">Sin resultados.</p>'}</div></div>
 <div class="card">${card}</div></div>
 <div class="card"><h3>Reglas de promoción</h3><p class="sm mut">Se aplica <b>una sola</b> regla por compra (la de mayor beneficio) y nunca se acumula con cupón o membresía: gana el mayor.</p>
 <div class="tw"><table><thead><tr><th>Regla</th><th>Detalle</th><th>Activa</th></tr></thead><tbody>${n.promos.map(r=>`<tr><td>${esc(r.name)}</td><td class="sm">${esc(r.note)}${r.pct?' · '+r.pct+' %':''}</td><td><label><input type="checkbox" data-nlchg="promo" data-id="${r.id}" ${r.on?'checked':''}> ${r.on?'Sí':'No'}</label></td></tr>`).join('')}</tbody></table></div></div>`;},null,'Moda');
nlIn.c3q=el=>{nlUI.c360.q=el.value;clearTimeout(nlIn._c);nlIn._c=setTimeout(()=>{const p=el.selectionStart;rerender();const e=document.getElementById('c3-q');if(e){e.focus();try{e.setSelectionRange(p,p);}catch(_){}}},200);};
nlCh.promo=el=>{const r=NL().promos.find(x=>x.id===el.dataset.id);if(r){r.on=el.checked;audit('PROMO',r.name+(r.on?' activada':' desactivada'));save();rerender();}};
A.nlC360Pick=el=>{nlUI.c360.id=el.dataset.id;rerender();};
A.nlC360Save=()=>{const c=custById(nlUI.c360.id);if(!c)return;c.nl=c.nl||{};c.nl.seg=val('c3-s');c.nl.style=val('c3-y').trim();audit('CLIENTE_360',custFull(c)+' · segmento '+(c.nl.seg||'—'));save();toast('Ficha guardada');rerender();};
A.nlC360Fit=()=>{nlLoadCust(nlUI.c360.id);go('probador');};
A.nlRedeem=()=>{const n=NL();const id=nlUI.c360.id;if((n.points[id]||0)<100)return;confirmBox('Canjear puntos','Se descuentan 100 puntos y se emite un vale de $ 5.000 de un solo uso.',()=>{n.points[id]-=100;const code='PTS'+Math.random().toString(36).slice(2,7).toUpperCase();S.coupons.push({id:uid(),code,type:'amt',value:500000,min:0,from:'',to:'',maxUses:1,perCust:1,aud:'todos',active:true,note:'Canje de puntos (ejemplo)',uses:[]});(n.pLog=n.pLog||[]).push({ts:now(),cust:id,pts:-100,why:'Canje · vale '+code});audit('PUNTOS_CANJE',code);save();toast('Vale '+code+' emitido');rerender();},'Canjear');};
