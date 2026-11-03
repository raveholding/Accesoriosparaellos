import re,base64,sys,datetime
SRC='/home/claude/raveholding/ravev2/index.html'
OUT='/home/claude/newlook-build/out/index.html'
import os;os.makedirs('/home/claude/newlook-build/out',exist_ok=True)
s=open(SRC,encoding='utf-8').read()
def rd(f):return open('/home/claude/newlook-build/'+f,encoding='utf-8').read()
def b64(f):return 'data:image/png;base64,'+base64.b64encode(open('/home/claude/newlook-build/'+f,'rb').read()).decode()
def sub1(a,b,cnt=1):
    global s
    n=s.count(a)
    assert n>=1,('no encontrado',a[:70])
    if cnt and n!=cnt:print('AVISO',n,'ocurrencias (esperaba',cnt,')',a[:60])
    s=s.replace(a,b)
# --- título, build, colores
sub1('<title>Sistema RAVE · Almacén y Licorería RAVE — Demo</title>','<title>Urban · Moda Salta Capital — Demo</title>')
sub1('"db": "rave-cliente-v3", "publicUrl": "https://raveholding.github.io/raveV2/"','"db": "rave-svburban-demo-v3", "publicUrl": "https://raveholding.github.io/SVBUrbanDemo/", "profile": "newlook"')
parts=re.split(r'(data:image/[a-z]+;base64,[A-Za-z0-9+/=]+)',s)
SW=[('#c9963e','#0a0a0a'),('#a87a28','#000000'),('#e8c97a','#bdbdbd'),('#8a6d1f','#222222'),('#f3dca3','#e9e9e9'),('#7a6a42','#555555'),
 ('#242220','#0a0a0a'),('#f6f3ee','#f4f4f4'),('#fbfaf7','#fafafa'),('#e6e0d6','#e2e2e2'),('#e7e2d7','#e2e2e2'),('#6d675f','#666666'),('#6b6455','#555555'),
 ('#9c3b46','#222222'),('#e8a33d','#0a0a0a'),('#dba854','#ffffff'),('#4a463d','#333333'),('#333333','#0a0a0a'),
 ('#171513','#0b0b0b'),('#221f1c','#161616'),('#3a352f','#2e2e2e'),('#aca296','#a8a8a8'),('#ece6dc','#eeeeee'),('#2b2b2b','#0a0a0a')]
for k in range(0,len(parts),2):
    for a,b in SW:
        parts[k]=re.sub(a,b,parts[k],flags=re.I)
s=''.join(parts)
# --- logos
m=re.search(r'const LOGO_MENU="(data:[^"]+)"',s);old=m.group(1)
assert s.count(old)==2
s=s.replace(old,b64('logo_menu.png'))
m=re.search(r'const LOGO_TICKET="(data:[^"]+)"',s);s=s.replace(m.group(1),b64('logo_ticket.png'))
sub1('alt="RAVE" style="width:48px;height:27px;object-fit:cover;border-radius:6px"><span>Sistema RAVE</span>','alt="Urban" style="width:64px;height:25px;object-fit:contain;border-radius:0;background:#fff"><span>Sistema Urban</span>')
# --- marca visible (sin tocar identificadores RAVE_*, RAVE| ni RAVE-T)
for a,b in [('Almacén y Licorería RAVE, Urquiza 1052, Salta, Argentina','Urban, Salta Capital, Argentina (dirección de ejemplo)'),
 ('Licoreria+RAVE,+Urquiza+1052,+Salta,+Argentina','Urban+Salta+Capital+Argentina'),('Licoreria+RAVE+Urquiza+1052+Salta+Argentina','Urban+Salta+Capital+Argentina'),
 ('Licoreria RAVE, Urquiza 1052, Salta, Argentina','Urban, Salta Capital, Argentina'),
 ('Almacén y Licorería · Urquiza 1052 · Salta, Argentina','Moda · Salta Capital · Argentina'),
 ('Grocery & Liquor store · Urquiza 1052 · Salta, Argentina','Fashion · Salta Capital · Argentina'),
 ('Urquiza 1052, Salta, Argentina','Salta Capital, Argentina'),('Urquiza 1052','Salta Capital'),
 ('Almacén y Licorería RAVE','Urban'),('Almacén y Licorería · Salta','Moda · Salta Capital'),('Almacén y Licorería','Moda'),
 ('Grocery & Liquor store','Fashion store'),('Licoreria RAVE','Urban'),
 ('RAVE-Clientes','Urban-Clientes'),('rave-demo-2026','urban-demo-2026'),
 ('Sistema RAVE','Sistema Urban'),('Club RAVE','Club Urban'),('RAVE Club','Urban Club'),('RAVE DIGITAL','URBAN'),
 ('Hola RAVE!','Hola Urban!'),('RAVE Respaldos','Urban Respaldos'),
 ("ig:'RAVE_LICORERIA',fb:'LICORERIA_RAVE'","ig:'',fb:''"),
 ('@rave_licoreria','@urban.ejemplo'),('instagram.com/rave_licoreria','instagram.com/'),('@almacen.y.licorer','@ejemplo'),('tiktok.com/@almacen.y.licorer','tiktok.com/'),
 ("'5493874574892'","'5493874484132'"),('(387) 4 57 48 92','(387) 4484132'),
 ('alt="RAVE"','alt="Urban"'),('alt=\\"RAVE\\"','alt=\\"Urban\\"'),('alt="Logo RAVE"','alt="Logo Urban"'),
 ('Almacén RAVE','el comercio'),]:
    if a in s: s=s.replace(a,b)
