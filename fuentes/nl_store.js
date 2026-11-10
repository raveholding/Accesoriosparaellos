/* ===== Tienda urbana B/N (se ejecuta dentro del menú público) ===== */
(function(){
'use strict';
var RM=false;try{RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
function P(){try{return window.parent.NL_PUB||null;}catch(e){return null;}}
function CAT(){try{return window.parent.RAVE_API.catalog();}catch(e){return null;}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];});}
function money(n){return '$ '+Math.round(n).toLocaleString('es-AR');}
function q1(s,r){return (r||document).querySelector(s);}
function qa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
var D=null,FAMS={},ORDER=[],ME={},UNIT='cm';
var DIMN={pecho:'Pecho',cintura:'Cintura',cadera:'Cadera',pie:'Largo del pie',altura:'Altura'};
var DIMH={pecho:'Rodeá la parte más ancha del pecho, con la cinta paralela al piso.',cintura:'Medí en la parte más angosta del torso, sin apretar.',cadera:'Rodeá la parte más ancha de la cadera.',pie:'Parate sobre una hoja y medí del talón al dedo más largo (cm).',altura:'Descalza/o y de espaldas a la pared.'};
function loadMe(){try{ME=JSON.parse(localStorage.getItem('nl.me')||'{}')||{};}catch(e){ME={};}if(!ME.pref)ME.pref='regular';}
function saveMe(){try{localStorage.setItem('nl.me',JSON.stringify(ME));}catch(e){}}
function mNum(){var m={pref:ME.pref||'regular'};['pecho','cintura','cadera','altura','pie'].forEach(function(k){var v=parseFloat(String(ME[k]||'').replace(',','.'));if(v>0)m[k]=v;});return m;}
/* ---- datos agrupados por modelo ---- */
function build(){
  var c=CAT();D=c&&c.nl;FAMS={};ORDER=[];if(!D)return false;
  (c.productos||[]).forEach(function(p){if(!p.nl)return;var n=p.nl,f=FAMS[n.fam];
    if(!f){var def=D.fams[n.fam]||{};f=FAMS[n.fam]={id:n.fam,name:p.nom,cat:p.cat,price:p.precio,def:def,colors:[],v:{},sizes:(D.sizes[def.chart]||[]),total:0};ORDER.push(n.fam);}
    if(f.colors.indexOf(n.color)<0)f.colors.push(n.color);
    (f.v[n.color]=f.v[n.color]||{})[n.talle]={id:p.id,n:n.n};f.total+=n.n;});
  return ORDER.length>0;}
function colHex(k){return (D.col[k]||['',"#999"])[1];}
function colName(k){return (D.col[k]||[k])[0];}
function sizeInfo(f,color,sz){var o=(f.v[color]||{})[sz];return o||{id:'',n:0};}
function colorStock(f,color){var t=0;f.sizes.forEach(function(s){t+=sizeInfo(f,color,s).n;});return t;}
/* ---- talle recomendado ---- */
function recFor(fam){var p=P(),m=mNum();if(!p)return null;var f=FAMS[fam];if(!f||!f.def.dims)return null;
  var has=f.def.dims.some(function(d){return m[d]>0;});if(!has)return null;
  var r=p.fit(fam,m);if(!r||!r.best)return null;return{size:r.best,rows:r.rows,note:r.note,missing:r.missing};}
/* ---- ilustración plana de la prenda ---- */
/* ---- color ---- */
function hx(h){h=String(h||'#999').replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0];}
function mix(h,t,a){var c=hx(h),k=hx(t);return '#'+[0,1,2].map(function(i){return('0'+Math.round(c[i]+(k[i]-c[i])*a).toString(16)).slice(-2);}).join('');}
function lum(h){var c=hx(h);return(0.299*c[0]+0.587*c[1]+0.114*c[2])/255;}
/* ---- prenda: render de estudio (frente, espalda y detalle de tela). Sin fotos cargadas, la tienda muestra estas vistas ---- */
var GID=0;
var MAT={'rem-bas':'jersey','rem-rib':'rib','rem-ove':'jersey','cam-lin':'lino','cam-sat':'raso','jea-rec':'denim','jea-ski':'denim','pan-sas':'sarga','sho-den':'denim','ves-mid':'floral','ves-cam':'lino','pol-ple':'plisado','buz-can':'friza','cam-jea':'denim','tap-pan':'pano','acc-cin':'cuero','acc-buf':'lana','acc-car':'cuero','cal-zap':'lona','rem-hbo':'jersey','rem-hpo':'jersey','cam-hox':'lino','jea-hre':'denim','pan-hca':'sarga','ber-hbe':'sarga','abr-hbo':'lona','cal-hbo':'cuero','gor-bei':'lona','gor-tru':'lona','gor-lan':'lana','rel-cla':'metal','rel-dig':'metal','rel-fem':'metal','ani-sel':'metal','ani-fin':'metal','col-cad':'metal','pul-cue':'cuero','len-avi':'acetato','len-ret':'acetato','bil-cue':'cuero'};
var MATN={jersey:'Jersey de algodón peinado',rib:'Morley rib elastizado',lino:'Lino lavado',raso:'Satén fluido',denim:'Denim de 12 oz',sarga:'Sarga de lana y poliéster',floral:'Viscosa estampada',plisado:'Poliéster plisado',friza:'Friza de algodón perchada',pano:'Paño de lana',cuero:'Cuero ecológico',lana:'Lana tejida',lona:'Lona de algodón',metal:'Acero inoxidable',acetato:'Acetato con filtro UV400'};
function matName(fam){return MATN[MAT[fam]||'jersey'];}
function detail(fam,hex,id){
  var m=MAT[fam]||'jersey',dk=mix(hex,'#000000',.32),lt=mix(hex,'#ffffff',.26),th=lum(hex)<.45?'#eadcbf':'#2b2a28',pat='',extra='';
  var P=function(w,h,inner,rot){return '<pattern id="'+id+'p" width="'+w+'" height="'+h+'" patternUnits="userSpaceOnUse"'+(rot?' patternTransform="rotate('+rot+')"':'')+'>'+inner+'</pattern>';};
  if(m==='denim'){th='#d99a35';pat=P(5,5,'<rect width="5" height="2.3" fill="#fff" fill-opacity=".14"/><rect y="2.6" width="5" height="1.1" fill="#000" fill-opacity=".15"/>',38);}
  else if(m==='jersey')pat=P(7,7,'<path d="M1 1L3.5 6L6 1" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".9"/>');
  else if(m==='rib')pat=P(7,7,'<rect width="2.6" height="7" fill="#000" fill-opacity=".15"/><rect x="3.2" width="1" height="7" fill="#fff" fill-opacity=".14"/>');
  else if(m==='lino')pat=P(11,11,'<path d="M0 2H11M0 6.5H11" stroke="#000" stroke-opacity=".10" stroke-width=".8"/><path d="M3 0V11M8 0V11" stroke="#fff" stroke-opacity=".16" stroke-width=".8"/><path d="M1 9L6 9.4" stroke="#000" stroke-opacity=".16" stroke-width="1.4"/>');
  else if(m==='raso'){pat=P(8,8,'<rect width="8" height="8" fill="none"/>');extra='<rect width="200" height="230" fill="url(#'+id+'s)"/>';}
  else if(m==='sarga')pat=P(6,6,'<rect width="6" height="2" fill="#fff" fill-opacity=".10"/><rect y="3" width="6" height="1" fill="#000" fill-opacity=".14"/>',-45);
  else if(m==='pano'||m==='lana')pat=P(7,7,'<circle cx="1.5" cy="2" r=".8" fill="#fff" fill-opacity=".20"/><circle cx="5.2" cy="5" r=".9" fill="#000" fill-opacity=".14"/><circle cx="4" cy="1" r=".5" fill="#000" fill-opacity=".12"/>');
  else if(m==='friza')pat=P(5,5,'<circle cx="1.2" cy="1.3" r=".9" fill="#fff" fill-opacity=".24"/><circle cx="3.8" cy="3.6" r=".8" fill="#000" fill-opacity=".10"/>');
  else if(m==='cuero'){th=lum(hex)<.45?'#d9c9a4':'#2b2a28';pat=P(9,9,'<circle cx="2" cy="2" r=".8" fill="#000" fill-opacity=".20"/><circle cx="6.5" cy="5.5" r=".7" fill="#fff" fill-opacity=".16"/><circle cx="3" cy="7" r=".5" fill="#000" fill-opacity=".14"/>');extra='<rect width="200" height="230" fill="url(#'+id+'s)" opacity=".55"/>';}
  else if(m==='metal'){th='#fff';pat=P(10,10,'<path d="M0 5H10" stroke="#fff" stroke-opacity=".28" stroke-width=".8"/><path d="M0 8H10" stroke="#000" stroke-opacity=".14" stroke-width=".8"/>');extra='<rect width="200" height="230" fill="url(#'+id+'s)" opacity=".6"/>';}
  else if(m==='acetato'){pat=P(12,12,'<path d="M0 12L12 0" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>');}
  else if(m==='plisado')pat=P(14,14,'<rect width="7" height="14" fill="#fff" fill-opacity=".13"/><rect x="7" width="7" height="14" fill="#000" fill-opacity=".13"/>');
  else if(m==='lona')pat=P(6,6,'<path d="M0 3H6M3 0V6" stroke="#000" stroke-opacity=".14" stroke-width=".9"/><path d="M0 .5H6M.5 0V6" stroke="#fff" stroke-opacity=".16" stroke-width=".6"/>');
  else if(m==='floral'){pat=P(40,44,'<g><circle cx="10" cy="10" r="4.2" fill="#fff" fill-opacity=".55"/><circle cx="10" cy="10" r="1.6" fill="#e6b34a"/><circle cx="29" cy="30" r="5" fill="#fff" fill-opacity=".45"/><circle cx="29" cy="30" r="1.8" fill="#e6b34a"/><path d="M16 17Q22 24 24 26M3 24Q8 28 6 36" stroke="#3f6b45" stroke-width="1.6" fill="none"/><ellipse cx="20" cy="22" rx="3.4" ry="1.6" fill="#3f6b45" fill-opacity=".8" transform="rotate(40 20 22)"/></g>');}
  var shine=m==='raso'?'<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".45"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".68" stop-color="#fff" stop-opacity=".30"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>':((m==='cuero'||m==='metal')?'<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset=".15" stop-color="#fff" stop-opacity=".34"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>':'');
  return '<svg viewBox="0 0 200 230" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><defs>'+pat+shine+'<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+lt+'"/><stop offset=".6" stop-color="'+hex+'"/><stop offset="1" stop-color="'+dk+'"/></linearGradient><radialGradient id="'+id+'v" cx=".5" cy=".5" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient></defs>'+
   '<rect width="200" height="230" fill="url(#'+id+'g)"/>'+(pat?'<rect width="200" height="230" fill="url(#'+id+'p)"/>':'')+extra+
   '<path d="M-10 118Q70 96 210 126L210 152Q70 122 -10 144Z" fill="#000" fill-opacity=".13"/><path d="M-10 118Q70 96 210 126" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.4"/>'+
   '<path d="M-10 126Q70 104 210 134" fill="none" stroke="'+th+'" stroke-width="2.2" stroke-dasharray="8 5" stroke-linecap="round"/><path d="M-10 136Q70 114 210 144" fill="none" stroke="'+th+'" stroke-width="2.2" stroke-dasharray="8 5" stroke-linecap="round"/>'+
   '<rect width="200" height="230" fill="url(#'+id+'v)"/></svg>';}
