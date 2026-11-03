import asyncio,json
from playwright.async_api import async_playwright
URL='file:///home/claude/newlook-build/out/index.html'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1280,'height':900})
        errs=[];pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)));pg.on('console',lambda m:m.type in('error','warning') and errs.append(m.type+' '+m.text))
        pg.on('dialog',lambda d:asyncio.ensure_future(d.accept()))
        await pg.goto(URL+'#acceso');await pg.wait_for_timeout(1500)
        await pg.locator('#login select').first.select_option('u1');await pg.locator('#login input').first.fill('1234')
        await pg.get_by_role('button',name='Ingresar').click();await pg.wait_for_timeout(3000)
        R={}
        async def go(sc):
            await pg.evaluate(f"location.hash='#panel/{sc}'");await pg.wait_for_timeout(500)
        # 1 probador con clienta
        await go('probador')
        cid=await pg.evaluate("S.customers.find(c=>c.nl&&c.nl.m&&c.nl.m.pecho).id")
        await pg.locator('#nl-cu').select_option(cid);await pg.wait_for_timeout(500)
        R['fit_rows']=await pg.evaluate("document.querySelectorAll('#nl-fit-out tbody tr').length")
        R['recom']=await pg.evaluate("(document.querySelector('#nl-fit-out').innerText.match(/Recomendado/g)||[]).length")
        await pg.screenshot(path='out/f_fit.png',full_page=True)
        # agregar al ticket
        await pg.locator('[data-act=nlFitAdd]').click();await pg.wait_for_timeout(600)
        R['hash']=await pg.evaluate("location.hash");R['poslines']=await pg.evaluate("pos.lines.length+' src='+pos.nlSrc+' cust='+pos.cust")
        # look completo -> ticket
        await go('probador')
        await pg.locator('#nl-cu').select_option(cid);await pg.wait_for_timeout(400)
        R['look_items']=await pg.evaluate("document.querySelectorAll('#nl-look-out tbody tr').length")
        R['look_promo']=await pg.evaluate("(document.querySelector('#nl-look-out .okbox')||{}).innerText||'sin promo'")
        await pg.screenshot(path='out/f_look.png',full_page=True)
        await pg.locator('[data-act=nlLookAdd]').click();await pg.wait_for_timeout(600)
        R['pos_after_look']=await pg.evaluate("pos.lines.map(l=>l.name+' x'+l.qty).join(' | ')")
        # cobrar en efectivo via commitSale
        R['sale']=await pg.evaluate("""(()=>{const ln=pos.lines.map(l=>({...l}));const n0=S.sales.length;const pts0=NL().points[pos.cust]||0;
          const r=commitSale('efectivo',false,'local',ln,{});const s=S.sales[S.sales.length-1];return JSON.stringify({ok:S.sales.length>n0,err:r&&r.err,total:s&&s.total,benefit:s&&s.benefit&&s.benefit.kind,src:s&&s.nlSrc,pts:(NL().points[s.cust]||0)-pts0,fit:NL().fitLog.filter(f=>f.sale===s.id).length})})()""")
        # omni: crear pedido
        await go('omni')
        R['order']=await pg.evaluate("""(()=>{const p=S.products.find(p=>p.fam&&p.loc.onl>=2);const r=nlOrderCreate({lines:[{pid:p.id,qty:2}],name:'Test',shipType:'envio',addr:'x',shipCost:350000,channel:'web'});return JSON.stringify({err:r.err,n:r.o&&r.o.n,onl:p.loc.onl})})()""")
        await go('omni');await pg.wait_for_timeout(300)
        await pg.locator('[data-act=nlOrdOpen]').first.click();await pg.wait_for_timeout(400)
        R['modal']=await pg.evaluate("document.querySelector('#modal-root .dlg h3').innerText")
        await pg.screenshot(path='out/f_order.png')
        await pg.evaluate("document.querySelectorAll('#modal-root .ov').forEach(x=>x.remove())")
        # ciclo por API de acciones
        R['cycle']=await pg.evaluate("""(()=>{const o=NL().orders[NL().orders.length-1];const el={dataset:{id:o.id}};const seq=[];
          A.nlOrdLink(el);seq.push(o.pay.link?'link':'nolink');A.nlOrdPaid(el);seq.push(o.state+':'+!!o.sale);A.nlOrdPick(el);A.nlOrdPack(el);A.nlOrdShip(el);seq.push(o.state+':'+o.ship.track);A.nlOrdDeliv(el);seq.push(o.state);
          const s=S.sales.find(x=>x.id===o.sale);seq.push('sale sess='+JSON.stringify(s.sessId)+' ch='+s.channel);return seq.join(' > ')})()""")
        # cancelar restaura
        R['cancel']=await pg.evaluate("""(()=>{const p=S.products.find(p=>p.fam&&p.loc.onl>=3);const b=p.loc.onl;const r=nlOrderCreate({lines:[{pid:p.id,qty:3}],name:'T2',shipType:'retiro',channel:'wa'});const mid=p.loc.onl;nlOrderRestore(r.o);return b+'>'+mid+'>'+p.loc.onl})()""")
        # moda
        await go('moda');await pg.wait_for_timeout(300);await pg.screenshot(path='out/f_moda.png',full_page=True)
        R['move']=await pg.evaluate("""(()=>{const p=S.products.find(p=>p.fam&&p.loc.dep>=4);const a=[p.stock,p.loc.dep];const r=nlMove(p.id,'dep','loc',2,'t');return JSON.stringify({err:r.err,a,b:[p.stock,p.loc.dep]})})()""")
        R['merma']=await pg.evaluate("""(()=>{const p=S.products.find(p=>p.fam&&p.stock>=2);const a=p.stock;const r=nlMerma(p.id,'loc',1,'mancha');return JSON.stringify({err:r.err,a,b:p.stock,bad:nlMerma(p.id,'loc',1,'').err})})()""")
        R['count']=await pg.evaluate("""(()=>{const ps=S.products.filter(p=>p.fam&&p.rubro==='nl-rem').slice(0,3);const rec=nlApplyCount('loc',ps.map((p,i)=>[p.id,p.stock+(i===0?-2:0)]),'Remeras');return JSON.stringify({adj:rec.adj,val:rec.val})})()""")
        # taller
        await go('taller')
        R['op']=await pg.evaluate("NL().prod.map(o=>o.n+':'+o.state).join(',')")
        R['recibir']=await pg.evaluate("""(async()=>{const o=NL().prod.find(x=>x.state==='terminacion');const p=prod(o.lines[0].pid);const d0=p.loc.dep,l0=p.stock;await A.nlOpNext({dataset:{id:o.id}});return JSON.stringify({st:o.state,dep:[d0,p.loc.dep],loc:[l0,p.stock]})})()""")
        # devolución
        R['ret']=await pg.evaluate("""(()=>{const p=S.products.find(p=>p.fam);const s0=p.stock;const r=nlReturn({pid:p.id,qty:1,reason:'talle_chico',refund:'vale'});const r2=nlReturn({pid:p.id,qty:1,reason:'defecto',refund:'vale'});return JSON.stringify({c:r.r.coupon,back:p.stock-s0,defecto:r2.r.toLoc})})()""")
        for sc in ['bimoda','cli360','omni','taller','moda']:
            await go(sc);await pg.wait_for_timeout(400)
        await go('bimoda');await pg.screenshot(path='out/f_bi.png',full_page=True)
        R['bi']=await pg.evaluate("[...document.querySelectorAll('.kpi')].map(k=>k.innerText.replace(/\\n/g,' ')).join(' || ')")
        await pg.evaluate("document.querySelectorAll('#modal-root .ov').forEach(x=>x.remove())");await go('cli360');await pg.locator('[data-act=nlC360Pick]').first.click();await pg.wait_for_timeout(300);await pg.screenshot(path='out/f_360.png',full_page=True)
        for k,v in R.items():print(k,'=>',v)
        print('ERRS',errs[:8]);await b.close()
asyncio.run(main())
