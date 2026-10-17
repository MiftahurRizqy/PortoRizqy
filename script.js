'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = 'Menu +'; }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? 'Tutup −' : 'Menu +'; });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
const projects = [...document.querySelectorAll('.project')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
 let count = 0; projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; if (!project.hidden) { count++; project.classList.add('visible'); } });
 document.querySelector('#filter-status').textContent = `${count} proyek ditampilkan.`;
}));
const certificates = [
 ['penghargaan lulusan terbaik non akademik.jpg', 'Lulusan Berprestasi Terbaik Non Akademik'],
 ['medali perak kategori lomba pengembangan aplikasi perangkat lunak.jpg', 'Medali Perak · Pengembangan Aplikasi'],
 ['semifinalist web development proxocoris international.jpg', 'Semifinalist · Proxocoris International'],
 ['sertifikat juara 3 lombo vidio kreatif.jpg', 'Juara 3 · Lomba Video Kreatif'],
 ['sertifikat deep learning.jpg', 'Sertifikasi Deep Learning'],
 ['sertifikat magang aino.jpg', 'Magang · PT Aino Indonesia'],
 ['Sertifikat PKL.jpg', 'Praktik Kerja Lapangan'],
 ['sertifikat mercu buana yogyakarta international youth forum.jpg', 'International Youth Forum · Mercu Buana']
];
const dialog = document.querySelector('#certificate-dialog');
const certificateImage = document.querySelector('#certificate-image');
let lastCertificate;
certificates.forEach(([file, title]) => {
 const button = document.createElement('button'); button.className = 'award'; button.setAttribute('aria-label', `Lihat sertifikat ${title}`);
 const frame = document.createElement('div'); frame.className = 'award-image';
 const image = document.createElement('img'); image.src = file; image.alt = title; image.loading = 'lazy'; image.decoding = 'async'; frame.append(image);
 const heading = document.createElement('h3'); heading.textContent = `${title} ↗`; button.append(frame, heading);
 button.addEventListener('click', () => { lastCertificate = button; certificateImage.src = file; certificateImage.alt = title; document.querySelector('#certificate-title').textContent = title; dialog.showModal(); document.body.style.overflow = 'hidden'; });
 document.querySelector('#awards-grid').append(button);
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; lastCertificate?.focus(); });
document.querySelector('#copy-email').addEventListener('click', async () => {
 const status = document.querySelector('#copy-status');
 try { await navigator.clipboard.writeText('miftrahurrizqy11@gmail.com'); status.textContent = 'Email berhasil disalin. Sampai ketemu di inbox!'; }
 catch { status.textContent = 'Silakan salin alamat email: miftrahurrizqy11@gmail.com'; }
});
function updateTime() { document.querySelector('#local-time').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' WIB'; }
updateTime(); setInterval(updateTime, 60000); document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !reducedMotion.matches) {
 const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .06 });
 document.querySelectorAll('.project, .section-heading, .about-copy, .expertise article, .journey-list article, .research-grid article').forEach(element => { element.classList.add('reveal'); reveal.observe(element); });
}
// A projected 3D torus: real depth, perspective and surface lighting, without a WebGL dependency.
const canvas = document.querySelector('#orbit');
const ctx = canvas.getContext('2d');
const motionButton = document.querySelector('#motion-toggle');
let paused = reducedMotion.matches, visible = true, frame = 0, previous = 0, angle = .35, pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0, width = 0, height = 0;
const points = [];
for (let i = 0; i < 110; i++) for (let j = 0; j < 36; j++) { const u = i / 110 * Math.PI * 2, v = j / 36 * Math.PI * 2; const radius = 1.36 + .49 * Math.cos(v); points.push({ x:radius * Math.cos(u), y:radius * Math.sin(u), z:.49 * Math.sin(v), shade:Math.sin(v), stripe:j % 6 === 0 }); }
function draw() {
 if (!ctx || !width) return;
 ctx.clearRect(0,0,width,height);
 const ax = .87 + smoothY * .35, ay = -.4 + smoothX * .4, az = angle;
 const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay), cc = Math.cos(az), sc = Math.sin(az);
 const scale = Math.min(width, height) * .225;
 const projected = points.map(point => {
  const x1 = point.x * cc - point.y * sc, y1 = point.x * sc + point.y * cc;
  const y2 = y1 * ca - point.z * sa, z2 = y1 * sa + point.z * ca;
  const x3 = x1 * cb + z2 * sb, z3 = -x1 * sb + z2 * cb;
  const perspective = 5 / (5 - z3);
  return { x:width / 2 + x3 * scale * perspective, y:height * .49 + y2 * scale * perspective, z:z3, r:(point.stripe ? 1.45 : 1.05) * perspective, shade:point.shade };
 }).sort((a,b) => a.z - b.z);
 for (const point of projected) { const light = 53 + (point.z + 1.9) * 6; ctx.fillStyle = `hsla(215,95%,${light}%,${.48 + (point.z + 1.9) * .12})`; ctx.beginPath(); ctx.arc(point.x, point.y, point.r, 0, Math.PI*2); ctx.fill(); }
}
function resizeCanvas() { const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height; const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); ctx?.setTransform(ratio,0,0,ratio,0,0); draw(); }
function animate(time) { frame = 0; if (paused || !visible || document.hidden || !ctx) return; const delta = previous ? Math.min(time - previous, 50) : 16; previous = time; angle += delta * .00014; smoothX += (pointerX - smoothX) * .04; smoothY += (pointerY - smoothY) * .04; draw(); frame = requestAnimationFrame(animate); }
function syncAnimation() { cancelAnimationFrame(frame); frame = 0; previous = 0; document.body.classList.toggle('motion-paused', paused); motionButton.setAttribute('aria-pressed', String(paused)); motionButton.setAttribute('aria-label', paused ? 'Putar animasi' : 'Jeda animasi'); motionButton.textContent = paused ? '▶' : 'Ⅱ'; if (!paused && visible && !document.hidden) frame = requestAnimationFrame(animate); else draw(); }
document.querySelector('.hero-stage').addEventListener('pointermove', event => { const bounds = canvas.getBoundingClientRect(); pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1; pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1; document.querySelector('#coord-x').textContent = pointerX.toFixed(2); document.querySelector('#coord-y').textContent = pointerY.toFixed(2); });
document.querySelector('.hero-stage').addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
motionButton.addEventListener('click', () => { paused = !paused; syncAnimation(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; syncAnimation(); });
document.addEventListener('visibilitychange', syncAnimation);
if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncAnimation(); }).observe(canvas);
window.addEventListener('resize', resizeCanvas); resizeCanvas(); syncAnimation();
