/* ===== Tienda pública: API que ve el iframe (talles por modelo, avatar, avisos) ===== */
const NL_FREE_SHIP=90000;   /* umbral de envío bonificado: dato de EJEMPLO */
/* opiniones de talle: base de ejemplo determinista + devoluciones reales por talle */
function nlFitFb(){const r=nlRnd(31);const out={};
 Object.keys(nlFamMap()).forEach(id=>{const t=30+Math.floor(r()*60);out[id]={n:t,chico:Math.round(t*(.08+r()*.2)),grande:Math.round(t*(.04+r()*.12)),ex:1};});
 NL().returns.forEach(x=>{const o=out[x.fam];if(!o)return;if(x.reason==='talle_chico'){o.chico+=x.qty;o.n+=x.qty;}else if(x.reason==='talle_grande'){o.grande+=x.qty;o.n+=x.qty;}});
 return out;}
function pubCatalog(){const c=pubCatalog0();if(!window.__NLREADY||!isNLBuild())return c;
 const by=new Map(S.products.map(p=>[p.id,p]));
 c.productos.forEach(x=>{const p=by.get(x.id);if(p&&p.fam){const n=Math.max(0,(p.stock||0)+((p.loc&&p.loc.onl)||0));x.nl={fam:p.fam,color:p.color,talle:p.talle,n};x.agotado=n<=0;}});
 const U=UR();c.nl={chart:NL_CHART,sizes:NL_SIZES,col:NL_COL,fams:nlFamMap(),fb:nlFitFb(),free:Math.round(U.env.free/100),wa:(S.tenant&&S.tenant.wa)||'',photos:U.photos,video:U.video,pay:NL_PUB.pay()};
 return c;}
window.NL_PUB={
 fit(fam,m){const r=nlFitCalc(fam,m);if(!r)return null;
  return{best:r.best&&r.best.size,rows:r.rows.map(x=>({size:x.size,score:x.score,label:x.label,dev:x.avgDev})),note:r.note,missing:r.missing};},
 avatar(fam,color,size,m){const f=nlFamMap()[fam];if(!f)return'';const res=nlFitCalc(fam,m);const row=res&&res.rows.find(r=>r.size===size);
  const ease=row?(row.avgDev+f.ideal+(NL_PREF[m.pref]||0)):0;const o={};nlGarment(o,fam,color,ease);return nlAvatar(m,o);},
 notify(o){const n=NL();const c=String(o.contact||'').replace(/[^0-9+@a-zA-Z._ -]/g,'').slice(0,60);if(c.length<5)return{err:'Dejanos un WhatsApp o mail válido.'};
  if(n.notify.some(x=>x.fam===o.fam&&x.color===o.color&&x.talle===o.talle&&x.contact===c))return{ok:1,dup:1};
  n.notify.push({id:uid(),ts:now(),fam:o.fam,color:o.color,talle:o.talle,contact:c,sent:false});audit('AVISO_TALLE','pedido de aviso · '+o.fam+' '+o.color+' '+o.talle+' (ejemplo)');save();return{ok:1};}
};
