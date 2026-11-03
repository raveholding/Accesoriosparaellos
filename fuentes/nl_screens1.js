/* ===== Pantallas de moda (se suman a las de la demo final) ===== */
Object.assign(IC,{hanger:'M12 7a2 2 0 1 0-2-2M12 7v2l9 6a1 1 0 0 1-.6 1.8H3.6A1 1 0 0 1 3 15l9-6',chart:'M4 20V8M10 20V4M16 20v-9M22 20H2',factory:'M3 21V9l6 4V9l6 4V4h6v17z',tag:'M3 12V4h8l10 10-8 8zM7.5 7.5h.01',ruler:'M3 17L17 3l4 4L7 21zM8 12l2 2M11 9l2 2M14 6l2 2'});
const nlCh={},nlIn={};
document.addEventListener('change',e=>{const el=e.target.closest('[data-nlchg]');if(el&&nlCh[el.dataset.nlchg])nlCh[el.dataset.nlchg](el,e);});
document.addEventListener('input',e=>{const el=e.target.closest('[data-nlinp]');if(el&&nlIn[el.dataset.nlinp])nlIn[el.dataset.nlinp](el,e);});
const nlUI={fit:{cust:'',m:{pecho:'',cintura:'',cadera:'',altura:'',pie:'',pref:'regular'},fam:'rem-bas',color:'',size:'',look:{top:'rem-bas|negro',bot:'jea-rec|denimo',abr:'',acc:'acc-cin|negro',cal:''}},moda:{tab:'mat',fam:'rem-bas',view:'tot',cat:'nl-rem',loc:'loc',count:null},omni:{tab:'kan'},bi:{days:30},c360:{id:'',q:''},tal:{}};
const nlOpt=(arr,sel)=>arr.map(([v,t])=>`<option value="${esc(v)}" ${String(v)===String(sel)?'selected':''}>${esc(t)}</option>`).join('');
const nlFamOpts=(sel,cats)=>{const fm=nlFamMap();return Object.values(fm).filter(f=>!cats||cats.includes(f.cat)).map(f=>`<option value="${f.id}" ${f.id===sel?'selected':''}>${esc(f.name)}</option>`).join('');};
const nlColName=k=>(NL_COL[k]||[k])[0],nlColHex=k=>(NL_COL[k]||['','#999'])[1];
const nlSw=k=>`<i class="swatch" style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${safeColor(nlColHex(k))};border:1px solid #0003;vertical-align:-2px"></i>`;
const nlLocChip=(p)=>{if(!p)return'<span class="tag">sin variante</span>';const l=p.stock,d=(p.loc&&p.loc.dep)||0,o=(p.loc&&p.loc.onl)||0;const cls=(l+d+o)<=0?'bad':(l<=0?'warn':'ok');return `<span class="tag ${cls}" title="Local / Depósito / Online">${l} / ${d} / ${o}</span>`;};
function nlMeasOf(){const f=nlUI.fit;const m={};['pecho','cintura','cadera','altura','pie'].forEach(k=>{const v=parseNum(String(f.m[k]||'').replace(',','.'));if(!isNaN(v)&&v>0)m[k]=v;});m.pref=f.m.pref||'regular';return m;}
function nlLoadCust(id){const f=nlUI.fit;f.cust=id;const c=id?custById(id):null;const m=(c&&c.nl&&c.nl.m)||{};['pecho','cintura','cadera','altura','pie'].forEach(k=>{f.m[k]=m[k]?String(m[k]).replace('.',','):'';});f.m.pref=m.pref||'regular';f.size='';}
/* qué prenda del muñeco corresponde a una familia y color */
function nlGarment(o,famId,ck,earn){const f=nlFamMap()[famId];if(!f)return;const hex=nlColHex(ck);
 if(['nl-rem','nl-cam'].includes(f.cat)){o.top=hex;o.topEase=earn;o.crop=famId==='rem-rib';}
 else if(f.cat==='nl-abr'){o.top=hex;o.topEase=earn;o.long=famId==='tap-pan';}
 else if(f.cat==='nl-ves'){if(famId==='pol-ple'){o.skirt=hex;}else{o.top=hex;o.long=true;o.topEase=earn;}}
 else if(f.cat==='nl-pan'){o.bot=hex;o.botEase=earn;o.short=famId==='sho-den';}
 else if(f.cat==='nl-acc'){o.acc=hex;}else if(f.cat==='nl-cal'){o.shoe=hex;}}