function shape(fam,cat,bk,S,F){var d='',fo='';
  var tee='M60 42L86 28Q100 44 114 28L140 42L170 76L150 94L142 84L142 178L58 178L58 84L50 94L30 76Z';
  var neck=bk?'M86 28Q100 35 114 28':'M86 28Q100 44 114 28';
  var L=function(p,x){return '<path d="'+p+'" fill="none" '+S+(x||'')+'/>';};
  if(fam==='rem-rib'){d='<path d="M64 40L86 28Q100 42 114 28L136 40L160 70L142 84L136 76L136 140L64 140L64 76L58 84L40 70Z" '+F+' '+S+'/>'+L(bk?'M86 28Q100 34 114 28':'M86 28Q100 42 114 28');fo='M76 84Q80 110 76 138M124 84Q120 108 124 138';}
  else if(cat==='nl-rem'){d='<path d="'+tee+'" '+F+' '+S+'/>'+L(neck)+L('M59 170H141',' stroke-dasharray="3 3" opacity=".55"');fo='M72 84Q80 130 74 170M128 84Q120 128 126 172M96 60Q102 110 98 150';}
  else if(cat==='nl-cam'){d='<path d="'+tee+'" '+F+' '+S+'/>'+(bk?L('M60 56Q100 68 140 56')+L('M100 66V178',' stroke-dasharray="2 4"')+L(neck):L('M100 40V178M86 28L100 52L114 28')+'<circle cx="106" cy="90" r="2" fill="'+mix('#000','#fff',.1)+'"/><circle cx="106" cy="120" r="2" fill="#111"/><circle cx="106" cy="150" r="2" fill="#111"/>');fo='M70 90Q78 130 72 172M130 90Q122 130 128 174';}
  else if(fam==='sho-den'||fam==='ber-hbe'){d='<path d="M62 52L138 52L148 130L108 130L100 92L92 130L52 130Z" '+F+' '+S+'/>'+L('M62 52H138V64H62Z')+(bk?L('M68 66L90 66L88 86L78 92L68 86Z')+L('M110 66L132 66L132 86L122 92L112 86Z'):L('M100 64V92')+L('M66 70Q78 84 88 78M134 70Q122 84 112 78'));fo='M70 70Q66 100 62 128M130 70Q134 100 138 128';}
  else if(cat==='nl-pan'){d='<path d="M62 36L138 36L148 208L108 208L100 90L92 208L52 208Z" '+F+' '+S+'/>'+L('M62 36H138V50H62Z')+(bk?L('M62 52Q100 66 138 52')+L('M68 70L92 70L90 100L80 106L70 100Z')+L('M108 70L132 70L130 100L120 106L110 100Z'):L('M100 50V90')+L('M64 56Q78 86 92 80M136 56Q122 86 108 80'));fo='M66 100Q60 150 56 204M134 100Q140 150 144 204M84 110Q82 160 86 204';}
  else if(fam==='pol-ple'){d='<path d="M70 62L130 62L168 206L32 206Z" '+F+' '+S+'/>'+L('M70 62H130V74H70Z')+L('M84 74L62 206M100 74V206M116 74L138 206',' opacity=".55"')+(bk?L('M100 62V84'):'');fo='M92 80L82 204M108 80L118 204';}
  else if(cat==='nl-ves'){d='<path d="M76 30L90 30Q100 '+(bk?'38':'44')+' 110 30L124 30L130 86L164 208L36 208L70 86Z" '+F+' '+S+'/>'+L('M70 86H130')+(bk?L('M100 38V86',' stroke-dasharray="2 3"'):'');fo='M84 90Q70 150 56 204M116 90Q130 150 144 204M100 92Q98 150 100 206';}
  else if(fam==='tap-pan'){d='<path d="M62 34L88 24Q100 '+(bk?'30':'38')+' 112 24L138 34L172 168L150 174L138 112L140 214L60 214L62 112L50 174L28 168Z" '+F+' '+S+'/>'+(bk?L('M100 34V214')+L('M100 150V214',' stroke-width="2.4"')+L('M88 24Q100 44 112 24'):L('M100 38V214')+'<circle cx="108" cy="90" r="3" fill="#111"/><circle cx="108" cy="130" r="3" fill="#111"/>');fo='M72 112Q70 160 70 210M128 112Q130 160 130 210';}
  else if(fam==='buz-can'){d='<path d="M62 36L88 26Q100 40 112 26L138 36L170 150L148 156L136 104L136 198L64 198L64 104L52 156L30 150Z" '+F+' '+S+'/>'+(bk?'<path d="M82 26Q100 76 118 26Q100 40 82 26Z" '+F+' '+S+'/>':L('M80 150H120L126 176H74Z')+L('M88 26L92 54M112 26L108 54')+L('M84 26Q100 44 116 26'));fo='M72 104Q72 150 70 196M128 104Q128 150 130 196';}
  else if(cat==='nl-abr'){d='<path d="M62 36L88 26Q100 40 112 26L138 36L170 150L148 156L136 104L136 198L64 198L64 104L52 156L30 150Z" '+F+' '+S+'/>'+(bk?L('M62 60Q100 72 138 60')+L('M100 72V198',' stroke-dasharray="2 4"')+L('M64 150H136'):L('M80 150H120L126 176H74Z')+L('M88 26L92 54M112 26L108 54'));fo='M72 104Q72 150 70 196M128 104Q128 150 130 196';}
  else if(fam==='gor-bei'||fam==='gor-tru'){d='<path d="M42 134Q40 62 104 58Q158 56 166 122L196 128Q200 142 176 142L42 142Z" '+F+' '+S+'/>'+L('M104 58V120')+L('M66 70Q60 100 62 134M142 66Q154 96 156 122')+'<circle cx="104" cy="58" r="4" fill="'+mix('#000','#fff',.1)+'"/>'+(fam==='gor-tru'?L('M96 70H128M96 82H128M96 94H128',' stroke-dasharray="2 3" opacity=".5"'):(bk?'':'<rect x="82" y="86" width="40" height="20" rx="2" fill="#fff" fill-opacity=".85" '+S+'/>'));fo='M48 130Q80 120 160 126';}
  else if(fam==='gor-lan'){d='<path d="M54 140Q50 60 100 56Q150 60 146 140Z" '+F+' '+S+'/><rect x="48" y="132" width="104" height="30" rx="3" '+F+' '+S+'/>'+L('M70 76V132M86 66V132M100 60V132M114 66V132M130 76V132',' opacity=".4"')+L('M52 140H148M52 150H148',' stroke-dasharray="3 3" opacity=".5"');fo='';}
  else if(cat==='nl-rel'){d='<path d="M84 40H116L122 84H78Z" '+F+' '+S+'/><path d="M78 140H122L116 184H84Z" '+F+' '+S+'/><circle cx="100" cy="112" r="36" '+F+' '+S+'/><circle cx="100" cy="112" r="28" fill="'+(fam==='rel-dig'?'#1a1a1a':'#f6f3ee')+'" '+S+'/>'+(fam==='rel-dig'?'<text x="100" y="118" text-anchor="middle" font-size="16" font-family="monospace" fill="#9fe8a8">10:09</text>':L('M100 112V92')+L('M100 112L114 120')+'<circle cx="100" cy="112" r="2.4" fill="#111"/>'+L('M100 86V90M100 134V138M74 112H78M122 112H126',' opacity=".6"'))+'<rect x="134" y="106" width="7" height="12" rx="2" '+F+' '+S+'/>'+L('M92 62H108M92 160H108',' opacity=".5"');fo='';}
  else if(fam==='ani-sel'||fam==='ani-fin'){d='<path fill-rule="evenodd" d="M52 126a48 48 0 1 0 96 0a48 48 0 1 0 -96 0ZM'+(fam==='ani-sel'?'66':'62')+' 126a'+(fam==='ani-sel'?'34':'38')+' '+(fam==='ani-sel'?'34':'38')+' 0 1 1 '+(fam==='ani-sel'?'68':'76')+' 0a'+(fam==='ani-sel'?'34':'38')+' '+(fam==='ani-sel'?'34':'38')+' 0 1 1 -'+(fam==='ani-sel'?'68':'76')+' 0Z" '+F+' '+S+'/>'+(fam==='ani-sel'?'<path d="M78 74H122L130 98H70Z" '+F+' '+S+'/>'+L('M84 80H116L122 94H78Z',' opacity=".55"'):'<circle cx="100" cy="78" r="7" fill="#fff" fill-opacity=".9" '+S+'/>');fo='';}
  else if(fam==='col-cad'){d='<path d="M38 52Q100 214 162 52L152 52Q100 188 48 52Z" '+F+' '+S+'/>'+L('M60 96L66 104M74 130L82 134M92 152L100 154M108 152L116 148M126 134L134 126M140 106L146 96',' opacity=".55"')+'<circle cx="100" cy="176" r="9" '+F+' '+S+'/>';fo='';}
  else if(fam==='pul-cue'){d='<path d="M46 96Q100 62 154 96L154 150Q100 184 46 150Z" '+F+' '+S+'/>'+L('M46 112Q100 78 154 112M46 128Q100 94 154 128M46 142Q100 108 154 142',' opacity=".5"')+'<rect x="88" y="102" width="26" height="30" rx="4" fill="'+mix('#c9c3b6','#fff',.5)+'" '+S+'/>';fo='';}
  else if(cat==='nl-len'){d=L('M96 112Q100 104 104 112')+'<ellipse cx="62" cy="116" rx="38" ry="31" '+F+' '+S+'/><ellipse cx="138" cy="116" rx="38" ry="31" '+F+' '+S+'/>'+L('M26 106L8 98M174 106L192 98')+L('M44 104Q58 96 74 104',' opacity=".5" stroke="#fff"')+L('M120 104Q134 96 150 104',' opacity=".5" stroke="#fff"');fo='';}
  else if(fam==='bil-cue'){d='<rect x="36" y="74" width="128" height="92" rx="9" '+F+' '+S+'/>'+L('M36 96H164')+L('M46 84H154',' stroke-dasharray="2 4" opacity=".55"')+(bk?'':'<rect x="120" y="116" width="30" height="22" rx="3" fill="'+mix('#c9c3b6','#fff',.5)+'" '+S+'/>');fo='M44 150Q42 120 48 100';}
  else if(fam==='acc-cin'){d='<path d="M14 98H186V122H14Z" '+F+' '+S+'/>'+(bk?'<circle cx="40" cy="110" r="2.5" fill="#111"/><circle cx="56" cy="110" r="2.5" fill="#111"/><circle cx="72" cy="110" r="2.5" fill="#111"/><circle cx="88" cy="110" r="2.5" fill="#111"/><circle cx="104" cy="110" r="2.5" fill="#111"/><circle cx="120" cy="110" r="2.5" fill="#111"/>':'<rect x="82" y="90" width="36" height="40" rx="4" fill="'+mix('#c9c3b6','#fff',.5)+'" '+S+'/><circle cx="150" cy="110" r="2.5" fill="#111"/><circle cx="162" cy="110" r="2.5" fill="#111"/>');fo='M20 104H180';}
  else if(fam==='acc-buf'){d='<path d="M52 40Q100 70 148 40L156 70Q100 100 44 70Z" '+F+' '+S+'/><path d="M118 82L136 188L108 188L96 90Z" '+F+' '+S+'/>'+L('M112 168H132M110 178H130')+L('M58 50Q100 78 142 50',' opacity=".5"');fo='M64 56Q100 80 138 56';}
  else if(fam==='acc-car'){d=L('M66 92Q100 14 134 92')+'<rect x="40" y="90" width="120" height="92" rx="10" '+F+' '+S+'/>'+(bk?L('M52 112H148',' stroke-dasharray="2 4"')+'<rect x="64" y="128" width="72" height="38" rx="5" fill="none" '+S+'/>':L('M40 118H160')+'<circle cx="100" cy="118" r="6" fill="'+mix('#c9c3b6','#fff',.5)+'" '+S+'/>');fo='M52 100Q50 140 56 178';}
  else if(cat==='nl-cal'){var z=bk?'transform="translate(200 0) scale(-1 1)"':'';d='<g '+z+'><path d="M26 150Q26 112 56 100L86 120Q128 124 164 142Q184 152 176 172L26 172Z" '+F+' '+S+'/>'+L('M26 172H176')+L('M86 120L96 108M100 126L110 112')+L('M30 164H174',' opacity=".5"')+'</g>';fo='';}
  else d='<path d="'+tee+'" '+F+' '+S+'/>';
  return{d:d,fo:fo};}
function garment(fam,hex,cat,view){view=view||'f';var id='g'+(++GID);
  if(view==='d')return detail(fam,hex,id);
  var dk=mix(hex,'#000000',.42),hi=mix(hex,'#ffffff',.24),lo=mix(hex,'#000000',.18);
  var S='stroke="'+dk+'" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"',F='fill="url(#'+id+'a)"';
  var sh=shape(fam,cat,view==='b',S,F);var wide=['nl-acc','nl-cal','nl-gor','nl-rel','nl-ani','nl-len'].indexOf(cat)>=0;
  var defs='<defs><linearGradient id="'+id+'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+hi+'"/><stop offset=".55" stop-color="'+hex+'"/><stop offset="1" stop-color="'+lo+'"/></linearGradient><radialGradient id="'+id+'r"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>';
  var folds=sh.fo?'<path d="'+sh.fo+'" fill="none" stroke="#000" stroke-opacity=".11" stroke-width="3.4" stroke-linecap="round"/><path d="'+sh.fo+'" transform="translate(3 0)" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.6" stroke-linecap="round"/>':'';
  return '<svg viewBox="0 0 200 230" role="img" aria-hidden="true">'+defs+'<ellipse cx="100" cy="'+(wide?'176':'222')+'" rx="'+(wide?'72':'58')+'" ry="5" fill="url(#'+id+'r)"/>'+sh.d+folds+'</svg>';}
/* ---- grilla por modelo ---- */
function photosFor(f,color){var ph=(D.photos||{})[f.id]||{};return(ph[color]||[]).concat(ph['*']||[]);}
function tile(f,opts){
  var first=f.colors.filter(function(c){return colorStock(f,c)>0;})[0]||f.colors[0],hex=colHex(first);var low=f.total>0&&f.total<=6;
  var rec=recFor(f.id),yt='';
  if(rec){var any=f.colors.some(function(c){return sizeInfo(f,c,rec.size).n>0;});yt='<span class="nl-yt">Tu talle '+esc(rec.size)+(any?'':' · agotado')+'</span>';}
  var dots=f.colors.slice(0,5).map(function(c){return '<i class="nl-dot" style="background:'+esc(colHex(c))+'" title="'+esc(colName(c))+'"></i>';}).join('');
  var szs=f.sizes.length>1?f.sizes[0]+' – '+f.sizes[f.sizes.length-1]:'Talle único';
  var b=f.total<=0?'<span class="nl-badge out">Sin stock</span>':(low?'<span class="nl-badge">Últimas unidades</span>':'');
  var ph=photosFor(f,first);var vis;
  if(ph.length)vis='<img class="nl-ph a" src="'+esc(ph[0])+'" alt="'+esc(f.name+', '+colName(first))+'" loading="lazy" decoding="async">'+(ph[1]?'<img class="nl-ph b" src="'+esc(ph[1])+'" alt="" loading="lazy" decoding="async">':'');
  else vis='<span class="nl-sv a">'+garment(f.id,hex,f.cat,'f')+'</span><span class="nl-sv b" data-lz="1"></span>';
  var vars=[];f.colors.forEach(function(c){f.sizes.forEach(function(s){if(sizeInfo(f,c,s).n>0)vars.push(c+':'+s);});});
  return '<button type="button" class="nl-tile" data-fam="'+esc(f.id)+'" data-price="'+f.price+'" data-o="'+ORDER.indexOf(f.id)+'" data-q="'+esc((f.name+' '+f.colors.map(colName).join(' ')+' '+tkCodes(f.id)).toLowerCase())+'" aria-label="'+esc(f.name+', desde '+money(f.price)+', '+f.colors.length+' colores')+'">'+
   '<span class="nl-vis'+(ph.length?' ph':'')+'">'+vis+b+yt+'<span class="ap-heart'+(apFav()[f.id]?' on':'')+'" role="button" tabindex="0" data-fam="'+esc(f.id)+'" aria-pressed="'+(!!apFav()[f.id])+'" aria-label="Guardar en favoritos">'+AP_ICO.heart+'</span></span><span class="nl-meta"><span class="nl-nm">'+esc(f.name)+'</span><span class="ap-pl"><span class="nl-pr">'+money(f.price)+'</span>'+apRateHtml(f.id)+'</span>'+
   '<span class="nl-dots">'+dots+(f.colors.length>5?'+':'')+'</span><span class="nl-szs">'+esc(szs)+'</span></span></button>';}
