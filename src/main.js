import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

'use strict';

/* ══════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════ */
const CFG = {
  total: 286,
  img:     id  => `./icons/archis/${id}.webp`,
  imgRemote: id => `https://mydofus.de/storage/monster/webp/${id}.webp`,
  dofusdb: (id, lang='es') => `https://dofusdb.fr/${lang}/database/monster/${id}`,
  tileSize: 250,
  grid: { 1:{cols:8,rows:7}, 2:{cols:16,rows:13} },
  defaultCd: 60,
  iconW: 30,      // ← ancho del icono archi en px
  iconH: 33,      // ← alto del icono archi en px
  stoneSize: 25,  // ← tamaño del icono de piedra de alma en px
};

const STONES = [
  { max:50,   color:'#74b9ff', img:'./icons/50.png'   },
  { max:100,  color:'#55efc4', img:'./icons/100.png'  },
  { max:150,  color:'#ffeaa7', img:'./icons/150.png'  },
  { max:190,  color:'#fdcb6e', img:'./icons/190.png'  },
  { max:1000, color:'#ff7675', img:'./icons/1000.png' }
];

const I18N = {
  es: { modeCheck:'◉ Archi-Check', modeHunt:'⚔ Caza', searchPlaceholder:'Buscar archi o monstruo…', caplogEmpty:'Sin capturas aún', resetTitle:'↺ Reset', resetDesc:'Selecciona qué quieres eliminar:', resetChkCap:'Archimonstruos capturados', resetChkLog:'Historial de capturas', resetCancel:'Cancelar', resetConfirm:'↺ Reiniciar', resetDone:'↺ Reiniciado', resetPartCap:'capturas', resetPartLog:'historial', resetAnd:'y', cdTitle:'⏱ Cooldowns activos', cdEmpty:'Sin cooldowns', cdClearAll:'🗑 Limpiar todos', hPolygons:'Dibuja áreas de color sobre el mapa que delimitan cada subzona. Útil para orientarse y ver visualmente el progreso de cada área.', hHighlight:'Al hacer hover sobre una zona en el sidebar, resalta su polígono en el mapa. Y al hacer hover sobre un polígono en el mapa, resalta la zona correspondiente en el sidebar.', hGoto:'Muestra un botón ↪ junto a cada subzona en el sidebar. Al pulsarlo, el mapa se centra automáticamente sobre esa subzona.', hAutofly:'Al hacer clic en un archimonstruo en el sidebar, el mapa vuela hasta su posición y abre el tooltip. Si está desactivado, abre la ficha completa en un panel.', hTiplock:'Al hacer clic sobre un icono de archi en el mapa, el tooltip queda fijo en pantalla y no cambia al pasar el mouse por otros archis. Se cierra haciendo clic fuera.', hSpotlight:'Al hacer hover sobre un archimonstruo (en el sidebar o en el mapa), atenúa y reduce los demás iconos para destacar el que estás mirando.', hMarkers:'Muestra u oculta todos los iconos de archimonstruos sobre el mapa. Útil para ver mejor los polígonos de zona o tomar capturas limpias del mapa.', hStone:'Muestra el selector de piedra de alma en el sidebar para filtrar archimonstruos según el tamaño de piedra que requieren (Pequeña, Mediana, Grande, Enorme, Gigantesca).', hFav:'Muestra el botón de estrella ★ junto a cada archimonstruo en el sidebar para marcarlo como favorito y filtrarlo con el botón ★ de la búsqueda.', hCazanotif:'Solo en modo Caza. Muestra una notificación en pantalla cuando el contador de respawn de un archimonstruo llega a cero y puede volver a aparecer.', hMulti:'Permite llevar el conteo de capturas para varias cuentas simultáneamente (de 2 a 20). Cada clic en "capturado" avanza el contador de la siguiente cuenta en turno.', hDaymode:'Cambia la paleta de colores de oscura (modo noche) a clara (modo día). Útil para usar en entornos con mucha luz ambiental.', hProgbar:'Muestra una fina barra de progreso en la parte superior de la pantalla indicando cuántos archimonstruos has capturado del total (286).', hStats:'Muestra un panel en el sidebar con el progreso de captura desglosado por zona y subzona, con barras de progreso individuales.', hCaplog:'Muestra un registro en la esquina inferior derecha con los últimos archimonstruos capturados durante la sesión actual, con la hora de cada captura.', optTitle:'Opciones', capMark:'Marcar como capturado', capUnmark:'Desmarcar', capAccounts:'cuentas', capAdd:'Añadir', tipHint:'Clic para más info →', tipHintClose:'Clic fuera para cerrar ✕', unknownLevel:'Nivel desconocido', noLevelData:'Sin datos de nivel', dofusdbLink:'Ver en DofusDB ↗', stones:['Pequeña','Mediana','Grande','Enorme','Gigantesca'], stoneLabel:'Piedra de Alma', stonesTitle:'Piedras de Alma necesarias', allCap:'¡Todo capturado! 🎉', noLevel:'archis sin nivel', noZone:'Sin zona', noSub:'—', unknownStone:'desconocida', zona:'Zona', subzona:'Subzona', nivel:'Nivel', piedra:'Piedra de Alma', coords:'Coords', info:'Info', sdSubzonas:'Visualización de subzonas', sdPolygons:'Polígonos de zona', sdTooltip:'Tooltip al hover', sdHighlight:'Resaltar zona en sidebar', sdGoto:'Botón ↪ ir a zona', sdArchi:'Visualización de archimonstruo', sdAutoFly:'Ir automáticamente al archi', sdStoneFilter:'Mostrar filtro de piedra', sdFavBtn:'Mostrar botón favorito', sdMarkersHide:'Mostrar iconos del mapa', sdCloneDots:'Mini-dot en clones', hCloneDots:'Los archimonstruos con varios spawns en el mapa muestran sus copias con un tinte naranja, menor tamaño y opacidad reducida. Así destacas el spawn principal y reduces la aglomeración visual.', sdSpotlight:'Efecto spotlight al hover', sdTipLock:'Fijar tooltip al hacer clic', sdCazaNotif:'Notificaciones de respawn', sdCuentas:'Cuentas', sdMulti:'Multicuenta', sdMultiN:'Nº cuentas (2–20)', sdTheme:'Apariencia', sdDayOn:'🌞 Modo día', sdDayOff:'🌙 Modo noche', sdDatos:'Datos', sdInterface:'Interfaz', sdProgressBar:'Barra de progreso', sdHomeBtn:'Botón inicio (🏠)', sdKeyShortcuts:'Atajos de teclado', sdStats:'Panel de estadísticas', sdCaptureLog:'Historial de capturas', sdZoneAnim:'Animación zona completa', sdPresMode:'Modo presentación', kbSearch:'Búsqueda', kbCheck:'Archi-Check', kbHunt:'Caza', kbCapture:'Capturar archi visible', kbDiscard:'Descarte', kbUnderground:'Subterráneo', kbHome:'Inicio del mapa', kbPresentation:'Presentación', kbHintCap:'✓ Capturado', showCapOn:'✕ Captura', showCapOff:'👁 Descarte', showCapTitle:'Modo descarte: capturados visibles pero atenuados en el mapa', favTitle:'Mostrar solo favoritos', notifRespawn:'⏰ {0} ha respawneado!', notifDead:'💀 {0} — {1}min', notifUndead:'{0} desmarcado', notifCdCleared:'🗑 {0} cooldowns eliminados', notifZoneDone:'🎉 ¡{0} completada!', notifZonesLoaded:'✓ {0} zonas cargadas', notifProgressExported:'Progreso exportado', notifProgressImported:'Importados {0} archimonstruos', notifLogout:'Sesión cerrada', notifSyncActive:'☁ Sincronización activa', notifSyncUploaded:'☁ Progreso local subido a la nube', notifSyncLoaded:'☁ Progreso cargado desde la nube', notifDevOn:'🔧 Modo DEV activado', notifDevOff:'Modo DEV desactivado', notifMapExported:'Mapa exportado ✓', clTitle:'📋 Historial', statsTitle:'Estadísticas', presExit:'✕ Salir', zfTitle:'Filtrar por zona', zfAll:'Todas', zfNone:'Ninguna', zfNoneSelected:'⚠ Sin zonas seleccionadas', zfFilteredN:'📍 {0} zonas filtradas', kbClose:'Cerrar', ugBtnTitle:'Modo subterráneo', ugNavTitle:'Subterráneos', ugNavEmpty:'Sin subterráneos', ugSurface:'Superficie', sdUgEntrances:'Entradas subterráneas', hUgEntrances:'Muestra los iconos 🕳 en el mapa que marcan las entradas a zonas subterráneas. Al hacer clic en uno, accedes directamente a esa zona. Al hacer hover, se ilumina el área correspondiente.', sdCaza:'Modo Caza', sdSpotlightSidebar:'Spotlight al hover (sidebar)', hSpotlightSidebar:'Al hacer hover sobre un archimonstruo en el sidebar izquierdo, atenúa los demás iconos del mapa. Desactívalo si prefieres que el sidebar no afecte la visibilidad del mapa.', hsTitle:'📋 Sesión de caza', hsSub:'{0} archis cazados esta sesión', hsSubNone:'Sin kills en esta sesión', hsApply:'✓ Aplicar capturas', hsClear:'🗑 Limpiar sesión', hsEmpty:'Sin kills registrados aún. Ve a cazar y vuelve aquí.', hsAlreadyCap:'ya capturado', hsKills:'💀 {0}', hsSelectAll:'Seleccionar todos', hsDeselectAll:'Deseleccionar todos', notifHsApplied:'{0} capturas aplicadas', notifHsCleared:'Sesión de caza limpiada', adxTitle:'📖 Bestiario', adxBtn:'📖 Bestiario', adxAll:'Todos', adxCaptured:'Capturados', adxPending:'Pendientes', adxInstock:'En stock', adxCapOf:'{0} / {1} capturados', adxInvTotal:'{0} archis · {1} uds.', adxEmpty:'Sin resultados.', adxSortStep:'Nº paso', adxSortName:'Nombre', adxSortLevel:'Nivel', adxSortStock:'Stock', notifInvCleared:'Inventario vaciado', adxNotes:'Notas', adxFavorites:'Favoritos', notifCsvExported:'Inventario exportado', notifCsvImported:'Inventario importado', notifTabSync:'↕ Sincronizado desde otra pestaña', adxClrTitle:'🗑 Vaciar inventario', adxClrDesc:'¿Seguro? Se borrará el inventario y las capturas quedarán en cero.', adxClrOk:'🗑 Vaciar', adxClrCancel:'Cancelar', sfAll:'Todas', stepLbl:'Etapa', stepAll:'Todas', hideDoneLbl:'Solo pendientes', rtTitle:'🗺 Modo Ruta', rtEmpty:'Añade subzonas con ➕ del sidebar, o usa ⚡ Auto para calcular la ruta óptima.', rtPending:'pend.', rtAuto:'⚡ Auto', rtClear:'🗑 Limpiar', rtPrev:'← Ant', rtNext:'Sig →', rtAddTitle:'Añadir a ruta', rtAlready:'ya está en la ruta', rtAdded:'añadida a la ruta', rtCalced:'Ruta: {0} zonas', rtAllDone:'Todas las paradas chequeadas ✓', rtNoPending:'Sin zonas pendientes', rtChecked:'Chequeada', rtUncheck:'Desmarcar', rtBtn:'🗺 Ruta', huntHideCap:'Ocultar capturados', rtAddZone:'Añadir zona completa a ruta', rtAutoZone:'⚡ Ruta solo esta zona', sdRouteBtn:'Botones ➕ de ruta en zonas', hRouteBtn:'Muestra los botones ➕ en subzonas y el botón ▦ en zonas para añadirlas rápidamente a la ruta.', sdCompact:'Modo compacto', hCompact:'Reduce el tamaño de los ítems del sidebar para ver más archimonstruos por pantalla.', sdTutorial:'Ver tutorial', tutSkip:'Saltar', tutNext:'Siguiente →', tutPrev:'← Anterior', tutFinish:'¡Empezar!', tutStep:'Paso {0} de {1}', tut1Title:'Bienvenido a ARCHIDEX', tut1Body:'Tu guía para cazar todos los archimonstruos de Dofus. En unos pasos te mostramos lo esencial.', tut2Title:'El mapa', tut2Body:'Aquí aparecen todos los archimonstruos. Haz clic en un icono para ver su info y marcarlo como capturado.', tut3Title:'Modos de juego', tut3Body:'Archi-Check es para marcar capturas. El Modo Caza activa cooldowns de respawn para sesiones activas de caza.', tut4Title:'El sidebar', tut4Body:'Lista todos los archis por zona y subzona. Usa la búsqueda y los filtros para localizar cualquier archi.', tut5Title:'Capturar un archi', tut5Body:'Haz clic en el botón ✓ junto a cualquier archi para marcarlo. El contador del topbar se actualiza al instante.', tut6Title:'Bestiario', tut6Body:'Gestiona tu inventario, filtra por piedra de alma, añade notas y exporta tu progreso en CSV.', tut7Title:'Opciones', tut7Body:'Personaliza la apariencia, gestiona multicuenta, activa el modo compacto y mucho más.', tut8Title:'¡Todo listo!', tut8Body:'Ya conoces lo esencial. Puedes repetir este tutorial desde Opciones en cualquier momento.', tutRouteTitle:'Modo Ruta', tutRouteBody:'Planifica tu recorrido de caza: añade subzonas con ➕, usa ⚡ Auto para la ruta óptima y navega con ← Ant / Sig →. El mapa vuela a cada parada automáticamente.', tut4MobBody:'Toca ☰ para abrir la lista de archis por zona. Usa la búsqueda y los filtros para localizar cualquier archi.', notifMapLoading:'Cargando mapa…', betaNothingSelected:'Nada seleccionado', betaNoSpawns:'Sin spawns en el mapa', betaDeleteConfirm:'¿Borrar los {0} spawns del mapa? Esta acción no se puede deshacer.', betaAllDeleted:'Todos los spawns eliminados', betaNoNewSpawns:'Sin spawns nuevos que añadir', betaCancelSel:'✕ Cancelar selección', betaSpawnDeleted:'✕ Spawn eliminado', betaSelectedN:'{0} seleccionados', treeEmpty:'Usa el modo Beta para añadir archimonstruos.', searchMoreN:'... y {0} más — refina la búsqueda', killsSession:'kills esta sesión', ttlMarkSub:'Marcar/desmarcar subzona', ttlGotoZone:'Ir a zona en el mapa', ttlFav:'Favorito', ttlAddCooldown:'Agregar a cooldown', ttlMarkZone:'Marcar/desmarcar zona', ttlRevZone:'Marcar zona como revisada', ttlGotoZoneShort:'Ir a zona', ttlReload:'Recargar página (F5)', ttlSettings:'Opciones', treeCollapseAll:'⊟ Todo', ttlCollapseAll:'Colapsar todo', treeExpandAll:'⊞ Todo', ttlExpandAll:'Expandir todo', zfViewAll:'✕ Ver todo', ttlHideDone:'Solo pendientes', ttlHuntHideCap:'Ocultar capturados', ttlCompact:'Modo compacto', bdo:'Opciones de arrastre', betaStartSel:'☐ Seleccionar para borrar', rtCopied:'📋 Ruta copiada', rtExport:'📋 Copiar', rtDragHint:'Arrastra para reordenar', rtSeed:'🔗 Semilla', rtImport:'📥 Importar', rtSeedCopied:'🔗 Semilla copiada', rtSeedPrompt:'Pega la semilla de ruta:', rtSeedInvalid:'Semilla invalida', rtSeedLoaded:'{0} paradas importadas' },
  en: { modeCheck:'◉ Archi-Check', modeHunt:'⚔ Hunt', searchPlaceholder:'Search archi or monster…', caplogEmpty:'No captures yet', resetTitle:'↺ Reset', resetDesc:'Select what you want to delete:', resetChkCap:'Captured archimosters', resetChkLog:'Capture history', resetCancel:'Cancel', resetConfirm:'↺ Reset', resetDone:'↺ Reset', resetPartCap:'captures', resetPartLog:'history', resetAnd:'and', cdTitle:'⏱ Active cooldowns', cdEmpty:'No cooldowns', cdClearAll:'🗑 Clear all', hPolygons:'Draws colored areas on the map delimiting each subzone. Useful for orientation and visually tracking progress per area.', hHighlight:'When hovering a zone in the sidebar, highlights its polygon on the map. When hovering a polygon on the map, highlights the corresponding zone in the sidebar.', hGoto:'Shows a ↪ button next to each subzone in the sidebar. Clicking it automatically centers the map on that subzone.', hAutofly:'Clicking an archimoster in the sidebar flies the map to its position and opens the tooltip. If disabled, opens the full info panel instead.', hTiplock:'Clicking an archi icon on the map locks the tooltip in place; it does not change when hovering other archis. Click outside to close.', hSpotlight:'When hovering an archimoster (in the sidebar or map), dims and shrinks the other icons to highlight the one you are looking at.', hMarkers:'Shows or hides all archimoster icons on the map. Useful for viewing zone polygons more clearly or taking clean map screenshots.', hStone:'Shows the soul stone selector in the sidebar to filter archimosters by the stone size they require (Small, Medium, Large, Huge, Gigantic).', hFav:'Shows a ★ button next to each archimoster in the sidebar to mark it as a favourite and filter it with the ★ search button.', hCazanotif:'Hunt mode only. Shows an on-screen notification when the respawn timer of an archimoster reaches zero and it can appear again.', hMulti:'Tracks capture counts for multiple accounts simultaneously (2–20). Each click on "captured" advances the counter for the next account in turn.', hDaymode:'Switches the colour palette from dark (night mode) to light (day mode). Useful in bright ambient light environments.', hProgbar:'Shows a thin progress bar at the top of the screen indicating how many archimosters you have captured out of the total (286).', hStats:'Shows a panel in the sidebar with capture progress broken down by zone and subzone, with individual progress bars.', hCaplog:'Shows a log in the bottom-right corner with the last archimosters captured during the current session, with the time of each capture.', optTitle:'Options',  capMark:'Mark as captured',    capUnmark:'Unmark',    capAccounts:'accounts', capAdd:'Add', tipHint:'Click for more info →', tipHintClose:'Click outside to close ✕', unknownLevel:'Unknown level', noLevelData:'No level data', dofusdbLink:'View on DofusDB ↗', stones:['Small','Medium','Large','Huge','Gigantic'],         stoneLabel:'Soul Stone',     stonesTitle:'Soul Stones needed',         allCap:'All captured! 🎉',      noLevel:'archis without level', noZone:'No zone',     noSub:'—', unknownStone:'unknown',      zona:'Zone', subzona:'Subzone', nivel:'Level', piedra:'Soul Stone', coords:'Coords', info:'Info', sdSubzonas:'Subzone display', sdPolygons:'Zone polygons', sdTooltip:'Hover tooltip', sdHighlight:'Highlight in sidebar', sdGoto:'↪ Go to zone button', sdArchi:'Archimoster display', sdAutoFly:'Auto-fly to archi', sdStoneFilter:'Show stone filter', sdFavBtn:'Show favorite button', sdMarkersHide:'Show map icons', sdCloneDots:'Mini-dot on clones', hCloneDots:'Archimosters with multiple spawns show their duplicates tinted orange, at a smaller size and reduced opacity. This highlights the primary spawn and reduces visual clutter on the map.', sdSpotlight:'Spotlight effect on hover', sdTipLock:'Lock tooltip on click', sdCazaNotif:'Respawn notifications', sdCuentas:'Accounts', sdMulti:'Multi-account', sdMultiN:'No. accounts (2–20)', sdTheme:'Appearance', sdDayOn:'🌞 Day mode', sdDayOff:'🌙 Night mode', sdDatos:'Data', sdInterface:'Interface', sdProgressBar:'Progress bar', sdHomeBtn:'Home button (🏠)', sdKeyShortcuts:'Keyboard shortcuts', sdStats:'Stats panel', sdCaptureLog:'Capture history', sdZoneAnim:'Zone complete animation', sdPresMode:'Presentation mode', kbSearch:'Search', kbCheck:'Archi-Check', kbHunt:'Hunt', kbCapture:'Capture visible archi', kbDiscard:'Discard', kbUnderground:'Underground', kbHome:'Map home', kbPresentation:'Presentation', kbHintCap:'✓ Captured', showCapOn:'✕ Captures', showCapOff:'👁 Discard', showCapTitle:'Discard mode: captured visible but dimmed on the map', favTitle:'Show favourites only', notifRespawn:'⏰ {0} has respawned!', notifDead:'💀 {0} — {1}min', notifUndead:'{0} unmarked', notifCdCleared:'🗑 {0} cooldowns cleared', notifZoneDone:'🎉 {0} completed!', notifZonesLoaded:'✓ {0} zones loaded', notifProgressExported:'Progress exported', notifProgressImported:'{0} archimosters imported', notifLogout:'Logged out', notifSyncActive:'☁ Sync active', notifSyncUploaded:'☁ Local progress uploaded', notifSyncLoaded:'☁ Progress loaded from cloud', notifDevOn:'🔧 DEV mode on', notifDevOff:'DEV mode off', notifMapExported:'Map exported ✓', clTitle:'📋 History', statsTitle:'Statistics', presExit:'✕ Exit', zfTitle:'Filter by zone', zfAll:'All', zfNone:'None', zfNoneSelected:'⚠ No zones selected', zfFilteredN:'📍 {0} zones filtered', kbClose:'Close', ugBtnTitle:'Underground mode', ugNavTitle:'Underground zones', ugNavEmpty:'No underground zones', ugSurface:'Surface', sdUgEntrances:'Underground entrances', hUgEntrances:'Shows 🕳 icons on the map marking the entrances to underground zones. Click one to go directly to that zone. Hover to highlight its area.', sdCaza:'Hunt mode', sdSpotlightSidebar:'Spotlight on hover (sidebar)', hSpotlightSidebar:'When hovering an archimoster in the left sidebar, dims the other icons on the map. Disable if you prefer the sidebar not to affect map visibility.', hsTitle:'📋 Hunt session', hsSub:'{0} archis hunted this session', hsSubNone:'No kills this session', hsApply:'✓ Apply captures', hsClear:'🗑 Clear session', hsEmpty:'No kills recorded yet. Go hunt and come back.', hsAlreadyCap:'already captured', hsKills:'💀 {0}', hsSelectAll:'Select all', hsDeselectAll:'Deselect all', notifHsApplied:'{0} captures applied', notifHsCleared:'Hunt session cleared', adxTitle:'📖 Bestiary', adxBtn:'📖 Bestiary', adxAll:'All', adxCaptured:'Captured', adxPending:'Pending', adxInstock:'In stock', adxCapOf:'{0} / {1} captured', adxInvTotal:'{0} archis · {1} units', adxEmpty:'No results.', adxSortStep:'Step no.', adxSortName:'Name', adxSortLevel:'Level', adxSortStock:'Stock', notifInvCleared:'Inventory cleared', adxNotes:'Notes', adxFavorites:'Favourites', notifCsvExported:'Inventory exported', notifCsvImported:'Inventory imported', notifTabSync:'↕ Synced from another tab', adxClrTitle:'🗑 Clear inventory', adxClrDesc:'Are you sure? Inventory will be cleared and captures reset to zero.', adxClrOk:'🗑 Clear', adxClrCancel:'Cancel', sfAll:'All', stepLbl:'Stage', stepAll:'All', hideDoneLbl:'Pending only', rtTitle:'🗺 Route Mode', rtEmpty:'Add subzones with ➕ or use ⚡ Auto to calculate the optimal route.', rtPending:'pend.', rtAuto:'⚡ Auto', rtClear:'🗑 Clear', rtPrev:'← Prev', rtNext:'Next →', rtAddTitle:'Add to route', rtAlready:'already in route', rtAdded:'added to route', rtCalced:'Route: {0} zones', rtAllDone:'All stops checked ✓', rtNoPending:'No pending zones', rtChecked:'Checked', rtUncheck:'Uncheck', rtBtn:'🗺 Route', huntHideCap:'Hide captured', rtAddZone:'Add full zone to route', rtAutoZone:'⚡ Route this zone only', sdRouteBtn:'➕ Route buttons in zones', hRouteBtn:'Shows ➕ buttons on subzones and a ▦ button on zone headers to quickly add them to the route.', sdCompact:'Compact mode', hCompact:'Reduces the size of sidebar items to display more archimonsters per screen.', sdTutorial:'View tutorial', tutSkip:'Skip', tutNext:'Next →', tutPrev:'← Back', tutFinish:'Get started!', tutStep:'Step {0} of {1}', tut1Title:'Welcome to ARCHIDEX', tut1Body:'Your guide to hunting all Dofus archimonsters. This quick tour covers the essentials.', tut2Title:'The map', tut2Body:'All archimonsters appear here. Click any icon to see its info and mark it as captured.', tut3Title:'Game modes', tut3Body:'Archi-Check is for tracking captures. Hunt mode enables respawn cooldowns for active hunting sessions.', tut4Title:'The sidebar', tut4Body:'Lists all archis by zone and subzone. Use the search bar and filters to find any archi.', tut5Title:'Capturing an archi', tut5Body:'Click the ✓ button next to any archi to mark it as captured. The topbar counter updates immediately.', tut6Title:'Bestiary', tut6Body:'Manage your inventory, filter by soul stone, add notes, and export your progress to CSV.', tut7Title:'Options', tut7Body:'Customize appearance, manage multi-account, enable compact mode, and much more.', tut8Title:'All set!', tut8Body:'You know the essentials. You can replay this tutorial anytime from Options.', tutRouteTitle:'Route Mode', tutRouteBody:'Plan your hunting route: add subzones with ➕, use ⚡ Auto for the optimal path, and navigate with ← Prev / Next →. The map flies to each stop automatically.', tut4MobBody:'Tap ☰ to open the archi list by zone. Use the search bar and filters to find any archi.', notifMapLoading:'Loading map…', betaNothingSelected:'Nothing selected', betaNoSpawns:'No spawns on the map', betaDeleteConfirm:'Delete {0} spawns from the map? This action cannot be undone.', betaAllDeleted:'All spawns deleted', betaNoNewSpawns:'No new spawns to add', betaCancelSel:'✕ Cancel selection', betaSpawnDeleted:'✕ Spawn deleted', betaSelectedN:'{0} selected', treeEmpty:'Use Beta mode to add archimonsters.', searchMoreN:'... and {0} more — refine your search', killsSession:'kills this session', ttlMarkSub:'Mark/unmark subzone', ttlGotoZone:'Go to zone on map', ttlFav:'Favourite', ttlAddCooldown:'Add to cooldown', ttlMarkZone:'Mark/unmark zone', ttlRevZone:'Mark zone as reviewed', ttlGotoZoneShort:'Go to zone', ttlReload:'Reload page (F5)', ttlSettings:'Options', treeCollapseAll:'⊟ All', ttlCollapseAll:'Collapse all', treeExpandAll:'⊞ All', ttlExpandAll:'Expand all', zfViewAll:'✕ View all', ttlHideDone:'Pending only', ttlHuntHideCap:'Hide captured', ttlCompact:'Compact mode', bdo:'Drag options', betaStartSel:'☐ Select to delete', rtCopied:'📋 Route copied', rtExport:'📋 Copy', rtDragHint:'Drag to reorder', rtSeed:'🔗 Seed', rtImport:'📥 Import', rtSeedCopied:'🔗 Seed copied', rtSeedPrompt:'Paste route seed:', rtSeedInvalid:'Invalid seed', rtSeedLoaded:'{0} stops imported' },
  fr: { modeCheck:'◉ Archi-Check', modeHunt:'⚔ Chasse', searchPlaceholder:'Rechercher archi ou monstre…', caplogEmpty:'Aucune capture encore', resetTitle:'↺ Reset', resetDesc:'Sélectionnez ce que vous voulez supprimer :', resetChkCap:'Archimonsters capturés', resetChkLog:'Historique des captures', resetCancel:'Annuler', resetConfirm:'↺ Réinitialiser', resetDone:'↺ Réinitialisé', resetPartCap:'captures', resetPartLog:'historique', resetAnd:'et', cdTitle:'⏱ Cooldowns actifs', cdEmpty:'Aucun cooldown', cdClearAll:'🗑 Tout effacer', hPolygons:'Dessine des zones colorées sur la carte délimitant chaque sous-zone. Utile pour se repérer et visualiser la progression de chaque zone.', hHighlight:'Au survol d\'une zone dans la sidebar, met en évidence son polygone sur la carte. Au survol d\'un polygone, met en évidence la zone correspondante dans la sidebar.', hGoto:'Affiche un bouton ↪ à côté de chaque sous-zone dans la sidebar. En cliquant dessus, la carte se centre automatiquement sur cette sous-zone.', hAutofly:'En cliquant sur un archimonstre dans la sidebar, la carte vole jusqu\'à sa position et ouvre l\'infobulle. Sinon, ouvre la fiche complète dans un panneau.', hTiplock:'En cliquant sur une icône d\'archi sur la carte, l\'infobulle reste fixe et ne change pas en survolant d\'autres archis. Cliquer à l\'extérieur pour fermer.', hSpotlight:'Au survol d\'un archimonstre (sidebar ou carte), atténue et réduit les autres icônes pour mettre en valeur celui que vous regardez.', hMarkers:'Affiche ou masque toutes les icônes d\'archimonsters sur la carte. Utile pour mieux voir les polygones de zone ou prendre des captures d\'écran propres.', hStone:'Affiche le sélecteur de pierre d\'âme dans la sidebar pour filtrer les archimonsters selon la taille de pierre requise.', hFav:'Affiche le bouton ★ à côté de chaque archimonstre dans la sidebar pour le marquer comme favori et le filtrer avec le bouton ★ de la recherche.', hCazanotif:'Mode Chasse uniquement. Affiche une notification à l\'écran quand le minuteur de réapparition d\'un archimonstre atteint zéro.', hMulti:'Suit les compteurs de captures pour plusieurs comptes simultanément (2–20). Chaque clic sur "capturé" avance le compteur du compte suivant.', hDaymode:'Bascule la palette de couleurs de sombre (nuit) à claire (jour). Utile dans des environnements très lumineux.', hProgbar:'Affiche une fine barre de progression en haut de l\'écran indiquant combien d\'archimonsters vous avez capturés sur le total (286).', hStats:'Affiche un panneau dans la sidebar avec la progression des captures par zone et sous-zone, avec des barres de progression individuelles.', hCaplog:'Affiche un journal en bas à droite avec les derniers archimonsters capturés pendant la session, avec l\'heure de chaque capture.', optTitle:'Options',  capMark:'Marquer comme capturé', capUnmark:'Démarquer', capAccounts:'comptes', capAdd:'Ajouter', tipHint:'Cliquez pour plus →', tipHintClose:'Clic dehors pour fermer ✕', unknownLevel:'Niveau inconnu', noLevelData:'Pas de données', dofusdbLink:'Voir sur DofusDB ↗', stones:['Petite','Moyenne','Grande','Énorme','Gigantesque'], stoneLabel:"Pierre d'Âme",   stonesTitle:"Pierres d'Âme nécessaires",  allCap:'Tout capturé ! 🎉',     noLevel:'archis sans niveau',  noZone:'Pas de zone', noSub:'—', unknownStone:'inconnue',     zona:'Zone', subzona:'Souszone', nivel:'Niveau', piedra:"Pierre d'Âme", coords:'Coords', info:'Info', sdSubzonas:'Affichage sous-zones', sdPolygons:'Polygones de zone', sdTooltip:'Infobulle au survol', sdHighlight:'Surligner dans sidebar', sdGoto:'Bouton ↪ aller à la zone', sdArchi:'Affichage archimonstre', sdAutoFly:'Voler auto vers archi', sdStoneFilter:'Afficher filtre pierres', sdFavBtn:'Afficher bouton favori', sdMarkersHide:'Afficher icônes carte', sdCloneDots:'Mini-point sur les clones', hCloneDots:'Affiche les doublons du meme archimonstre sous forme de petit point colore au lieu du symbole complet, reduisant la surcharge visuelle de la carte.', sdSpotlight:'Effet spotlight au survol', sdTipLock:'Fixer l\'infobulle au clic', sdCazaNotif:'Notifs de respawn', sdCuentas:'Comptes', sdMulti:'Multi-compte', sdMultiN:'Nb comptes (2–20)', sdTheme:'Apparence', sdDayOn:'🌞 Mode jour', sdDayOff:'🌙 Mode nuit', sdDatos:'Données', sdInterface:'Interface', sdProgressBar:'Barre de progression', sdHomeBtn:'Bouton accueil (🏠)', sdKeyShortcuts:'Raccourcis clavier', sdStats:'Panneau stats', sdCaptureLog:'Historique captures', sdZoneAnim:'Animation zone complète', sdPresMode:'Mode présentation', kbSearch:'Recherche', kbCheck:'Archi-Check', kbHunt:'Chasse', kbCapture:'Capturer archi visible', kbDiscard:'Abandon', kbUnderground:'Souterrain', kbHome:'Accueil carte', kbPresentation:'Présentation', kbHintCap:'✓ Capturé', showCapOn:'✕ Captures', showCapOff:'👁 Rebut', showCapTitle:'Mode rebut : capturés visibles mais atténués sur la carte', favTitle:'Afficher les favoris uniquement', notifRespawn:'⏰ {0} est réapparu !', notifDead:'💀 {0} — {1}min', notifUndead:'{0} démarqué', notifCdCleared:'🗑 {0} cooldowns effacés', notifZoneDone:'🎉 {0} complétée !', notifZonesLoaded:'✓ {0} zones chargées', notifProgressExported:'Progression exportée', notifProgressImported:'{0} archimonsters importés', notifLogout:'Déconnecté', notifSyncActive:'☁ Sync active', notifSyncUploaded:'☁ Progression locale envoyée', notifSyncLoaded:'☁ Progression chargée depuis le cloud', notifDevOn:'🔧 Mode DEV activé', notifDevOff:'Mode DEV désactivé', notifMapExported:'Carte exportée ✓', clTitle:'📋 Historique', statsTitle:'Statistiques', presExit:'✕ Quitter', zfTitle:'Filtrer par zone', zfAll:'Toutes', zfNone:'Aucune', zfNoneSelected:'⚠ Aucune zone sélectionnée', zfFilteredN:'📍 {0} zones filtrées', kbClose:'Fermer', ugBtnTitle:'Mode souterrain', ugNavTitle:'Zones souterraines', ugNavEmpty:'Pas de zones souterraines', ugSurface:'Surface', sdUgEntrances:'Entrées souterraines', hUgEntrances:'Affiche les icônes 🕳 sur la carte marquant les entrées des zones souterraines. Cliquer dessus pour y accéder directement. Survoler pour illuminer la zone.', sdCaza:'Mode Chasse', sdSpotlightSidebar:'Spotlight au survol (sidebar)', hSpotlightSidebar:'Au survol d\'un archimonstre dans la sidebar gauche, atténue les autres icônes sur la carte. Désactiver si vous préférez que la sidebar n\'affecte pas la visibilité de la carte.', hsTitle:'📋 Session de chasse', hsSub:'{0} archis chassés cette session', hsSubNone:'Aucun kill cette session', hsApply:'✓ Appliquer les captures', hsClear:'🗑 Effacer la session', hsEmpty:'Aucun kill enregistré. Allez chasser et revenez ici.', hsAlreadyCap:'déjà capturé', hsKills:'💀 {0}', hsSelectAll:'Tout sélectionner', hsDeselectAll:'Tout désélectionner', notifHsApplied:'{0} captures appliquées', notifHsCleared:'Session de chasse effacée', adxTitle:'📖 Bestiaire', adxBtn:'📖 Bestiaire', adxAll:'Tous', adxCaptured:'Capturés', adxPending:'En attente', adxInstock:'En stock', adxCapOf:'{0} / {1} capturés', adxInvTotal:'{0} archis · {1} unités', adxEmpty:'Aucun résultat.', adxSortStep:'Nº étape', adxSortName:'Nom', adxSortLevel:'Niveau', adxSortStock:'Stock', notifInvCleared:'Inventaire vidé', adxNotes:'Notes', adxFavorites:'Favoris', notifCsvExported:'Inventaire exporté', notifCsvImported:'Inventaire importé', notifTabSync:'↕ Synchronisé depuis un autre onglet', adxClrTitle:'🗑 Vider inventaire', adxClrDesc:'Sûr ? L\'inventaire sera effacé et les captures remises à zéro.', adxClrOk:'🗑 Vider', adxClrCancel:'Annuler', sfAll:'Toutes', stepLbl:'Étape', stepAll:'Toutes', hideDoneLbl:'En attente seulement', rtTitle:'🗺 Mode Itinéraire', rtEmpty:'Ajoutez des sous-zones avec ➕ ou utilisez ⚡ Auto.', rtPending:'att.', rtAuto:'⚡ Auto', rtClear:'🗑 Vider', rtPrev:'← Préc', rtNext:'Suiv →', rtAddTitle:"Ajouter à l'itinéraire", rtAlready:"déjà dans l'itinéraire", rtAdded:"ajoutée à l'itinéraire", rtCalced:'Itinéraire : {0} zones', rtAllDone:'Toutes les étapes cochées ✓', rtNoPending:'Aucune zone en attente', rtChecked:'Cochée', rtUncheck:'Décocher', rtBtn:'🗺 Itinéraire', huntHideCap:'Cacher capturés', rtAddZone:'Ajouter la zone entière', rtAutoZone:'⚡ Itinéraire cette zone', sdRouteBtn:'Boutons ➕ de route', hRouteBtn:'Affiche les boutons ➕ sur les sous-zones et le bouton ▦ sur les zones pour les ajouter rapidement à l\'itinéraire.', sdCompact:'Mode compact', hCompact:'Réduit la taille des éléments de la sidebar pour afficher plus d\'archimonsters à l\'écran.', sdTutorial:'Voir tutoriel', tutSkip:'Passer', tutNext:'Suivant →', tutPrev:'← Précédent', tutFinish:'Commencer !', tutStep:'Étape {0} sur {1}', tut1Title:'Bienvenue sur ARCHIDEX', tut1Body:"Votre guide pour chasser tous les archimonsters de Dofus. Ce tour rapide couvre l'essentiel.", tut2Title:'La carte', tut2Body:"Tous les archimonsters apparaissent ici. Cliquez sur une icône pour voir ses infos et le marquer comme capturé.", tut3Title:'Modes de jeu', tut3Body:"Archi-Check sert à suivre les captures. Le mode Chasse active les cooldowns de réapparition pour les sessions de chasse.", tut4Title:'Le panneau latéral', tut4Body:"Liste tous les archis par zone et sous-zone. Utilisez la recherche et les filtres pour trouver n'importe quel archi.", tut5Title:'Capturer un archi', tut5Body:"Cliquez sur ✓ à côté d'un archi pour le marquer. Le compteur du topbar se met à jour instantanément.", tut6Title:'Bestiaire', tut6Body:"Gérez votre inventaire, filtrez par pierre d'âme, ajoutez des notes et exportez votre progression en CSV.", tut7Title:'Options', tut7Body:"Personnalisez l'apparence, gérez le multi-compte, activez le mode compact et bien plus encore.", tut8Title:'Tout est prêt !', tut8Body:"Vous connaissez l'essentiel. Vous pouvez relancer ce tutoriel à tout moment depuis Options.", tutRouteTitle:'Mode Itinéraire', tutRouteBody:'Planifiez votre parcours de chasse : ajoutez des sous-zones avec ➕, utilisez ⚡ Auto pour le chemin optimal et naviguez avec ← Préc / Suiv →. La carte vole vers chaque étape automatiquement.', tut4MobBody:'Touchez ☰ pour ouvrir la liste des archis par zone. Utilisez la recherche et les filtres pour trouver n\'importe quel archi.', notifMapLoading:'Chargement de la carte…', betaNothingSelected:'Rien de sélectionné', betaNoSpawns:'Aucun spawn sur la carte', betaDeleteConfirm:'Supprimer les {0} spawns ? Action irréversible.', betaAllDeleted:'Tous les spawns supprimés', betaNoNewSpawns:'Aucun nouveau spawn à ajouter', betaCancelSel:'✕ Annuler la sélection', betaSpawnDeleted:'✕ Spawn supprimé', betaSelectedN:'{0} sélectionnés', treeEmpty:'Utilisez le mode Bêta pour ajouter des archimonsters.', searchMoreN:'... et {0} de plus — affinez votre recherche', killsSession:'kills cette session', ttlMarkSub:'Marquer/démarquer sous-zone', ttlGotoZone:'Aller à la zone sur la carte', ttlFav:'Favori', ttlAddCooldown:'Ajouter au cooldown', ttlMarkZone:'Marquer/démarquer zone', ttlRevZone:'Marquer la zone comme révisée', ttlGotoZoneShort:'Aller à la zone', ttlReload:'Recharger la page (F5)', ttlSettings:'Options', treeCollapseAll:'⊟ Tout', ttlCollapseAll:'Tout réduire', treeExpandAll:'⊞ Tout', ttlExpandAll:'Tout développer', zfViewAll:'✕ Voir tout', ttlHideDone:'En attente seulement', ttlHuntHideCap:'Masquer capturés', ttlCompact:'Mode compact', bdo:'Options de déplacement', betaStartSel:'☐ Sélectionner pour supprimer', rtCopied:'📋 Itinéraire copié', rtExport:'📋 Copier', rtDragHint:'Glisser pour réorganiser', rtSeed:'🔗 Graine', rtImport:'📥 Importer', rtSeedCopied:'🔗 Graine copiée', rtSeedPrompt:'Collez la graine de parcours:', rtSeedInvalid:'Graine invalide', rtSeedLoaded:'{0} étapes importées' },
  de: { modeCheck:'◉ Archi-Check', modeHunt:'⚔ Jagd', searchPlaceholder:'Archi oder Monster suchen…', caplogEmpty:'Noch keine Fänge', resetTitle:'↺ Reset', resetDesc:'Wähle aus, was du löschen möchtest:', resetChkCap:'Gefangene Archimonster', resetChkLog:'Fangverlauf', resetCancel:'Abbrechen', resetConfirm:'↺ Zurücksetzen', resetDone:'↺ Zurückgesetzt', resetPartCap:'Fänge', resetPartLog:'Verlauf', resetAnd:'und', cdTitle:'⏱ Aktive Cooldowns', cdEmpty:'Keine Cooldowns', cdClearAll:'🗑 Alle löschen', hPolygons:'Zeichnet farbige Flächen auf der Karte, die jede Unterzone begrenzen. Nützlich zur Orientierung und für den visuellen Fortschritt.', hHighlight:'Beim Hover über eine Zone in der Sidebar wird das Polygon auf der Karte hervorgehoben. Beim Hover über ein Polygon wird die entsprechende Zone in der Sidebar markiert.', hGoto:'Zeigt eine ↪-Schaltfläche neben jeder Unterzone in der Sidebar. Ein Klick zentriert die Karte automatisch auf diese Unterzone.', hAutofly:'Ein Klick auf ein Archimonster in der Sidebar lässt die Karte zu seiner Position fliegen und öffnet den Tooltip. Sonst öffnet sich das Info-Panel.', hTiplock:'Ein Klick auf ein Archi-Symbol fixiert den Tooltip auf dem Bildschirm. Er ändert sich nicht beim Hover anderer Archis. Außerhalb klicken zum Schließen.', hSpotlight:'Beim Hover über ein Archimonster werden alle anderen Icons abgeblendet und verkleinert, um das betrachtete hervorzuheben.', hMarkers:'Zeigt oder versteckt alle Archimonster-Symbole auf der Karte. Nützlich zur besseren Sicht auf Zonenpolygone oder für saubere Screenshots.', hStone:'Zeigt den Seelensteinselektor in der Sidebar zum Filtern nach benötigter Steingröße an.', hFav:'Zeigt eine ★-Schaltfläche neben jedem Archimonster in der Sidebar, um es als Favorit zu markieren und mit dem ★-Suchfilter zu filtern.', hCazanotif:'Nur im Jagd-Modus. Zeigt eine Bildschirmbenachrichtigung, wenn der Respawn-Timer eines Archimonsters null erreicht.', hMulti:'Verfolgt Fangzähler für mehrere Konten gleichzeitig (2–20). Jeder Klick auf "gefangen" rückt den Zähler des nächsten Kontos vor.', hDaymode:'Wechselt die Farbpalette von dunkel (Nacht) zu hell (Tag). Nützlich in hellen Umgebungen.', hProgbar:'Zeigt einen dünnen Fortschrittsbalken oben auf dem Bildschirm an, der zeigt, wie viele Archimonster gefangen wurden (von 286).', hStats:'Zeigt ein Panel in der Sidebar mit dem Fangfortschritt nach Zone und Unterzone, mit individuellen Fortschrittsbalken.', hCaplog:'Zeigt ein Protokoll unten rechts mit den zuletzt gefangenen Archimonsters der aktuellen Sitzung und der Uhrzeit.', optTitle:'Optionen', capMark:'Als gefangen markieren', capUnmark:'Markierung aufheben', capAccounts:'Konten', capAdd:'Hinzufügen', tipHint:'Klicken für mehr Info →', tipHintClose:'Außen klicken zum Schließen ✕', unknownLevel:'Unbekannte Stufe', noLevelData:'Keine Stufendaten', dofusdbLink:'Auf DofusDB ansehen ↗', stones:['Kleiner','Mittlerer','Großer','Riesiger','Gewaltiger'], stoneLabel:'Seelenstein', stonesTitle:'Benötigte Seelensteine', allCap:'Alles gefangen! 🎉', noLevel:'Archis ohne Stufe', noZone:'Keine Zone', noSub:'—', unknownStone:'unbekannt', zona:'Zone', subzona:'Unterzone', nivel:'Stufe', piedra:'Seelenstein', coords:'Koord.', info:'Info', sdSubzonas:'Unterzonenansicht', sdPolygons:'Zonenpolygone', sdTooltip:'Hover-Tooltip', sdHighlight:'In Sidebar hervorheben', sdGoto:'↪ Zur Zone-Schaltfläche', sdArchi:'Archimonster-Ansicht', sdAutoFly:'Auto-Flug zum Archi', sdStoneFilter:'Seelenfilter anzeigen', sdFavBtn:'Favorit-Schaltfläche anzeigen', sdMarkersHide:'Kartensymbole anzeigen', sdCloneDots:'Mini-Punkt bei Klonen', hCloneDots:'Archimonster mit mehreren Spawns zeigen ihre Duplikate in Orange getönt, verkleinert und mit reduzierter Deckkraft. So hebt sich der Haupt-Spawn ab und die Karte wirkt übersichtlicher.', sdSpotlight:'Spotlight-Effekt beim Hover', sdTipLock:'Tooltip bei Klick fixieren', sdCazaNotif:'Respawn-Benachrichtigungen', sdCuentas:'Konten', sdMulti:'Multi-Konto', sdMultiN:'Anz. Konten (2–20)', sdTheme:'Erscheinungsbild', sdDayOn:'🌞 Tagmodus', sdDayOff:'🌙 Nachtmodus', sdDatos:'Daten', sdInterface:'Benutzeroberfläche', sdProgressBar:'Fortschrittsbalken', sdHomeBtn:'Startschaltfläche (🏠)', sdKeyShortcuts:'Tastenkürzel', sdStats:'Statistikbereich', sdCaptureLog:'Fangverlauf', sdZoneAnim:'Zonen-Animation', sdPresMode:'Präsentationsmodus', kbSearch:'Suche', kbCheck:'Archi-Check', kbHunt:'Jagd', kbCapture:'Sichtbaren Archi fangen', kbDiscard:'Verwerfen', kbUnderground:'Unterirdisch', kbHome:'Karte Startpunkt', kbPresentation:'Präsentation', kbHintCap:'✓ Gefangen', showCapOn:'✕ Fänge', showCapOff:'👁 Ausblenden', showCapTitle:'Ausblend-Modus: Gefangene sichtbar aber abgeblendet', favTitle:'Nur Favoriten anzeigen', notifRespawn:'⏰ {0} ist respawnt!', notifDead:'💀 {0} — {1}min', notifUndead:'{0} entfernt', notifCdCleared:'🗑 {0} Cooldowns gelöscht', notifZoneDone:'🎉 {0} abgeschlossen!', notifZonesLoaded:'✓ {0} Zonen geladen', notifProgressExported:'Fortschritt exportiert', notifProgressImported:'{0} Archimonster importiert', notifLogout:'Abgemeldet', notifSyncActive:'☁ Sync aktiv', notifSyncUploaded:'☁ Lokaler Fortschritt hochgeladen', notifSyncLoaded:'☁ Fortschritt aus der Cloud geladen', notifDevOn:'🔧 DEV-Modus aktiv', notifDevOff:'DEV-Modus deaktiviert', notifMapExported:'Karte exportiert ✓', clTitle:'📋 Verlauf', statsTitle:'Statistiken', presExit:'✕ Beenden', zfTitle:'Nach Zone filtern', zfAll:'Alle', zfNone:'Keine', zfNoneSelected:'⚠ Keine Zone ausgewählt', zfFilteredN:'📍 {0} Zonen gefiltert', kbClose:'Schließen', ugBtnTitle:'Unterwelt-Modus', ugNavTitle:'Unterweltzonen', ugNavEmpty:'Keine Unterweltzonen', ugSurface:'Oberfläche', sdUgEntrances:'Unterwelt-Eingänge', hUgEntrances:'Zeigt 🕳-Symbole auf der Karte, die Eingänge zu Untergrundgebieten markieren. Klicken zum direkten Zugang. Hover zum Hervorheben des Bereichs.', sdCaza:'Jagd-Modus', sdSpotlightSidebar:'Spotlight beim Hover (Sidebar)', hSpotlightSidebar:'Beim Hover über ein Archimonster in der linken Sidebar werden die anderen Kartenicons abgeblendet. Deaktivieren, wenn die Sidebar die Kartensicht nicht beeinflussen soll.', hsTitle:'📋 Jagdsitzung', hsSub:'{0} Archis in dieser Sitzung gejagt', hsSubNone:'Keine Kills in dieser Sitzung', hsApply:'✓ Fänge anwenden', hsClear:'🗑 Sitzung löschen', hsEmpty:'Noch keine Kills. Geh jagen und komm zurück.', hsAlreadyCap:'bereits gefangen', hsKills:'💀 {0}', hsSelectAll:'Alle auswählen', hsDeselectAll:'Alle abwählen', notifHsApplied:'{0} Fänge angewendet', notifHsCleared:'Jagdsitzung gelöscht', adxTitle:'📖 Bestiar', adxBtn:'📖 Bestiar', adxAll:'Alle', adxCaptured:'Gefangen', adxPending:'Ausstehend', adxInstock:'Auf Lager', adxCapOf:'{0} / {1} gefangen', adxInvTotal:'{0} Archis · {1} Stk.', adxEmpty:'Keine Ergebnisse.', adxSortStep:'Schritt-Nr.', adxSortName:'Name', adxSortLevel:'Stufe', adxSortStock:'Bestand', notifInvCleared:'Inventar geleert', adxNotes:'Notizen', adxFavorites:'Favoriten', notifCsvExported:'Inventar exportiert', notifCsvImported:'Inventar importiert', notifTabSync:'↕ Von anderem Tab synchronisiert', adxClrTitle:'🗑 Inventar leeren', adxClrDesc:'Sicher? Inventar wird geleert und Fänge auf null zurückgesetzt.', adxClrOk:'🗑 Leeren', adxClrCancel:'Abbrechen', sfAll:'Alle', stepLbl:'Stufe', stepAll:'Alle', hideDoneLbl:'Nur ausstehend', rtTitle:'🗺 Routen-Modus', rtEmpty:'Unterzonen mit ➕ hinzufügen oder ⚡ Auto nutzen.', rtPending:'ausst.', rtAuto:'⚡ Auto', rtClear:'🗑 Leeren', rtPrev:'← Zurück', rtNext:'Weiter →', rtAddTitle:'Zur Route hinzufügen', rtAlready:'bereits in der Route', rtAdded:'zur Route hinzugefügt', rtCalced:'Route: {0} Zonen', rtAllDone:'Alle Stopps geprüft ✓', rtNoPending:'Keine ausstehenden Zonen', rtChecked:'Geprüft', rtUncheck:'Abhaken', rtBtn:'🗺 Route', huntHideCap:'Gefangene ausblenden', rtAddZone:'Ganze Zone zur Route', rtAutoZone:'⚡ Nur diese Zone', sdRouteBtn:'➕ Routenschaltflächen', hRouteBtn:'Zeigt ➕-Schaltflächen an Unterzonen und ein ▦-Symbol an Zonenkopfzeilen zum schnellen Hinzufügen zur Route.', sdCompact:'Kompakter Modus', hCompact:'Verkleinert die Sidebar-Elemente, um mehr Archimonster auf dem Bildschirm anzuzeigen.', sdTutorial:'Tutorial anzeigen', tutSkip:'Überspringen', tutNext:'Weiter →', tutPrev:'← Zurück', tutFinish:'Loslegen!', tutStep:'Schritt {0} von {1}', tut1Title:'Willkommen bei ARCHIDEX', tut1Body:'Dein Leitfaden für die Jagd auf alle Archimonster in Dofus. Diese kurze Tour erklärt das Wesentliche.', tut2Title:'Die Karte', tut2Body:'Alle Archimonster erscheinen hier. Klicke auf ein Symbol, um dessen Infos zu sehen und es als gefangen zu markieren.', tut3Title:'Spielmodi', tut3Body:'Archi-Check dient zur Fangverfolgung. Der Jagd-Modus aktiviert Respawn-Cooldowns für aktive Jagdsitzungen.', tut4Title:'Die Seitenleiste', tut4Body:'Listet alle Archis nach Zone und Unterzone. Nutze Suche und Filter, um jeden Archi zu finden.', tut5Title:'Einen Archi fangen', tut5Body:'Klicke auf ✓ neben einem Archi, um ihn als gefangen zu markieren. Der Zähler aktualisiert sich sofort.', tut6Title:'Bestiar', tut6Body:'Verwalte dein Inventar, filtere nach Seelensteinen, füge Notizen hinzu und exportiere als CSV.', tut7Title:'Optionen', tut7Body:'Passe das Erscheinungsbild an, verwalte mehrere Konten, aktiviere den Kompaktmodus und vieles mehr.', tut8Title:'Alles bereit!', tut8Body:'Du kennst das Wesentliche. Du kannst dieses Tutorial jederzeit über Optionen wiederholen.', tutRouteTitle:'Routen-Modus', tutRouteBody:'Plane deine Jagdroute: füge Unterzonen mit ➕ hinzu, nutze ⚡ Auto für den optimalen Weg und navigiere mit ← Zurück / Weiter →. Die Karte fliegt automatisch zu jedem Stopp.', tut4MobBody:'Tippe auf ☰, um die Archis nach Zone zu öffnen. Nutze Suche und Filter, um jeden Archi zu finden.', notifMapLoading:'Karte wird geladen…', betaNothingSelected:'Nichts ausgewählt', betaNoSpawns:'Keine Spawns auf der Karte', betaDeleteConfirm:'{0} Spawns löschen? Diese Aktion ist nicht rückgängig zu machen.', betaAllDeleted:'Alle Spawns gelöscht', betaNoNewSpawns:'Keine neuen Spawns hinzuzufügen', betaCancelSel:'✕ Auswahl aufheben', betaSpawnDeleted:'✕ Spawn gelöscht', betaSelectedN:'{0} ausgewählt', treeEmpty:'Nutze den Beta-Modus, um Archimonster hinzuzufügen.', searchMoreN:'... und {0} weitere — Suche verfeinern', killsSession:'Kills diese Sitzung', ttlMarkSub:'Unterzone markieren/entmarkieren', ttlGotoZone:'Zur Zone auf der Karte gehen', ttlFav:'Favorit', ttlAddCooldown:'Zum Cooldown hinzufügen', ttlMarkZone:'Zone markieren/entmarkieren', ttlRevZone:'Zone als überprüft markieren', ttlGotoZoneShort:'Zur Zone', ttlReload:'Seite neu laden (F5)', ttlSettings:'Optionen', treeCollapseAll:'⊟ Alle', ttlCollapseAll:'Alle einklappen', treeExpandAll:'⊞ Alle', ttlExpandAll:'Alle ausklappen', zfViewAll:'✕ Alles anzeigen', ttlHideDone:'Nur ausstehend', ttlHuntHideCap:'Gefangene ausblenden', ttlCompact:'Kompakter Modus', bdo:'Zugoptionen', betaStartSel:'☐ Zum Löschen auswählen', rtCopied:'📋 Route kopiert', rtExport:'📋 Kopieren', rtDragHint:'Zum Neuordnen ziehen', rtSeed:'🔗 Saat', rtImport:'📥 Importieren', rtSeedCopied:'🔗 Saat kopiert', rtSeedPrompt:'Routensaat einfügen:', rtSeedInvalid:'Ungültige Saat', rtSeedLoaded:'{0} Stopps importiert' },
  pt: { modeCheck:'◉ Archi-Check', modeHunt:'⚔ Caça', searchPlaceholder:'Pesquisar archi ou monstro…', caplogEmpty:'Sem capturas ainda', resetTitle:'↺ Reset', resetDesc:'Seleciona o que queres eliminar:', resetChkCap:'Arquimonstros capturados', resetChkLog:'Histórico de capturas', resetCancel:'Cancelar', resetConfirm:'↺ Reiniciar', resetDone:'↺ Reiniciado', resetPartCap:'capturas', resetPartLog:'histórico', resetAnd:'e', cdTitle:'⏱ Cooldowns ativos', cdEmpty:'Sem cooldowns', cdClearAll:'🗑 Limpar todos', hPolygons:'Desenha áreas coloridas no mapa delimitando cada subzona. Útil para se orientar e ver visualmente o progresso de cada área.', hHighlight:'Ao passar o mouse por uma zona na sidebar, destaca o seu polígono no mapa. Ao passar pelo polígono, destaca a zona na sidebar.', hGoto:'Exibe um botão ↪ junto a cada subzona na sidebar. Ao clicar, o mapa centraliza automaticamente nessa subzona.', hAutofly:'Clicar num arquimonstro na sidebar faz o mapa voar até sua posição e abre o tooltip. Se desativado, abre a ficha completa num painel.', hTiplock:'Clicar num ícone de archi no mapa fixa o tooltip na tela; ele não muda ao passar o mouse por outros archis. Clicar fora para fechar.', hSpotlight:'Ao passar o mouse por um arquimonstro (sidebar ou mapa), esmaece e reduz os outros ícones para destacar o que está sendo visualizado.', hMarkers:'Exibe ou oculta todos os ícones de arquimonstros no mapa. Útil para ver melhor os polígonos de zona ou tirar capturas limpas.', hStone:'Exibe o seletor de pedra de alma na sidebar para filtrar arquimonstros pelo tamanho de pedra necessário.', hFav:'Exibe o botão ★ ao lado de cada arquimonstro na sidebar para marcá-lo como favorito e filtrá-lo com o botão ★ da pesquisa.', hCazanotif:'Somente no modo Caça. Exibe uma notificação em tela quando o timer de respawn de um arquimonstro chega a zero.', hMulti:'Controla contadores de capturas para várias contas simultaneamente (2–20). Cada clique em "capturado" avança o contador da próxima conta.', hDaymode:'Alterna a paleta de cores de escura (noite) para clara (dia). Útil em ambientes com muita luz ambiente.', hProgbar:'Exibe uma barra de progresso fina no topo da tela indicando quantos arquimonstros foram capturados do total (286).', hStats:'Exibe um painel na sidebar com o progresso de captura por zona e subzona, com barras de progresso individuais.', hCaplog:'Exibe um registro no canto inferior direito com os últimos arquimonstros capturados na sessão atual, com o horário de cada captura.', optTitle:'Opções',   capMark:'Marcar como capturado', capUnmark:'Desmarcar', capAccounts:'contas', capAdd:'Adicionar', tipHint:'Clique para mais info →', tipHintClose:'Clique fora para fechar ✕', unknownLevel:'Nível desconhecido', noLevelData:'Sem dados de nível', dofusdbLink:'Ver no DofusDB ↗', stones:['Pequena','Média','Grande','Enorme','Gigantesca'],   stoneLabel:'Pedra de Alma',  stonesTitle:'Pedras de Alma necessárias', allCap:'Tudo capturado! 🎉',     noLevel:'archis sem nível',    noZone:'Sem zona',    noSub:'—', unknownStone:'desconhecida', zona:'Zona', subzona:'Subzona', nivel:'Nível', piedra:'Pedra de Alma', coords:'Coords', info:'Info', sdSubzonas:'Exibição de subzonas', sdPolygons:'Polígonos de zona', sdTooltip:'Tooltip ao passar o mouse', sdHighlight:'Destacar na sidebar', sdGoto:'Botão ↪ ir à zona', sdArchi:'Exibição de arquimonstro', sdAutoFly:'Voar automaticamente ao archi', sdStoneFilter:'Mostrar filtro de pedra', sdFavBtn:'Mostrar botão favorito', sdMarkersHide:'Mostrar ícones do mapa', sdCloneDots:'Mini-ponto em clones', hCloneDots:'Arquimonstros com vários spawns exibem as suas cópias com um tom laranja, tamanho reduzido e opacidade menor. Assim o spawn principal destaca-se e reduz-se a aglomeração visual.', sdSpotlight:'Efeito spotlight ao passar', sdTipLock:'Fixar tooltip ao clicar', sdCazaNotif:'Notificações de respawn', sdCuentas:'Contas', sdMulti:'Multi-conta', sdMultiN:'Nº contas (2–20)', sdTheme:'Aparência', sdDayOn:'🌞 Modo dia', sdDayOff:'🌙 Modo noite', sdDatos:'Dados', sdInterface:'Interface', sdProgressBar:'Barra de progresso', sdHomeBtn:'Botão início (🏠)', sdKeyShortcuts:'Atalhos de teclado', sdStats:'Painel de estatísticas', sdCaptureLog:'Histórico de capturas', sdZoneAnim:'Animação zona completa', sdPresMode:'Modo apresentação', kbSearch:'Busca', kbCheck:'Archi-Check', kbHunt:'Caça', kbCapture:'Capturar archi visível', kbDiscard:'Descarte', kbUnderground:'Subterrâneo', kbHome:'Início do mapa', kbPresentation:'Apresentação', kbHintCap:'✓ Capturado', showCapOn:'✕ Capturas', showCapOff:'👁 Descartar', showCapTitle:'Modo descartar: capturados visíveis mas esmaecidos no mapa', favTitle:'Mostrar apenas favoritos', notifRespawn:'⏰ {0} reapareceu!', notifDead:'💀 {0} — {1}min', notifUndead:'{0} desmarcado', notifCdCleared:'🗑 {0} cooldowns eliminados', notifZoneDone:'🎉 {0} completada!', notifZonesLoaded:'✓ {0} zonas carregadas', notifProgressExported:'Progresso exportado', notifProgressImported:'{0} arquimonstros importados', notifLogout:'Sessão encerrada', notifSyncActive:'☁ Sincronização ativa', notifSyncUploaded:'☁ Progresso local enviado', notifSyncLoaded:'☁ Progresso carregado da nuvem', notifDevOn:'🔧 Modo DEV ativado', notifDevOff:'Modo DEV desativado', notifMapExported:'Mapa exportado ✓', clTitle:'📋 Histórico', statsTitle:'Estatísticas', presExit:'✕ Sair', zfTitle:'Filtrar por zona', zfAll:'Todas', zfNone:'Nenhuma', zfNoneSelected:'⚠ Nenhuma zona selecionada', zfFilteredN:'📍 {0} zonas filtradas', kbClose:'Fechar', ugBtnTitle:'Modo subterrâneo', ugNavTitle:'Zonas subterrâneas', ugNavEmpty:'Sem zonas subterrâneas', ugSurface:'Superfície', sdUgEntrances:'Entradas subterrâneas', hUgEntrances:'Exibe os ícones 🕳 no mapa marcando as entradas para zonas subterrâneas. Clique para ir diretamente à zona. Passe o mouse para iluminar a área.', sdCaza:'Modo Caça', sdSpotlightSidebar:'Spotlight ao hover (sidebar)', hSpotlightSidebar:'Ao passar o mouse sobre um arquimonstro na sidebar esquerda, esmaece os demais ícones no mapa. Desative se preferir que a sidebar não afete a visibilidade do mapa.', hsTitle:'📋 Sessão de caça', hsSub:'{0} archis caçados nesta sessão', hsSubNone:'Sem kills nesta sessão', hsApply:'✓ Aplicar capturas', hsClear:'🗑 Limpar sessão', hsEmpty:'Sem kills registados ainda. Vai caçar e volta aqui.', hsAlreadyCap:'já capturado', hsKills:'💀 {0}', hsSelectAll:'Selecionar todos', hsDeselectAll:'Desselecionar todos', notifHsApplied:'{0} capturas aplicadas', notifHsCleared:'Sessão de caça limpa', adxTitle:'📖 Bestiário', adxBtn:'📖 Bestiário', adxAll:'Todos', adxCaptured:'Capturados', adxPending:'Pendentes', adxInstock:'Em stock', adxCapOf:'{0} / {1} capturados', adxInvTotal:'{0} archis · {1} un.', adxEmpty:'Sem resultados.', adxSortStep:'Nº passo', adxSortName:'Nome', adxSortLevel:'Nível', adxSortStock:'Stock', notifInvCleared:'Inventário esvaziado', adxNotes:'Notas', adxFavorites:'Favoritos', notifCsvExported:'Inventário exportado', notifCsvImported:'Inventário importado', notifTabSync:'↕ Sincronizado de outra aba', adxClrTitle:'🗑 Limpar inventário', adxClrDesc:'Tem certeza? O inventário será apagado e as capturas zeradas.', adxClrOk:'🗑 Limpar', adxClrCancel:'Cancelar', sfAll:'Todas', stepLbl:'Etapa', stepAll:'Todas', hideDoneLbl:'Somente pendentes', rtTitle:'🗺 Modo Rota', rtEmpty:'Adicione subzonas com ➕ ou use ⚡ Auto para calcular a rota.', rtPending:'pend.', rtAuto:'⚡ Auto', rtClear:'🗑 Limpar', rtPrev:'← Ant', rtNext:'Próx →', rtAddTitle:'Adicionar à rota', rtAlready:'já está na rota', rtAdded:'adicionada à rota', rtCalced:'Rota: {0} zonas', rtAllDone:'Todas as paradas verificadas ✓', rtNoPending:'Sem zonas pendentes', rtChecked:'Verificada', rtUncheck:'Desmarcar', rtBtn:'🗺 Rota', huntHideCap:'Ocultar capturados', rtAddZone:'Adicionar zona completa', rtAutoZone:'⚡ Rota só esta zona', sdRouteBtn:'Botões ➕ de rota nas zonas', hRouteBtn:'Mostra os botões ➕ nas subzonas e o botão ▦ nas zonas para adicioná-las rapidamente à rota.', sdCompact:'Modo compacto', hCompact:'Reduz o tamanho dos itens do sidebar para exibir mais arquimonstros por tela.', sdTutorial:'Ver tutorial', tutSkip:'Saltar', tutNext:'Seguinte →', tutPrev:'← Anterior', tutFinish:'Começar!', tutStep:'Passo {0} de {1}', tut1Title:'Bem-vindo ao ARCHIDEX', tut1Body:'O teu guia para caçar todos os arquimonstros de Dofus. Esta visita rápida cobre o essencial.', tut2Title:'O mapa', tut2Body:'Todos os arquimonstros aparecem aqui. Clica num ícone para ver as suas informações e marcá-lo como capturado.', tut3Title:'Modos de jogo', tut3Body:'Archi-Check é para acompanhar capturas. O Modo Caça ativa cooldowns de respawn para sessões de caça ativas.', tut4Title:'O sidebar', tut4Body:'Lista todos os arquis por zona e subzona. Usa a pesquisa e os filtros para encontrar qualquer arqui.', tut5Title:'Capturar um arqui', tut5Body:'Clica no botão ✓ ao lado de qualquer arqui para o marcar. O contador do topbar atualiza-se imediatamente.', tut6Title:'Bestiário', tut6Body:'Gere o teu inventário, filtra por pedra de alma, adiciona notas e exporta o teu progresso em CSV.', tut7Title:'Opções', tut7Body:'Personaliza a aparência, gere multiconta, ativa o modo compacto e muito mais.', tut8Title:'Tudo pronto!', tut8Body:'Já conheces o essencial. Podes repetir este tutorial a qualquer momento em Opções.', tutRouteTitle:'Modo Rota', tutRouteBody:'Planeia o teu percurso de caça: adiciona subzonas com ➕, usa ⚡ Auto para o caminho ideal e navega com ← Ant / Próx →. O mapa voa para cada paragem automaticamente.', tut4MobBody:'Toca em ☰ para abrir a lista de archis por zona. Usa a pesquisa e os filtros para encontrar qualquer arqui.', notifMapLoading:'A carregar mapa…', betaNothingSelected:'Nada selecionado', betaNoSpawns:'Sem spawns no mapa', betaDeleteConfirm:'Apagar os {0} spawns do mapa? Esta ação não pode ser desfeita.', betaAllDeleted:'Todos os spawns eliminados', betaNoNewSpawns:'Sem spawns novos para adicionar', betaCancelSel:'✕ Cancelar seleção', betaSpawnDeleted:'✕ Spawn eliminado', betaSelectedN:'{0} selecionados', treeEmpty:'Usa o modo Beta para adicionar arquimonstros.', searchMoreN:'... e {0} mais — refina a pesquisa', killsSession:'kills nesta sessão', ttlMarkSub:'Marcar/desmarcar subzona', ttlGotoZone:'Ir para zona no mapa', ttlFav:'Favorito', ttlAddCooldown:'Adicionar ao cooldown', ttlMarkZone:'Marcar/desmarcar zona', ttlRevZone:'Marcar zona como revista', ttlGotoZoneShort:'Ir à zona', ttlReload:'Recarregar página (F5)', ttlSettings:'Opções', treeCollapseAll:'⊟ Tudo', ttlCollapseAll:'Recolher tudo', treeExpandAll:'⊞ Tudo', ttlExpandAll:'Expandir tudo', zfViewAll:'✕ Ver tudo', ttlHideDone:'Somente pendentes', ttlHuntHideCap:'Ocultar capturados', ttlCompact:'Modo compacto', bdo:'Opções de arrastamento', betaStartSel:'☐ Selecionar para apagar', rtCopied:'📋 Rota copiada', rtExport:'📋 Copiar', rtDragHint:'Arraste para reordenar', rtSeed:'🔗 Semente', rtImport:'📥 Importar', rtSeedCopied:'🔗 Semente copiada', rtSeedPrompt:'Cola a semente de rota:', rtSeedInvalid:'Semente invalida', rtSeedLoaded:'{0} paragens importadas' },
  it: { modeCheck:'◉ Archi-Check', modeHunt:'⚔ Caccia', searchPlaceholder:'Cerca archi o mostro…', caplogEmpty:'Nessuna cattura ancora', resetTitle:'↺ Reset', resetDesc:'Seleziona cosa vuoi eliminare:', resetChkCap:'Archimonsters catturati', resetChkLog:'Cronologia catture', resetCancel:'Annulla', resetConfirm:'↺ Reimposta', resetDone:'↺ Reimpostato', resetPartCap:'catture', resetPartLog:'cronologia', resetAnd:'e', cdTitle:'⏱ Cooldown attivi', cdEmpty:'Nessun cooldown', cdClearAll:'🗑 Cancella tutti', hPolygons:'Disegna aree colorate sulla mappa che delimitano ogni sottozona. Utile per orientarsi e visualizzare il progresso di ogni area.', hHighlight:'Passando il mouse su una zona nella sidebar, evidenzia il suo poligono sulla mappa. Passando su un poligono, evidenzia la zona corrispondente.', hGoto:'Mostra un pulsante ↪ accanto a ogni sottozona nella sidebar. Cliccandolo, la mappa si centra automaticamente su quella sottozona.', hAutofly:'Cliccare un archimostro nella sidebar porta la mappa alla sua posizione e apre il tooltip. Se disattivato, apre la scheda completa in un pannello.', hTiplock:'Cliccando un\'icona archi sulla mappa, il tooltip rimane fisso e non cambia passando su altri archis. Cliccare fuori per chiudere.', hSpotlight:'Passando il mouse su un archimostro (sidebar o mappa), attenua e riduce le altre icone per evidenziare quello visualizzato.', hMarkers:'Mostra o nasconde tutte le icone degli archimonsters sulla mappa. Utile per vedere meglio i poligoni o fare screenshot puliti.', hStone:'Mostra il selettore di pietra dell\'anima nella sidebar per filtrare gli archimonsters per dimensione di pietra richiesta.', hFav:'Mostra il pulsante ★ accanto a ogni archimostro nella sidebar per salvarlo come preferito e filtrarlo con il pulsante ★ della ricerca.', hCazanotif:'Solo in modalità Caccia. Mostra una notifica a schermo quando il timer di respawn di un archimostro raggiunge zero.', hMulti:'Tiene il conteggio delle catture per più account contemporaneamente (2–20). Ogni clic su "catturato" avanza il contatore dell\'account successivo.', hDaymode:'Cambia la palette dei colori da scura (notte) a chiara (giorno). Utile in ambienti con molta luce.', hProgbar:'Mostra una sottile barra di avanzamento in cima alla schermata che indica quanti archimonsters sono stati catturati su 286.', hStats:'Mostra un pannello nella sidebar con il progresso di cattura suddiviso per zona e sottozona, con barre di avanzamento individuali.', hCaplog:'Mostra un registro in basso a destra con gli ultimi archimonsters catturati nella sessione corrente, con l\'ora di ogni cattura.', optTitle:'Opzioni',  capMark:'Segna come catturato', capUnmark:'Rimuovi segno', capAccounts:'account', capAdd:'Aggiungi', tipHint:'Clicca per più info →', tipHintClose:'Clic fuori per chiudere ✕', unknownLevel:'Livello sconosciuto', noLevelData:'Nessun dato livello', dofusdbLink:'Vedi su DofusDB ↗', stones:['Piccola','Media','Grande','Enorme','Gigantesca'],   stoneLabel:"Pietra dell'Anima", stonesTitle:"Pietre dell'Anima necessarie", allCap:'Tutto catturato! 🎉', noLevel:'archi senza livello', noZone:'Senza zona', noSub:'—', unknownStone:'sconosciuta', zona:'Zona', subzona:'Sottozona', nivel:'Livello', piedra:"Pietra dell'Anima", coords:'Coord.', info:'Info', sdSubzonas:'Visualizzazione sottozone', sdPolygons:'Poligoni di zona', sdTooltip:'Tooltip al passaggio', sdHighlight:'Evidenzia nella sidebar', sdGoto:'Pulsante ↪ vai alla zona', sdArchi:'Visualizzazione archimostro', sdAutoFly:'Vola automaticamente all\'archi', sdStoneFilter:'Mostra filtro pietre', sdFavBtn:'Mostra pulsante preferiti', sdMarkersHide:'Mostra icone mappa', sdCloneDots:'Mini-punto sui cloni', hCloneDots:'Mostra i duplicati dello stesso archimostro come un piccolo punto colorato al posto dell icona completa, riducendo il disordine visivo sulla mappa.', sdSpotlight:'Effetto spotlight al passaggio', sdTipLock:'Blocca tooltip al clic', sdCazaNotif:'Notifiche di respawn', sdCuentas:'Account', sdMulti:'Multi-account', sdMultiN:'N. account (2–20)', sdTheme:'Aspetto', sdDayOn:'🌞 Modalità giorno', sdDayOff:'🌙 Modalità notte', sdDatos:'Dati', sdInterface:'Interfaccia', sdProgressBar:'Barra di avanzamento', sdHomeBtn:'Pulsante home (🏠)', sdKeyShortcuts:'Scorciatoie tastiera', sdStats:'Pannello statistiche', sdCaptureLog:'Cronologia catture', sdZoneAnim:'Animazione zona completa', sdPresMode:'Modalità presentazione', kbSearch:'Ricerca', kbCheck:'Archi-Check', kbHunt:'Caccia', kbCapture:'Cattura archi visibile', kbDiscard:'Scarto', kbUnderground:'Sotterraneo', kbHome:'Inizio mappa', kbPresentation:'Presentazione', kbHintCap:'✓ Catturato', showCapOn:'✕ Catture', showCapOff:'👁 Scarto', showCapTitle:'Modalità scarto: catturati visibili ma attenuati sulla mappa', favTitle:'Mostra solo i preferiti', notifRespawn:'⏰ {0} è ricomparso!', notifDead:'💀 {0} — {1}min', notifUndead:'{0} rimosso', notifCdCleared:'🗑 {0} cooldown eliminati', notifZoneDone:'🎉 {0} completata!', notifZonesLoaded:'✓ {0} zone caricate', notifProgressExported:'Progresso esportato', notifProgressImported:'{0} archimonsters importati', notifLogout:'Sessione chiusa', notifSyncActive:'☁ Sincronizzazione attiva', notifSyncUploaded:'☁ Progresso locale caricato', notifSyncLoaded:'☁ Progresso caricato dal cloud', notifDevOn:'🔧 Modalità DEV attiva', notifDevOff:'Modalità DEV disattiva', notifMapExported:'Mappa esportata ✓', clTitle:'📋 Cronologia', statsTitle:'Statistiche', presExit:'✕ Esci', zfTitle:'Filtra per zona', zfAll:'Tutte', zfNone:'Nessuna', zfNoneSelected:'⚠ Nessuna zona selezionata', zfFilteredN:'📍 {0} zone filtrate', kbClose:'Chiudi', ugBtnTitle:'Modalità sotterranea', ugNavTitle:'Zone sotterranee', ugNavEmpty:'Nessuna zona sotterranea', ugSurface:'Superficie', sdUgEntrances:'Ingressi sotterranei', hUgEntrances:'Mostra le icone 🕳 sulla mappa che segnano gli ingressi alle zone sotterranee. Cliccando si accede direttamente alla zona. Passare il mouse per evidenziare l\'area.', sdCaza:'Modalità Caccia', sdSpotlightSidebar:'Spotlight all\'hover (sidebar)', hSpotlightSidebar:'Passando il mouse su un archimostro nella sidebar sinistra, attenua le altre icone sulla mappa. Disattivare se si preferisce che la sidebar non influenzi la visibilità della mappa.', hsTitle:'📋 Sessione di caccia', hsSub:'{0} archi cacciati in questa sessione', hsSubNone:'Nessun kill in questa sessione', hsApply:'✓ Applica catture', hsClear:'🗑 Cancella sessione', hsEmpty:'Nessun kill registrato ancora. Vai a cacciare e torna qui.', hsAlreadyCap:'già catturato', hsKills:'💀 {0}', hsSelectAll:'Seleziona tutti', hsDeselectAll:'Deseleziona tutti', notifHsApplied:'{0} catture applicate', notifHsCleared:'Sessione di caccia cancellata', adxTitle:'📖 Bestiario', adxBtn:'📖 Bestiario', adxAll:'Tutti', adxCaptured:'Catturati', adxPending:'In attesa', adxInstock:'In stock', adxCapOf:'{0} / {1} catturati', adxInvTotal:'{0} archi · {1} pz.', adxEmpty:'Nessun risultato.', adxSortStep:'Nº passo', adxSortName:'Nome', adxSortLevel:'Livello', adxSortStock:'Stock', notifInvCleared:'Inventario svuotato', adxNotes:'Note', adxFavorites:'Preferiti', notifCsvExported:'Inventario esportato', notifCsvImported:'Inventario importato', notifTabSync:'↕ Sincronizzato da un altro tab', adxClrTitle:'🗑 Svuota inventario', adxClrDesc:'Sicuro? L\'inventario verrà svuotato e le catture azzerate.', adxClrOk:'🗑 Svuota', adxClrCancel:'Annulla', sfAll:'Tutte', stepLbl:'Tappa', stepAll:'Tutte', hideDoneLbl:'Solo in attesa', rtTitle:'🗺 Modalità Percorso', rtEmpty:'Aggiungi sottozone con ➕ o usa ⚡ Auto per calcolare il percorso.', rtPending:'att.', rtAuto:'⚡ Auto', rtClear:'🗑 Svuota', rtPrev:'← Prec', rtNext:'Succ →', rtAddTitle:'Aggiungi al percorso', rtAlready:'già nel percorso', rtAdded:'aggiunta al percorso', rtCalced:'Percorso: {0} zone', rtAllDone:'Tutte le tappe verificate ✓', rtNoPending:'Nessuna zona in attesa', rtChecked:'Verificata', rtUncheck:'Rimuovi segno', rtBtn:'🗺 Percorso', huntHideCap:'Nascondi catturati', rtAddZone:'Aggiungi zona intera', rtAutoZone:'⚡ Solo questa zona', sdRouteBtn:'Pulsanti ➕ percorso nelle zone', hRouteBtn:'Mostra i pulsanti ➕ nelle sottozone e il pulsante ▦ nelle zone per aggiungerle rapidamente al percorso.', sdCompact:'Modalità compatta', hCompact:'Riduce le dimensioni degli elementi della sidebar per mostrare più archimonsters per schermata.', sdTutorial:'Vedi tutorial', tutSkip:'Salta', tutNext:'Avanti →', tutPrev:'← Indietro', tutFinish:'Inizia!', tutStep:'Passo {0} di {1}', tut1Title:'Benvenuto in ARCHIDEX', tut1Body:"La tua guida per cacciare tutti gli archimonsters di Dofus. Questo tour rapido copre l'essenziale.", tut2Title:'La mappa', tut2Body:"Tutti gli archimonsters appaiono qui. Clicca su un'icona per vedere le sue info e segnarlo come catturato.", tut3Title:'Modalità di gioco', tut3Body:'Archi-Check serve per tracciare le catture. La modalità Caccia attiva i cooldown di respawn per le sessioni attive.', tut4Title:'Il pannello laterale', tut4Body:'Elenca tutti gli archi per zona e sottozona. Usa la ricerca e i filtri per trovare qualsiasi archi.', tut5Title:'Catturare un archi', tut5Body:'Clicca su ✓ accanto a qualsiasi archi per segnarlo come catturato. Il contatore si aggiorna immediatamente.', tut6Title:'Bestiario', tut6Body:"Gestisci il tuo inventario, filtra per pietra dell'anima, aggiungi note ed esporta i progressi in CSV.", tut7Title:'Opzioni', tut7Body:'Personalizza l\'aspetto, gestisci il multi-account, attiva la modalità compatta e molto altro.', tut8Title:'Tutto pronto!', tut8Body:'Conosci l\'essenziale. Puoi rivedere questo tutorial in qualsiasi momento da Opzioni.', tutRouteTitle:'Modalità Percorso', tutRouteBody:'Pianifica il tuo percorso di caccia: aggiungi sottozone con ➕, usa ⚡ Auto per il percorso ottimale e naviga con ← Prec / Succ →. La mappa vola ad ogni tappa automaticamente.', tut4MobBody:'Tocca ☰ per aprire la lista degli archi per zona. Usa la ricerca e i filtri per trovare qualsiasi archi.', notifMapLoading:'Caricamento mappa…', betaNothingSelected:'Nessuna selezione', betaNoSpawns:'Nessuno spawn sulla mappa', betaDeleteConfirm:'Eliminare gli {0} spawn dalla mappa? Azione irreversibile.', betaAllDeleted:'Tutti gli spawn eliminati', betaNoNewSpawns:'Nessun nuovo spawn da aggiungere', betaCancelSel:'✕ Annulla selezione', betaSpawnDeleted:'✕ Spawn eliminato', betaSelectedN:'{0} selezionati', treeEmpty:'Usa la modalità Beta per aggiungere archimonsters.', searchMoreN:'... e altri {0} — raffina la ricerca', killsSession:'kill in questa sessione', ttlMarkSub:'Segna/deseleziona sottozona', ttlGotoZone:'Vai alla zona sulla mappa', ttlFav:'Preferito', ttlAddCooldown:'Aggiungi al cooldown', ttlMarkZone:'Segna/deseleziona zona', ttlRevZone:'Segna zona come revisionata', ttlGotoZoneShort:'Vai alla zona', ttlReload:'Ricarica pagina (F5)', ttlSettings:'Opzioni', treeCollapseAll:'⊟ Tutto', ttlCollapseAll:'Comprimi tutto', treeExpandAll:'⊞ Tutto', ttlExpandAll:'Espandi tutto', zfViewAll:'✕ Vedi tutto', ttlHideDone:'Solo in attesa', ttlHuntHideCap:'Nascondi catturati', ttlCompact:'Modalità compatta', bdo:'Opzioni di trascinamento', betaStartSel:'☐ Seleziona per eliminare', rtCopied:'📋 Percorso copiato', rtExport:'📋 Copia', rtDragHint:'Trascina per riordinare', rtSeed:'🔗 Seme', rtImport:'📥 Importa', rtSeedCopied:'🔗 Seme copiato', rtSeedPrompt:'Incolla il seme del percorso:', rtSeedInvalid:'Seme non valido', rtSeedLoaded:'{0} tappe importate' },
};
function t(key) { return (I18N[S.lang]||I18N.es)[key]; }
function tf(key,...args){ let s=t(key)||''; args.forEach((a,i)=>{ s=s.replace(`{${i}}`,a); }); return s; }

