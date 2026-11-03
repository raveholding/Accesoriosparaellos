/* ===== Urban Ropa · Menú y módulos con la estructura de Tienda Nube (sobre Sistema VB V26.29) =====
   Reordena el panel como el administrador de Tiendanube:
     Inicio · Estadísticas | Gestión: Ventas, Productos, Pago Nube, Envío Nube, Clientes, Descuentos, Marketing |
     Canales de venta: Tienda online, Punto de Venta, Chat, Instagram y Facebook, Google Shopping, ChatGPT Ads, TikTok,
     Pinterest, WhatsApp, Marketplaces | Aplicaciones: Aplicaciones, Ruleta y Gamificación, Andreani, Correo Argentino | Configuración.
   Cada ítem agrupa pantallas ya existentes del Sistema VB (pestañas) y suma lo que faltaba, siempre con datos reales de la demo.
   Todo lo externo (cuentas, transportistas, procesadores de pago, plataformas) es SIMULADO. Datos y tarifas de EJEMPLO. */
['tag:M3 12V4h8l9 9-8 8zM8 8h.01','card:M3 6h18v12H3zM3 10h18M7 15h3','mega:M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a4 4 0 0 1 0 6M18 7a7 7 0 0 1 0 10',
 'store:M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 0 0 6 0 3 3 0 0 0 4 0 3 3 0 0 0 6 0M9 20v-6h6v6','pos:M5 3h14v18H5zM8 7h8M8 11h2M12 11h2M8 15h2M12 15h2',
 'chat:M4 5h16v11H9l-5 4z','ig:M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 .01 0M17.5 6.5h.01',
 'gshop:M3 7h18l-2 12H5zM8 7a4 4 0 0 1 8 0','bot:M5 8h14v10H5zM12 4v4M9 13h.01M15 13h.01M9 16h6','tiktok:M14 3v11a3.5 3.5 0 1 1-3.5-3.5M14 3a5 5 0 0 0 5 5',
 'pin:M12 22v-7M8 9a4 4 0 1 1 8 0c0 3-4 6-4 6s-4-3-4-6z','wa:M3 21l1.6-5A8.5 8.5 0 1 1 8 19.4zM9 9c0 3 3 6 6 6l1.5-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z',
 'apps:M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z','dice:M4 4h16v16H4zM8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01','parcel:M3 7l9-4 9 4v10l-9 4-9-4zM12 11v10M7.5 5l9 4',
 'truck:M2 6h11v10H2zM13 9h5l4 4v3h-9M6 19a2 2 0 1 0 .01 0M17 19a2 2 0 1 0 .01 0','chart:M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8','camera:M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 .01 0'
].forEach(s=>{const i=s.indexOf(':');const k=s.slice(0,i);if(!IC[k])IC[k]=s.slice(i+1);});

const URUI={v:{q:'',ch:'all',st:'ok',days:30},st:{days:30},car:{andreani:'cot',correo:'cot'},chat:{sel:''},cot:{cp:'4400',kg:'1',decl:'',svc:'dom',res:null}};
const URMS=864e5;
function urPub(){return((window.RAVE_BUILD&&RAVE_BUILD.publicUrl)||location.href.split('#')[0])+'#menu';}
const urKpi=(l,v,s)=>`<div class="card kpi"><b>${v}</b><span>${l}</span>${s?`<span class="mut">${s}</span>`:''}</div>`;
const urGrid=(h,m)=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(${m||170}px,1fr));gap:.6rem;margin:.6rem 0">${h}</div>`;
const urHead=(t,tag)=>`<div class="row"><h1 class="sp">${t}</h1>${tag?`<span class="tag sim">${tag}</span>`:''}</div>`;
const urOpts=(L,sel)=>L.map(([k,l])=>`<option value="${esc(k)}"${k===sel?' selected':''}>${esc(l)}</option>`).join('');
const urNum=(v,d)=>{const n=parseNum(v);return isNaN(n)?d:n;};
const urCsv=(name,h,rows)=>download(name,toCSV(h,rows),'text/csv;charset=utf-8');

/* ---------------- estado propio (S.ur) ---------------- */
function urSeedChat(){const t=now();const m=(f,x,ago)=>({from:f,t:x,ts:t-ago*60000});
 return[
  {id:'ch1',who:'Sofía Álvarez',src:'ig',unread:2,msgs:[m('c','Hola! El jean recto denim claro lo tienen en talle 40?',95),m('c','Es para retirar hoy si se puede',92)]},
  {id:'ch2',who:'Camila Torres',src:'wa',unread:1,msgs:[m('c','Buenas, hacen envíos a Tucumán? Cuánto sale?',300)]},
  {id:'ch3',who:'Visitante web',src:'web',unread:1,msgs:[m('c','¿Tienen guía de talles para el vestido midi?',640)]},
  {id:'ch4',who:'Lucía Gómez',src:'wa',unread:0,msgs:[m('c','Gracias! Ya me llegó el pedido',2900),m('t','De nada Lucía! Cualquier cambio de talle nos escribís 🙌',2880)]},
  {id:'ch5',who:'Valentina Ruiz',src:'ig',unread:0,msgs:[m('c','Qué hermoso el tapado camel! Hay en L?',4300),m('t','Hola Valen! Sí, quedan 2 en L. Te lo separamos?',4280),m('c','Sí porfa, paso mañana',4270)]}];}
function UR(){if(!S.ur)S.ur={};const t=S.ur;
 t.ch=t.ch||{};
 [['igfb','@urban.ropa'],['gshop',''],['gpt',''],['tiktok',''],['pin',''],['wa',''],['mkt','']].forEach(([k,a])=>{if(!t.ch[k])t.ch[k]={on:k==='igfb'||k==='wa'||k==='mkt',acc:a,done:[]};});
 t.pay=t.pay||{m:[{id:'efectivo',n:'Efectivo',fee:0,days:0,on:true},{id:'debito',n:'Tarjeta de débito',fee:1.5,days:2,on:true},{id:'credito',n:'Tarjeta de crédito',fee:4.2,days:10,on:true},
  {id:'transferencia',n:'Transferencia',fee:0,days:0,on:true},{id:'qr',n:'QR / Mercado Pago',fee:0.8,days:0,on:true}],cuotas:{on:true,max:6,si:3}};
 t.env=t.env||{free:8000000,retiro:true,z:[{id:'z1',n:'Salta Capital',cp:'440',price:350000,days:'1-2'},{id:'z2',n:'Provincia de Salta y NOA',cp:'4',price:590000,days:'2-4'},
  {id:'z3',n:'Centro y Cuyo',cp:'5',price:720000,days:'3-5'},{id:'z4',n:'AMBA y Litoral',cp:'1,2,3',price:890000,days:'3-6'},{id:'z5',n:'Patagonia',cp:'8,9',price:1190000,days:'5-8'}]};
 t.car=t.car||{andreani:{on:true,cuenta:'AND-EJ-0001',dom:true,suc:true},correo:{on:true,cuenta:'CA-EJ-0001',dom:true,suc:true}};
 t.mk=t.mk||{L:[{id:'ml',n:'Mercado Libre',on:true,markup:12,stock:60},{id:'fa',n:'Falabella Marketplace',on:false,markup:15,stock:40}]};
 t.rul=t.rul||{on:true,prizes:[{id:'r1',t:'10 % de descuento',type:'pct',v:10,w:25},{id:'r2',t:'15 % de descuento',type:'pct',v:15,w:10},{id:'r3',t:'5 % de descuento',type:'pct',v:5,w:20},
  {id:'r4',t:'$ 5.000 de descuento',type:'fixed',v:500000,w:10},{id:'r5',t:'Seguí participando',type:'none',v:0,w:35}],log:[]};
 t.wa=t.wa||{tpl:['Hola! Gracias por escribirnos 🙌 ¿En qué te podemos ayudar? Podés ver todo el catálogo acá: {link}','Hola {nombre}! Tu pedido está en camino. Te dejamos la guía de seguimiento: {guia}','Hola {nombre}! Volvió el talle que estabas buscando. Pasá o reservalo por acá 😉']};
 t.mk2=t.mk2||{aud:{},msg:'Hola {nombre}! Te escribimos de {negocio}. {texto}'};
 t.photos=t.photos||{};t.video=t.video||{};
 if(!t.chat)t.chat=urSeedChat();
 return t;}

/* ---------------- definición del menú ---------------- */
const UR_SECS=[
 {t:'',items:[['inicio','Inicio','home',[['inicio','Resumen']]],['estad','Estadísticas','chart',[['bimoda','Tablero de moda'],['ur_stats','Ventas por canal']]]]},
 {t:'Gestión',items:[
  ['ventas','Ventas','cart',[['ur_ventas','Todas las ventas'],['omni','Pedidos online y envíos'],['caja','Caja'],['arqueo','Arqueo / cierre'],['cierres','Cajas cerradas'],['cajasx','Sucursales']],'badgeVentas'],
  ['prod','Productos','box',[['inventario','Inventario'],['moda','Talles y stock'],['ur_fotos','Fotos y video'],['proveedores','Proveedores y compras'],['taller','Talleres y producción'],['impex','Importar / Exportar']]],
  ['pago','Pago Nube','card',[['ur_pagos','Cobros y medios de pago']]],
  ['envio','Envío Nube','truck',[['ur_envios','Envíos y tarifas']],null,'Nuevo'],
  ['cli','Clientes','users',[['clientes','Clientes'],['fidel','Fidelización']]],
  ['desc','Descuentos','tag',[['cupones','Cupones y membresías'],['cli360','Promociones y Cliente 360']]],
  ['mkt','Marketing','mega',[['ur_mkt','Campañas y audiencias']]]]},
 {t:'Canales de venta',items:[
  ['tienda','Tienda online','store',[['menuadmin','Tienda pública'],['diseno','Diseño y estilo'],['integ','Tiendanube y conexiones'],['legal','Legal y cumplimiento']]],
  ['pos','Punto de Venta','pos',[['vender','Vender'],['probador','Probador y looks'],['dispositivos','Periféricos y ticket']]],
  ['chat','Chat','chat',[['ur_chat','Mensajes']],'badgeChat'],
  ['igfb','Instagram y Facebook','ig',[['ur_igfb','Instagram y Facebook']]],
  ['gshop','Google Shopping','gshop',[['ur_gshop','Google Shopping']]],
  ['gpt','ChatGPT Ads','bot',[['ur_gpt','ChatGPT Ads']]],
  ['tiktok','TikTok','tiktok',[['ur_tiktok','TikTok']]],
  ['pin','Pinterest','pin',[['ur_pin','Pinterest']]],
  ['wa','WhatsApp','wa',[['ur_wa','WhatsApp']]],
  ['mktp','Marketplaces','globe',[['ur_mktp','Marketplaces']]]]},
 {t:'Aplicaciones',items:[
  ['apps','Aplicaciones','apps',[['ur_apps','Aplicaciones instaladas']]],
  ['ruleta','Ruleta y Gamificación','dice',[['ur_ruleta','Ruleta y Gamificación']]],
  ['andreani','Andreani','parcel',[['ur_andreani','Andreani']]],
  ['correo','Correo Argentino','parcel',[['ur_correo','Correo Argentino']]]]},
 {t:'',items:[['config','Configuración','gear',[['config','General'],['roles','Usuarios y permisos'],['personal','Personal y fichaje'],['tareas','Tareas y organigrama'],['nube','Nube'],['auditoria','Auditoría']]]]}];