document.addEventListener('pointerenter',lazyBack,true);document.addEventListener('touchstart',lazyBack,{capture:true,passive:true});
function lazyBack(e){var t=e.target&&e.target.closest&&e.target.closest('.nl-tile');if(!t||t.__lz)return;t.__lz=1;var sp=t.querySelector('.nl-sv.b[data-lz]');if(!sp)return;var f=FAMS[t.getAttribute('data-fam')];if(!f)return;var first=f.colors.filter(function(c){return colorStock(f,c)>0;})[0]||f.colors[0];sp.innerHTML=garment(f.id,colHex(first),f.cat,'b');sp.removeAttribute('data-lz');}
var IO=null;
function reveal(root){var els=qa('.nl-tile:not(.in)',root);if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
  if(!IO)IO=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var i=en.target;setTimeout(function(){i.classList.add('in');},(parseInt(i.getAttribute('data-i'),10)||0)%6*60);IO.unobserve(i);}});},{rootMargin:'0px 0px -30px 0px'});
  els.forEach(function(e,i){e.setAttribute('data-i',i);IO.observe(e);});}
function paintGrid(){
  if(!build())return;document.body.classList.add('nl-on');
  qa('.nl-grid').forEach(function(g){g.remove();});
  qa('#catalogo-menu .section[data-cat]').forEach(function(sec){var cat=sec.getAttribute('data-cat');
    var ids=ORDER.filter(function(i){return FAMS[i].cat===cat;});if(!ids.length)return;
    var g=document.createElement('div');g.className='nl-grid';g.innerHTML=ids.map(function(i){return tile(FAMS[i]);}).join('');
    var head=q1('.section-head',sec);head&&head.parentNode?head.parentNode.insertBefore(g,head.nextSibling):sec.appendChild(g);
    var cnt=document.getElementById('count-'+cat);if(cnt)cnt.textContent=ids.length;});
  var all=document.getElementById('count-all');if(all)all.textContent=ORDER.length;
  reveal(document);brandName();meBtn();tkStrip();filtBar();apBuild();filterGrid();apOn();}
/* ---- filtros: color, talle, precio, stock y orden ---- */
var FS={fav:false,g:'all',cols:{},sizes:{},pmin:'',pmax:'',stock:false,sort:''};try{FS.g=localStorage.getItem('nl.g')||'all';if(['all','m','h'].indexOf(FS.g)<0)FS.g='all';}catch(e){}
var GEN=[['all','Todo'],['m','Mujer'],['h','Hombre']];
var PRESETS=[['Hasta $15.000',0,15000],['$15.000 a $30.000',15000,30000],['$30.000 a $50.000',30000,50000],['Más de $50.000',50000,0]];
function genOk(f){var g=(f.def&&f.def.g)||'m';return FS.g==='all'||g==='u'||g===FS.g;}
function famOk(f,skip){
  if(!genOk(f))return false;if(FS.fav&&!apFav()[f.id])return false;
  var cs=Object.keys(FS.cols),zs=Object.keys(FS.sizes),v=[];
  f.colors.forEach(function(c){f.sizes.forEach(function(s){if(sizeInfo(f,c,s).n>0)v.push([c,s]);});});
  if(FS.stock&&!v.length)return false;
  if(cs.length||zs.length){if(!v.some(function(x){return(!cs.length||FS.cols[x[0]])&&(!zs.length||FS.sizes[x[1]]);}))return false;}
  var lo=parseFloat(FS.pmin)||0,hi=parseFloat(FS.pmax)||Infinity;if(f.price<lo||f.price>hi)return false;return true;}
function nFilters(){return Object.keys(FS.cols).length+Object.keys(FS.sizes).length+((FS.pmin||FS.pmax)?1:0)+(FS.stock?1:0);}
function filterGrid(){
  var term=((q1('#search-input')||{}).value||'').trim().toLowerCase();var chip=q1('.cat-chip.active');var act=chip?chip.getAttribute('data-cat'):'all';
  var anyVis=false,total=0,cnt={},all=0;
  qa('#catalogo-menu .section[data-cat]').forEach(function(sec){var g=q1('.nl-grid',sec);if(!g)return;var vis=0;
    var tiles=qa('.nl-tile',g);
    tiles.sort(function(a,b){var pa=+a.getAttribute('data-price'),pb=+b.getAttribute('data-price');
      if(FS.sort==='pa')return pa-pb;if(FS.sort==='pd')return pb-pa;
      if(FS.sort==='az')return a.getAttribute('data-q')<b.getAttribute('data-q')?-1:1;
      return(+a.getAttribute('data-o'))-(+b.getAttribute('data-o'));});
    tiles.forEach(function(t){g.appendChild(t);var f=FAMS[t.getAttribute('data-fam')];var ok=(!term||t.getAttribute('data-q').indexOf(term)>=0)&&famOk(f);t.style.display=ok?'':'none';if(ok)vis++;});
    var c=sec.getAttribute('data-cat');cnt[c]=vis;all+=vis;
    var show=(act==='all'||act===c)&&vis>0;sec.style.display=show?'':'none';if(show){anyVis=true;total+=vis;}});
  qa('.cat-chip[data-cat]').forEach(function(ch){var c=ch.getAttribute('data-cat');var n=c==='all'?all:(cnt[c]||0);var e=document.getElementById('count-'+c);if(e)e.textContent=n;ch.style.display=(c==='all'||n>0)?'':'none';});
  if(act!=='all'&&!(cnt[act]>0)){var al=q1('.cat-chip[data-cat="all"]');if(al){al.click();return;}}
  var em=document.getElementById('search-empty');if(em){em.style.display=(!anyVis&&(term||nFilters()))?'block':'none';}
  var emp=q1('#nl-none');if(emp){emp.style.display=(!anyVis&&(term||nFilters()))?'block':'none';}
  var r=q1('#nl-res');if(r)r.textContent=total+(total===1?' producto':' productos');
  var c2=q1('#nl-fcnt');if(c2){c2.textContent=nFilters();c2.style.display=nFilters()?'':'none';}
  qa('.nl-gb').forEach(function(b){var on=b.getAttribute('data-g')===FS.g;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);});
  paintActive();try{apSync();}catch(e){}}
function paintActive(){var w=q1('#nl-act');if(!w)return;var h='';
  Object.keys(FS.cols).forEach(function(c){h+='<button type="button" class="nl-fc" data-k="c" data-v="'+esc(c)+'">'+esc(colName(c))+' <span aria-hidden="true">✕</span><span class="nl-sr"> quitar filtro</span></button>';});
  Object.keys(FS.sizes).forEach(function(s){h+='<button type="button" class="nl-fc" data-k="s" data-v="'+esc(s)+'">Talle '+esc(s)+' <span aria-hidden="true">✕</span><span class="nl-sr"> quitar filtro</span></button>';});
  if(FS.pmin||FS.pmax){var lo=parseFloat(FS.pmin)||0,hi=parseFloat(FS.pmax)||0;h+='<button type="button" class="nl-fc" data-k="p">'+(lo&&hi?money(lo)+' a '+money(hi):(hi?'Hasta '+money(hi):'Desde '+money(lo)))+' <span aria-hidden="true">✕</span><span class="nl-sr"> quitar filtro</span></button>';}
  if(FS.stock)h+='<button type="button" class="nl-fc" data-k="t">Solo con stock <span aria-hidden="true">✕</span><span class="nl-sr"> quitar filtro</span></button>';
  w.innerHTML=h;}
function filtBar(){var old=q1('.nl-tools');if(old)old.remove();var anchor=q1('#cat-filter');if(!anchor||!D)return;
  var d=document.createElement('div');d.className='nl-tools';
  d.innerHTML='<div class="nl-gen" role="tablist" aria-label="Sección de la tienda">'+GEN.map(function(x){return '<button type="button" class="nl-gb" role="tab" data-g="'+x[0]+'" aria-selected="false">'+x[1]+' <small id="nl-gc-'+x[0]+'"></small></button>';}).join('')+'</div><div class="nl-trow"><button type="button" class="nl-fbtn" id="nl-fopen" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>Filtrar <b id="nl-fcnt" style="display:none">0</b></button>'+
   '<label class="nl-sort"><span class="nl-sr">Ordenar por</span><select id="nl-sortsel"><option value="">Novedades</option><option value="pa">Menor precio</option><option value="pd">Mayor precio</option><option value="az">A – Z</option></select></label><span class="nl-res" id="nl-res" role="status" aria-live="polite"></span></div><div class="nl-acts" id="nl-act"></div><p class="nl-none" id="nl-none" style="display:none">No hay productos con esos filtros. <button type="button" class="nl-link" id="nl-fclr0">Limpiar filtros</button></p>';
  var tb=q1('#toolbar'),me=q1('.nl-me');var ref=me||tb;ref.parentNode.insertBefore(d,ref.nextSibling);
  q1('.nl-gen').addEventListener('click',function(e){var b=e.target.closest('.nl-gb');if(!b)return;FS.g=b.getAttribute('data-g');try{localStorage.setItem('nl.g',FS.g);}catch(x){}filterGrid();genCounts();say('Sección '+b.textContent.trim());});
  q1('#nl-fopen').addEventListener('click',openFilter);genCounts();
  q1('#nl-sortsel').value=FS.sort;q1('#nl-sortsel').addEventListener('change',function(){FS.sort=this.value;filterGrid();});
  q1('#nl-act').addEventListener('click',function(e){var b=e.target.closest('.nl-fc');if(!b)return;var k=b.getAttribute('data-k'),v=b.getAttribute('data-v');
    if(k==='c')delete FS.cols[v];else if(k==='s')delete FS.sizes[v];else if(k==='p'){FS.pmin='';FS.pmax='';}else FS.stock=false;filterGrid();});
  q1('#nl-fclr0').addEventListener('click',function(){clearFilters();filterGrid();});}
function genCounts(){var save=FS.g,n={all:0,m:0,h:0};ORDER.forEach(function(i){var f=FAMS[i],g=(f.def&&f.def.g)||'m';n.all++;if(g==='u'){n.m++;n.h++;}else n[g]++;});['all','m','h'].forEach(function(k){var e=q1('#nl-gc-'+k);if(e)e.textContent=n[k];});}
function clearFilters(){FS.cols={};FS.sizes={};FS.pmin='';FS.pmax='';FS.stock=false;}
function allColors(){var o=[],s={};ORDER.forEach(function(i){FAMS[i].colors.forEach(function(c){if(!s[c]){s[c]=1;o.push(c);}});});return o;}
function allSizes(){var o=[],s={};['XS','S','M','L','XL','XXL','36','38','40','42','44','46','48','35','37','39','41','43','45','U'].forEach(function(z){ORDER.some(function(i){return FAMS[i].sizes.indexOf(z)>=0;})&&!s[z]&&(s[z]=1,o.push(z));});return o;}
function countMatch(){var n=0;ORDER.forEach(function(i){if(famOk(FAMS[i]))n++;});return n;}
function paintFilter(){var w=q1('#nl-filter .fb');if(!w)return;
  w.innerHTML='<div class="fh"><h3>Filtrar</h3><button type="button" class="nl-x" id="nl-fx" aria-label="Cerrar filtros">✕</button></div>'+
   '<div class="fs"><div class="nl-lbl">Color</div><div class="fsw" role="group" aria-label="Color">'+allColors().map(function(c){return '<button type="button" class="nl-fsw'+(FS.cols[c]?' on':'')+'" data-c="'+esc(c)+'" aria-pressed="'+(!!FS.cols[c])+'" title="'+esc(colName(c))+'"><i style="background:'+esc(colHex(c))+'"></i><span>'+esc(colName(c))+'</span></button>';}).join('')+'</div></div>'+
   '<div class="fs"><div class="nl-lbl">Talle</div><div class="fsz" role="group" aria-label="Talle">'+allSizes().map(function(s){return '<button type="button" class="nl-chip'+(FS.sizes[s]?' on':'')+'" data-s="'+esc(s)+'" aria-pressed="'+(!!FS.sizes[s])+'">'+esc(s)+'</button>';}).join('')+'</div></div>'+
   '<div class="fs"><div class="nl-lbl">Precio</div><div class="fpr" role="group" aria-label="Precio">'+PRESETS.map(function(p,i){var on=(String(p[1]||'')===String(FS.pmin||'')&&String(p[2]||'')===String(FS.pmax||'')&&(FS.pmin||FS.pmax));return '<button type="button" class="nl-chip wide'+(on?' on':'')+'" data-p="'+i+'" aria-pressed="'+!!on+'">'+esc(p[0])+'</button>';}).join('')+'</div>'+
   '<div class="fmm"><label>Mínimo<input type="number" inputmode="numeric" min="0" id="nl-pmin" placeholder="$ 0" value="'+esc(FS.pmin)+'"></label><label>Máximo<input type="number" inputmode="numeric" min="0" id="nl-pmax" placeholder="Sin tope" value="'+esc(FS.pmax)+'"></label></div></div>'+
   '<label class="fsk"><input type="checkbox" id="nl-fstock"'+(FS.stock?' checked':'')+'> <span>Mostrar solo productos con stock</span></label>'+
   '<div class="ff"><button type="button" class="nl-btn ghost" id="nl-fclr">Limpiar</button><button type="button" class="nl-btn full" id="nl-fok">Ver <span id="nl-fn">'+countMatch()+'</span> productos</button></div>';
  var upd=function(){var e=q1('#nl-fn');if(e)e.textContent=countMatch();filterGrid();};
  q1('#nl-fx').addEventListener('click',closeFilter);q1('#nl-fok').addEventListener('click',closeFilter);
  q1('#nl-fclr').addEventListener('click',function(){clearFilters();paintFilter();filterGrid();});
  qa('.nl-fsw',w).forEach(function(b){b.addEventListener('click',function(){var c=b.getAttribute('data-c');if(FS.cols[c])delete FS.cols[c];else FS.cols[c]=1;b.classList.toggle('on');b.setAttribute('aria-pressed',!!FS.cols[c]);upd();});});
  qa('.fsz .nl-chip',w).forEach(function(b){b.addEventListener('click',function(){var s=b.getAttribute('data-s');if(FS.sizes[s])delete FS.sizes[s];else FS.sizes[s]=1;b.classList.toggle('on');b.setAttribute('aria-pressed',!!FS.sizes[s]);upd();});});
  qa('.fpr .nl-chip',w).forEach(function(b){b.addEventListener('click',function(){var p=PRESETS[+b.getAttribute('data-p')];var same=String(p[1]||'')===String(FS.pmin||'')&&String(p[2]||'')===String(FS.pmax||'');if(same){FS.pmin='';FS.pmax='';}else{FS.pmin=p[1]?String(p[1]):'';FS.pmax=p[2]?String(p[2]):'';}paintFilter();filterGrid();});});
  q1('#nl-pmin').addEventListener('input',function(){FS.pmin=this.value;upd();});q1('#nl-pmax').addEventListener('input',function(){FS.pmax=this.value;upd();});
  q1('#nl-fstock').addEventListener('change',function(){FS.stock=this.checked;upd();});}
