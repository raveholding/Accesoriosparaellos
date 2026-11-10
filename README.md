# Accesorios para Ellos · Demo Sistema VB

Demo de bazar de moda (accesorios + ropa de temporada, hombre y mujer) para un cliente que vende por TikTok. Archivo único `index.html` (HTML5/PWA, datos en el navegador). Panel: `#acceso` — ADMIN 1234 · Supervisor 1111 · Mostrador 0000. Tienda pública: `#menu`.

Base: demo Urban (SVBUrbanDemo). Cambios:
- Marca: logo del traje, paleta negro/blanco con acento dorado oscuro.
- 13 modelos nuevos con ilustración propia: gorras (béisbol, trucker, gorro de lana), relojes (clásico, digital, mujer), anillos (sello, fino; talles 14–22), cadena, pulsera, lentes (aviador, retro) y billetera. Categorías nuevas: Gorras, Relojes, Anillos y joyas, Lentes.
- «Visto en TikTok»: tira de 8 videos de ejemplo con código (TK-201…); el código se busca en el buscador de la tienda.
- Cupón de bienvenida `TIKTOK10` (10 % en el primer pedido), visible en la tienda con botón Copiar.
- Promos: 2x1 en gorras, −15 % con 3 productos, look completo −10 %.
- Mayorista del rubro: presentaciones Pack x6 / Curva x12 / Bulto x48 y precio por mayor según importe (desde $ 150.000 −15 %, desde $ 300.000 −25 %), en el mostrador y en el carrito de la tienda.

- Menú público rediseñado como app de compra: encabezado compacto con buscador y carrito, banner deslizable (novedades, cupón, mayorista), categorías con ícono, «Más vendidos», favoritos (corazón), calificaciones de ejemplo, ficha con colores/talles/beneficios y botones «Agregar al carrito» / «Comprar ahora», carrito con miniaturas y barra inferior (Inicio, Categorías, Favoritos, Carrito, WhatsApp). Paleta: verde petróleo #14302C, arena #F6F4EF, oro #B8924A.

Armado: `./build.sh` parte de la demo Urban original y aplica `fuentes/patch_ur.py` + `fuentes/patch_ape.py`.

Límites: todo dato es de ejemplo (videos, vistas, precios, stock); las ilustraciones no son fotos (se cargan en Productos → Fotos y video); WhatsApp, pagos, envíos y facturación son simulados. Pruebas en Chromium; no se probó en Safari ni en celulares físicos.

Desarrollado por VINCULAR BUSINESS · (387) 4484132 · vincularbusiness@gmail.com


## Tema del panel y del acceso del equipo
El panel (`#acceso` y todas las pantallas) usa el mismo lenguaje visual que el menú público: verde petróleo `#14302C`, arena `#F6F4EF`, oro `#B8924A`, tarjetas blancas redondeadas y tipografía Jost. Estilos en `fuentes/ap_panel.css` (se inyecta con `patch_ape.py`, que además reemplaza los negros/grises fijos por la paleta). Incluye modo oscuro en petróleo profundo.


## Actualización de caja y club/fidelización (Sistema VB V26.59, 2026-11-09)
Se tomó el código fuente único actualizado (Almacén RAVE, prompt `SISTEMA_VB_26F.md` hasta V26.59) y se aplicaron **sólo caja y club/fidelización**:
- **Caja y cobro:** importe recibido obligatorio en efectivo (debajo del total, botón «Justo», F12 deja el cursor ahí); Fiado y Cuenta corriente separados con vencimiento; cortes X numerados y corte Z correlativo; apertura de cajón; recargos/descuentos por medio de pago (ejemplo apagado); pantalla del cliente; aviso de número de caja ocupado; el cursor vuelve a «Buscar artículo».
- **Club y fidelización:** niveles Bronce/Plata/Oro, cumpleaños automático, monedero digital y gift cards, Día de Cuenta Comercio (cashback), ruleta/trivia, tarjeta digital del cliente a pantalla completa (`#mitarjeta`) que se actualiza sola, WhatsApp al cliente con su saldo desde la ficha, datos para facturar del cliente.
- **Fuera de esta actualización:** presupuestos y mermas (no figuran en el menú ni en Vender) y el Centro Inteligente (no se compila).
- WhatsApp de ejemplo de la tienda: (387) 4484132 (Vincular Business). Base local nueva `svb-accesorios-demo-v3`.

