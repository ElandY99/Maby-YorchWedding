/* ============================================================
   Wedding Invitation — Main JavaScript
   Particle animation, music controller, theme toggle, AOS init
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------------
  // 1. Initialize Lucide icons & AOS
  // ----------------------------------------------------------------
  lucide.createIcons();

  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  // ----------------------------------------------------------------
  // 2. Theme Toggle
  // ----------------------------------------------------------------
  const body = document.body;
  const themeBtn = document.getElementById('theme-toggle-btn');
  const STORAGE_KEY_THEME = 'wedding-theme';

  function applyTheme(isLight) {
    if (isLight) {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
    // Re-render Lucide icons to pick up any class changes
    updateThemeIcon(isLight);
  }

  function updateThemeIcon(isLight) {
    themeBtn.innerHTML = '';
    const iconEl = document.createElement('i');
    iconEl.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    themeBtn.appendChild(iconEl);
    lucide.createIcons({ nodes: [themeBtn] });
  }

  // Restore saved preference
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
  if (savedTheme === 'light') {
    applyTheme(true);
  }

  themeBtn.addEventListener('click', function () {
    const isCurrentlyLight = body.classList.contains('light-theme');
    const newIsLight = !isCurrentlyLight;
    applyTheme(newIsLight);
    localStorage.setItem(STORAGE_KEY_THEME, newIsLight ? 'light' : 'dark');
  });

  // ----------------------------------------------------------------
  // 3. Background Music Controller
  // ----------------------------------------------------------------
  const musicBtn = document.getElementById('music-toggle-btn');
  const audio = new Audio('assets/music/wedding.mp3');
  audio.loop = true;
  audio.volume = 0.4;
  audio.preload = 'auto';

  let isPlaying = false;

  function setMusicIcon(playing) {
    musicBtn.innerHTML = '';
    const iconEl = document.createElement('i');
    iconEl.setAttribute('data-lucide', playing ? 'volume-2' : 'volume-x');
    iconEl.id = 'music-icon';
    musicBtn.appendChild(iconEl);
    lucide.createIcons({ nodes: [musicBtn] });
    musicBtn.classList.toggle('music-playing', playing);
  }

  function playMusic() {
    return audio.play().then(() => {
      isPlaying = true;
      setMusicIcon(true);
      return true;
    }).catch(() => {
      isPlaying = false;
      setMusicIcon(false);
      return false;
    });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    setMusicIcon(false);
  }

  // Intento de autoplay (funciona en PC; en móvil suele ser bloqueado)
  playMusic();

  // Reintentar con el primer gesto REAL del usuario, sin quitar
  // los listeners hasta que el play tenga éxito.
  const interactionEvents = ['click', 'touchend', 'keydown'];

  function onFirstInteraction() {
    if (isPlaying) {
      removeInteractionListeners();
      return;
    }
    playMusic().then((success) => {
      if (success) {
        removeInteractionListeners();
      }
    });
  }

  function removeInteractionListeners() {
    interactionEvents.forEach((evt) =>
      document.removeEventListener(evt, onFirstInteraction)
    );
  }

  interactionEvents.forEach((evt) =>
    document.addEventListener(evt, onFirstInteraction, { passive: true })
  );

  // ----------------------------------------------------------------
  // Botón de música
  // ----------------------------------------------------------------
  function handleButtonToggle(e) {
    e.stopPropagation();
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
    // Si el usuario usa el botón, ya no hace falta seguir escuchando
    removeInteractionListeners();
  }

  // Evita que el toque del botón dispare el "first interaction" del documento
  ['touchstart', 'touchend'].forEach((evt) =>
    musicBtn.addEventListener(evt, (e) => e.stopPropagation(), { passive: true })
  );

  musicBtn.addEventListener('click', handleButtonToggle);

  // ----------------------------------------------------------------
  // 4. Scroll Indicator
  // ----------------------------------------------------------------
  var scrollIndicator = document.getElementById('scroll-indicator');
  scrollIndicator.addEventListener('click', function () {
    document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
  });
  scrollIndicator.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ----------------------------------------------------------------
  // 5. Canvas Particle Animation (Hearts + Petals)
  // ----------------------------------------------------------------
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let isHeroVisible = true;

  function resizeCanvas() {
    const hero = document.getElementById('hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Read colors from CSS custom properties
  function getColor(prop) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
  }

  // Particle class
  function Particle(type) {
    this.type = type; // 'heart' or 'petal'
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * canvas.width;
    this.y = -20 - Math.random() * canvas.height * 0.5;
    this.size = this.type === 'heart'
      ? 6 + Math.random() * 10
      : 4 + Math.random() * 8;
    this.speedY = 0.3 + Math.random() * 0.8;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.swayAmplitude = 15 + Math.random() * 25;
    this.swaySpeed = 0.008 + Math.random() * 0.012;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.opacity = 0.15 + Math.random() * 0.35;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.015;
    this.time = 0;
  };

  Particle.prototype.update = function () {
    this.time += 1;
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.time * this.swaySpeed + this.swayOffset) * 0.4;
    this.rotation += this.rotationSpeed;

    if (this.y > canvas.height + 30) {
      this.reset();
    }
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'heart') {
      this.drawHeart();
    } else {
      this.drawPetal();
    }

    ctx.restore();
  };

  Particle.prototype.drawHeart = function () {
    var s = this.size;
    ctx.fillStyle = getColor('--heart-color');
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.1, 0, s);
    ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.2, 0, s * 0.35);
    ctx.closePath();
    ctx.fill();
  };

  Particle.prototype.drawPetal = function () {
    var s = this.size;
    ctx.fillStyle = getColor('--petal-color');
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.4, s, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };

  // Create particles — mix of hearts and petals
  var PARTICLE_COUNT = 35;
  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var type = Math.random() < 0.45 ? 'heart' : 'petal';
      var p = new Particle(type);
      // Spread initial Y positions so they don't all start at the top
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }
  }

  initParticles();

  function animateParticles() {
    if (!isHeroVisible) {
      animationId = requestAnimationFrame(animateParticles);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationId = requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Pause animation when hero is off-screen
  if ('IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });

    heroObserver.observe(document.getElementById('hero'));
  }

  // ----------------------------------------------------------------
  // Tengwar → Serif Transcription Animation (reusable)
  // ----------------------------------------------------------------
  function initTranscriptionAnimation(target, options) {
    options = options || {};

    var el = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!el) return null;

    var config = {
      baseDelay: options.baseDelay || 30,        // ms entre cada carácter
      scatter: options.scatter || 40,            // aleatoriedad extra por carácter
      startDelay: options.startDelay || 600,     // delay antes de arrancar tras hacerse visible
      fallbackDelay: options.fallbackDelay || 1500, // delay si no hay IntersectionObserver
      cleanupPadding: options.cleanupPadding || 600, // margen extra al remover la clase 'transcribing'
      threshold: options.threshold != null ? options.threshold : 0.3,
      transcribingClass: options.transcribingClass || 'transcribing',
      transcribedClass: options.transcribedClass || 'transcribed',
      charClass: options.charClass || 'char',
    };

    // Normaliza el texto: trim y colapsa espacios de la indentación del HTML
    var originalText = el.textContent
      .replace(/\s+/g, ' ')
      .trim();

    el.innerHTML = '';
    el.classList.add(config.transcribingClass);

    var charSpans = [];
    for (var ci = 0; ci < originalText.length; ci++) {
      var span = document.createElement('span');
      span.classList.add(config.charClass);
      span.textContent = originalText[ci] === ' ' ? ' ' : originalText[ci];
      charSpans.push(span);
      el.appendChild(span);
    }

    var transcriptionStarted = false;

    function startTranscription() {
      if (transcriptionStarted) return;
      transcriptionStarted = true;

      // Lock the element's height to its current (tengwar) size to prevent reflow
      var tengwarHeight = el.offsetHeight;
      el.style.height = tengwarHeight + 'px';
      el.style.overflow = 'hidden';

      var totalChars = charSpans.length;

      charSpans.forEach(function (span, index) {
        setTimeout(function () {
          span.classList.add(config.transcribedClass);
        }, index * config.baseDelay + Math.random() * config.scatter);
      });

      setTimeout(function () {
        el.classList.remove(config.transcribingClass);

        // Smoothly transition to the natural (serif) height
        var naturalHeight = el.scrollHeight;
        el.style.transition = 'height 0.6s ease';
        el.style.height = naturalHeight + 'px';

        // After the height transition, remove inline styles
        setTimeout(function () {
          el.style.height = '';
          el.style.overflow = '';
          el.style.transition = '';
        }, 650);

        if (typeof options.onComplete === 'function') {
          options.onComplete(el);
        }
      }, totalChars * config.baseDelay + config.cleanupPadding);
    }

    // Dispara la animación cuando el elemento entra en el viewport
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(startTranscription, config.startDelay);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: config.threshold });

      observer.observe(el);
    } else {
      setTimeout(startTranscription, config.fallbackDelay);
    }

    // API pública por si querés controlarlo manualmente
    return {
      start: startTranscription,
      element: el,
      chars: charSpans,
    };
  }

  var el = document.querySelectorAll('.message-text');
  el.forEach(e => {
    initTranscriptionAnimation(e, {
      baseDelay: 50,
      startDelay: 500
    });
  });

  // ----------------------------------------------------------------
  // 6. Attendance Confirmation (RSVP) Controller
  // ----------------------------------------------------------------
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtTEWsDoI0nelF9RLHX0486ih0gArIEfBGfJRZnAV2amWukpXWZH0V4_7Ol0z9aXDuxw/exec';
  const STORAGE_KEY_CODE = 'invitation_code';

  const rsvpSection = document.getElementById('rsvp');
  const rsvpCard = document.getElementById('rsvp-card');

  // Resolve invitation code from URL or session storage
  const urlParams = new URLSearchParams(window.location.search);
  let invitationCode = urlParams.get('code');

  if (invitationCode) {
    invitationCode = invitationCode.trim();
    try {
      sessionStorage.setItem(STORAGE_KEY_CODE, invitationCode);
    } catch (_) {
      // Ignore storage errors in restricted iframe/browser modes
    }
  } else {
    try {
      invitationCode = (sessionStorage.getItem(STORAGE_KEY_CODE) || '').trim();
    } catch (_) {
      invitationCode = '';
    }
  }

  // If no invitation code is provided, keep the RSVP section completely hidden
  if (!invitationCode) {
    if (rsvpSection) {
      rsvpSection.classList.add('rsvp-hidden');
    }
    return;
  }

  // Reveal RSVP section for invited guests
  if (rsvpSection) {
    rsvpSection.classList.remove('rsvp-hidden');
  }

  if (!rsvpCard) return;

  // View Elements
  const guestNameEl = document.getElementById('rsvp-guest-name');
  const quotaTextEl = document.getElementById('rsvp-quota-text');
  const statusBadgeEl = document.getElementById('rsvp-status-badge');
  const statusTextEl = document.getElementById('rsvp-status-text');
  const alreadyConfirmedBanner = document.getElementById('rsvp-already-confirmed-banner');
  const alreadyConfirmedText = document.getElementById('rsvp-already-confirmed-text');

  // Form Elements
  const rsvpForm = document.getElementById('rsvp-form');
  const minusBtn = document.getElementById('rsvp-minus-btn');
  const plusBtn = document.getElementById('rsvp-plus-btn');
  const cantidadInput = document.getElementById('rsvp-cantidad');
  const countUnitEl = document.getElementById('rsvp-count-unit');
  const maxHelperEl = document.getElementById('rsvp-max-helper');
  const stepperHelperEl = document.getElementById('rsvp-stepper-helper');
  const notaInput = document.getElementById('rsvp-nota');
  const charCountEl = document.getElementById('rsvp-char-count');
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const submitTextEl = document.getElementById('rsvp-submit-text');
  const formFeedbackEl = document.getElementById('rsvp-form-feedback');

  // Actions & Other Views
  const retryBtn = document.getElementById('rsvp-retry-btn');
  const editBtn = document.getElementById('rsvp-edit-btn');
  const errorTextEl = document.getElementById('rsvp-error-text');
  const successTitleEl = document.getElementById('rsvp-success-title');
  const successDescEl = document.getElementById('rsvp-success-desc');
  const successSummaryEl = document.getElementById('rsvp-success-summary');

  let invitationData = null;
  let currentAttendees = 1;
  let maxQuota = 1;

  function setRsvpState(state) {
    rsvpCard.setAttribute('data-state', state);
    lucide.createIcons({ nodes: [rsvpCard] });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function updateStepperUI() {
    cantidadInput.value = currentAttendees;
    countUnitEl.textContent = currentAttendees === 1 ? 'persona' : 'personas';
    minusBtn.disabled = currentAttendees <= 0;
    plusBtn.disabled = currentAttendees >= maxQuota;

    if (currentAttendees === 0) {
      stepperHelperEl.innerHTML = '<strong>Registrarás que no podrán asistir.</strong> Podés cambiarlo si lo deseás.';
    } else {
      stepperHelperEl.innerHTML = `Podés confirmar entre 0 y <strong>${maxQuota}</strong> asistentes. (0 indica que no podrán asistir).`;
    }
  }

  function applyGuestData(data) {
    invitationData = data;
    maxQuota = Number.isInteger(Number(data.cupo)) ? Math.max(0, Number(data.cupo)) : 1;

    guestNameEl.textContent = data.nombre || 'Invitado/a Especial';
    quotaTextEl.textContent = `Cupo: ${maxQuota} ${maxQuota === 1 ? 'persona' : 'personas'}`;
    maxHelperEl.textContent = maxQuota;

    statusBadgeEl.classList.remove('confirmed', 'declined', 'pending');

    const isConfirmed = String(data.confirmado || '').trim().toUpperCase() === 'SI';
    const savedQty = Number(data.cantidad);

    if (isConfirmed && Number.isInteger(savedQty)) {
      if (savedQty > 0) {
        statusBadgeEl.classList.add('confirmed');
        statusTextEl.textContent = `Confirmado (${savedQty})`;
        alreadyConfirmedText.textContent = `Ya confirmaste asistencia para ${savedQty} ${savedQty === 1 ? 'persona' : 'personas'}. Podés actualizar tu respuesta abajo si hubo algún cambio.`;
        alreadyConfirmedBanner.style.display = 'flex';
        currentAttendees = Math.min(savedQty, maxQuota);
      } else {
        statusBadgeEl.classList.add('declined');
        statusTextEl.textContent = 'No asistirá';
        alreadyConfirmedText.textContent = 'Registraste anteriormente que no podrás asistir. Podés cambiarlo a continuación si ahora podés venir.';
        alreadyConfirmedBanner.style.display = 'flex';
        currentAttendees = 0;
      }
      submitTextEl.textContent = 'Actualizar confirmación';
    } else {
      statusBadgeEl.classList.add('pending');
      statusTextEl.textContent = 'Pendiente';
      alreadyConfirmedBanner.style.display = 'none';
      currentAttendees = maxQuota > 0 ? maxQuota : 0;
      submitTextEl.textContent = 'Confirmar mi asistencia';
    }

    notaInput.value = data.nota || '';
    charCountEl.textContent = notaInput.value.length;

    updateStepperUI();
    setRsvpState('ready');
  }

  // Lookup invitation via GET
  function fetchInvitation() {
    setRsvpState('loading');
    formFeedbackEl.textContent = '';
    formFeedbackEl.className = 'rsvp-feedback';

    const url = `${APPS_SCRIPT_URL}?code=${encodeURIComponent(invitationCode)}`;

    fetch(url, {
      method: 'GET',
      cache: 'no-store'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.ok) {
          applyGuestData(data);
        } else if (data && data.error === 'codigo_invalido') {
          setRsvpState('invalid');
        } else {
          errorTextEl.textContent = 'No se pudo obtener la información de tu invitación. Por favor intenta de nuevo.';
          setRsvpState('error');
        }
      })
      .catch(() => {
        errorTextEl.textContent = 'No pudimos conectar con el servidor para consultar tu invitación. Por favor, revisá tu conexión e intentá de nuevo.';
        setRsvpState('error');
      });
  }

  // Stepper Events
  minusBtn.addEventListener('click', () => {
    if (currentAttendees > 0) {
      currentAttendees--;
      updateStepperUI();
    }
  });

  plusBtn.addEventListener('click', () => {
    if (currentAttendees < maxQuota) {
      currentAttendees++;
      updateStepperUI();
    }
  });

  // Note Character Counter
  notaInput.addEventListener('input', () => {
    charCountEl.textContent = notaInput.value.length;
  });

  // Submit confirmation via POST
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    formFeedbackEl.textContent = '';
    formFeedbackEl.className = 'rsvp-feedback';

    if (!Number.isInteger(currentAttendees) || currentAttendees < 0 || currentAttendees > maxQuota) {
      formFeedbackEl.textContent = `Por favor seleccioná una cantidad de asistentes válida entre 0 y ${maxQuota}.`;
      formFeedbackEl.classList.add('error');
      return;
    }

    const payload = {
      code: invitationCode,
      cantidad: currentAttendees,
      nota: notaInput.value.trim().slice(0, 300)
    };

    submitBtn.disabled = true;
    const originalBtnText = submitTextEl.textContent;
    submitTextEl.textContent = 'Guardando...';

    // POST with text/plain to avoid CORS preflight rejection by Apps Script
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      })
      .then(result => {
        if (result && result.ok) {
          invitationData.confirmado = 'SI';
          invitationData.cantidad = result.cantidad;
          invitationData.nota = payload.nota;

          // Configure success view
          if (result.cantidad > 0) {
            successTitleEl.textContent = '¡Asistencia registrada!';
            successDescEl.textContent = 'Muchas gracias por confirmar. ¡Nos llena de ilusión compartir este momento tan especial con vos!';
          } else {
            successTitleEl.textContent = 'Respuesta registrada';
            successDescEl.textContent = 'Registramos que no podrás acompañarnos. ¡Muchísimas gracias por avisarnos con anticipación y por tus buenos deseos!';
          }

          const attendeesText = result.cantidad > 0
            ? `${result.cantidad} ${result.cantidad === 1 ? 'persona confirmada' : 'personas confirmadas'}`
            : 'No asistirá';

          let summaryHtml = `
            <div class="summary-item">
              <span class="summary-label">Invitado</span>
              <span class="summary-value">${escapeHtml(invitationData.nombre)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Asistencia</span>
              <span class="summary-value">${attendeesText}</span>
            </div>
          `;

          if (payload.nota) {
            summaryHtml += `
              <div class="summary-item">
                <span class="summary-label">Nota</span>
                <span class="summary-value">${escapeHtml(payload.nota)}</span>
              </div>
            `;
          }

          successSummaryEl.innerHTML = summaryHtml;
          setRsvpState('success');
        } else {
          let errorMsg = 'No pudimos registrar tu confirmación. Por favor intentá nuevamente.';
          if (result && result.error === 'cantidad_invalida') {
            errorMsg = `La cantidad de asistentes debe estar entre 0 y tu cupo asignado (${result.cupo ?? maxQuota}).`;
          } else if (result && result.error === 'codigo_invalido') {
            errorMsg = 'El código de invitación no es válido.';
          } else if (result && result.error === 'error_servidor') {
            errorMsg = 'Ocurrió un error en el servidor. Por favor intentá en unos momentos.';
          }
          formFeedbackEl.textContent = errorMsg;
          formFeedbackEl.classList.add('error');
        }
      })
      .catch(() => {
        formFeedbackEl.textContent = 'Hubo un error de conexión al enviar tu confirmación. Por favor revisá tu internet e intentá nuevamente.';
        formFeedbackEl.classList.add('error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitTextEl.textContent = originalBtnText;
        lucide.createIcons({ nodes: [submitBtn] });
      });
  });

  retryBtn.addEventListener('click', fetchInvitation);

  editBtn.addEventListener('click', () => {
    applyGuestData(invitationData);
  });

  // Start lookup
  fetchInvitation();

})();
