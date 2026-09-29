const STATUS_IDLE = 'Select a thumbnail to view.';

// SVGs are rasterized at RASTER_SCALE x their viewBox before drawing, so
// they stay crisp on high-density displays in every browser.
const RASTER_SCALE = 3;

new p5(function (p) {
  let rec = null;
  let currentImg = null;
  let loadToken = 0;

  p.setup = function () {
    const holder = document.getElementById('canvas-holder');
    p.pixelDensity(2);
    p.createCanvas(Math.max(holder.clientWidth, 100), Math.max(holder.clientHeight, 100)).parent(holder);
    p.noLoop();
    p.background(255);

    buildSidebar();
    setStatus(STATUS_IDLE);

    try {
      if (typeof svgkit === 'undefined') throw new Error('p5.svgkit.js did not load');
      rec = svgkit.record(p);
    } catch (err) {
      reportError(err);
    }

    const first = document.querySelector('.thumb');
    if (first) first.click();
  };

  p.draw = function () {
    p.background(255);
    if (currentImg) {
      const s = Math.min(p.width / currentImg.width, p.height / currentImg.height) * 0.92;
      const w = currentImg.width * s;
      const h = currentImg.height * s;
      p.image(currentImg, (p.width - w) / 2, (p.height - h) / 2, w, h);
    }
  };

  p.windowResized = function () {
    const holder = document.getElementById('canvas-holder');
    const w = holder.clientWidth;
    const h = holder.clientHeight;
    if (w > 0 && h > 0 && (w !== p.width || h !== p.height)) {
      p.resizeCanvas(w, h);
      p.redraw();
    }
  };

  /* ---------- sidebar ---------- */

  function buildSidebar() {
    const root = document.getElementById('thumbs');
    if (typeof MANIFEST === 'undefined') {
      reportError(new Error('manifest.js did not load — thumbnails cannot be built'));
      return;
    }

    for (const group of MANIFEST) {
      const groupEl = document.createElement('div');
      groupEl.className = 'group';
      const h2 = document.createElement('h2');
      h2.textContent = group.label;
      groupEl.appendChild(h2);

      if (group.sub) {
        for (const sub of group.sub) {
          const h3 = document.createElement('h3');
          h3.textContent = sub.label;
          groupEl.appendChild(h3);
          groupEl.appendChild(buildGrid(sub));
        }
      } else {
        groupEl.appendChild(buildGrid(group));
      }
      root.appendChild(groupEl);
    }
  }

  function buildGrid(entry) {
    const grid = document.createElement('div');
    grid.className = 'thumb-grid';
    for (const file of entry.files) {
      const item = {
        path: entry.dir + '/' + file,
        label: captionFor(file),
      };
      const fig = document.createElement('figure');
      fig.className = 'thumb';
      const img = document.createElement('img');
      img.src = item.path;
      img.alt = item.label;
      img.loading = 'lazy';
      img.addEventListener('error', () => fig.classList.add('broken'));
      fig.appendChild(img);
      fig.addEventListener('click', () => viewItem(item, fig));
      grid.appendChild(fig);
    }
    return grid;
  }

  function captionFor(name) {
    const base = name.replace(/\.(svg|png|jpe?g)$/i, '');
    const m = base.match(/_(\d+)$/);
    if (m) return m[1];
    return base.replace(/_+/g, ' ').replace(/^截屏/, '');
  }

  /* ---------- viewer ---------- */

  function setRootAttr(text, name, val) {
    const re = new RegExp('\\s' + name + '="[^"]*"');
    if (re.test(text)) return text.replace(re, ' ' + name + '="' + val + '"');
    return text.replace(/<svg/, '<svg ' + name + '="' + val + '"');
  }

  async function loadSvgScaled(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error('HTTP ' + res.status + ' \u2014 ' + path);
    let text = await res.text();
    const m = text.match(/viewBox="[\d.eE+-]+\s+[\d.eE+-]+\s+([\d.eE+-]+)\s+([\d.eE+-]+)"/);
    if (!m) throw new Error('no viewBox in ' + path);
    text = setRootAttr(text, 'width', parseFloat(m[1]) * RASTER_SCALE);
    text = setRootAttr(text, 'height', parseFloat(m[2]) * RASTER_SCALE);
    const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
    const img = await p.loadImage(url);
    if (rec) rec.registerSvgImage(img, text);
    return img;
  }

  async function viewItem(item, el) {
    document.querySelectorAll('.thumb.active').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    setStatus('Loading ' + item.path + ' \u2026');

    const isSvg = item.path.toLowerCase().endsWith('.svg');
    if (isSvg && !rec) {
      setStatus('ERROR: svgkit unavailable, cannot display ' + item.path);
      return;
    }

    const token = ++loadToken;
    try {
      const img = isSvg ? await loadSvgScaled(item.path) : await p.loadImage(item.path);
      if (token !== loadToken) return;
      currentImg = img;
      setStatus(item.path);
      p.redraw();
    } catch (err) {
      if (token !== loadToken) return;
      currentImg = null;
      setStatus('ERROR loading ' + item.path + ' \u2014 ' + (err && err.message ? err.message : err));
      p.redraw();
    }
  }

  function setStatus(text) {
    document.getElementById('status').textContent = text;
  }

  function reportError(err) {
    setStatus('ERROR: ' + (err && err.message ? err.message : err));
    console.error(err);
  }
});
