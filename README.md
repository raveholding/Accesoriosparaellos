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