function openFilter(){var m=q1('#nl-filter');if(!m)return;paintFilter();m.classList.add('open');document.documentElement.style.overflow='hidden';setTimeout(function(){var x=q1('#nl-fx');x&&x.focus();},50);}
function closeFilter(){var m=q1('#nl-filter');if(!m)return;m.classList.remove('open');if(!ST.open)document.documentElement.style.overflow='';var b=q1('#nl-fopen');b&&b.focus({preventScroll:true});}
/* ---- botón Mis medidas ---- */
/* ---- «Visto en TikTok» (videos de ejemplo con código) y cupón de bienvenida ---- */
function tkList(){return((D&&D.tk)||[]).filter(function(v){return FAMS[v.fam];});}
function tkCodes(fam){return tkList().filter(function(v){return v.fam===fam;}).map(function(v){return v.code;}).join(' ');}
function fmtK(n){return n>=1e6?(n/1e6).toFixed(1).replace('.0','')+' M':(n>=1e3?Math.round(n/1e3)+' mil':String(n));}
function tkStrip(){var old=q1('.nl-tk');if(old)old.remove();var anchor=q1('#toolbar');if(!anchor||!D)return;var L=tkList();if(!L.length)return;
  var w=document.createElement('section');w.className='nl-tk';w.setAttribute('aria-label','Visto en TikTok');
  var cp=D.welcome||{};
  var h='<div class="nl-wel"><div><b>Bienvenido/a desde TikTok</b><span>'+esc(cp.txt||'10 % en tu primer pedido con el código')+'</span></div><button type="button" class="nl-wcp" data-code="'+esc(cp.code||'')+'">'+esc(cp.code||'')+' <small>Copiar</small></button></div>';
  h+=(mayTiers().length?'<p class="nl-may"><b>Compra por mayor</b> · '+mayTiers().map(function(t){return 'desde '+money(t.min)+' −'+t.pct+' %';}).join(' · ')+'</p>':'');h+='<div class="nl-tkh"><h2>Visto en TikTok</h2><small>Buscá el código del video en el buscador</small></div><div class="nl-tkr" role="list">';
  L.forEach(function(v){var f=FAMS[v.fam];var first=f.colors.filter(function(c){return colorStock(f,c)>0;})[0]||f.colors[0];
    h+='<button type="button" class="nl-tkc" role="listitem" data-fam="'+esc(v.fam)+'" aria-label="'+esc(v.title+', video '+v.code+', '+f.name)+'"><span class="nl-tkv">'+garment(v.fam,colHex(first),f.cat,'f')+'<i class="nl-play" aria-hidden="true"></i><em>'+esc(v.code)+'</em><b>'+fmtK(v.views)+' vistas</b></span><span class="nl-tkt">'+esc(v.title)+'</span><span class="nl-tkp">'+esc(f.name)+' · '+money(f.price)+'</span></button>';});
  h+='</div><p class="nl-tkn">Videos y cifras de ejemplo.</p>';
  w.innerHTML=h;anchor.parentNode.insertBefore(w,anchor);
  qa('.nl-tkc',w).forEach(function(b){b.addEventListener('click',function(){openPDP(b.getAttribute('data-fam'),b);});});
  var bt=q1('.nl-wcp',w);bt&&bt.addEventListener('click',function(){var c=bt.getAttribute('data-code');try{navigator.clipboard.writeText(c);}catch(e){}var i=q1('#cp-coupon-in');if(i)i.value=c;flash('Código '+c+' copiado');});}
function brandName(){var lg=q1('header .logo');if(!lg||q1('.nl-brand'))return;var d=document.createElement('div');d.className='nl-brand';d.innerHTML='<b>ACCESORIOS PARA ELLOS</b><small>Accesorios y moda · Hombre y mujer</small>';lg.parentNode.insertBefore(d,lg.nextSibling);}
/* ---- precio mayorista por importe en el carrito ---- */
function mayTiers(){return((D&&D.may)||[]).slice().sort(function(a,b){return a.min-b.min;});}
function mayHit(total){var hit=null,next=null;mayTiers().forEach(function(t){if(total>=t.min)hit=t;else if(!next)next=t;});return{hit:hit,next:next};}
function mayRender(total){var old=q1('#cp-may-row');if(old)old.remove();total=+total||0;var m=mayHit(total),h='';
  if(m.hit)h='<span>Precio mayorista −'+m.hit.pct+' % (se confirma en el local)</span><span>'+money(total*(1-m.hit.pct/100))+'</span>';
  else if(total>0&&m.next)h='<span>Compra por mayor: sumá '+money(m.next.min-total)+' y tenés −'+m.next.pct+' %</span><span></span>';
  if(!h)return;var r=document.createElement('div');r.id='cp-may-row';r.className='cp-total-row disc';r.innerHTML=h;var tr=q1('.cp-total-row');if(tr)tr.parentNode.insertBefore(r,tr.nextSibling);}
function mayWire(){var a=window.RAVE_COUPON_RENDER,l=window.RAVE_COUPON_LINES;if(!a||a.__may)return;
  window.RAVE_COUPON_RENDER=function(t){a(t);mayRender(t);};window.RAVE_COUPON_RENDER.__may=1;
  window.RAVE_COUPON_LINES=function(lines,t){if(l)l(lines,t);var m=mayHit(+t||0);if(m.hit)lines.push('Compra por mayor: −'+m.hit.pct+' % (no se acumula con cupón; se confirma en el local)');};}
function meBtn(){var old=q1('.nl-me');if(old)old.remove();var anchor=q1('#cat-filter');if(!anchor)return;
  var b=document.createElement('button');b.type='button';b.className='nl-me';var have=Object.keys(mNum()).length>1;
  b.innerHTML='Mis medidas <small>'+(have?'· cargadas, ver talles':'· encontrá tu talle')+'</small>';b.addEventListener('click',function(){openMe(null);});
  var tb=q1('#toolbar');tb.parentNode.insertBefore(b,tb.nextSibling);}
/* ---- ficha de producto ---- */
var ST={fam:'',color:'',size:'',tab:'p',open:false,last:null},pdp,sticky,meBox,live;
function mk(){
  pdp=document.createElement('div');pdp.id='nl-pdp';pdp.setAttribute('role','dialog');pdp.setAttribute('aria-modal','true');pdp.setAttribute('aria-label','Ficha de producto');
  sticky=document.createElement('div');sticky.className='nl-sticky';
  meBox=document.createElement('div');meBox.id='nl-me';meBox.setAttribute('role','dialog');meBox.setAttribute('aria-modal','true');meBox.setAttribute('aria-label','Mis medidas');
  live=document.createElement('div');live.className='nl-sr';live.setAttribute('role','status');live.setAttribute('aria-live','polite');
  document.body.appendChild(pdp);document.body.appendChild(sticky);document.body.appendChild(meBox);document.body.appendChild(live);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(Z.open)closeZoom();else if(q1('#nl-filter.open'))closeFilter();else if(meBox.classList.contains('open'))closeMe();else if(ST.open)closePDP();}});}
function say(t){if(live){live.textContent='';setTimeout(function(){live.textContent=t;},30);}}
/* ---- WhatsApp, medios de pago y envío ---- */
function waUrl(){var n=(D&&D.wa)||window.RAVE_WA||'5493874484132';var t='Hola Urban! Tengo una consulta sobre la tienda.';
  if(ST.open&&FAMS[ST.fam]){var f=FAMS[ST.fam];t='Hola Urban! Quiero consultar por '+f.name+' ('+colName(ST.color)+(ST.size?', talle '+ST.size:'')+'). ¿Tienen stock?';}
  return 'https://wa.me/'+String(n).replace(/\D/g,'')+'?text='+encodeURIComponent(t);}
function updWa(){var a=q1('#nl-wa');if(a)a.href=waUrl();var b=q1('#nl-pwa');if(b)b.href=waUrl();}
function payLine(price){var p=D.pay;if(!p)return '';var h='',c=p.cuotas||{};
  if(c.on&&c.max>1){if(c.si>1){h+='<b>'+c.si+' cuotas sin interés de '+money(price/c.si)+'</b>'+(c.max>c.si?' · hasta '+c.max+' cuotas con tarjeta':'');}else h+='<b>Hasta '+c.max+' cuotas con tarjeta</b>';}
  var m=(p.methods||[]).slice();if(p.cash)m.push('Efectivo en el local');
  return '<div class="nl-pay">'+h+(m.length?'<span class="nl-pm">'+m.map(esc).join(' · ')+'</span>':'')+'</div>';}
var KGC={'nl-rem':.3,'nl-cam':.35,'nl-pan':.7,'nl-ves':.5,'nl-abr':1.2,'nl-acc':.3,'nl-gor':.2,'nl-rel':.3,'nl-ani':.1,'nl-len':.2,'nl-cal':1};
function shipUI(root,o){var id='sq'+(++GID);var cp='';try{cp=localStorage.getItem('nl.cp')||'';}catch(e){}
  root.innerHTML='<div class="nl-sq"><label class="nl-sqlab" for="'+id+'">Calculá el envío · código postal</label><div class="nl-sqrow"><input id="'+id+'" type="text" inputmode="numeric" maxlength="8" placeholder="Ej. 4400" autocomplete="postal-code" value="'+esc(cp)+'"><button type="button" class="nl-btn sm">Calcular</button></div><div class="nl-sqres" role="status" aria-live="polite"></div></div>';
  var inp=root.querySelector('input'),res=root.querySelector('.nl-sqres'),btn=root.querySelector('button');
  function go(){var v=inp.value.trim();var p=P();var r=p&&p.ship?p.ship(v,o.kg(),o.total()):null;
    if(!r){res.innerHTML='<p class="nl-sub">El cotizador no está disponible.</p>';return;}
    if(r.err){res.innerHTML='<p class="nl-err">⚠ '+esc(r.err)+'</p>';o.pick&&o.pick(null);return;}
    try{localStorage.setItem('nl.cp',v);}catch(e){}
    res.innerHTML=(r.zone?'<p class="nl-sub">Destino: <b>'+esc(r.zone)+'</b></p>':'')+'<div class="nl-so" role="'+(o.pick?'radiogroup':'list')+'" aria-label="Opciones de entrega">'+r.opts.map(function(x,i){var pr=x.price===0?(x.id==='retiro'?'Gratis':'¡Gratis!'):money(x.price);
      return(o.pick?'<label class="nl-op"><input type="radio" name="'+id+'o" value="'+i+'"> ':'<div class="nl-op">')+'<span class="t"><b>'+esc(x.carrier)+'</b>'+(x.svc?' · '+esc(x.svc):'')+'<small>'+esc(x.days)+(x.id==='retiro'?'':' días hábiles')+'</small></span><span class="p">'+pr+'</span>'+(o.pick?'</label>':'</div>');}).join('')+'</div><p class="nl-sub">Tarifas de ejemplo: el comercio confirma el costo final por WhatsApp.</p>';
    if(o.pick){qa('input[type=radio]',res).forEach(function(rd){rd.addEventListener('change',function(){o.pick(r.opts[+rd.value],v);});});o.pick(null);}}
  btn.addEventListener('click',go);inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();go();}});
  if(cp&&o.auto)go();}