function getSoulStone(level) {
  if (!level) return null;
  return STONES.find(s => level <= s.max) || STONES[STONES.length - 1];
}
function stoneName(stone) {
  if(!stone) return '?';
  const idx=STONES.indexOf(stone);
  const names=(I18N[S.lang]||I18N.es).stones;
  return `${names[idx]||'?'} ${t('stoneLabel')}`;
}
function stoneHTML(stone, size) {
  if(!stone) return '?';
  const s=size||CFG.stoneSize;
  return `<img src="${stone.img}" style="width:${s}px;height:${s}px;vertical-align:middle"> ${stoneName(stone)}`;
}

// ── Helpers de nombres de zona multilingüe ───────────────────────────────────
function zoneName(zd) {
  const z=zd?.zone;
  if(!z) return t('noZone');
  if(typeof z==='object') return z[S.lang]||z.es||Object.values(z).find(v=>v)||t('noZone');
  return String(z)||t('noZone');
}
function subzoneName(zd) {
  const sz=zd?.subzone;
  if(!sz) return '';
  if(typeof sz==='object') return sz[S.lang]||sz.es||Object.values(sz).find(v=>v)||'';
  return String(sz)||'';
}

/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
const LANGS = [
  {code:'es', flag:'🇪🇸', label:'Español'},
  {code:'en', flag:'🇬🇧', label:'English'},
  {code:'fr', flag:'🇫🇷', label:'Français'},
  {code:'de', flag:'🇩🇪', label:'Deutsch'},
  {code:'pt', flag:'🇵🇹', label:'Português'},
  {code:'it', flag:'🇮🇹', label:'Italiano'}
];

