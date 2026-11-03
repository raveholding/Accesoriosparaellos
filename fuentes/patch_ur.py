#!/usr/bin/env python3
"""Aplica el menú estilo Tienda Nube (ur_menu.js / ur_menu.css) sobre index.html. Idempotente: se puede correr de nuevo.
Uso: python3 fuentes/patch_ur.py [ruta/index.html]"""
import re,sys,os
here=os.path.dirname(os.path.abspath(__file__))
path=sys.argv[1] if len(sys.argv)>1 else os.path.join(here,'..','index.html')
s=open(path,encoding='utf-8').read()
js=open(os.path.join(here,'ur_menu.js'),encoding='utf-8').read()
css=open(os.path.join(here,'ur_menu.css'),encoding='utf-8').read()
B,E='/*UR-BEGIN*/','/*UR-END*/'
block=B+'\n'+js+'\n'+E+'\n'
if B in s:
    i=s.index(B);j=s.index(E)+len(E)+1
    s=s[:i]+block+s[j:]
else:
    anchor='(async()=>{if(CLOUD.on||'
    assert s.count(anchor)==1,('ancla',s.count(anchor))
    s=s.replace(anchor,block+anchor)
# menú lateral
if "innerHTML=urSideHTML(id)" not in s:
    a=" $('#side').innerHTML=`<div class=\"brand\">"
    b="\n const s=openSess();"
    i=s.index(a);j=s.index(b,i)
    s=s[:i]+" $('#side').innerHTML=urSideHTML(id);"+s[j:]
if "urAfter(id);$('#side')" not in s:
    a="sc.after&&sc.after();$('#side')"
    assert s.count(a)==1
    s=s.replace(a,"sc.after&&sc.after();urAfter(id);$('#side')")
# estilos
tag='<style id="ur-css">'+css+'</style>'
if 'id="ur-css"' in s:
    s=re.sub(r'<style id="ur-css">.*?</style>',lambda m:tag,s,flags=re.S)
else:
    s=s.replace('</head>',tag+'</head>',1)



# ---- nl_data.js: tablas de talles, modelos (con género Mujer/Hombre) y nlFamMap ----
nld=open(os.path.join(here,'nl_data.js'),encoding='utf-8').read()
def splice(s,src,a,b):
    i=s.index(a);j=s.index(b,i);i2=src.index(a);j2=src.index(b,i2)
    return s[:i]+src[i2:j2]+s[j:]
s=splice(s,nld,'const NL_CHART={','/* ---- modelos:')
s=splice(s,nld,'function nlFams(){return[','function nlEan(')
s=s.replace('rave-svburban-demo-v2','rave-svburban-demo-v3')
# ---- nl_pub.js: el catálogo público suma fotos, video, medios de pago y umbral de envío bonificado ----
old_pub="c.nl={chart:NL_CHART,sizes:NL_SIZES,col:NL_COL,fams:nlFamMap(),fb:nlFitFb(),free:NL_FREE_SHIP,wa:(S.tenant&&S.tenant.wa)||''};"
pub=open(os.path.join(here,'nl_pub.js'),encoding='utf-8').read()
new_pub=[l for l in pub.splitlines() if l.strip().startswith('const U=UR();c.nl=')][0].strip()
if old_pub in s: s=s.replace(old_pub,new_pub)
else: assert new_pub in s,'nl_pub no encontrado'
# ---- tienda pública (iframe): reemplaza el bloque inyectado por nl_store.css + nl_store.js actuales ----
import base64
def jsq(t):return t.replace('\\','\\\\').replace('"','\\"').replace('\r','').replace('\n','\\n').replace('</','<\\/')
endp='\\n<\\/body><\\/html>";'
assert s.count(endp)==1
e=s.index(endp);st=s.rfind('<style>@font-face',0,e)
seg=s[st:e];k=seg.index('/* ===== Tienda urbana B/N: grilla')
store_css=open(os.path.join(here,'nl_store.css'),encoding='utf-8').read()
store_js=open(os.path.join(here,'nl_store.js'),encoding='utf-8').read()
s=s[:st]+seg[:k]+jsq(store_css)+'<\\/style><script>'+jsq(store_js)+'<\\/script>'+s[e:]
# ---- CSP: permitir video propio (data:/blob:) ----
if 'media-src' not in s:
    a="img-src data: blob:;"
    assert s.count(a)==1
    s=s.replace(a,a+" media-src data: blob:;")
# ---- logos (menú y ticket) ----
def b64(f):return 'data:image/png;base64,'+base64.b64encode(open(os.path.join(here,f),'rb').read()).decode()
m=re.search(r'const LOGO_MENU="(data:[^"]+)"',s);s=s.replace(m.group(1),b64('logo_menu.png'))
m=re.search(r'const LOGO_TICKET="(data:[^"]+)"',s);s=s.replace(m.group(1),b64('logo_ticket.png'))
open(path,'w',encoding='utf-8').write(s)
print('ok',len(s))