const urOk=id=>{const s=SCREENS[id];return!!s&&(!s.perm||can(s.perm))&&(!s.show||s.show());};
const urItems=()=>UR_SECS.map(sec=>({t:sec.t,items:sec.items.map(([key,t,icon,tabs,bd,tag])=>({key,t,icon,tabs:tabs.filter(x=>urOk(x[0])),bd,tag})).filter(i=>i.tabs.length)})).filter(s=>s.items.length);
const urItemOf=id=>{for(const s of UR_SECS)for(const it of s.items)if(it[3].some(x=>x[0]===id))return it[0];return'';};
const urBadge={badgeVentas:()=>{try{return NL().orders.filter(o=>['nuevo','pagado','picking','packing'].includes(o.state)).length;}catch(e){return 0;}},
 badgeChat:()=>UR().chat.reduce((a,c)=>a+(c.unread||0),0)};
function urSideHTML(id){const cur=urItemOf(id);
 let h=`<div class="brand"><img src="${LOGO_MENU}" alt="Urban" style="width:64px;height:25px;object-fit:contain;border-radius:0;background:#F4EFE7"><span>Sistema Urban</span></div>`;
 urItems().forEach(sec=>{if(sec.t)h+=`<div class="sec">${esc(sec.t)}</div>`;
  sec.items.forEach(it=>{const n=it.bd?urBadge[it.bd]():0;
   h+=`<a data-act="nav" data-id="${it.tabs[0][0]}" class="${it.key===cur?'on':''}" tabindex="0" role="link">${ico(it.icon)}<span>${esc(it.t)}</span>${n?`<em class="ur-b">${n}</em>`:''}${it.tag?`<em class="ur-n">${esc(it.tag)}</em>`:''}</a>`;});});
 h+=`<div class="sec">Desarrollado por</div><div class="sm" style="padding:0 .7rem;color:#a99f8f"><b style="color:#eee">${VB.name}</b><br><i>“${VB.lema}”</i><br><a style="color:#0a0a0a" href="${vbWa()}" target="_blank" rel="noopener noreferrer">Único celular ${VB.phone}</a><br><a style="color:#0a0a0a" href="mailto:${VB.mail}">${VB.mail}</a></div>`;
 return h;}
function urAfter(id){const key=urItemOf(id);if(!key)return;let it=null;urItems().forEach(s=>s.items.forEach(i=>{if(i.key===key)it=i;}));if(!it)return;
 let h='';if(it.tabs.length>1)h+=`<div class="rtabs ur-tabs">${it.tabs.map(([k,l])=>`<button class="rtab ${k===id?'on':''}" data-act="urGo" data-id="${k}">${esc(l)}</button>`).join('')}</div>`;
 if(key==='tienda')h+=`<div class="row ur-bar"><span class="sp sm mut">Tu tienda pública (catálogo con ficha de talle y carrito):</span><a class="btn sm" href="#menu" target="_blank" rel="noopener">Ver tienda</a><button class="btn sm" data-act="urCopyLink">Copiar link</button></div>`;
 if(h)$('#view').insertAdjacentHTML('afterbegin',h);}
A.urGo=el=>go(el.dataset.id);
A.urCopyLink=()=>{const u=urPub();try{navigator.clipboard.writeText(u);toast('Link copiado');}catch(e){toast('Copialo a mano: '+u);}};
document.addEventListener('change',e=>{const el=e.target.closest&&e.target.closest('[data-chg]');if(!el)return;const f=A[el.dataset.chg];if(f)f(el);});

/* ---------------- ventas, estadísticas ---------------- */
const urNormCh=c=>({instagram:'ig',facebook:'ig',whatsapp:'wa'}[c]||c||'web');
function urChanOf(s){if(s.channel!=='online')return'pos';const o=s.nlOrder?NL().orders.find(x=>x.id===s.nlOrder):null;return urNormCh(o?o.channel:'web');}
const UR_CH={pos:'Punto de venta',web:'Tienda online',ig:'Instagram',wa:'WhatsApp'};
const UR_MET={efectivo:'Efectivo',debito:'Débito',credito:'Crédito',transferencia:'Transferencia',qr:'QR / Mercado Pago',fiado:'Cuenta corriente'};
reg('ur_ventas','Todas las ventas','cart','sell',()=>{const V=URUI.v;const since=dkey(now()-(V.days-1)*URMS);const q=asFold(V.q||'');
 const L=S.sales.filter(s=>dkey(s.ts)>=since&&(V.st==='all'||(V.st==='ok'?s.status==='ok':s.status!=='ok'))&&(V.ch==='all'||urChanOf(s)===V.ch)&&(!q||asFold((s.n||'')+' '+(s.custName||'')+' '+s.items.map(i=>i.name).join(' ')).includes(q))).sort((a,b)=>b.ts-a.ts);
 const ok=L.filter(s=>s.status==='ok');const tot=ok.reduce((a,s)=>a+s.total,0);const un=ok.reduce((a,s)=>a+s.items.reduce((b,i)=>b+i.qty,0),0);
 return urHead('Ventas')+`<div class="card"><div class="row ur-f" style="flex-wrap:wrap;gap:.5rem"><input id="uv-q" value="${esc(V.q)}" placeholder="Buscar por N.º, clienta o prenda" style="max-width:280px" data-chg="urVf" data-k="q">
  <select data-chg="urVf" data-k="days" aria-label="Período">${urOpts([['7','Últimos 7 días'],['30','Últimos 30 días'],['90','Últimos 90 días']],String(V.days))}</select>
  <select data-chg="urVf" data-k="ch" aria-label="Canal">${urOpts([['all','Todos los canales'],...Object.entries(UR_CH)],V.ch)}</select>
  <select data-chg="urVf" data-k="st" aria-label="Estado">${urOpts([['ok','Concretadas'],['x','Anuladas / pendientes'],['all','Todas']],V.st)}</select><span class="sp"></span><button class="btn sm" data-act="urVexp">Exportar CSV</button></div></div>
  ${urGrid(urKpi('Ventas concretadas',ok.length)+urKpi('Facturado',money(tot))+urKpi('Ticket promedio',money(ok.length?Math.round(tot/ok.length):0))+urKpi('Prendas vendidas',un))}
  <div class="card"><div class="tw"><table><thead><tr><th>N.º</th><th>Fecha</th><th>Canal</th><th>Clienta</th><th class="r">Prendas</th><th>Medio</th><th class="r">Total</th><th>Estado</th></tr></thead><tbody>${L.slice(0,150).map(s=>`<tr><td>${esc(s.n)}</td><td class="sm">${fmtDT(s.ts)}</td><td>${esc(UR_CH[urChanOf(s)]||urChanOf(s))}</td><td>${esc(s.custName||'—')}</td><td class="r">${s.items.reduce((a,i)=>a+i.qty,0)}</td><td>${esc(UR_MET[s.method]||s.method||'—')}</td><td class="r">${money(s.total)}</td><td><span class="tag ${s.status==='ok'?'ok':'warn'}">${s.status==='ok'?'Concretada':esc(s.status)}</span></td></tr>`).join('')||'<tr><td colspan="8" class="mut">Sin ventas con esos filtros.</td></tr>'}</tbody></table></div>${L.length>150?`<p class="sm mut">Se muestran 150 de ${L.length}. Exportá el CSV para ver todas.</p>`:''}</div>`;});
A.urVf=el=>{URUI.v[el.dataset.k]=el.dataset.k==='days'?+el.value:el.value;rerender();};
A.urVexp=()=>{const V=URUI.v;const since=dkey(now()-(V.days-1)*URMS);urCsv('ventas-urban-'+dkey(now())+'.csv',['N.º','Fecha','Canal','Clienta','Prendas','Medio','Total','Estado'],S.sales.filter(s=>dkey(s.ts)>=since).map(s=>[s.n,fmtDT(s.ts),UR_CH[urChanOf(s)]||urChanOf(s),s.custName||'',s.items.reduce((a,i)=>a+i.qty,0),UR_MET[s.method]||s.method||'',(s.total/100).toFixed(2).replace('.',','),s.status]));};

