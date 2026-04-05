/**
 * Zuyderland Kunstpanel – Carousel met swipe
 */

// === Data ===
const ARTWORKS = [
  {
    id: 1,
    title: "Downtime",
    artist: "Bas Coenegracht",
    role: "Schilder",
    vision: "Even de wereld op pauze. Geen piepers, geen drukte, alleen jij en de natuur.",
    content: "Kijk eens naar die figuur in zijn hoodie. Hij zit daar midden in de nacht, een stok in het water te steken. Wat doet hij? Misschien telt hij de rimpelingen, of misschien droomt hij even weg. Bas Coenegracht heeft dit moment van absolute rust perfect gevangen op het doek. Geen felle kleuren, maar een sfeer waarin je bijna de stilte kunt horen. Het is die zeldzame 'downtime' die we op een drukke afdeling soms zo hard nodig hebben om weer even op te laden.",
    colleagueQuote: "Anouk (Verpleegkundige): 'Als ik langs dit werk loop, adem ik onbewust altijd even diep in en uit. Het herinnert me eraan dat het oké is om soms even stil te staan.'",
    fact: "Wist je dat Bas de schetsen voor zijn werken vaak 's nachts maakt, wanneer de stad eindelijk stil wordt?",
    image: "assets/Kunst-Downtime-2.jpg",
    avatar: "assets/Docent-Bas-Coenegracht-2021-400x400.jpg",
    votes: 45
  },
  {
    id: 2,
    title: "Jesse en Habib",
    artist: "Nico Bastens",
    role: "Fotograaf",
    vision: "Een tikkeltje vreemd, maar vooral ontzettend warm. Echte vriendschap kent geen grenzen.",
    content: "Een man met een baard en een eend die gezellig samen bij de kachel zitten; je verzint het niet. Dit is het verhaal van Jesse en zijn eend Habib. Fotograaf Nico Bastens legde hun bijzondere band vast in een verweerd interieur dat nog ruikt naar de oude mijnstreek. Het is een serie over onvoorwaardelijke liefde en troost op de meest onverwachte plekken. Habib eet gewoon met de pot mee en wijkt nooit van Jesse's zijde. Het doet je glimlachen, maar raakt je ook diep in je hart.",
    colleagueQuote: "Mark (Arts): 'Elke keer als ik Habib zie, moet ik grijnzen. Het haalt de spanning van een zware dag er even af. Humor is hier op de afdeling ons geheime medicijn.'",
    fact: "Habib is door Jesse met de hand grootgebracht en heeft nog nooit een stap buiten de deur gezet. Hij vindt de bank veel lekkerder liggen.",
    images: [
      "assets/Nico-Bastens-01_web.jpg",
      "assets/fotos-Nico-Bastens_web.jpg",
      "assets/Nico-Bastens-03_web.jpg"
    ],
    image: "assets/Nico-Bastens-01_web.jpg",
    avatar: "assets/67c19c1c42075_Profielfoto_Nico.jpg",
    votes: 32
  },
  {
    id: 3,
    title: "New Faces",
    artist: "Sophie Langohr",
    role: "Fotograaf",
    vision: "Wat is schoonheid eigenlijk? Een eeuwenoude Maria of een modern model uit de Vogue?",
    content: "Leg een eeuwenoud Mariabeeld eens naast een modern model uit een modetijdschrift. Wat zie je dan? Sophie Langohr deed het en de gelijkenis is verbijsterend. Dezelfde blik, dezelfde kwetsbaarheid. Ze laat ons zien dat schoonheid van alle tijden is, maar ook hoe vergankelijk we zijn. In het ziekenhuis zien we elke dag gezichten die getekend zijn door het leven. Sophie viert die menselijke kant — van rimpels tot perfecte make-up — en stelt ons de vraag: waar kijken we nu écht naar?",
    colleagueQuote: "Ellen (Vrijwilliger): 'Ik vind die dubbele beelden fascinerend. Het laat me anders kijken naar de mensen die hier binnenkomen; iedereen heeft een verhaal dat achter hun gezicht schuilgaat.'",
    fact: "Sophie struint urenlang door glossy magazines om exact de juiste gelaatsuitdrukking te vinden die matcht met een antiek beeld.",
    image: "assets/4_SophieLangohr_Faces_Pivovarova_Armani_web.jpg",
    avatar: "assets/sophie-langohr-photo3-patricia-mathieu-e1464163667342.jpg",
    votes: 23
  }
];

// === SVG Icon Templates ===
const icons = {
  headphones: '<svg viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
};

// === State ===
let currentSlide = 0;
let votedId = null;
let listeningId = null;
let progress = 0;
let showFactId = null;
let progressInterval = null;
let imageIndices = {}; // tracks current photo index for multi-image artworks

