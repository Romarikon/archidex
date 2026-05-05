import sys
sys.stdout.reconfigure(encoding='utf-8')

content = open('c:/Users/Aleja/Downloads/mapa-archimonstruos/src/main.js', encoding='utf-8').read()

start_marker = 'function exportMapImage() {'
end_marker = '// ── Underground mode ──'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

print(f'start_idx: {start_idx}, end_idx: {end_idx}')

new_functions = '''function _tintIcon(img, size, color, alpha) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);
  if (color && alpha > 0) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  return c;
}

function exportMapImage() {
  const existing = document.getElementById('export-dialog');
  if (existing) existing.remove();

  const hasRoute = S.route && S.route.stops && S.route.stops.length > 0;

  const dlg = document.createElement('div');
  dlg.id = 'export-dialog';
  dlg.innerHTML = `
    <div id="export-dialog-box">
      <div id="export-dialog-title">${t('expTitle')}</div>

      <div class="export-opt">
        <label><input type="checkbox" id="exp-spawns" checked> ${t('expSpawns')}</label>
      </div>
      <div class="export-sub" data-parent="exp-spawns">
        <label><input type="checkbox" id="exp-icons" checked> ${t('expIcons')}</label>
      </div>
      <div class="export-sub" data-parent="exp-spawns">
        <label><input type="checkbox" id="exp-colorstatus" checked> ${t('expColorStatus')}</label>
      </div>

      <div class="export-opt">
        <label><input type="checkbox" id="exp-route" ${hasRoute ? 'checked' : 'disabled'}> ${t('expRoute')}${hasRoute ? '' : ' <span class="exp-na">—</span>'}</label>
      </div>

      <div class="export-opt">
        <label><input type="checkbox" id="exp-header" checked> ${t('expHeader')}</label>
      </div>

      <div class="export-opt">
        <label><input type="checkbox" id="exp-list" checked> ${t('expList')}</label>
      </div>
      <div class="export-sub" data-parent="exp-list">
        <label><input type="checkbox" id="exp-legend" checked> ${t('expLegend')}</label>
      </div>

      <div id="export-dialog-btns">
        <button id="exp-cancel">${t('expCancel')}</button>
        <button id="exp-confirm">${t('expConfirm')}</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);

  // Parent-child checkbox logic
  dlg.querySelectorAll('.export-opt input[type=checkbox]').forEach(parent => {
    const subs = dlg.querySelectorAll(`.export-sub[data-parent="${parent.id}"]`);
    if (!subs.length) return;
    const sync = () => subs.forEach(sub => {
      sub.classList.toggle('exp-disabled', !parent.checked);
      sub.querySelectorAll('input').forEach(i => i.disabled = !parent.checked);
    });
    parent.addEventListener('change', sync);
    sync();
  });

  document.getElementById('exp-cancel').onclick = () => dlg.remove();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.remove(); });
  document.getElementById('exp-confirm').onclick = () => {
    const g = id => document.getElementById(id);
    const opts = {
      spawns:      g('exp-spawns').checked,
      icons:       g('exp-icons').checked,
      colorStatus: g('exp-colorstatus').checked,
      route:       hasRoute && g('exp-route').checked,
      header:      g('exp-header').checked,
      list:        g('exp-list').checked,
      legend:      g('exp-legend').checked,
    };
    dlg.remove();
    _doExportMapImage(opts);
  };
}

async function _doExportMapImage(opts = {}) {
  notify(t('notifMapLoading'), 'blue');
  const ZOOM = 1, TS = CFG.tileSize, grid = CFG.grid[ZOOM];
  const mapW = grid.cols * TS, mapH = grid.rows * TS, SCALE = Math.pow(2, ZOOM);
  const ICON_SZ = 16;

  // ── 1. Cargar tiles ────────────────────────────────────────────────
  const tilePromises = [];
  for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.cols; c++) {
    const idx = r * grid.cols + c + 1;
    tilePromises.push(new Promise(res => {
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => res({ img, c, r });
      img.onerror = () => res(null);
      img.src = `./Tiles/${ZOOM}/${idx}.jpg?t=${Date.now()}`;
    }));
  }
  const tiles = await Promise.all(tilePromises);

  // ── 2. Canvas del mapa ───────────────────────────────────────────────
  const mc = document.createElement('canvas'); mc.width = mapW; mc.height = mapH;
  const mctx = mc.getContext('2d');
  mctx.fillStyle = '#16171a'; mctx.fillRect(0, 0, mapW, mapH);
  tiles.forEach(t => { if (t) mctx.drawImage(t.img, t.c * TS, t.r * TS, TS, TS); });

  // ── 3. Preparar iconos tintados ──────────────────────────────────────────
  let iconCap = null, iconDead = null, iconPend = null;
  if (opts.spawns && opts.icons) {
    const baseImg = await new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = './icons/archi.png';
    });
    if (baseImg) {
      iconCap  = _tintIcon(baseImg, ICON_SZ, '#51cf66', 0.65);
      iconDead = _tintIcon(baseImg, ICON_SZ, '#fdcb6e', 0.60);
      iconPend = _tintIcon(baseImg, ICON_SZ, '#4d9cf7', 0.40);
    }
  }

  // ── 4. Dibujar spawns ────────────────────────────────────────────────
  if (opts.spawns) {
    spawns.forEach(s => {
      const xp = s.x * SCALE, yp = -s.y * SCALE;
      if (xp < 0 || xp > mapW || yp < 0 || yp > mapH) return;
      const cap = isCap(s.archi_id), dead = isDead(s.archi_id);
      if (opts.icons && (iconCap || iconPend)) {
        const icon = cap ? iconCap : dead ? iconDead : iconPend;
        if (icon) mctx.drawImage(icon, xp - ICON_SZ / 2, yp - ICON_SZ / 2, ICON_SZ, ICON_SZ);
      } else {
        const color = opts.colorStatus
          ? (cap ? '#51cf66' : dead ? '#fdcb6e' : '#4d9cf7')
          : '#4d9cf7';
        mctx.beginPath(); mctx.arc(xp, yp, 5, 0, Math.PI * 2);
        mctx.fillStyle = color; mctx.fill();
        mctx.strokeStyle = 'rgba(255,255,255,.6)'; mctx.lineWidth = 1.5; mctx.stroke();
      }
    });
  }

  // ── 5. Dibujar ruta ──────────────────────────────────────────────────
  if (opts.route && S.route && S.route.stops.length > 0) {
    const centers = [];
    S.route.stops.forEach(stop => {
      const zSpawns = spawns.filter(s => {
        const az = archiZones[String(s.archi_id)];
        if (!az) return false;
        const zones = az.zones || [];
        return zones.some(zd => {
          const zn = norm(typeof zd.zone === 'object' ? (zd.zone.es || '') : (zd.zone || ''));
          const sz = norm(typeof zd.subzone === 'object' ? (zd.subzone.es || '') : (zd.subzone || ''));
          return (zn + '|||' + sz) === stop.key;
        });
      });
      if (zSpawns.length) {
        const cx = zSpawns.reduce((a, s) => a + s.x * SCALE, 0) / zSpawns.length;
        const cy = zSpawns.reduce((a, s) => a + (-s.y * SCALE), 0) / zSpawns.length;
        centers.push({ x: cx, y: cy, n: centers.length + 1, done: stop.done });
      }
    });
    if (centers.length > 1) {
      mctx.save();
      mctx.strokeStyle = 'rgba(0,180,216,0.75)'; mctx.lineWidth = 2;
      mctx.setLineDash([6, 4]);
      mctx.beginPath();
      centers.forEach((c, i) => i === 0 ? mctx.moveTo(c.x, c.y) : mctx.lineTo(c.x, c.y));
      mctx.stroke(); mctx.setLineDash([]); mctx.restore();
    }
    centers.forEach(c => {
      mctx.beginPath(); mctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
      mctx.fillStyle = c.done ? 'rgba(81,207,102,.9)' : 'rgba(0,180,216,.9)';
      mctx.fill();
      mctx.font = 'bold 9px Segoe UI,sans-serif';
      mctx.fillStyle = '#fff'; mctx.textAlign = 'center'; mctx.textBaseline = 'middle';
      mctx.fillText(String(c.n), c.x, c.y);
      mctx.textAlign = 'left'; mctx.textBaseline = 'alphabetic';
    });
  }

  // ── 6. Cabecera de info ──────────────────────────────────────────────
  if (opts.header) {
    const captured = catalog.filter(a => isCap(a.id)).length;
    const dateStr = new Date().toLocaleDateString();
    mctx.fillStyle = 'rgba(13,14,16,.80)';
    mctx.fillRect(0, 0, mapW, 28);
    mctx.font = 'bold 13px Segoe UI,sans-serif'; mctx.fillStyle = '#00e5ff';
    mctx.fillText('ARCHIDEX', 10, 19);
    mctx.font = '11px Segoe UI,sans-serif'; mctx.fillStyle = '#868e96';
    mctx.fillText(`${captured} / ${CFG.total} \xb7 ${dateStr}`, 92, 19);
  }

  // ── 7. Sin panel lateral → solo mapa ─────────────────────────────────────────
  if (!opts.list) {
    const final = document.createElement('canvas');
    final.width = mapW; final.height = mapH;
    final.getContext('2d').drawImage(mc, 0, 0);
    if (opts.legend && opts.spawns) {
      const ctx2 = final.getContext('2d');
      const legLabels = [
        [t('expLegCap'),  '#51cf66'],
        [t('expLegPend'), '#4d9cf7'],
        [t('expLegHunt'), '#fdcb6e'],
      ];
      const top = opts.header ? 36 : 8;
      ctx2.fillStyle = 'rgba(13,14,16,.78)';
      ctx2.beginPath(); ctx2.roundRect(8, top, 138, 16 + legLabels.length * 16, 6); ctx2.fill();
      legLabels.forEach(([label, color], i) => {
        ctx2.beginPath(); ctx2.arc(20, top + 12 + i * 16, 4, 0, Math.PI * 2);
        ctx2.fillStyle = color; ctx2.fill();
        ctx2.font = '11px Segoe UI,sans-serif'; ctx2.fillStyle = '#c9d1d9';
        ctx2.fillText(label, 30, top + 16 + i * 16);
      });
    }
    const a = document.createElement('a');
    a.download = 'mapa-archimonstruos.png'; a.href = final.toDataURL('image/png'); a.click();
    notify(t('notifMapExported'), 'green');
    return;
  }

  // ── 8. Panel lateral de faltantes ─────────────────────────────────────────────
  const missing = catalog.filter(a => !isCap(a.id));
  const COL_W = 270, LH = 13, GH = 19;
  const lng = I18N[S.lang] || I18N.es;
  const sColors = { '50': '#74b9ff', '100': '#55efc4', '150': '#ffeaa7', '190': '#fdcb6e', '1000': '#ff7675', '?': '#868e96' };
  const sNames = { '50': lng.stones[0], '100': lng.stones[1], '150': lng.stones[2], '190': lng.stones[3], '1000': lng.stones[4], '?': '?' };
  const groups = {};
  STONES.forEach(s => { groups[s.max] = []; }); groups['?'] = [];
  missing.forEach(a => { const lv = getArchiLevel(a.id), st = getSoulStone(lv); groups[st ? st.max : '?'].push(a); });

  const listItems = [];
  [...STONES.map(s => s.max), '?'].forEach(key => {
    const group = groups[key]; if (!group?.length) return;
    listItems.push({ h: true, text: `▸ ${t('stoneLabel')} ${sNames[String(key)]} (${group.length})`, color: sColors[String(key)] || '#868e96' });
    group.forEach(a => listItems.push({ h: false, text: `  • ${archiName(a).substring(0, 36)}` }));
  });

  const legLabels = opts.legend
    ? [[t('expLegCap'), '#51cf66'], [t('expLegPend'), '#4d9cf7'], [t('expLegHunt'), '#fdcb6e']]
    : [];
  const LEGEND_H = opts.legend ? 8 + legLabels.length * 14 + 10 : 0;
  const HEADER_H = LEGEND_H + 26;
  const COL_MARGIN = 16;
  const maxH0 = mapH - HEADER_H, maxHN = mapH - COL_MARGIN;
  const columns = [];
  let curCol = [], curH = 0;
  listItems.forEach(item => {
    const ih = item.h ? GH : LH;
    const maxH = columns.length === 0 ? maxH0 : maxHN;
    if (curH + ih > maxH && curCol.length) { columns.push(curCol); curCol = []; curH = 0; }
    curCol.push(item); curH += ih;
  });
  if (curCol.length) columns.push(curCol);

  const numCols = Math.max(1, columns.length);
  const final = document.createElement('canvas');
  final.width = mapW + numCols * COL_W; final.height = mapH;
  const ctx = final.getContext('2d');

  ctx.fillStyle = '#0d0e10'; ctx.fillRect(0, 0, final.width, final.height);
  ctx.drawImage(mc, 0, 0);
  ctx.fillStyle = '#1a1b1f'; ctx.fillRect(mapW, 0, numCols * COL_W, mapH);
  for (let ci = 0; ci < numCols; ci++) {
    const cx = mapW + ci * COL_W;
    ctx.strokeStyle = '#33363f'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx + 0.5, 0); ctx.lineTo(cx + 0.5, mapH); ctx.stroke();
  }

  if (opts.legend) {
    legLabels.forEach(([label, color], i) => {
      ctx.beginPath(); ctx.arc(mapW + 14, 14 + i * 14, 4, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.font = '10px Segoe UI,sans-serif'; ctx.fillStyle = '#868e96';
      ctx.fillText(label, mapW + 22, 18 + i * 14);
    });
  }
  ctx.font = 'bold 13px Segoe UI,sans-serif'; ctx.fillStyle = '#e8ecef';
  ctx.fillText(`${t('expMissing')}: ${missing.length} / ${CFG.total}`, mapW + 10, HEADER_H - 6);

  columns.forEach((col, ci) => {
    const colX = mapW + ci * COL_W;
    let cy = ci === 0 ? HEADER_H + 4 : COL_MARGIN;
    col.forEach(item => {
      if (item.h) {
        ctx.font = 'bold 11px Segoe UI,sans-serif'; ctx.fillStyle = item.color;
        ctx.fillText(item.text, colX + 10, cy); cy += GH;
      } else {
        ctx.font = '10px Segoe UI,sans-serif'; ctx.fillStyle = '#c9d1d9';
        ctx.fillText(item.text, colX + 10, cy); cy += LH;
      }
    });
  });

  const a = document.createElement('a');
  a.download = 'mapa-archimonstruos.png';
  a.href = final.toDataURL('image/png');
  a.click();
  notify(t('notifMapExported'), 'green');
}

'''

new_content = content[:start_idx] + new_functions + content[end_idx:]
open('c:/Users/Aleja/Downloads/mapa-archimonstruos/src/main.js', 'w', encoding='utf-8').write(new_content)
print('Step 2 done')
print(f'Old block length: {end_idx - start_idx} chars')
print(f'New block length: {len(new_functions)} chars')