const S = {
  mode: 'archi-check',
  lang: 'es',
  captured: new Set(),   // IDs con count >= maxAccounts (fully captured)
  counts: {},            // id → count (0..maxAccounts)
  maxAccounts: 1,        // multiuenta
  hunt: { dead: {}, log: [] }, // log: [{id,label,count,time}]
  inventory: {},              // id → count (physical copies in storage)
  notes: {},                  // id → string (notes per archi)
  favorites: new Set(),
  favFilter: false,
  underground: false,
  showCaptured: false,
  devMode: false,
  showZonePolygons:  false,
  showZoneHighlight: true,
  showZoneGoto:      false,
  multicuenta:       false,
  autoFlyArchi:      true,
  showStoneFilter:   true,
  showFavBtn:        true,
  showMarkers:       true,
  cloneDots:         true,
  cazaNotif:         true,
  showUgEntrances:   true,
  showSpotlight:     true,
  tipLockOnClick:    true,
  dayMode:           false,
  showProgressBar:   true,
  keyShortcuts:      false,
  showStats:         false,
  showCaptureLog:    true,
  zoneCompleteAnim:  true,
  zoneJail:          false,
  snapToCell:        false,
  search: '',
  open: { zones: new Set(), subs: new Set() },
  stoneFilter: null,
  zoneFilters: null,
  betaArchiId: null,
  betaCoords: null,
  betaSelecting: false,
  betaSelected: new Set(),
  modalId: null,
  tip: { id: null, expanded: false, hideTimer: null, lastExpand: 0, locked: false },
  route: { stops: [], checked: new Set(), current: -1 },
  stepFilter: null,
  hideDone: false,
  huntHideCap: false,
  showRouteAddBtn: false,
  compactMode: false
};

function archiName(a){ return a?.names?.[S.lang]?.archi || a?.names?.es?.archi || '?'; }
function mobName(a)  { return a?.names?.[S.lang]?.mob   || a?.names?.es?.mob   || '?'; }

let catalog    = [];
let spawns     = [];
let archiZones = {};
let markers    = {};
let ctrlHeld   = false;

/* ──────────────────────── Grid & Cell Draw State ─────────── */
const GRID = { cellW:9, cellH:7.8, originX:0, originY:0, visible:false };
const _cellDraw = {
  active:false, target:null, cells:new Set(),
  painting:false, paintAdding:true, hoverRect:null, activeGroup:null
};
const _lastPainted = new Set();
let _gridTileLayer = null;
let zonePolygons = {}, zonePolygonLayers = {};

/* ══════════════════════════════════════════════
   MAPA
══════════════════════════════════════════════ */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const map = L.map('map', {
  crs:L.CRS.Simple, minZoom:1, maxZoom:2, zoom:1,
  center:[0,0], worldCopyJump:false, zoomControl:false
});
L.control.zoom({ position:'bottomleft' }).addTo(map);

const CustomTiles = L.TileLayer.extend({
  getTileUrl(c) {
    const z=this._getZoomForUrl(), g=CFG.grid[z];
    if(!g||c.x<0||c.x>=g.cols||c.y<0||c.y>=g.rows) return BLANK;
    return `./Tiles/${z}/${c.y*g.cols+c.x+1}.jpg`;
  },
  options:{tileSize:CFG.tileSize,noWrap:true,errorTileUrl:BLANK}
});
new CustomTiles().addTo(map);
map.setMaxBounds([[-850,-150],[50,1150]]);

// Botón underground (encima del zoom)
const UgCtrl=L.Control.extend({
  options:{position:'topleft'},
  onAdd(){
    const btn=L.DomUtil.create('div','underground-btn');
    btn.id='ug-btn'; btn.title=t('ugBtnTitle')||'Modo subterráneo';
    btn.innerHTML='<div class="portal-ring"></div><span class="portal-walker">🚶</span>';
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.on(btn,'click',toggleUnderground);
    return btn;
  }
});
new UgCtrl().addTo(map);

// Panel de navegación de subterráneos
const UgNavCtrl=L.Control.extend({
  options:{position:'topleft'},
  onAdd(){
    const el=L.DomUtil.create('div','');
    el.id='ug-nav';
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
    return el;
  }
});
new UgNavCtrl().addTo(map);
map.options.maxBoundsViscosity = 0.8;
map.setView([-500, 500], 1);
map.on('movestart zoomstart', () => { if(S.tip.id) hideTip(true); });

/* ══════════════════════════════════════════════
   ICONOS
══════════════════════════════════════════════ */
function mkIcon(cls='') {
  return L.divIcon({
    html:`<img class="ai ${cls}" src="./icons/archi.png" style="width:${CFG.iconW}px;height:${CFG.iconH}px" />`,
    iconSize:[CFG.iconW,CFG.iconH], iconAnchor:[CFG.iconW/2,CFG.iconH-2], className:''
  });
}
function mkCloneIcon(cls='') {
  return L.divIcon({
    html:`<img class="ai clone ${cls}" src="./icons/archi.png" style="width:${CFG.iconW}px;height:${CFG.iconH}px" />`,
    iconSize:[CFG.iconW,CFG.iconH], iconAnchor:[CFG.iconW/2,CFG.iconH-2], className:''
  });
}
function isCloneSpawn(spawn) {
  if(!S.cloneDots || S.mode==='beta') return false;
  return spawns.findIndex(s=>String(s.archi_id)===String(spawn.archi_id)) !==
         spawns.findIndex(s=>s.spawn_id===spawn.spawn_id);
}

/* ══════════════════════════════════════════════
   PERSISTENCIA
══════════════════════════════════════════════ */
function getCaptureCount(id){ return S.counts[String(id)]||0; }
// isCap definida más adelante (usa S.captured)
function isPartial(id)      { const c=getCaptureCount(id); return c>0&&c<S.maxAccounts; }
function _rebuildCaptured() {
  S.captured.clear();
  Object.entries(S.counts).forEach(([id,c])=>{ if(c>=S.maxAccounts) S.captured.add(id); });
}
function loadProgress() {
  try {
    const raw=localStorage.getItem('archi-counts');
    if(raw){ S.counts=JSON.parse(raw)||{}; }
    else {
      // Compatibilidad con formato antiguo (array de IDs capturados)
      const old=localStorage.getItem('archi-cap');
      if(old) JSON.parse(old).forEach(id=>{ S.counts[String(id)]=S.maxAccounts; });
    }
    _rebuildCaptured();
  } catch(_){}
}
function saveProgress() {
  _rebuildCaptured();
  localStorage.setItem('archi-counts', JSON.stringify(S.counts));
  localStorage.setItem('archi-cap', JSON.stringify([...S.captured])); // legacy backup
  _bcBroadcast('archi-counts');
  scheduleSync?.();
}
function saveCaza() {
  localStorage.setItem('archi-caza', JSON.stringify(S.hunt.dead));
  localStorage.setItem('archi-caza-log', JSON.stringify(S.hunt.log));
  scheduleSync?.();
}
function loadCaza() {
  try {
    const saved=JSON.parse(localStorage.getItem('archi-caza')||'{}');
    const now=Date.now();
    Object.entries(saved).forEach(([id,cd])=>{
      if(cd.duration-(now-cd.start)>0) S.hunt.dead[id]={...cd,notified:false};
    });
  } catch(_){}
  try {
    const log=JSON.parse(localStorage.getItem('archi-caza-log')||'[]');
    if(Array.isArray(log)) S.hunt.log=log;
  } catch(_){}
}
function isFav(id)      { return S.favorites.has(String(id)); }
function saveFav()      { localStorage.setItem('archi-fav',JSON.stringify([...S.favorites])); _bcBroadcast('archi-fav'); scheduleSync?.(); }
function loadFav()      { try { const r=localStorage.getItem('archi-fav'); if(r) JSON.parse(r).forEach(id=>S.favorites.add(String(id))); } catch(_){} }
function saveUIState()  { localStorage.setItem('archi-ui',JSON.stringify({underground:S.underground,showCaptured:S.showCaptured,lang:S.lang,maxAccounts:S.maxAccounts,devMode:S.devMode,showZonePolygons:S.showZonePolygons,showZoneHighlight:S.showZoneHighlight,showZoneGoto:S.showZoneGoto,multicuenta:S.multicuenta,autoFlyArchi:S.autoFlyArchi,showStoneFilter:S.showStoneFilter,showFavBtn:S.showFavBtn,showMarkers:S.showMarkers,cloneDots:S.cloneDots,showUgEntrances:S.showUgEntrances,cazaNotif:S.cazaNotif,showSpotlight:S.showSpotlight,tipLockOnClick:S.tipLockOnClick,dayMode:S.dayMode,showProgressBar:S.showProgressBar,keyShortcuts:S.keyShortcuts,showStats:S.showStats,showCaptureLog:S.showCaptureLog,zoneCompleteAnim:S.zoneCompleteAnim,showRouteAddBtn:S.showRouteAddBtn,compactMode:S.compactMode})); scheduleSync?.(); }
function loadUIState()  { try { const d=JSON.parse(localStorage.getItem('archi-ui')||'{}'); if(d.underground) S.underground=true; if(d.showCaptured) S.showCaptured=true; if(d.lang&&I18N[d.lang]) S.lang=d.lang; if(d.maxAccounts>=1) S.maxAccounts=d.maxAccounts; if(d.devMode) S.devMode=true; if(d.showZonePolygons===false) S.showZonePolygons=false; if(d.showZoneHighlight===false) S.showZoneHighlight=false; if(d.showZoneGoto===true) S.showZoneGoto=true;if(d.multicuenta===true) S.multicuenta=true; if(d.autoFlyArchi===false) S.autoFlyArchi=false; if(d.showStoneFilter===false) S.showStoneFilter=false; if(d.showFavBtn===false) S.showFavBtn=false; if(d.showMarkers===false) S.showMarkers=false; if(d.cloneDots===false) S.cloneDots=false; if(d.showUgEntrances===false) S.showUgEntrances=false; if(d.cazaNotif===false) S.cazaNotif=false; if(d.showSpotlight===false) S.showSpotlight=false; if(d.tipLockOnClick===false) S.tipLockOnClick=false; if(d.dayMode===true) S.dayMode=true; if(d.showProgressBar===false) S.showProgressBar=false; if(d.keyShortcuts===true) S.keyShortcuts=true; if(d.showStats===true) S.showStats=true; if(d.showCaptureLog===false) S.showCaptureLog=false; if(d.zoneCompleteAnim===false) S.zoneCompleteAnim=false; if(d.showRouteAddBtn===true) S.showRouteAddBtn=true; if(d.compactMode===true) S.compactMode=true; } catch(_){} }
function toggleFav(id) {
  const sid=String(id);
  isFav(sid)?S.favorites.delete(sid):S.favorites.add(sid);
  saveFav(); buildTree();
}
function toggleFavFromModal() { if(S.modalId){ toggleFav(S.modalId); refreshFavBtns(S.modalId); } }
function toggleFavFromTip()   { if(S.tip.id)  { toggleFav(S.tip.id);  refreshFavBtns(S.tip.id);  } }
function refreshFavBtns(id) {
  const on=isFav(id);
  const mf=document.getElementById('modal-fav'); if(mf){ mf.textContent=on?'★':'☆'; mf.style.color=on?'var(--yellow)':'var(--txt3)'; mf.style.borderColor=on?'var(--yellow)':'var(--border)'; }
  const tf=document.getElementById('tip-fav');   if(tf){ tf.textContent=on?'★':'☆'; tf.style.color=on?'var(--yellow)':'var(--txt3)'; tf.style.borderColor=on?'var(--yellow)':'var(--border)'; }
}
function flyToArchi(archiId) {
  const m=Object.values(markers).find(mk=>String(mk._spawn.archi_id)===String(archiId));
  if(m) map.flyTo(m.getLatLng(), Math.max(map.getZoom(),2), {duration:0.6});
}
async function exportMapImage() {
  notify(t('notifMapLoading'),'blue');
  const ZOOM=1, TS=CFG.tileSize, grid=CFG.grid[ZOOM];
  const mapW=grid.cols*TS, mapH=grid.rows*TS, SCALE=Math.pow(2,ZOOM);

  // Cargar todos los tiles
  const tilePromises=[];
  for(let r=0;r<grid.rows;r++) for(let c=0;c<grid.cols;c++){
    const idx=r*grid.cols+c+1;
    tilePromises.push(new Promise(res=>{
      const img=new Image(); img.crossOrigin='anonymous';
      img.onload=()=>res({img,c,r});
      img.onerror=()=>res(null);
      img.src=`./Tiles/${ZOOM}/${idx}.jpg?t=${Date.now()}`;
    }));
  }
  const tiles=await Promise.all(tilePromises);

  // Canvas del mapa
  const mc=document.createElement('canvas'); mc.width=mapW; mc.height=mapH;
  const mctx=mc.getContext('2d');
  mctx.fillStyle='#16171a'; mctx.fillRect(0,0,mapW,mapH);
  tiles.forEach(t=>{ if(t) mctx.drawImage(t.img,t.c*TS,t.r*TS,TS,TS); });

  // Dibujar spawns como puntos
  spawns.forEach(s=>{
    const xp=s.x*SCALE, yp=-s.y*SCALE;
    if(xp<0||xp>mapW||yp<0||yp>mapH) return;
    const cap=isCap(s.archi_id), dead=isDead(s.archi_id);
    mctx.beginPath(); mctx.arc(xp,yp,5,0,Math.PI*2);
    mctx.fillStyle=cap?'#51cf66':dead?'#fdcb6e':'#4d9cf7';
    mctx.fill(); mctx.strokeStyle='rgba(255,255,255,.6)';
    mctx.lineWidth=1.5; mctx.stroke();
  });

  // Construir lista de ítems faltantes
  const missing=catalog.filter(a=>!isCap(a.id));
  const COL_W=270, LH=13, GH=19;
  const lng=I18N[S.lang]||I18N.es;
  const sColors={'50':'#74b9ff','100':'#55efc4','150':'#ffeaa7','190':'#fdcb6e','1000':'#ff7675','?':'#868e96'};
  const sNames={'50':lng.stones[0],'100':lng.stones[1],'150':lng.stones[2],'190':lng.stones[3],'1000':lng.stones[4],'?':'?'};
  const groups={};
  STONES.forEach(s=>{groups[s.max]=[];}); groups['?']=[];
  missing.forEach(a=>{ const lv=getArchiLevel(a.id),st=getSoulStone(lv); groups[st?st.max:'?'].push(a); });

  // Crear array plano de ítems
  const listItems=[];
  [...STONES.map(s=>s.max),'?'].forEach(key=>{
    const group=groups[key]; if(!group?.length) return;
    listItems.push({h:true, text:`▸ ${t('stoneLabel')} ${sNames[String(key)]} (${group.length})`, color:sColors[String(key)]||'#868e96'});
    group.forEach(a=>listItems.push({h:false, text:`  • ${archiName(a).substring(0,36)}`}));
  });

  // Dividir en columnas según la altura del mapa
  const HEADER_H=78; // altura reservada para leyenda+título en primera columna
  const COL_MARGIN=16;
  const maxH0=mapH-HEADER_H, maxHN=mapH-COL_MARGIN;
  const columns=[];
  let curCol=[], curH=0;
  listItems.forEach(item=>{
    const ih=item.h?GH:LH;
    const maxH=columns.length===0?maxH0:maxHN;
    if(curH+ih>maxH && curCol.length){ columns.push(curCol); curCol=[]; curH=0; }
    curCol.push(item); curH+=ih;
  });
  if(curCol.length) columns.push(curCol);

  const numCols=Math.max(1,columns.length);
  const final=document.createElement('canvas');
  final.width=mapW+numCols*COL_W; final.height=mapH;
  const ctx=final.getContext('2d');

  ctx.fillStyle='#0d0e10'; ctx.fillRect(0,0,final.width,final.height);
  ctx.drawImage(mc,0,0);
  // Panel de fondo
  ctx.fillStyle='#1a1b1f'; ctx.fillRect(mapW,0,numCols*COL_W,mapH);
  // Separadores entre columnas
  for(let ci=0;ci<numCols;ci++){
    const cx=mapW+ci*COL_W;
    ctx.strokeStyle='#33363f'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cx+0.5,0); ctx.lineTo(cx+0.5,mapH); ctx.stroke();
  }
  // Leyenda puntos (primera columna, arriba)
  [[,'#51cf66','Capturado'],[,'#4d9cf7','Sin capturar'],[,'#fdcb6e','En caza']].forEach(([,color,label],i)=>{
    ctx.beginPath(); ctx.arc(mapW+14,14+i*14,4,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
    ctx.font='10px Segoe UI,sans-serif'; ctx.fillStyle='#868e96';
    ctx.fillText(label,mapW+22,18+i*14);
  });
  ctx.font='bold 13px Segoe UI,sans-serif'; ctx.fillStyle='#e8ecef';
  ctx.fillText(`Faltantes: ${missing.length} / ${CFG.total}`,mapW+10,60);
  // Dibujar columnas
  columns.forEach((col,ci)=>{
    const colX=mapW+ci*COL_W;
    let cy=ci===0?HEADER_H+4:COL_MARGIN;
    col.forEach(item=>{
      if(item.h){
        ctx.font='bold 11px Segoe UI,sans-serif'; ctx.fillStyle=item.color;
        ctx.fillText(item.text,colX+10,cy); cy+=GH;
      } else {
        ctx.font='10px Segoe UI,sans-serif'; ctx.fillStyle='#c9d1d9';
        ctx.fillText(item.text,colX+10,cy); cy+=LH;
      }
    });
  });

  const a=document.createElement('a');
  a.download='mapa-archimonstruos.png';
  a.href=final.toDataURL('image/png');
  a.click();
  notify(t('notifMapExported'),'green');
}

// ── Underground mode ──────────────────────────────────────────────────────────
const UNDERGROUND_KEYWORDS=['cripta','subterr','alcant','galería','galeria','mina','dungeon','canal','cloacas','bodega','caverna','sótano','sotano','interior','prisión','prison','gruta','cueva','mazmorra'];
function isUnderground(id) {
  const az=archiZones[String(id)];
  if(!az) return false;
  if(az.underground===true) return true;
  // Fallback por nombre de subzona
  const zones=az.zones||[];
  return zones.some(zd=>{
    const sz=(typeof zd.subzone==='object'?zd.subzone.es:zd.subzone||'').toLowerCase();
    const z =(typeof zd.zone   ==='object'?zd.zone.es   :zd.zone   ||'').toLowerCase();
    return UNDERGROUND_KEYWORDS.some(k=>sz.includes(k)||z.includes(k));
  });
}
function showBetaPanel(){
  const p=document.getElementById('beta-panel');
  p.style.display='block';
  p.style.animation='none'; void p.offsetWidth;
  p.style.animation='betaIn .2s cubic-bezier(.34,1.56,.64,1)';
  _syncDragOptToggles();
}

function _setUndergroundSilent(state) {
  if (S.underground === state) return;
  S.underground = state;
  saveUIState();
  document.getElementById('ug-btn')?.classList.toggle('on', S.underground);
  document.body.classList.toggle('mode-underground', S.underground);
  refreshMarkers(); buildTree(); renderZoneCells();
  if (S.underground) renderUgNav();
}

function toggleUnderground() {
  S.underground=!S.underground;
  saveUIState();
  const btn=document.getElementById('ug-btn');
  btn?.classList.toggle('on',S.underground);
  const walker=btn?.querySelector('.portal-walker');
  if(walker){
    walker.classList.remove('entering','exiting');
    void walker.offsetWidth;
    walker.classList.add(S.underground?'entering':'exiting');
    setTimeout(()=>walker.classList.remove('entering','exiting'),3000);
  }
  _flashUnderground(S.underground);
  // Aplicar cambios visuales mientras la cortinilla cubre la pantalla (~450ms)
  setTimeout(()=>{
    document.body.classList.toggle('mode-underground',S.underground);
    refreshMarkers(); buildTree(); renderZoneCells();
    if(S.underground) renderUgNav();
  },450);
}

function _flashUnderground(entering){
  const wipe=document.getElementById('ug-wipe');
  const lbl=document.getElementById('ug-wipe-lbl');
  const walker=document.getElementById('ug-walker-sprite');
  if(!wipe) return;
  lbl.textContent=entering?('🕳 '+(t('ugNavTitle')||'Subterráneos')):('☀ '+(t('ugSurface')||'Superficie'));
  if(walker){ walker.style.animation='none'; void walker.offsetWidth; walker.style.animation=''; }
  wipe.classList.remove('go-in','go-out');
  void wipe.offsetWidth;
  wipe.classList.add(entering?'go-in':'go-out');
}

// ── Underground nav ───────────────────────────────────────────────────────────
let _ugZones=[];

// Zonas subterráneas que no tienen spawns underground pero deben aparecer en el nav
const MANUAL_UG_ZONES=[
  {
    zone:   {es:'Amakna',en:'Amakna',fr:'Amakna',de:'Amakna',pt:'Amakna',it:'Amakna'},
    subzone:{es:'Criptas del cementerio',en:'Cemetery Crypts',fr:'Cryptes du cimetière',de:'Friedhofskrypten',pt:'Criptas do Cemitério',it:'Cripte del Cimitero'},
    x:716.5, y:-576.4,   // centro de los archis (IDs 111,124,126,127,150)
    entranceX:716.5, entranceY:-566  // marcador de entrada en superficie
  }
];

function buildUgNav(){
  const seen={};
  spawns.forEach(s=>{
    if(!s.underground) return;
    const key=(s.zone||'')+'|'+(s.subzone||'');
    if(!seen[key]) seen[key]={zone:s.zone||'',subzone:s.subzone||'',xs:[],ys:[]};
    seen[key].xs.push(s.x); seen[key].ys.push(s.y);
  });
  // Build zone-data cache from archiZones for translations
  const zdCache={};
  Object.values(archiZones).forEach(az=>{
    (az.zones||[]).forEach(zd=>{
      if(!zd.underground) return;
      const zEs=typeof zd.zone==='object'?(zd.zone.es||''):String(zd.zone||'');
      const szEs=typeof zd.subzone==='object'?(zd.subzone.es||''):String(zd.subzone||'');
      const k=zEs+'|'+szEs;
      if(!zdCache[k]) zdCache[k]=zd;
    });
  });
  _ugZones=Object.values(seen).map(d=>{
    // Prefer polygon center over spawn average
    const polyKey=d.zone+'|||'+d.subzone;
    const poly=zonePolygons[polyKey];
    let avgX, avgY;
    if(poly?.cells?.length){
      const cells=poly.cells;
      avgX=GRID.originX+(cells.reduce((s,c)=>s+c[0],0)/cells.length)*GRID.cellW+GRID.cellW/2;
      avgY=GRID.originY+(cells.reduce((s,c)=>s+c[1],0)/cells.length)*GRID.cellH+GRID.cellH/2;
    } else {
      avgX=d.xs.reduce((a,b)=>a+b,0)/d.xs.length;
      avgY=d.ys.reduce((a,b)=>a+b,0)/d.ys.length;
    }
    return {zone:d.zone,subzone:d.subzone,zd:zdCache[d.zone+'|'+d.subzone]||null,x:avgX,y:avgY};
  });
  // Fusionar zonas manuales (si no están ya incluidas por spawns)
  MANUAL_UG_ZONES.forEach(mz=>{
    const zEs=typeof mz.zone==='object'?mz.zone.es:mz.zone;
    const szEs=typeof mz.subzone==='object'?mz.subzone.es:mz.subzone;
    const already=_ugZones.some(z=>z.zone===zEs&&z.subzone===szEs);
    if(!already) _ugZones.push({
      zone:zEs, subzone:szEs,
      zd:{zone:mz.zone,subzone:mz.subzone,underground:true},
      x:mz.x, y:mz.y,
      entranceX:mz.entranceX??mz.x, entranceY:mz.entranceY??mz.y,
      manual:true
    });
  });
  renderUgNav();
  createUgEntranceMarkers();
}