reg('ur_stats','Ventas por canal','chart','view_cost',()=>{const d=URUI.st.days;const since=dkey(now()-(d-1)*URMS);const L=S.sales.filter(s=>s.status==='ok'&&dkey(s.ts)>=since);
 const by={pos:[0,0],web:[0,0],ig:[0,0],wa:[0,0]};L.forEach(s=>{const k=urChanOf(s);if(!by[k])by[k]=[0,0];by[k][0]++;by[k][1]+=s.total;});
 const tot=L.reduce((a,s)=>a+s.total,0)||1;const mx=Math.max(1,...Object.values(by).map(x=>x[1]));
 const met={};L.forEach(s=>(s.pays||[{m:s.method,a:s.total}]).forEach(p=>{met[p.m]=(met[p.m]||0)+p.a;}));
 const prod={};L.forEach(s=>s.items.forEach(i=>{const p=prod[i.name]||(prod[i.name]=[0,0]);p[0]+=i.qty;p[1]+=i.qty*i.price;}));
 const top=Object.entries(prod).sort((a,b)=>b[1][1]-a[1][1]).slice(0,6);
 const FM=nlFamMap();const gg={m:[0,0],h:[0,0],u:[0,0]};L.forEach(s=>s.items.forEach(i=>{const p=S.products.find(x=>x.id===i.pid);const g=(p&&FM[p.fam]||{}).g||'m';gg[g][0]+=i.qty;gg[g][1]+=i.qty*i.price;}));
 return urHead('Estadísticas por canal')+`<div class="rtabs" style="margin:.4rem 0">${[7,30,90].map(x=>`<button class="rtab ${x===d?'on':''}" data-act="urStDays" data-d="${x}">${x} días</button>`).join('')}</div>
  ${urGrid(urKpi('Facturado',money(L.reduce((a,s)=>a+s.total,0)))+urKpi('Ventas',L.length)+urKpi('Ticket promedio',money(L.length?Math.round(tot/L.length):0))+urKpi('Peso del canal online',Math.round((by.web[1]+by.ig[1]+by.wa[1])/tot*100)+' %'))}
  <div class="grid g3" style="align-items:start"><div class="card"><h3>Facturado por canal</h3>${Object.entries(by).map(([k,v])=>`<div style="margin:.5rem 0"><div class="row sm"><span class="sp">${esc(UR_CH[k])}</span><b>${money(v[1])}</b><span class="mut">${v[0]} ventas</span></div><div style="height:8px;background:var(--line);border-radius:4px"><div style="height:8px;width:${Math.round(v[1]/mx*100)}%;background:#0a0a0a;border-radius:4px"></div></div></div>`).join('')}</div>
  <div class="card"><h3>Medios de pago</h3>${Object.entries(met).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row sm" style="margin:.35rem 0"><span class="sp">${esc(UR_MET[k]||k)}</span><b>${money(v)}</b><span class="mut">${Math.round(v/tot*100)} %</span></div>`).join('')||'<p class="sm mut">Sin datos.</p>'}</div>
  <div class="card"><h3>Ventas por sección</h3>${[['m','Mujer'],['h','Hombre'],['u','Unisex']].map(([k,l])=>`<div class="row sm" style="margin:.35rem 0"><span class="sp">${l}</span><b>${money(gg[k][1])}</b><span class="mut">${gg[k][0]} u.</span></div>`).join('')}</div><div class="card"><h3>Prendas más vendidas</h3>${top.map(([n,v])=>`<div class="row sm" style="margin:.35rem 0"><span class="sp">${esc(n)}</span><b>${v[0]} u.</b><span class="mut">${money(v[1])}</span></div>`).join('')||'<p class="sm mut">Sin datos.</p>'}</div></div>`;});
A.urStDays=el=>{URUI.st.days=+el.dataset.d;rerender();};

/* ---------------- Pago Nube ---------------- */
reg('ur_pagos','Cobros y medios de pago','card','close_cash',()=>{const T=UR();const P=T.pay;const since=dkey(now()-29*URMS);const mm=Object.fromEntries(P.m.map(x=>[x.id,x]));
 const L=S.sales.filter(s=>s.status==='ok'&&dkey(s.ts)>=since);const rows={};const next={};let bruto=0,fee=0,pend=0;
 L.forEach(s=>(s.pays&&s.pays.length?s.pays:[{m:s.method,a:s.total}]).forEach(p=>{const c=mm[p.m]||{n:p.m,fee:0,days:0};if(p.m==='efectivo'||p.m==='fiado')return;
  const f=Math.round(p.a*(c.fee||0)/100);const r=rows[p.m]||(rows[p.m]={n:c.n,c:0,g:0,f:0});r.c++;r.g+=p.a;r.f+=f;bruto+=p.a;fee+=f;
  const when=s.ts+(c.days||0)*URMS;if(when>now()){pend+=p.a-f;const k=dkey(when);next[k]=(next[k]||0)+p.a-f;}}));
 const efe=L.reduce((a,s)=>a+(s.pays&&s.pays.length?s.pays:[{m:s.method,a:s.total}]).filter(p=>p.m==='efectivo').reduce((b,p)=>b+p.a,0),0);
 return urHead('Pago Nube · cobros','COMISIONES Y PLAZOS DE EJEMPLO')+urGrid(urKpi('Cobrado digital (30 días)',money(bruto))+urKpi('Comisiones estimadas',money(fee))+urKpi('Neto',money(bruto-fee))+urKpi('Por acreditar',money(pend))+urKpi('Cobrado en efectivo',money(efe)),215)+
 `<div class="grid g3" style="align-items:start"><div class="card" style="grid-column:span 2"><h3>Liquidación por medio de pago</h3><div class="tw"><table><thead><tr><th>Medio</th><th class="r">Cobros</th><th class="r">Bruto</th><th class="r">Comisión</th><th class="r">Neto</th></tr></thead><tbody>${Object.values(rows).map(r=>`<tr><td>${esc(r.n)}</td><td class="r">${r.c}</td><td class="r">${money(r.g)}</td><td class="r ${r.f?'neg':'mut'}">${r.f?'−'+money(r.f):'—'}</td><td class="r"><b>${money(r.g-r.f)}</b></td></tr>`).join('')||'<tr><td colspan="5" class="mut">Sin cobros digitales.</td></tr>'}</tbody></table></div>
  <h4>Próximas acreditaciones</h4>${Object.entries(next).sort().slice(0,8).map(([k,v])=>`<div class="row sm" style="margin:.25rem 0"><span class="sp">${esc(dmy(k))}</span><b>${money(v)}</b></div>`).join('')||'<p class="sm mut">No hay acreditaciones pendientes.</p>'}</div>
 <div class="card"><h3>Medios de pago</h3>${P.m.map(x=>`<div style="margin:.55rem 0;padding-bottom:.5rem;border-bottom:1px solid var(--line)"><label class="row" style="gap:.5rem"><input type="checkbox" class="ur-chk" ${x.on?'checked':''} data-chg="urPayOn" data-id="${x.id}"><b class="sp">${esc(x.n)}</b></label>
  <div class="row sm" style="gap:.4rem;margin-top:.3rem"><span>Comisión %</span><input value="${x.fee}" inputmode="decimal" style="width:70px" data-chg="urPayFee" data-id="${x.id}" aria-label="Comisión ${esc(x.n)}"><span>Acredita en</span><input value="${x.days}" inputmode="numeric" style="width:60px" data-chg="urPayDays" data-id="${x.id}" aria-label="Días ${esc(x.n)}"><span>días</span></div></div>`).join('')}
  <label class="row" style="gap:.5rem;margin-top:.6rem"><input type="checkbox" class="ur-chk" ${P.cuotas.on?'checked':''} data-chg="urCuotas" data-k="on"><b class="sp">Cuotas con tarjeta de crédito</b></label>
  <div class="row sm" style="gap:.4rem;margin-top:.3rem"><span>Hasta</span><input value="${P.cuotas.max}" inputmode="numeric" style="width:60px" data-chg="urCuotas" data-k="max"><span>cuotas · sin interés hasta</span><input value="${P.cuotas.si}" inputmode="numeric" style="width:60px" data-chg="urCuotas" data-k="si"></div>
  <p class="sm mut">Parámetros de ejemplo para estimar la liquidación. No hay conexión con un procesador de pagos real.</p></div></div>`;});
A.urPayOn=el=>{UR().pay.m.find(x=>x.id===el.dataset.id).on=el.checked;save();rerender();};
A.urPayFee=el=>{UR().pay.m.find(x=>x.id===el.dataset.id).fee=Math.max(0,Math.min(30,urNum(el.value,0)));save();rerender();};
A.urPayDays=el=>{UR().pay.m.find(x=>x.id===el.dataset.id).days=Math.max(0,Math.min(60,Math.round(urNum(el.value,0))));save();rerender();};
A.urCuotas=el=>{const c=UR().pay.cuotas;if(el.dataset.k==='on')c.on=el.checked;else c[el.dataset.k]=Math.max(1,Math.min(24,Math.round(urNum(el.value,1))));if(c.si>c.max)c.si=c.max;save();rerender();};

/* ---------------- Envío Nube ---------------- */
function urZone(cp){const d=String(cp||'').replace(/\D/g,'').slice(0,4);let best=null,bl=-1;UR().env.z.forEach(z=>String(z.cp).split(',').forEach(p=>{p=p.trim();if(p&&d.startsWith(p)&&p.length>bl){best=z;bl=p.length;}}));return best;}
const UR_CAR={andreani:{n:'Andreani',mult:1,dd:0,pre:'AND'},correo:{n:'Correo Argentino',mult:.85,dd:1,pre:'CA'}};
function urQuote(car,cp,kg,decl,svc){const z=urZone(cp);if(!z)return{err:'No encontramos ese código postal. Probá con 4 dígitos (ej. 4400).'};const c=UR_CAR[car];
 const kgs=Math.max(1,Math.ceil(kg||1));let p=z.price*c.mult*(1+(kgs-1)*0.18);if(svc==='suc')p*=0.8;p+=Math.round((decl||0)*0.01);p=Math.round(p/100)*100;
 const [a,b]=String(z.days).split('-').map(Number);return{z,price:p,days:(a+c.dd)+'-'+((b||a)+c.dd)};}
const urShipOrders=()=>NL().orders.filter(o=>o.ship&&o.ship.type!=='retiro');
reg('ur_envios','Envíos y tarifas','truck','sell',()=>{const T=UR();const E=T.env;const O=urShipOrders();const st=s=>O.filter(o=>s.includes(o.state));
 const cot=URUI.cot;
 return urHead('Envío Nube','TRANSPORTISTAS Y TARIFAS DE EJEMPLO')+urGrid(urKpi('Por despachar',st(['pagado','picking','packing']).length,'pagados, a preparar')+urKpi('Esperando pago',st(['nuevo']).length)+urKpi('En camino',st(['despachado']).length)+urKpi('Entregados',st(['entregado']).length)+urKpi('Costo de envíos',money(O.filter(o=>!['cancelado','devuelto'].includes(o.state)).reduce((a,o)=>a+(o.ship.cost||0),0))))+
 `<div class="card"><h3>Envíos de los pedidos online</h3><div class="tw"><table><thead><tr><th>Pedido</th><th>Clienta</th><th>Destino</th><th>Transportista</th><th>Guía</th><th>Estado</th><th class="r">Envío</th><th></th></tr></thead><tbody>${O.slice().reverse().map(o=>{const c=o.cust?custById(o.cust):null;return`<tr><td>${esc(o.n)}</td><td>${esc(c?custFull(c):o.name)}</td><td class="sm">${esc(o.ship.addr||'—')}</td><td class="sm">${esc(o.ship.carrier||'—')}</td><td class="sm">${esc(o.ship.track||'—')}</td><td>${nlStTag(o.state)}</td><td class="r">${o.ship.cost?money(o.ship.cost):'Gratis'}</td><td><button class="btn sm" data-act="nlOrdOpen" data-id="${o.id}">Abrir</button></td></tr>`;}).join('')||'<tr><td colspan="8" class="mut">Todavía no hay pedidos con envío a domicilio.</td></tr>'}</tbody></table></div></div>
 <div class="grid g3" style="align-items:start"><div class="card" style="grid-column:span 2"><h3>Zonas y tarifas</h3><div class="tw"><table><thead><tr><th>Zona</th><th>Empieza con (CP)</th><th>Plazo (días)</th><th class="r">Tarifa base $</th></tr></thead><tbody>${E.z.map(z=>`<tr><td>${esc(z.n)}</td><td class="sm">${esc(z.cp)}</td><td class="sm">${esc(z.days)}</td><td class="r"><input value="${Math.round(z.price/100)}" inputmode="numeric" style="width:90px;text-align:right" data-chg="urZonePrice" data-id="${z.id}" aria-label="Tarifa ${esc(z.n)}"></td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="gap:.6rem;margin-top:.6rem;flex-wrap:wrap"><label class="row" style="gap:.4rem"><span>Envío gratis desde $</span><input value="${Math.round(E.free/100)}" inputmode="numeric" style="width:110px" data-chg="urFree"></label><label class="row" style="gap:.4rem"><input type="checkbox" class="ur-chk" ${E.retiro?'checked':''} data-chg="urRetiro"><span>Ofrecer retiro en el local</span></label></div></div>
 <div class="card"><h3>Cotizador</h3><label for="uc-cp">Código postal</label><input id="uc-cp" value="${esc(cot.cp)}" inputmode="numeric" maxlength="8" data-chg="urCot" data-k="cp"><label for="uc-kg">Peso (kg)</label><input id="uc-kg" value="${esc(cot.kg)}" inputmode="decimal" data-chg="urCot" data-k="kg">
  <label for="uc-sv">Servicio</label><select id="uc-sv" data-chg="urCot" data-k="svc">${urOpts([['dom','A domicilio'],['suc','A sucursal']],cot.svc)}</select>
  <div style="margin-top:.6rem">${Object.keys(UR_CAR).map(k=>{const q=urQuote(k,cot.cp,urNum(cot.kg,1),0,cot.svc);return q.err?`<p class="sm neg">${esc(q.err)}</p>`:`<div class="row sm" style="margin:.3rem 0"><span class="sp"><b>${UR_CAR[k].n}</b><br><span class="mut">${esc(q.z.n)} · ${q.days} días</span></span><b>${money(q.price)}</b></div>`;}).join('')}</div></div></div>`;});