function openPDP(fam,from){var f=FAMS[fam];if(!f)return;ST.fam=fam;ST.last=from||document.activeElement;
  var rec=recFor(fam);
  ST.color=f.colors.filter(function(c){return colorStock(f,c)>0;})[0]||f.colors[0];ST.size=f.sizes.length===1?f.sizes[0]:'';ST.tab='p';ST.slide=0;ST.open=true;
  var hasPh=photosFor(f,ST.color).length>0;
  pdp.innerHTML='<div class="nl-in"><div class="nl-bar"><button type="button" class="nl-x" id="nl-back" aria-label="Volver a la tienda">←</button><span class="nl-crumb">Tienda / '+esc(catName(f.cat))+' / '+esc(f.name)+'</span><button type="button" class="nl-x" id="nl-sh" aria-label="Compartir">↗</button></div>'+
   '<div class="nl-colL"><div class="nl-gal" id="nl-gal"><div class="nl-sk"></div></div></div>'+
   '<div class="nl-body"><div class="ap-brand">'+apBrandName()+'</div><h2 class="nl-h">'+esc(f.name)+'</h2><div class="ap-prow"><p class="nl-price" id="nl-pr">'+money(f.price)+'</p>'+apRateHtml(f.id,true)+'</div><p class="ap-desc">'+esc(apDesc(f))+'</p><div class="ap-feat">'+AP_FEAT.map(function(x){return '<span>'+AP_ICO[x[0]]+'<em>'+x[1]+'</em></span>';}).join('')+'</div>'+payLine(f.price)+'<p class="nl-sub">Precios con impuestos incluidos.'+(hasPh?'':' Imágenes ilustrativas.')+'</p>'+
   (f.colors.length>1?'<div class="nl-lbl">Color <span id="nl-cn"></span></div><div class="nl-sws" role="radiogroup" aria-label="Color" id="nl-sws"></div>':'<div class="nl-lbl">Color <span>'+esc(colName(f.colors[0]))+'</span></div>')+
   (f.sizes.length>1?'<div class="nl-lbl">Talle <button type="button" class="nl-link" id="nl-gol">Ver tabla de medidas</button></div><div class="nl-sizes" role="radiogroup" aria-label="Talle" id="nl-szs"></div><div id="nl-sznote"></div>':'')+
   (f.sizes.length>1?'<details id="nl-guide" class="nl-gd" open><summary>Tabla de medidas (en cm)</summary><div class="pnl" id="nl-gt"></div></details>':'')+
   ((f.def&&f.def.dims&&f.def.dims.length)?'<button type="button" class="nl-btn ghost full" id="nl-find" style="margin-top:14px">'+(rec?'Ajustar mis medidas':'¿Qué talle soy? Cargá tus medidas')+'</button>'+
   '<div class="nl-lbl">Cómo calza <span class="nl-ex">EJEMPLO</span></div><div class="nl-fb" id="nl-fb"></div>':'')+
   '<a class="nl-btn ghost full nl-wab" id="nl-pwa" target="_blank" rel="noopener noreferrer" href="#"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.8-4.5-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.4 0 .3 0 .9-.2 1.3z"/></svg> Consultar talle o stock por WhatsApp</a>'+
   '<div class="nl-acc"><details open><summary>Envíos y cambios</summary><div class="pnl"><div id="nl-shipq"></div><p style="margin-top:10px">Retiro en el local o envío por Andreani / Correo Argentino. Envío bonificado desde '+money(D.free)+' (ejemplo). Cambios por talle según la política del local (ejemplo).</p></div></details>'+
   (AP_ACC.indexOf(f.cat)>=0?'<details><summary>Cuidado del producto</summary><div class="pnl">Evitá el contacto con perfumes, cremas y agua salada. Guardalo en un lugar seco (texto de ejemplo).</div></details></div>':'<details><summary>Cuidado del producto</summary><div class="pnl">Lavar del revés con agua fría. No usar secadora. Planchar a temperatura media (texto de ejemplo).</div></details></div>')+
   '<div class="nl-lbl">Combina con</div><div class="nl-look" id="nl-look"></div></div></div>';
  pdp.classList.add('open');sticky.classList.add('show');pdp.scrollTop=0;document.documentElement.style.overflow='hidden';
  q1('#nl-back').addEventListener('click',closePDP);q1('#nl-sh').addEventListener('click',share);
  var sw=q1('#nl-sws');sw&&sw.addEventListener('click',function(e){var b=e.target.closest('.nl-sw');if(!b)return;ST.color=b.getAttribute('data-c');paintColors();paintSizes();paintGal(true);paintCTA();updWa();});
  var sz=q1('#nl-szs');sz&&sz.addEventListener('click',function(e){var b=e.target.closest('.nl-chip');if(!b)return;ST.size=b.getAttribute('data-s');paintSizes();paintGal(true);paintCTA();paintGuide();updWa();buzz();say('Talle '+ST.size+(b.classList.contains('out')?', agotado':''));});
  var gol=q1('#nl-gol');gol&&gol.addEventListener('click',function(){var g=q1('#nl-guide');g.open=true;g.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});});
  var fd=q1('#nl-find');fd&&fd.addEventListener('click',function(){openMe(fam);});
  q1('#nl-look').addEventListener('click',function(e){var t=e.target.closest('.nl-tile');if(t)openPDP(t.getAttribute('data-fam'),ST.last);});
  shipUI(q1('#nl-shipq'),{kg:function(){return Math.max(1,Math.ceil(KGC[f.cat]||.5));},total:function(){return f.price;},auto:true});
  paintColors();paintSizes();paintFb();paintGuide();paintLook();paintCTA();updWa();
  setTimeout(function(){paintGal(false);},RM?0:200);
  setTimeout(function(){try{q1('#nl-back').focus({preventScroll:true});}catch(e){}},60);}
function catName(c){var h=q1('.section[data-cat="'+c+'"] .section-head h2');return h?h.textContent:'Tienda';}
function closePDP(){ST.open=false;closeZoom();pdp.classList.remove('open');sticky.classList.remove('show');document.documentElement.style.overflow='';updWa();try{ST.last&&ST.last.focus&&ST.last.focus({preventScroll:true});}catch(e){}}
function buzz(){try{navigator.vibrate&&navigator.vibrate(10);}catch(e){}}
function share(){var t=FAMS[ST.fam].name+' · Urban';try{if(navigator.share){navigator.share({title:t,url:location.href});return;}}catch(e){}try{navigator.clipboard.writeText(location.href);}catch(e){}flash('Enlace copiado');}
function flash(t){var el=document.getElementById('rv-toast');if(el){el.textContent=t;el.classList.add('show');clearTimeout(flash._t);flash._t=setTimeout(function(){el.classList.remove('show');},2200);}say(t);}
/* ---- galería: fotos reales (si se cargaron) o vistas de estudio, en carrusel con miniaturas y zoom ---- */
function slidesFor(f){var s=[],ph=photosFor(f,ST.color),m=mNum(),p=P();
  if(ph.length){ph.forEach(function(u,i){s.push({k:'ph',l:'Foto '+(i+1),t:'<img src="'+esc(u)+'" alt="'+esc(f.name+', '+colName(ST.color)+', foto '+(i+1))+'" draggable="false">'});});}
  else{var hex=colHex(ST.color);
    s.push({k:'f',l:'Frente',t:garment(f.id,hex,f.cat,'f')});s.push({k:'b',l:'Espalda',t:garment(f.id,hex,f.cat,'b')});
    s.push({k:'d',l:'Detalle',t:garment(f.id,hex,f.cat,'d'),cap:(AP_ACC.indexOf(f.cat)>=0?'Material · ':'Detalle de la tela · ')+matName(f.id)+' (ejemplo)'});}
  if(p&&f.def.dims&&f.def.dims.length&&f.def.g!=='h'){var sz=ST.size||(recFor(f.id)||{}).size||f.sizes[Math.floor(f.sizes.length/2)];
    s.push({k:'v',l:'En el cuerpo',t:p.avatar(f.id,ST.color,sz,m),cap:(Object.keys(m).length>1?'Con tus medidas':'Medidas de referencia')+' · talle '+sz});}
  var v=(D.video||{})[f.id];if(v)s.push({k:'vd',l:'Video',t:'<video src="'+esc(v)+'" controls playsinline muted loop preload="metadata" aria-label="Video de '+esc(f.name)+'"></video>'});
  return s;}
function paintGal(anim){var g=q1('#nl-gal');if(!g||!ST.open)return;var f=FAMS[ST.fam];var S=slidesFor(f);ST.slides=S;var idx=Math.max(0,Math.min(ST.slide||0,S.length-1));ST.slide=idx;
  g.innerHTML='<div class="nl-slides" id="nl-sl" tabindex="0" role="region" aria-roledescription="carrusel" aria-label="Imágenes de '+esc(f.name)+'">'+
   S.map(function(s,i){return '<figure class="nl-slide'+(s.k==='v'?' av':'')+(s.k==='ph'?' ph':'')+'" data-i="'+i+'" data-k="'+s.k+'" aria-label="'+esc(s.l+', '+(i+1)+' de '+S.length)+'">'+s.t+(s.cap?'<figcaption>'+esc(s.cap)+'</figcaption>':'')+(s.k!=='vd'?'<span class="nl-zh" aria-hidden="true">⤢ Tocá para ampliar</span>':'')+'</figure>';}).join('')+'</div>'+
   (S.length>1?'<button type="button" class="nl-arr l" id="nl-pv" aria-label="Imagen anterior">‹</button><button type="button" class="nl-arr r" id="nl-nx" aria-label="Imagen siguiente">›</button>':'')+
   '<div class="nl-thumbs" role="tablist" aria-label="Elegir imagen">'+S.map(function(s,i){var inner=(s.k==='ph'||s.k==='f'||s.k==='b'||s.k==='d')?s.t.replace(/<figcaption.*$/,''):'<span class="nl-tl">'+(s.k==='v'?'Cuerpo':'Video')+'</span>';
     return '<button type="button" class="nl-th'+(i===idx?' on':'')+'" role="tab" aria-selected="'+(i===idx)+'" data-i="'+i+'" aria-label="'+esc(s.l)+'"><span class="tc">'+inner+'</span><small>'+esc(s.l)+'</small></button>';}).join('')+'</div>';
  var sl=q1('#nl-sl');sl.scrollLeft=idx*sl.clientWidth;var tm=0;
  function go(i,smooth){i=Math.max(0,Math.min(S.length-1,i));sl.scrollTo({left:i*sl.clientWidth,behavior:(smooth&&!RM)?'smooth':'auto'});}
  sl.addEventListener('scroll',function(){clearTimeout(tm);tm=setTimeout(function(){var i=Math.round(sl.scrollLeft/(sl.clientWidth||1));if(i!==ST.slide){ST.slide=i;qa('.nl-th',g).forEach(function(t,k){t.classList.toggle('on',k===i);t.setAttribute('aria-selected',k===i);});}},60);});
  qa('.nl-th',g).forEach(function(t){t.addEventListener('click',function(){var i=+t.getAttribute('data-i');ST.slide=i;qa('.nl-th',g).forEach(function(x,k){x.classList.toggle('on',k===i);x.setAttribute('aria-selected',k===i);});go(i,true);});});
  var pv=q1('#nl-pv'),nx=q1('#nl-nx');pv&&pv.addEventListener('click',function(){go(ST.slide-1,true);});nx&&nx.addEventListener('click',function(){go(ST.slide+1,true);});
  sl.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(ST.slide+1,true);}else if(e.key==='ArrowLeft'){e.preventDefault();go(ST.slide-1,true);}else if(e.key==='Enter'){openZoom(ST.slide);}});
  qa('.nl-slide',g).forEach(function(fg){fg.addEventListener('click',function(e){if(e.target.closest('video'))return;openZoom(+fg.getAttribute('data-i'));});});
  if(anim&&!RM){g.classList.remove('nl-fade');void g.offsetWidth;g.classList.add('nl-fade');}
  var cn=q1('#nl-cn');if(cn)cn.textContent=colName(ST.color);}
/* ---- zoom: rueda, pellizco, doble toque y arrastre ---- */
var Z={open:false,s:1,x:0,y:0,pts:{},t:0},zoomEl=null;
function zApply(){var c=q1('#nl-zc');if(!c)return;c.style.transform='translate('+Z.x+'px,'+Z.y+'px) scale('+Z.s+')';var p=q1('#nl-zp');if(p)p.textContent=Math.round(Z.s*100)+'%';}
function zClamp(){var v=q1('#nl-zv');if(!v)return;var mx=v.clientWidth*(Z.s-1)/2,my=v.clientHeight*(Z.s-1)/2;Z.x=Math.max(-mx,Math.min(mx,Z.x));Z.y=Math.max(-my,Math.min(my,Z.y));if(Z.s<=1){Z.x=0;Z.y=0;}}
function zAt(cx,cy,ns){var v=q1('#nl-zv');if(!v)return;ns=Math.max(1,Math.min(5,ns));var r=v.getBoundingClientRect();var px=cx-(r.left+r.width/2),py=cy-(r.top+r.height/2);
  Z.x=px-(px-Z.x)*(ns/Z.s);Z.y=py-(py-Z.y)*(ns/Z.s);Z.s=ns;zClamp();zApply();}
function zShow(i){var S=ST.slides||[];if(!S.length)return;i=(i+S.length)%S.length;Z.i=i;var s=S[i];var c=q1('#nl-zc');c.innerHTML=s.t;Z.s=1;Z.x=0;Z.y=0;zApply();var cp=q1('#nl-zcap');cp.textContent=s.l+' · '+(i+1)+' de '+S.length+(s.cap?' · '+s.cap:'');}
function openZoom(i){if(!ST.slides||!ST.slides.length)return;if(!zoomEl)return;var s=ST.slides[i];if(!s||s.k==='vd')return;zShow(i);zoomEl.classList.add('open');Z.open=true;setTimeout(function(){var x=q1('#nl-zx');x&&x.focus({preventScroll:true});},40);}
function closeZoom(){if(!zoomEl||!Z.open)return;Z.open=false;zoomEl.classList.remove('open');Z.pts={};}
function mkZoom(){zoomEl=document.createElement('div');zoomEl.id='nl-zoom';zoomEl.setAttribute('role','dialog');zoomEl.setAttribute('aria-modal','true');zoomEl.setAttribute('aria-label','Imagen ampliada');
  zoomEl.innerHTML='<div class="zv" id="nl-zv"><div class="zc" id="nl-zc"></div></div><div class="zb"><span id="nl-zcap" role="status"></span><button type="button" id="nl-zx" aria-label="Cerrar imagen ampliada">✕</button></div>'+
   '<button type="button" class="nl-arr l" id="nl-zprev" aria-label="Imagen anterior">‹</button><button type="button" class="nl-arr r" id="nl-znext" aria-label="Imagen siguiente">›</button>'+
   '<div class="zt"><button type="button" id="nl-zm" aria-label="Alejar">−</button><span id="nl-zp">100%</span><button type="button" id="nl-zpl" aria-label="Acercar">+</button><button type="button" id="nl-zr">Restablecer</button></div><div class="zh">Pellizcá o hacé doble toque para acercar · arrastrá para mover</div>';
  document.body.appendChild(zoomEl);var v=q1('#nl-zv');
  q1('#nl-zx').addEventListener('click',closeZoom);q1('#nl-zprev').addEventListener('click',function(){zShow(Z.i-1);});q1('#nl-znext').addEventListener('click',function(){zShow(Z.i+1);});
  q1('#nl-zm').addEventListener('click',function(){var r=v.getBoundingClientRect();zAt(r.left+r.width/2,r.top+r.height/2,Z.s/1.4);});
  q1('#nl-zpl').addEventListener('click',function(){var r=v.getBoundingClientRect();zAt(r.left+r.width/2,r.top+r.height/2,Z.s*1.4);});
  q1('#nl-zr').addEventListener('click',function(){Z.s=1;Z.x=0;Z.y=0;zApply();});
  var dist=function(){var k=Object.keys(Z.pts);if(k.length<2)return 0;var a=Z.pts[k[0]],b=Z.pts[k[1]];return Math.hypot(a.x-b.x,a.y-b.y);};
  v.addEventListener('wheel',function(e){e.preventDefault();zAt(e.clientX,e.clientY,Z.s*(e.deltaY<0?1.18:1/1.18));},{passive:false});
  v.addEventListener('pointerdown',function(e){try{v.setPointerCapture(e.pointerId);}catch(x){}Z.pts[e.pointerId]={x:e.clientX,y:e.clientY};Z.mv=0;if(Object.keys(Z.pts).length===2){Z.d0=dist();Z.s0=Z.s;}});
  v.addEventListener('pointermove',function(e){var p=Z.pts[e.pointerId];if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;Z.mv+=Math.abs(dx)+Math.abs(dy);
    if(Object.keys(Z.pts).length>=2){var d=dist();if(Z.d0){var ks=Object.keys(Z.pts);zAt((Z.pts[ks[0]].x+Z.pts[ks[1]].x)/2,(Z.pts[ks[0]].y+Z.pts[ks[1]].y)/2,Z.s0*d/Z.d0);}}
    else if(Z.s>1){Z.x+=dx;Z.y+=dy;zClamp();zApply();}});
  var up=function(e){var had=Z.pts[e.pointerId];delete Z.pts[e.pointerId];
    if(had&&Z.mv<8&&Object.keys(Z.pts).length===0){var t=Date.now();if(t-Z.t<320){zAt(e.clientX,e.clientY,Z.s>1.05?1:2.6);Z.t=0;}else Z.t=t;}};
  v.addEventListener('pointerup',up);v.addEventListener('pointercancel',function(e){delete Z.pts[e.pointerId];});}