let _ugEntranceMarkers=[];
function createUgEntranceMarkers(){
  _ugEntranceMarkers.forEach(m=>m.remove());
  _ugEntranceMarkers=[];
  if(!S.showUgEntrances) return;
  const lang=S.lang;
  _ugZones.forEach(z=>{
    const zd=z.zd;
    const zLabel=zd?(typeof zd.zone==='object'?zd.zone[lang]||zd.zone.es:zd.zone)||z.zone:z.zone;
    const szLabel=zd?(typeof zd.subzone==='object'?zd.subzone[lang]||zd.subzone.es:zd.subzone)||z.subzone:z.subzone;
    const polyKey=getZoneKey(norm(z.zone),norm(z.subzone||'—'));
    const icon=L.divIcon({
      html:`<div class="ug-entrance-icon">🕳</div>`,
      iconSize:[26,26], iconAnchor:[13,13], className:''
    });
    const mx=z.entranceX??z.x, my=z.entranceY??z.y;
    const m=L.marker([my,mx],{icon,interactive:true,zIndexOffset:1000});
    m.bindTooltip(
      `<b>${szLabel}</b><br><span style="color:var(--txt3);font-size:10px">${zLabel}</span>`,
      {direction:'right',className:'ug-tip',offset:[6,0]}
    );
    m.on('mouseover',()=>highlightZonePoly(polyKey,true));
    m.on('mouseout', ()=>highlightZonePoly(polyKey,false));
    m.on('click',()=>goToUgZone(z.x,z.y));
    m.addTo(map);
    _ugEntranceMarkers.push(m);
  });
}

function toggleUgNav(){
  document.getElementById('ug-nav')?.classList.toggle('collapsed');
}

function renderUgNav(){
  const el=document.getElementById('ug-nav');
  if(!el) return;
  const lang=S.lang;
  const header=`<div class="ug-nav-hdr" onclick="toggleUgNav()">🕳 ${t('ugNavTitle')||'Subterráneos'}</div>`;
  if(!_ugZones.length){
    el.innerHTML=header+`<div class="ug-nav-items"><div style="padding:8px 10px;font-size:11px;color:var(--txt3)">${t('ugNavEmpty')||'Sin subterráneos'}</div></div>`;
    return;
  }
  el.innerHTML=header+`<div class="ug-nav-items">`+_ugZones.map(z=>{
    const zd=z.zd;
    const zLabel=zd?(typeof zd.zone==='object'?zd.zone[lang]||zd.zone.es:zd.zone)||z.zone:z.zone;
    const szLabel=zd?(typeof zd.subzone==='object'?zd.subzone[lang]||zd.subzone.es:zd.subzone)||z.subzone:z.subzone;
    return `<div class="ug-nav-item" onclick="goToUgZone(${z.x},${z.y})" title="${szLabel}">` +
           `<span class="ug-nav-zone">${zLabel}</span>` +
           `<span class="ug-nav-sub">${szLabel}</span></div>`;
  }).join('')+`</div>`;
  // Auto-collapse on mobile
  if(window.innerWidth<=768) el.classList.add('collapsed');
}

function goToUgZone(x,y){
  if(S.underground){
    toggleUnderground(); // ya estás underground → salir
  } else {
    toggleUnderground(); // entrar underground + volar a la zona
    map.flyTo([y,x],2,{duration:0.8});
  }
}
function flyToUg(x,y){ goToUgZone(x,y); }

// ── Beta selection / delete ───────────────────────────────────────────────────
function toggleBetaSelect() {
  S.betaSelecting=!S.betaSelecting;
  S.betaSelected.clear();
  document.body.classList.toggle('beta-selecting',S.betaSelecting);
  document.getElementById('bp-sel-toggle').textContent=S.betaSelecting?t('betaCancelSel'):t('betaStartSel');
  updateSelCount();
  // Quitar .sel de todos los markers
  Object.values(markers).forEach(m=>m.getElement()?.querySelector('.ai')?.classList.remove('sel'));
}
function updateSelCount() {
  document.getElementById('bp-sel-count').textContent=`${S.betaSelected.size} seleccionado(s)`;
}
function deleteSelected() {
  if(!S.betaSelected.size){ notify(t('betaNothingSelected'),'orange'); return; }
  const toDelete=[...S.betaSelected];
  toDelete.forEach(sid=>{ const sp=spawns.find(s=>s.spawn_id===sid); if(sp) removeMarker(sp); });
  S.betaSelected.clear(); updateSelCount();
}
function deleteAll() {
  if(!spawns.length){ notify(t('betaNoSpawns'),'orange'); return; }
  if(!confirm(tf('betaDeleteConfirm',spawns.length))) return;
  [...spawns].forEach(sp=>{ const m=markers[sp.spawn_id]; if(m){ m.remove(); delete markers[sp.spawn_id]; } });
  spawns.length=0;
  buildTree(); updateCounter(); updateStones();
  notify(t('betaAllDeleted'),'orange');
}

// ── Beta auto-populate ────────────────────────────────────────────────────────
// ── Drag options ──────────────────────────────────────────────────────────────
// Obtiene el polígono de celdas asignado a un spawn (buscando por nombre ES).
function _getSpawnPoly(spawn) {
  const list=getZoneList(String(spawn.archi_id));
  if(list?.length) {
    // Buscar la entrada que coincide con spawn.zone/subzone (nombre localizado)
    for(const zd of list) {
      if(norm(zoneName(zd))===norm(spawn.zone||'') && norm(subzoneName(zd)||'—')===norm(spawn.subzone||'—')) {
        const zEs=norm(typeof zd.zone==='object'?(zd.zone.es||''):String(zd.zone||''));
        const szEs=norm(typeof zd.subzone==='object'?(zd.subzone.es||''):String(zd.subzone||''));
        return zonePolygons[getZoneKey(zEs, szEs||'—')];
      }
    }
    // Fallback: primera entrada
    const zd=list[0];
    const zEs=norm(typeof zd.zone==='object'?(zd.zone.es||''):String(zd.zone||''));
    const szEs=norm(typeof zd.subzone==='object'?(zd.subzone.es||''):String(zd.subzone||''));
    return zonePolygons[getZoneKey(zEs, szEs||'—')];
  }
  return zonePolygons[getZoneKey(norm(spawn.zone||''), norm(spawn.subzone||'—'))];
}

// Celda más cercana a un punto dado (devuelve centro en CRS).
function _nearestCellCenter(latlng, cells) {
  let best=null, bestD=Infinity;
  cells.forEach(([cx,cy])=>{
    const px=GRID.originX+cx*GRID.cellW+GRID.cellW/2;
    const py=GRID.originY+cy*GRID.cellH+GRID.cellH/2;
    const d=(latlng.lat-py)**2+(latlng.lng-px)**2;
    if(d<bestD){ bestD=d; best={lat:py,lng:px}; }
  });
  return best;
}

// ¿El punto está dentro de alguna celda del polígono?
function _pointInCells(latlng, cells) {
  return cells.some(([cx,cy])=>{
    const x0=GRID.originX+cx*GRID.cellW, x1=x0+GRID.cellW;
    const y0=GRID.originY+cy*GRID.cellH, y1=y0+GRID.cellH;
    return latlng.lng>=x0&&latlng.lng<=x1&&latlng.lat>=y0&&latlng.lat<=y1;
  });
}

function toggleDragOpt(key) {
  S[key]=!S[key];
  const ids={zoneJail:'bdo-jail',snapToCell:'bdo-snap'};
  const el=document.getElementById(ids[key]);
  if(el) el.classList.toggle('on', S[key]);
}

function _syncDragOptToggles() {
  const ids={zoneJail:'bdo-jail',snapToCell:'bdo-snap'};
  Object.entries(ids).forEach(([k,id])=>{
    document.getElementById(id)?.classList.toggle('on', !!S[k]);
  });
}

// Devuelve un punto aleatorio (x, y en CRS) dentro del polígono de una subzona.
// Si la subzona no tiene polígono definido devuelve null.
function _randomPointInZone(zd) {
  // Las claves de zonePolygons usan siempre el nombre en español
  const zEs  = norm(typeof zd.zone==='object'    ? (zd.zone.es||'')    : String(zd.zone||''));
  const szEs = norm(typeof zd.subzone==='object'  ? (zd.subzone.es||'') : String(zd.subzone||''));
  const key  = getZoneKey(zEs, szEs||'—');
  const poly = zonePolygons[key];
  if(!poly?.cells?.length) return null;
  // Elegir celda aleatoria del polígono
  const [cx,cy] = poly.cells[Math.floor(Math.random()*poly.cells.length)];
  // Centro de la celda en coordenadas CRS
  const x = GRID.originX + cx*GRID.cellW + GRID.cellW/2;
  const y = GRID.originY + cy*GRID.cellH + GRID.cellH/2;
  return { x: Math.round(x*10)/10, y: Math.round(y*10)/10 };
}

function autoPopulateSpawns() {
  if(!Object.keys(archiZones).length){ notify('Necesitas archi_zones.json','orange'); return; }

  // Phase 1 — collect pending (archi, subzone) pairs, grouped by polygon key
  const byKey = {}; // polyKey → [{id, zd, zName, szName}]
  catalog.forEach(a=>{
    const id=String(a.id);
    const zoneList=getZoneList(id);
    const entries=zoneList?.length?zoneList:[{zone:'Sin zona',subzone:''}];
    entries.forEach(zd=>{
      const zName=zoneName(zd), szName=subzoneName(zd);
      if(spawns.some(s=>String(s.archi_id)===id&&(s.zone||'')===norm(zName)&&(s.subzone||'')===norm(szName||'—'))) return;
      const zEs =norm(typeof zd.zone==='object'    ?(zd.zone.es||'')   :String(zd.zone||''));
      const szEs=norm(typeof zd.subzone==='object' ?(zd.subzone.es||''):String(zd.subzone||''));
      const key=getZoneKey(zEs, szEs||'—');
      if(!byKey[key]) byKey[key]=[];
      byKey[key].push({id, zd, zName, szName});
    });
  });

  // Phase 2 — for each subzone assign positions: spread archis evenly across
  //           polygon cells sorted in row-major order (no overlaps)
  const SPACING=40, COLS=30, startX=-100, startY=0;
  let col=0, row=0, added=0, noPolyCount=0;

  Object.values(byKey).forEach(items=>{
    const n=items.length;
    const poly=zonePolygons[getZoneKey(
      norm(typeof items[0].zd.zone==='object'   ?(items[0].zd.zone.es||'')   :String(items[0].zd.zone||'')),
      norm(typeof items[0].zd.subzone==='object'?(items[0].zd.subzone.es||''):String(items[0].zd.subzone||''))||'—'
    )];

    let positions=[];
    if(poly?.cells?.length){
      // Sort cells in row-major order: top→bottom, left→right within each row
      const sorted=[...poly.cells].sort((a,b)=>a[1]!==b[1]?a[1]-b[1]:a[0]-b[0]);
      const m=sorted.length;
      positions=Array.from({length:n},(_,i)=>{
        // Evenly-spaced indices across sorted cell list
        const idx=Math.round(i*(m-1)/Math.max(n-1,1));
        const [cx,cy]=sorted[Math.min(idx,m-1)];
        return {
          x:Math.round((GRID.originX+cx*GRID.cellW+GRID.cellW/2)*10)/10,
          y:Math.round((GRID.originY+cy*GRID.cellH+GRID.cellH/2)*10)/10
        };
      });
    }

    items.forEach(({id,zd,zName,szName},i)=>{
      let pos=positions[i]||null;
      if(!pos){
        pos={x:Math.round(startX+col*SPACING),y:Math.round(startY-row*SPACING)};
        noPolyCount++; col++; if(col>=COLS){col=0;row++;}
      }
      const spawn={
        spawn_id:crypto.randomUUID(), archi_id:id,
        zone:norm(zName), subzone:norm(szName||'—'),
        underground:zd.underground===true,
        cooldown_minutes:CFG.defaultCd, x:pos.x, y:pos.y
      };
      spawns.push(spawn); createMarker(spawn); added++;
    });
  });

  buildTree(); updateCounter(); updateStones();
  if(added){
    const msg=noPolyCount
      ?`⚡ ${added} spawns añadidos (${noPolyCount} sin polígono, en cuadrícula)`
      :`⚡ ${added} spawns añadidos en sus subzonas`;
    notify(msg,'blue');
  } else {
    notify(t('betaNoNewSpawns'),'orange');
  }
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function _imgErr(el) {
  const generic='./icons/archi.png';
  if(el.src.includes(generic)) { el.src=generic; return; }
  const m=el.src.match(/(\d+)\.webp/);
  if(m && el.src.includes('icons/archis')) { el.src=CFG.imgRemote(m[1]); return; }
  el.src=generic;
}
function getArchi(id)       { return catalog.find(a=>a.id==id); }
function isCap(id)          { return S.captured.has(String(id)); }
function isDead(id)         { const d=S.hunt.dead[String(id)]; return !!d&&!d.notified; }
function norm(s)            { s=(s||'').trim(); return s.charAt(0).toUpperCase()+s.slice(1); }
function getArchiLevel(id)  { return archiZones[String(id)]?.level||null; }
function getZoneList(archiId) {
  // Retorna array de {zone, subzone} — soporta formato nuevo (az.zones) y antiguo (az.zone)
  const az=archiZones[String(archiId)];
  if(!az) return null;
  if(az.zones?.length) return az.zones;
  if(az.zone) return [{zone:az.zone, subzone:az.subzone||''}];
  return null;
}
function getZone(spawn) {
  const list=getZoneList(spawn?.archi_id);
  if(list?.length) {
    const spZ=norm(spawn?.zone||''), spSz=norm(spawn?.subzone||'—');
    for(const zd of list) {
      const zdZEs=norm(typeof zd.zone==='object'?(zd.zone.es||''):String(zd.zone||''));
      const zdSzEs=norm(typeof zd.subzone==='object'?(zd.subzone.es||''):String(zd.subzone||''))||'—';
      const zdZCur=norm(zoneName(zd)), zdSzCur=norm(subzoneName(zd)||'—');
      if((spZ===zdZEs||spZ===zdZCur)&&(spSz===zdSzEs||spSz===zdSzCur))
        return { zone:zdZCur, subzone:zdSzCur };
    }
    return { zone:norm(zoneName(list[0])), subzone:norm(subzoneName(list[0])||'—') };
  }
  return { zone:norm(spawn?.zone||t('noZone')), subzone:norm(spawn?.subzone||'—') };
}

/* ══════════════════════════════════════════════
   MARCADORES
══════════════════════════════════════════════ */
function getIconCls(spawn) {
  if(S.mode==='beta') return '';
  if(S.mode==='caza') return isDead(spawn.archi_id)?'dead':'';
  if(isCap(spawn.archi_id)) return 'cap';
  if(isPartial(spawn.archi_id)) return 'partial';
  return '';
}
function getOpacity(spawn) {
  if(S.zoneFilters !== null) {
    const { zone } = getZone(spawn);
    if(!S.zoneFilters.has(zone)) return 0;
  }
  const ug=spawn.underground!=null?spawn.underground===true:isUnderground(spawn.archi_id);
  if(S.underground && !ug) return 0;
  if(!S.underground && ug) return 0;
  if(S.stepFilter!=null){ const a=getArchi(spawn.archi_id); if(!a||a.quest_step!==S.stepFilter) return 0; }
  if(S.stoneFilter!=null){ if(getSoulStone(getArchiLevel(spawn.archi_id))?.max!==S.stoneFilter) return 0; }
  if(S.mode==='beta'||S.mode==='caza') return 1;
  if(isCap(spawn.archi_id)) return S.showCaptured?1:0;
  return 1;
}
function applyMarkerVisual(marker, spawn) {
  const cls=getIconCls(spawn), op=getOpacity(spawn), dot=isCloneSpawn(spawn), key=`${cls}_${op}_${dot}`;
  if(marker._vk===key) return;
  marker._vk=key;
  marker.setOpacity(op);
  const cont=marker.getElement();
  if(cont) cont.style.pointerEvents=op>0?'':'none';
  if(op>0) marker.setIcon(dot ? mkCloneIcon(cls) : mkIcon(cls));
}
let _rmRafId=null;
function refreshMarkers(){
  cancelAnimationFrame(_rmRafId);
  _rmRafId=requestAnimationFrame(()=>{ spawns.forEach(s=>{ const m=markers[s.spawn_id]; if(m) applyMarkerVisual(m,s); }); });
}

function _createMarkersInBatches(arr, BATCH=50){
  return new Promise(resolve=>{
    let i=0;
    function next(){
      const end=Math.min(i+BATCH,arr.length);
      while(i<end) createMarker(arr[i++]);
      if(i<arr.length){
        if(typeof requestIdleCallback!=='undefined') requestIdleCallback(next,{timeout:300});
        else setTimeout(next,0);
      } else resolve();
    }
    if(typeof requestIdleCallback!=='undefined') requestIdleCallback(next,{timeout:300});
    else { arr.forEach(createMarker); resolve(); }
  });
}

function createMarker(spawn) {
  const archi=getArchi(spawn.archi_id);
  if(!archi) return;

  const marker=L.marker([spawn.y,spawn.x],{icon:mkIcon(),draggable:false}).addTo(map);
  marker._spawn=spawn;

  marker.on('mouseover', () => {
    // En archi-check, no interactuar con capturados a menos que estén visibles (modo descarte)
    if(S.mode==='archi-check' && isCap(spawn.archi_id) && !S.showCaptured) return;
    if(S.mode==='beta') return;
    clearTimeout(S.tip.hideTimer);
    const el=marker.getElement()?.querySelector('.ai');
    if(!el.classList.contains('boom')&&!el.classList.contains('cap'))
      el.classList.add('hov');
    showTip(spawn, archi, marker);
    highlightArchi(spawn.archi_id, true);
    highlightArchiPolys(spawn.archi_id, true);
  });

  marker.on('mouseout', () => {
    marker.getElement()?.querySelector('.ai')?.classList.remove('hov');
    highlightArchi(spawn.archi_id, false);
    highlightArchiPolys(spawn.archi_id, false);
    S.tip.hideTimer=setTimeout(()=>{
      if(!document.getElementById('archi-tip').matches(':hover')) hideTip();
    }, 120);
  });

  marker.on('click', e => {
    if(S.mode==='beta'){
      const shiftSel=e.originalEvent?.shiftKey;
      if(shiftSel||S.betaSelecting){
        // Activar modo selección automáticamente con Shift
        if(!S.betaSelecting){
          S.betaSelecting=true;
          document.body.classList.add('beta-selecting');
          showBetaPanel();
          document.getElementById('bp-sel-toggle').textContent=t('betaCancelSel');
          updateSelCount();
        }
        const sid=spawn.spawn_id;
        const el=marker.getElement()?.querySelector('.ai');
        if(S.betaSelected.has(sid)){ S.betaSelected.delete(sid); el?.classList.remove('sel'); }
        else { S.betaSelected.add(sid); el?.classList.add('sel'); }
        updateSelCount();
      }
      return;
    }
    if(S.mode==='caza') toggleDead(spawn.archi_id, archiName(archi));
    else {
      S.tip.lastExpand=Date.now();
      showTip(spawn, archi, marker, true);
      expandTip();
      if(S.tipLockOnClick) S.tip.locked=true;
    }
  });

  marker.on('contextmenu', e => {
    L.DomEvent.preventDefault(e);
    if(S.mode==='beta') { removeMarker(spawn); return; }
    if(S.mode==='archi-check' && S.keyShortcuts) { toggleCapture(spawn.archi_id); _showKbHint(t('kbHintCap')); }
  });

  marker.on('drag', e => {
    if(!S.zoneJail) return;
    const poly=_getSpawnPoly(spawn);
    if(!poly?.cells?.length) return;
    const p=e.target.getLatLng();
    if(!_pointInCells(p, poly.cells)) {
      const nearest=_nearestCellCenter(p, poly.cells);
      if(nearest) e.target.setLatLng([nearest.lat, nearest.lng]);
    }
  });

  marker.on('dragend', e => {
    let p=e.target.getLatLng();
    // Snap to cell center si está activado
    if(S.snapToCell) {
      const poly=_getSpawnPoly(spawn);
      if(poly?.cells?.length) {
        const snapped=_nearestCellCenter(p, poly.cells);
        if(snapped){ e.target.setLatLng([snapped.lat, snapped.lng]); p={lat:snapped.lat,lng:snapped.lng}; }
      }
    }
    spawn.x=Math.round(p.lng*10)/10; spawn.y=Math.round(p.lat*10)/10;
  });

  markers[spawn.spawn_id]=marker;
  applyMarkerVisual(marker, spawn);
}

function removeMarker(spawn) {
  hideTip(true);
  const marker=markers[spawn.spawn_id];
  if(!marker) return;
  const el=marker.getElement()?.querySelector('.ai');
  const doRemove=()=>{
    marker.remove();
    delete markers[spawn.spawn_id];
    spawns=spawns.filter(s=>s.spawn_id!==spawn.spawn_id);
    buildTree(); updateCounter(); updateStones();
    notify(t('betaSpawnDeleted'),'orange');
  };
  if(el){ el.classList.remove('hov','cap','dead'); el.classList.add('boom'); setTimeout(doRemove,460); }
  else doRemove();
}

// Resalta todos los markers de un Set de IDs (hover de subzona en sidebar)
function highlightSubzoneMarkers(ids, on, zName, szName) {
  if(on && !S.showSpotlight) return;
  const strIds=new Set([...ids].map(String));
  const nZone=norm(zName||''); const nSub=norm(szName||'—');
  Object.values(markers).forEach(m=>{
    const sp=m._spawn;
    const idMatch=strIds.has(String(sp.archi_id));
    // Si se pasa zona/subzona, el marker también debe pertenecer a esa subzona exacta
    const zoneMatch=!zName||(norm(sp.zone||'')=== nZone && norm(sp.subzone||'—')===nSub);
    const isTarget=idMatch&&zoneMatch;
    const el=m.getElement()?.querySelector('.ai');
    if(isTarget){
      m.setZIndexOffset(on?600:0);
      if(el&&!el.classList.contains('boom')&&!el.classList.contains('cap')){
        on?el.classList.add('hov'):el.classList.remove('hov');
      }
      el?.classList.remove('dimmed');
    } else {
      el?.classList.toggle('dimmed', on);
    }
  });
}

function highlightArchi(archiId, on) {
  if(on && !S.showSpotlight) return;
  Object.values(markers).forEach(m=>{
    const isTarget=m._spawn.archi_id==archiId;
    const el=m.getElement()?.querySelector('.ai');
    if(isTarget){
      m.setZIndexOffset(on?1000:0);
      if(el&&!el.classList.contains('boom')&&!el.classList.contains('cap')){
        on?el.classList.add('hov'):el.classList.remove('hov');
      }
      el?.classList.remove('dimmed');
    } else {
      el?.classList.toggle('dimmed', on);
    }
  });
}

function toggleHideDone() {
  S.hideDone=!S.hideDone;
  document.getElementById('hide-done-btn')?.classList.toggle('on',S.hideDone);
  buildTree();
}

function toggleShowCaptured() {
  S.showCaptured=!S.showCaptured;
  saveUIState();
  document.body.classList.toggle('show-captured',S.showCaptured);
  const btn=document.getElementById('show-cap-btn');
  btn.textContent=S.showCaptured?t('showCapOn'):t('showCapOff');
  btn.classList.toggle('on',S.showCaptured);
  Object.values(markers).forEach(m=>{m._vk=null;});
  refreshMarkers();
}

/* ══════════════════════════════════════════════
   TOOLTIP CUSTOM
══════════════════════════════════════════════ */
function showTip(spawn, archi, marker, force=false) {
  if(S.tip.locked && !force && String(spawn.archi_id)!==S.tip.id) return;
  S.tip.id=String(spawn.archi_id);
  S.tip.marker=marker;

  const level=getArchiLevel(S.tip.id);
  const stone=getSoulStone(level);
  const zd=getZone(spawn);
  // Imagen
  const thumb=document.getElementById('tip-thumb');
  const ph=document.getElementById('tip-ph');
  thumb.style.display='block'; ph.style.display='none';
  thumb.src=CFG.img(S.tip.id);
  thumb.onerror=()=>_imgErr(thumb);

  document.getElementById('tip-aname').textContent=archiName(archi);
  document.getElementById('tip-mname').textContent=mobName(archi);
  document.getElementById('tip-level').textContent=level?`${t('nivel')} ${level}`:t('unknownLevel');

  const stoneEl=document.getElementById('tip-stone');
  if(stone){ stoneEl.innerHTML=stoneHTML(stone); stoneEl.style.color=stone.color; }
  else     { stoneEl.textContent=`? ${t('noLevelData')}`; stoneEl.style.color='var(--txt3)'; }

  // Labels traducibles
  _refreshTipHint();
  document.getElementById('tip-lbl-zona').textContent=t('zona');
  document.getElementById('tip-lbl-info').textContent=t('info');

  // Cuerpo expandible
  document.getElementById('tip-zone').textContent=`${zd.zone} › ${zd.subzone}`;
  document.getElementById('tip-quest').textContent=`Step ${archi.quest_step} · ID ${S.tip.id}`;
  document.getElementById('tip-langs').innerHTML=LANGS
    .filter(l=>l.code!==S.lang)
    .map(l=>`<span class="lbl">${l.flag}</span><span class="val">${archi.names[l.code]?.archi||'—'}</span>`)
    .join('');

  const noteEl=document.getElementById('tip-note');
  const noteText=S.notes?.[S.tip.id]||'';
  noteEl.textContent=noteText;
  noteEl.style.display=noteText?'block':'none';

  refreshTipBtn(); refreshFavBtns(S.tip.id);
  positionTip(marker);
  document.getElementById('archi-tip').classList.add('vis');
}

function _refreshTipHint() {
  const el=document.getElementById('tip-hint'); if(!el) return;
  if(S.tip.locked||S.tip.expanded) el.textContent=t('tipHintClose');
  else el.textContent=t('tipHint');
}

function expandTip() {
  if(!S.tip.id) return;
  S.tip.expanded=true;
  document.getElementById('tip-body').classList.add('o');
  refreshTipBtn(); _refreshTipHint();
}

function collapseTip() {
  S.tip.expanded=false;
  document.getElementById('tip-body').classList.remove('o');
}

function hideTip(force=false) {
  if(S.tip.locked&&!force) return;
  document.getElementById('archi-tip').classList.remove('vis');
  setTimeout(()=>{ if(!document.getElementById('archi-tip').classList.contains('vis')) collapseTip(); },200);
  S.tip.id=null; S.tip.marker=null; S.tip.expanded=false; S.tip.locked=false;
}

function positionTip(marker) {
  if(window.innerWidth<=768){ // CSS controla posición en móvil
    const tip=document.getElementById('archi-tip');
    tip.style.left=''; tip.style.top=''; tip.style.transform='';
    return;
  }
  const p=map.latLngToContainerPoint(marker.getLatLng());
  const rect=document.getElementById('map').getBoundingClientRect();
  const tw=230, th=110, markerHalfW=CFG.iconW/2+4;
  let x=rect.left+p.x+markerHalfW+8;
  let y=rect.top+p.y-th/2-10;
  let flipped=false;
  if(x+tw>window.innerWidth-8){ x=rect.left+p.x-tw-markerHalfW-8; flipped=true; }
  x=Math.max(8,x);
  y=Math.max(rect.top+8,Math.min(y,window.innerHeight-th-8));
  const tip=document.getElementById('archi-tip');
  tip.classList.toggle('flipped',flipped);
  tip.style.left=`${x}px`; tip.style.top=`${y}px`;
}

function refreshTipBtn() {
  const btn=document.getElementById('tip-cap');
  const cap=isCap(S.tip.id), partial=isPartial(S.tip.id);
  const cnt=getCaptureCount(S.tip.id), max=S.maxAccounts;
  if(cap)         { btn.textContent='✓ '+cnt+'/'+max+' — '+t('capUnmark'); btn.className='tip-cap done'; }
  else if(partial){ btn.textContent=cnt+'/'+max+' '+t('capAccounts')+' — '+t('capAdd'); btn.className='tip-cap todo'; btn.style.background='var(--orange)'; return; }
  else            { btn.textContent=t('capMark'); btn.className='tip-cap todo'; }
  btn.style.background='';
}
function toggleCapFromTip() { if(S.tip.id) toggleCapture(S.tip.id); }

// Tooltip hover stay-open
const tipEl=document.getElementById('archi-tip');
tipEl.addEventListener('mouseenter',()=>clearTimeout(S.tip.hideTimer));
tipEl.addEventListener('mouseleave',()=>{ if(!S.tip.expanded) hideTip(); });
document.addEventListener('click', e=>{
  if((S.tip.locked||S.tip.expanded)&&!tipEl.contains(e.target)&&Date.now()-S.tip.lastExpand>100){
    S.tip.locked=false; hideTip(true);
  }
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ hideTip(true); closeModal(); }
});

/* ══════════════════════════════════════════════
   CAPTURE
══════════════════════════════════════════════ */
function toggleCapture(archiId) {
  const id=String(archiId);
  const prevCnt=getCaptureCount(id);
  const wasCap=isCap(id);
  // Ciclo: 0→1→…→maxAccounts→0
  const newCnt = wasCap ? 0 : Math.min(prevCnt+1, S.maxAccounts);
  if(newCnt===0) delete S.counts[id]; else S.counts[id]=newCnt;
  saveProgress();
  // Inventario = espejo de counts (siempre sincronizados)
  if(newCnt>0) S.inventory[id]=newCnt; else delete S.inventory[id];
  saveInventory();
  const nowCap=isCap(id);
  const logAction=newCnt>=S.maxAccounts?'cap':newCnt>0?'partial':'uncap';
  addCaptureLog(id,logAction);
  if(nowCap && !wasCap) {
    _checkSubzoneComplete(id);
    // Acaba de capturarse completamente → animación boom/shrink
    const anim=S.showCaptured?'shrink':'boom';
    Object.values(markers).forEach(m=>{
      if(String(m._spawn.archi_id)===id){
        const el=m.getElement()?.querySelector('.ai');
        if(el){ el.classList.remove('hov','dead','cap','partial','boom','shrink'); el.classList.add(anim); }
      }
    });
    setTimeout(()=>{ refreshMarkers(); updateTreeItem(id); updateCounter(); updateStones(); _adxRefreshIfOpen(); },S.showCaptured?740:460);
  } else {
    refreshMarkers(); updateTreeItem(id); updateCounter(); updateStones(); _adxRefreshIfOpen();
  }
  if(S.tip.id===id) refreshTipBtn();
  if(S.modalId===id) refreshModalBtn();
}
function captureAll(ids) {
  const notFull=[...ids].filter(id=>!isCap(String(id)));
  const anim=S.showCaptured?'shrink':'boom';
  notFull.forEach(id=>{
    Object.values(markers).forEach(m=>{
      if(String(m._spawn.archi_id)===String(id)){
        const el=m.getElement()?.querySelector('.ai');
        if(el){ el.classList.remove('hov','dead','cap','partial','boom','shrink'); el.classList.add(anim); }
      }
    });
  });
  setTimeout(()=>{
    ids.forEach(id=>{ S.counts[String(id)]=S.maxAccounts; S.inventory[String(id)]=S.maxAccounts; });
    _rebuildCaptured(); saveProgress(); saveInventory(); refreshMarkers(); buildTree(); updateCounter(); updateStones(); _adxRefreshIfOpen();
  }, notFull.length?(S.showCaptured?740:460):0);
}
function uncaptureAll(ids) {
  ids.forEach(id=>{ delete S.counts[String(id)]; delete S.inventory[String(id)]; });
  _rebuildCaptured(); saveProgress(); saveInventory(); refreshMarkers(); buildTree(); updateCounter(); updateStones(); _adxRefreshIfOpen();
}

/* ══════════════════════════════════════════════
   HUNT MODE
══════════════════════════════════════════════ */
function toggleDead(archiId, label) {
  const id=String(archiId);
  if(isDead(id)){
    delete S.hunt.dead[id];
    notify(tf('notifUndead',label),'blue');
  } else {
    const sp=spawns.find(s=>String(s.archi_id)===id);
    const cdMin=sp?.cooldown_minutes||CFG.defaultCd;
    S.hunt.dead[id]={ start:Date.now(), duration:cdMin*60*1000, label, notified:false };
    notify(tf('notifDead',label,cdMin),'orange');
    // Log kill in session
    const entry=S.hunt.log.find(e=>e.id===id);
    if(entry) entry.count++;
    else S.hunt.log.push({id, label, count:1, time:Date.now()});
  }
  saveCaza(); refreshMarkers(); updateTreeItem(id); tickCooldowns();
}
function clearAllCooldowns() {
  const count=Object.keys(S.hunt.dead).length;
  if(!count) return;
  S.hunt.dead={};
  saveCaza();
  refreshMarkers();
  buildTree();
  notify(tf('notifCdCleared',count),'blue');
}

/* ── Hunt Session Modal ───────────────────────── */
function openHuntSession() {
  const log=S.hunt.log;
  document.getElementById('hs-hd-title').textContent=t('hsTitle');
  document.getElementById('hs-sub').textContent=log.length?tf('hsSub',log.length):t('hsSubNone');
  const list=document.getElementById('hs-list');
  const toolbar=document.getElementById('hs-toolbar');
  const hasUncapped=log.some(e=>!isCap(e.id));
  toolbar.style.display=hasUncapped?'flex':'none';
  if(!log.length){
    list.innerHTML=`<div style="padding:18px 16px;color:var(--txt3);font-size:12px;text-align:center">${t('hsEmpty')}</div>`;
  } else {
    const defQty=S.maxAccounts;
    list.innerHTML=log.map(e=>{
      const already=isCap(e.id);
      return `<label class="hs-row"${already?` style="opacity:.55"`:''}>
        <input class="hs-chk" type="checkbox" data-id="${e.id}"${already?' disabled':''} checked>
        <img class="hs-img" src="${CFG.img(e.id)}" onerror="_imgErr(this)">
        <span style="flex:1;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.label}</span>
        ${e.count>1?`<span class="hs-count" title="${t('killsSession')}">${tf('hsKills',e.count)}</span>`:''}
        ${already
          ?`<span style="font-size:10px;color:var(--txt3);flex-shrink:0">${t('hsAlreadyCap')}</span>`
          :`<div class="hs-qty">
              <button class="hs-qty-btn" onclick="event.preventDefault();hsQtyAdj(this,-1)">−</button>
              <span class="hs-qty-val">${defQty}</span>
              <button class="hs-qty-btn" onclick="event.preventDefault();hsQtyAdj(this,1)">+</button>
            </div>`
        }
      </label>`;
    }).join('');
  }
  document.getElementById('hs-apply-btn').textContent=t('hsApply');
  document.getElementById('hs-clear-btn').textContent=t('hsClear');
  _hsRefreshSelAll();
  document.getElementById('hs-overlay').classList.add('open');
}
function hsQtyAdj(btn, delta) {
  const val=btn.parentElement.querySelector('.hs-qty-val');
  val.textContent=Math.max(1, parseInt(val.textContent,10)+delta);
}
function hsToggleAll() {
  const checks=[...document.querySelectorAll('#hs-list .hs-chk:not(:disabled)')];
  const allOn=checks.every(c=>c.checked);
  checks.forEach(c=>c.checked=!allOn);
  _hsRefreshSelAll();
}
function _hsRefreshSelAll() {
  const checks=[...document.querySelectorAll('#hs-list .hs-chk:not(:disabled)')];
  const allOn=checks.length>0&&checks.every(c=>c.checked);
  const btn=document.getElementById('hs-selall-btn');
  if(btn) btn.textContent=allOn?t('hsDeselectAll'):t('hsSelectAll');
}
function closeHuntSession() {
  document.getElementById('hs-overlay').classList.remove('open');
}
function confirmHuntSession() {
  const rows=[...document.querySelectorAll('#hs-list .hs-row')];
  let applied=0;
  const selectedIds=new Set();
  rows.forEach(row=>{
    const chk=row.querySelector('.hs-chk');
    if(!chk||!chk.checked) return;
    selectedIds.add(chk.dataset.id);
    if(chk.disabled) return;
    const id=chk.dataset.id;
    const qty=parseInt(row.querySelector('.hs-qty-val')?.textContent||'1',10);
    const cur=getCaptureCount(id);
    const next=Math.max(cur,qty);
    if(next>cur){ S.counts[id]=next; S.inventory[id]=(S.inventory[id]||0)+qty; applied++; }
  });
  if(selectedIds.size){
    S.hunt.log=S.hunt.log.filter(e=>!selectedIds.has(e.id));
    saveCaza();
  }
  if(applied){
    _rebuildCaptured(); saveProgress(); saveInventory();
    refreshMarkers(); buildTree(); updateCounter(); updateStones(); _adxRefreshIfOpen();
    notify(tf('notifHsApplied',applied),'green');
  }
  closeHuntSession();
}
function clearHuntSession() {
  S.hunt.log=[];
  saveCaza();
  notify(t('notifHsCleared'),'blue');
  closeHuntSession();
}

/* ══════════════════════════════════════════════
   INVENTARIO + BESTIARIO (unified)
══════════════════════════════════════════════ */
let _adxFilter='all';
let _adxStoneIdx=-1; // -1 = todos, 0-4 = índice en STONES