// === DOM refs ===
let track, dots, counter, prevBtn, nextBtn;

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  track = document.getElementById('carousel-track');
  dots = document.getElementById('carousel-dots');
  counter = document.getElementById('carousel-counter');
  prevBtn = document.getElementById('carousel-prev');
  nextBtn = document.getElementById('carousel-next');

  renderSlides();
  renderDots();
  updateCarousel();
  initSwipe();

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });
});

// === Carousel Navigation ===
function goToSlide(index) {
  if (index < 0 || index >= ARTWORKS.length) return;
  // Stop speech when navigating away
  if (listeningId !== null) {
    speechSynthesis.cancel();
    clearInterval(progressInterval);
    progressInterval = null;
    listeningId = null;
    progress = 0;
    updateAudioUI();
  }
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  // Arrows
  prevBtn.classList.toggle('hidden', currentSlide === 0);
  nextBtn.classList.toggle('hidden', currentSlide === ARTWORKS.length - 1);

  // Counter
  counter.textContent = `${currentSlide + 1} / ${ARTWORKS.length}`;
}

// === Touch / Swipe ===
function initSwipe() {
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let isDragging = false;
  let isHorizontalSwipe = null;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    deltaX = 0;
    isDragging = true;
    isHorizontalSwipe = null;
    track.classList.add('dragging');
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe === null && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
      isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }

    if (isHorizontalSwipe) {
      // Add resistance at edges
      let resistance = 1;
      if ((currentSlide === 0 && deltaX > 0) || (currentSlide === ARTWORKS.length - 1 && deltaX < 0)) {
        resistance = 0.3;
      }
      const offset = -(currentSlide * track.offsetWidth) + deltaX * resistance;
      track.style.transform = `translateX(${offset}px)`;
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');

    const threshold = track.offsetWidth * 0.2;
    if (isHorizontalSwipe) {
      if (deltaX < -threshold) {
        goToSlide(currentSlide + 1);
      } else if (deltaX > threshold) {
        goToSlide(currentSlide - 1);
      } else {
        updateCarousel(); // snap back
      }
    }
  }, { passive: true });

  // Mouse drag for desktop
  let mouseStartX = 0;
  let mouseDeltaX = 0;
  let mouseDown = false;

  track.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseDeltaX = 0;
    mouseDown = true;
    track.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    mouseDeltaX = e.clientX - mouseStartX;
    let resistance = 1;
    if ((currentSlide === 0 && mouseDeltaX > 0) || (currentSlide === ARTWORKS.length - 1 && mouseDeltaX < 0)) {
      resistance = 0.3;
    }
    const offset = -(currentSlide * track.offsetWidth) + mouseDeltaX * resistance;
    track.style.transform = `translateX(${offset}px)`;
  });

  document.addEventListener('mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    track.classList.remove('dragging');

    const threshold = track.offsetWidth * 0.15;
    if (mouseDeltaX < -threshold) {
      goToSlide(currentSlide + 1);
    } else if (mouseDeltaX > threshold) {
      goToSlide(currentSlide - 1);
    } else {
      updateCarousel();
    }
  });
}

