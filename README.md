# Accesorios para Ellos · Demo Sistema VB

Demo de bazar de moda (accesorios + ropa de temporada, hombre y mujer) para un cliente que vende por TikTok. Archivo único `index.html` (HTML5/PWA, datos en el navegador). Panel: `#acceso` — ADMIN 1234 · Supervisor 1111 · Mostrador 0000. Tienda pública: `#menu`.

Base: demo Urban (SVBUrbanDemo). Cambios:
- Marca: logo del traje, paleta negro/blanco con acento dorado oscuro.
- 13 modelos nuevos con ilustración propia: gorras (béisbol, trucker, gorro de lana), relojes (clásico, digital, mujer), anillos (sello, fino; talles 14–22), cadena, pulsera, lentes (aviador, retro) y billetera. Categorías nuevas: Gorras, Relojes, Anillos y joyas, Lentes.
- «Visto en TikTok»: tira de 8 videos de ejemplo con código (TK-201…); el código se busca en el buscador de la tienda.
- Cupón de bienvenida `TIKTOK10` (10 % en el primer pedido), visible en la tienda con botón Copiar.
- Promos: 2x1 en gorras, −15 % con 3 productos, look completo −10 %.
- Mayorista del rubro: presentaciones Pack x6 / Curva x12 / Bulto x48 y precio por mayor según importe (desde $ 150.000 −15 %, desde $ 300.000 −25 %), en el mostrador y en el carrito de la tienda.

Armado: `./build.sh` parte de la demo Urban original y aplica `fuentes/patch_ur.py` + `fuentes/patch_ape.py`.

Límites: todo dato es de ejemplo (videos, vistas, precios, stock); las ilustraciones no son fotos (se cargan en Productos → Fotos y video); WhatsApp, pagos, envíos y facturación son simulados. Pruebas en Chromium; no se probó en Safari ni en celulares físicos.

Desarrollado por VINCULAR BUSINESS · (387) 4484132 · vincularbusiness@gmail.com