function _syncInvCaptures() {
  // Recalcula counts desde inventario al cambiar maxAccounts
  Object.keys(S.inventory).forEach(id=>{
    const qty=S.inventory[id]||0;
    if(qty>0) S.counts[id]=Math.min(qty,S.maxAccounts);
    else delete S.counts[id];
  });
  // Limpia counts de archis que ya no tienen inventario
  Object.keys(S.counts).forEach(id=>{
    if(!(S.inventory[id]>0)) delete S.counts[id];
  });
}
function saveInventory() {
  localStorage.setItem('archi-inventory', JSON.stringify(S.inventory));
  _bcBroadcast('archi-inventory');
}
function loadInventory() {
  try {
    const r=localStorage.getItem('archi-inventory');
    if(r){ const d=JSON.parse(r); if(d&&typeof d==='object') S.inventory=d; }
  } catch(_){}
}
function invAdj(id, delta) {
  const cur=S.inventory[id]||0;
  const next=Math.max(0, cur+delta);
  if(next===0) delete S.inventory[id]; else S.inventory[id]=next;
  saveInventory();
  // Counts = espejo del inventario (siempre sincronizados)
  const prevCounts=S.counts[id]||0;
  if(next>0) S.counts[id]=Math.min(next,S.maxAccounts); else delete S.counts[id];
  if((S.counts[id]||0)!==prevCounts){ _rebuildCaptured(); saveProgress(); refreshMarkers(); updateTreeItem(id); updateCounter(); updateStones(); if(S.tip.id===id) refreshTipBtn(); }
  // inline DOM update — no full re-render
  const val=document.querySelector(`.adx-stp-val[data-id="${id}"]`);
  if(val){ val.textContent=next; val.classList.toggle('has-stock',next>0); }
  const ib=document.querySelector(`.adx-inv-badge[data-id="${id}"]`);
  if(ib){ ib.textContent=next>0?`×${next}`:''; ib.style.display=next>0?'':'none'; }
  // update card captured class inline
  const card=val?.closest('.adx-card');
  if(card){
    const nowCap=isCap(id);
    card.classList.toggle('captured',nowCap);
    const btn=card.querySelector('.adx-cap-btn');
    if(btn){ btn.classList.toggle('on',nowCap); btn.textContent=nowCap?'✓':'○'; }
  }
  _updateAdxBadges();
}
function adxPromptClearInventory() {
  if(!Object.keys(S.inventory).length) return;
  const box=document.getElementById('adx-clr-confirm');
  document.getElementById('adx-clr-title').textContent=t('adxClrTitle');
  document.getElementById('adx-clr-desc').textContent=t('adxClrDesc');
  document.getElementById('adx-clr-ok').textContent=t('adxClrOk');
  document.getElementById('adx-clr-cancel').textContent=t('adxClrCancel');
  box.classList.add('open');
}
function adxCloseClearConfirm() {
  document.getElementById('adx-clr-confirm').classList.remove('open');
}
function adxConfirmClear() {
  adxCloseClearConfirm();
  adxClearInventory();
}
function adxClearInventory() {
  if(!Object.keys(S.inventory).length) return;
  S.inventory={};
  S.counts={};
  _rebuildCaptured();
  saveInventory();
  saveProgress();
  refreshMarkers(); updateCounter(); updateStones(); updateProgressBar();
  _renderArchidex();
  notify(t('notifInvCleared'),'blue');
}
function adxToggleCap(id) {
  toggleCapture(id); // already calls _adxRefreshIfOpen at end
}
function adxToggleFav(id) {
  toggleFav(id);
  refreshFavBtns(id);
  // inline update on adx card
  const on=isFav(id);
  const btn=document.querySelector(`.adx-fav-btn[data-fav="${id}"]`);
  if(btn){ btn.classList.toggle('on',on); btn.textContent=on?'★':'☆'; }
}
function _adxRefreshIfOpen() {
  if(document.getElementById('adx-overlay')?.classList.contains('open')) _renderArchidex();
}
function _updateAdxBadges() {
  const totalCap=catalog.filter(a=>isCap(String(a.id))).length;
  const cb=document.getElementById('adx-cap-badge');
  if(cb) cb.textContent=tf('adxCapOf',totalCap,catalog.length);
  const units=Object.values(S.inventory).reduce((a,b)=>a+b,0);
  const archis=Object.keys(S.inventory).length;
  const ib=document.getElementById('adx-inv-badge');
  const ci=document.getElementById('adx-clear-inv');
  if(ib){ ib.textContent=units>0?tf('adxInvTotal',archis,units):''; ib.style.display=units>0?'':'none'; }
  if(ci){ ci.style.display=units>0?'':'none'; }
}
function openArchidex() {
  _adxFilter='all';
  _adxStoneIdx=-1;
  document.getElementById('adx-search').value='';
  _syncAdxToolbar();
  _renderStoneRow();
  _renderArchidex();
  document.getElementById('adx-overlay').classList.add('open');
}
function closeArchidex() {
  document.getElementById('adx-overlay').classList.remove('open');
}
function adxSetFilter(f) {
  _adxFilter=f;
  document.querySelectorAll('.adx-fbtn').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
  _renderArchidex();
}
function _syncAdxToolbar() {
  document.getElementById('adx-hd-title').textContent=t('adxTitle');
  const si=document.getElementById('adx-search'); if(si) si.placeholder=t('searchPlaceholder');
  document.querySelectorAll('.adx-fbtn').forEach(btn=>{
    const f=btn.dataset.f;
    btn.classList.toggle('on',f===_adxFilter);
    btn.textContent=t('adx'+f.charAt(0).toUpperCase()+f.slice(1));
  });
  const sort=document.getElementById('adx-sort');
  if(sort){
    const cur=sort.value||'step';
    sort.innerHTML=[['step',t('adxSortStep')],['name',t('adxSortName')],['level',t('adxSortLevel')],['stock',t('adxSortStock')]]
      .map(([v,l])=>`<option value="${v}"${v===cur?' selected':''}>${l}</option>`).join('');
  }
  _renderStoneRow();
  _updateAdxBadges();
}
function _renderArchidex() {
  const search=(document.getElementById('adx-search')?.value||'').toLowerCase().trim();
  const sortVal=document.getElementById('adx-sort')?.value||'step';
  let items=catalog.map(a=>{
    const id=String(a.id);
    const level=getArchiLevel(id);
    return { id, aname:archiName(a), mname:mobName(a),
      zone:archiZones[id]?.subzone||t('noSub'),
      level, stone:getSoulStone(level),
      cap:isCap(id), inv:S.inventory[id]||0, step:a.quest_step };
  });
  if(_adxFilter==='captured')  items=items.filter(i=>i.cap);
  else if(_adxFilter==='pending')   items=items.filter(i=>!i.cap);
  else if(_adxFilter==='favorites') items=items.filter(i=>isFav(i.id));
  if(_adxStoneIdx>=0) items=items.filter(i=>STONES.indexOf(i.stone)===_adxStoneIdx);
  if(search) items=items.filter(i=>
    i.aname.toLowerCase().includes(search)||
    i.mname.toLowerCase().includes(search)||
    i.zone.toLowerCase().includes(search)
  );
  if(sortVal==='name')  items.sort((a,b)=>a.aname.localeCompare(b.aname));
  else if(sortVal==='level') items.sort((a,b)=>(a.level||9999)-(b.level||9999));
  else if(sortVal==='stock') items.sort((a,b)=>(b.inv-a.inv)||a.aname.localeCompare(b.aname));
  else items.sort((a,b)=>a.step-b.step); // step = dex order (default)

  _updateAdxBadges();
  const grid=document.getElementById('adx-grid');
  if(!items.length){ grid.innerHTML=`<div style="padding:30px;color:var(--txt3);font-size:13px;text-align:center;grid-column:1/-1">${t('adxEmpty')}</div>`; return; }

  grid.innerHTML=items.map(i=>{
    const stoneHtml=i.stone?`<img class="adx-stone-img" src="${i.stone.img}" title="${stoneName(i.stone)}">`:'';
    const hasNote=!!(S.notes&&S.notes[i.id]);
    const fav=isFav(i.id);
    return `<div class="adx-card${i.cap?' captured':''}" onclick="openModal(${i.id})">
      <button class="adx-cap-btn${i.cap?' on':''}" onclick="event.stopPropagation();adxToggleCap('${i.id}')" title="${i.cap?t('capUnmark'):t('capMark')}">${i.cap?'✓':'○'}</button>
      <button class="adx-fav-btn${fav?' on':''}" data-fav="${i.id}" onclick="event.stopPropagation();adxToggleFav('${i.id}')" title="${t('ttlFav')}">${fav?'★':'☆'}</button>
      <span class="adx-idx">S${i.step}</span>
      <span class="adx-note-dot" data-id="${i.id}" title="${t('adxNotes')}" style="display:${hasNote?'':'none'}"></span>
      <img class="adx-img" src="${CFG.img(i.id)}" onerror="_imgErr(this)">
      <div class="adx-aname">${i.aname}</div>
      <div class="adx-mname">${i.mname}</div>
      <div class="adx-badges">
        ${i.level?`<span class="adx-lvl">Lv ${i.level}</span>`:''}
        ${stoneHtml}
<span class="adx-inv-badge" data-id="${i.id}" style="display:${i.inv>0?'':'none'}">${i.inv>0?`×${i.inv}`:''}</span>
      </div>
      <div class="adx-stepper" onclick="event.stopPropagation()">
        <button class="adx-stp-btn" onclick="invAdj('${i.id}',-1)">−</button>
        <span class="adx-stp-val${i.inv>0?' has-stock':''}" data-id="${i.id}">${i.inv}</span>
        <button class="adx-stp-btn" onclick="invAdj('${i.id}',1)">+</button>
      </div>
    </div>`;
  }).join('');
}

/* ─── Stone filter row ──────────────────────────── */
function _renderStoneRow() {
  const row=document.getElementById('adx-stone-row');
  if(!row) return;
  const names=(I18N[S.lang]||I18N.es).stones;
  let html=`<button class="adx-sfbtn${_adxStoneIdx===-1?' on':''}" onclick="adxSetStone(-1)" style="${_adxStoneIdx===-1?'border-color:var(--txt2);color:var(--txt)':''}">${t('adxAll')}</button>`;
  STONES.slice(0,4).forEach((s,i)=>{
    const on=_adxStoneIdx===i;
    html+=`<button class="adx-sfbtn${on?' on':''}" onclick="adxSetStone(${i})" style="${on?`border-color:${s.color};color:${s.color}`:''}">`
      +`<img src="${s.img}">${names[i]||'?'}</button>`;
  });
  row.innerHTML=html;
}
function adxSetStone(idx) {
  _adxStoneIdx=idx;
  _renderStoneRow();
  _renderArchidex();
}

/* ─── Notes ─────────────────────────────────────── */
function saveNotes() { localStorage.setItem('archi-notes',JSON.stringify(S.notes)); _bcBroadcast('archi-notes'); }
function loadNotes() {
  try{
    const r=localStorage.getItem('archi-notes');
    if(r){ const d=JSON.parse(r); if(d&&typeof d==='object') S.notes=d; }
  } catch(_){}
}
function saveNote(id, text) {
  if(!id) return;
  if(text.trim()) S.notes[id]=text; else delete S.notes[id];
  saveNotes();
  const dot=document.querySelector(`.adx-note-dot[data-id="${id}"]`);
  if(dot) dot.style.display=text.trim()?'':'none';
}
let _noteTimer=null;
function saveModalNote(text) {
  clearTimeout(_noteTimer);
  _noteTimer=setTimeout(()=>{
    saveNote(S.modalId,text);
    if(S.tip.id===String(S.modalId)){
      const el=document.getElementById('tip-note');
      if(el){ el.textContent=text; el.style.display=text.trim()?'block':'none'; }
    }
  },250);
}

/* ─── Cross-tab sync (BroadcastChannel) ─────────────────────── */
const _bc = (()=>{ try{ return new BroadcastChannel('archi-sync'); }catch(_){ return null; } })();
let _bcNotifTimer=null;
let _bcIgnore = false; // evitar loop al recibir y re-guardar
function _bcBroadcast(key) {
  if(_bcIgnore || !_bc) return;
  _bc.postMessage({ key, value: localStorage.getItem(key) });
}
if(_bc) _bc.onmessage = e => {
  const { key, value } = e.data || {};
  if(!key) return;
  _bcIgnore = true;
  if(value != null) localStorage.setItem(key, value); else localStorage.removeItem(key);
  _bcIgnore = false;
  try {
    if(key==='archi-counts'){
      if(value == null){ S.counts={}; S.captured.clear(); }
      else { loadProgress(); }
      _rebuildCaptured(); refreshMarkers(); buildTree(); updateCounter(); updateStones(); updateProgressBar();
    }
    if(key==='archi-fav')       { S.favorites=new Set(); loadFav(); buildTree(); }
    if(key==='archi-inventory') { S.inventory={}; if(value!=null) loadInventory(); _syncInvCaptures(); _rebuildCaptured(); _bcIgnore=true; saveProgress(); _bcIgnore=false; refreshMarkers(); buildTree(); updateCounter(); updateStones(); }
    if(key==='archi-notes')     { loadNotes(); }
    _adxRefreshIfOpen();
    clearTimeout(_bcNotifTimer); _bcNotifTimer=setTimeout(()=>notify(t('notifTabSync'),'blue'),80);
  } catch(_) {}
};
function adxOpenNewTab() {
  const url = location.href.split('?')[0] + '?archidex=1' + (location.hash||'');
  window.open(url, '_blank');
}
/* ─── CSV import / export ────────────────────────── */
function _csvField(v) {
  const s=String(v);
  return (s.includes(',')||s.includes('"')||s.includes('\n'))?`"${s.replace(/"/g,'""')}"`:`${s}`;
}
function _parseCSVLine(line) {
  const res=[]; let cur='', inQ=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){ if(inQ&&line[i+1]==='"'){cur+='"';i++;} else inQ=!inQ; }
    else if(c===','&&!inQ){ res.push(cur); cur=''; }
    else cur+=c;
  }
  res.push(cur); return res;
}
function adxExportCSV() {
  // Exportar TODOS los archis (count 0 incluido) en formato Step,Name,ArchName,Count
  const data=catalog.map(a=>({a,step:a.quest_step})).sort((x,y)=>x.step-y.step);
  const rows=[['Step','Name','ArchName','Count'],
    ...data.map(({a})=>[a.quest_step, mobName(a), archiName(a), S.inventory[String(a.id)]||0])
  ];
  const csv='\uFEFF'+rows.map(r=>r.map(_csvField).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const el=document.createElement('a'); el.href=url; el.download='archi-inventario.csv'; el.click();
  URL.revokeObjectURL(url);
  notify(t('notifCsvExported'),'blue');
}
function adxImportCSV(inputEl) {
  const file=inputEl.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    let text=e.target.result;
    if(text.charCodeAt(0)===0xFEFF) text=text.slice(1); // strip BOM
    // Construir mapa nombre→id buscando en todos los idiomas
    const nameMap={};
    catalog.forEach(a=>{
      const id=String(a.id);
      Object.values(a.names||{}).forEach(lng=>{
        if(lng.mob)   nameMap[lng.mob.trim().toLowerCase()]=id;
        if(lng.archi) nameMap[lng.archi.trim().toLowerCase()]=id;
      });
    });
    // step→ids (fallback si nombre no matchea y hay un solo archi en ese step)
    const stepMap={};
    catalog.forEach(a=>{ const s=a.quest_step; (stepMap[s]=stepMap[s]||[]).push(String(a.id)); });

    const lines=text.split('\n');
    let count=0;
    lines.forEach((line,idx)=>{
      if(idx===0||!line.trim()) return; // skip header
      const p=_parseCSVLine(line);
      if(p.length<4) return;
      const step=parseInt(p[0],10);
      const mobN=p[1].trim().toLowerCase();
      const archiN=p[2].trim().toLowerCase();
      const qty=parseInt(p[3],10);
      if(isNaN(qty)) return;
      let id=nameMap[archiN]||nameMap[mobN];
      if(!id&&!isNaN(step)&&stepMap[step]?.length===1) id=stepMap[step][0];
      if(!id) return;
      if(qty>0) S.inventory[id]=qty; else delete S.inventory[id];
      count++;
    });
    saveInventory();
    Object.keys(S.inventory).forEach(id=>{
      const qty=S.inventory[id]||0;
      if(qty>=S.maxAccounts&&!isCap(id)) S.counts[id]=S.maxAccounts;
      else if(qty<S.maxAccounts&&isCap(id)) delete S.counts[id];
    });
    _rebuildCaptured(); saveProgress();
    _renderArchidex();
    notify(t('notifCsvImported'),'blue');
    inputEl.value='';
  };
  reader.readAsText(file,'UTF-8');
}

let _cdActiveKey='';
function tickCooldowns() {
  if(S.mode!=='caza') return;
  const now=Date.now();
  const active=[];
  Object.entries(S.hunt.dead).forEach(([id,cd])=>{
    if(cd.notified) return;
    const rem=cd.duration-(now-cd.start);
    if(rem<=0){
      cd.notified=true;
      if(S.cazaNotif) notify(tf('notifRespawn',cd.label),'green');
      saveCaza(); refreshMarkers(); updateTreeItem(id);
    } else { active.push([id,cd,rem]); }
  });
  const cdList=document.getElementById('cd-list');
  const newKey=active.map(([id])=>id).sort().join(',');
  if(newKey!==_cdActiveKey){
    _cdActiveKey=newKey;
    if(!active.length){ cdList.innerHTML=`<span style="color:var(--txt3)">${t('cdEmpty')}</span>`; return; }
    cdList.innerHTML=active.map(([id,cd,rem])=>{
      const m=Math.floor(rem/60000), s=String(Math.floor((rem%60000)/1000)).padStart(2,'0');
      return `<div class="cd-row" data-id="${id}">
        <img class="cd-thumb" src="${CFG.img(id)}" onerror="_imgErr(this)" />
        <span class="cd-name" title="${cd.label}">${cd.label}</span>
        <span class="cd-time" data-cdid="${id}">${m}m${s}s</span>
        <button class="cd-x" onclick="toggleDead('${id}','${cd.label.replace(/'/g,"\\'")}')">✕</button>
      </div>`;
    }).join('');
  } else {
    active.forEach(([id,,rem])=>{
      const m=Math.floor(rem/60000), s=String(Math.floor((rem%60000)/1000)).padStart(2,'0');
      const el=cdList.querySelector(`[data-cdid="${id}"]`);
      if(el) el.textContent=`${m}m${s}s`;
    });
  }
}
setInterval(tickCooldowns,1000);

// Hover sobre cooldowns → resaltar en mapa
let _cdHover=null;
document.getElementById('cd-list').addEventListener('mouseover',e=>{
  const row=e.target.closest('.cd-row[data-id]');
  const id=row?.dataset.id||null;
  if(id===_cdHover) return;
  if(_cdHover) highlightArchi(_cdHover,false);
  _cdHover=id;
  if(id) highlightArchi(id,true);
});
document.getElementById('cd-list').addEventListener('mouseout',e=>{
  if(!e.relatedTarget?.closest?.('#cd-list')){
    if(_cdHover) highlightArchi(_cdHover,false);
    _cdHover=null;
  }
});

/* ══════════════════════════════════════════════
   ÁRBOL
══════════════════════════════════════════════ */
let _zoneMapCache=null;
function buildZoneMap() {
  if(_zoneMapCache) return _zoneMapCache;
  const zones={};
  if(Object.keys(archiZones).length>0){
    catalog.forEach(a=>{
      const list=getZoneList(a.id);
      const entries=list?.length ? list : [{zone:null,subzone:null}];
      entries.forEach(zd=>{
        const z=norm(zoneName(zd)), sz=norm(subzoneName(zd)||'—');
        zones[z]=zones[z]||{}; zones[z][sz]=zones[z][sz]||new Set(); zones[z][sz].add(String(a.id));
      });
    });
    _zoneMapCache=zones; // cacheable: basado en catálogo estático
  } else {
    spawns.forEach(s=>{
      const z=norm(s.zone||'Sin zona'), sz=norm(s.subzone||'—');
      zones[z]=zones[z]||{}; zones[z][sz]=zones[z][sz]||new Set(); zones[z][sz].add(String(s.archi_id));
    });
    // no cachear la versión sin archiZones (spawns pueden cambiar en beta)
  }
  return zones;
}

function countDone(ids){ let n=0; ids.forEach(id=>{if(isCap(id))n++;}); return n; }

let _btRafId=null;
function buildTree(){ cancelAnimationFrame(_btRafId); _btRafId=requestAnimationFrame(_doBuildTree); }

function _doBuildTree() {
  const q=S.search.toLowerCase();
  const tree=document.getElementById('sb-tree');
  const scroll=tree.scrollTop;
  const zones=buildZoneMap();
  tree.innerHTML='';
  // Mapa de nombre traducido → key en español (para zonePolygonLayers)
  const zKeyMap=new Map();
  getUniqueZoneList().forEach(({zone,subzone,key})=>zKeyMap.set(`${zone}|||${subzone}`,key));

  if(!spawns.length&&!Object.keys(archiZones).length){
    tree.innerHTML=`<div style="padding:24px 16px;text-align:center;color:var(--txt3);font-size:12px;">${t('treeEmpty')}</div>`;
    return;
  }

  Object.entries(zones).sort(([a],[b])=>a.localeCompare(b)).forEach(([zName,subs])=>{
    if(S.zoneFilters !== null && !S.zoneFilters.has(zName)) return;
    // Stats de zona se acumulan desde subzonas (ya filtradas por búsqueda)
    const szNodes=[], szNodeKeys=[];
    let zTotal=0, zDone=0; const allZIds=new Set();

    Object.entries(subs).sort(([a],[b])=>a==='—'?1:a.localeCompare(b)).forEach(([szName,ids])=>{
      let visIds=[...ids];
      if(q) visIds=visIds.filter(id=>{ const a=getArchi(id); return a&&(archiName(a).toLowerCase().includes(q)||mobName(a).toLowerCase().includes(q)); });
      if(S.favFilter) visIds=visIds.filter(id=>isFav(id));
      if(S.underground) visIds=visIds.filter(id=>{
        const az=archiZones[String(id)];
        if(!az) return false;
        return (az.zones||[]).some(zd=>norm(subzoneName(zd)||'—')===szName&&zd.underground===true);
      });
      if(S.stoneFilter!=null) visIds=visIds.filter(id=>getSoulStone(getArchiLevel(id))?.max===S.stoneFilter);
      if(S.stepFilter!=null) visIds=visIds.filter(id=>{ const a=getArchi(id); return a?.quest_step===S.stepFilter; });
      if(S.huntHideCap&&S.mode==='caza') visIds=visIds.filter(id=>!isCap(id));
      const anyFilter=q||S.favFilter||S.underground||S.stoneFilter!=null||S.stepFilter!=null||(S.huntHideCap&&S.mode==='caza');
      if(anyFilter&&!visIds.length) return;

      // Conteos sobre los IDs activos (filtrados si hay filtro activo)
      const activeIds=anyFilter?new Set(visIds):ids;
      const szDone=countDone(activeIds);
      const szSize=activeIds.size;
      if(S.hideDone&&szSize>0&&szDone===szSize) return;
      const szStatus=szSize===0?'':szDone===szSize?'done':szDone>0?'partial':'';

      // Acumular stats de zona
      zTotal+=szSize; zDone+=szDone; activeIds.forEach(id=>allZIds.add(id));

      const szKey=szName==='—'?zName:szName;
      const isOpen=!!q||S.open.subs.has(szKey);
      const spKey=zKeyMap.get(`${zName}|||${szName}`)||null;
      if(spKey) szNodeKeys.push(spKey);
      const hasPoly=spKey&&!!zonePolygonLayers[spKey];
      const szHd=el('div',`tsz-hd${szStatus?' '+szStatus:''}`);
      const szPct=szSize>0?Math.round(szDone/szSize*100):0;
      szHd.innerHTML=`
        <span class="t-arrow${isOpen?' o':''}">▶</span>
        <button class="t-markall" title="${t('ttlMarkSub')}">✓</button>
        <span class="tsz-name">${szName}</span>
        <span class="t-badge${szStatus?' '+szStatus:''}"><div class="t-prog"><div class="t-prog-fill" style="width:${szPct}%"></div></div>${szDone}/${szSize}</span>
        ${hasPoly&&S.showZoneGoto?`<button class="zl-goto" title="${t('ttlGotoZone')}">↪</button>`:''}
        ${spKey&&S.showRouteAddBtn?`<button class="zl-route-add${S.route.stops.some(s=>s.key===spKey)?' in-route':''}" data-key="${spKey}" title="${t('rtAddTitle')}">＋</button>`:''}`;
      if(hasPoly){
        szHd.querySelector('.zl-goto')?.addEventListener('click',e=>{ e.stopPropagation(); flyToZone(spKey); });
      }
      if(spKey){
        szHd.querySelector('.zl-route-add')?.addEventListener('click',e=>{ e.stopPropagation(); routeAddZone(spKey, zName, szName); });
      }
      szHd.addEventListener('mouseenter', ()=>{
        if(hasPoly&&S.showZoneHighlight) highlightZonePoly(spKey,true);
        highlightSubzoneMarkers(ids, true, zName, szName);
      });
      szHd.addEventListener('mouseleave', ()=>{
        if(hasPoly) highlightZonePoly(spKey,false);
        highlightSubzoneMarkers(ids, false, zName, szName);
      });
      szHd.querySelector('.t-markall').addEventListener('click',e=>{
        e.stopPropagation();
        [...ids].every(isCap)?uncaptureAll(ids):captureAll(ids);
      });
      _addLongPress(szHd,()=>{
        const allCap=[...ids].every(isCap);
        if(confirm(`${allCap?t('capUnmark'):t('capMark')}: ${szName} (${ids.size})?`))
          allCap?uncaptureAll(ids):captureAll(ids);
      });

      const aList=el('div',`ta-list${isOpen?' o':''}`);
      (anyFilter?visIds:[...ids]).sort().forEach(archiId=>{
        const archi=getArchi(archiId); if(!archi) return;
        const cap=isCap(archiId), partial=isPartial(archiId), dead=isDead(archiId);
        const cls=cap?'done':(partial?'partial':(dead?'dead':''));
        const cnt=getCaptureCount(archiId), max=S.maxAccounts;
        const archiLvl=getArchiLevel(archiId), archiStone=getSoulStone(archiLvl);
        const isCaza=S.mode==='caza';
        const dotColor=cap?'var(--green)':partial?'var(--orange)':dead?'var(--orange)':(archiStone?.color||'var(--blue)');
        const chkTxt=cap?'✓':(partial?`${cnt}/${max}`:`+`);
        const huntTxt=dead?'💀':'⚔';
        const item=el('div',`ta ${cls}`);
        item.dataset.archi=archiId;
        const fav=isFav(archiId);
        item.innerHTML=`
          <span class="t-dot ${cls}" style="background:${dotColor}"></span>
          <span class="ta-name" title="${archiName(archi)} · ${mobName(archi)}"><span class="ta-archi">${archiName(archi)}</span><span class="ta-mob">${mobName(archi)}</span></span>
          ${S.showFavBtn?`<button class="t-fav${fav?' on':''}" data-id="${archiId}" title="${t('ttlFav')}">${fav?'★':'☆'}</button>`:''}
          ${isCaza
            ?`<button class="t-chk t-kill${dead?' dead':''}" data-id="${archiId}" title="${t('ttlAddCooldown')}">${huntTxt}</button>`
            :`<button class="t-chk${cap?' done':''}" data-id="${archiId}">${chkTxt}</button>`
          }`;
        item.addEventListener('mouseenter',()=>{
          highlightArchi(archiId,true);
          if(spKey) highlightZonePoly(spKey,true);
          else highlightArchiPolys(archiId,true);
        });
        item.addEventListener('mouseleave',()=>{
          highlightArchi(archiId,false);
          if(spKey) highlightZonePoly(spKey,false);
          else highlightArchiPolys(archiId,false);
        });
        item.addEventListener('click',e=>{
          if(e.target.classList.contains('t-chk')){
            if(S.mode==='caza') toggleDead(archiId, archiName(archi));
            else toggleCapture(archiId);
          } else if(e.target.classList.contains('t-fav')){ e.stopPropagation(); toggleFav(archiId); }
          else if(S.autoFlyArchi){
            flyToArchi(archiId);
            const sp=spawns.find(s=>String(s.archi_id)===String(archiId));
            const mk=sp?markers[sp.spawn_id]:null;
            if(sp&&mk){
              map.once('moveend',()=>{
                clearTimeout(S.tip.hideTimer);
                showTip(sp,archi,mk,true);
                expandTip();
                if(S.tipLockOnClick) S.tip.locked=true;
              });
            }
          } else {
            openModal(archiId);
          }
        });
        aList.appendChild(item);
      });

      szHd.addEventListener('click',()=>{
        if(!q){ S.open.subs.has(szKey)?S.open.subs.delete(szKey):S.open.subs.add(szKey); }
        aList.classList.toggle('o'); szHd.querySelector('.t-arrow').classList.toggle('o');
      });

      const szEl=el('div','tsz');
      szEl.appendChild(szHd); szEl.appendChild(aList);
      szNodes.push(szEl);
    });

    const _anyFilter=q||S.favFilter||S.underground||S.stoneFilter!=null||S.stepFilter!=null||S.hideDone||(S.huntHideCap&&S.mode==='caza');
    if(_anyFilter&&!szNodes.length) return;

    const zRealDone=countDone(allZIds); const zRealTotal=allZIds.size;
    const zStatus=zRealTotal===0?'':zRealDone===zRealTotal?'done':zRealDone>0?'partial':'';
    const isZOpen=!!q||S.open.zones.has(zName);
    const zHd=el('div',`tz-hd${zStatus?' '+zStatus:''}`);
    const zPct=zRealTotal>0?Math.round(zRealDone/zRealTotal*100):0;
    zHd.innerHTML=`
      <span class="t-arrow${isZOpen?' o':''}">▶</span>
      <button class="t-markall" title="${t('ttlMarkZone')}">✓</button>
      <span class="tz-name">${zName}</span>
      ${S.mode!=='caza'?`<button class="t-rev" title="${t('ttlRevZone')}">⚔</button>`:''}
      ${S.showRouteAddBtn?`<button class="zl-zone-route" title="${t('rtAddZone')}">＋▦</button>`:''}
      <span class="t-badge${zStatus?' '+zStatus:''}">
        <div class="t-prog"><div class="t-prog-fill" style="width:${zPct}%"></div></div>
        ${zRealDone}/${zRealTotal}
      </span>`;
    zHd.querySelector('.t-markall').addEventListener('click',e=>{
      e.stopPropagation();
      [...allZIds].every(isCap)?uncaptureAll(allZIds):captureAll(allZIds);
    });
    _addLongPress(zHd,()=>{
      const allCap=[...allZIds].every(isCap);
      if(confirm(`${allCap?t('capUnmark'):t('capMark')}: ${zName} (${allZIds.size})?`))
        allCap?uncaptureAll(allZIds):captureAll(allZIds);
    });
    zHd.querySelector('.t-rev')?.addEventListener('click',e=>{
      e.stopPropagation();
      const uncapped=[...allZIds].filter(id=>!isCap(id));
      const allDead=uncapped.every(isDead);
      uncapped.forEach(id=>{ const a=getArchi(id); if(a) allDead?toggleDead(id,archiName(a)):(!isDead(id)&&toggleDead(id,archiName(a))); });
    });
    zHd.querySelector('.zl-zone-route')?.addEventListener('click',e=>{
      e.stopPropagation();
      routeAddZoneGroup(zName, szNodeKeys);
    });
    const zBody=el('div',`tz-body${isZOpen?' o':''}`);
    zHd.addEventListener('click',()=>{
      if(!q){ S.open.zones.has(zName)?S.open.zones.delete(zName):S.open.zones.add(zName); }
      zBody.classList.toggle('o'); zHd.querySelector('.t-arrow').classList.toggle('o');
    });
    szNodes.forEach(n=>zBody.appendChild(n));

    const zEl=el('div'); zEl.appendChild(zHd); zEl.appendChild(zBody); tree.appendChild(zEl);
  });
  tree.scrollTop=scroll;
}

function updateTreeItem(archiId) {
  const id=String(archiId), cap=isCap(id), partial=isPartial(id), dead=isDead(id);
  const cls=cap?'done':(partial?'partial':(dead?'dead':''));
  const cnt=getCaptureCount(id), max=S.maxAccounts;
  document.querySelectorAll(`.ta[data-archi="${id}"]`).forEach(item=>{
    item.className=`ta ${cls}`;
    const dot=item.querySelector('.t-dot'); if(dot) dot.className=`t-dot ${cls}`;
    const btn=item.querySelector('.t-chk');
    if(btn){
      if(S.mode==='caza'){
        btn.textContent=dead?'💀':'⚔';
        btn.className=`t-chk t-kill${dead?' dead':''}`;
      } else {
        btn.textContent=cap?'✓':(partial?`${cnt}/${max}`:`+`);
        btn.className=`t-chk${cap?' done':''}`;
      }
    }
  });
  // Update subzone badges
  document.querySelectorAll('.tsz-hd .t-badge').forEach(badge=>{
    const szHd=badge.closest('.tsz-hd'); if(!szHd) return;
    const aList=szHd.nextElementSibling; if(!aList) return;
    const items=aList.querySelectorAll('.ta');
    const seen=new Set(); let done=0, total=0;
    items.forEach(i=>{ const aid=i.dataset.archi; if(seen.has(aid)) return; seen.add(aid); total++; if(i.classList.contains('done')) done++; });
    const pct=total>0?Math.round(done/total*100):0;
    const st=total===0?'':done===total?'done':done>0?'partial':'';
    badge.className=`t-badge${st?' '+st:''}`;
    badge.innerHTML=`<div class="t-prog"><div class="t-prog-fill" style="width:${pct}%"></div></div>${done}/${total}`;
    szHd.className=`tsz-hd${st?' '+st:''}`;
  });
  // Update zone badges
  document.querySelectorAll('.tz-hd .t-badge').forEach(badge=>{
    const zHd=badge.closest('.tz-hd'); if(!zHd) return;
    const zBody=zHd.nextElementSibling; if(!zBody) return;
    const items=zBody.querySelectorAll('.ta');
    const seen=new Set(); let done=0;
    items.forEach(i=>{ const aid=i.dataset.archi; if(seen.has(aid)) return; seen.add(aid); if(i.classList.contains('done')) done++; });
    const total=seen.size; const pct=total>0?Math.round(done/total*100):0;
    const st=total===0?'':done===total?'done':done>0?'partial':'';
    badge.className=`t-badge${st?' '+st:''}`;
    badge.innerHTML=`<div class="t-prog"><div class="t-prog-fill" style="width:${pct}%"></div></div>${done}/${total}`;
    zHd.className=`tz-hd${st?' '+st:''}`;
  });
}

function el(tag,cls=''){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }

/* ══════════════════════════════════════════════
   MODAL (desde sidebar)
══════════════════════════════════════════════ */
function _closeSettings() { document.getElementById('settings-dd')?.classList.remove('o'); document.getElementById('settings-btn')?.classList.remove('o'); }
function openModal(archiId) {
  _closeSettings();
  const id=String(archiId), archi=getArchi(id); if(!archi) return;
  S.modalId=id;
  const sp=spawns.filter(s=>s.archi_id==id);
  const zoneList=getZoneList(id);
  const zd=zoneList?.[0]
    ? {zone:norm(zoneName(zoneList[0])),subzone:norm(subzoneName(zoneList[0])||'—')}
    : sp[0] ? getZone(sp[0]) : {zone:t('noZone'),subzone:'—'};
  const zonaStr=zoneList?.length>1 ? zoneList.map(z=>norm(zoneName(z))).join(' · ') : zd.zone;
  const subStr =zoneList?.length>1 ? zoneList.map(z=>norm(subzoneName(z)||'—')).join(' · ') : zd.subzone;
  const level=getArchiLevel(id), stone=getSoulStone(level);
  const coords=sp.map(s=>`(${s.x},${s.y})`).join('  ')||'—';

  const img=document.getElementById('modal-img'), ph=document.getElementById('modal-ph');
  img.style.display='block'; ph.style.display='none';
  img.src=CFG.img(id);
  img.onerror=()=>_imgErr(img);

  document.getElementById('modal-aname').textContent=archiName(archi);
  document.getElementById('modal-mname').textContent=mobName(archi);
  document.getElementById('modal-meta').innerHTML=`
    <span class="lbl">${t('zona')}</span><span class="val">${zonaStr}</span>
    <span class="lbl">${t('subzona')}</span><span class="val">${subStr}</span>
    <span class="lbl">${t('nivel')}</span><span class="val">${level||'?'}</span>
    <span class="lbl">${t('piedra')}</span><span class="val" style="color:${stone?.color||'inherit'}">${stone?stoneHTML(stone):t('unknownStone')}</span>
    <span class="lbl">${t('coords')}</span><span class="val">${coords}</span>
    <span class="lbl">${t('info')}</span><span class="val">Step ${archi.quest_step} · ID ${id}</span>`;
  document.getElementById('modal-langs').innerHTML=LANGS
    .filter(l=>l.code!==S.lang)
    .map(l=>`<span class="lbl">${l.flag}</span><span class="val">${archi.names[l.code]?.archi||'—'}</span>`)
    .join('');
  document.getElementById('modal-link').textContent=t('dofusdbLink');
  document.getElementById('modal-link').href=CFG.dofusdb(id);
  const notesEl=document.getElementById('modal-notes');
  const notesLbl=document.getElementById('modal-notes-lbl');
  if(notesEl){ notesEl.value=S.notes[id]||''; notesEl.placeholder=t('adxNotes')+'…'; }
  if(notesLbl) notesLbl.textContent=t('adxNotes');
  refreshModalBtn(); refreshFavBtns(id);
  document.getElementById('modal-bg').classList.add('o');
}
function refreshModalBtn() {
  const btn=document.getElementById('modal-cap'), cap=isCap(S.modalId);
  btn.textContent=cap?'✓ '+t('capUnmark'):t('capMark');
  btn.className=cap?'done':'todo';
}
function toggleCapFromModal() { if(S.modalId) toggleCapture(S.modalId); }
function closeModal() { document.getElementById('modal-bg').classList.remove('o'); S.modalId=null; _adxRefreshIfOpen(); }
document.getElementById('modal-bg').addEventListener('click',e=>{ if(e.target===document.getElementById('modal-bg')) closeModal(); });