// === Render Slides ===
function renderSlides() {
  track.innerHTML = '';

  ARTWORKS.forEach(work => {
    const card = document.createElement('div');
    card.className = 'art-card' + (votedId === work.id ? ' voted' : '');
    card.id = `card-${work.id}`;

    card.innerHTML = `
      <!-- Artwork Image -->
      <div class="card-image-wrapper" onclick="openLightbox(${work.id})">
        <img src="${escapeAttr(work.images ? work.images[imageIndices[work.id] || 0] : work.image)}" alt="${escapeAttr(work.title)}" referrerpolicy="no-referrer" draggable="false" id="card-img-${work.id}">
        <div class="card-image-overlay">
          <span class="overlay-title">${escapeHtml(work.title)}</span>
        </div>
        ${work.images ? `<div class="image-dots">${work.images.map((_, i) => `<button class="image-dot${i === (imageIndices[work.id] || 0) ? ' active' : ''}" onclick="event.stopPropagation(); cycleImage(${work.id}, ${i})" aria-label="Foto ${i + 1}"></button>`).join('')}</div>` : ''}
      </div>

      <!-- Card Content -->
      <div class="card-content">
        <!-- Artist Profile -->
        <div class="artist-profile">
          <img src="${escapeAttr(work.avatar)}" alt="${escapeAttr(work.artist)}" class="artist-avatar" referrerpolicy="no-referrer" draggable="false">
          <div>
            <div class="artist-name">${escapeHtml(work.artist)}</div>
            <div class="artist-role">${escapeHtml(work.role || 'Kunstenaar')}</div>
          </div>
        </div>

        <p class="card-vision">"${escapeHtml(work.vision)}"</p>

        <div class="card-description">
          <p>${escapeHtml(work.content)}</p>
        </div>

        ${work.colleagueQuote ? `<div class="colleague-quote"><p>${escapeHtml(work.colleagueQuote)}</p></div>` : ''}

        <!-- Actions: Listen + Fact side by side -->
        <div class="card-actions">
          <div class="audio-section">
            <button class="btn-listen ${listeningId === work.id ? 'active' : ''}" onclick="handleListen(${work.id})">
              <span class="icon icon-lg">${icons.headphones}</span>
              ${listeningId === work.id ? 'Luisteren...' : 'Beluister verhaal'}
            </button>
            <div class="audio-progress ${listeningId === work.id ? 'visible' : ''}" id="progress-${work.id}">
              <div class="progress-bar-track">
                <div class="progress-bar-fill" id="progress-fill-${work.id}" style="width: ${listeningId === work.id ? progress + '%' : '0%'}"></div>
              </div>
              <div class="progress-labels"><span>0:00</span><span>--:--</span></div>
            </div>
          </div>

          <div class="fact-section">
            <button class="btn-fact ${showFactId === work.id ? 'open' : ''}" onclick="toggleFact(${work.id})">
              <span class="icon icon-chevron">${icons.chevronDown}</span>
              Wist je dat?
            </button>
            <div class="fact-content ${showFactId === work.id ? 'visible' : ''}" id="fact-${work.id}">
              <div class="fact-text">${escapeHtml(work.fact)}</div>
            </div>
          </div>
        </div>

        <!-- Vote Section -->
        <div class="vote-section" id="vote-section-${work.id}">
          ${renderVoteSection(work)}
        </div>
      </div>
    `;

    track.appendChild(card);
  });

  // Animate vote fills
  if (votedId !== null) {
    requestAnimationFrame(() => {
      const votedWork = ARTWORKS.find(w => w.id === votedId);
      if (votedWork) {
        const fill = document.getElementById(`vote-fill-${votedWork.id}`);
        if (fill) fill.style.width = votedWork.votes + '%';
      }
    });
  }
}

function renderDots() {
  dots.innerHTML = '';
  ARTWORKS.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', `Ga naar werk ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
  });
}

function renderVoteSection(work) {
  if (votedId === work.id) {
    return `
      <div class="vote-confirmation">
        <div class="vote-thanks">
          <span class="icon icon-lg">${icons.checkCircle}</span>
          Bedankt voor je stem!
        </div>
        <div class="vote-stats-label">
          <span>Huidige Stand</span>
          <span>${work.votes}%</span>
        </div>
        <div class="vote-bar-track">
          <div class="vote-bar-fill" id="vote-fill-${work.id}" style="width: 0%"></div>
        </div>
      </div>
    `;
  }

  return `
    <button class="btn-vote ${votedId !== null ? 'disabled' : ''}"
            onclick="handleVote(${work.id})"
            ${votedId !== null ? 'disabled' : ''}>
      Stem Nu
    </button>
  `;
}

// === Event Handlers ===
function handleVote(id) {
  if (votedId !== null) return;
  votedId = id;

  const card = document.getElementById(`card-${id}`);
  card.classList.add('voted');

  ARTWORKS.forEach(work => {
    const section = document.getElementById(`vote-section-${work.id}`);
    section.innerHTML = renderVoteSection(work);
  });

  requestAnimationFrame(() => {
    setTimeout(() => {
      const fill = document.getElementById(`vote-fill-${id}`);
      if (fill) {
        const work = ARTWORKS.find(w => w.id === id);
        fill.style.width = work.votes + '%';
      }
    }, 50);
  });
}