/* ---- botón flotante de WhatsApp, filtros y arranque de extras ---- */
function mkExtras(){mkZoom();
  var m=document.createElement('div');m.id='nl-filter';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Filtros');m.innerHTML='<div class="fb"></div>';document.body.appendChild(m);
  m.addEventListener('click',function(e){if(e.target===m)closeFilter();});
  var a=document.createElement('a');a.id='nl-wa';a.className='nl-wa';a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Consultar por WhatsApp');a.href=waUrl();
  a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.8-4.5-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.4 0 .3 0 .9-.2 1.3z"/></svg><span>WhatsApp</span>';
  ['pointerdown','focus','mouseenter','touchstart'].forEach(function(ev){a.addEventListener(ev,updWa,{passive:true});});document.body.appendChild(a);}
function paintColors(){var w=q1('#nl-sws');if(!w)return;var f=FAMS[ST.fam];
  w.innerHTML=f.colors.map(function(c){return '<button type="button" class="nl-sw" role="radio" aria-checked="'+(c===ST.color)+'" data-c="'+esc(c)+'" aria-label="'+esc(colName(c)+(colorStock(f,c)>0?'':', sin stock'))+'"><i style="background:'+esc(colHex(c))+'"></i></button>';}).join('');
  var cn=q1('#nl-cn');if(cn)cn.textContent=colName(ST.color);}
function paintSizes(){var w=q1('#nl-szs');if(!w)return;var f=FAMS[ST.fam];var rec=recFor(f.id);
  w.innerHTML=f.sizes.map(function(s){var i=sizeInfo(f,ST.color,s);var out=i.n<=0;var small=out?'Agotado':(i.n<=2?'Quedan '+i.n:'');
    var row=rec&&rec.rows.filter(function(r){return r.size===s;})[0];
    return '<button type="button" class="nl-chip'+(out?' out':'')+(rec&&rec.size===s?' rec':'')+'" role="radio" aria-checked="'+(ST.size===s)+'" data-s="'+esc(s)+'" aria-label="'+esc('Talle '+s+(out?', agotado':(i.n<=2?', quedan '+i.n:''))+(rec&&rec.size===s?', tu talle recomendado':''))+'">'+esc(s)+'<small>'+small+'</small></button>';}).join('');
  var n=q1('#nl-sznote');if(!n)return;var h='';
  if(rec&&ST.size){var row=rec.rows.filter(function(r){return r.size===ST.size;})[0];if(row){h='<div class="nl-note"><b>Talle '+esc(ST.size)+':</b> '+esc(row.label)+(rec.size===ST.size?' · es tu talle recomendado.':' · tu talle recomendado es el <b>'+esc(rec.size)+'</b>.')+(rec.note&&rec.note.length?'<br><span style="font-weight:400">'+esc(rec.note[0])+'</span>':'')+'</div>';}}
  else if(rec){h='<div class="nl-note">Según tus medidas, te recomendamos el talle <b>'+esc(rec.size)+'</b>.</div>';}
  n.innerHTML=h;}
function paintFb(){var b=q1('#nl-fb');if(!b)return;var d=D.fb&&D.fb[ST.fam];if(!d||d.n<8){b.innerHTML='<p class="nl-sub">Todavía hay pocas opiniones de calce.</p>';return;}
  var ok=Math.max(0,d.n-d.chico-d.grande);var pc=function(x){return Math.round(x/d.n*100);};
  var msg=pc(d.chico)>=25?'Tiende a quedar <b>chico</b>: si dudás, pedí el talle siguiente.':(pc(d.grande)>=15?'Tiende a quedar <b>grande</b>: si dudás, pedí el talle anterior.':'Calza <b>como el talle indica</b> para la mayoría.');
  b.innerHTML='<div class="nl-fbar" role="img" aria-label="'+pc(ok)+'% calza normal, '+pc(d.chico)+'% chico, '+pc(d.grande)+'% grande"><i style="width:'+pc(ok)+'%"></i><i style="width:'+pc(d.chico)+'%"></i><i style="width:'+pc(d.grande)+'%"></i></div>'+
   '<div class="nl-fleg"><span><i class="lg a"></i>Normal '+pc(ok)+'%</span><span><i class="lg b"></i>Chico '+pc(d.chico)+'%</span><span><i class="lg c"></i>Grande '+pc(d.grande)+'%</span></div><p class="nl-sub" style="margin-top:8px">'+msg+' Base: '+d.n+' compras (ejemplo).</p>';}
function paintGuide(){var w=q1('#nl-gt');if(!w)return;var f=FAMS[ST.fam];var ch=D.chart[f.def.chart];var dims=(f.def.dims&&f.def.dims.length)?f.def.dims:[];var rec=recFor(f.id);
  if(!dims.length){w.innerHTML='<p>Este producto no tiene tabla de medidas.</p>';return;}
  var k=UNIT==='in'?0.3937:1;var fx=function(v){return (v*k).toFixed(UNIT==='in'?1:(f.def.chart==='calz'?1:0)).replace('.',',');};
  w.innerHTML='<div class="nl-seg" role="group" aria-label="Unidad"><button type="button" data-u="cm" aria-pressed="'+(UNIT==='cm')+'">cm</button><button type="button" data-u="in" aria-pressed="'+(UNIT==='in')+'">in</button></div>'+
   '<table class="nl-gt"><caption class="nl-sr">Medidas del cuerpo por talle</caption><thead><tr><th scope="col">Talle</th>'+dims.map(function(d){return '<th scope="col">'+esc(DIMN[d])+'</th>';}).join('')+'</tr></thead><tbody>'+
   f.sizes.map(function(s){var cl=(rec&&rec.size===s)?'hl':(ST.size===s?'sel':'');return '<tr class="'+cl+'"><th scope="row" style="background:none;color:inherit;font-size:13px">'+esc(s)+'</th>'+dims.map(function(d){return '<td>'+fx((ch[s]||{})[d]||0)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>'+
   '<p class="nl-sub" style="margin-top:8px">Son medidas del <b>cuerpo</b>, no de la prenda. Si estás entre dos talles: '+(f.def.stretch?'la prenda es elástica, elegí el menor':'elegí el mayor para más comodidad')+'.</p>';
  w.onclick=function(e){var b=e.target.closest('[data-u]');if(b){UNIT=b.getAttribute('data-u');paintGuide();}};}
function paintLook(){var w=q1('#nl-look');if(!w)return;var f=FAMS[ST.fam];var cats=ORDER.map(function(i){return FAMS[i];}).filter(function(x){return x.cat!==f.cat&&x.total>0;});
  var pick=[];var seen={};cats.forEach(function(x){if(!seen[x.cat]&&pick.length<4){seen[x.cat]=1;pick.push(x);}});
  w.innerHTML=pick.map(function(x){var t=tile(x);return t.replace('class="nl-tile"','class="nl-tile in"');}).join('');}
function cartQty(id){var el=document.querySelector('.card[data-id="'+id+'"]');var q=el&&el.querySelector('.qty-val');return q?(parseInt(q.textContent,10)||0):0;}
function paintCTA(){var f=FAMS[ST.fam];if(!f){return;}var i=ST.size?sizeInfo(f,ST.color,ST.size):null;var out=i&&i.n<=0;var inCart=i?cartQty(i.id):0;var cap=i&&i.n>0&&inCart>=i.n;
  var label,mode;
  if(!ST.size){label='Elegí tu talle';mode='pick';}
  else if(out){label='Avisarme cuando vuelva';mode='notify';}
  else if(cap){label='Ya tenés todo el stock';mode='cap';}
  else{label='Agregar al carrito';mode='add';}
  sticky.innerHTML='<div class="tot"><small>Total</small>'+money(f.price)+'</div><button type="button" class="nl-btn ap-add" id="nl-cta" data-m="'+mode+'"'+(mode==='cap'?' aria-disabled="true"':'')+'>'+label+'</button>'+(mode==='add'||mode==='cap'?'<button type="button" class="nl-btn ap-buy" id="nl-buy" data-m="'+mode+'">Comprar ahora</button>':'');
  q1('#nl-cta').addEventListener('click',onCTA);var bb=q1('#nl-buy');bb&&bb.addEventListener('click',function(){var m=this.getAttribute('data-m');if(m==='add')onCTA.call(q1('#nl-cta'));setTimeout(function(){closePDP();apCart();},m==='add'?260:0);});}
function onCTA(e){var m=this.getAttribute('data-m'),f=FAMS[ST.fam];
  if(m==='pick'){var w=q1('#nl-szs');if(w){w.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});if(!RM){w.classList.remove('nl-shake');void w.offsetWidth;w.classList.add('nl-shake');}}flash('Elegí un talle para continuar');return;}
  if(m==='cap'){flash('Llegaste al stock disponible de este talle');return;}
  if(m==='notify'){showNotify();return;}
  var i=sizeInfo(f,ST.color,ST.size);var card=document.querySelector('.card[data-id="'+i.id+'"]');var plus=card&&card.querySelector('.qty-btn.plus');
  if(!plus){flash('No pudimos agregar el producto');return;}
  plus.click();buzz();flyTo(this);var btn=this;
  btn.classList.add('done');btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg> Agregado';say('Agregado: '+f.name+', '+colName(ST.color)+', talle '+ST.size);
  setTimeout(function(){if(ST.open)paintCTA();},1300);}
function flyTo(btn){var bar=document.getElementById('cart-bar');
  var go=function(){var tb=document.getElementById('cart-bar');if(!tb)return;tb.classList.remove('nl-bump');void tb.offsetWidth;tb.classList.add('nl-bump');};
  if(RM||!bar||!btn.getBoundingClientRect||!btn.animate){setTimeout(go,50);return;}
  var a=btn.getBoundingClientRect(),z=bar.getBoundingClientRect();var d=document.createElement('div');d.className='nl-fly';d.style.left=(a.left+a.width/2-9)+'px';d.style.top=(a.top+a.height/2-9)+'px';document.body.appendChild(d);
  var dx=(z.left+z.width/2)-(a.left+a.width/2),dy=(z.top+10)-(a.top+a.height/2);
  var an=d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx*0.6+'px,'+(dy-90)+'px) scale(.8)',opacity:1,offset:.55},{transform:'translate('+dx+'px,'+dy+'px) scale(.3)',opacity:.4}],{duration:620,easing:'cubic-bezier(.4,0,.2,1)'});
  an.onfinish=function(){d.remove();go();};}
function showNotify(){var f=FAMS[ST.fam];var n=q1('#nl-sznote');if(!n)return;var saved='';try{saved=localStorage.getItem('nl.contact')||'';}catch(e){}
  n.innerHTML='<div class="nl-nf"><b style="text-transform:uppercase;font:700 12px var(--txt);letter-spacing:.08em">Talle '+esc(ST.size)+' · '+esc(colName(ST.color))+' agotado</b><p class="nl-sub" style="margin:4px 0 0">Dejanos tu WhatsApp o mail y te avisamos cuando vuelva (demo: queda registrado en el panel).</p>'+
   '<label class="nl-sr" for="nl-ct">WhatsApp o mail</label><input type="text" id="nl-ct" inputmode="email" autocomplete="off" placeholder="WhatsApp o mail" value="'+esc(saved)+'"><button type="button" class="nl-btn full" id="nl-nsend">Avisarme</button><div id="nl-nmsg" class="nl-sub" role="status" style="margin-top:6px"></div></div>';
  q1('#nl-nsend').addEventListener('click',function(){var v=q1('#nl-ct').value,p=P();var r=p?p.notify({fam:ST.fam,color:ST.color,talle:ST.size,contact:v}):{err:'No disponible'};var m=q1('#nl-nmsg');
    if(r.err){m.textContent='⚠ '+r.err;return;}try{localStorage.setItem('nl.contact',v);}catch(e){}
    q1('.nl-nf').innerHTML='<b style="font:700 13px var(--txt);text-transform:uppercase;letter-spacing:.06em">✓ Listo, te avisamos</b><p class="nl-sub" style="margin:4px 0 0">Registramos el pedido del talle '+esc(ST.size)+' ('+esc(colName(ST.color))+').</p>';say('Aviso registrado');buzz();});
  q1('#nl-ct').focus();}