/* ══════════════════════════════════════════════
   STONES SUMMARY
══════════════════════════════════════════════ */
document.getElementById('stones-hd').addEventListener('click',()=>{
  document.getElementById('stones-body').classList.toggle('o');
  document.getElementById('stones-arrow').classList.toggle('o');
});

function updateStones() {
  const body=document.getElementById('stones-body');
  const counts=STONES.map(()=>0); let unknown=0;
  const allIds=new Set();
  spawns.forEach(s=>allIds.add(String(s.archi_id)));
  catalog.forEach(a=>{ if(archiZones[a.id]) allIds.add(String(a.id)); });
  [...allIds].forEach(id=>{
    if(isCap(id)) return;
    const level=getArchiLevel(id);
    if(!level){ unknown++; return; }
    const si=STONES.findIndex(s=>level<=s.max);
    if(si>=0) counts[si]++; else counts[4]++;
  });
  const total=counts.reduce((a,b)=>a+b,0)+unknown;
  document.getElementById('stones-title').textContent=t('stonesTitle');
  if(total===0){ body.innerHTML=`<div class="ss-note">${t('allCap')}</div>`; return; }
  body.innerHTML=STONES.map((s,i)=>counts[i]>0
    ?`<div class="ss-row"><span style="color:${s.color}">${stoneHTML(s)}</span><b>${counts[i]}</b></div>`:''
  ).join('')+(unknown>0?`<div class="ss-note">? ${unknown} ${t('noLevel')}</div>`:'');
}

/* ══════════════════════════════════════════════
   CONTADOR
══════════════════════════════════════════════ */
function updateCounter() {
  const total=CFG.total;
  const done=[...S.captured].length; // fully captured
  const partial=Object.keys(S.counts).filter(id=>isPartial(id)).length;
  let txt=`${done} / ${total}`;
  if(S.maxAccounts>1 && partial>0) txt+=` (+${partial})`;
  document.getElementById('counter').textContent=txt;
  updateProgressBar();
  if(S.showStats&&_statsPanelOpen) updateStatsPanel();
}

/* ══════════════════════════════════════════════
   MODOS
══════════════════════════════════════════════ */
document.querySelectorAll('.mbtn').forEach(btn=>btn.addEventListener('click',()=>{
  const prev=S.mode;
  document.querySelectorAll('.mbtn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on'); S.mode=btn.dataset.mode;
  if(S.mode!==prev && S.mode!=='beta' && S.mode!=='zonas'){
    if(prev==='caza'){ const hp=document.getElementById('hunt-panel'); if(hp){ hp.classList.remove('mode-flash'); hp.classList.add('hp-out'); } }
    _flashMode();
    setTimeout(()=>{ applyMode(); _flashSidebar(); }, 450); // aplica mientras la cortinilla cubre
  } else {
    applyMode();
  }
}));
function _flashMode(){
  const labels={'archi-check':t('modeCheck'),'caza':t('modeHunt')};
  const bg={'archi-check':'rgba(22,55,100,.82)','caza':'rgba(100,22,22,.82)'};
  const wipe=document.getElementById('mode-wipe');
  const lbl=document.getElementById('mode-wipe-lbl');
  if(!wipe||!lbl) return;
  lbl.textContent=labels[S.mode]||S.mode;
  wipe.style.background=bg[S.mode]||'rgba(30,30,40,.85)';
  wipe.classList.remove('go','go-rtl');
  void wipe.offsetWidth;
  wipe.classList.add(S.mode==='caza'?'go-rtl':'go');
}
function _flashSidebar(){
  const sb=document.getElementById('sidebar');
  const hp=document.getElementById('hunt-panel');
  [sb,hp].forEach(el=>{
    if(!el||el.style.display==='none') return;
    el.classList.remove('mode-flash'); void el.offsetWidth;
    el.classList.add('mode-flash');
    setTimeout(()=>el.classList.remove('mode-flash'),550);
  });
}

function applyMode() {
  document.body.className=`mode-${S.mode}${S.underground?' mode-underground':''}${S.showCaptured?' show-captured':''}${S.devMode?' dev-mode':''}`;
  const isB=S.mode==='beta', isC=S.mode==='caza', isZ=S.mode==='zonas';
  document.getElementById('coords').style.display=isB?'block':'none';
  const _hp=document.getElementById('hunt-panel');
  if(_hp){ _hp.classList.remove('hp-out'); _hp.style.display=isC?'block':'none'; }
  // Zonas mode: swap sidebar content
  ['sb-search-wrap','sb-tree','stone-filter','stones-panel','sb-footer'].forEach(id=>{
    const e=document.getElementById(id); if(e) e.style.display=isZ?'none':'';
  });
  document.getElementById('zone-sb').style.display=isZ?'flex':'none';
  if(isZ) buildZoneList();
  if(!isZ&&_cellDraw.active) stopCellDraw();
  if(!isB){ closeBeta(); releaseCtrl(); }
  hideTip(true); refreshMarkers(); if(!isZ) buildTree();
}

/* ══════════════════════════════════════════════
   CTRL+DRAG (beta)
══════════════════════════════════════════════ */
function releaseCtrl() {
  ctrlHeld=false;
  Object.values(markers).forEach(m=>m.dragging.disable());
  document.getElementById('map').classList.remove('ctrl-drag');
  document.body.classList.remove('ctrl-on');
}
document.addEventListener('keydown',e=>{
  if(e.key==='Control'&&S.mode==='beta'&&!ctrlHeld){
    ctrlHeld=true;
    Object.values(markers).forEach(m=>m.dragging.enable());
    document.getElementById('map').classList.add('ctrl-drag');
    document.body.classList.add('ctrl-on');
  }
});
document.addEventListener('keyup',e=>{ if(e.key==='Control') releaseCtrl(); });
window.addEventListener('blur',()=>{ releaseCtrl(); if(lassoActive) endLasso(); map.dragging.enable(); map.getContainer().style.cursor=''; });

/* ══════════════════════════════════════════════
   MAPA EVENTOS
══════════════════════════════════════════════ */
map.on('mousemove',e=>{
  document.getElementById('coords').textContent=`X: ${e.latlng.lng.toFixed(0)} | Y: ${e.latlng.lat.toFixed(0)}`;
  if(lassoActive&&lassoStart&&lassoRect) lassoRect.setBounds([lassoStart,e.latlng]);
  if(_cellDraw.active&&_cellDraw.hoverRect){
    const {cx,cy}=latLngToCell(e.latlng.lat,e.latlng.lng);
    _cellDraw.hoverRect.setBounds(cellToLatLngBounds(cx,cy));
    if(_cellDraw.painting){
      const id=cellId(cx,cy);
      if(!_lastPainted.has(id)){ toggleCell(cx,cy); _lastPainted.add(id); }
    }
  }
});
map.on('click',e=>{
  if(_cellDraw.active) return;
  if(S.mode!=='beta'||ctrlHeld||e.originalEvent?.shiftKey) return;
  S.betaCoords={x:Math.round(e.latlng.lng),y:Math.round(e.latlng.lat)};
  document.getElementById('bp-coords').textContent=`📍 X: ${S.betaCoords.x}  Y: ${S.betaCoords.y}`;
  showBetaPanel();
  refreshBetaList();
});

/* ══════════════════════════════════════════════
   LASSO (Shift+arrastrar en modo Beta)
══════════════════════════════════════════════ */
let lassoActive=false, lassoStart=null, lassoRect=null;

document.addEventListener('keydown',e=>{
  if(e.key==='Shift'&&S.mode==='beta'&&!ctrlHeld){
    map.dragging.disable();
    map.getContainer().style.cursor='crosshair';
  }
});
document.addEventListener('keyup',e=>{
  if(e.key==='Shift'){
    if(S.mode==='beta'&&!ctrlHeld) map.dragging.enable();
    map.getContainer().style.cursor='';
    if(lassoActive){ endLasso(); }
  }
});

map.on('contextmenu',e=>{
  if(_cellDraw.active){
    L.DomEvent.stop(e);
    const {cx,cy}=latLngToCell(e.latlng.lat,e.latlng.lng);
    const id=cellId(cx,cy);
    if(_cellDraw.cells.has(id)){ _cellDraw.cells.delete(id); removeActiveCellRect(cx,cy); updateZdpCount(); }
  }
});
map.on('mousedown',e=>{
  if(_cellDraw.active&&e.originalEvent?.button===0){
    L.DomEvent.stop(e);
    const {cx,cy}=latLngToCell(e.latlng.lat,e.latlng.lng);
    const id=cellId(cx,cy);
    _cellDraw.paintAdding=!_cellDraw.cells.has(id);
    _cellDraw.painting=true; _lastPainted.clear();
    map.dragging.disable();
    toggleCell(cx,cy); _lastPainted.add(id);
    return;
  }
  if(S.mode!=='beta'||!e.originalEvent?.shiftKey||ctrlHeld) return;
  L.DomEvent.stop(e);
  lassoActive=true;
  lassoStart=e.latlng;
  if(lassoRect){ lassoRect.remove(); lassoRect=null; }
  lassoRect=L.rectangle([lassoStart,lassoStart],{
    color:'#ffa94d',weight:1,dashArray:'4',fillOpacity:0.08,interactive:false
  }).addTo(map);
});

map.on('mouseup',e=>{
  if(_cellDraw.painting){
    _cellDraw.painting=false; _lastPainted.clear();
    map.dragging.enable(); return;
  }
  if(!lassoActive) return;
  endLasso();
});

function endLasso(){
  lassoActive=false;
  if(!lassoRect){ lassoStart=null; return; }
  const bounds=lassoRect.getBounds();
  lassoRect.remove(); lassoRect=null;
  // Ignorar rectángulos degenerate (menos de 5 unidades)
  if(Math.abs(bounds.getNorth()-bounds.getSouth())<5&&Math.abs(bounds.getEast()-bounds.getWest())<5){
    lassoStart=null; return;
  }
  let count=0;
  Object.values(markers).forEach(m=>{
    if(bounds.contains(m.getLatLng())){
      const sid=m._spawn.spawn_id;
      if(!S.betaSelected.has(sid)){
        S.betaSelected.add(sid);
        m.getElement()?.querySelector('.ai')?.classList.add('sel');
        count++;
      }
    }
  });
  lassoStart=null;
  if(count>0){
    S.betaSelecting=true;
    document.body.classList.add('beta-selecting');
    showBetaPanel();
    document.getElementById('bp-sel-toggle').textContent='✕ Cancelar selección';
    updateSelCount();
    notify(tf('betaSelectedN',S.betaSelected.size),'orange');
  }
}

/* ══════════════════════════════════════════════
   BETA PANEL
══════════════════════════════════════════════ */
function refreshBetaList(q='') {
  const list=document.getElementById('bp-list');
  list.innerHTML='';
  const _filtered=catalog.filter(a=>!q||archiName(a).toLowerCase().includes(q)||mobName(a).toLowerCase().includes(q));
  _filtered.slice(0,80).forEach(a=>{
    const item=el('div',`bp-item${a.id===S.betaArchiId?' sel':''}`);
    item.dataset.id=a.id;
    item.innerHTML=`
      <img class="bp-thumb" src="${CFG.img(a.id)}" onerror="_imgErr(this)" />
      <div><div class="bp-an">${archiName(a)}</div><div class="bp-mn">${mobName(a)}</div></div>`;
    item.addEventListener('click',()=>{
      S.betaArchiId=a.id;
      list.querySelectorAll('.bp-item').forEach(i=>i.classList.toggle('sel',i.dataset.id===a.id));
      highlightArchi(a.id, true);
      highlightArchiPolys(a.id, true);
    });
    list.appendChild(item);
  });
  if(_filtered.length>80){
    const more=el('div','');
    more.style.cssText='padding:5px 8px;font-size:10px;color:var(--txt3);text-align:center;border-top:1px solid var(--border)';
    more.textContent=tf('searchMoreN',_filtered.length-80);
    list.appendChild(more);
  }
}
document.getElementById('bp-search').addEventListener('input',e=>refreshBetaList(e.target.value));
document.getElementById('bp-ok').addEventListener('click',()=>{
  if(!S.betaArchiId||!S.betaCoords){
    notify(!S.betaArchiId?'Selecciona un archi de la lista':'Haz clic en el mapa primero','orange'); return;
  }
  const _zl=getZoneList(String(S.betaArchiId));
  const _zd=_zl?.[0]||{};
  const spawn={
    spawn_id:crypto.randomUUID(), archi_id:S.betaArchiId,
    zone:zoneName(_zd)||'Sin zona',
    subzone:subzoneName(_zd)||'',
    underground: S.underground||_zd.underground===true,
    cooldown_minutes:parseInt(document.getElementById('bp-cd').value)||CFG.defaultCd,
    x:S.betaCoords.x, y:S.betaCoords.y
  };
  spawns.push(spawn); createMarker(spawn); buildTree(); updateCounter(); updateStones(); closeBeta();
  notify(`✓ ${archiName(getArchi(spawn.archi_id))||spawn.archi_id}`,'blue');
});
function closeBeta() {
  document.getElementById('beta-panel').style.display='none';
  S.betaCoords=null;
  document.getElementById('bp-coords').textContent='Haz clic en el mapa para fijar coordenadas';
  if(S.betaArchiId){ highlightArchi(S.betaArchiId,false); highlightArchiPolys(S.betaArchiId,false); S.betaArchiId=null; }
}

/* ══════════════════════════════════════════════
   SIDEBAR UI
══════════════════════════════════════════════ */
document.getElementById('sb-toggle').addEventListener('click',()=>
  document.getElementById('sidebar').classList.toggle('off')
);
function toggleMobSidebar(){
  const sb=document.getElementById('sidebar');
  const fab=document.getElementById('mob-fab');
  const isOpen=!sb.classList.contains('off');
  if(isOpen){ sb.classList.add('off'); document.body.classList.remove('sb-open'); fab.classList.remove('open'); fab.textContent='☰'; }
  else      { sb.classList.remove('off'); document.body.classList.add('sb-open'); fab.classList.add('open'); fab.textContent='✕'; }
}
function closeMobSidebar(){
  document.getElementById('sidebar').classList.add('off');
  document.getElementById('mob-fab').classList.remove('open');
  document.getElementById('mob-fab').textContent='☰';
  document.body.classList.remove('sb-open');
}

// ── Mejora 5: swipe-down para cerrar sidebar ──────────────────────────────────
(function(){
  const sb=document.getElementById('sidebar');
  let ty0=0, tx0=0, dragging=false;
  sb.addEventListener('touchstart',e=>{
    if(window.innerWidth>768) return;
    const touch=e.touches[0];
    const handleH=40; // zona drag handle (px desde el top del sidebar)
    const sbTop=sb.getBoundingClientRect().top;
    if(touch.clientY-sbTop>handleH) return; // solo si toca el handle
    ty0=touch.clientY; tx0=touch.clientX; dragging=true;
  },{passive:true});
  sb.addEventListener('touchmove',e=>{
    if(!dragging||window.innerWidth>768) return;
    const dy=e.touches[0].clientY-ty0;
    if(dy>0) sb.style.transform=`translateY(${dy}px)`;
  },{passive:true});
  sb.addEventListener('touchend',e=>{
    if(!dragging||window.innerWidth>768) return;
    dragging=false;
    const dy=e.changedTouches[0].clientY-ty0;
    const dx=Math.abs(e.changedTouches[0].clientX-tx0);
    sb.style.transform='';
    if(dy>80&&dx<100) closeMobSidebar();
  },{passive:true});
})();

// ── Mejora 6: helper long-press para markAll ──────────────────────────────────
function _addLongPress(el, onLongPress) {
  let timer=null;
  el.addEventListener('touchstart',e=>{
    if(window.innerWidth>768) return;
    el.classList.add('mob-pressing');
    timer=setTimeout(()=>{
      navigator.vibrate?.(40);
      onLongPress();
    },600);
  },{passive:true});
  const cancel=()=>{ clearTimeout(timer); el.classList.remove('mob-pressing'); };
  el.addEventListener('touchend',cancel,{passive:true});
  el.addEventListener('touchmove',cancel,{passive:true});
}
document.getElementById('sb-search').addEventListener('input',e=>{ S.search=e.target.value; buildTree(); });
document.getElementById('fav-filter').addEventListener('click',()=>{
  S.favFilter=!S.favFilter;
  document.getElementById('fav-filter').classList.toggle('on',S.favFilter);
  buildTree();
});

document.querySelectorAll('.lbtn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.lbtn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  S.lang=btn.dataset.lang;
  saveUIState();
  _zoneMapCache=null; _zoneInfoCache=null;
  const sfl=document.getElementById('stone-filter-lbl');
  if(sfl) sfl.textContent=t('piedra')+':';
  _updateStepFilterLbl(); _buildStepFilter();
  if(document.getElementById('route-overlay')?.classList.contains('open')) _renderRoute();
  const otl=document.getElementById('opt-title-lbl');
  if(otl) otl.textContent=t('optTitle');
  S.open.zones=new Set(); S.open.subs=new Set();
  buildTree();
  _syncSettingsLabels();
  _syncAdxToolbar();
  _renderCaptureLog();
  renderUgNav();
  createUgEntranceMarkers();
  updateStones();
  refreshMarkers();
  // Refrescar paneles abiertos con los nuevos nombres
  if(document.getElementById('beta-panel').style.display!=='none'){
    refreshBetaList(document.getElementById('bp-search').value);
  }
  if(S.mode==='zonas') buildZoneList();
  if(S.tip.id){
    const sp=spawns.find(s=>String(s.archi_id)===String(S.tip.id));
    const ar=getArchi(S.tip.id);
    if(sp&&ar) showTip(sp,ar,markers[S.tip.id]||Object.values(markers).find(m=>String(m._spawn.archi_id)===String(S.tip.id)));
  }
  if(S.modalId) openModal(S.modalId);
}));

/* ══════════════════════════════════════════════
   NOTIFICACIONES
══════════════════════════════════════════════ */
function notify(msg,type='green'){
  const container=document.getElementById('notifs');
  const notifs=container.querySelectorAll('.notif');
  if(notifs.length>=5) notifs[0].remove();
  const n=el('div',`notif ${type}`); n.textContent=msg;
  container.appendChild(n);
  setTimeout(()=>{ n.classList.add('out'); setTimeout(()=>n.remove(),230); },4300);
}

/* ══════════════════════════════════════════════
   EXPORT / IMPORT
══════════════════════════════════════════════ */
function exportSpawns(){
  dl(JSON.stringify(spawns,null,2),'archi_spawns.json','application/json');
  notify('archi_spawns.json guardado','blue');
}
function exportProgress(){
  const lang=S.lang;
  const rows=['Step,Name,ArchName,Count'];
  catalog.forEach(a=>{
    const mobN  =a.names[lang]?.mob  ||a.names.es?.mob  ||'';
    const archiN=a.names[lang]?.archi||a.names.es?.archi||'';
    const count =getCaptureCount(a.id);
    rows.push([a.quest_step, qq(mobN), qq(archiN), count].join(','));
  });
  dl(rows.join('\n'),`archi_progress_${lang}.csv`,'text/csv;charset=utf-8');
  notify(t('notifProgressExported'),'green');
}
function importProgress(){
  const input=document.createElement('input'); input.type='file'; input.accept='.csv';
  input.onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      const lines=ev.target.result.split('\n');
      const header=(lines[0]||'').toLowerCase().replace(/"/g,'').trim();
      let n=0;

      if(header.startsWith('step,name,archname,count')){
        // Formato MyDofus / nuestro formato: buscar ArchName en todos los idiomas
        const nameLookup={};
        catalog.forEach(a=>{
          Object.values(a.names).forEach(lng=>{
            if(lng.archi) nameLookup[lng.archi.toLowerCase().trim()]=String(a.id);
            if(lng.mob)   nameLookup[lng.mob.toLowerCase().trim()]=String(a.id);
          });
        });
        lines.slice(1).forEach(line=>{
          if(!line.trim()) return;
          const c=_parseCSVLine(line);
          const mobN=(c[1]||'').toLowerCase().trim();
          const archName=(c[2]||'').toLowerCase().trim();
          const count=parseInt(c[3]||'0');
          if(count>0){
            const id=nameLookup[archName]||nameLookup[mobN];
            if(id){ S.counts[id]=Math.min(count, S.maxAccounts); n++; }
          }
        });
      } else {
        // Formato antiguo (id,...,captured en columna 9) — compatibilidad hacia atrás
        lines.slice(1).forEach(line=>{
          const c=line.split(',').map(s=>s.replace(/"/g,'').trim());
          if(c[9]==='1'){ S.captured.add(c[0]); n++; }
        });
      }

      _rebuildCaptured();
      saveProgress(); refreshMarkers(); buildTree(); updateCounter(); updateStones();
      notify(tf('notifProgressImported',n),'blue');
    };
    r.readAsText(f,'utf-8');
  };
  input.click();
}
const qq=v=>`"${(v||'').replace(/"/g,'""')}"`;
function dl(content,name,type){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=name; a.click();
}

/* ══════════════════════════════════════════════
   STONE FILTER
══════════════════════════════════════════════ */
document.getElementById('stone-filter').addEventListener('click',e=>{
  const btn=e.target.closest('.sfbtn'); if(!btn) return;
  S.stoneFilter=btn.dataset.stone?parseInt(btn.dataset.stone):null;
  document.querySelectorAll('.sfbtn').forEach(b=>b.classList.toggle('on',b.dataset.stone===(btn.dataset.stone)));
  refreshMarkers(); buildTree();
});

/* ══════════════════════════════════════════════
   GRID & CELL ZONE SYSTEM
══════════════════════════════════════════════ */

// ── Coordinate helpers ────────────────────────────────────────────────────────
function latLngToCell(lat,lng){
  return { cx:Math.floor((lng-GRID.originX)/GRID.cellW), cy:Math.floor((lat-GRID.originY)/GRID.cellH) };
}
function cellToLatLngBounds(cx,cy){
  const x0=GRID.originX+cx*GRID.cellW, y0=GRID.originY+cy*GRID.cellH;
  return [[y0,x0],[y0+GRID.cellH,x0+GRID.cellW]];
}
function cellId(cx,cy){ return `${cx},${cy}`; }
function parseCell(id){ const [a,b]=id.split(','); return {cx:+a,cy:+b}; }

// ── Grid tile layer ───────────────────────────────────────────────────────────
function createGridLayer(){
  const GT=L.GridLayer.extend({
    createTile(coords){
      const canvas=document.createElement('canvas');
      const sz=this.getTileSize();
      canvas.width=sz.x; canvas.height=sz.y;
      const ctx=canvas.getContext('2d');
      ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=0.5;
      const scale=Math.pow(2,coords.z);
      const tileW=sz.x/scale, tileH=sz.y/scale;
      const crsX0=coords.x*tileW, crsY0=-coords.y*tileH;
      const crsX1=crsX0+tileW, crsY1=crsY0-tileH;
      // vertical lines
      for(let i=Math.ceil((crsX0-GRID.originX)/GRID.cellW);i<=Math.floor((crsX1-GRID.originX)/GRID.cellW);i++){
        const px=((GRID.originX+i*GRID.cellW)-crsX0)/tileW*sz.x;
        ctx.beginPath(); ctx.moveTo(px,0); ctx.lineTo(px,sz.y); ctx.stroke();
      }
      // horizontal lines
      for(let i=Math.ceil((crsY1-GRID.originY)/GRID.cellH);i<=Math.floor((crsY0-GRID.originY)/GRID.cellH);i++){
        const py=(crsY0-(GRID.originY+i*GRID.cellH))/tileH*sz.y;
        ctx.beginPath(); ctx.moveTo(0,py); ctx.lineTo(sz.x,py); ctx.stroke();
      }
      return canvas;
    }
  });
  return new GT({tileSize:256,zIndex:500,pane:'overlayPane',updateWhenIdle:false});
}

function setGridVisible(on){
  GRID.visible=on;
  if(on&&!_gridTileLayer){ _gridTileLayer=createGridLayer().addTo(map); }
  else if(!on&&_gridTileLayer){ _gridTileLayer.remove(); _gridTileLayer=null; }
  const btn=document.getElementById('grid-toggle');
  if(btn){ btn.textContent=on?'■ Ocultar cuadrícula':'☐ Cuadrícula'; btn.classList.toggle('on',on); }
}
function toggleGridBtn(){ setGridVisible(!GRID.visible); }

// ── Zone helpers ──────────────────────────────────────────────────────────────
function zoneColor(name){
  const palette=['#4d9cf7','#51cf66','#ffa94d','#ff6b6b','#cc5de8','#f06595','#74c0fc','#38d9a9','#ffd43b','#a9e34b'];
  let h=0; for(let i=0;i<name.length;i++) h=(h*31+name.charCodeAt(i))>>>0;
  return palette[h%palette.length];
}
function getZoneKey(zone,sub){ return `${zone}|||${sub||'—'}`; }

function getUniqueZoneList(){
  const seen=new Set(), result=[];
  catalog.forEach(a=>{
    const list=getZoneList(a.id)||[];
    list.forEach(zd=>{
      const z=norm(zoneName(zd)), sz=norm(subzoneName(zd)||'—');
      // Key always in Spanish so it matches zone_polygons.json regardless of UI language
      const zEs=norm(typeof zd.zone==='object'?(zd.zone.es||z):String(zd.zone||z));
      const szEs=norm(typeof zd.subzone==='object'?(zd.subzone.es||sz):String(zd.subzone||sz));
      const key=getZoneKey(zEs,szEs);
      if(!seen.has(key)){ seen.add(key); result.push({zone:z,subzone:sz,zoneEs:zEs,subzoneEs:szEs,key}); }
    });
  });
  return result.sort((a,b)=>a.zone.localeCompare(b.zone)||a.subzone.localeCompare(b.subzone));
}

// ── Zone hover tooltip (solo en mapa cuando polígonos activos) ────────────────
let _zoneInfoCache = null;
function _buildZoneInfoCache() {
  const cache = {}, seen = {};
  catalog.forEach(a => {
    (getZoneList(a.id)||[]).forEach(zd => {
      const zEs  = norm(typeof zd.zone==='object'    ? (zd.zone.es||'')    : String(zd.zone||''));
      const szEs = norm(typeof zd.subzone==='object'  ? (zd.subzone.es||'') : String(zd.subzone||''));
      const key  = getZoneKey(zEs, szEs);
      if (!seen[key]) { seen[key]=new Set(); cache[key]={ zone:norm(zoneName(zd)), subzone:norm(subzoneName(zd)||'—'), ids:[] }; }
      seen[key].add(String(a.id));
    });
  });
  Object.keys(seen).forEach(k => { cache[k].ids=[...seen[k]]; });
  return cache;
}
function _getZoneInfo(key) {
  if (!_zoneInfoCache) _zoneInfoCache = _buildZoneInfoCache();
  return _zoneInfoCache[key] || null;
}
function showZoneHoverTip(key, cx, cy) {
  if (!S.showZonePolygons) return;
  const info = _getZoneInfo(key);
  const el   = document.getElementById('zone-htip');
  if (!info || !el) return;
  const captured = info.ids.filter(id => getCaptureCount(id) > 0).length;
  const pct = info.ids.length ? Math.round(captured / info.ids.length * 100) : 0;
  el.querySelector('.zh-sub').textContent   = info.subzone;
  el.querySelector('.zh-zone').textContent  = info.zone;
  el.querySelector('.zh-fill').style.width  = pct + '%';
  el.querySelector('.zh-count').textContent = `${captured}/${info.ids.length} archimonstruos`;
  el.classList.add('vis');
  _posZoneTip(cx, cy);
}
function hideZoneHoverTip() {
  document.getElementById('zone-htip')?.classList.remove('vis');
}
function _posZoneTip(cx, cy) {
  const el = document.getElementById('zone-htip');
  if (!el) return;
  const pad=14, w=el.offsetWidth||200, h=el.offsetHeight||80;
  let left=cx+pad, top=cy-h/2;
  if (left+w > window.innerWidth)  left=cx-w-pad;
  if (top < pad)                   top=pad;
  if (top+h > window.innerHeight)  top=window.innerHeight-h-pad;
  el.style.left=left+'px'; el.style.top=top+'px';
}

function flyToZone(key) {
  const layer = zonePolygonLayers[key];
  if (!layer) return;
  map.fitBounds(layer.getBounds(), {padding:[40,40]});
  highlightZonePoly(key, true);
  setTimeout(()=>highlightZonePoly(key, false), 2000);
}

// ── Underground zone keys ──────────────────────────────────────────────────────
function buildUndergroundKeys(){
  const keys=new Set();
  Object.values(archiZones).forEach(az=>{
    (az.zones||[]).forEach(zd=>{
      if(zd.underground!==true) return;
      const zEs=norm(typeof zd.zone==='object'?(zd.zone.es||''):String(zd.zone||''));
      const szEs=norm(typeof zd.subzone==='object'?(zd.subzone.es||''):String(zd.subzone||''));
      keys.add(getZoneKey(zEs,szEs));
    });
  });
  return keys;
}
let _undergroundKeys=null;

// ── Zone rendering ────────────────────────────────────────────────────────────
function renderZoneCells(){
  if(!_undergroundKeys) _undergroundKeys=buildUndergroundKeys();
  Object.values(zonePolygonLayers).forEach(g=>g.remove());
  zonePolygonLayers={};
  Object.entries(zonePolygons).forEach(([key,zp])=>{
    if(!zp.cells?.length) return;
    const isUg=_undergroundKeys.has(key);
    // Visible solo si polygons ON y el modo underground coincide
    const visible=S.showZonePolygons && (isUg===S.underground);
    const c=zp.color||zoneColor(zp.zone||key);
    const grp=L.featureGroup().addTo(map);
    zp.cells.forEach(([cx,cy])=>{
      L.rectangle(cellToLatLngBounds(cx,cy),{
        color:c,fillColor:c,
        fillOpacity:visible?.18:0,
        weight:visible?.5:0,
        opacity:visible?.55:0,
        interactive:visible
      }).on('click',()=>{ if(visible) map.fitBounds(grp.getBounds(),{padding:[30,30]}); }).addTo(grp);
    });
    grp._zoneKey=key;
    grp._visible=visible;
    if(visible){
      grp.on('mouseover', e=>{ highlightZonePoly(key,true); showZoneHoverTip(key, e.originalEvent.clientX, e.originalEvent.clientY); });
      grp.on('mouseout',  ()=>{ highlightZonePoly(key,false); hideZoneHoverTip(); });
      grp.on('mousemove', e=>_posZoneTip(e.originalEvent.clientX, e.originalEvent.clientY));
    }
    // Siempre registrar en zonePolygonLayers para que hasPoly funcione en sidebar
    zonePolygonLayers[key]=grp;
  });
  // Re-apply route highlight if active (renderZoneCells resets all styles)
  if(_routeHighlightKey) {
    _routeHighlightKey=null;
    _updateRoutePolyHighlight();
  }
}

function highlightZonePoly(key,on){
  const grp=zonePolygonLayers[key]; if(!grp) return;
  const wasVisible=grp._visible;
  if(on){
    grp.eachLayer(r=>r.setStyle({fillOpacity:.42,weight:2,opacity:1}));
  } else if(grp._routeHighlighted){
    grp.eachLayer(r=>r.setStyle({fillOpacity:.4,weight:2.5,opacity:1,fillColor:'#00e5ff',color:'#00b4d8'}));
  } else {
    const origColor=zonePolygons[key]?.color||zoneColor(zonePolygons[key]?.zone||key);
    grp.eachLayer(r=>r.setStyle({fillOpacity:wasVisible?.18:0,weight:wasVisible?.5:0,opacity:wasVisible?.55:0,fillColor:origColor,color:origColor}));
  }
  document.querySelectorAll(`[data-zkey="${CSS.escape(key)}"]`).forEach(el=>el.classList.toggle('zone-hover',on));
}

// Resalta/quita todos los polígonos de subzona de un archi (usando nombres ES)
function highlightArchiPolys(archiId, on){
  if(!S.showZoneHighlight) return;
  (getZoneList(String(archiId))||[]).forEach(zd=>{
    const zEs=norm(typeof zd.zone==='object'?(zd.zone.es||''):String(zd.zone||''));
    const szEs=norm(typeof zd.subzone==='object'?(zd.subzone.es||''):String(zd.subzone||''));
    highlightZonePoly(getZoneKey(zEs,szEs||'—'), on);
  });
}

// ── Cell draw session ─────────────────────────────────────────────────────────
function startCellDraw(zone,subzone){
  stopCellDraw();
  _cellDraw.active=true;
  _cellDraw.target={zone,subzone,key:getZoneKey(zone,subzone)};
  _cellDraw.cells=new Set();
  const existing=zonePolygons[_cellDraw.target.key];
  if(existing?.cells) existing.cells.forEach(([cx,cy])=>_cellDraw.cells.add(cellId(cx,cy)));
  _cellDraw.activeGroup=L.featureGroup().addTo(map);
  _cellDraw.cells.forEach(id=>{ const {cx,cy}=parseCell(id); addActiveCellRect(cx,cy); });
  _cellDraw.hoverRect=L.rectangle([[0,0],[GRID.cellH,GRID.cellW]],{
    color:'#ffd43b',fillColor:'#ffd43b',fillOpacity:0.22,weight:1.5,interactive:false,dashArray:'4,2'
  }).addTo(map);
  document.body.classList.add('zone-drawing');
  const p=document.getElementById('zone-draw-panel');
  p.style.display='block'; p.style.animation='none'; void p.offsetWidth;
  p.style.animation='betaIn .2s cubic-bezier(.34,1.56,.64,1)';
  document.getElementById('zdp-zone').textContent=zone;
  document.getElementById('zdp-sub').textContent=subzone;
  updateZdpCount();
  setGridVisible(true);
  if(existing?.cells?.length) map.fitBounds(_cellDraw.activeGroup.getBounds(),{padding:[40,40]});
}

function stopCellDraw(){
  _cellDraw.active=false; _cellDraw.target=null; _cellDraw.cells=new Set();
  _cellDraw.painting=false; _lastPainted.clear();
  if(_cellDraw.hoverRect){ _cellDraw.hoverRect.remove(); _cellDraw.hoverRect=null; }
  if(_cellDraw.activeGroup){ _cellDraw.activeGroup.remove(); _cellDraw.activeGroup=null; }
  document.body.classList.remove('zone-drawing');
  document.getElementById('zone-draw-panel').style.display='none';
  map.dragging.enable();
}

function addActiveCellRect(cx,cy){
  if(!_cellDraw.activeGroup) return;
  const r=L.rectangle(cellToLatLngBounds(cx,cy),{
    color:'#ffd43b',fillColor:'#ffd43b',fillOpacity:0.3,weight:1,interactive:false
  });
  r._cellId=cellId(cx,cy);
  r.addTo(_cellDraw.activeGroup);
}

function removeActiveCellRect(cx,cy){
  if(!_cellDraw.activeGroup) return;
  const id=cellId(cx,cy);
  _cellDraw.activeGroup.eachLayer(r=>{ if(r._cellId===id) _cellDraw.activeGroup.removeLayer(r); });
}

function toggleCell(cx,cy){
  const id=cellId(cx,cy);
  if(_cellDraw.paintAdding){
    if(!_cellDraw.cells.has(id)){ _cellDraw.cells.add(id); addActiveCellRect(cx,cy); }
  } else {
    if(_cellDraw.cells.has(id)){ _cellDraw.cells.delete(id); removeActiveCellRect(cx,cy); }
  }
  updateZdpCount();
}

function updateZdpCount(){
  const n=_cellDraw.cells.size;
  document.getElementById('zdp-count').textContent=`${n} celda${n!==1?'s':''}`;
}

function clearCells(){
  _cellDraw.cells.clear();
  _cellDraw.activeGroup?.clearLayers();
  updateZdpCount();
}

function confirmZoneCells(){
  if(!_cellDraw.target||_cellDraw.cells.size<1){ notify('Selecciona al menos 1 celda','orange'); return; }
  const {zone,subzone,key}=_cellDraw.target;
  const cells=[..._cellDraw.cells].map(parseCell).map(({cx,cy})=>[cx,cy]);
  zonePolygons[key]={zone,subzone,cells,color:zoneColor(zone)};
  stopCellDraw();
  renderZoneCells();
  buildZoneList();
  notify(`✓ ${zone} › ${subzone} (${cells.length} celdas)`,'green');
}

// ── Zone list & navigation ────────────────────────────────────────────────────
function deleteZone(key){
  delete zonePolygons[key];
  zonePolygonLayers[key]?.remove(); delete zonePolygonLayers[key];
  buildZoneList();
}

function advanceToNextZone(){
  const zones=getUniqueZoneList();
  const next=zones.find(z=>!zonePolygons[z.key]);
  if(next) startCellDraw(next.zoneEs,next.subzoneEs);
  else notify('¡Todas las zonas definidas! 🎉','green');
}

function buildZoneList(){
  const list=document.getElementById('zone-list'); if(!list) return;
  const zones=getUniqueZoneList();
  const done=zones.filter(z=>zonePolygons[z.key]).length;
  document.getElementById('zone-progress').textContent=`${done} / ${zones.length} subzonas mapeadas`;
  let html='', lastZone='';
  zones.forEach(({zone,subzone,zoneEs,subzoneEs,key})=>{
    const hasPoly=!!zonePolygons[key], color=zoneColor(zoneEs);
    const cellCount=zonePolygons[key]?.cells?.length||0;
    if(zone!==lastZone){
      if(lastZone) html+='</div>';
      html+=`<div class="zl-zone"><div class="zl-zone-hd" style="border-left:3px solid ${color}">${zone}</div>`;
      lastZone=zone;
    }
    const safeZone=zoneEs.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const safeSub=subzoneEs.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const safeKey=key.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    html+=`<div class="zl-sub${hasPoly?' done':''}" data-zkey="${key}">
      <span class="zl-sub-dot" style="background:${color};opacity:${hasPoly?1:.25}"></span>
      <span class="zl-sub-name">${subzone}</span>
      ${hasPoly?`<span style="font-size:9px;color:var(--txt3);margin-right:2px">${cellCount}c</span>`:''}
      ${hasPoly?`<button class="zl-goto" onclick="event.stopPropagation();flyToZone('${safeKey}')" title="${t('ttlGotoZoneShort')}">↪</button>`:''}
      ${hasPoly?`<button class="zl-del" onclick="event.stopPropagation();deleteZone('${safeKey}')">✕</button>`:''}
      <button class="zl-edit" onclick="event.stopPropagation();startCellDraw('${safeZone}','${safeSub}')">${hasPoly?'✏':'＋'}</button>
    </div>`;
  });
  if(lastZone) html+='</div>';
  list.innerHTML=html;
  list.querySelectorAll('.zl-sub[data-zkey]').forEach(item=>{
    item.addEventListener('mouseenter', ()=>highlightZonePoly(item.dataset.zkey,true));
    item.addEventListener('mouseleave', ()=>highlightZonePoly(item.dataset.zkey,false));
    item.addEventListener('click',()=>{
      const k=item.dataset.zkey;
      if(zonePolygonLayers[k]){
        map.fitBounds(zonePolygonLayers[k].getBounds(),{padding:[30,30]});
        highlightZonePoly(k,true); setTimeout(()=>highlightZonePoly(k,false),2000);
      }
    });
  });
}

// ── Persistence ───────────────────────────────────────────────────────────────
function exportZonePolygons(){
  dl(JSON.stringify({grid:{cellW:GRID.cellW,cellH:GRID.cellH,originX:GRID.originX,originY:GRID.originY},zones:zonePolygons},null,2),'zone_polygons.json','application/json');
  notify('zone_polygons.json guardado','blue');
}

async function loadZonePolygons(){
  try {
    const raw=await fetch(`./data/zone_polygons.json?t=${Date.now()}`).then(r=>r.json());
    if(raw.zones){
      if(raw.grid){ GRID.cellW=raw.grid.cellW||9; GRID.cellH=raw.grid.cellH||9; GRID.originX=raw.grid.originX||0; GRID.originY=raw.grid.originY||0; }
      zonePolygons=raw.zones;
    } else { zonePolygons=raw; }
    renderZoneCells();
  } catch(_){ zonePolygons={}; }
}

// ── Grid calibration slider ───────────────────────────────────────────────────
function _applyGridChange(){
  if(_gridTileLayer){ _gridTileLayer.remove(); _gridTileLayer=null; }
  if(GRID.visible) setGridVisible(true);
  if(_cellDraw.activeGroup){ _cellDraw.activeGroup.clearLayers(); _cellDraw.cells.forEach(id=>{ const {cx,cy}=parseCell(id); addActiveCellRect(cx,cy); }); }
  if(_cellDraw.hoverRect) _cellDraw.hoverRect.setBounds([[0,0],[GRID.cellH,GRID.cellW]]);
  const ox=document.getElementById('grid-ox-num'), oy=document.getElementById('grid-oy-num');
  if(ox) ox.value=+GRID.originX.toFixed(2);
  if(oy) oy.value=+GRID.originY.toFixed(2);
}
function shiftGrid(dx, dy){
  GRID.originX=+((GRID.originX+dx).toFixed(2));
  GRID.originY=+((GRID.originY+dy).toFixed(2));
  _applyGridChange();
}
document.addEventListener('DOMContentLoaded',()=>{
  const slW=document.getElementById('grid-cell-w'), numW=document.getElementById('grid-cw-num');
  const slH=document.getElementById('grid-cell-h'), numH=document.getElementById('grid-ch-num');
  function setW(v){ v=Math.max(1,Math.min(100,parseFloat(v)||9)); GRID.cellW=v; if(slW) slW.value=Math.min(v,30); if(numW) numW.value=v; _applyGridChange(); }
  function setH(v){ v=Math.max(1,Math.min(100,parseFloat(v)||7.8)); GRID.cellH=v; if(slH) slH.value=Math.min(v,30); if(numH) numH.value=v; _applyGridChange(); }
  if(slW) slW.addEventListener('input',function(){ setW(this.value); });
  if(numW) numW.addEventListener('change',function(){ setW(this.value); });
  if(slH) slH.addEventListener('input',function(){ setH(this.value); });
  if(numH) numH.addEventListener('change',function(){ setH(this.value); });
  const numOX=document.getElementById('grid-ox-num'), numOY=document.getElementById('grid-oy-num');
  if(numOX) numOX.addEventListener('change',function(){ GRID.originX=parseFloat(this.value)||0; _applyGridChange(); });
  if(numOY) numOY.addEventListener('change',function(){ GRID.originY=parseFloat(this.value)||0; _applyGridChange(); });
});

/* ══════════════════════════════════════════════
   SETTINGS DROPDOWN
══════════════════════════════════════════════ */
function toggleSettings() {
  const dd=document.getElementById('settings-dd');
  const btn=document.getElementById('settings-btn');
  const open=dd.classList.toggle('o');
  btn.classList.toggle('o', open);
  if(open){ _syncSettingsToggles(); _syncSettingsLabels(); }
}
function _syncSettingsLabels() {
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const v=t(el.dataset.i18n); if(!v) return;
    if(el.tagName==='INPUT') el.placeholder=v;
    else el.textContent=v;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    const v=t(el.dataset.i18nTitle); if(v) el.title=v;
  });
  const zfBarAll=document.querySelector('#zone-filter-bar button'); if(zfBarAll&&!zfBarAll.dataset.i18n) zfBarAll.textContent=t('zfViewAll');
  const dl=document.getElementById('lbl-daymode');
  if(dl) dl.textContent=S.dayMode?t('sdDayOff'):t('sdDayOn');
  const cdt=document.getElementById('cd-panel-title'); if(cdt) cdt.textContent=t('cdTitle');
  const scb=document.getElementById('show-cap-btn');
  if(scb){ scb.textContent=S.showCaptured?t('showCapOn'):t('showCapOff'); scb.title=t('showCapTitle'); }
  const ff=document.getElementById('fav-filter'); if(ff) ff.title=t('favTitle');
  const zfb=document.getElementById('zf-btn'); if(zfb) zfb.title=t('zfTitle');
  const ugb=document.getElementById('ug-btn'); if(ugb) ugb.title=t('ugBtnTitle')||'Modo subterráneo';
  const helpMap={'h-polygons':'hPolygons','h-highlight':'hHighlight','h-goto':'hGoto','h-autofly':'hAutofly','h-tiplock':'hTiplock','h-spotlight':'hSpotlight','h-markers':'hMarkers','h-clonedots':'hCloneDots','h-stone':'hStone','h-fav':'hFav','h-cazanotif':'hCazanotif','h-ugEntrances':'hUgEntrances','h-multi':'hMulti','h-daymode':'hDaymode','h-progbar':'hProgbar','h-stats':'hStats','h-caplog':'hCaplog','h-routeadd':'hRouteBtn','h-compact':'hCompact'};
  Object.entries(helpMap).forEach(([id,key])=>{ const el=document.getElementById(id); if(el){ const v=t(key); if(v) el.textContent=v; } });
}
function _syncSettingsToggles() {
  const idMap={showZonePolygons:'tog-polygons',showZoneHighlight:'tog-hl',showZoneGoto:'tog-goto',autoFlyArchi:'tog-autofly',showStoneFilter:'tog-stone',showFavBtn:'tog-fav',showMarkers:'tog-markers',cloneDots:'tog-clonedots',showSpotlight:'tog-spotlight',tipLockOnClick:'tog-tiplock',cazaNotif:'tog-cazanotif',showUgEntrances:'tog-ugEntrances',multicuenta:'tog-multi',dayMode:'tog-day',showProgressBar:'tog-progbar',keyShortcuts:'tog-keys',showStats:'tog-stats',showCaptureLog:'tog-caplog',showRouteAddBtn:'tog-routeadd',compactMode:'tog-compact'};
  Object.entries(idMap).forEach(([key,id])=>document.getElementById(id)?.classList.toggle('on',S[key]));
  document.getElementById('multi-count-row')?.classList.toggle('o',S.multicuenta);
  const av=document.getElementById('accounts-val'); if(av) av.textContent=S.maxAccounts;
  // Label dinámico modo día/noche
  const dl=document.getElementById('lbl-daymode');
  if(dl) dl.textContent=S.dayMode?t('sdDayOff'):t('sdDayOn');
}
function toggleSetting(key) {
  S[key]=!S[key];
  if(key==='multicuenta'){
    if(S.multicuenta){ if(S.maxAccounts<2) S.maxAccounts=2; }
    else { S.maxAccounts=1; }
    _syncInvCaptures();
    _rebuildCaptured(); saveProgress();
    refreshMarkers(); buildTree(); updateCounter(); updateStones();
    _adxRefreshIfOpen();
  }
  saveUIState();
  _syncSettingsToggles();
  if(key==='showZonePolygons') renderZoneCells();
  if(key==='showZoneGoto'||key==='showFavBtn'||key==='showRouteAddBtn') buildTree();
  if(key==='compactMode'){ document.body.classList.toggle('compact-mode',S.compactMode); document.getElementById('compact-btn')?.classList.toggle('on',S.compactMode); }
  if(key==='showStoneFilter'){
    const sf=document.getElementById('stone-filter');
    if(sf) sf.style.display=S.showStoneFilter?'':'none';
  }
  if(key==='showMarkers') document.body.classList.toggle('hide-markers',!S.showMarkers);
  if(key==='cloneDots') refreshMarkers();
  if(key==='showSpotlight'&&!S.showSpotlight){
    Object.values(markers).forEach(m=>{ const el=m.getElement()?.querySelector('.ai'); if(el){ el.classList.remove('dimmed','hov'); } m.setZIndexOffset(0); });
  }
  if(key==='tipLockOnClick'&&!S.tipLockOnClick) S.tip.locked=false;
  if(key==='dayMode') document.body.classList.toggle('day-mode',S.dayMode);
  if(key==='showProgressBar') document.body.classList.toggle('hide-progbar',!S.showProgressBar);
  if(key==='showStats'){ document.body.classList.toggle('hide-stats',!S.showStats); if(S.showStats) updateStatsPanel(); }
  if(key==='showCaptureLog'){ document.body.classList.toggle('hide-capture-log',!S.showCaptureLog); if(S.showCaptureLog) _renderCaptureLog(); }
  if(key==='showUgEntrances') createUgEntranceMarkers();
}
// Cerrar dropdown al clic fuera
document.addEventListener('click', e=>{
  if(!e.target.closest('#settings-zone') && !e.target.closest('#settings-dd')) {
    document.getElementById('settings-dd')?.classList.remove('o');
    document.getElementById('settings-btn')?.classList.remove('o');
  }
  if(!e.target.closest('#zf-btn') && !e.target.closest('#zf-dd')) {
    document.getElementById('zf-dd')?.classList.remove('o');
  }
});
function changeAccounts(delta) {
  const n=Math.max(2,Math.min(20, S.maxAccounts+delta));
  if(n===S.maxAccounts) return;
  S.maxAccounts=n;
  document.getElementById('accounts-val').textContent=n;
  _syncInvCaptures();
  _rebuildCaptured();
  saveUIState(); saveProgress();
  refreshMarkers(); buildTree(); updateCounter(); updateStones();
  _adxRefreshIfOpen();
}