A.urZonePrice=el=>{UR().env.z.find(z=>z.id===el.dataset.id).price=Math.max(0,Math.round(urNum(el.value,0)*100));save();rerender();};
A.urFree=el=>{UR().env.free=Math.max(0,Math.round(urNum(el.value,0)*100));save();rerender();};
A.urRetiro=el=>{UR().env.retiro=el.checked;save();toast(el.checked?'Retiro en local activado':'Retiro en local desactivado');};
A.urCot=el=>{URUI.cot[el.dataset.k]=el.value;rerender();};

/* ---------------- Andreani / Correo Argentino ---------------- */
function urCarrierScreen(key){const C=UR_CAR[key];const id='ur_'+key;
 reg(id,C.n,'parcel','sell',()=>{const T=UR();const cf=T.car[key];const tab=URUI.car[key];const cot=URUI.cot;const T3=[['cot','Cotizador'],['env','Envíos y etiquetas'],['cfg','Cuenta y servicios']];
  let body='';
  if(tab==='cot'){const q=urQuote(key,cot.cp,urNum(cot.kg,1),urNum(cot.decl,0)*100,cot.svc);
   body=`<div class="grid g3" style="align-items:start"><div class="card"><h3>Cotizar un envío</h3><label for="uc-cp">Código postal de destino</label><input id="uc-cp" value="${esc(cot.cp)}" inputmode="numeric" maxlength="8" data-chg="urCot" data-k="cp"><label for="uc-kg">Peso (kg)</label><input id="uc-kg" value="${esc(cot.kg)}" inputmode="decimal" data-chg="urCot" data-k="kg">
    <label for="uc-dc">Valor declarado $ (seguro 1 %)</label><input id="uc-dc" value="${esc(cot.decl)}" inputmode="numeric" placeholder="0" data-chg="urCot" data-k="decl"><label for="uc-sv">Servicio</label><select id="uc-sv" data-chg="urCot" data-k="svc">${urOpts([['dom','A domicilio'],['suc','A sucursal']],cot.svc)}</select></div>
    <div class="card"><h3>Resultado</h3>${q.err?`<p class="neg">${esc(q.err)}</p>`:`<div class="kpi"><b>${money(q.price)}</b><span>${esc(q.z.n)} · entrega en ${q.days} días hábiles</span></div><p class="sm mut">Tarifa de ejemplo calculada con las zonas de Envío Nube${key==='correo'?' (Correo Argentino: 15 % más económico y 1 día más)':''}.</p>`}</div></div>`;}
  else if(tab==='env'){const O=urShipOrders().filter(o=>!['cancelado','devuelto','entregado'].includes(o.state)&&['nuevo','pagado','picking','packing','despachado'].includes(o.state));
   body=`<div class="card"><h3>Pedidos con envío</h3><div class="tw"><table><thead><tr><th>Pedido</th><th>Destino</th><th>Estado</th><th>Guía</th><th></th></tr></thead><tbody>${O.map(o=>{const mine=(o.ship.carrier||'').indexOf(C.n)>-1&&o.ship.track;const can1=['pagado','picking','packing'].includes(o.state);
     return`<tr><td>${esc(o.n)}</td><td class="sm">${esc(o.ship.addr||'—')}</td><td>${nlStTag(o.state)}</td><td class="sm">${esc(o.ship.track||'—')}</td><td style="white-space:nowrap">${can1&&!mine?`<button class="btn sm gold" data-act="urLabel" data-id="${o.id}" data-k="${key}">Generar etiqueta</button>`:''}${mine?`<button class="btn sm" data-act="urLabelPrint" data-id="${o.id}">Imprimir</button>`:''}${mine&&o.state!=='despachado'&&can1?`<button class="btn sm gold" data-act="urDispatch" data-id="${o.id}">Despachar</button>`:''}<button class="btn sm" data-act="nlOrdOpen" data-id="${o.id}">Abrir</button></td></tr>`;}).join('')||'<tr><td colspan="5" class="mut">No hay envíos para preparar.</td></tr>'}</tbody></table></div><p class="sm mut">La etiqueta y la guía son simuladas: sirven para recorrer el circuito completo del pedido.</p></div>`;}
  else body=`<div class="card" style="max-width:560px"><div class="row"><h3 class="sp">Cuenta de ${esc(C.n)}</h3><span class="tag ${cf.on?'ok':''}">${cf.on?'Conectada (simulado)':'Sin conectar'}</span></div><label for="ucf-c">Número de cliente / contrato</label><input id="ucf-c" value="${esc(cf.cuenta)}" data-chg="urCarAcc" data-k="${key}">
   <label class="row" style="gap:.5rem;margin-top:.6rem"><input type="checkbox" class="ur-chk" ${cf.dom?'checked':''} data-chg="urCarSvc" data-k="${key}" data-s="dom"><span>Envío a domicilio</span></label><label class="row" style="gap:.5rem"><input type="checkbox" class="ur-chk" ${cf.suc?'checked':''} data-chg="urCarSvc" data-k="${key}" data-s="suc"><span>Envío a sucursal</span></label>
   <p class="sm">Remitente: <b>${esc(S.tenant.name)}</b> · ${esc(S.tenant.address)}</p><button class="btn ${cf.on?'':'gold'}" data-act="urCarToggle" data-k="${key}">${cf.on?'Desconectar':'Conectar cuenta (simulado)'}</button></div>`;
  return urHead(C.n,'SIN CONEXIÓN REAL CON EL TRANSPORTISTA')+`<div class="rtabs" style="margin:.4rem 0">${T3.map(([k,l])=>`<button class="rtab ${tab===k?'on':''}" data-act="urCarTab" data-k="${key}" data-t="${k}">${l}</button>`).join('')}</div>`+body;});}
urCarrierScreen('andreani');urCarrierScreen('correo');
A.urCarTab=el=>{URUI.car[el.dataset.k]=el.dataset.t;rerender();};
A.urCarAcc=el=>{UR().car[el.dataset.k].cuenta=el.value.trim().slice(0,30);save();toast('Guardado');};
A.urCarSvc=el=>{UR().car[el.dataset.k][el.dataset.s]=el.checked;save();};
A.urCarToggle=el=>{const c=UR().car[el.dataset.k];c.on=!c.on;audit('TRANSPORTISTA',UR_CAR[el.dataset.k].n+(c.on?' conectado (simulado)':' desconectado'));save();rerender();};
A.urLabel=el=>{const o=NL().orders.find(x=>x.id===el.dataset.id);if(!o)return;const C=UR_CAR[el.dataset.k];if(!UR().car[el.dataset.k].on)return toast('Conectá la cuenta del transportista primero',1);
 o.ship.carrier=C.n;o.ship.track=C.pre+String(Math.floor(Math.random()*1e10)).padStart(10,'0')+' (ejemplo)';nlOrderLog(o,'Etiqueta '+C.n+' generada (simulado) · guía '+o.ship.track);save();toast('Etiqueta generada');rerender();A.urLabelPrint(el);};
