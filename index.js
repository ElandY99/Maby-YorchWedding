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
      startDelay: 500,
      onComplete: function (e) {
        console.log('Transcripción terminada en', e);
      }
    });
  })


})();