/* ══════════════════════════════════════════════
   RESET
══════════════════════════════════════════════ */
// ── Filtro de zonas (Excel-style) ────────────────────────────
function toggleZoneFilterDd() {
  const dd=document.getElementById('zf-dd'); if(!dd) return;
  if(dd.classList.contains('o')){ dd.classList.remove('o'); return; }
  const zones=Object.keys(buildZoneMap()).sort((a,b)=>a.localeCompare(b));
  dd.innerHTML=
    `<div class="zf-hd"><span>${t('zfTitle')}</span>`+
    `<button onclick="setAllZoneFilters(true)">${t('zfAll')}</button>`+
    `<button onclick="setAllZoneFilters(false)">${t('zfNone')}</button></div>`+
    zones.map(z=>{
      const checked=S.zoneFilters===null||S.zoneFilters.has(z);
      return `<label class="zf-item"><input type="checkbox" value="${z.replace(/"/g,'&quot;')}" ${checked?'checked':''} onchange="onZoneFilterChange(this.value,this.checked)"><span>${z}</span></label>`;
    }).join('');
  dd.classList.add('o');
}
function onZoneFilterChange(zName, checked) {
  if(checked){
    if(S.zoneFilters===null) return;
    S.zoneFilters.add(zName);
    const allZones=Object.keys(buildZoneMap());
    if(allZones.every(z=>S.zoneFilters.has(z))) S.zoneFilters=null;
  } else {
    if(S.zoneFilters===null){
      S.zoneFilters=new Set(Object.keys(buildZoneMap()).filter(z=>z!==zName));
    } else {
      S.zoneFilters.delete(zName);
    }
  }
  _updateZoneFilterBar();
  refreshMarkers(); buildTree();
}
function setAllZoneFilters(all) {
  S.zoneFilters=all?null:new Set();
  _updateZoneFilterBar();
  document.querySelectorAll('#zf-dd .zf-item input').forEach(cb=>{ cb.checked=all; });
  refreshMarkers(); buildTree();
}
function _updateZoneFilterBar() {
  const bar=document.getElementById('zone-filter-bar');
  const lbl=document.getElementById('zone-filter-lbl');
  const btn=document.getElementById('zf-btn');
  if(S.zoneFilters===null){
    bar?.classList.remove('vis'); btn?.classList.remove('on');
  } else {
    bar?.classList.add('vis'); btn?.classList.add('on');
    if(lbl){ const n=S.zoneFilters.size; lbl.textContent=n===0?t('zfNoneSelected'):tf('zfFilteredN',n); }
  }
}

function resetProgress() {
  document.getElementById('reset-overlay').classList.add('open');
}
function closeResetModal() {
  document.getElementById('reset-overlay').classList.remove('open');
}
function confirmReset() {
  const resetCap=document.getElementById('reset-chk-cap').checked;
  const resetLog=document.getElementById('reset-chk-log').checked;
  if(!resetCap && !resetLog){ closeResetModal(); return; }
  if(resetCap){
    S.counts={}; S.captured.clear(); S.inventory={};
    localStorage.removeItem('archi-counts'); localStorage.removeItem('archi-cap');
    localStorage.removeItem('archi-inventory');
    _bcBroadcast('archi-counts'); _bcBroadcast('archi-inventory');
  }
  if(resetLog){
    _captureLog=[];
    _saveCaptureLog();
    _renderCaptureLog();
  }
  closeResetModal();
  if(resetCap){ refreshMarkers(); buildTree(); updateCounter(); updateStones(); updateProgressBar(); _adxRefreshIfOpen(); }
  const parts=[];
  if(resetCap) parts.push(t('resetPartCap'));
  if(resetLog) parts.push(t('resetPartLog'));
  notify(`${t('resetDone')}: ${parts.join(' '+t('resetAnd')+' ')}`,'orange');
}

/* ══════════════════════════════════════════════
   DEV MODE
══════════════════════════════════════════════ */
function setDevMode(on) {
  S.devMode=on;
  document.body.classList.toggle('dev-mode',on);
  saveUIState();
  // Si se desactiva DEV y estamos en modo beta/zonas, volver a archi-check
  if(!on && (S.mode==='beta'||S.mode==='zonas')) {
    document.querySelectorAll('.mbtn').forEach(b=>b.classList.remove('on'));
    document.querySelector('.mbtn[data-mode="archi-check"]').classList.add('on');
    S.mode='archi-check'; applyMode();
  }
  notify(on?t('notifDevOn'):t('notifDevOff'), on?'orange':'blue');
}
document.addEventListener('keydown', e=>{
  if(e.ctrlKey&&e.shiftKey&&e.key==='D'){ e.preventDefault(); setDevMode(!S.devMode); }
});

/* ══════════════════════════════════════════════
   FEATURES DE INTERFAZ
══════════════════════════════════════════════ */

// ── Barra de progreso ─────────────────────────────────────────────────────────
function updateProgressBar() {
  const fill=document.getElementById('prog-bar-fill'); if(!fill) return;
  const total=CFG.total, done=S.captured.size;
  fill.style.width=`${total>0?(done/total*100).toFixed(2):0}%`;
}


// ── Panel de estadísticas ─────────────────────────────────────────────────────
let _statsPanelOpen=false;
function toggleStatsPanel() {
  _statsPanelOpen=!_statsPanelOpen;
  document.getElementById('stats-panel')?.classList.toggle('o',_statsPanelOpen);
  if(_statsPanelOpen) updateStatsPanel();
}
function updateStatsPanel() {
  const valEl=document.getElementById('stats-hd-val');
  const zonesEl=document.getElementById('sp-zones');
  if(!valEl||!zonesEl) return;
  const total=CFG.total, done=S.captured.size;
  const pct=total>0?Math.round(done/total*100):0;
  valEl.textContent=`${done}/${total} (${pct}%)`;
  valEl.style.color=done===total?'var(--green)':'var(--blue)';
  // Conteo por zona usando buildZoneMap (ya cacheado)
  const zm=buildZoneMap();
  const rows=Object.entries(zm).sort(([a],[b])=>a.localeCompare(b)).map(([zName,subs])=>{
    let zt=0,zd=0;
    Object.entries(subs).forEach(([,ids])=>{ ids.forEach(id=>{ zt++; if(isCap(id))zd++; }); });
    const p=zt>0?Math.round(zd/zt*100):0;
    return `<div class="sp-zone"><span class="sp-zone-name" title="${zName}">${zName}</span>`+
           `<div class="sp-zone-bar"><div class="sp-zone-fill" style="width:${p}%;${zd===zt?'background:var(--green)':''}"></div></div>`+
           `<span class="sp-zone-val">${zd}/${zt}</span></div>`;
  });
  zonesEl.innerHTML=rows.join('');
}

