# DEVLOG — Mapa Archimonstruos

## v0.6.0 — 2026-04-21

### Nuevas features

- **Modo Ruta — ventana flotante**: El panel de ruta ya no es un modal de pantalla completa. Se convierte en una mini-ventana flotante posicionada en la esquina inferior derecha, sobre el historial de capturas. No bloquea el mapa ni el sidebar.
- **Modo Ruta — Sig → marca revisado**: Al pulsar "Sig →", la parada actual queda marcada automáticamente como revisada antes de avanzar a la siguiente.
- **Modo Caza — ocultar capturados**: Nuevo botón `✕cap` en el sidebar visible en modo Caza para ocultar del árbol los archimonstruos ya capturados.
- **Modo Caza — sesión auto-limpieza**: Tras aplicar capturas en la sesión de caza, las entradas aplicadas desaparecen automáticamente de la lista.
- **Modo Caza — quitar botón ⚔ de zona**: El botón "Marcar zona como revisada" ya no aparece en modo Caza (donde no tiene utilidad).
- **Cooldowns instantáneos**: Al agregar un archimonstruo al cooldown, el timer aparece de forma inmediata en lugar de esperar hasta el siguiente tick del intervalo.
- **Filtro de etapa — números reales**: Los botones del filtro de etapa ahora muestran el número de paso real (4, 5, …, 18) en lugar de etiquetas 1-15.
- **Botón Modo Ruta — i18n**: El botón "Ruta" en el topbar ahora se traduce correctamente en todos los idiomas.
- **Botón Modo Ruta — estilo coherente**: Unificado visualmente con el botón Archidex.

### Datos

- **archi_catalog.json — remap quest_step**: Todos los valores de `quest_step` reducidos en 16 (20→4, 21→5, …, 34→18) para alinear con los pasos reales del juego.

---

## v0.5.5 — 2026-04-20

- Archidex: página independiente vía `?archidex=1`
- Archidex: botón ⧉ para nueva pestaña sincronizada
- Archidex: filtro favoritos ★ y filtro piedra de alma
- Archidex: notas por archi
- Archidex: exportar/importar CSV
- Archidex: confirmación antes de vaciar inventario
- Criptas del Cementerio como zona subterránea
- Sistema inventario ↔ capturas bidireccional
- Multicuenta dinámico

## v0.5.4 — 2026-04-21 (sesión anterior)

- Modo Ruta: ruta óptima nearest-neighbor con navegación Sig→/←Ant
- Filtro de etapa en sidebar (quest_step)
- Filtro "Solo pendientes" (◉) oculta zonas 100% capturadas
- Fix: zonas 0/0 con filtros activos ya no aparecen
- Fix: filtro de piedra "Todos" no se traducía
- Fix: panel de ayuda en settings se abría al hacer toggle
- Retirado Gigantesca de ambos filtros de piedra
- Filtro de piedra en sidebar ahora refresca marcadores del mapa

## v0.4.9 — 2026-04-19

- Sistema de Subterráneos con panel de navegación
- 13 subterráneos indexados con nombres en 6 idiomas

## v0.4.5 — 2026-04-16

- Filtro de zonas estilo Excel (dropdown con checkboxes)
- Bonta y Brakmar: subzonas urbanas fusionadas

## v0.4.2 — 2026-04-16

- Tooltip de zona en polígonos del mapa
- Búsqueda por nombre de monstruo
- Barras de progreso inline en cabeceras

## v0.4.1 — 2026-04-16

- Botón ? en cada opción del settings con descripción

## v0.4.0 — 2026-04-11

- Efecto spotlight al hover (configurable)
- Fijar tooltip al hacer clic (configurable)

## v0.3.x — 2026-04-11

- Polígonos de zona dibujables
- Resaltado de zona en mapa/sidebar
- Botón ir a zona ↪
- Soporte multiidioma (es, en, fr, de, pt, it)

## v0.2.2 — base

- Mapa Leaflet CRS.Simple
- Sistema de captura con localStorage + Supabase
- Sidebar árbol zona → subzona → archi
- Modos Archi-Check y Caza
- Timer de respawn
