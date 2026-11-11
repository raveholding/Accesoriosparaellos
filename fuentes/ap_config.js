/* ===== Accesorios para Ellos · Configuración guiada (2026-11-11) =====
   Se monta sobre el navegador de secciones del sistema base (V26.65: uxNavState / uxSecApply / #ux-secnav) sin cambiar
   cómo se guarda cada sección:
   - una sección a la vez, con menú lateral agrupado por tema (en el celular, fila de accesos arriba);
   - «Anterior / Siguiente» al pie de cada sección para recorrerla como un paso a paso, con «Paso N de M»;
   - barra fija «Cambios sin guardar» que guarda (toca el botón Guardar de esa sección) o descarta;
   - recuerda la última sección abierta durante la sesión; buscar sigue mostrando todas las coincidencias;
   - transición suave al cambiar de sección (sólo opacity/transform; respeta «reducir movimiento»). */
(function(){
 if(typeof uxSecApply!=='function'||typeof uxNavState!=='object')return;
 const SID='config',KEY='ape.cfg.sec';
 const GROUPS=[
  ['Asistentes e IA',/\bIA\b|asistente/i],
  ['Demo y datos',/datos de la demo|^demo/i],
  ['Negocio',/tipo de negocio|^comercio|categor|horario|marca|logo/i],
  ['Caja y cobros',/caja|cobro|recargo|fiado|cuenta corriente|medio|ticket|factura|impresi|cuota|alias/i],
  ['Ventas y precios',/mayorista|minorista|precio|lista|descuento|promo/i]];
 const groupOf=t=>{for(const [g,re] of GROUPS)if(re.test(t))return g;return 'Otros';};
 const title=c=>((c.querySelector('h2,h3')||{}).textContent||'').replace(/\s+/g,' ').trim();
 const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 let busy=false;

 function st(){return uxNavState[SID]||(uxNavState[SID]={sec:'all',q:''});}
 function setSec(i){const s=st();s.sec=String(i);s.q='';try{sessionStorage.setItem(KEY,s.sec);}catch(e){}
  const q=document.getElementById('ux-sec-q');if(q)q.value='';
  uxSecApply(SID);
  const v=document.getElementById('view');if(v)window.scrollTo({top:Math.max(0,v.getBoundingClientRect().top+window.scrollY-70),behavior:RM()?'auto':'smooth'});}

 function groupNav(nav,cards){
  if(nav.dataset.grp===nav.dataset.sig)return;
  const row=nav.querySelector('.ux-chips');if(!row)return;
  const all=row.querySelector('[data-sec=all]');if(all){all.textContent='Ver todas';all.title='Ver todas las secciones juntas';}
  const order=['Negocio','Caja y cobros','Ventas y precios','Asistentes e IA','Demo y datos','Otros'];const by={};
  cards.forEach((c,i)=>{const g=groupOf(title(c));(by[g]=by[g]||[]).push(i);});
  const frag=document.createDocumentFragment();
  order.forEach(g=>{if(!by[g])return;const w=document.createElement('div');w.className='cfg-g';w.setAttribute('role','group');w.setAttribute('aria-label',g);
   w.innerHTML='<span class="cfg-gt">'+g+'</span>';
   by[g].forEach(i=>{const b=row.querySelector('[data-sec="'+i+'"]');if(b){b.dataset.grp=g;if(b.title)b.innerHTML='<span class="cfg-tf">'+esc(b.title)+'</span><span class="cfg-ts">'+b.innerHTML+'</span>';w.appendChild(b);}});frag.appendChild(w);});
  if(all){const w=document.createElement('div');w.className='cfg-g cfg-g-all';w.appendChild(all);frag.appendChild(w);}
  row.appendChild(frag);row.classList.add('cfg-rows');nav.dataset.grp=nav.dataset.sig;
  const q=nav.querySelector('#ux-sec-q');if(q)q.placeholder='Buscar una opción: ticket, alias, cuotas, recargo, fiado…';
 }

 function stepper(cards,i){
  const c=cards[i];if(!c)return;const n=cards.length,t=title(c),g=groupOf(t);
  let cr=c.querySelector(':scope > .cfg-crumb');
  if(!cr){cr=document.createElement('div');cr.className='cfg-crumb';c.insertBefore(cr,c.firstChild);}
  cr.innerHTML='<span>'+g+'</span><span class="cfg-n">Paso '+(i+1)+' de '+n+'</span>';
  let f=c.querySelector(':scope > .cfg-step');
  if(!f){f=document.createElement('div');f.className='cfg-step';c.appendChild(f);}
  const prev=i>0?title(cards[i-1]):'',next=i<n-1?title(cards[i+1]):'';
  f.innerHTML=(prev?'<button type="button" class="btn ghost cfg-prev" data-go="'+(i-1)+'">← '+esc(prev)+'</button>':'<span></span>')+
   (next?'<button type="button" class="btn gold cfg-next" data-go="'+(i+1)+'">'+esc(next)+' →</button>':'<button type="button" class="btn cfg-next" data-go="all">Ver todas las secciones</button>');
 }

 function dirtyCards(v){return [...v.querySelectorAll('.card[data-cfg-dirty="1"]')].filter(c=>document.contains(c));}
 function saveBtn(c){return [...c.querySelectorAll('button,.btn')].find(b=>/guardar/i.test(b.textContent||'')&&!b.closest('.cfg-step'));}
 function paintBar(){
  const v=document.getElementById('view');let bar=document.getElementById('cfg-bar');
  const on=v&&v.classList.contains('cfg-pro');const d=on?dirtyCards(v):[];
  if(!d.length){if(bar)bar.hidden=true;document.querySelectorAll('#ux-secnav .ux-chip.cfg-dot').forEach(b=>b.classList.remove('cfg-dot'));return;}
  if(!bar){bar=document.createElement('div');bar.id='cfg-bar';bar.setAttribute('role','status');bar.setAttribute('aria-live','polite');document.body.appendChild(bar);
   bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const v2=document.getElementById('view');const dd=v2?dirtyCards(v2):[];
    if(b.dataset.a==='save'){const c=dd[0];const sb=c&&saveBtn(c);if(sb){c.dataset.cfgDirty='';sb.click();setTimeout(paintBar,250);}}
    else if(b.dataset.a==='undo'){dd.forEach(c=>{c.querySelectorAll('input,select,textarea').forEach(x=>{if(x.type==='checkbox'||x.type==='radio')x.checked=x.defaultChecked;else if(x.tagName==='SELECT')[...x.options].forEach(o=>o.selected=o.defaultSelected);else if(x.type!=='file')x.value=x.defaultValue;});c.dataset.cfgDirty='';});paintBar();if(typeof toast==='function')toast('Cambios descartados');}
    else if(b.dataset.a==='go'){const cards=uxSecCards(v2);const i=cards.indexOf(dd[0]);if(i>=0)setSec(i);}});}
  const cards=uxSecCards(v);const names=d.map(title);
  const html='<span class="cfg-bdot" aria-hidden="true"></span><span class="sp"><b>Cambios sin guardar</b> en «'+esc(names[0])+'»'+(names.length>1?' y '+(names.length-1)+' sección'+(names.length>2?'es':'')+' más':'')+'</span>'+
   (d[0].classList.contains('ux-hid')?'<button type="button" class="btn sm ghost" data-a="go">Ver</button>':'')+
   '<button type="button" class="btn sm ghost" data-a="undo">Descartar</button><button type="button" class="btn sm gold" data-a="save">Guardar cambios</button>';
  if(bar.dataset.h!==html){bar.innerHTML=html;bar.dataset.h=html;}   /* no se redibuja si no cambió: evita perder el clic cuando el campo pierde el foco */
  bar.hidden=false;
  document.querySelectorAll('#ux-secnav .ux-chip').forEach(b=>{const i=+b.dataset.sec;b.classList.toggle('cfg-dot',!isNaN(i)&&d.includes(cards[i]));});
 }

 function decorate(){
  const v=document.getElementById('view');if(!v)return;
  const on=typeof curScreen!=='undefined'&&curScreen===SID&&!!document.getElementById('ux-secnav');
  v.classList.toggle('cfg-pro',on);
  if(!on){const bar=document.getElementById('cfg-bar');if(bar)bar.hidden=true;return;}
  const nav=document.getElementById('ux-secnav');const cards=uxSecCards(v);const s=st();
  if(!s._cfg){s._cfg=1;let k=null;try{k=sessionStorage.getItem(KEY);}catch(e){}
   if(s.sec==='all'&&!s.q){s.sec=(k&&(k==='all'||cards[+k]))?k:'0';busy=true;try{uxSecApply(SID);}finally{busy=false;}}}
  let before=true;[...v.children].forEach(ch=>{if(ch===nav){before=false;return;}ch.classList.toggle('cfg-full',before);});
  groupNav(nav,cards);
  v.querySelectorAll('.cfg-step,.cfg-crumb').forEach(x=>{const c=x.closest('.card');if(!c||c.classList.contains('ux-hid')||s.sec==='all')x.remove();});
  if(s.sec!=='all'&&!s.q){const i=+s.sec;stepper(cards,i);const c=cards[i];
   if(c&&c.dataset.cfgShown!==s.sec){c.dataset.cfgShown=s.sec;if(!RM()){c.classList.remove('cfg-enter');void c.offsetWidth;c.classList.add('cfg-enter');}}}
  cards.forEach(c=>{if(c.classList.contains('ux-hid'))delete c.dataset.cfgShown;});
  paintBar();
 }

 const base=uxSecApply;
 uxSecApply=function(id){const r=base.apply(this,arguments);if(!busy&&id===SID){busy=true;try{decorate();}finally{busy=false;}}return r;};

 document.addEventListener('click',e=>{const b=e.target.closest('.cfg-step [data-go]');if(!b)return;e.preventDefault();setSec(b.dataset.go);},true);
 document.addEventListener('click',e=>{const b=e.target.closest('#ux-secnav [data-sec]');if(!b||!document.getElementById('view').classList.contains('cfg-pro'))return;try{sessionStorage.setItem(KEY,b.dataset.sec);}catch(x){}},true);
 const mark=e=>{const v=document.getElementById('view');if(!v||!v.classList.contains('cfg-pro'))return;const t=e.target;if(!t.matches||!t.matches('input,select,textarea')||t.closest('#ux-secnav'))return;
  const c=t.closest('.card');if(!c||!saveBtn(c))return;
  const changed=[...c.querySelectorAll('input,select,textarea')].some(x=>x.type==='checkbox'||x.type==='radio'?x.checked!==x.defaultChecked:x.tagName==='SELECT'?[...x.options].some(o=>o.selected!==o.defaultSelected):x.type==='file'?!!x.value:x.value!==x.defaultValue);
  c.dataset.cfgDirty=changed?'1':'';paintBar();};
 document.addEventListener('input',mark,true);document.addEventListener('change',mark,true);
 document.addEventListener('click',e=>{const b=e.target.closest('#view.cfg-pro .card button,#view.cfg-pro .card .btn');if(!b||!/guardar/i.test(b.textContent||''))return;const c=b.closest('.card');if(c)c.dataset.cfgDirty='';setTimeout(paintBar,250);},true);
 (()=>{let t=0;const mo=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{if(!busy){busy=true;try{decorate();}finally{busy=false;}}},140);});
  const hook=()=>{const v=document.getElementById('view');if(v)mo.observe(v,{childList:true});else setTimeout(hook,300);};hook();})();
 window.addEventListener('hashchange',()=>setTimeout(decorate,200));
 /* «Cambiar tipo de negocio» (desde otras pantallas) abre Configuración justo en esa sección */
 document.addEventListener('click',e=>{const b=e.target.closest('[data-act=nav][data-id=config]');if(!b||!/tipo de negocio/i.test(b.textContent||''))return;
  const s=st();s.sec='0';s.q='';s._cfg=1;try{sessionStorage.setItem(KEY,'0');}catch(x){}},true);
})();
