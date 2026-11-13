/* ===== Accesorios para Ellos · Ingreso con Google en la DEMO (2026-11-13) =====
   El ingreso real con Google (V26.30 / V26.66) usa Supabase Auth + Google Cloud y sólo aparece con la nube conectada.
   Esta demo trabaja sin nube (datos en el navegador), así que:
   - en «Acceso del equipo» se muestra el botón «Ingresar con Google», que explica cómo funciona en el sistema real y
     permite entrar a la demo con el usuario de prueba (no simula la pantalla de Google ni pide ninguna cuenta);
   - en Configuración → Equipo y seguridad se agrega la tarjeta «Ingreso con Google» con su estado y los pasos.
   Con la nube conectada (CLOUD.on) no hace nada: manda el botón y el asistente reales del sistema. */
(function(){
 const on=()=>typeof CLOUD!=='undefined'&&CLOUD&&CLOUD.on;
 const G='<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
 function loginBtn(){if(on())return;const lb=document.querySelector('#login .lbox');if(!lb||lb.querySelector('.ap-gbtn'))return;
  const ing=[...lb.querySelectorAll('button')].find(b=>/^\s*Ingresar\s*$/i.test(b.textContent||''));if(!ing)return;
  const w=document.createElement('div');w.className='ap-gwrap';
  w.innerHTML='<div class="ap-gor"><span>o</span></div><button type="button" class="btn ap-gbtn">'+G+'<span>Ingresar con Google</span></button><p class="sm mut ap-gnote">Con la nube conectada, cada persona del equipo entra con su Gmail.</p>';
  ing.insertAdjacentElement('afterend',w);
  w.querySelector('.ap-gbtn').addEventListener('click',()=>{
   modal('Ingresar con Google',`<p>En el sistema del comercio, cada persona del equipo entra con <b>el mismo Gmail con el que la invitó el administrador</b>: sin PIN que recordar y sin contraseñas nuevas. Si alguien pierde el acceso, se recupera con su cuenta de Google.</p>
    <ul><li>El administrador invita al Gmail y elige el rol (cajero, supervisor, repartidor…).</li><li>La persona toca <b>«Ingresar con Google»</b> y elige su cuenta.</li><li>Entra directo a lo que su rol permite. Cada ingreso queda en la auditoría.</li></ul>
    <p class="sm mut">Esta es una <b>demo de evaluación</b> sin nube conectada (los datos quedan en este navegador), por eso acá no se abre Google. Se activa al conectar la nube del comercio (Supabase + Google Cloud), lo configura Vincular Business una sola vez.</p>`,
    {okText:'Entrar a la demo como ADMIN',cancelText:'Volver',onOk:()=>{try{const lu=document.getElementById('lu');if(lu){lu.selectedIndex=0;}const lp=document.getElementById('lp');if(lp)lp.value='1234';A.login();}catch(e){}}});
  });}
 function cfgCard(){if(on()||typeof curScreen==='undefined'||curScreen!=='config')return;const v=document.getElementById('view');if(!v||v.querySelector('#ap-gcard'))return;
  const c=document.createElement('div');c.className='card';c.id='ap-gcard';
  c.innerHTML=`<h3>Ingreso con Google</h3><p class="sm mut">Que el equipo entre con su Gmail en vez de PIN, y que recuperar el acceso sea simple.</p>
   <ol class="gs-st"><li><span class="tag warn">Pendiente</span> Conectar la nube del comercio (Sistema → Nube).</li><li><span class="tag">Después</span> Vincular Business activa Google como proveedor de ingreso (Google Cloud + Supabase), una sola vez.</li><li><span class="tag">Después</span> Invitar a cada persona por su Gmail en <b>Usuarios y permisos</b> y elegir su rol.</li></ol>
   <p class="sm">Con la nube conectada, acá aparece el asistente con el estado en vivo y los valores exactos para copiar.</p>
   <div class="row"><button class="btn" data-act="nav" data-id="nube">Ir a Nube</button><button class="btn" data-act="nav" data-id="roles">Usuarios y permisos</button></div>`;
  v.appendChild(c);}
 const tick=()=>{try{loginBtn();cfgCard();}catch(e){}};
 const mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(tick,60);});
 const start=()=>{if(!document.body){setTimeout(start,200);return;}mo.observe(document.body,{childList:true,subtree:true});tick();};start();
})();