function handleListen(id) {
  // Stop current speech if clicking the same artwork
  if (listeningId === id) {
    speechSynthesis.cancel();
    listeningId = null;
    progress = 0;
    clearInterval(progressInterval);
    progressInterval = null;
    updateAudioUI();
    return;
  }

  // Stop any previous speech
  speechSynthesis.cancel();
  if (progressInterval) clearInterval(progressInterval);

  const work = ARTWORKS.find(w => w.id === id);
  if (!work) return;

  listeningId = id;
  progress = 0;
  updateAudioUI();

  // Build speech text
  const speechText = `${work.title}, door ${work.artist}. ${work.vision} ${work.content}${work.colleagueQuote ? ' ' + work.colleagueQuote : ''}`;
  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.lang = 'nl-NL';
  utterance.rate = 0.95;

  // Estimate duration (~140 words per minute for nl)
  const wordCount = speechText.split(/\s+/).length;
  const estimatedSeconds = Math.max(10, Math.round(wordCount / 2.3));

  progressInterval = setInterval(() => {
    progress += (100 / estimatedSeconds);
    if (progress >= 100) progress = 100;
    const fill = document.getElementById(`progress-fill-${id}`);
    if (fill) fill.style.width = progress + '%';

    // Update time labels
    const elapsed = Math.round((progress / 100) * estimatedSeconds);
    const remaining = estimatedSeconds - elapsed;
    const labels = document.querySelector(`#progress-${id} .progress-labels`);
    if (labels) {
      labels.innerHTML = `<span>${formatTime(elapsed)}</span><span>${formatTime(remaining)}</span>`;
    }
  }, 1000);

  utterance.onend = () => {
    progress = 100;
    clearInterval(progressInterval);
    progressInterval = null;
    const fill = document.getElementById(`progress-fill-${id}`);
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      listeningId = null;
      progress = 0;
      updateAudioUI();
    }, 800);
  };

  utterance.onerror = () => {
    clearInterval(progressInterval);
    progressInterval = null;
    listeningId = null;
    progress = 0;
    updateAudioUI();
  };

  speechSynthesis.speak(utterance);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function updateAudioUI() {
  ARTWORKS.forEach(work => {
    const btn = document.querySelector(`#card-${work.id} .btn-listen`);
    const progressEl = document.getElementById(`progress-${work.id}`);
    const fill = document.getElementById(`progress-fill-${work.id}`);
    if (!btn) return;

    if (listeningId === work.id) {
      btn.classList.add('active');
      btn.innerHTML = `<span class="icon icon-lg">${icons.headphones}</span> Luisteren...`;
      progressEl.classList.add('visible');
      fill.style.width = progress + '%';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = `<span class="icon icon-lg">${icons.headphones}</span> Beluister verhaal`;
      progressEl.classList.remove('visible');
      fill.style.width = '0%';
    }
  });
}

function toggleFact(id) {
  showFactId = showFactId === id ? null : id;

  ARTWORKS.forEach(work => {
    const btn = document.querySelector(`#card-${work.id} .btn-fact`);
    const content = document.getElementById(`fact-${work.id}`);
    if (!btn) return;

    if (showFactId === work.id) {
      btn.classList.add('open');
      content.classList.add('visible');
    } else {
      btn.classList.remove('open');
      content.classList.remove('visible');
    }
  });
}

// === Lightbox ===
let lightboxWorkId = null;
let lightboxIndex = 0;

function openLightbox(workId) {
  const work = ARTWORKS.find(w => w.id === workId);
  if (!work) return;
  lightboxWorkId = workId;
  const imgs = work.images || [work.image];
  lightboxIndex = work.images ? (imageIndices[workId] || 0) : 0;

  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = imgs[lightboxIndex];
  img.alt = work.title;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  updateLightboxControls(imgs);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  lightboxWorkId = null;
}

function lightboxGo(index) {
  const work = ARTWORKS.find(w => w.id === lightboxWorkId);
  if (!work) return;
  const imgs = work.images || [work.image];
  if (index < 0 || index >= imgs.length) return;
  lightboxIndex = index;
  const img = document.getElementById('lightbox-img');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = imgs[lightboxIndex];
    img.style.opacity = '1';
  }, 200);
  updateLightboxControls(imgs);
}

function updateLightboxControls(imgs) {
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');
  const dotsEl = document.getElementById('lightbox-dots');

  if (imgs.length <= 1) {
    prev.classList.add('hidden');
    next.classList.add('hidden');
    dotsEl.innerHTML = '';
  } else {
    prev.classList.toggle('hidden', lightboxIndex === 0);
    next.classList.toggle('hidden', lightboxIndex === imgs.length - 1);
    dotsEl.innerHTML = imgs.map((_, i) =>
      `<button class="${i === lightboxIndex ? 'active' : ''}" onclick="lightboxGo(${i})" aria-label="Foto ${i + 1}"></button>`
    ).join('');
  }
}

// Init lightbox listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => lightboxGo(lightboxIndex - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => lightboxGo(lightboxIndex + 1));
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxGo(lightboxIndex - 1);
    if (e.key === 'ArrowRight') lightboxGo(lightboxIndex + 1);
  });
});

// === Image cycling for multi-photo artworks ===
function cycleImage(workId, index) {
  const work = ARTWORKS.find(w => w.id === workId);
  if (!work || !work.images) return;
  imageIndices[workId] = index;

  // Update image with fade
  const img = document.getElementById(`card-img-${workId}`);
  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = work.images[index];
      img.style.opacity = '1';
    }, 200);
  }

  // Update dots
  const card = document.getElementById(`card-${workId}`);
  if (card) {
    card.querySelectorAll('.image-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

// === Utility ===
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