/* ---- Mis medidas ---- */
var MEFAM=null;
function openMe(fam){MEFAM=fam;var f=fam?FAMS[fam]:null;var dims=f&&f.def.dims&&f.def.dims.length?f.def.dims.slice():['pecho','cintura','cadera','pie'];if(!f)dims=['pecho','cintura','cadera','pie'];
  var h='<h3>Mis medidas</h3><p class="nl-sub">'+(f?'Para '+esc(f.name)+'. ':'')+'Las guardamos sólo en este dispositivo y las usamos para sugerirte el talle de anillos y calzado.</p><div class="nl-mf"><div class="g">'+
   ['altura'].concat(dims).filter(function(d,i,a){return a.indexOf(d)===i;}).map(function(d){return '<div><label for="me-'+d+'">'+esc(DIMN[d])+' (cm)</label><input type="number" inputmode="decimal" step="0.5" min="0" max="250" id="me-'+d+'" value="'+esc(ME[d]||'')+'"><div class="hint">'+esc(DIMH[d])+'</div></div>';}).join('')+'</div>'+
   '<label for="me-pref">Cómo te gusta que calce</label><input type="range" class="nl-rng" id="me-pref" min="0" max="2" step="1" value="'+({ajustado:0,regular:1,holgado:2}[ME.pref]||1)+'" aria-valuetext="'+esc(ME.pref||'regular')+'"><div class="nl-rl"><span>Ajustado</span><span>Regular</span><span>Holgado</span></div>'+
   '<div style="display:flex;gap:8px;margin-top:16px"><button type="button" class="nl-btn ghost" id="me-x">Cerrar</button><button type="button" class="nl-btn full" id="me-ok">Ver mi talle</button></div><p class="nl-sub" id="me-msg" role="status" style="margin-top:8px"></p></div>';
  meBox.innerHTML='<div class="box">'+h+'</div>';meBox.classList.add('open');
  q1('#me-x').addEventListener('click',closeMe);meBox.addEventListener('click',function(e){if(e.target===meBox)closeMe();});
  var rg=q1('#me-pref');rg.addEventListener('input',function(){var v=['ajustado','regular','holgado'][+rg.value];rg.setAttribute('aria-valuetext',v);});
  q1('#me-ok').addEventListener('click',function(){qa('#nl-me input[type=number]').forEach(function(i){var k=i.id.replace('me-','');ME[k]=i.value;});ME.pref=['ajustado','regular','holgado'][+rg.value];saveMe();
    var msg=q1('#me-msg');var m=mNum();if(Object.keys(m).length<=1){msg.textContent='Cargá al menos una medida para sugerirte talle.';return;}
    closeMe();meBtn();paintGrid();if(ST.open){var r=recFor(ST.fam);if(r&&!ST.size){ST.size=r.size;}paintSizes();paintGal(false);paintCTA();paintGuide();flash(r?'Tu talle: '+r.size:'Medidas guardadas');}else flash('Medidas guardadas');});
  setTimeout(function(){var i=q1('#nl-me input');i&&i.focus();},60);}
function closeMe(){meBox.classList.remove('open');}
/* ---- carrito: pasos y envío bonificado ---- */
function cartExtras(){var pn=document.getElementById('cart-panel');if(!pn||pn.querySelector('.nl-steps')||!D)return;
  var st=document.createElement('div');st.className='nl-steps';st.innerHTML='<span class="on">1 · Tu pedido</span><span>2 · Entrega</span><span>3 · Confirmás por WhatsApp</span>';pn.insertBefore(st,pn.firstChild);
  var fr=document.createElement('div');fr.className='nl-free';fr.id='nl-free';var tr=pn.querySelector('.cp-total-row');tr&&tr.parentNode.insertBefore(fr,tr.nextSibling);
  var upd=function(){var t=window.RAVE_CART_TOTAL||0;var left=D.free-t;var el=document.getElementById('nl-free');if(!el)return;
    el.innerHTML=(t<=0?'Envío bonificado desde '+money(D.free)+' (ejemplo).':(left>0?'Te faltan <b>'+money(left)+'</b> para el envío bonificado (ejemplo).':'<b>¡Tenés envío bonificado!</b> (ejemplo)'))+'<div class="tr"><i style="width:'+Math.min(100,Math.round(t/D.free*100))+'%"></i></div>';};
  var tv=document.getElementById('cp-total-val');if(tv&&window.MutationObserver)new MutationObserver(upd).observe(tv,{childList:true,characterData:true,subtree:true});upd();}
/* ---- carrito: pasos, medios de pago y calculador de envío ---- */
function cartShip(){var pn=document.getElementById('cart-panel');if(!pn||pn.querySelector('#nl-ship'))return;var tr=pn.querySelector('.cp-total-row');if(!tr)return;
  var box=document.createElement('div');box.id='nl-ship';box.className='nl-ship';tr.parentNode.insertBefore(box,tr);
  var pay=document.createElement('div');pay.className='nl-payc';pay.innerHTML=payLine(window.RAVE_CART_TOTAL||0).replace('class="nl-pay"','class="nl-pay c"');tr.parentNode.insertBefore(pay,tr);
  var S1={m:'retiro',pick:null,cp:'',f:{}};
  function baseOn(){var b=document.getElementById('ship-box');return!!(b&&!b.hidden);}
  function sub(){var t=document.getElementById('cp-total-val');return t?(parseInt(String(t.textContent).replace(/[^\d,]/g,'').split(',')[0]||'0',10)||0):0;}
  function kg(){var c=parseInt((document.getElementById('cb-count')||{}).textContent,10)||1;return Math.max(1,Math.ceil(c*0.6));}
  function fld(id,l,mx,ac){return '<label for="'+id+'">'+l+'</label><input id="'+id+'" maxlength="'+mx+'" autocomplete="'+ac+'" value="'+esc(S1.f[id]||'')+'">';}
  function render(){if(baseOn()){box.hidden=true;return;}box.hidden=false;
    var h='<h4 class="sh-h">Entrega</h4><div class="sh-opts" role="radiogroup" aria-label="Forma de entrega"><label class="sh-opt"><input type="radio" name="ns-m" value="retiro"'+(S1.m==='retiro'?' checked':'')+'> Retiro en el local (sin costo)</label><label class="sh-opt"><input type="radio" name="ns-m" value="envio"'+(S1.m==='envio'?' checked':'')+'> Envío a domicilio o sucursal</label></div>';
    if(S1.m==='envio')h+='<div id="ns-q"></div>'+fld('ns-name','Nombre de quien recibe',60,'name')+fld('ns-tel','Teléfono de contacto',20,'tel')+fld('ns-street','Calle y número',80,'street-address')+fld('ns-city','Localidad',60,'address-level2')+fld('ns-obs','Indicaciones (piso, horario, referencias)',120,'off');
    h+='<div class="sh-sum" id="ns-sum" role="status" aria-live="polite"></div><div class="sh-err" id="ns-err" role="alert" hidden></div><p class="sh-n">Es una solicitud: el comercio confirma stock, costo y plazo por WhatsApp. Tus datos de entrega solo van en ese mensaje; esta tienda no los guarda.</p>';
    box.innerHTML=h;
    qa('input[name=ns-m]',box).forEach(function(r){r.addEventListener('change',function(){keep();S1.m=r.value;S1.pick=null;render();});});
    if(S1.m==='envio'){shipUI(q1('#ns-q',box),{kg:kg,total:sub,pick:function(o,cp){S1.pick=o;if(cp)S1.cp=cp;sum();},auto:false});}
    qa('input[id^=ns-]',box).forEach(function(i){i.addEventListener('input',function(){S1.f[i.id]=i.value;});});sum();}
  function keep(){qa('input[id^=ns-]',box).forEach(function(i){if(i.type!=='radio')S1.f[i.id]=i.value;});}
  function sum(){var el=q1('#ns-sum',box);if(!el)return;var s=sub(),t='';
    if(S1.m==='retiro')t='<b>Retiro en el local:</b> sin costo.';
    else if(!S1.pick)t='Calculá el envío con tu código postal y elegí una opción.';
    else{t='<b>Envío:</b> '+(S1.pick.price?money(S1.pick.price):'Gratis')+' · '+esc(S1.pick.carrier)+(S1.pick.svc?' · '+esc(S1.pick.svc):'')+'<br><b>Total con envío (estimado):</b> '+money(s+S1.pick.price);}
    el.innerHTML=t;}
  function validate(){if(baseOn()||S1.m==='retiro')return '';keep();var f=S1.f;
    if(!S1.pick)return 'Calculá el envío y elegí una opción de entrega.';
    var need=[['ns-name','el nombre de quien recibe'],['ns-tel','un teléfono de contacto'],['ns-street','calle y número'],['ns-city','la localidad']];
    for(var i=0;i<need.length;i++){if(String(f[need[i][0]]||'').trim().length<2)return 'Falta '+need[i][1]+'.';}
    if(!/^[\d\s+()-]{6,20}$/.test(String(f['ns-tel']||'').trim()))return 'Ingresá un teléfono válido.';return '';}
  var send=document.getElementById('btn-send');
  if(send)send.addEventListener('click',function(ev){if(baseOn())return;var m=validate(),er=q1('#ns-err',box);if(m){ev.stopImmediatePropagation();ev.preventDefault();if(er){er.textContent=m;er.hidden=false;er.scrollIntoView&&er.scrollIntoView({block:'nearest'});}}else if(er){er.hidden=true;}},true);
  var prev=window.RAVE_SHIP_LINES;
  window.RAVE_SHIP_LINES=function(lines,total){if(baseOn()){if(prev)prev(lines,total);return;}keep();lines.push('');
    if(S1.m==='retiro'){lines.push('ENTREGA: Retiro en el local');return;}
    var f=S1.f,o=S1.pick;lines.push('ENTREGA: '+(o?o.carrier+(o.svc?' · '+o.svc:''):'Envío a coordinar'));
    lines.push('Recibe: '+String(f['ns-name']||'').trim()+' · Tel: '+String(f['ns-tel']||'').trim());
    lines.push('Dirección: '+String(f['ns-street']||'').trim()+', '+String(f['ns-city']||'').trim()+(S1.cp?' (CP '+S1.cp+')':''));
    if(String(f['ns-obs']||'').trim())lines.push('Indicaciones: '+String(f['ns-obs']).trim());
    if(o){lines.push('Envío: '+(o.price?money(o.price):'sin costo')+' ('+o.days+(o.id==='retiro'?'':' días hábiles')+')');lines.push('Total con envío estimado: '+money(total+o.price));}};
  var cb=document.getElementById('cart-bar');if(cb)cb.addEventListener('click',function(){setTimeout(function(){pay.innerHTML=payLine(sub()).replace('class="nl-pay"','class="nl-pay c"');render();},0);});
  var tv=document.getElementById('cp-total-val');if(tv&&window.MutationObserver)new MutationObserver(function(){sum();}).observe(tv,{childList:true,characterData:true,subtree:true});
  render();}
/* ---- arranque ---- */
/* ===== Diseño tipo app (encabezado, banner, categorías, más vendidos, favoritos, barra inferior, ficha y carrito) ===== */
var AP_ICO={
 search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
 bag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
 home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-6.5 8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>',
 grid:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
 heart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.2C19.5 15.4 12 20 12 20z"/></svg>',
 wa:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5z"/><path d="M9 8.5c.3 2.5 2.5 5 5.5 6l1.2-1.4-2-1-.8.7c-.8-.4-1.6-1.2-2-2l.7-.8-1-2z"/></svg>',
 truck:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
 swap:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h12l-3-3M19 15H7l3 3"/></svg>',
 card:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
 arr:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'};
var AP_FEAT=[['truck','Envío a todo el país'],['swap','Cambios por talle'],['card','Cuotas sin interés']];
var AP_DESC={'nl-gor':'Gorra de uso diario con ajuste cómodo. Combina con cualquier look y con lo que viste en TikTok.','nl-rel':'Reloj de acero con diseño versátil y correa cómoda. Va igual de bien de día que de noche.','nl-ani':'Joyería de acero pensada para usar todos los días y combinar con otras piezas.','nl-len':'Lentes de sol con protección UV400 y armazón liviano para el día a día.','nl-acc':'Accesorio práctico y resistente, hecho para acompañarte todos los días.'};
var AP_ACC=['nl-gor','nl-rel','nl-ani','nl-len','nl-acc'];
function apDesc(f){return AP_DESC[f.cat]||'Producto de temporada, elegido para combinar con todo. Mirá la guía de medidas para elegir tu talle.';}
function apFav(){try{return JSON.parse(localStorage.getItem('ap.fav')||'{}')||{};}catch(e){return{};}}
function apSaveFav(o){try{localStorage.setItem('ap.fav',JSON.stringify(o));}catch(e){}}
function apRate(fam){var h=0;for(var i=0;i<fam.length;i++)h=(h*31+fam.charCodeAt(i))%97;return{r:(4.5+(h%5)/10).toFixed(1),n:40+h*3};}
function apRateHtml(fam,long){var r=apRate(fam);return '<span class="ap-rt"><b>★</b> '+r.r+(long?' <small>('+r.n+' reseñas)</small>':'')+'</span>';}
function apCart(){var b=q1('#cart-bar');b&&b.click();}
function apBrandName(){return 'Accesorios para Ellos';}
function apHead(){if(q1('.ap-head'))return;var lg=q1('header .logo'),sheet=q1('.sheet');if(!sheet)return;var src=lg?lg.getAttribute('src'):'';
  var h=document.createElement('div');h.className='ap-head';
  h.innerHTML='<img class="ap-logo" src="'+esc(src)+'" alt="'+apBrandName()+'"><div class="ap-bn"><b id="ap-title">'+apBrandName()+'</b><small>Estilo para todos los días</small></div><div class="ap-hi"><span id="ap-lang"></span><button type="button" class="ap-ib" id="ap-s" aria-label="Buscar">'+AP_ICO.search+'</button><button type="button" class="ap-ib" id="ap-c" aria-label="Ver mi pedido">'+AP_ICO.bag+'<i class="ap-bd" hidden>0</i></button></div>';
  sheet.insertBefore(h,sheet.firstChild);
  var lt=q1('header .lang-toggle');if(lt)q1('#ap-lang',h).appendChild(lt);
  q1('#ap-s',h).addEventListener('click',function(){var i=q1('#search-input');if(!i)return;i.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});setTimeout(function(){try{i.focus();}catch(e){}},300);});
  q1('#ap-c',h).addEventListener('click',apCart);
  /* el acceso del equipo sigue funcionando (toques en el logo / doble clic en el nombre) */
  q1('.ap-logo',h).addEventListener('click',function(){if(lg)lg.click();});
  q1('#ap-title',h).addEventListener('dblclick',function(){var t=q1('#brand-title');t&&t.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));});}