// ── Historial de capturas ─────────────────────────────────────────────────────
let _captureLog=[];
function _saveCaptureLog() { try{ localStorage.setItem('archi-caplog',JSON.stringify(_captureLog)); }catch(_){} }
function loadCaptureLog()  { try{ const r=localStorage.getItem('archi-caplog'); if(r) _captureLog=JSON.parse(r); }catch(_){} }
function addCaptureLog(archiId, action) {
  const a=getArchi(archiId); if(!a) return;
  const d=new Date(); const ts=`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  _captureLog.unshift({id:String(archiId),name:archiName(a),action,ts});
  if(_captureLog.length>20) _captureLog.pop();
  _saveCaptureLog();
  _renderCaptureLog();
}
function _renderCaptureLog() {
  const el=document.getElementById('cl-body'); if(!el) return;
  const colors={cap:'var(--green)',partial:'var(--orange)',uncap:'var(--txt3)'};
  const labels={cap:'✓',partial:'±',uncap:'✕'};
  el.innerHTML=_captureLog.length
    ? _captureLog.map(e=>{ const a=e.id?getArchi(e.id):null; const nm=a?archiName(a):e.name;
        const imgSrc=e.id?CFG.img(e.id):'./icons/archi.png';
        return `<div class="cl-item">`+
        `<img class="cl-thumb" src="${imgSrc}" onerror="_imgErr(this)" />`+
        `<span class="cl-name" title="${nm}">${nm}</span>`+
        `<span style="color:var(--txt3);font-size:10px;margin-right:4px">${e.ts||''}</span>`+
        `<span class="cl-act" style="color:${colors[e.action]||colors.cap}">${labels[e.action]||'✓'}</span></div>`; }
      ).join('')
    : `<div style="padding:8px 10px;color:var(--txt3);font-size:11px">${t('caplogEmpty')}</div>`;
}
function toggleCaptureLog() {
  document.getElementById('capture-log')?.classList.toggle('cl-open');
  setTimeout(_positionRoutePanel, 220);
}

function collapseAllZones() { S.open.zones=new Set(); S.open.subs=new Set(); buildTree(); }
function expandAllZones() {
  const zones=new Set(), subs=new Set();
  Object.entries(buildTree._zones||{}).forEach(([z,s])=>{ zones.add(z); Object.keys(s).forEach(sz=>subs.add(sz==='—'?z:sz)); });
  // Simpler: expand all by opening zones from catalog
  catalog.forEach(a=>{ const list=getZoneList(a.id)||[]; list.forEach(zd=>{ zones.add(norm(zoneName(zd))); subs.add(norm(subzoneName(zd)||'—')); }); });
  S.open.zones=zones; S.open.subs=subs; buildTree();
}

function toggleCompact() {
  S.compactMode=!S.compactMode;
  document.body.classList.toggle('compact-mode',S.compactMode);
  document.getElementById('compact-btn')?.classList.toggle('on',S.compactMode);
  saveUIState();
}

// Auto-reposition route panel whenever capture-log resizes
(function(){ const cl=document.getElementById('capture-log'); if(cl) new ResizeObserver(_positionRoutePanel).observe(cl); })();

// ── Ayuda atajos de teclado ───────────────────────────────────────────────────
function toggleHelp(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const isOpen = panel.classList.contains('vis');
  // Cierra cualquier otro panel de ayuda abierto
  document.querySelectorAll('.sd-help-txt.vis').forEach(p => {
    p.classList.remove('vis');
    const btn = p.previousElementSibling?.querySelector('.sd-help-btn');
    if (btn) btn.classList.remove('on');
  });
  if (!isOpen) {
    panel.classList.add('vis');
    const btn = panel.previousElementSibling?.querySelector('.sd-help-btn');
    if (btn) btn.classList.add('on');
  }
}

function toggleKbHelp() {
  const p=document.getElementById('kb-help-panel'); if(!p) return;
  const btn=document.getElementById('kb-help-btn');
  const open=p.style.display==='none'||p.style.display==='';
  if(open) {
    const k=s=>`<span style="color:var(--txt2);font-weight:700">${s}</span>`;
    p.innerHTML=
      `${k('/')} o ${k('Ctrl+F')} — ${t('kbSearch')}<br>`+
      `${k('1')} ${t('kbCheck')} &nbsp; ${k('2')} ${t('kbHunt')}<br>`+
      `${k('Clic ⊟')} ${t('kbCapture')} &nbsp; ${k('D')} ${t('kbDiscard')}<br>`+
      `${k('U')} ${t('kbUnderground')} &nbsp; ${k('H')} ${t('kbHome')}<br>`+
      `${k('P')} ${t('kbPresentation')} &nbsp; ${k('Esc')} ${t('kbClose')}`;
  }
  p.style.display=open?'block':'none';
  if(btn) btn.style.borderColor=open?'var(--blue)':'', btn.style.color=open?'var(--blue)':'';
}

// ── Atajos de teclado ─────────────────────────────────────────────────────────
function _showKbHint(msg) {
  const el=document.getElementById('kb-hint'); if(!el) return;
  el.textContent=msg; el.style.display='block';
  clearTimeout(el._t); el._t=setTimeout(()=>el.style.display='none',1400);
}
document.addEventListener('keydown',e=>{
  if(!S.keyShortcuts) return;
  if(e.target.matches('input,textarea,select')) return;
  if(e.ctrlKey&&e.key==='f'){ e.preventDefault(); document.getElementById('sb-search')?.focus(); _showKbHint('🔍 '+t('kbSearch')); return; }
  if(e.key==='/'){ e.preventDefault(); document.getElementById('sb-search')?.focus(); _showKbHint('🔍 '+t('kbSearch')); return; }
  if(e.key==='1'&&!e.ctrlKey&&!e.altKey){ document.querySelector('.mbtn[data-mode="archi-check"]')?.click(); _showKbHint(t('modeCheck')); return; }
  if(e.key==='2'&&!e.ctrlKey&&!e.altKey){ document.querySelector('.mbtn[data-mode="caza"]')?.click(); _showKbHint(t('modeHunt')); return; }
  if(e.key==='d'||e.key==='D'){ toggleShowCaptured(); _showKbHint('👁 '+t('kbDiscard')); return; }
  if(e.key==='u'||e.key==='U'){ document.getElementById('ug-btn')?.click(); _showKbHint('⛏ '+t('kbUnderground')); return; }
  if(e.key==='h'||e.key==='H'){ map.flyTo([-500,500],1,{duration:0.7}); _showKbHint('🏠 '+t('kbHome')); return; }
  if(e.key==='p'||e.key==='P'){ togglePresentation(); _showKbHint('▶ '+t('kbPresentation')); return; }
  if(e.key==='Escape'){ hideTip(true); return; }
});

// ── Animación zona completa ───────────────────────────────────────────────────
function _checkSubzoneComplete(archiId) {
  if(!S.zoneCompleteAnim) return;
  const list=getZoneList(archiId)||[];
  const zm=buildZoneMap();
  list.forEach(zd=>{
    const z=norm(zoneName(zd)), sz=norm(subzoneName(zd)||'—');
    const ids=zm[z]?.[sz]; if(!ids||ids.size===0) return;
    if([...ids].every(id=>isCap(String(id)))) notify(tf('notifZoneDone',sz==='—'?z:sz),'green');
  });
}


// ── Changelog ─────────────────────────────────────────────────────────────────
function toggleChangelog() {
  const el=document.getElementById('changelog-overlay'); if(!el) return;
  el.classList.toggle('open');
  if(el.classList.contains('open')) document.getElementById('settings-dd')?.classList.remove('o');
}

// ── Modo presentación ─────────────────────────────────────────────────────────
function togglePresentation() {
  document.body.classList.toggle('presentation');
  // Cerrar settings dropdown si está abierto
  document.getElementById('settings-dd')?.classList.remove('o');
  document.getElementById('settings-btn')?.classList.remove('o');
}

/* ══════════════════════════════════════════════
   INICIO
══════════════════════════════════════════════ */
async function init() {
  loadProgress(); loadCaza(); loadFav(); loadInventory(); loadNotes(); loadUIState(); loadCaptureLog(); _renderCaptureLog();
  document.body.className=`mode-${S.mode}${S.underground?' mode-underground':''}${S.showCaptured?' show-captured':''}${S.devMode?' dev-mode':''}${S.dayMode?' day-mode':''}${S.showMarkers?'':' hide-markers'}${S.showProgressBar?'':' hide-progbar'}${S.showStats?'':' hide-stats'}${S.showCaptureLog?'':' hide-capture-log'}`;
  // En móvil, sidebar empieza cerrado
  if(window.innerWidth<=768) document.getElementById('sidebar').classList.add('off');
  // Sincronizar botones de estado
  const scBtn=document.getElementById('show-cap-btn');
  if(scBtn){ scBtn.classList.toggle('on',S.showCaptured); scBtn.textContent=S.showCaptured?t('showCapOn'):t('showCapOff'); }
  document.getElementById('ug-btn')?.classList.toggle('on',S.underground);
  document.querySelectorAll('.lbtn').forEach(b=>b.classList.toggle('on',b.dataset.lang===S.lang));
  const avEl=document.getElementById('accounts-val'); if(avEl) avEl.textContent=S.maxAccounts;
  // Aplicar settings de visibilidad
  if(!S.showStoneFilter){ const sf=document.getElementById('stone-filter'); if(sf) sf.style.display='none'; }
  if(S.compactMode){ document.body.classList.add('compact-mode'); document.getElementById('compact-btn')?.classList.add('on'); }
  // Prevenir que <label class="sd-row"> reenvíe clicks al botón de ayuda
  document.querySelectorAll('label.sd-row').forEach(lbl => lbl.addEventListener('click', e => e.preventDefault()));
  // Actualizar etiquetas con idioma
  _syncSettingsLabels();
  const sfl=document.getElementById('stone-filter-lbl');
  if(sfl) sfl.textContent=t('piedra')+':';
  _updateStepFilterLbl();
  const ts=Date.now();
  const [cat,sp,zones]=await Promise.all([
    fetch(`./data/archi_catalog.json?t=${ts}`).then(r=>r.json()).catch(()=>[]),
    fetch(`./data/archi_spawns.json?t=${ts}`).then(r=>r.json()).catch(()=>[]),
    fetch(`./data/archi_zones.json?t=${ts}`).then(r=>r.json()).catch(()=>({}))
  ]);
  catalog=cat; spawns=sp; archiZones=zones;
  _zoneMapCache=null;
  _renderCaptureLog();
  buildUgNav();
  await _createMarkersInBatches(spawns);
  updateCounter(); updateStones();
  await loadZonePolygons();
  buildUgNav(); // recalcula centros desde polígonos actualizados
  buildTree(); // rebuild after polygons loaded so hover handlers can attach
  _buildStepFilter();
  updateProgressBar();
  const zCount=Object.keys(zones).length;
  if(zCount>0) notify(tf('notifZonesLoaded',zCount),'green');
  // Si se abrió con ?archidex=1 → modo página completa dedicada al Archidex
  if(new URLSearchParams(location.search).get('archidex')==='1') {
    document.body.classList.add('archidex-mode');
    openArchidex();
  }
  // Tutorial: mostrar la primera vez
  if(!localStorage.getItem('archi-tutorial-done')) {
    setTimeout(startTutorial, 800);
  }
}
init();

/* ══════════════════════════════════════════════
   SUPABASE — AUTH & CLOUD SYNC
══════════════════════════════════════════════ */
const _SB_URL  = 'https://cuoqlwnczlugfrmxjjqy.supabase.co';
const _SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1b3Fsd25jemx1Z2ZybXhqanF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTM4MzYsImV4cCI6MjA5MTA2OTgzNn0.KualmbszZVh4BDjPrMqebiWzT-bbOBigesoo-1s69xE';
const _sb      = supabase.createClient(_SB_URL, _SB_KEY);
let   _sbUser  = null;
let   _syncTimer = null;
let   _syncNotified = false;

// ── UI helpers ────────────────────────────────────────────────────────────────
function _setSyncDot(state) {
  const dot = document.getElementById('sync-dot');
  if (!dot) return;
  dot.style.display = _sbUser ? 'block' : 'none';
  dot.className = `sync-dot ${state}`;
  dot.title = state === 'syncing' ? 'Sincronizando…' : state === 'error' ? 'Error al sincronizar' : 'Sincronizado ✓';
}

function _updateAuthUI() {
  const btn    = document.getElementById('auth-btn');
  const avatar = document.getElementById('auth-avatar');
  const dot    = document.getElementById('sync-dot');
  if (_sbUser) {
    const meta = _sbUser.user_metadata || {};
    btn.style.display = 'none';
    avatar.src = meta.avatar_url || '';
    avatar.style.display = 'block';
    avatar.title = `${meta.user_name || meta.name || 'Usuario'} — clic para cerrar sesión`;
    dot.style.display = 'block';
  } else {
    btn.style.display = 'flex';
    avatar.style.display = 'none';
    dot.style.display = 'none';
  }
}

// ── Auth actions ──────────────────────────────────────────────────────────────
async function authAction() {
  if (_sbUser) {
    clearTimeout(_syncTimer);
    _sbUser = null;
    _syncNotified = false;
    // Limpiar dot inmediatamente
    const dot = document.getElementById('sync-dot');
    if (dot) { dot.style.display = 'none'; dot.className = 'sync-dot ok'; }
    _updateAuthUI();
    notify(t('notifLogout'), 'blue');
    // Borrar sesión de localStorage (por si signOut falla)
    _loggingOut = true;
    Object.keys(localStorage).filter(k => k.startsWith('sb-')).forEach(k => localStorage.removeItem(k));
    try { await _sb.auth.signOut(); } catch(e) { console.warn('signOut:', e); }
    _loggingOut = false;
  } else {
    await _sb.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.hostname === 'localhost'
        ? 'https://archi-map-beta.vercel.app/'
        : window.location.origin + window.location.pathname }
    });
  }
}

// ── Sync to cloud (debounced) ─────────────────────────────────────────────────
function scheduleSync() {
  if (!_sbUser) return;
  _setSyncDot('syncing');
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(_doSync, 2500);
}

async function _doSync() {
  if (!_sbUser || !_sbToken) { _setSyncDot('ok'); return; }
  try {
    const hdrs = {
      'apikey':        _SB_KEY,
      'Authorization': 'Bearer ' + _sbToken,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal'
    };
    const payload = JSON.stringify({
      user_id:    _sbUser.id,
      counts:     S.counts,
      favorites:  [...S.favorites],
      caza:       S.hunt ? S.hunt.dead : {},
      ui:         { underground:S.underground, showCaptured:S.showCaptured, lang:S.lang, maxAccounts:S.maxAccounts, devMode:S.devMode },
      updated_at: new Date().toISOString()
    });
    // Intentar PATCH (actualizar fila existente)
    let res = await fetch(`${_SB_URL}/rest/v1/progress?user_id=eq.${_sbUser.id}`, {
      method: 'PATCH', headers: hdrs, body: payload
    });
    // Si no existe la fila, hacer INSERT
    if (res.status === 404 || res.status === 406) {
      res = await fetch(`${_SB_URL}/rest/v1/progress`, {
        method: 'POST', headers: hdrs, body: payload
      });
    }
    if (!res.ok) {
      const msg = await res.text();
      _setSyncDot('error');
      console.error('Sync error:', msg);
      notify('Error sync: ' + res.status, 'red');
    } else {
      _setSyncDot('ok');
      if (!_syncNotified) { _syncNotified = true; notify(t('notifSyncActive'), 'green'); }
    }
  } catch(e) {
    _setSyncDot('error');
    console.error('Sync failed:', e.message);
  }
}

// ── Load from cloud ───────────────────────────────────────────────────────────
async function _loadCloudProgress() {
  if (!_sbUser) return;
  _setSyncDot('syncing');
  try {
    const { data, error } = await _sb.from('progress')
      .select('*').eq('user_id', _sbUser.id).maybeSingle();

    if (!data) {
      await _doSync();
      notify(t('notifSyncUploaded'), 'blue');
      return;
    }
    if (error) { _setSyncDot('error'); console.error('Load error:', error.message); return; }

    // Escribir en localStorage y recargar estado
    if (data.counts)    localStorage.setItem('archi-counts', JSON.stringify(data.counts));
    if (data.favorites) localStorage.setItem('archi-fav',    JSON.stringify(data.favorites));
    if (data.caza)      localStorage.setItem('archi-caza',   JSON.stringify(data.caza));
    if (data.ui)        localStorage.setItem('archi-ui',     JSON.stringify(data.ui));

    // Reset y recarga completa
    S.counts = {}; S.captured.clear(); S.favorites.clear();
    S.hunt = { dead:{}, notified:{} };
    loadProgress(); loadCaza(); loadFav(); loadUIState();

    // Sincronizar UI
    const scBtn = document.getElementById('show-cap-btn');
    if (scBtn) { scBtn.classList.toggle('on', S.showCaptured); scBtn.textContent = S.showCaptured ? '✕ Captura' : '👁 Descarte'; }
    document.getElementById('ug-btn')?.classList.toggle('on', S.underground);
    document.querySelectorAll('.lbtn').forEach(b => b.classList.toggle('on', b.dataset.lang === S.lang));
    const avEl2=document.getElementById('accounts-val'); if(avEl2) avEl2.textContent=S.maxAccounts;
    const sfl = document.getElementById('stone-filter-lbl'); if (sfl) sfl.textContent = t('piedra') + ':';
    const otl = document.getElementById('opt-title-lbl');   if (otl) otl.textContent = t('optTitle');
    document.body.classList.toggle('day-mode', S.dayMode);
    document.body.classList.toggle('hide-markers', !S.showMarkers);
    const sf2=document.getElementById('stone-filter'); if(sf2) sf2.style.display=S.showStoneFilter?'':'none';
    _zoneMapCache = null;
    refreshMarkers(); buildTree(); updateCounter(); updateStones();

    _setSyncDot('ok');
    notify(t('notifSyncLoaded'), 'green');
  } catch(e) {
    _setSyncDot('error');
    console.error('Load cloud error:', e);
  }
}

// ── Auth state listener ───────────────────────────────────────────────────────
let _loggingOut = false;
let _sbToken   = null;
_sb.auth.onAuthStateChange(async (event, session) => {
  if (_loggingOut) return;
  _sbUser  = session?.user  || null;
  _sbToken = session?.access_token || null;
  _updateAuthUI();
  if (event === 'SIGNED_IN') await _loadCloudProgress();
});

// Recuperar sesión activa al cargar (sesión persistente o tras redirect OAuth)
_sb.auth.getSession().then(async ({ data: { session } }) => {
  if (session && !_sbUser) {
    _sbUser  = session.user;
    _sbToken = session.access_token;
    _updateAuthUI();
    await _loadCloudProgress();
  }
});

/* ══════════════════════════════════════════════
   FILTRO ETAPA
══════════════════════════════════════════════ */
function _buildStepFilter() {
  const wrap = document.getElementById('step-filter-btns');
  if (!wrap) return;
  const steps = [...new Set(catalog.map(a=>a.quest_step).filter(Boolean))].sort((a,b)=>a-b);
  let html = `<button class="stpbtn${S.stepFilter===null?' on':''}" data-step="">${t('stepAll')}</button>`;
  steps.forEach(step => {
    html += `<button class="stpbtn${S.stepFilter===step?' on':''}" data-step="${step}">${step}</button>`;
  });
  wrap.innerHTML = html;
  wrap.querySelectorAll('.stpbtn').forEach(btn => btn.addEventListener('click', () => {
    const v = btn.dataset.step;
    S.stepFilter = v === '' ? null : Number(v);
    wrap.querySelectorAll('.stpbtn').forEach(b => b.classList.toggle('on', b.dataset.step === btn.dataset.step));
    refreshMarkers(); buildTree();
  }));
}

function _updateStepFilterLbl() {
  const lbl = document.getElementById('step-filter-lbl');
  if (lbl) lbl.textContent = t('stepLbl') + ':';
}

function toggleHuntHideCap() {
  S.huntHideCap = !S.huntHideCap;
  document.getElementById('hunt-cap-btn')?.classList.toggle('on', S.huntHideCap);
  buildTree();
}

/* ══════════════════════════════════════════════
   MODO RUTA
══════════════════════════════════════════════ */
let _routePolyline = null;
let _routeDots = null;
let _routeHighlightKey = null;
let _rtDragIdx = -1;

function _getSubzoneCenter(key) {
  const poly = zonePolygons[key];
  if (poly?.cells?.length) {
    const cells = poly.cells;
    const avgX = GRID.originX + (cells.reduce((s,c)=>s+c[0],0)/cells.length)*GRID.cellW + GRID.cellW/2;
    const avgY = GRID.originY + (cells.reduce((s,c)=>s+c[1],0)/cells.length)*GRID.cellH + GRID.cellH/2;
    return { lat: avgY, lng: avgX };
  }
  const info = _getZoneInfo(key);
  if (!info?.ids?.length) return null;
  const pts = spawns.filter(sp => info.ids.includes(String(sp.archi_id)));
  if (!pts.length) return null;
  return { lat: pts.reduce((s,p)=>s+p.y,0)/pts.length, lng: pts.reduce((s,p)=>s+p.x,0)/pts.length };
}

function _countPendingInZone(key) {
  const info = _getZoneInfo(key);
  if (!info?.ids?.length) return 0;
  return info.ids.filter(id => !isCap(id)).length;
}

function _renderRoute() {
  const list = document.getElementById('route-list');
  const empty = document.getElementById('route-empty');
  const badge = document.getElementById('route-badge');
  if (!list) return;
  const stops = S.route.stops;
  const pending = stops.length - S.route.checked.size;
  if (badge) badge.textContent = stops.length ? `${pending} ${t('rtPending')}` : '';
  if (!stops.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = '';
    _updateRoutePolyline();
    _updateRouteMarkers();
    _updateRoutePolyHighlight();
    _updateRouteSidebarBtns();
    return;
  }
  if (empty) empty.style.display = 'none';
  const zoneInfoMap = new Map(getUniqueZoneList().map(z => [z.key, z]));
  list.innerHTML = '';
  stops.forEach((stop, idx) => {
    const checked = S.route.checked.has(idx);
    const current = idx === S.route.current;
    const zonePending = _countPendingInZone(stop.key);
    const info = zoneInfoMap.get(stop.key);
    const dispZone = info?.zone || stop.zone;
    const dispSubzone = info?.subzone || stop.subzone;
    const div = document.createElement('div');
    div.className = `route-stop${checked?' checked':''}${current?' current':''}`;
    div.setAttribute('draggable', 'true');
    div.innerHTML = `
      <span class="rs-drag" title="${t('rtDragHint')}">⠿</span>
      <span class="rs-num">${idx+1}</span>
      <div class="rs-info">
        <div class="rs-name">${dispSubzone}</div>
        <div class="rs-zone">${dispZone}</div>
      </div>
      <span class="rs-pending${zonePending===0?' done':''}">${zonePending>0?zonePending+' ⚑':'✓'}</span>
      <button class="rs-chk" title="${checked?t('rtUncheck'):t('rtChecked')}">${checked?'✓':'◯'}</button>
      <button class="rs-del" title="✕">✕</button>`;
    div.querySelector('.rs-chk').addEventListener('click', e => { e.stopPropagation(); routeToggleCheck(idx); });
    div.querySelector('.rs-del').addEventListener('click', e => { e.stopPropagation(); routeRemoveStop(idx); });
    div.addEventListener('click', e => { if(!e.target.closest('.rs-drag')) routeFlyTo(idx); });
    div.addEventListener('dragstart', e => {
      _rtDragIdx = idx;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => div.classList.add('dragging'), 0);
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
      list.querySelectorAll('.route-stop').forEach(el => el.classList.remove('drag-over'));
    });
    div.addEventListener('dragover', e => {
      e.preventDefault();
      if (_rtDragIdx === idx) return;
      list.querySelectorAll('.route-stop').forEach(el => el.classList.remove('drag-over'));
      div.classList.add('drag-over');
    });
    div.addEventListener('dragleave', e => { if (!div.contains(e.relatedTarget)) div.classList.remove('drag-over'); });
    div.addEventListener('drop', e => {
      e.preventDefault();
      const from = _rtDragIdx, to = idx;
      if (from < 0 || from === to) return;
      const [moved] = S.route.stops.splice(from, 1);
      S.route.stops.splice(to, 0, moved);
      const nc = new Set();
      S.route.checked.forEach(i => {
        if (i === from) nc.add(to);
        else if (from < to && i > from && i <= to) nc.add(i-1);
        else if (from > to && i >= to && i < from) nc.add(i+1);
        else nc.add(i);
      });
      S.route.checked = nc;
      if (S.route.current === from) S.route.current = to;
      else if (from < to && S.route.current > from && S.route.current <= to) S.route.current--;
      else if (from > to && S.route.current >= to && S.route.current < from) S.route.current++;
      _rtDragIdx = -1;
      _renderRoute();
    });
    list.appendChild(div);
  });
  if (window.innerWidth <= 768 && stops.length > 0) {
    const allItems = [...list.querySelectorAll('.route-stop')];
    const curEl = list.querySelector('.route-stop.current');
    const curPos = curEl ? allItems.indexOf(curEl) : allItems.findIndex(el => !el.classList.contains('checked'));
    let nextItem = null;
    for (let i = 1; i < allItems.length; i++) {
      const el = allItems[(curPos + i) % allItems.length];
      if (!el.classList.contains('checked') && el !== allItems[curPos]) { nextItem = el; break; }
    }
    allItems.forEach(el => {
      if (el !== allItems[curPos] && el !== nextItem) el.style.display = 'none';
    });
    if (nextItem) nextItem.classList.add('rt-next');
    const prog = document.createElement('div');
    prog.className = 'rt-mob-prog';
    const done = S.route.checked.size;
    prog.textContent = `${done}/${stops.length} · ${stops.length - done} ${t('rtPending')}`;
    list.insertBefore(prog, list.firstChild);
  } else {
    const curEl = list.querySelector('.route-stop.current');
    if (curEl) curEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  _updateRoutePolyline();
  _updateRouteMarkers();
  _updateRoutePolyHighlight();
  _updateRouteSidebarBtns();
}

function routeExport() {
  const stops = S.route.stops;
  if (!stops.length) return;
  const zim = new Map(getUniqueZoneList().map(z => [z.key, z]));
  const lines = [`🗺 ARCHIDEX — ${t('rtTitle')} (${stops.length}):`];
  stops.forEach((s, i) => {
    const info = zim.get(s.key);
    const ch = S.route.checked.has(i) ? ' ✓' : '';
    lines.push(`${i+1}. ${info?.subzone||s.subzone} · ${info?.zone||s.zone}${ch}`);
  });
  const text = lines.join('\n');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => notify(t('rtCopied'),'green')).catch(() => _fallbackCopy(text));
  } else { _fallbackCopy(text); }
}
function _seedIdForZone(key) {
  if (!_zoneInfoCache) _zoneInfoCache = _buildZoneInfoCache();
  const ids = _zoneInfoCache[key]?.ids;
  if (!ids?.length) return null;
  return String(Math.min(...ids.map(Number)));
}

function _seedBuildReverseMap() {
  if (!_zoneInfoCache) _zoneInfoCache = _buildZoneInfoCache();
  const map = new Map();
  Object.entries(_zoneInfoCache).forEach(([key, info]) => {
    info.ids.forEach(id => map.set(id, key));
  });
  return map;
}

function routeGenerateSeed() {
  const stops = S.route.stops;
  if (!stops.length) return;
  const codes = stops.map(s => _seedIdForZone(s.key)).filter(Boolean);
  if (!codes.length) return;
  const seed = codes.join('-');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(seed).then(() => notify(t('rtSeedCopied'),'green')).catch(() => _fallbackCopy(seed));
  } else { _fallbackCopy(seed); }
}

function routeImportSeed() {
  const raw = window.prompt(t('rtSeedPrompt'));
  if (!raw?.trim()) return;
  try {
    const rev = _seedBuildReverseMap();
    const zoneInfoMap = new Map(getUniqueZoneList().map(z => [z.key, z]));
    const seen = new Set();
    const stops = raw.trim().split('-').map(part => {
      const id = part.trim();
      const key = rev.get(id);
      if (!key || seen.has(key)) return null;
      seen.add(key);
      const info = zoneInfoMap.get(key);
      if (!info) return null;
      return { key, zone: info.zone, subzone: info.subzone };
    }).filter(Boolean);
    if (!stops.length) { notify(t('rtSeedInvalid'),'red'); return; }
    S.route.stops = stops;
    S.route.checked = new Set();
    S.route.current = -1;
    const ov = document.getElementById('route-overlay');
    if (ov && !ov.classList.contains('open')) { ov.classList.add('open'); _positionRoutePanel(); }
    _renderRoute();
    notify(tf('rtSeedLoaded', stops.length),'green');
  } catch(_) { notify(t('rtSeedInvalid'),'red'); }
}

function _fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); notify(t('rtCopied'),'green'); } catch(_){}
  document.body.removeChild(ta);
}

function _updateRouteSidebarBtns() {
  const keys = new Set(S.route.stops.map(s=>s.key));
  document.querySelectorAll('.zl-route-add[data-key]').forEach(btn => {
    if (keys.has(btn.dataset.key)) btn.classList.add('in-route');
    else btn.classList.remove('in-route');
  });
}

function _updateRoutePolyline() {
  if (_routePolyline) { _routePolyline.remove(); _routePolyline = null; }
  const pts = S.route.stops
    .filter((_,i) => !S.route.checked.has(i))
    .map(s => _getSubzoneCenter(s.key))
    .filter(Boolean);
  if (pts.length < 2) return;
  _routePolyline = L.polyline(pts.map(p=>[p.lat,p.lng]), {
    color:'#4a90d9', weight:2, dashArray:'6,6', opacity:.75
  }).addTo(map);
}

function _updateRouteMarkers() {
  if (_routeDots) { _routeDots.remove(); _routeDots = null; }
  const ov = document.getElementById('route-overlay');
  if (!ov?.classList.contains('open') || !S.route.stops.length) return;
  if (!_undergroundKeys) _undergroundKeys = buildUndergroundKeys();
  _routeDots = L.layerGroup().addTo(map);
  S.route.stops.forEach((stop, idx) => {
    const center = _getSubzoneCenter(stop.key);
    if (!center) return;
    const checked = S.route.checked.has(idx);
    const current = idx === S.route.current;
    const isUg = _undergroundKeys.has(stop.key);
    // Underground dots: anchor deep below the icon so the dot floats ABOVE the entrance marker
    const anchor = isUg ? [10, 37] : [10, 10];
    const icon = L.divIcon({
      className: 'rt-dot-wrap',
      html: `<div class="rt-dot${current?' cur':''}${checked?' chk':''}">${idx+1}</div>`,
      iconSize: [20, 20],
      iconAnchor: anchor,
    });
    L.marker([center.lat, center.lng], { icon, zIndexOffset: isUg ? 1100 : 300, interactive: true })
      .on('click', () => routeFlyTo(idx))
      .addTo(_routeDots);
  });
}

function _updateRoutePolyHighlight() {
  if (_routeHighlightKey) {
    const grp = zonePolygonLayers[_routeHighlightKey];
    if (grp) {
      grp._routeHighlighted = false;
      const origColor = zonePolygons[_routeHighlightKey]?.color || zoneColor(zonePolygons[_routeHighlightKey]?.zone || _routeHighlightKey);
      grp.eachLayer(r => r.setStyle({
        fillOpacity: grp._visible?.18:0, weight: grp._visible?.5:0, opacity: grp._visible?.55:0,
        fillColor: origColor, color: origColor
      }));
    }
    _routeHighlightKey = null;
  }
  const ov = document.getElementById('route-overlay');
  if (!ov?.classList.contains('open')) return;
  if (S.route.current < 0 || S.route.current >= S.route.stops.length) return;
  const stop = S.route.stops[S.route.current];
  if (!stop) return;
  const grp = zonePolygonLayers[stop.key];
  if (!grp) return;
  _routeHighlightKey = stop.key;
  grp._routeHighlighted = true;
  grp.eachLayer(r => r.setStyle({ fillOpacity:.4, weight:2.5, opacity:1, fillColor:'#00e5ff', color:'#00b4d8' }));
}

function routeAddZone(key, zone, subzone) {
  if (S.route.stops.some(s=>s.key===key)) { notify(`${subzone} ${t('rtAlready')}`,'orange'); return; }
  S.route.stops.push({ key, zone, subzone });
  _renderRoute();
  notify(`✚ ${subzone} ${t('rtAdded')}`,'blue');
}

function routeAddZoneGroup(zoneName, keys) {
  if (!keys?.length) return;
  const zoneInfoMap = new Map(getUniqueZoneList().map(z => [z.key, z]));
  let added = 0;
  keys.forEach(key => {
    if (S.route.stops.some(s=>s.key===key)) return;
    const info = zoneInfoMap.get(key);
    if (!info) return;
    S.route.stops.push({ key, zone: info.zone, subzone: info.subzone });
    added++;
  });
  if (!added) { notify(t('rtAlready'), 'orange'); return; }
  // Open route panel and auto-calc optimal order for this zone group
  const existing = S.route.stops.filter(s => !keys.includes(s.key));
  const groupStops = S.route.stops.filter(s => keys.includes(s.key));
  // Nearest-neighbor within the group
  const start = map.getCenter();
  let cur = { lat: start.lat, lng: start.lng };
  const remaining = [...groupStops];
  const ordered = [];
  while (remaining.length) {
    let bestIdx = 0, bestDist = Infinity;
    remaining.forEach((z, i) => {
      const c = _getSubzoneCenter(z.key);
      if (!c) return;
      const d = (c.lat-cur.lat)**2 + (c.lng-cur.lng)**2;
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    const chosen = remaining.splice(bestIdx, 1)[0];
    const c = _getSubzoneCenter(chosen.key);
    if (c) { cur = c; ordered.push(chosen); }
    else if (remaining.length) remaining.splice(bestIdx < remaining.length ? bestIdx : 0, 0);
    else break;
  }
  S.route.stops = [...existing, ...ordered];
  const ov = document.getElementById('route-overlay');
  if (ov && !ov.classList.contains('open')) { ov.classList.add('open'); _positionRoutePanel(); }
  _renderRoute();
  notify(tf('rtCalced', S.route.stops.length), 'blue');
}

function routeRemoveStop(idx) {
  S.route.stops.splice(idx, 1);
  const nc = new Set();
  S.route.checked.forEach(i => { if(i<idx) nc.add(i); else if(i>idx) nc.add(i-1); });
  S.route.checked = nc;
  if (S.route.current >= S.route.stops.length) S.route.current = S.route.stops.length - 1;
  _renderRoute();
}

function routeToggleCheck(idx) {
  if (S.route.checked.has(idx)) S.route.checked.delete(idx);
  else S.route.checked.add(idx);
  _renderRoute();
}

function routeFlyTo(idx) {
  S.route.current = idx;
  const stop = S.route.stops[idx];
  if (!stop) return;
  if (!_undergroundKeys) _undergroundKeys = buildUndergroundKeys();
  const stopIsUg = _undergroundKeys.has(stop.key);
  _setUndergroundSilent(stopIsUg);
  if (zonePolygonLayers[stop.key]) {
    map.fitBounds(zonePolygonLayers[stop.key].getBounds(), { padding:[40,40] });
  } else {
    const c = _getSubzoneCenter(stop.key);
    if (c) map.setView([c.lat, c.lng], map.getZoom(), { animate:true });
  }
  _renderRoute();
}

function routeNext() {
  const n = S.route.stops.length;
  if (!n) return;
  if (S.route.current >= 0 && S.route.current < n) {
    S.route.checked.add(S.route.current);
  }
  const start = (S.route.current + 1) % n;
  for (let i = 0; i < n; i++) {
    const idx = (start + i) % n;
    if (!S.route.checked.has(idx)) { routeFlyTo(idx); return; }
  }
  _renderRoute();
  notify(t('rtAllDone'), 'green');
}

function routePrev() {
  const n = S.route.stops.length;
  if (!n) return;
  const start = ((S.route.current - 1) + n) % n;
  for (let i = 0; i < n; i++) {
    const idx = (start - i + n) % n;
    if (!S.route.checked.has(idx)) { routeFlyTo(idx); return; }
  }
  notify(t('rtAllDone'), 'green');
}

function routeAutoCalc() {
  const pending = getUniqueZoneList().filter(z => _countPendingInZone(z.key) > 0);
  if (!pending.length) { notify(t('rtNoPending'), 'green'); return; }
  const start = map.getCenter();
  const remaining = [...pending];
  const ordered = [];
  let cur = { lat: start.lat, lng: start.lng };
  while (remaining.length) {
    let bestIdx = 0, bestDist = Infinity;
    remaining.forEach((z, i) => {
      const c = _getSubzoneCenter(z.key);
      if (!c) return;
      const d = (c.lat-cur.lat)**2 + (c.lng-cur.lng)**2;
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    const chosen = remaining.splice(bestIdx, 1)[0];
    const c = _getSubzoneCenter(chosen.key);
    if (c) { cur = c; ordered.push(chosen); }
    else remaining.length && remaining.splice(bestIdx, 0);
  }
  S.route.stops = ordered.map(z => ({ key:z.key, zone:z.zone, subzone:z.subzone }));
  S.route.checked = new Set();
  S.route.current = -1;
  _renderRoute();
  notify(tf('rtCalced', S.route.stops.length), 'blue');
}

function routeClear() {
  S.route.stops = [];
  S.route.checked = new Set();
  S.route.current = -1;
  if (_routePolyline) { _routePolyline.remove(); _routePolyline = null; }
  if (_routeDots) { _routeDots.remove(); _routeDots = null; }
  _updateRoutePolyHighlight();
  _renderRoute();
  _updateRouteSidebarBtns();
}

function _positionRoutePanel() {
  const box = document.getElementById('route-box');
  if (!box) return;
  if (window.innerWidth <= 768) return;
  const cl = document.getElementById('capture-log');
  const clRect = cl ? cl.getBoundingClientRect() : null;
  const gap = 6;
  if (clRect && cl.offsetHeight > 0) {
    box.style.bottom = (window.innerHeight - clRect.top + gap) + 'px';
  } else {
    box.style.bottom = (54 + 36 + gap) + 'px';
  }
}

function toggleRoutePanel() {
  const ov = document.getElementById('route-overlay');
  if (!ov) return;
  if (ov.classList.contains('open')) {
    ov.classList.remove('open');
    if (_routeDots) { _routeDots.remove(); _routeDots = null; }
    _updateRoutePolyHighlight();
    return;
  }
  ov.classList.add('open');
  _positionRoutePanel();
  _renderRoute();
}

function closeRoutePanel() {
  document.getElementById('route-overlay')?.classList.remove('open');
}

/* ══════════════════════════════════════════════
   TUTORIAL GUIADO
══════════════════════════════════════════════ */
let _tutStep = 0;

function _getTutSteps() {
  const mob = window.innerWidth <= 768;
  const steps = [
    { el: null, type: 'lang', title: '🌍 Language · Idioma · Langue', body: '' },
    { el: null,            title: t('tut1Title'), body: t('tut1Body') },
    { el: '#map',          title: t('tut2Title'), body: t('tut2Body') },
    { el: '#mode-sw',      title: t('tut3Title'), body: t('tut3Body') },
    { el: mob ? '#mob-fab' : '#sidebar', title: t('tut4Title'), body: mob ? t('tut4MobBody') : t('tut4Body') },
    { el: '#sb-tree',      title: t('tut5Title'), body: t('tut5Body') },
  ];
  if (!mob) {
    steps.push({ el: '#adx-btn', title: t('tut6Title'), body: t('tut6Body') });
  }
  steps.push(
    { el: '#route-btn',    title: t('tutRouteTitle'), body: t('tutRouteBody') },
    { el: '#settings-btn', title: t('tut7Title'),     body: t('tut7Body') },
    { el: null,            title: t('tut8Title'),     body: t('tut8Body') },
  );
  return steps;
}

function startTutorial() {
  _tutStep = 0;
  _closeSettings();
  document.getElementById('tutorial-overlay')?.classList.add('active');
  _renderTutStep();
}
function skipTutorial() {
  document.getElementById('tutorial-overlay')?.classList.remove('active');
  localStorage.setItem('archi-tutorial-done', '1');
}
function nextTutStep() {
  const steps = _getTutSteps();
  if (_tutStep < steps.length - 1) { _tutStep++; _renderTutStep(); }
  else skipTutorial();
}
function prevTutStep() {
  if (_tutStep > 0) { _tutStep--; _renderTutStep(); }
}
function tutGoTo(i) { _tutStep = i; _renderTutStep(); }

function tutSelectLang(code) {
  const btn = document.querySelector(`.lbtn[data-lang="${code}"]`);
  if (btn) btn.click();
  nextTutStep();
}

function _renderTutStep() {
  const steps = _getTutSteps();
  const step = steps[_tutStep];
  const n = steps.length;

  document.getElementById('tut-title').textContent = step.title;
  document.getElementById('tut-body').textContent  = step.body;
  document.getElementById('tut-indicator').innerHTML =
    tf('tutStep', _tutStep + 1, n) +
    ' &nbsp;' +
    steps.map((_,i) => `<span class="tut-dot${i===_tutStep?' on':''}" onclick="tutGoTo(${i})"></span>`).join('');

  const langPicker = document.getElementById('tut-lang-picker');
  if (step.type === 'lang') {
    langPicker.style.display = 'flex';
    langPicker.innerHTML = LANGS.map(l =>
      `<button class="tut-lang-btn${S.lang===l.code?' on':''}" onclick="tutSelectLang('${l.code}')">${l.flag} ${l.label}</button>`
    ).join('');
  } else {
    langPicker.style.display = 'none';
  }

  const nextBtn = document.getElementById('tut-next-btn');
  nextBtn.textContent = _tutStep === n - 1 ? t('tutFinish') : t('tutNext');
  const prevBtn = document.getElementById('tut-prev-btn');
  prevBtn.style.visibility = _tutStep > 0 ? 'visible' : 'hidden';
  document.getElementById('tut-skip-btn').textContent = t('tutSkip');

  _updateTutSpotlight(step.el);
  _positionTutBox(step.el);
}

function _updateTutSpotlight(selector) {
  const hole = document.getElementById('tut-hole');
  const ring = document.getElementById('tut-ring');
  const pad  = 10;
  if (!selector) {
    hole.setAttribute('width', '0'); hole.setAttribute('height', '0');
    ring.style.display = 'none'; return;
  }
  const el = document.querySelector(selector);
  if (!el) {
    hole.setAttribute('width', '0'); hole.setAttribute('height', '0');
    ring.style.display = 'none'; return;
  }
  const r = el.getBoundingClientRect();
  hole.setAttribute('x',      r.left   - pad);
  hole.setAttribute('y',      r.top    - pad);
  hole.setAttribute('width',  r.width  + pad * 2);
  hole.setAttribute('height', r.height + pad * 2);
  ring.style.display  = 'block';
  ring.style.left     = (r.left   - pad) + 'px';
  ring.style.top      = (r.top    - pad) + 'px';
  ring.style.width    = (r.width  + pad * 2) + 'px';
  ring.style.height   = (r.height + pad * 2) + 'px';
}

function _positionTutBox(selector) {
  const box = document.getElementById('tut-box');
  const W = window.innerWidth, H = window.innerHeight;

  // Mobile: always pin to bottom-center, never beside elements
  if (W <= 768) {
    const bw = Math.min(W - 32, 320);
    box.style.width  = bw + 'px';
    box.style.left   = Math.round((W - bw) / 2) + 'px';
    box.style.top    = '';
    box.style.bottom = '24px';
    return;
  }

  box.style.width  = '300px';
  box.style.bottom = '';
  const bw = 300, pad = 18, spotPad = 14;

  if (!selector) {
    box.style.left = Math.round((W - bw) / 2) + 'px';
    box.style.top  = Math.round(H * 0.35) + 'px';
    return;
  }
  const el = document.querySelector(selector);
  if (!el || el.offsetParent === null) {
    box.style.left = Math.round((W - bw) / 2) + 'px';
    box.style.top  = Math.round(H * 0.35) + 'px';
    return;
  }
  const r   = el.getBoundingClientRect();
  const bh  = box.offsetHeight || 180;
  let left, top;

  if (r.right + spotPad + pad + bw <= W) {
    left = r.right + spotPad + pad;
    top  = Math.max(pad, Math.min(H - bh - pad, r.top + r.height / 2 - bh / 2));
  } else if (r.left - spotPad - pad - bw >= 0) {
    left = r.left - spotPad - pad - bw;
    top  = Math.max(pad, Math.min(H - bh - pad, r.top + r.height / 2 - bh / 2));
  } else if (r.bottom + spotPad + pad + bh <= H) {
    top  = r.bottom + spotPad + pad;
    left = Math.max(pad, Math.min(W - bw - pad, r.left + r.width / 2 - bw / 2));
  } else {
    top  = Math.max(pad, r.top - spotPad - pad - bh);
    left = Math.max(pad, Math.min(W - bw - pad, r.left + r.width / 2 - bw / 2));
  }
  box.style.left = left + 'px';
  box.style.top  = top  + 'px';
}

// ── Exponer funciones globales para handlers HTML inline ─────────────────────
Object.assign(window, {
  _imgErr: typeof _imgErr!=="undefined" ? _imgErr : undefined,
  _renderArchidex: typeof _renderArchidex!=="undefined" ? _renderArchidex : undefined,
  advanceToNextZone: typeof advanceToNextZone!=="undefined" ? advanceToNextZone : undefined,
  adxCloseClearConfirm: typeof adxCloseClearConfirm!=="undefined" ? adxCloseClearConfirm : undefined,
  adxConfirmClear: typeof adxConfirmClear!=="undefined" ? adxConfirmClear : undefined,
  adxExportCSV: typeof adxExportCSV!=="undefined" ? adxExportCSV : undefined,
  adxImportCSV: typeof adxImportCSV!=="undefined" ? adxImportCSV : undefined,
  adxOpenNewTab: typeof adxOpenNewTab!=="undefined" ? adxOpenNewTab : undefined,
  adxPromptClearInventory: typeof adxPromptClearInventory!=="undefined" ? adxPromptClearInventory : undefined,
  adxSetFilter: typeof adxSetFilter!=="undefined" ? adxSetFilter : undefined,
  adxSetStone: typeof adxSetStone!=="undefined" ? adxSetStone : undefined,
  adxToggleCap: typeof adxToggleCap!=="undefined" ? adxToggleCap : undefined,
  adxToggleFav: typeof adxToggleFav!=="undefined" ? adxToggleFav : undefined,
  autoPopulateSpawns: typeof autoPopulateSpawns!=="undefined" ? autoPopulateSpawns : undefined,
  changeAccounts: typeof changeAccounts!=="undefined" ? changeAccounts : undefined,
  clearAllCooldowns: typeof clearAllCooldowns!=="undefined" ? clearAllCooldowns : undefined,
  clearCells: typeof clearCells!=="undefined" ? clearCells : undefined,
  clearHuntSession: typeof clearHuntSession!=="undefined" ? clearHuntSession : undefined,
  closeArchidex: typeof closeArchidex!=="undefined" ? closeArchidex : undefined,
  closeBeta: typeof closeBeta!=="undefined" ? closeBeta : undefined,
  closeHuntSession: typeof closeHuntSession!=="undefined" ? closeHuntSession : undefined,
  closeMobSidebar: typeof closeMobSidebar!=="undefined" ? closeMobSidebar : undefined,
  closeModal: typeof closeModal!=="undefined" ? closeModal : undefined,
  closeResetModal: typeof closeResetModal!=="undefined" ? closeResetModal : undefined,
  confirmHuntSession: typeof confirmHuntSession!=="undefined" ? confirmHuntSession : undefined,
  confirmReset: typeof confirmReset!=="undefined" ? confirmReset : undefined,
  confirmZoneCells: typeof confirmZoneCells!=="undefined" ? confirmZoneCells : undefined,
  deleteAll: typeof deleteAll!=="undefined" ? deleteAll : undefined,
  deleteSelected: typeof deleteSelected!=="undefined" ? deleteSelected : undefined,
  deleteZone: typeof deleteZone!=="undefined" ? deleteZone : undefined,
  exportMapImage: typeof exportMapImage!=="undefined" ? exportMapImage : undefined,
  exportProgress: typeof exportProgress!=="undefined" ? exportProgress : undefined,
  exportSpawns: typeof exportSpawns!=="undefined" ? exportSpawns : undefined,
  exportZonePolygons: typeof exportZonePolygons!=="undefined" ? exportZonePolygons : undefined,
  flyToZone: typeof flyToZone!=="undefined" ? flyToZone : undefined,
  goToUgZone: typeof goToUgZone!=="undefined" ? goToUgZone : undefined,
  toggleUgNav: typeof toggleUgNav!=="undefined" ? toggleUgNav : undefined,
  hsQtyAdj: typeof hsQtyAdj!=="undefined" ? hsQtyAdj : undefined,
  hsToggleAll: typeof hsToggleAll!=="undefined" ? hsToggleAll : undefined,
  importProgress: typeof importProgress!=="undefined" ? importProgress : undefined,
  invAdj: typeof invAdj!=="undefined" ? invAdj : undefined,
  onZoneFilterChange: typeof onZoneFilterChange!=="undefined" ? onZoneFilterChange : undefined,
  openArchidex: typeof openArchidex!=="undefined" ? openArchidex : undefined,
  openHuntSession: typeof openHuntSession!=="undefined" ? openHuntSession : undefined,
  openModal: typeof openModal!=="undefined" ? openModal : undefined,
  resetProgress: typeof resetProgress!=="undefined" ? resetProgress : undefined,
  saveNote: typeof saveNote!=="undefined" ? saveNote : undefined,
  saveModalNote: typeof saveModalNote!=="undefined" ? saveModalNote : undefined,
  startTutorial: typeof startTutorial!=="undefined" ? startTutorial : undefined,
  skipTutorial: typeof skipTutorial!=="undefined" ? skipTutorial : undefined,
  nextTutStep: typeof nextTutStep!=="undefined" ? nextTutStep : undefined,
  prevTutStep: typeof prevTutStep!=="undefined" ? prevTutStep : undefined,
  tutGoTo: typeof tutGoTo!=="undefined" ? tutGoTo : undefined,
  tutSelectLang: typeof tutSelectLang!=="undefined" ? tutSelectLang : undefined,
  setAllZoneFilters: typeof setAllZoneFilters!=="undefined" ? setAllZoneFilters : undefined,
  shiftGrid: typeof shiftGrid!=="undefined" ? shiftGrid : undefined,
  startCellDraw: typeof startCellDraw!=="undefined" ? startCellDraw : undefined,
  stopCellDraw: typeof stopCellDraw!=="undefined" ? stopCellDraw : undefined,
  toggleBetaSelect: typeof toggleBetaSelect!=="undefined" ? toggleBetaSelect : undefined,
  toggleCapFromModal: typeof toggleCapFromModal!=="undefined" ? toggleCapFromModal : undefined,
  toggleCapFromTip: typeof toggleCapFromTip!=="undefined" ? toggleCapFromTip : undefined,
  toggleCaptureLog: typeof toggleCaptureLog!=="undefined" ? toggleCaptureLog : undefined,
  toggleChangelog: typeof toggleChangelog!=="undefined" ? toggleChangelog : undefined,
  toggleDead: typeof toggleDead!=="undefined" ? toggleDead : undefined,
  toggleDragOpt: typeof toggleDragOpt!=="undefined" ? toggleDragOpt : undefined,
  toggleFavFromModal: typeof toggleFavFromModal!=="undefined" ? toggleFavFromModal : undefined,
  toggleFavFromTip: typeof toggleFavFromTip!=="undefined" ? toggleFavFromTip : undefined,
  toggleGridBtn: typeof toggleGridBtn!=="undefined" ? toggleGridBtn : undefined,
  toggleHelp: typeof toggleHelp!=="undefined" ? toggleHelp : undefined,
  toggleKbHelp: typeof toggleKbHelp!=="undefined" ? toggleKbHelp : undefined,
  toggleMobSidebar: typeof toggleMobSidebar!=="undefined" ? toggleMobSidebar : undefined,
  togglePresentation: typeof togglePresentation!=="undefined" ? togglePresentation : undefined,
  toggleSetting: typeof toggleSetting!=="undefined" ? toggleSetting : undefined,
  toggleSettings: typeof toggleSettings!=="undefined" ? toggleSettings : undefined,
  toggleShowCaptured: typeof toggleShowCaptured!=="undefined" ? toggleShowCaptured : undefined,
  toggleHideDone: typeof toggleHideDone!=="undefined" ? toggleHideDone : undefined,
  toggleHuntHideCap: typeof toggleHuntHideCap!=="undefined" ? toggleHuntHideCap : undefined,
  collapseAllZones: typeof collapseAllZones!=="undefined" ? collapseAllZones : undefined,
  expandAllZones: typeof expandAllZones!=="undefined" ? expandAllZones : undefined,
  toggleCompact: typeof toggleCompact!=="undefined" ? toggleCompact : undefined,
  routeAddZoneGroup: typeof routeAddZoneGroup!=="undefined" ? routeAddZoneGroup : undefined,
  toggleStatsPanel: typeof toggleStatsPanel!=="undefined" ? toggleStatsPanel : undefined,
  toggleZoneFilterDd: typeof toggleZoneFilterDd!=="undefined" ? toggleZoneFilterDd : undefined,
  toggleRoutePanel: typeof toggleRoutePanel!=="undefined" ? toggleRoutePanel : undefined,
  closeRoutePanel: typeof closeRoutePanel!=="undefined" ? closeRoutePanel : undefined,
  routeAutoCalc: typeof routeAutoCalc!=="undefined" ? routeAutoCalc : undefined,
  routeClear: typeof routeClear!=="undefined" ? routeClear : undefined,
  routeExport: typeof routeExport!=="undefined" ? routeExport : undefined,
  routeGenerateSeed: typeof routeGenerateSeed!=="undefined" ? routeGenerateSeed : undefined,
  routeImportSeed: typeof routeImportSeed!=="undefined" ? routeImportSeed : undefined,
  routeNext: typeof routeNext!=="undefined" ? routeNext : undefined,
  routePrev: typeof routePrev!=="undefined" ? routePrev : undefined,
});