A.urLabelPrint=el=>{const o=NL().orders.find(x=>x.id===el.dataset.id);if(!o)return;const w=window.open('','_blank');if(!w)return toast('El navegador bloqueó la ventana de impresión',1);
 w.document.write(`<html><head><title>Etiqueta ${esc(o.n)}</title><style>body{font:14px sans-serif;padding:20px}.b{border:2px solid #000;padding:14px;max-width:380px}h2{margin:.2em 0}.g{font:700 20px monospace;margin:.6em 0}</style></head><body><div class="b"><b>${esc(o.ship.carrier||'')}</b> · ENVÍO DE EJEMPLO<h2>${esc(o.ship.addr||'Retira en local')}</h2><p>Destinataria: ${esc(o.cust?custFull(custById(o.cust)):o.name)}<br>Pedido ${esc(o.n)} · ${o.lines.reduce((a,l)=>a+l.qty,0)} prenda(s)</p><div class="g">${esc(o.ship.track||'')}</div><p>Remitente: ${esc(S.tenant.name)} · ${esc(S.tenant.address)}</p></div><script>window.print()<\/script></body></html>`);w.document.close();};
A.urDispatch=el=>nlOrdAct(el,o=>{o.state='despachado';nlOrderLog(o,'Despachado · guía '+o.ship.track);});

/* ---------------- Ruleta y Gamificación ---------------- */
const UR_WCOL=['#111111','#f1efe9','#5a5a5a','#dcd8cf','#8a8a8a'];
function urWheel(P,rot,ms){const n=P.length,s=360/n;const pt=(a,r)=>[100+r*Math.sin(a*Math.PI/180),100-r*Math.cos(a*Math.PI/180)];
 const sl=P.map((p,i)=>{const [x1,y1]=pt(i*s,96),[x2,y2]=pt((i+1)*s,96);const dk=['#111111','#5a5a5a','#8a8a8a'].includes(UR_WCOL[i%5]);const c=(i+.5)*s;
  return`<path d="M100,100 L${x1.toFixed(2)},${y1.toFixed(2)} A96,96 0 ${s>180?1:0} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${UR_WCOL[i%5]}" stroke="#fff" stroke-width="1"/><text x="100" y="30" transform="rotate(${c} 100 100)" text-anchor="middle" font-size="7.5" fill="${dk?'#fff':'#111'}" font-family="Jost,sans-serif">${esc(p.t.length>17?p.t.slice(0,16)+'…':p.t)}</text>`;}).join('');
 return`<div style="position:relative;width:min(100%,320px);margin:0 auto"><div style="position:absolute;left:50%;top:-4px;transform:translateX(-50%);z-index:2;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:18px solid #b5173f"></div><svg id="ur-wheel" viewBox="0 0 200 200" style="width:100%;transform:rotate(${rot}deg);transition:transform ${ms}ms cubic-bezier(.12,.7,.15,1);border-radius:50%;box-shadow:0 0 0 4px #111" role="img" aria-label="Ruleta de premios">${sl}<circle cx="100" cy="100" r="9" fill="#fff" stroke="#111" stroke-width="2"/></svg></div>`;}
reg('ur_ruleta','Ruleta y Gamificación','dice','customers',()=>{const R=UR().rul;const tw=R.prizes.reduce((a,p)=>a+(+p.w||0),0)||1;
 return urHead('Ruleta y Gamificación','SE PRUEBA DESDE EL PANEL')+`<div class="row" style="margin:.3rem 0"><span class="tag mut">Marketing</span><span class="sp sm mut">Cada premio con descuento genera un cupón de un solo uso (vence a los 7 días) que aparece en Descuentos → Cupones.</span><label class="row" style="gap:.4rem"><input type="checkbox" class="ur-chk" ${R.on?'checked':''} data-chg="urRulOn"><b>Ruleta activa</b></label></div>
 <div class="grid g3" style="align-items:start"><div class="card" style="text-align:center">${urWheel(R.prizes,0,0)}<button class="btn gold" style="margin-top:1rem" data-act="urSpin" id="ur-spin">Girar la ruleta</button><p class="sm mut">Probá cómo la vive la clienta.</p></div>
 <div class="card" style="grid-column:span 2"><h3>Premios y probabilidades</h3><div class="tw"><table><thead><tr><th>Premio</th><th>Tipo</th><th class="r">Valor</th><th class="r">Peso</th><th class="r">Chance</th><th></th></tr></thead><tbody>${R.prizes.map(p=>`<tr><td><input value="${esc(p.t)}" style="min-width:140px" data-chg="urPz" data-id="${p.id}" data-k="t" aria-label="Premio"></td><td><select data-chg="urPz" data-id="${p.id}" data-k="type" aria-label="Tipo">${urOpts([['pct','% descuento'],['fixed','$ descuento'],['none','Sin premio']],p.type)}</select></td>
  <td class="r"><input value="${p.type==='fixed'?Math.round(p.v/100):p.v}" inputmode="numeric" style="width:80px;text-align:right" ${p.type==='none'?'disabled':''} data-chg="urPz" data-id="${p.id}" data-k="v" aria-label="Valor"></td><td class="r"><input value="${p.w}" inputmode="numeric" style="width:60px;text-align:right" data-chg="urPz" data-id="${p.id}" data-k="w" aria-label="Peso"></td><td class="r">${Math.round((+p.w||0)/tw*100)} %</td><td><button class="btn sm red" data-act="urPzDel" data-id="${p.id}" aria-label="Quitar premio">✕</button></td></tr>`).join('')}</tbody></table></div>
  <div class="row" style="margin-top:.5rem"><button class="btn sm" data-act="urPzAdd">+ Agregar premio</button></div></div></div>
 <div class="card"><h3>Giros registrados</h3><div class="tw"><table><thead><tr><th>Fecha</th><th>Premio</th><th>Cupón</th></tr></thead><tbody>${R.log.slice().reverse().slice(0,30).map(l=>`<tr><td class="sm">${fmtDT(l.ts)}</td><td>${esc(l.prize)}</td><td>${l.code?`<code>${esc(l.code)}</code>`:'—'}</td></tr>`).join('')||'<tr><td colspan="3" class="mut">Todavía no hubo giros.</td></tr>'}</tbody></table></div></div>`;});
A.urRulOn=el=>{UR().rul.on=el.checked;save();toast(el.checked?'Ruleta activada':'Ruleta desactivada');};
A.urPz=el=>{const p=UR().rul.prizes.find(x=>x.id===el.dataset.id);const k=el.dataset.k;if(k==='t')p.t=el.value.trim().slice(0,40)||'Premio';else if(k==='type'){p.type=el.value;if(p.type==='none')p.v=0;else if(!p.v)p.v=p.type==='fixed'?500000:10;}else if(k==='w')p.w=Math.max(0,Math.round(urNum(el.value,0)));else p.v=p.type==='fixed'?Math.max(0,Math.round(urNum(el.value,0)*100)):Math.max(0,Math.min(100,urNum(el.value,0)));save();rerender();};
A.urPzAdd=()=>{const R=UR().rul;if(R.prizes.length>=10)return toast('Máximo 10 premios',1);R.prizes.push({id:uid(),t:'Nuevo premio',type:'pct',v:10,w:10});save();rerender();};
A.urPzDel=el=>{const R=UR().rul;if(R.prizes.length<=2)return toast('Dejá al menos 2 premios',1);R.prizes=R.prizes.filter(x=>x.id!==el.dataset.id);save();rerender();};
A.urSpin=()=>{const R=UR().rul;if(!R.on)return toast('La ruleta está desactivada',1);if(URUI.spinning)return;const P=R.prizes;const tw=P.reduce((a,p)=>a+(+p.w||0),0);if(tw<=0)return toast('Poné un peso mayor a 0 en algún premio',1);
 let r=Math.random()*tw,i=0;for(;i<P.length-1;i++){r-=(+P[i].w||0);if(r<0)break;}
 const s=360/P.length,c=(i+.5)*s,jit=(Math.random()-.5)*s*.6,red=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,ms=red?0:4200;
 const svg=$('#ur-wheel');URUI.spinning=true;$('#ur-spin').disabled=true;svg.style.transform='rotate('+(360*6-c+jit)+'deg)';
 setTimeout(()=>{URUI.spinning=false;const p=P[i];let code='';
  if(p.type==='pct'||p.type==='fixed'){code='RULETA'+Math.random().toString(36).slice(2,6).toUpperCase();S.coupons.push({id:uid(),code,type:p.type,value:p.v,min:0,from:'',to:dkey(now()+7*URMS),maxUses:1,perCust:1,aud:'todos',active:true,note:'Premio de la ruleta (ejemplo): '+p.t,uses:[]});audit('RULETA_PREMIO',code+' · '+p.t);}
  R.log.push({ts:now(),prize:p.t,code});save();
  modal(code?'¡Ganaste!':'Casi…',`<div style="text-align:center"><h2 style="margin:.2em 0">${esc(p.t)}</h2>${code?`<p>Tu cupón de un solo uso (vence a los 7 días):</p><p style="font:700 1.6rem monospace;letter-spacing:.1em">${esc(code)}</p><p class="sm mut">Ya figura en Descuentos → Cupones.</p>`:'<p>Esta vez no hubo premio. ¡Probá de nuevo en tu próxima compra!</p>'}</div>`,{okText:'Cerrar',onOk:()=>true});rerender();},ms+80);};

/* ---------------- Aplicaciones ---------------- */
reg('ur_apps','Aplicaciones instaladas','apps','customers',()=>{const T=UR();
 const L=[['Ruleta y Gamificación','Marketing','dice','ur_ruleta',T.rul.on],['Andreani','Logística','parcel','ur_andreani',T.car.andreani.on],['Correo Argentino','Logística','parcel','ur_correo',T.car.correo.on]];
 return urHead('Aplicaciones','CATÁLOGO DE EJEMPLO')+`<div class="card"><div class="tw"><table><thead><tr><th>Aplicación</th><th>Categoría</th><th>Estado</th><th></th></tr></thead><tbody>${L.map(([n,c,ic,id,on])=>`<tr><td><span class="row" style="gap:.6rem"><span style="width:28px;height:28px;display:inline-grid;place-items:center;border:1px solid var(--line)">${ico(ic)}</span><b>${esc(n)}</b></span></td><td>${esc(c)}</td><td><span class="tag ${on?'ok':''}">${on?'Activa':'Instalada, sin activar'}</span></td><td><button class="btn sm" data-act="urGo" data-id="${id}">Abrir</button></td></tr>`).join('')}</tbody></table></div></div>
 <p class="sm mut">Las integraciones con ARCA, Google y Tiendanube están en <a href="#panel/integ">Tienda online → Tiendanube y conexiones</a>.</p>`;});