function nlFitHTML(){const F=nlUI.fit;const m=nlMeasOf();const fm=nlFamMap()[F.fam];if(!fm)return'';const res=nlFitCalc(F.fam,m);
 if(!F.color||!fm.colors.includes(F.color))F.color=fm.colors[0];
 if(!F.size||!NL_SIZES[fm.chart].includes(F.size))F.size=res.best&&res.dims!==0&&res.rows.length&&Object.keys(m).some(k=>k!=='pref')?res.best.size:NL_SIZES[fm.chart][Math.floor(NL_SIZES[fm.chart].length/2)];
 const sel=res.rows.find(r=>r.size===F.size)||res.best;const hasM=fm.dims.some(d=>m[d]>0);
 const ease=sel?(sel.avgDev+fm.ideal+(NL_PREF[m.pref]||0)):0;
 const o={};nlGarment(o,F.fam,F.color,ease);
 const stock=nlStockOf(F.fam,F.color,F.size);
 const rowsH=res.rows.map(r=>{const st=nlStockOf(F.fam,F.color,r.size);const best=hasM&&res.best&&res.best.size===r.size;const dtxt=Object.entries(r.dev).map(([k,v])=>k+' '+(v>0?'+':'')+String(v).replace('.',',')+' cm').join(' · ');
  return `<tr class="${r.size===F.size?'sel':''}" style="${r.size===F.size?'background:#fbf0f3':''}"><td><b>${esc(r.size)}</b>${best?' <span class="tag ok">Recomendado</span>':''}</td><td>${hasM?`<div class="bar" style="width:110px"><i style="width:${r.score}%"></i></div><span class="sm">${r.score} / 100</span>`:'—'}</td><td>${esc(hasM?r.label:'—')}<div class="sm mut">${esc(dtxt)}</div></td><td>${nlLocChip(st&&st.p)}</td><td class="r"><button class="btn sm" data-act="nlFitSize" data-sz="${esc(r.size)}">Probar</button></td></tr>`;}).join('');
 let alt='';if(stock&&stock.p){const sp=stock.p;
  if(sp.stock<=0&&stock.dep>0)alt+=`<div class="warnbox">No hay en el salón, pero hay <b>${stock.dep}</b> en el Depósito. <button class="btn sm" data-act="nlFitMove" data-id="${sp.id}">Pedir traspaso al salón (${Math.min(3,stock.dep)})</button></div>`;
  else if(sp.stock<=0&&stock.onl>0)alt+=`<div class="warnbox">Sólo queda stock en <b>Online</b> (${stock.onl}). Podés <button class="btn sm" data-act="nlFitOrder" data-id="${sp.id}">Crear pedido online / retiro</button></div>`;
  else if(sp.stock<=0)alt+=`<div class="errbox">Sin stock de este talle en ninguna ubicación. Probá el talle vecino o pedí reposición a un taller.</div>`;}
 const near=hasM&&res.best&&res.rows.filter(r=>r.size!==F.size&&r.score>=res.best.score-12).map(r=>r.size);
 return `<div class="grid g2" style="align-items:start"><div>
  <div class="row" style="flex-wrap:wrap;gap:.4rem"><b class="sp">${esc(fm.name)}</b>${fm.colors.map(k=>`<button class="btn sm ${k===F.color?'gold':''}" data-act="nlFitColor" data-c="${k}">${nlSw(k)} ${esc(nlColName(k))}</button>`).join('')}</div>
  ${hasM?'':'<div class="warnbox" style="margin-top:.5rem">Cargá al menos una medida ('+esc(fm.dims.join(', ')||'ninguna: talle único')+') para calcular el calce.</div>'}
  ${res.note.map(t=>`<p class="sm mut">⚠ ${esc(t)}</p>`).join('')}
  <div class="tw"><table><thead><tr><th>Talle</th><th>Puntaje</th><th>Calce</th><th title="Local / Depósito / Online">Stock L/D/O</th><th></th></tr></thead><tbody>${rowsH}</tbody></table></div>
  ${alt}${near&&near.length?`<p class="sm mut">Talles cercanos con buen puntaje: <b>${near.join(', ')}</b> (según tu preferencia de calce).</p>`:''}
  <div class="row" style="margin-top:.6rem;flex-wrap:wrap"><span class="sm mut sp">Talle elegido: <b>${esc(F.size)}</b> · ${stock&&stock.p?money(stock.p.price):''}</span>
   <button class="btn gold" data-act="nlFitAdd" ${stock&&stock.p?'':'disabled'}>Agregar al ticket (POS)</button><button class="btn" data-act="nlFitOrder" data-id="${stock&&stock.p?stock.p.id:''}" ${stock&&stock.p?'':'disabled'}>Pedido online</button></div></div>
  <div>${nlAvatar(m,o)}<p class="sm mut" style="text-align:center">Muñeco a escala de las medidas cargadas${hasM?' · comodidad estimada '+(ease>=0?'+':'')+String(Math.round(ease*10)/10).replace('.',',')+' cm':''}. Es una guía visual, no una foto.</p></div></div>`;}
