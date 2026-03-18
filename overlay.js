const coverEl   = document.getElementById('cover');
const titleBox  = document.getElementById('title');
const artistBox = document.getElementById('artist');

let lastTitle = '';
let lastArtist = '';
let animTitle = null;
let animArtist = null;

/* загрузка txt */
async function loadText(file) {
  try {
    const r = await fetch(file + '?_=' + Date.now());
    return r.ok ? (await r.text()).trim() : '';
  } catch {
    return '';
  }
}

/* настоящий marquee как в оригинале */
function setMarquee(box, text, state) {
  box.innerHTML = '';
  if (state.anim) cancelAnimationFrame(state.anim);

  const span = document.createElement('span');
  span.textContent = text;
  box.appendChild(span);

  requestAnimationFrame(() => {
    const textW = span.offsetWidth;
    const boxW  = box.offsetWidth;

    if (textW <= boxW) return;

    const track = document.createElement('div');
    track.className = 'track';

    const s1 = document.createElement('span');
    const s2 = document.createElement('span');
    s1.textContent = text;
    s2.textContent = text;

    track.appendChild(s1);
    track.appendChild(s2);
    box.innerHTML = '';
    box.appendChild(track);

    let x = 0;
    const speed = 0.6; // скорость прокрутки

    function animate() {
      x -= speed;
      if (-x >= textW + 60) x = 0;
      track.style.transform = `translateX(${x}px)`;
      state.anim = requestAnimationFrame(animate);
    }
    animate();
  });
}

/* обновление */
async function update() {
  const title  = await loadText('title.txt');
  const artist = await loadText('artist.txt');

  if (title === lastTitle && artist === lastArtist) return;

  setMarquee(titleBox, title || '—',  { anim: animTitle  });
  setMarquee(artistBox, artist || '—', { anim: animArtist });

  titleBox.classList.add('fade');
  artistBox.classList.add('fade');
  setTimeout(() => {
    titleBox.classList.remove('fade');
    artistBox.classList.remove('fade');
  }, 350);

  coverEl.classList.add('flip');
  setTimeout(() => {
    coverEl.style.backgroundImage = `url('cover.png?_=${Date.now()}')`;
    coverEl.classList.remove('flip');
  }, 400);

  lastTitle = title;
  lastArtist = artist;
}

/* старт */
update();
setInterval(update, 2000);