/* ---------------- Marketing ---------------- */
function urAud(){const t=now();const lastBuy={};S.sales.filter(s=>s.status==='ok'&&s.cust).forEach(s=>{if(!lastBuy[s.cust]||s.ts>lastBuy[s.cust])lastBuy[s.cust]=s.ts;});
 const cs=S.customers.filter(c=>!c.elim&&c.wa);const mon=new Date(t).getMonth()+1;const pts=NL().points;
 return[['vip','Clientas VIP',cs.filter(c=>c.nl&&c.nl.seg==='vip'),'Tenemos una novedad para vos antes que nadie.'],
  ['rec','Recurrentes',cs.filter(c=>c.nl&&c.nl.seg==='recurrente'),'Llegó nueva colección y te guardamos tu talle.'],
  ['ina','Sin comprar hace +60 días',cs.filter(c=>c.channel!=='mayorista'&&(!lastBuy[c.id]||t-lastBuy[c.id]>60*URMS)),'Te extrañamos 💛 Pasá y llevate un 10 % con el código VOLVE10.'],
  ['bday','Cumplen este mes',cs.filter(c=>c.birth&&+c.birth.slice(5,7)===mon),'Feliz cumple! Tenés un 15 % de regalo con el código CUMPLE15.'],
  ['pts','Con puntos para canjear',cs.filter(c=>(pts[c.id]||0)>=10),'Juntaste puntos en tu Club. Pasá a canjearlos!'],
  ['may','Mayoristas',cs.filter(c=>c.channel==='mayorista'),'Entró stock de curvas completas. ¿Te mando la lista?']];}
reg('ur_mkt','Campañas y audiencias','mega','customers',()=>{const A1=urAud();const cps=S.coupons.filter(c=>c.active);const n=NL();
 return urHead('Marketing','ENVÍO POR WHATSAPP, SIN ENVÍO MASIVO')+`<div class="grid g3" style="align-items:start">${A1.map(([k,t,L,tx])=>`<div class="card"><h3>${esc(t)}</h3><div class="kpi"><b>${L.length}</b><span>clientas con WhatsApp</span></div><p class="sm mut">${esc(tx)}</p><button class="btn sm gold" data-act="urAudOpen" data-k="${k}" ${L.length?'':'disabled'}>Armar mensaje</button></div>`).join('')}</div>
 <div class="grid g3" style="align-items:start"><div class="card"><h3>Cupones activos</h3>${cps.map(c=>`<div class="row sm" style="margin:.3rem 0"><code class="sp">${esc(c.code)}</code><span>${c.type==='pct'?c.value+' %':money(c.value)}</span></div>`).join('')||'<p class="sm mut">Sin cupones activos.</p>'}<a class="btn sm" href="#panel/cupones">Ir a Descuentos</a></div>
 <div class="card"><h3>Ruleta y Gamificación</h3><p class="sm">Premios con descuento para sumar ventas y fidelizar.</p><span class="tag ${UR().rul.on?'ok':''}">${UR().rul.on?'Activa':'Desactivada'}</span> <a class="btn sm" href="#panel/ur_ruleta">Configurar</a></div>
 <div class="card"><h3>Avisos «Avisarme cuando vuelva»</h3><div class="kpi"><b>${n.notify.length}</b><span>clientas esperando reposición</span></div><a class="btn sm" href="#panel/moda">Ver en Talles y stock</a></div></div>
 ${typeof nlNotifyCard==='function'?nlNotifyCard():''}`;});
A.urAudOpen=el=>{const a=urAud().find(x=>x[0]===el.dataset.k);if(!a)return;const msg=UR().mk2.msg.replace('{texto}',a[3]);
 modal('Campaña: '+a[1],`<label for="mk-msg">Mensaje (usá {nombre} y {negocio})</label><textarea id="mk-msg" rows="4" style="width:100%">${esc(msg)}</textarea><p class="sm mut">WhatsApp no permite envío masivo desde un link: se abre un chat por clienta con el mensaje listo.</p>
  <div class="tw" style="max-height:260px;overflow:auto"><table><tbody>${a[2].map(c=>`<tr><td>${esc(custFull(c))}</td><td class="sm">${esc(c.wa)}</td><td><button class="btn sm gold" data-act="urAudSend" data-id="${c.id}">WhatsApp</button></td></tr>`).join('')}</tbody></table></div>`,{wide:true,okText:'Cerrar',onOk:()=>true});};
A.urAudSend=el=>{const c=custById(el.dataset.id);if(!c)return;const m=val('mk-msg').replace(/\{nombre\}/g,c.name).replace(/\{negocio\}/g,S.tenant.name);audit('CAMPAÑA_WA',custFull(c));window.open('https://wa.me/'+String(c.wa).replace(/\D/g,'')+'?text='+encodeURIComponent(m),'_blank','noopener');};

/* ---------------- Chat ---------------- */
const UR_SRC={ig:'Instagram',wa:'WhatsApp',web:'Tienda web'};
reg('ur_chat','Mensajes','chat','sell',()=>{const T=UR();const sel=T.chat.find(c=>c.id===URUI.chat.sel)||T.chat[0];if(sel&&sel.unread){sel.unread=0;save();}
 const QR=['Sí, tenemos stock en ese talle. ¿Querés que te lo separemos?','Hacemos envíos a todo el país. Pasame tu código postal y te cotizo.','Atendemos de lunes a sábado. ¡Te esperamos!','Te paso la guía de talles de la tienda: '+urPub()];
 return urHead('Chat','RESPUESTAS SIMULADAS')+`<div class="ur-chat"><div class="card" style="padding:.4rem">${T.chat.map(c=>{const last=c.msgs[c.msgs.length-1];return`<button class="btn" style="display:block;width:100%;max-width:100%;overflow:hidden;text-align:left;margin:.2rem 0;${sel&&c.id===sel.id?'border-color:#0a0a0a;':''}" data-act="urChatSel" data-id="${c.id}"><b>${esc(c.who)}</b> ${c.unread?`<span class="tag bad">${c.unread}</span>`:''}<span class="sm mut" style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(UR_SRC[c.src])} · ${esc(last.t)}</span></button>`;}).join('')}</div>
 <div class="card">${sel?`<div class="row"><h3 class="sp">${esc(sel.who)}</h3><span class="tag">${esc(UR_SRC[sel.src])}</span></div><div style="max-height:340px;overflow:auto;margin:.6rem 0">${sel.msgs.map(m=>`<div style="display:flex;justify-content:${m.from==='t'?'flex-end':'flex-start'};margin:.3rem 0"><div style="max-width:78%;padding:.5rem .7rem;border:1px solid var(--line);${m.from==='t'?'background:#0a0a0a;color:#fff':'background:#fff'}">${esc(m.t)}<div class="sm" style="opacity:.6">${fmtDT(m.ts)}</div></div></div>`).join('')}</div>
 <div class="row" style="flex-wrap:wrap;gap:.3rem;margin-bottom:.4rem">${QR.map((q,i)=>`<button class="btn sm" data-act="urChatQr" data-i="${i}">${esc(q.slice(0,28))}…</button>`).join('')}</div>
 <textarea id="ur-reply" rows="2" style="width:100%" placeholder="Escribí tu respuesta"></textarea><div class="row" style="margin-top:.4rem"><button class="btn gold" data-act="urChatSend" data-id="${sel.id}">Enviar</button>${sel.src==='wa'?`<button class="btn" data-act="urChatWa" data-id="${sel.id}">Continuar en WhatsApp</button>`:''}</div>`:'<p class="mut">Sin conversaciones.</p>'}</div></div>`;});
A.urChatSel=el=>{URUI.chat.sel=el.dataset.id;rerender();};
A.urChatQr=el=>{const q=['Sí, tenemos stock en ese talle. ¿Querés que te lo separemos?','Hacemos envíos a todo el país. Pasame tu código postal y te cotizo.','Atendemos de lunes a sábado. ¡Te esperamos!','Te paso la guía de talles de la tienda: '+urPub()][+el.dataset.i];const t=$('#ur-reply');if(t)t.value=q;};
A.urChatSend=el=>{const c=UR().chat.find(x=>x.id===el.dataset.id);const t=val('ur-reply').trim();if(!t)return toast('Escribí un mensaje',1);c.msgs.push({from:'t',t:t.slice(0,500),ts:now()});save();toast('Respuesta registrada (simulado)');rerender();};
A.urChatWa=el=>{const c=UR().chat.find(x=>x.id===el.dataset.id);const t=val('ur-reply').trim();window.open('https://wa.me/'+String(S.tenant.wa).replace(/\D/g,'')+(t?'?text='+encodeURIComponent(t):''),'_blank','noopener');};

/* ---------------- Canales con catálogo (Instagram/Facebook, Google, ChatGPT Ads, TikTok, Pinterest) ---------------- */
function urFeedRows(kind,adj){const base=urPub();const G={'nl-cal':'Apparel & Accessories > Shoes','nl-acc':'Apparel & Accessories > Clothing Accessories'};
 const P=S.products.filter(p=>p.active&&p.fam&&((p.loc&&p.loc.onl)||0)>0);
 const H={meta:['id','title','description','availability','condition','price','link','image_link','brand','color','size','gtin','gender','age_group'],
  google:['id','title','description','link','image_link','availability','price','brand','gtin','condition','google_product_category','color','size','item_group_id','gender','age_group'],
  tiktok:['sku_id','title','description','availability','condition','price','link','image_link','brand','gender'],
  pinterest:['id','title','description','link','image_link','price','availability'],generic:['id','title','description','link','image_link','price','availability','brand'],
  mkt:['sku','titulo','talle','color','precio_publicado','stock_publicado','codigo_barras','genero']}[kind];
 const FM=nlFamMap();const GEN={m:'female',h:'male',u:'unisex'};const rows=P.map(p=>{const col=(NL_COL[p.color]||[''])[0];const pr=p.price*(adj&&adj.markup?1+adj.markup/100:1);const price=(Math.round(pr/100)).toFixed(2)+' ARS';const av=((p.loc.onl||0)>0)?'in stock':'out of stock';
  const m={id:p.id,sku_id:p.id,sku:p.id,title:pfull(p),titulo:pfull(p),description:pfull(p)+' · '+S.tenant.name,link:base,image_link:'',availability:av,condition:'new',price,brand:S.tenant.name,color:col,size:p.talle,gtin:p.barcode,
   google_product_category:G[p.rubro]||'Apparel & Accessories > Clothing',item_group_id:p.fam,gender:GEN[(FM[p.fam]||{}).g]||'female',age_group:'adult',genero:({m:'Mujer',h:'Hombre',u:'Unisex'})[(FM[p.fam]||{}).g]||'Mujer',talle:p.talle,precio_publicado:Math.round(pr/100),stock_publicado:Math.floor((p.loc.onl||0)*((adj&&adj.stock!=null?adj.stock:100)/100)),codigo_barras:p.barcode};
  return H.map(h=>m[h]);});
 return{H,rows};}