function nlLookItems(){const L=nlUI.fit.look;const m=nlMeasOf();const out=[];
 [['top','Parte de arriba'],['bot','Parte de abajo'],['abr','Abrigo'],['acc','Accesorio'],['cal','Calzado']].forEach(([slot,lbl])=>{const v=L[slot];if(!v)return;const [fam,col]=v.split('|');const f=nlFamMap()[fam];if(!f)return;
  const rs=nlFitCalc(fam,m);const hasM=f.dims.some(d=>m[d]>0);const sz=hasM&&rs.best?rs.best.size:NL_SIZES[f.chart][Math.floor(NL_SIZES[f.chart].length/2)];
  const st=nlStockOf(fam,col,sz);out.push({slot,lbl,fam,col,sz,hasM,score:hasM&&rs.best?rs.best.score:0,st,p:st&&st.p,f});});
 return out;}
function nlLookHTML(){const m=nlMeasOf();const items=nlLookItems();const L=nlUI.fit.look;const fm=nlFamMap();
 const slotSel=(slot,cats)=>{const opts=[['','— sin '+({top:'prenda de arriba',bot:'prenda de abajo',abr:'abrigo',acc:'accesorio',cal:'calzado'}[slot])+' —']];Object.values(fm).filter(f=>cats.includes(f.cat)||(slot==='bot'&&f.id==='pol-ple')||(slot==='top'&&['ves-mid','ves-cam'].includes(f.id)&&false)).forEach(f=>f.colors.forEach(c=>opts.push([f.id+'|'+c,f.name+' · '+nlColName(c)])));
  return `<select data-nlchg="look" data-slot="${slot}" aria-label="${slot}">${nlOpt(opts,L[slot])}</select>`;};
 const o={};items.forEach(it=>{const rs=nlFitCalc(it.fam,m);const r=rs.rows.find(x=>x.size===it.sz);const ease=r?(r.avgDev+it.f.ideal+(NL_PREF[m.pref]||0)):0;nlGarment(o,it.fam,it.col,ease);});
 const lines=items.filter(i=>i.p).map(i=>({pid:i.p.id,qty:1,price:i.p.price,rubro:i.p.rubro}));const tot=lines.reduce((a,l)=>a+l.price,0);const q=nlPromoCalc(lines,nlUI.fit.cust);
 const noStock=items.filter(i=>!i.p||(i.st&&i.st.loc+i.st.dep+i.st.onl<=0));
 return `<div class="grid g2" style="align-items:start"><div>
  <div class="grid g2"><div><label>Parte de arriba</label>${slotSel('top',['nl-rem','nl-cam'])}</div><div><label>Parte de abajo</label>${slotSel('bot',['nl-pan'])}</div><div><label>Abrigo</label>${slotSel('abr',['nl-abr'])}</div><div><label>Accesorio</label>${slotSel('acc',['nl-acc'])}</div><div><label>Calzado</label>${slotSel('cal',['nl-cal'])}</div></div>
  <div class="tw" style="margin-top:.6rem"><table><thead><tr><th>Prenda</th><th>Talle</th><th>Stock L/D/O</th><th class="r">Precio</th></tr></thead><tbody>${items.map(i=>`<tr><td>${esc(i.lbl)}: ${esc(i.f.name)} ${nlSw(i.col)} ${esc(nlColName(i.col))}</td><td><b>${esc(i.sz)}</b>${i.hasM?' <span class="sm mut">('+i.score+')</span>':' <span class="sm mut">sin medidas</span>'}</td><td>${nlLocChip(i.p)}</td><td class="r">${i.p?money(i.p.price):'—'}</td></tr>`).join('')||'<tr><td colspan="4" class="mut">Elegí al menos una prenda.</td></tr>'}</tbody></table></div>
  <div class="row" style="margin:.5rem 0"><span class="sp mut">Suma de prendas</span><b>${money(tot)}</b></div>
  ${q.best?`<div class="okbox">Promoción aplicable: <b>${esc(q.best.name)}</b> (${esc(q.best.why)}) · −${money(q.best.disc)} → <b>${money(tot-q.best.disc)}</b></div>`:'<p class="sm mut">Con un look completo (arriba + abajo + accesorio) se activa la promoción «Look completo».</p>'}
  ${noStock.length?`<div class="warnbox">Sin variante o sin stock en: ${noStock.map(i=>esc(i.lbl)).join(', ')}.</div>`:''}
  <div class="row" style="flex-wrap:wrap;margin-top:.5rem"><button class="btn gold" data-act="nlLookAdd" ${lines.length?'':'disabled'}>Agregar look al ticket (POS)</button><button class="btn" data-act="nlLookOrder" ${lines.length?'':'disabled'}>Armar pedido online con link de pago</button></div></div>
  <div>${nlAvatar(m,o)}</div></div>`;}
