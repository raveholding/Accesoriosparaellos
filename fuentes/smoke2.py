import asyncio,sys,json
from playwright.async_api import async_playwright
URL='file:///home/claude/newlook-build/out/index.html'
SCR=['inicio','vender','probador','moda','omni','taller','bimoda','cli360','diseno','inventario','proveedores','clientes','caja','pedidos','cupones','menuadmin','config']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':900})
        errs=[];pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)));pg.on('console',lambda m:m.type=='error' and errs.append('CONSOLE '+m.text))
        await pg.goto(URL+'#acceso');await pg.wait_for_timeout(1500)
        await pg.locator('#login select').first.select_option('u1')
        await pg.locator('#login input').first.fill('1234')
        await pg.get_by_role('button',name='Ingresar').click();await pg.wait_for_timeout(3500)
        for sc in SCR:
            n0=len(errs)
            await pg.evaluate(f"location.hash='#panel/{sc}'");await pg.wait_for_timeout(700)
            t=await pg.evaluate("document.querySelector('#view').innerText.length")
            print(sc,t,errs[n0:][:2])
            await pg.screenshot(path=f'out/s_{sc}.png')
        print('total errs',errs[:6])
        await b.close()
asyncio.run(main())