const UR_CHD={
 igfb:{id:'ur_igfb',t:'Instagram y Facebook',icon:'ig',feed:'meta',src:'ig',acct:'Usuario de Instagram / Página de Facebook',d:'Catálogo para etiquetar productos en publicaciones, historias y la tienda de Facebook. Los mensajes llegan al módulo Chat.',steps:['Cuenta de Instagram profesional vinculada a una Página de Facebook','Catálogo creado en Commerce Manager con el feed de productos','Dominio de la tienda verificado','Revisión de la tienda por parte de la plataforma','Etiquetar productos en publicaciones e historias']},
 gshop:{id:'ur_gshop',t:'Google Shopping',icon:'gshop',feed:'google',acct:'ID de cuenta de Merchant Center',d:'Publicá las prendas en los resultados de Google Shopping y en las fichas gratuitas.',steps:['Cuenta de Merchant Center creada y sitio verificado','Feed de productos cargado (descargalo abajo)','Política de envíos y devoluciones completa','Vinculación con Google Ads (opcional, para campañas pagas)']},
 gpt:{id:'ur_gpt',t:'ChatGPT Ads',icon:'bot',feed:'generic',acct:'Cuenta publicitaria',d:'Canal para que las prendas del catálogo aparezcan en anuncios dentro de asistentes conversacionales. Se parte del mismo feed de productos.',steps:['Cuenta publicitaria creada','Feed de productos con título, precio, disponibilidad y link','Presupuesto diario definido','Revisión de anuncios']},
 tiktok:{id:'ur_tiktok',t:'TikTok',icon:'tiktok',feed:'tiktok',acct:'Usuario / cuenta de TikTok Shop o Ads',d:'Vendé desde videos y lives con el catálogo sincronizado.',steps:['Cuenta de TikTok Business','Catálogo cargado con el feed de productos','Píxel o evento de compra instalado en la tienda','Primer video con producto etiquetado']},
 pin:{id:'ur_pin',t:'Pinterest',icon:'pin',feed:'pinterest',acct:'Usuario de Pinterest Business',d:'Convertí tus fotos en pines comprables que llevan a la ficha de la prenda.',steps:['Cuenta de Pinterest Business','Dominio de la tienda reclamado','Catálogo cargado con el feed de productos','Pines de producto publicados']}};
function urChannelScreen(k){const D=UR_CHD[k];
 reg(D.id,D.t,D.icon,'menu_admin',()=>{const T=UR();const c=T.ch[k];const F=urFeedRows(D.feed);const O=D.src?NL().orders.filter(o=>urNormCh(o.channel)===D.src):[];const paid=O.filter(o=>!['nuevo','cancelado'].includes(o.state));
  return urHead(D.t,'CONEXIÓN SIMULADA')+`<div class="card"><div class="row"><p class="sp">${esc(D.d)}</p><span class="tag ${c.on?'ok':''}">${c.on?'Conectado':'Sin conectar'}</span><button class="btn ${c.on?'':'gold'}" data-act="urChToggle" data-k="${k}">${c.on?'Desconectar':'Conectar canal'}</button></div>
  <label for="ur-acc">${esc(D.acct)}</label><input id="ur-acc" value="${esc(c.acc)}" style="max-width:360px" data-chg="urChAcc" data-k="${k}" placeholder="Completá para conectar"></div>`+
  urGrid(urKpi('Prendas listas para publicar',F.rows.length,'con stock en el bucket Online')+(D.src?urKpi('Pedidos del canal',O.length)+urKpi('Facturado por el canal',money(paid.reduce((a,o)=>a+nlOrderTotal(o),0))):urKpi('Pedidos del canal','—','todavía sin ventas atribuidas')))+
  `<div class="card"><div class="row"><h3 class="sp">Catálogo de productos</h3><button class="btn gold" data-act="urFeed" data-k="${k}">Descargar feed (CSV)</button></div><div class="tw"><table><thead><tr>${F.H.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${F.rows.slice(0,5).map(r=>`<tr>${r.map(x=>`<td class="sm">${esc(String(x).slice(0,34))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="sm mut">Sale de tu stock real. Formato base de ejemplo: revisá los campos obligatorios de la plataforma antes de subirlo. Las imágenes se agregan al cargar las fotos de cada prenda.</p></div>
  <div class="card"><h3>Pasos para activar</h3>${D.steps.map((s,i)=>`<label class="row" style="gap:.5rem;margin:.35rem 0"><input type="checkbox" class="ur-chk" ${c.done.includes(i)?'checked':''} data-chg="urStep" data-k="${k}" data-i="${i}"><span>${esc(s)}</span></label>`).join('')}<p class="sm mut">${c.done.length} de ${D.steps.length} completos</p></div>`;});}
Object.keys(UR_CHD).forEach(urChannelScreen);
A.urChToggle=el=>{const c=UR().ch[el.dataset.k];if(!c.on&&!(c.acc||'').trim())return toast('Completá la cuenta para conectar',1);c.on=!c.on;audit('CANAL_VENTA',el.dataset.k+(c.on?' conectado (simulado)':' desconectado'));save();rerender();};
A.urChAcc=el=>{UR().ch[el.dataset.k].acc=el.value.trim().slice(0,60);save();toast('Guardado');};
A.urStep=el=>{const c=UR().ch[el.dataset.k];const i=+el.dataset.i;c.done=c.done.filter(x=>x!==i);if(el.checked)c.done.push(i);save();rerender();};
A.urFeed=el=>{const D=UR_CHD[el.dataset.k];const F=urFeedRows(D.feed);urCsv('feed-'+el.dataset.k+'-'+dkey(now())+'.csv',F.H,F.rows);toast('Feed descargado: '+F.rows.length+' prendas');};

/* ---------------- WhatsApp ---------------- */
reg('ur_wa','WhatsApp','wa','menu_admin',()=>{const T=UR();const W=T.wa;const O=NL().orders.filter(o=>urNormCh(o.channel)==='wa');const num=String(S.tenant.wa||'');
 return urHead('WhatsApp','SIN API OFICIAL: ENLACES wa.me')+urGrid(urKpi('Número del comercio','+'+esc(num))+urKpi('Pedidos por WhatsApp',O.length)+urKpi('Conversaciones abiertas',T.chat.filter(c=>c.src==='wa').length))+
 `<div class="card"><div class="row" style="flex-wrap:wrap;gap:.5rem"><a class="btn gold" target="_blank" rel="noopener" href="https://wa.me/${esc(num.replace(/\D/g,''))}">Abrir WhatsApp</a><button class="btn" data-act="urCopyLink">Copiar link de la tienda</button><button class="btn" data-act="urCopyWa">Copiar link de WhatsApp</button><a class="btn" href="#panel/ur_chat">Ir al Chat</a></div><p class="sm mut">El botón «Consultar» de la tienda pública ya abre un chat con este número y la prenda elegida. Cambiá el número en Configuración → General.</p></div>
 <div class="card"><h3>Mensajes rápidos</h3>${W.tpl.map((t,i)=>`<div style="margin:.5rem 0"><textarea rows="2" style="width:100%" data-chg="urTpl" data-i="${i}" aria-label="Mensaje rápido ${i+1}">${esc(t)}</textarea><button class="btn sm" data-act="urTplCopy" data-i="${i}">Copiar</button></div>`).join('')}<p class="sm mut">Variables: {nombre}, {link}, {guia}.</p></div>`;});
A.urCopyWa=()=>{const u='https://wa.me/'+String(S.tenant.wa||'').replace(/\D/g,'');try{navigator.clipboard.writeText(u);toast('Link copiado');}catch(e){toast('Copialo a mano: '+u);}};
A.urTpl=el=>{UR().wa.tpl[+el.dataset.i]=el.value.slice(0,400);save();toast('Guardado');};
A.urTplCopy=el=>{const t=UR().wa.tpl[+el.dataset.i].replace('{link}',urPub());try{navigator.clipboard.writeText(t);toast('Mensaje copiado');}catch(e){toast('No se pudo copiar',1);}};

/* ---------------- Marketplaces ---------------- */
reg('ur_mktp','Marketplaces','globe','menu_admin',()=>{const T=UR();const base=urFeedRows('mkt').rows.length;
 return urHead('Marketplaces','PUBLICACIÓN SIMULADA')+`<p class="sm mut">Ajustá el recargo de precio y qué porcentaje del stock Online se publica en cada marketplace. Los números salen del stock real.</p>`+
 T.mk.L.map(m=>{const F=urFeedRows('mkt',{markup:m.on?m.markup:0,stock:m.stock});const u=F.rows.reduce((a,r)=>a+r[5],0);const ex=F.rows[0];
  return`<div class="card"><div class="row"><h3 class="sp">${esc(m.n)}</h3><span class="tag ${m.on?'ok':''}">${m.on?'Publicando':'Pausado'}</span><button class="btn ${m.on?'':'gold'}" data-act="urMktTog" data-id="${m.id}">${m.on?'Pausar':'Activar'}</button></div>
  <div class="row" style="flex-wrap:wrap;gap:.8rem;margin:.5rem 0"><label class="row" style="gap:.4rem"><span>Recargo de precio %</span><input value="${m.markup}" inputmode="decimal" style="width:70px" data-chg="urMk" data-id="${m.id}" data-k="markup"></label><label class="row" style="gap:.4rem"><span>Stock a publicar %</span><input value="${m.stock}" inputmode="numeric" style="width:70px" data-chg="urMk" data-id="${m.id}" data-k="stock"></label></div>
  ${urGrid(urKpi('Prendas publicables',F.rows.length)+urKpi('Unidades publicadas',u)+urKpi('Ejemplo de precio',ex?money(ex[4]*100):'—',ex?esc(ex[1]):''))}
  <button class="btn" data-act="urMktFeed" data-id="${m.id}">Descargar publicación (CSV)</button></div>`;}).join('');});
A.urMktTog=el=>{const m=UR().mk.L.find(x=>x.id===el.dataset.id);m.on=!m.on;audit('MARKETPLACE',m.n+(m.on?' activo (simulado)':' pausado'));save();rerender();};
A.urMk=el=>{const m=UR().mk.L.find(x=>x.id===el.dataset.id);const k=el.dataset.k;m[k]=k==='markup'?Math.max(0,Math.min(200,urNum(el.value,0))):Math.max(0,Math.min(100,Math.round(urNum(el.value,0))));save();rerender();};
A.urMktFeed=el=>{const m=UR().mk.L.find(x=>x.id===el.dataset.id);const F=urFeedRows('mkt',{markup:m.markup,stock:m.stock});urCsv('publicacion-'+m.id+'-'+dkey(now())+'.csv',F.H,F.rows);toast('Descargado: '+F.rows.length+' prendas');};

/* ---------------- tienda pública: cotizador de envío y medios de pago (los consume el iframe) ---------------- */
NL_PUB.pay=function(){const P=UR().pay;return{cuotas:P.cuotas,methods:P.m.filter(x=>x.on&&x.id!=='efectivo').map(x=>x.n),cash:!!(P.m.find(x=>x.id==='efectivo')||{}).on};};
NL_PUB.ship=function(cp,kg,total){const T=UR(),E=T.env,out=[];let err='',zone='';
 const z=urZone(cp);if(!z)err='No encontramos ese código postal. Probá con 4 dígitos (ej. 4400).';else zone=z.n;
 if(E.retiro)out.push({id:'retiro',carrier:'Retiro en el local',svc:'',price:0,days:'Hoy o mañana'});
 if(z)Object.keys(UR_CAR).forEach(k=>{const cf=T.car[k];if(!cf.on)return;[['dom','A domicilio'],['suc','A sucursal']].forEach(([sv,lb])=>{if(!cf[sv])return;const q=urQuote(k,cp,kg,0,sv);if(q.err)return;out.push({id:k+'-'+sv,carrier:UR_CAR[k].n,svc:lb,price:Math.round(q.price/100),days:q.days});});});
 if(total*100>=E.free){const paid=out.filter(o=>o.id!=='retiro').sort((a,b)=>a.price-b.price)[0];if(paid){paid.price=0;paid.free=true;}}
 return{zone,opts:out,err};};
/* ---------------- Fotos y video por prenda (reemplazan a las ilustraciones en la tienda) ---------------- */
URUI.ph={fam:'',col:'*'};
const UR_PHMAX=6,UR_VIDMAX=5*1024*1024;
function urImg(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const k=Math.min(1,1100/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82));};im.src=fr.result;};fr.readAsDataURL(file);});}
const urPhCount=fam=>{const p=UR().photos[fam]||{};return Object.values(p).reduce((a,l)=>a+l.length,0);};
const urPhBytes=()=>{const T=UR();let n=0;Object.values(T.photos).forEach(o=>Object.values(o).forEach(l=>l.forEach(u=>n+=u.length)));Object.values(T.video).forEach(u=>n+=u.length);return Math.round(n*0.75);};
reg('ur_fotos','Fotos y video','camera','edit_products',()=>{const T=UR();const F=Object.values(nlFamMap());const withPh=F.filter(f=>urPhCount(f.id)>0).length;
 return urHead('Fotos y video de las prendas')+`<p class="sm mut">Lo que cargues acá reemplaza a las ilustraciones en la grilla y en la ficha de la tienda pública. Recomendado: fondo liso, luz natural, formato vertical y varios ángulos (frente, espalda, detalle y puesta en modelo).</p>`+
 urGrid(urKpi('Modelos con fotos',withPh+' de '+F.length)+urKpi('Fotos cargadas',Object.values(T.photos).reduce((a,o)=>a+Object.values(o).reduce((b,l)=>b+l.length,0),0))+urKpi('Con video',Object.keys(T.video).length)+urKpi('Espacio usado',(urPhBytes()/1048576).toFixed(1)+' MB','en este navegador'))+
 `<div class="card"><div class="tw"><table><thead><tr><th>Modelo</th><th>Sección</th><th>Colores</th><th class="r">Fotos</th><th>Video</th><th></th></tr></thead><tbody>${F.map(f=>`<tr><td><b>${esc(f.name)}</b></td><td>${({m:'Mujer',h:'Hombre',u:'Unisex'})[f.g]||'Mujer'}</td><td>${f.colors.map(c=>`<i style="display:inline-block;width:12px;height:12px;border-radius:50%;border:1px solid #0003;margin-right:4px;background:${esc((NL_COL[c]||['','#999'])[1])}" title="${esc((NL_COL[c]||[c])[0])}"></i>`).join('')}</td><td class="r">${urPhCount(f.id)}</td><td>${T.video[f.id]?'<span class="tag ok">Sí</span>':'—'}</td><td><button class="btn sm" data-act="urPhOpen" data-id="${f.id}">Administrar</button></td></tr>`).join('')}</tbody></table></div></div>`;});