function apBadge(){var n=parseInt((q1('#cb-count')||{}).textContent,10)||0;qa('.ap-bd').forEach(function(b){b.textContent=n>9?'9+':n;b.hidden=!n;});}
function apArt(famA,hexA,famB,hexB){var A=FAMS[famA],B=FAMS[famB];return '<span class="ap-art" aria-hidden="true">'+(B?'<span class="b">'+garment(famB,hexB,B.cat,'f')+'</span>':'')+(A?'<span class="a">'+garment(famA,hexA,A.cat,'f')+'</span>':'')+'</span>';}
function apHero(){var old=q1('.ap-hero');if(old)old.remove();if(!D)return;
  var may=(D.may||[]).slice().sort(function(a,b){return a.min-b.min;}),wc=(D.welcome||{}).code||'';
  var S=[{k:'Novedades',t:'Relojes, gorras, cadenas y más',s:'Lo que viste en TikTok, a un toque.',b:'Comprar ahora',a:'best',art:['gor-bei','#E8DFCC','rel-cla','#C9A24A']}];
  if(wc)S.push({k:'Bienvenido/a',t:'10 % en tu primer pedido',s:'Usá el código '+wc+' en tu carrito.',b:'Copiar '+wc,a:'copy',art:['ani-sel','#C9A24A','col-cad','#C4C6CC']});
  if(may.length)S.push({k:'Compra por mayor',t:'Hasta −'+may[may.length-1].pct+' % por volumen',s:'Desde '+money(may[0].min)+' ya tenés precio mayorista.',b:'Ver productos',a:'all',art:['abr-hbo','#D8CDB5','len-avi','#C9A24A']});
  var w=document.createElement('section');w.className='ap-hero';w.setAttribute('aria-label','Novedades');
  w.innerHTML='<div class="ap-hs" role="list">'+S.map(function(x,i){return '<div class="ap-sl" role="listitem" data-i="'+i+'"><div class="ap-st"><small>'+esc(x.k)+'</small><h2>'+esc(x.t)+'</h2><p>'+esc(x.s)+'</p><button type="button" class="ap-sb" data-a="'+x.a+'">'+esc(x.b)+' '+AP_ICO.arr+'</button></div>'+apArt(x.art[0],x.art[1],x.art[2],x.art[3])+'</div>';}).join('')+'</div><div class="ap-dots" aria-hidden="true">'+S.map(function(x,i){return '<i'+(i?'':' class="on"')+'></i>';}).join('')+'</div>';
  var hs=q1('.ap-hs',w);hs.addEventListener('scroll',function(){var i=Math.round(hs.scrollLeft/Math.max(1,hs.clientWidth));qa('.ap-dots i',w).forEach(function(d,k){d.classList.toggle('on',k===i);});},{passive:true});
  w.addEventListener('click',function(e){var b=e.target.closest('.ap-sb');if(!b)return;var a=b.getAttribute('data-a');
    if(a==='copy'){try{navigator.clipboard.writeText(wc);}catch(x){}var ci=q1('#cp-coupon-in');if(ci)ci.value=wc;flash('Código '+wc+' copiado');}
    else{apCat('all');var t=q1('.ap-best')||q1('#catalogo-menu');t&&apScroll(t);}});
  return w;}
function apScroll(el){var h=(q1('.ap-head')||{offsetHeight:0}).offsetHeight;var y=el.getBoundingClientRect().top+window.pageYOffset-h-8;window.scrollTo({top:Math.max(0,y),behavior:RM?'auto':'smooth'});}
function apCat(c){var ch=q1('.cat-chip[data-cat="'+c+'"]');if(ch)ch.click();}
function apCats(){var old=q1('.ap-cats');if(old)old.remove();if(!D)return;
  var items=[];ORDER.forEach(function(i){var f=FAMS[i];if(!items.some(function(x){return x.c===f.cat;}))items.push({c:f.cat,f:f});});
  var w=document.createElement('section');w.className='ap-cats';w.setAttribute('aria-label','Categorías');
  w.innerHTML='<div class="ap-sh"><h3>Comprar por categoría</h3><button type="button" class="ap-all" data-c="all">Ver todo</button></div><div class="ap-cr" role="list">'+items.map(function(x){var nm=catName(x.c).replace(/ y .*$/,'');var first=x.f.colors.filter(function(c){return colorStock(x.f,c)>0;})[0]||x.f.colors[0];
    return '<button type="button" class="ap-cat" role="listitem" data-c="'+esc(x.c)+'"><span class="ap-ci">'+garment(x.f.id,colHex(first),x.f.cat,'f')+'</span><span class="ap-cn">'+esc(nm)+'</span></button>';}).join('')+'</div><div class="ap-act" hidden></div>';
  w.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;FS.fav=false;apNavOn('home');apCat(b.getAttribute('data-c'));var g=q1('.nl-grid');var s=q1('#catalogo-menu');setTimeout(function(){s&&apScroll(s);},60);});
  return w;}
var AP_BEST=['rel-bri','gor-bei','col-dij','rel-cro','gor-pla','len-avi'];
function apBest(){var old=q1('.ap-best');if(old)old.remove();if(!D)return;var L=AP_BEST.filter(function(i){return FAMS[i]&&FAMS[i].total>0;}).slice(0,6);if(!L.length)return;
  var w=document.createElement('section');w.className='ap-best';w.setAttribute('aria-label','Más vendidos');
  w.innerHTML='<div class="ap-sh"><h3>Más vendidos</h3><button type="button" class="ap-all" id="ap-ball">Ver todo</button></div><div class="ap-bg">'+L.map(function(i){return tile(FAMS[i]).replace('class="nl-tile"','class="nl-tile in"');}).join('')+'</div>';
  q1('#ap-ball',w).addEventListener('click',function(){var s=q1('#catalogo-menu');s&&apScroll(s);});
  w.addEventListener('click',function(e){var t=e.target.closest('.nl-tile');if(t&&!e.target.closest('.ap-heart'))openPDP(t.getAttribute('data-fam'),t);});
  return w;}
function apSync(){var chip=q1('.cat-chip.active'),act=chip?chip.getAttribute('data-cat'):'all',term=((q1('#search-input')||{}).value||'').trim();
  var busy=act!=='all'||term||FS.fav||nFilters();var b=q1('.ap-best');if(b)b.style.display=busy?'none':'';
  var a=q1('.ap-act');if(a){if(act!=='all'||FS.fav){a.hidden=false;a.innerHTML='<span>'+(FS.fav?'Tus favoritos':esc(catName(act)))+'</span><button type="button" id="ap-x" aria-label="Quitar filtro">✕ Ver todo</button>';var x=q1('#ap-x');x&&(x.onclick=function(){FS.fav=false;apNavOn('home');apCat('all');filterGrid();});}else{a.hidden=true;a.innerHTML='';}}
  qa('.ap-cat').forEach(function(c){c.classList.toggle('on',c.getAttribute('data-c')===act);});}
function apNavOn(k){qa('.ap-nav button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-k')===k);});}
function apNav(){if(q1('.ap-nav'))return;var n=document.createElement('nav');n.className='ap-nav';n.setAttribute('aria-label','Navegación');
  n.innerHTML='<button type="button" data-k="home" class="on">'+AP_ICO.home+'<span>Inicio</span></button><button type="button" data-k="cats">'+AP_ICO.grid+'<span>Categorías</span></button><button type="button" data-k="fav">'+AP_ICO.heart+'<span>Favoritos</span></button><button type="button" data-k="cart">'+AP_ICO.bag+'<span>Carrito</span><i class="ap-bd" hidden>0</i></button><a data-k="wa" id="ap-nwa" target="_blank" rel="noopener noreferrer" href="#">'+AP_ICO.wa+'<span>WhatsApp</span></a>';
  document.body.appendChild(n);
  n.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var k=b.getAttribute('data-k');
    if(k==='home'){FS.fav=false;apCat('all');filterGrid();apNavOn('home');window.scrollTo({top:0,behavior:RM?'auto':'smooth'});}
    else if(k==='cats'){FS.fav=false;apNavOn('cats');var c=q1('.ap-cats');c&&apScroll(c);}
    else if(k==='fav'){FS.fav=!FS.fav;apCat('all');filterGrid();apNavOn(FS.fav?'fav':'home');var s=q1('#catalogo-menu');s&&apScroll(s);if(FS.fav&&!Object.keys(apFav()).length)flash('Tocá el corazón de un producto para guardarlo');}
    else if(k==='cart'){apCart();}});
  var wa=q1('#ap-nwa'),w0=q1('#nl-wa');if(wa&&w0)wa.href=w0.href;}
function apHeart(){document.addEventListener('click',function(e){var h=e.target.closest&&e.target.closest('.ap-heart');if(!h)return;e.stopPropagation();e.preventDefault();var o=apFav(),f=h.getAttribute('data-fam');if(o[f])delete o[f];else o[f]=1;apSaveFav(o);
    qa('.ap-heart[data-fam="'+f+'"]').forEach(function(x){x.classList.toggle('on',!!o[f]);x.setAttribute('aria-pressed',!!o[f]);});flash(o[f]?'Guardado en favoritos':'Quitado de favoritos');if(FS.fav)filterGrid();},true);}
function apCartThumbs(){var box=q1('#cart-items');if(!box||!D)return;qa('.cp-item[data-pid]',box).forEach(function(it){if(q1('.ap-th',it))return;var c=CAT();var p=c&&(c.productos||[]).filter(function(x){return x.id===it.getAttribute('data-pid');})[0];if(!p||!p.nl)return;var f=FAMS[p.nl.fam];if(!f)return;var th=document.createElement('span');th.className='ap-th';th.innerHTML=garment(f.id,colHex(p.nl.color),f.cat,'f');it.insertBefore(th,it.firstChild);});}
function apOn(){document.documentElement.classList.add('ap-on');}
setTimeout(apOn,2500);
function apInfo(){var old=q1('.ap-info');if(old)old.remove();var I=D&&D.info;if(!I)return null;
  var w=document.createElement('section');w.className='ap-info';w.setAttribute('aria-label','Datos del local');
  var row=function(ic,t,s){return t?'<div class="vi-row"><span class="vi-ic" aria-hidden="true">'+ic+'</span><div><b>'+esc(t)+'</b>'+(s?'<span>'+esc(s)+'</span>':'')+'</div></div>':'';};
  w.innerHTML='<div class="ap-sh"><h3>Visitanos</h3></div><div class="vi-box">'+row('📍',I.addr,I.city)+row('⏰',I.hours,'')+row('📦',I.ship,I.ship2)+row('💳',I.pay,'')+
   (I.wa?'<a class="vi-wa" target="_blank" rel="noopener noreferrer" href="https://wa.me/'+encodeURIComponent(I.wa)+'?text='+encodeURIComponent('Hola, vi la tienda online y quiero consultar.')+'">'+AP_ICO.wa+'<span>Escribinos por WhatsApp</span></a>':'')+
   (I.map?'<a class="vi-map" target="_blank" rel="noopener noreferrer" href="'+esc(I.map)+'">Cómo llegar</a>':'')+'</div>';
  return w;}
function apBuild(){apHead();var tb=q1('#toolbar');if(!tb||!D)return;
  var hero=apHero(),cats=apCats(),best=apBest();var tk=q1('.nl-tk'),me=q1('.nl-me'),tools=q1('.nl-tools');
  var chain=[tb,hero,cats,tk,me,tools,best].filter(Boolean);var info=apInfo();
  for(var i=1;i<chain.length;i++){var prev=chain[i-1];prev.parentNode.insertBefore(chain[i],prev.nextSibling);}
  if(info){var cm=q1('#catalogo-menu');if(cm&&cm.parentNode)cm.parentNode.insertBefore(info,cm.nextSibling);else document.body.appendChild(info);}
  apNav();var nw=q1('#ap-nwa'),w0=q1('#nl-wa');if(nw){if(w0&&/wa\.me/.test(w0.href))nw.href=w0.href;else if(D&&D.wa)nw.href='https://wa.me/'+encodeURIComponent(D.wa);}
  apBadge();apSync();}
function apWire(){apHeart();var cb=q1('#cb-count');if(cb)new MutationObserver(apBadge).observe(cb,{childList:true,characterData:true,subtree:true});
  var ci=q1('#cart-items');if(ci)new MutationObserver(apCartThumbs).observe(ci,{childList:true});
  var ov=q1('#cart-overlay');if(ov)new MutationObserver(apCartThumbs).observe(ov,{attributes:true});}
function init(){
  if(!CAT()||!P())return;loadMe();mk();setTimeout(mayWire,0);setTimeout(apWire,0);paintGrid();if(!D)return;mkExtras();cartExtras();cartShip();
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.nl-grid .nl-tile');if(t&&e.target.closest('.ap-heart'))return;if(t){openPDP(t.getAttribute('data-fam'),t);}});
  var si=q1('#search-input');si&&si.addEventListener('input',filterGrid);
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.cat-chip'))setTimeout(filterGrid,0);});
  var r0=window.RAVE_MENU_REFRESH;window.RAVE_MENU_REFRESH=function(){if(r0)r0();setTimeout(function(){if(!q1('.nl-grid'))paintGrid();else{filterGrid();}},0);};
  var rr=window.RAVE_MENU_RENDER;window.RAVE_MENU_RENDER=function(){if(rr)rr();paintGrid();if(ST.open&&!FAMS[ST.fam])closePDP();};
  window.NL_STORE={open:function(f){openPDP(f);},fams:function(){return ORDER.slice();}};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