s=re.sub(r"(?<=[ '>\"(%])RAVE(?=[ !<',.\\%)])",'Urban',s)
s=s.replace("['apple-mobile-web-app-title','Urban']","['apple-mobile-web-app-title','Urban']")
import base64 as _b
def _ff(f):return 'data:font/woff2;base64,'+_b.b64encode(open('/home/claude/newlook-build/fonts/'+f if not f.startswith('../') else '/home/claude/newlook-build/'+f[3:],'rb').read()).decode()
def _face(fam,w,f,st='normal'):return "@font-face{font-family:'"+fam+"';font-style:"+st+";font-weight:"+w+";font-display:swap;src:url("+_ff(f)+") format('woff2')}"
FONTS=_face('Cormorant Garamond','300','../fonts2/cg300.woff2')+_face('Cormorant Garamond','400','../fonts2/cg400.woff2')+_face('Cormorant Garamond','500','../fonts2/cg500.woff2')+_face('Cormorant Garamond','400','../fonts2/cg400i.woff2','italic')+_face('Jost','300 600','../fonts2/jost.woff2')
THEME=FONTS+open('/home/claude/newlook-build/nl_theme.css',encoding='utf-8').read()
s=s.replace('</head>','<style>'+THEME+'</style></head>',1)
n0=len(re.findall(r'<link[^>]*fonts\.googleapis\.com/css2[^>]*>',s))
s=re.sub(r'<link[^>]*fonts\.googleapis\.com/css2[^>]*>','',s)
print('links de fuentes quitados',n0)
s=re.sub(r'Georgia(,\s*"Times New Roman")?(,\s*serif)?',"'Cormorant Garamond',Georgia,serif",s)
s=s.replace("'Playfair Display'","'Cormorant Garamond'").replace('Poppins','Jost')
sub1('body.age-locked{ overflow:hidden; }','body.age-locked{ overflow:auto !important; } #age-gate,.alc-legend,.alc-notice{ display:none !important; }')
sub1('const inj=`<script>window.__QS=${JSON.stringify(qs)};<\\/script>','const inj=`<script>try{sessionStorage.setItem("rave_age18","1")}catch(e){}window.__QS=${JSON.stringify(qs)};<\\/script>',1)
sub1('font-src https://fonts.gstatic.com','font-src data: https://fonts.gstatic.com')
sub1('Licoreria_Rave','urban.ejemplo',0)
# --- hooks del perfil
sub1("window.RAVE_BUILD.profile==='kini'","(window.RAVE_BUILD.profile==='kini'||window.RAVE_BUILD.profile==='newlook')")
sub1('function kiniBase(d){','function kiniBase(d){if(window.RAVE_BUILD&&window.RAVE_BUILD.profile===\'newlook\'){return window.__NLREADY?nlBase(d):d;}')
sub1('function kiniExtras(){if(!isKiniBuild())return;','function kiniExtras(){if(!isKiniBuild())return;if(window.RAVE_BUILD.profile===\'newlook\'){return nlExtras();}')
sub1('async function kiniSeedAsync(){if(!isKiniBuild()||!S.cfg||S.cfg.kiniSeeded)return;','async function kiniSeedAsync(){if(!isKiniBuild())return;if(window.RAVE_BUILD.profile===\'newlook\'){return nlSeedAsync();}if(!S.cfg||S.cfg.kiniSeeded)return;')
sub1("['clientes','Clientes y fidelización'],","['probador','Moda'],['moda','Moda'],['omni','Moda'],['taller','Moda'],['bimoda','Moda'],['cli360','Moda'],['diseno','Moda'],['clientes','Clientes y fidelización'],")
# --- envolturas de beneficio y cobro
sub1('function applyBenefit(','function applyBenefit0(')
sub1('function pubCatalog(){','function pubCatalog0(){')
sub1('function commitSale(','function commitSale0(')
# --- inyección antes del arranque
anchor='(async()=>{if(CLOUD.on||'
assert s.count(anchor)==1
mods='\n'.join(rd(f) for f in ['nl_data.js','nl_logic.js','nl_pub.js','nl_seed.js','nl_screens1.js','nl_screens2.js','nl_screens3.js'])
inj=mods+'\nwindow.__NLREADY=true;\n'
s=s.replace(anchor,inj+anchor)

# --- tienda urbana dentro del menu publico
def jsq(t):return t.replace('\\','\\\\').replace('"','\\"').replace('\r','').replace('\n','\\n').replace('</','<\\/')
store='<style>'+FONTS+rd('nl_store.css')+'</style><script>'+rd('nl_store.js')+'</script>'
endp='\\n<\\/body><\\/html>";'
assert s.count(endp)==1,s.count(endp)
s=s.replace(endp,jsq(store)+endp)
open(OUT,'w',encoding='utf-8').write(s)
print('ok',len(s))