function nlPaintFit(){const a=$('#nl-fit-out');if(a)a.innerHTML=nlFitHTML();const b=$('#nl-look-out');if(b)b.innerHTML=nlLookHTML();}
reg('probador','Probador y looks','hanger','sell',()=>{const F=nlUI.fit;const cs=S.customers.filter(c=>!c.elim&&c.channel!=='mayorista');
 return `<div class="row"><h1 class="sp">Probador virtual y buscador de talle</h1><span class="tag sim">${IS_CLIENT?'PENDIENTE DE CONFIGURACIÓN':'DEMO · MEDIDAS DE EJEMPLO'}</span></div>
 <p class="sm mut">Elegí a la clienta (o cargá medidas a mano), el modelo y mirá el talle recomendado, el calce de cada talle y el stock en <b>Local / Depósito / Online</b>. La recomendación compara tu medida con el cuerpo de cada talle y con la comodidad del corte (fórmula en la ayuda de abajo).</p>
 <div class="card"><div class="grid g4"><div><label for="nl-cu">Clienta / cliente</label><select id="nl-cu" data-nlchg="cust"><option value="">— cargar a mano —</option>${cs.map(c=>`<option value="${c.id}" ${c.id===F.cust?'selected':''}>${esc(custFull(c))}</option>`).join('')}</select></div>
  ${[['pecho','Pecho (cm)'],['cintura','Cintura (cm)'],['cadera','Cadera (cm)'],['altura','Altura (cm)'],['pie','Largo del pie (cm)']].map(([k,t])=>`<div><label for="nl-m-${k}">${t}</label><input id="nl-m-${k}" inputmode="decimal" data-nlinp="meas" data-k="${k}" value="${esc(F.m[k]||'')}" placeholder="—"></div>`).join('')}
  <div><label for="nl-pref">Preferencia de calce</label><select id="nl-pref" data-nlchg="pref">${nlOpt([['ajustado','Ajustado'],['regular','Regular'],['holgado','Holgado']],F.m.pref)}</select></div></div>
  <div class="row" style="margin-top:.5rem"><button class="btn sm" data-act="nlSaveMeas" ${F.cust?'':'disabled'}>Guardar medidas en la ficha</button><span class="sm mut">${F.cust?'':'Elegí una clienta para guardar sus medidas.'}</span></div></div>
 <div class="card"><h3>Buscador de talle (Fit Finder)</h3><label for="nl-fam">Modelo</label><select id="nl-fam" data-nlchg="fam">${nlFamOpts(F.fam)}</select><div id="nl-fit-out" style="margin-top:.7rem"></div>
  <details style="margin-top:.6rem"><summary class="sm">¿Cómo se calcula?</summary><p class="sm mut">Para cada talle: comodidad real = (cuerpo del talle + holgura de corte) − tu medida; comodidad ideal = ideal del modelo + tu preferencia (ajustado −3 cm, regular 0, holgado +4 cm). El desvío es real − ideal; si queda <b>más chico</b> que lo ideal se penaliza ×4 (×2 en tejidos elásticos); si queda más grande se resta 1 por cm. Puntaje = 100 − 4 × desvío promedio. Es una estimación: probate la prenda.</p></details></div>
 <div class="card"><h3>Armador de looks (Mix &amp; Match)</h3><p class="sm mut">Combiná prendas y mirá cómo quedan en el muñeco, con el talle recomendado de cada una, el stock y la promoción que corresponde.</p><div id="nl-look-out"></div></div>`;},
 ()=>{nlPaintFit();},'Moda');
