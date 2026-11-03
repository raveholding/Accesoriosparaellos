import asyncio,json,sys
from playwright.async_api import async_playwright
URL='file:///home/claude/newlook-build/out/index.html'
OK=[];BAD=[]
def chk(n,c,extra=''):
    (OK if c else BAD).append(n+(' '+str(extra) if (extra!='' and not c) else ''))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text[:160]))
        await pg.goto(URL+'#menu');await pg.wait_for_timeout(2500)
        fr=[f for f in pg.frames if f!=pg.main_frame][0];F=pg.frame_locator('#pubframe')
        ev=lambda js:fr.evaluate(js)
        chk('19 tarjetas por modelo',await F.locator('.nl-tile').count()==19)
        chk('variantes ocultas',await ev("document.querySelector('.card[data-id]').offsetParent===null"))
        chk('contador Todos=19',(await ev("document.getElementById('count-all').textContent"))=='19')
        # buscador
        await F.locator('#search-input').fill('jean');await pg.wait_for_timeout(300)
        vis=await ev("Array.from(document.querySelectorAll('.nl-tile')).filter(t=>t.offsetParent!==null).length")
        chk('buscar jean -> 4',vis==4,vis)
        await F.locator('#search-input').fill('');await pg.wait_for_timeout(300)
        # chip categoria
        await F.locator('.cat-chip[data-cat="nl-pan"]').click();await pg.wait_for_timeout(300)
        vis=await ev("Array.from(document.querySelectorAll('.nl-tile')).filter(t=>t.offsetParent!==null).length")
        chk('chip Jeans -> 4',vis==4,vis)
        await F.locator('.cat-chip[data-cat="all"]').click();await pg.wait_for_timeout(300)
        # ---- ficha
        await F.locator('.nl-grid .nl-tile[data-fam="rem-bas"]').scroll_into_view_if_needed();await F.locator('.nl-grid .nl-tile[data-fam="rem-bas"]').click();await pg.wait_for_timeout(700)
        chk('ficha abierta',await ev("document.getElementById('nl-pdp').classList.contains('open')"))
        chk('CTA pide talle',(await F.locator('#nl-cta').inner_text()).strip().lower().startswith('elegí'))
        await F.locator('#nl-cta').click();await pg.wait_for_timeout(200)
        chk('sin talle no agrega',await ev("getComputedStyle(document.getElementById('cart-bar')).display")=='none')
        chk('tiembla la botonera',await ev("document.getElementById('nl-szs').classList.contains('nl-shake')"))
        chk('5 talles',await F.locator('.nl-chip').count()==5)
        await F.locator('.nl-chip[data-s="M"]').click();await pg.wait_for_timeout(200)
        chk('talle M marcado',await ev("document.querySelector('.nl-chip[data-s=M]').getAttribute('aria-checked')")=='true')
        chk('CTA agregar',(await F.locator('#nl-cta').inner_text()).strip().lower().startswith('agregar'))
        await pg.screenshot(path='out/u_pdp2.png')
        await F.locator('#nl-cta').click();await pg.wait_for_timeout(900)
        chk('carrito 1',(await ev("document.getElementById('cb-count').textContent"))=='1')
        chk('feedback agregado',True)
        # cambio de color y vista cuerpo
        await F.locator('.nl-sw').nth(1).click();await pg.wait_for_timeout(200)
        chk('color cambia',(await ev("document.getElementById('nl-cn').textContent"))=='Negro')
        await F.locator('.nl-tab[data-t=b]').click();await pg.wait_for_timeout(300)
        chk('vista cuerpo svg',await ev("!!document.querySelector('#nl-gal.av svg')"))
        await F.locator('.nl-tab[data-t=p]').click()
        # calce comunidad
        chk('barra de calce',await F.locator('.nl-fbar').count()==1)
        # guía
        await F.locator('#nl-gol').click();await pg.wait_for_timeout(300)
        chk('guia abre',await ev("document.getElementById('nl-guide').open"))
        chk('tabla 5 filas',await ev("document.querySelectorAll('#nl-gt tbody tr').length")==5)
        await F.locator('#nl-gt [data-u=in]').click();await pg.wait_for_timeout(100)
        chk('pulgadas',(await ev("document.querySelector('#nl-gt tbody td').textContent")).replace(',','.')!='82',await ev("document.querySelector('#nl-gt tbody td').textContent"))
        # mis medidas desde la ficha
        await F.locator('#nl-find').click();await pg.wait_for_timeout(300)
        await F.locator('#me-altura').fill('170');await F.locator('#me-pecho').fill('90')
        await F.locator('#me-ok').click();await pg.wait_for_timeout(500)
        chk('recomendado marcado',await ev("!!document.querySelector('.nl-chip.rec')"))
        rec=await ev("document.querySelector('.nl-chip.rec').getAttribute('data-s')");chk('talle rec = M',rec=='M',rec)
        chk('medidas guardadas',await ev("!!localStorage.getItem('nl.me')"))
        # cerrar y ver 'Tu talle' en la grilla
        await F.locator('#nl-back').click();await pg.wait_for_timeout(500)
        chk('Tu talle en tarjetas',await F.locator('.nl-yt').count()>=5,await F.locator('.nl-yt').count())
        # ---- agotado + aviso
        await pg.evaluate("(()=>{const p=S.products.find(x=>x.fam==='jea-rec'&&x.color==='denim'&&x.talle==='40');p.stock=0;p.loc.onl=0;p.loc.dep=6;})()")
        await pg.evaluate("window.RAVE_API&&0")
        await fr.evaluate("window.RAVE_MENU_RENDER&&window.RAVE_MENU_RENDER()");await pg.wait_for_timeout(500)
        await F.locator('.nl-grid .nl-tile[data-fam="jea-rec"]').scroll_into_view_if_needed();await F.locator('.nl-grid .nl-tile[data-fam="jea-rec"]').click();await pg.wait_for_timeout(600)
        await F.locator('.nl-chip[data-s="40"]').click();await pg.wait_for_timeout(200)
        chk('talle 40 agotado',await ev("document.querySelector('.nl-chip[data-s=\"40\"]').classList.contains('out')"))
        chk('CTA avisarme',(await F.locator('#nl-cta').inner_text()).lower().startswith('avisarme'))
        await F.locator('#nl-cta').click();await pg.wait_for_timeout(200)
        await F.locator('#nl-ct').fill('x');await F.locator('#nl-nsend').click();await pg.wait_for_timeout(200)
        chk('contacto inválido avisa',(await F.locator('#nl-nmsg').inner_text()).startswith('⚠'))
        await F.locator('#nl-ct').fill('3874123456');await F.locator('#nl-nsend').click();await pg.wait_for_timeout(300)
        n=await pg.evaluate("NL().notify.length");chk('aviso guardado en el panel',n==1,n)
        await pg.screenshot(path='out/u_pdp3.png')
        await F.locator('#nl-back').click();await pg.wait_for_timeout(300)
        # ---- carrito: pasos + envío bonificado
        await F.locator('#cart-bar').click();await pg.wait_for_timeout(400)
        chk('pasos en carrito',await F.locator('.nl-steps').count()==1)
        chk('barra de envío',await F.locator('#nl-free').count()==1)
        txt=await F.locator('#cart-items').inner_text();chk('prenda con color y talle en el pedido','Remera básica algodón' in txt and ('Blanco · M' in txt),txt[:80])
        await pg.screenshot(path='out/u_cart.png')
        await F.locator('#btn-close').click()
        # tope de stock
        await pg.evaluate("(()=>{const p=S.products.find(x=>x.fam==='rem-ove'&&x.color==='blanco'&&x.talle==='M');p.stock=1;p.loc.onl=1;})()")
        await fr.evaluate("window.RAVE_MENU_RENDER&&window.RAVE_MENU_RENDER()");await pg.wait_for_timeout(300)
        await F.locator('.nl-grid .nl-tile[data-fam="rem-ove"]').scroll_into_view_if_needed();await F.locator('.nl-grid .nl-tile[data-fam="rem-ove"]').click();await pg.wait_for_timeout(500)
        await F.locator('.nl-chip[data-s="M"]').click()
        for i in range(2):
            await F.locator('#nl-cta').click();await pg.wait_for_timeout(1500)
        chk('CTA tope de stock',(await F.locator('#nl-cta').inner_text()).lower().startswith('ya tenés'),await F.locator('#nl-cta').inner_text())
        await fr.evaluate("document.getElementById('nl-cta').click()");await pg.wait_for_timeout(300)
        q=await ev("(function(){var c=document.querySelector('.card[data-id=\"'+Array.from(document.querySelectorAll('.card')).filter(function(e){return e.dataset.name.indexOf('Remera oversize')===0&&e.dataset.name.indexOf('Blanco · M')>0})[0].dataset.id+'\"] .qty-val');return c.textContent})()")
        chk('no pasa del stock (2)',q=='2',q)
        # ---- escape cierra
        await fr.evaluate("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))");await pg.wait_for_timeout(500)
        chk('Esc cierra',not await ev("document.getElementById('nl-pdp').classList.contains('open')"))
        # overflow
        w=await pg.evaluate("document.documentElement.scrollWidth");chk('sin scroll horizontal 390',w<=390,w)
        chk('sin errores de consola/pagina',len(errs)==0,errs[:3])
        print('OK',len(OK),'FALLAN',len(BAD));[print(' ✗',x) for x in BAD]
        await b.close()
asyncio.run(main())