function urPhBody(){const T=UR(),ph=URUI.ph,F=nlFamMap()[ph.fam];if(!F)return'';const list=(T.photos[ph.fam]||{})[ph.col]||[];const vid=T.video[ph.fam];
 const cols=[['*','Todos los colores'],...F.colors.map(c=>[c,(NL_COL[c]||[c])[0]])];
 return `<div class="rtabs" style="margin:.2rem 0 .6rem">${cols.map(([k,l])=>`<button class="rtab ${k===ph.col?'on':''}" data-act="urPhCol" data-k="${esc(k)}">${esc(l)} <b>${((T.photos[ph.fam]||{})[k]||[]).length}</b></button>`).join('')}</div>
 <p class="sm mut">${ph.col==='*'?'Estas fotos se muestran para cualquier color que no tenga fotos propias.':'Estas fotos se muestran solo cuando la clienta elige este color.'} La primera es la principal (portada en la grilla).</p>
 <div class="row" style="flex-wrap:wrap;gap:.6rem;margin:.5rem 0">${list.map((u,i)=>`<div style="width:104px"><img src="${u}" alt="Foto ${i+1}" style="width:104px;height:132px;object-fit:cover;border:1px solid var(--line)"><div class="row" style="gap:2px;margin-top:2px"><button class="btn sm" data-act="urPhMv" data-i="${i}" data-d="-1" ${i?'':'disabled'} aria-label="Mover antes">←</button><button class="btn sm" data-act="urPhMv" data-i="${i}" data-d="1" ${i<list.length-1?'':'disabled'} aria-label="Mover después">→</button><button class="btn sm red" data-act="urPhDel" data-i="${i}" aria-label="Quitar foto">✕</button></div>${i===0?'<span class="tag ok">Principal</span>':''}</div>`).join('')||'<p class="sm mut">Todavía no hay fotos para este grupo.</p>'}</div>
 <label for="ur-ph-in">Agregar fotos (hasta ${UR_PHMAX}; se reducen a 1100 px)</label><input id="ur-ph-in" type="file" accept="image/*" multiple data-chg="urPhAdd" ${list.length>=UR_PHMAX?'disabled':''}>
 <h4 style="margin-top:1.2rem">Video corto (opcional, hasta 5 MB)</h4>${vid?`<video src="${vid}" controls muted playsinline style="max-width:240px;max-height:300px"></video><div><button class="btn sm red" data-act="urVidDel">Quitar video</button></div>`:'<p class="sm mut">Sin video.</p>'}
 <input id="ur-vid-in" type="file" accept="video/mp4,video/webm" data-chg="urVidAdd">`;}
function urPhPaint(){const b=document.getElementById('ur-ph-body');if(b)b.innerHTML=urPhBody();}
A.urPhOpen=el=>{URUI.ph={fam:el.dataset.id,col:'*'};modal('Fotos · '+nlFamMap()[el.dataset.id].name,'<div id="ur-ph-body">'+urPhBody()+'</div>',{wide:true,okText:'Listo',onOk:()=>{rerender();return true;}});};
A.urPhCol=el=>{URUI.ph.col=el.dataset.k;urPhPaint();};
A.urPhAdd=async el=>{const T=UR(),ph=URUI.ph;const files=[...el.files];if(!files.length)return;const o=T.photos[ph.fam]||(T.photos[ph.fam]={});const l=o[ph.col]||(o[ph.col]=[]);let n=0;
 for(const f of files){if(l.length>=UR_PHMAX){toast('Máximo '+UR_PHMAX+' fotos por grupo',1);break;}if(!/^image\//.test(f.type)){toast('«'+f.name+'» no es una imagen',1);continue;}
  try{l.push(await urImg(f));n++;}catch(e){toast('No se pudo leer «'+f.name+'»',1);}}
 el.value='';if(n){audit('FOTOS_PRENDA',ph.fam+' · +'+n);save();toast(n+' foto(s) cargada(s)');}urPhPaint();};
A.urPhMv=el=>{const ph=URUI.ph,l=UR().photos[ph.fam][ph.col],i=+el.dataset.i,j=i+(+el.dataset.d);if(j<0||j>=l.length)return;[l[i],l[j]]=[l[j],l[i]];save();urPhPaint();};
A.urPhDel=el=>{const ph=URUI.ph,o=UR().photos[ph.fam],l=o[ph.col];l.splice(+el.dataset.i,1);if(!l.length)delete o[ph.col];if(!Object.keys(o).length)delete UR().photos[ph.fam];save();urPhPaint();};
A.urVidAdd=el=>{const f=el.files[0];if(!f)return;if(f.size>UR_VIDMAX){el.value='';return toast('El video pesa más de 5 MB: acortalo o comprimilo',1);}
 const fr=new FileReader();fr.onload=()=>{UR().video[URUI.ph.fam]=fr.result;audit('VIDEO_PRENDA',URUI.ph.fam);save();el.value='';toast('Video cargado');urPhPaint();};fr.onerror=()=>toast('No se pudo leer el video',1);fr.readAsDataURL(f);};
A.urVidDel=()=>{delete UR().video[URUI.ph.fam];save();urPhPaint();};