nlCh.cust=el=>{nlLoadCust(el.value);rerender();};
nlCh.pref=el=>{nlUI.fit.m.pref=el.value;nlUI.fit.size='';nlPaintFit();};
nlCh.fam=el=>{nlUI.fit.fam=el.value;nlUI.fit.color='';nlUI.fit.size='';nlPaintFit();};
nlCh.look=el=>{nlUI.fit.look[el.dataset.slot]=el.value;nlPaintFit();};
nlIn.meas=el=>{nlUI.fit.m[el.dataset.k]=el.value;nlUI.fit.size='';clearTimeout(nlIn._t);nlIn._t=setTimeout(nlPaintFit,180);};
A.nlFitSize=el=>{nlUI.fit.size=el.dataset.sz;nlPaintFit();};
A.nlFitColor=el=>{nlUI.fit.color=el.dataset.c;nlPaintFit();};
A.nlSaveMeas=()=>{const c=custById(nlUI.fit.cust);if(!c)return;const m=nlMeasOf();c.nl=c.nl||{};c.nl.m=m;audit('MEDIDAS_CLIENTA',custFull(c)+' · medidas actualizadas');save();toast('Medidas guardadas en la ficha');};
function nlFitLogAdd(fam,size){NL().fitLog.push({id:uid(),ts:now(),cust:nlUI.fit.cust||'',fam,size,sale:''});}
function nlToPos(p,qty){const L=pos.lines.find(l=>l.pid===p.id);if(L)L.qty+=qty;else pos.lines.push({pid:p.id,name:pfull(p),rubro:p.rubro,qty:qty,price:p.price,cost:p.cost,unit:p.unit,list:p.price});pos.sel=pos.lines.length-1;}
A.nlFitAdd=()=>{const F=nlUI.fit;const st=nlStockOf(F.fam,F.color,F.size);if(!st||!st.p)return;if(st.p.stock<=0)toast('Sin stock en el salón: se vende igual y queda en negativo');
 nlToPos(st.p,1);if(F.cust)pos.cust=F.cust;pos.nlSrc='probador';nlFitLogAdd(F.fam,F.size);save();toast('Agregado al ticket: '+pfull(st.p));go('vender');};
A.nlFitMove=el=>{const p=prod(el.dataset.id);if(!p)return;const q=Math.min(3,(p.loc&&p.loc.dep)||0);const r=nlMove(p.id,'dep','loc',q,'Reposición para probador');if(r.err)return toast(r.err,1);toast('Traspaso hecho: '+q+' u al salón');rerender();};
A.nlFitOrder=el=>{const p=prod(el.dataset.id);if(!p)return;nlOrderModal([{pid:p.id,qty:1}],nlUI.fit.cust);};
A.nlLookAdd=()=>{const items=nlLookItems().filter(i=>i.p);if(!items.length)return;items.forEach(i=>nlToPos(i.p,1));if(nlUI.fit.cust)pos.cust=nlUI.fit.cust;pos.nlSrc='probador';items.forEach(i=>nlFitLogAdd(i.fam,i.sz));save();toast('Look agregado al ticket ('+items.length+' prendas)');go('vender');};
A.nlLookOrder=()=>{const items=nlLookItems().filter(i=>i.p);nlOrderModal(items.map(i=>({pid:i.p.id,qty:1})),nlUI.fit.cust);};

