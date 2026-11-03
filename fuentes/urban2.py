import asyncio
from playwright.async_api import async_playwright
URL='file:///home/claude/newlook-build/out/index.html'
OK=[];BAD=[]
def chk(n,c,extra=''):(OK if c else BAD).append(n+('' if c else ' '+str(extra)))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        # ---- 360 px con ficha abierta
        pg=await b.new_page(viewport={'width':360,'height':740})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text[:150]))
        await pg.goto(URL+'#menu');await pg.wait_for_timeout(2500);F=pg.frame_locator('#pubframe');fr=[f for f in pg.frames if f!=pg.main_frame][0]
        chk('360 sin overflow menú',await pg.evaluate("document.documentElement.scrollWidth")<=360 and await fr.evaluate("document.documentElement.scrollWidth")<=360,await fr.evaluate("document.documentElement.scrollWidth"))
        await F.locator('.nl-grid .nl-tile[data-fam="ves-mid"]').scroll_into_view_if_needed();await F.locator('.nl-grid .nl-tile[data-fam="ves-mid"]').click();await pg.wait_for_timeout(700)
        chk('360 sin overflow ficha',await fr.evaluate("document.getElementById('nl-pdp').scrollWidth")<=360,await fr.evaluate("document.getElementById('nl-pdp').scrollWidth"))
        await F.locator('.nl-tab[data-t=b]').click();await pg.wait_for_timeout(400)
        await pg.screenshot(path='out/u_360_body.png')
        # tamaños táctiles
        small=await fr.evaluate("Array.from(document.querySelectorAll('#nl-pdp button, #nl-pdp summary')).filter(b=>b.offsetParent&&(b.getBoundingClientRect().height<36||b.getBoundingClientRect().width<36)).map(b=>b.className+':'+Math.round(b.getBoundingClientRect().width)+'x'+Math.round(b.getBoundingClientRect().height))")
        chk('objetivos táctiles >=36',len(small)==0,small)
        # reduced motion
        pr=await b.new_page(viewport={'width':390,'height':800},reduced_motion='reduce')
        await pr.goto(URL+'#menu');await pr.wait_for_timeout(1500)
        op=await [f for f in pr.frames if f!=pr.main_frame][0].evaluate("Array.from(document.querySelectorAll('.nl-tile')).every(t=>getComputedStyle(t).opacity==='1')")
        chk('reduced-motion: tarjetas visibles sin animar',op)
        # ---- panel
        pp=await b.new_page(viewport={'width':1280,'height':900})
        pp.on('pageerror',lambda e:errs.append(str(e)))
        await pp.goto(URL+'#menu');await pp.wait_for_timeout(2000)
        await pp.evaluate("(()=>{NL().notify.push({id:'t1',ts:now(),fam:'jea-rec',color:'denim',talle:'40',contact:'3874123456',sent:false});})()")
        await pp.goto(URL+'#acceso');await pp.wait_for_timeout(1200)
        await pp.locator('#login select').first.select_option('u1');await pp.locator('#login input').first.fill('1234')
        await pp.get_by_role('button',name='Ingresar').click();await pp.wait_for_timeout(3000)
        await pp.evaluate("NL().notify.push({id:'t1',ts:now(),fam:'jea-rec',color:'denim',talle:'40',contact:'3874123456',sent:false});save();location.hash='#panel/bimoda'");await pp.wait_for_timeout(900)
        t=await pp.evaluate("document.querySelector('#view').innerText")
        chk('aviso en el tablero','Avisos de reposición' in t and 'Jean recto' in t and '3874123456' in t)
        chk('hay botón de avisar (stock online >0 o sin stock)','sin stock todavía' in t.lower() or 'avisar por' in t.lower())
        await pp.evaluate("document.querySelector('[data-act=nlNotifyDel]').click()");await pp.wait_for_timeout(400)
        chk('quitar aviso',await pp.evaluate("NL().notify.length")==0)
        # diseño: demo interactiva
        await pp.evaluate("location.hash='#panel/diseno'");await pp.wait_for_timeout(700)
        await pp.locator('.dc[data-s=L]').click();await pp.wait_for_timeout(200)
        chk('chip L marcado',await pp.evaluate("document.querySelector('.dc[data-s=L]').getAttribute('aria-checked')")=='true')
        await pp.locator('[data-act=nlDsAdd]').click();await pp.wait_for_timeout(300)
        chk('demo agregado',(await pp.locator('.cta').inner_text()).startswith('✓'))
        # modo oscuro
        await pp.evaluate("document.documentElement.setAttribute('data-theme','dark')");await pp.wait_for_timeout(300)
        await pp.screenshot(path='out/u_dark_diseno.png')
        await pp.evaluate("location.hash='#panel/inicio'");await pp.wait_for_timeout(900)
        await pp.screenshot(path='out/u_dark_inicio.png')
        await pp.evaluate("location.hash='#panel/vender'");await pp.wait_for_timeout(900)
        await pp.screenshot(path='out/u_dark_vender.png')
        chk('sin errores',len(errs)==0,errs[:3])
        print('OK',len(OK),'FALLAN',len(BAD));[print(' ✗',x) for x in BAD]
        await b.close()
asyncio.run(main())
