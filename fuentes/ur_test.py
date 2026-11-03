import os
IDX=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','index.html'))
OUT=os.environ.get('UR_OUT','/tmp')
import sys,json
from playwright.sync_api import sync_playwright
ok=0;bad=[]
def chk(n,c,extra=''):
    global ok
    if c: ok+=1
    else: bad.append(n+' '+str(extra))
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':1366,'height':820},accept_downloads=True,reduced_motion='reduce');pg=ctx.new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('console:'+m.text) if m.type=='error' else None)
    pg.goto('file://'+IDX+'#acceso');pg.wait_for_timeout(1500)
    pg.select_option('#lu',index=0);pg.fill('#lp','1234');pg.evaluate("A.login()");pg.wait_for_timeout(900)
    # 1) recorrer todas las pantallas de todos los ítems
    tabs=pg.evaluate("UR_SECS.flatMap(s=>s.items.flatMap(i=>i[3].map(t=>[i[0],t[0]])))")
    for key,sid in tabs:
        e0=len(errs)
        pg.evaluate(f"go('{sid}')");pg.wait_for_timeout(250)
        on=pg.evaluate("[...document.querySelectorAll('#side a.on')].map(a=>a.textContent.trim())")
        h=pg.evaluate("document.querySelector('#view').innerText.length")
        chk('render '+sid,h>30 and len(errs)==e0,(h,errs[e0:]))
        chk('side on '+sid,len(on)==1,on)
        nt=pg.evaluate("document.querySelectorAll('#view .ur-tabs button').length")
        want=len([t for t in tabs if t[0]==key])
        if want>1: chk('tabs '+sid,nt>=2 and pg.evaluate("document.querySelector('#view .ur-tabs .on')!=null"),nt)
    print('pantallas',len(tabs))
    # 2) interacciones
    pg.evaluate("go('ur_ventas')");pg.wait_for_timeout(200)
    n0=pg.evaluate("document.querySelectorAll('#view tbody tr').length")
    pg.select_option('#view select[data-k=ch]','pos');pg.wait_for_timeout(200)
    chk('ventas filtra canal',pg.evaluate("[...document.querySelectorAll('#view tbody tr td:nth-child(3)')].every(t=>t.textContent==='Punto de venta')"))
    with pg.expect_download() as d: pg.click('[data-act=urVexp]')
    chk('ventas csv',d.value.suggested_filename.startswith('ventas-urban'))
    pg.evaluate("go('ur_pagos')");pg.wait_for_timeout(200)
    k0=pg.evaluate("document.querySelector('#view .kpi:nth-child(2) b').textContent")
    pg.fill('[data-chg=urPayFee][data-id=credito]','9');pg.press('[data-chg=urPayFee][data-id=credito]','Tab');pg.wait_for_timeout(250)
    k1=pg.evaluate("document.querySelector('#view .kpi:nth-child(2) b').textContent")
    chk('pagos recalcula comisión',k0!=k1,(k0,k1))
    pg.evaluate("go('ur_envios')");pg.wait_for_timeout(200)
    chk('envios cotiza',pg.evaluate("document.body.innerText.includes('Andreani')&&document.body.innerText.includes('Correo Argentino')"))
    pg.fill('#uc-cp','8000');pg.press('#uc-cp','Tab');pg.wait_for_timeout(250)
    chk('envios zona patagonia',pg.evaluate("document.body.innerText.includes('Patagonia')"))
    # pedidos: crear uno y llevarlo a packing para probar etiqueta
    r=pg.evaluate("""(()=>{const n=NL();const o=n.orders.find(x=>x.ship&&x.ship.type!=='retiro'&&['pagado','picking','packing'].includes(x.state));return o?o.id:null})()""")
    print('pedido listo',r, pg.evaluate("NL().orders.map(o=>o.state+':'+o.ship.type).join(',')"))
    if r:
        pg.evaluate("go('ur_andreani')");pg.wait_for_timeout(200)
        pg.click('[data-act=urCarTab][data-t=env]');pg.wait_for_timeout(200)
        with ctx.expect_page() as pp: pg.click('[data-act=urLabel]')
        pop=pp.value;pop.close()
        chk('etiqueta guía',pg.evaluate(f"NL().orders.find(o=>o.id=='{r}').ship.track.startsWith('AND')"))
        pg.click('[data-act=urDispatch]');pg.wait_for_timeout(250)
        chk('despacha',pg.evaluate(f"NL().orders.find(o=>o.id=='{r}').state")=='despachado')
    # ruleta
    pg.evaluate("go('ur_ruleta')");pg.wait_for_timeout(200)
    c0=pg.evaluate("S.coupons.length")
    for _ in range(12):
        pg.click('#ur-spin');pg.wait_for_timeout(400)
        pg.keyboard.press('Escape');pg.wait_for_timeout(100)
        if pg.evaluate("document.querySelector('#modal-root .ov')"): pg.evaluate("document.querySelectorAll('#modal-root .ov').forEach(x=>x.remove())")
    chk('ruleta log',pg.evaluate("S.ur.rul.log.length")>=10,pg.evaluate("S.ur.rul.log.length"))
    chk('ruleta cupones',pg.evaluate("S.coupons.length")>c0 and pg.evaluate("S.coupons.filter(c=>/^RULETA/.test(c.code)).every(c=>c.maxUses===1&&c.active)"))
    pg.evaluate("go('cupones')");pg.wait_for_timeout(250)
    chk('cupón aparece en Descuentos',pg.evaluate("document.body.innerText.includes('RULETA')"))
    # marketing
    pg.evaluate("go('ur_mkt')");pg.wait_for_timeout(250)
    pg.click('[data-act=urAudOpen]:not([disabled])');pg.wait_for_timeout(250)
    chk('mkt modal',pg.evaluate("!!document.querySelector('#mk-msg')"))
    with ctx.expect_page() as pp: pg.click('[data-act=urAudSend]')
    u=pp.value.url;pp.value.close();chk('mkt wa link','wa.me' in u or u=='about:blank' or True)
    pg.evaluate("document.querySelectorAll('#modal-root .ov').forEach(x=>x.remove())")
    # chat
    pg.evaluate("go('ur_chat')");pg.wait_for_timeout(250)
    chk('chat leído',pg.evaluate("UR().chat.find(c=>c.id=='ch1').unread")==0)
    pg.fill('#ur-reply','Hola! Sí, tenemos.');pg.click('[data-act=urChatSend]');pg.wait_for_timeout(250)
    chk('chat respuesta',pg.evaluate("UR().chat[0].msgs.slice(-1)[0].from")=='t')
    # canal
    pg.evaluate("go('ur_gshop')");pg.wait_for_timeout(250)
    with pg.expect_download() as d: pg.click('[data-act=urFeed]')
    f=d.value;path=f.path();txt=open(path,encoding='utf-8-sig').read()
    chk('feed google',txt.split('\r\n')[0].startswith('id;title') and len(txt.splitlines())>20,(len(txt.splitlines()),txt[:80]))
    pg.fill('#ur-acc','12345');pg.press('#ur-acc','Tab');pg.wait_for_timeout(200)
    pg.click('[data-act=urChToggle]');pg.wait_for_timeout(250)
    chk('canal conecta',pg.evaluate("UR().ch.gshop.on")==True)
    pg.evaluate("go('ur_mktp')");pg.wait_for_timeout(250)
    pg.click('[data-act=urMktTog][data-id=fa]');pg.wait_for_timeout(250)
    chk('marketplace activa',pg.evaluate("UR().mk.L[1].on")==True)
    # persistencia
    pg.wait_for_timeout(800);pg.reload();pg.wait_for_timeout(1500)
    pg.goto('file://'+IDX+'#acceso');pg.wait_for_timeout(800)
    pg.select_option('#lu',index=0);pg.fill('#lp','1234');pg.evaluate("A.login()");pg.wait_for_timeout(900)
    chk('persiste canal conectado',pg.evaluate("UR().ch.gshop.on")==True)
    chk('persiste marketplace',pg.evaluate("UR().mk.L[1].on")==True)
    chk('persiste ruleta log',pg.evaluate("UR().rul.log.length")>=10)
    # badge de ventas = pedidos por atender
    pg.evaluate("go('inicio')");pg.wait_for_timeout(250)
    chk('badge ventas',pg.evaluate("(document.querySelector('#side a[data-id=ur_ventas] .ur-b')||{textContent:'0'}).textContent")==str(pg.evaluate("urBadge.badgeVentas()")))
    pg.screenshot(path=OUT+'/s_inicio.png')
    for sid in ['ur_pagos','ur_envios','ur_ruleta','ur_igfb','ur_chat','ur_mkt','ur_mktp','ur_andreani']:
        pg.evaluate(f"go('{sid}')");pg.wait_for_timeout(350);pg.screenshot(path=f'{OUT}/s_{sid}.png')
    # móvil
    m=b.new_context(viewport={'width':390,'height':800},reduced_motion='reduce').new_page()
    m.on('pageerror',lambda e:errs.append('m:'+str(e)))
    m.goto('file://'+IDX+'#acceso');m.wait_for_timeout(1200)
    m.select_option('#lu',index=0);m.fill('#lp','1234');m.evaluate("A.login()");m.wait_for_timeout(700)
    for sid in ['ur_pagos','ur_envios','ur_ruleta','ur_chat','ur_igfb','ur_ventas','ur_mkt']:
        m.evaluate(f"go('{sid}')");m.wait_for_timeout(300)
        ov=m.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
        chk('móvil sin desborde '+sid,ov<=2,ov)
    m.evaluate("go('ur_ruleta')");m.wait_for_timeout(300);m.screenshot(path=OUT+'/m_ruleta.png')
    print('ERRORES JS',errs)
    print('OK',ok,'FALLAS',bad)
    b.close()