/* ===== Moda y stock: matriz talle × color con 3 ubicaciones, traspasos, mermas y toma de inventario ===== */
function nlMatrixHTML(){const M=nlUI.moda;const fm=nlFamMap()[M.fam];if(!fm)return'';const sizes=NL_SIZES[fm.chart];
 const val=(p)=>M.view==='loc'?p.stock:M.view==='dep'?((p.loc&&p.loc.dep)||0):M.view==='onl'?((p.loc&&p.loc.onl)||0):nlTotal(p);
 let colTot=sizes.map(()=>0),grand=0;
 const rows=fm.colors.map(ck=>{let rt=0;const cells=sizes.map((sz,i)=>{const st=nlStockOf(M.fam,ck,sz);if(!st)return'<td class="r mut">—</td>';const v=val(st.p);rt+=v;colTot[i]+=v;grand+=v;
   const bg=v<=0?'#fde8e8':v<=2?'#fff3d6':'#e8f5e9';return `<td class="r" style="background:${bg};cursor:pointer" data-act="nlCell" data-id="${st.p.id}" title="Local ${st.loc} · Depósito ${st.dep} · Online ${st.onl}"><b>${v}</b><div class="sm mut" style="font-size:.7rem">${st.loc}/${st.dep}/${st.onl}</div></td>`;}).join('');
  return `<tr><td>${nlSw(ck)} ${esc(nlColName(ck))}</td>${cells}<td class="r"><b>${rt}</b></td></tr>`;}).join('');
 return `<div class="tw"><table><thead><tr><th>Color</th>${sizes.map(s=>`<th class="r">${esc(s)}</th>`).join('')}<th class="r">Total</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><th>Total</th>${colTot.map(v=>`<th class="r">${v}</th>`).join('')}<th class="r">${grand}</th></tr></tfoot></table></div><p class="sm mut">Cada celda muestra el stock según la vista elegida y, debajo, <b>Local / Depósito / Online</b>. Tocá una celda para mover o ajustar.</p>`;}