Cómo se arma: `AlmacenRAVE/fuente/build.py demo` sin Centro Inteligente → `fuentes/build_newlook.py` → `./build.sh` (patch_ur.py + patch_ape.py).
Pruebas: panel 159/159, tienda 28/28; del sistema base `xz1`, `ck1`, `wa1`, `fc1`, `fo1`, `fx1` y `mt1` pasan salvo diferencias de datos del rubro (promos y nivel Oro de las clientas de ejemplo, menú propio).


## Actualización completa al Sistema VB V26.65 y datos reales del local (2026-11-10)
- Base: código fuente único actualizado (Almacén RAVE, `SISTEMA_VB_26F.md`, V26.65), con las mismas funciones que la demo raveV2: caja (importe recibido obligatorio, Fiado/CC, cortes X/Z, cajón, pantalla del cliente), Club (niveles, cumpleaños, monedero, gift cards, ruleta/trivia, tarjeta digital), presupuestos, devoluciones parciales y mermas, atención al cliente (conversaciones), Recursos Humanos, buscador universal Ctrl + K, avisos en la barra que se actualizan solos y F1 → Vender. Además, lo propio del comercio: tienda tipo app, TikTok, cupón TIKTOK10, mayorista por importe, promos de accesorios.
- Sin ropa: el catálogo es de gorras, relojes, cadenas, anillos y pulseras, lentes de sol, billeteras/cintos/carteras y calzado. Sin probador de looks ni talleres de confección.
- Datos reales: Caseros 1036, Salta · lunes a sábados de 10 a 14 y de 17 a 22 · todos los medios de pago · envíos por cadetería y por Correo Argentino a todo el país · WhatsApp +54 9 387 474-7135 · Instagram @accesorios_para_ellos. Precios, stock y clientes siguen siendo de ejemplo.
- Dirección pública: https://vincularbusiness.github.io/accesorios-para-ellos-vb/ · base local `svb-accesorios-demo-v4`.
- Pruebas: panel 168/168, tienda 28/28; del sistema base pasan caja, Fiado/CC, WhatsApp al cliente, facturación, cursor de Vender y atención al cliente (las diferencias restantes son de datos del rubro o también fallan en la base).

- **Barra lateral y visual del sistema base (V26.61–V26.65):** botón «Vender POS» (F1) arriba y secciones plegables **Operación comercial · Logística e inventario · Clientes y Club · Equipo · Menú y web · Sistema**, con pestañas de «Gestión de caja» y «Club», ayuda por pantalla, tablero del turno de caja, buscador universal Ctrl + K y avisos que se actualizan solos. Los módulos de Accesorios para Ellos quedan dentro de esas secciones: Tablero del negocio y Ventas por canal (Resumen); Todas las ventas, Pedidos online y envíos, Cobros y medios de pago (Operación comercial); Variantes y ubicaciones, Fotos y video, Envíos y tarifas, Andreani, Correo Argentino (Logística e inventario); Cliente 360 y promos, Mensajes, Campañas, Ruleta (Clientes y Club); Tienda online, Diseño de la tienda, TikTok, Instagram y Facebook, WhatsApp, Google Shopping, ChatGPT Ads, Pinterest, Marketplaces (Menú y web); Aplicaciones (Sistema). El menú estilo Tienda Nube anterior se retiró.
- Pruebas: panel 184/184 (cada pantalla, sin errores de JavaScript, con su entrada marcada en la barra y las 6 secciones), tienda 28/28; del sistema base `ux1` (barra, pestañas, avisos, F1) y `crm2` pasan, salvo que el color de marca se adapta al modo oscuro.
- **Sin PedidosYa:** el comercio reparte por cadetería propia y Correo Argentino; la pantalla, el aviso, la exportación y la integración de PedidosYa no se muestran, y el Resumen muestra «Pedidos online por enviar».
- **Menú del celular:** ya no queda trabado abierto (fondo que lo cierra al tocar afuera, botón «Cerrar menú», Esc, y el logo lleva al Resumen y cierra el menú aunque ya estés ahí).
