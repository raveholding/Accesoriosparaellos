#!/bin/sh
# Reconstruye index.html: base Sistema VB (fuente única AlmacenRAVE/fuente, perfil demo) → estilo moda (build_newlook.py)
# → menú estilo Tienda Nube (patch_ur.py) → Accesorios para Ellos (patch_ape.py).
# BASE = salida de build_newlook.py (por defecto /home/claude/newlook-build/out/index.html).
set -e
cd "$(dirname "$0")"
BASE=${BASE:-/home/claude/newlook-build/out/index.html}
cp "$BASE" index.html
python3 fuentes/patch_ur.py index.html
python3 fuentes/patch_ape.py index.html
# app instalable (V26.69): manifiestos, íconos y sw.js con la marca del comercio, junto al index.html
VER=$(grep -o '"ver": "[^"]*"' index.html | head -1 | cut -d'"' -f4)
python3 fuentes/pwa.py . "ape $VER"