function nlQuiebres(){const out=[];S.products.filter(p=>p.fam&&p.active).forEach(p=>{const d=(p.loc&&p.loc.dep)||0;if(p.stock<=0&&d>0)out.push(p);});return out;}
function nlProdOpts(sel){return S.products.filter(p=>p.fam&&p.active).map(p=>`<option value="${p.id}" ${p.id===sel?'selected':''}>${esc(pfull(p))} · ${p.stock}/${(p.loc&&p.loc.dep)||0}/${(p.loc&&p.loc.onl)||0}</option>`).join('');}
reg('moda','Moda: talles y stock','box','edit_products',()=>{const M=nlUI.moda;const T=[['mat','Matriz talle × color'],['mov','Traspasos y mermas'],['inv','Toma de inventario'],['his','Movimientos']];
 const q=nlQuiebres();let body='';
 if(M.tab==='mat'){body=`<div class="card"><div class="row" style="flex-wrap:wrap"><label class="sp" for="nl-mf">Modelo</label><select id="nl-mf" data-nlchg="mfam" style="max-width:340px">${nlFamOpts(M.fam)}</select>
   ${[['tot','Total'],['loc','Local'],['dep','Depósito'],['onl','Online']].map(([k,t])=>`<button class="btn sm ${M.view===k?'gold':''}" data-act="nlView" data-v="${k}">${t}</button>`).join('')}</div><div style="margin-top:.6rem">${nlMatrixHTML()}</div></div>
   <div class="card"><div class="row"><h3 class="sp">Quiebres en el salón con stock en el depósito (${q.length})</h3>${q.length?`<button class="btn gold sm" data-act="nlReponerTodo">Reponer todo desde el depósito</button>`:''}</div>
   <div class="tw"><table><thead><tr><th>Prenda</th><th class="r">Local</th><th class="r">Depósito</th><th class="r">Online</th><th></th></tr></thead><tbody>${q.slice(0,25).map(p=>`<tr><td>${esc(pfull(p))}</td><td class="r neg">${p.stock}</td><td class="r">${p.loc.dep}</td><td class="r">${p.loc.onl}</td><td class="r"><button class="btn sm" data-act="nlFitMove" data-id="${p.id}">Reponer ${Math.min(3,p.loc.dep)}</button></td></tr>`).join('')||'<tr><td colspan="5" class="mut">Sin quiebres: el salón está completo.</td></tr>'}</tbody></table></div></div>`;}
 if(M.tab==='mov'){body=`<div class="grid g2"><div class="card"><h3>Traspaso entre ubicaciones</h3><label for="nl-tp">Prenda (Local / Depósito / Online)</label><select id="nl-tp">${nlProdOpts('')}</select>
   <div class="grid g3"><div><label for="nl-tf">Desde</label><select id="nl-tf">${nlOpt([['dep','Depósito'],['loc','Local (salón)'],['onl','Online']],'dep')}</select></div><div><label for="nl-tt">Hacia</label><select id="nl-tt">${nlOpt([['loc','Local (salón)'],['dep','Depósito'],['onl','Online']],'loc')}</select></div><div><label for="nl-tq">Cantidad</label><input id="nl-tq" inputmode="numeric" placeholder="1"></div></div>
   <label for="nl-tm">Motivo</label><input id="nl-tm" maxlength="80" placeholder="Reposición semanal"><button class="btn gold" style="margin-top:.6rem" data-act="nlDoMove">Hacer traspaso</button></div>
   <div class="card"><h3>Merma (rotura, extravío, defecto)</h3><label for="nl-mp">Prenda</label><select id="nl-mp">${nlProdOpts('')}</select>
   <div class="grid g2"><div><label for="nl-mw">Ubicación</label><select id="nl-mw">${nlOpt([['loc','Local (salón)'],['dep','Depósito'],['onl','Online']],'loc')}</select></div><div><label for="nl-mq">Cantidad</label><input id="nl-mq" inputmode="numeric" placeholder="1"></div></div>
   <label for="nl-mmo">Motivo (obligatorio)</label><input id="nl-mmo" maxlength="80" placeholder="Mancha de fábrica"><button class="btn red" style="margin-top:.6rem" data-act="nlDoMerma">Registrar merma</button></div></div>`;}
 if(M.tab==='inv'){const c=M.count;body=`<div class="card"><h3>Toma de inventario cíclica</h3><div class="grid g3"><div><label for="nl-ic">Categoría</label><select id="nl-ic">${nlOpt(S.rubros.filter(r=>/^nl-/.test(r.id)).map(r=>[r.id,r.name]),M.cat)}</select></div><div><label for="nl-il">Ubicación</label><select id="nl-il">${nlOpt([['loc','Local (salón)'],['dep','Depósito'],['onl','Online']],M.loc)}</select></div><div style="align-self:end"><button class="btn gold" data-act="nlCountStart">Generar planilla</button></div></div>
   ${c?`<div class="tw" style="margin-top:.7rem"><table><thead><tr><th>Prenda</th><th class="r">Sistema</th><th class="r">Contado</th></tr></thead><tbody>${c.rows.map((r,i)=>`<tr><td>${esc(r.name)}</td><td class="r">${r.sys}</td><td class="r"><input data-nlinp="cnt" data-i="${i}" inputmode="numeric" style="width:90px;text-align:right" placeholder="${r.sys}" value="${r.v===''?'':esc(String(r.v))}"></td></tr>`).join('')}</tbody></table></div><p class="sm mut">Dejá en blanco lo que coincide con el sistema. Sólo se ajustan las diferencias, con auditoría.</p><button class="btn gold" data-act="nlCountApply">Aplicar conteo</button>`:'<p class="sm mut">Elegí categoría y ubicación para generar la planilla de conteo.</p>'}</div>
   <div class="card"><h3>Historial de tomas</h3><div class="tw"><table><thead><tr><th>Fecha</th><th>Ubicación</th><th>Detalle</th><th class="r">Con diferencia</th><th class="r">Valor</th></tr></thead><tbody>${NL().counts.slice().reverse().map(x=>`<tr><td>${fmtDT(x.ts)}</td><td>${esc(NL_LN[x.loc]||x.loc)}</td><td>${esc(x.label)}</td><td class="r">${x.adj} / ${x.items}</td><td class="r ${x.val<0?'neg':''}">${money(x.val)}</td></tr>`).join('')||'<tr><td colspan="5" class="mut">Todavía no hay tomas.</td></tr>'}</tbody></table></div></div>`;}
 if(M.tab==='his'){body=`<div class="card"><div class="row"><h3 class="sp">Movimientos entre ubicaciones, mermas y conteos</h3></div><div class="tw"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Prenda</th><th class="r">Cant.</th><th>Detalle</th><th>Usuario</th></tr></thead><tbody>${NL().moves.slice().reverse().slice(0,120).map(m=>`<tr><td class="sm">${fmtDT(m.ts)}</td><td><span class="tag ${m.type==='merma'?'bad':''}">${esc(m.type)}</span></td><td>${esc(m.name)}</td><td class="r">${m.qty}</td><td class="sm">${m.type==='traspaso'?esc(NL_LN[m.from]+' → '+NL_LN[m.to]):''} ${esc(m.motivo||'')}</td><td class="sm">${esc(m.user)}</td></tr>`).join('')||'<tr><td colspan="6" class="mut">Sin movimientos todavía.</td></tr>'}</tbody></table></div></div>`;}
 return `<div class="row"><h1 class="sp">Moda: talles, colores y ubicaciones</h1></div><div class="rtabs" role="tablist">${T.map(([k,t])=>`<button class="rtab ${M.tab===k?'on':''}" data-act="nlModaTab" data-t="${k}">${t}</button>`).join('')}</div>${body}`;},null,'Moda');
