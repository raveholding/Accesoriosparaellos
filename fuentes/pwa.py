#!/usr/bin/env python3
"""Archivos de la app instalable (V26.69) con la marca de Accesorios para Ellos, junto al index.html:
app.webmanifest (Sistema, para el equipo), club.webmanifest (app del cliente: tienda + tarjeta del Club),
sw.js (copia para abrir sin señal; nunca toca la nube) e íconos app-180/192/512/512m.png.
Uso: python3 fuentes/pwa.py <carpeta_de_salida> <versión>"""
import json,os,sys
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__));out=sys.argv[1];ver=sys.argv[2] if len(sys.argv)>2 else 'ape'
BG='#000000'  # el logo del comercio es el smoking blanco sobre negro
lg=Image.open(os.path.join(here,'logo_menu.png')).convert('RGB')
# recorte del cuadrado negro con el smoking (el resto del PNG es blanco)
px=lg.load();W,H=lg.size;cols=[x for x in range(W) if sum(px[x,y][0] for y in range(0,H,5))/(H/5)<60]
x0,x1=min(cols),max(cols);blk=lg.crop((x0,0,x1+1,H))
from PIL import ImageOps
g=blk.convert('L').point(lambda v:255 if v>140 else 0);sq=blk.crop(g.getbbox())  # sólo el smoking blanco
def icon(n,mask=False):
    im=Image.new('RGB',(n,n),BG);h=int(n*(.56 if mask else .74));w=int(sq.width*h/sq.height)
    t=sq.resize((w,h),Image.LANCZOS);im.paste(t,((n-w)//2,(n-h)//2));return im
for n in (180,192,512):icon(n).save(os.path.join(out,'app-%d.png'%n),optimize=True)
icon(512,True).save(os.path.join(out,'app-512m.png'),optimize=True)
ic=[{'src':'app-192.png','sizes':'192x192','type':'image/png'},{'src':'app-512.png','sizes':'512x512','type':'image/png'},{'src':'app-512m.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]
base={'lang':'es-AR','dir':'ltr','display':'standalone','display_override':['standalone','minimal-ui'],'background_color':'#14302C','theme_color':'#14302C','scope':'./','icons':ic}
m1=dict(base,id='./?app=sistema',name='Accesorios para Ellos · Sistema',short_name='AxE Sistema',description='Sistema de gestión del local: ventas, caja, stock, clientes, reparto y atención al cliente.',
        start_url='./#acceso',orientation='any',categories=['business','productivity'],
        shortcuts=[{'name':'Vender','url':'./#panel/vender'},{'name':'Reparto','url':'./#panel/reparto'},{'name':'Mi hoja de ruta','url':'./#panel/copiloto'}])
m2=dict(base,id='./?app=club',name='Accesorios para Ellos',short_name='Accesorios',description='La tienda de Accesorios para Ellos: catálogo, carrito, tu tarjeta del Club, beneficios y seguimiento de pedidos.',
        start_url='./#menu',orientation='portrait',categories=['shopping','lifestyle'],
        shortcuts=[{'name':'Tienda','url':'./#menu'},{'name':'Mi tarjeta del Club','url':'./#mitarjeta'}])
json.dump(m1,open(os.path.join(out,'app.webmanifest'),'w',encoding='utf8'),ensure_ascii=False,indent=1)
json.dump(m2,open(os.path.join(out,'club.webmanifest'),'w',encoding='utf8'),ensure_ascii=False,indent=1)
open(os.path.join(out,'sw.js'),'w',encoding='utf8').write(open(os.path.join(here,'pwa-sw.js'),encoding='utf8').read().replace('__VER__',ver))
print('pwa ok')