nlCh.mfam=el=>{nlUI.moda.fam=el.value;rerender();};
nlIn.cnt=el=>{const c=nlUI.moda.count;if(c)c.rows[+el.dataset.i].v=el.value;};
A.nlModaTab=el=>{nlUI.moda.tab=el.dataset.t;rerender();};
A.nlView=el=>{nlUI.moda.view=el.dataset.v;rerender();};
A.nlCell=el=>{const p=prod(el.dataset.id);if(!p)return;const d=(p.loc&&p.loc.dep)||0,o=(p.loc&&p.loc.onl)||0;
 modal(pfull(p),`<p class="sm mut">Stock hoy — Local: <b>${p.stock}</b> · Depósito: <b>${d}</b> · Online: <b>${o}</b></p><div class="grid g3"><div><label for="nlc-f">Mover desde</label><select id="nlc-f">${nlOpt([['dep','Depósito'],['loc','Local'],['onl','Online']],'dep')}</select></div><div><label for="nlc-t">Hacia</label><select id="nlc-t">${nlOpt([['loc','Local'],['dep','Depósito'],['onl','Online']],'loc')}</select></div><div><label for="nlc-q">Cantidad</label><input id="nlc-q" inputmode="numeric" placeholder="1"></div></div>`,
  {okText:'Mover',onOk:w=>{const r=nlMove(p.id,val('nlc-f'),val('nlc-t'),parseNum(val('nlc-q')),'Desde la matriz');if(r.err)return w._err(r.err),false;toast('Traspaso hecho');rerender();}});};
A.nlReponerTodo=()=>{const q=nlQuiebres();confirmBox('Reponer el salón','Se pasan hasta 3 unidades por prenda del Depósito al Local en '+q.length+' prendas sin stock en el salón.',()=>{let n=0;q.forEach(p=>{const k=Math.min(3,p.loc.dep);if(k>0&&!nlMove(p.id,'dep','loc',k,'Reposición masiva').err)n++;});toast('Reposición hecha en '+n+' prendas');rerender();},'Reponer');};
A.nlDoMove=()=>{const r=nlMove(val('nl-tp'),val('nl-tf'),val('nl-tt'),parseNum(val('nl-tq')||'0'),val('nl-tm').trim());if(r.err)return toast(r.err,1);toast('Traspaso hecho');rerender();};
A.nlDoMerma=()=>{const r=nlMerma(val('nl-mp'),val('nl-mw'),parseNum(val('nl-mq')||'0'),val('nl-mmo').trim());if(r.err)return toast(r.err,1);toast('Merma registrada');rerender();};
A.nlCountStart=()=>{const cat=val('nl-ic'),w=val('nl-il');nlUI.moda.cat=cat;nlUI.moda.loc=w;const L=S.products.filter(p=>p.fam&&p.active&&p.rubro===cat);nlUI.moda.count={w,cat,rows:L.map(p=>({pid:p.id,name:pfull(p),sys:nlLocGet(p,w),v:''}))};rerender();};
A.nlCountApply=()=>{const c=nlUI.moda.count;if(!c)return;const counted=c.rows.map(r=>[r.pid,r.v===''||isNaN(parseNum(String(r.v)))?r.sys:Math.max(0,Math.round(parseNum(String(r.v))))]);
 confirmBox('Aplicar la toma de inventario','Se ajustan las diferencias en '+NL_LN[c.w]+' y queda registrada con su valorización.',()=>{const rec=nlApplyCount(c.w,counted,rubName(c.cat));nlUI.moda.count=null;toast('Toma aplicada: '+rec.adj+' diferencias · '+money(rec.val));rerender();},'Aplicar');};
