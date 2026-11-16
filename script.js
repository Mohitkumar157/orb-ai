<<<<<<< HEAD
// ===== Mobile Menu (Runs on all pages) =====
function initMobileMenu() {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  if (btn.dataset.menuReady === 'true') return;
  btn.dataset.menuReady = 'true';

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

// ===== Page Animations & Interactions (Safe with null-checks) =====
if (typeof gsap !== 'undefined') {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
}

let isMobile = window.matchMedia("(max-width: 767px)").matches;

(() => {
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('video-toggle');
  const pauseIcon = document.getElementById('pause-icon');
  const playIcon = document.getElementById('play-icon');

  if (!video || !toggle || !pauseIcon || !playIcon) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause();
    toggle.setAttribute('aria-pressed', 'true');
    toggle.setAttribute('aria-label', 'Play background video');
    pauseIcon.classList.add('hidden');
    playIcon.classList.remove('hidden');
  }

  toggle.addEventListener('click', () => {
    const isPaused = video.paused;
    if (isPaused) {
      video.play();
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Pause background video');
    } else {
      video.pause();
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Play background video');
    }
    pauseIcon.classList.toggle('hidden', !isPaused);
    playIcon.classList.toggle('hidden', isPaused);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('video-card');
  const video = document.getElementById('demo-video');
  const button = document.getElementById('video-cta');
  const scaleWrap = document.getElementById('video-scale-wrap');

  if (!card || !video || !button) return;

  const buttonRadius = 44;

  const showButton = (x, y) => {
    if (typeof gsap !== 'undefined') {
      gsap.to(button, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.set(button, { x, y });
    }
  };

  const hideButton = () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(button, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const moveButton = (clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;

    const x = clamp(rawX, buttonRadius, rect.width - buttonRadius);
    const y = clamp(rawY, buttonRadius, rect.height - buttonRadius);

    if (typeof gsap !== 'undefined') {
      gsap.to(button, {
        x,
        y,
        duration: 1,
        ease: 'power3.out',
      });
    }
  };

  card.addEventListener('mouseenter', (e) => {
    const rect = card.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, buttonRadius, rect.width - buttonRadius);
    const y = clamp(e.clientY - rect.top, buttonRadius, rect.height - buttonRadius);
    showButton(x, y);
  });

  card.addEventListener('mousemove', (e) => {
    moveButton(e.clientX, e.clientY);
  });

  card.addEventListener('mouseleave', hideButton);

  card.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      button.classList.remove('is-paused');
    } else {
      video.pause();
      button.classList.add('is-paused');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  let heading = document.querySelector(".CustomAISolutions");
  if (heading) {
    let spans = heading.querySelectorAll(".inline-block");
    if (spans.length) {
      gsap.set(spans, {
        opacity: 0,
        x: isMobile ? -70 : -150
      });
      gsap.to(spans, {
        opacity: 1,
        x: 0,
        duration: isMobile ? 0.8 : 1.1,
        ease: "power3.out",
        stagger: isMobile ? 0.1 : 0.15,
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      });
    }
  }

  const secondHeading = document.querySelectorAll(".second-sec");
  if (secondHeading.length) {
    gsap.set(secondHeading, {
      y: 100,
      opacity: 0
    });
    gsap.to(secondHeading, {
      y: 0,
      opacity: 1,
      stagger: 1,
      duration: .8,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".secondSecHead",
        start: "top 60%",
      }
    });
  }

  let wrap = document.querySelector(".video-scale-wrap");
  if (wrap) {
    let video = wrap.querySelector("video");
    if (video) {
      gsap.fromTo(video,
        { scale: 0.6 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "top 40%",
            scrub: 1,
          }
        }
      );
    }
  }
});
=======

    gsap.registerPlugin(ScrollTrigger);
    let isMobile = window.matchMedia("(max-width: 767px)").matches;
    
    (() => {
      const video = document.getElementById('hero-video');
      const toggle = document.getElementById('video-toggle');
      const pauseIcon = document.getElementById('pause-icon');
      const playIcon = document.getElementById('play-icon');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        toggle.setAttribute('aria-pressed', 'true');
        toggle.setAttribute('aria-label', 'Play background video');
        pauseIcon.classList.add('hidden');
        playIcon.classList.remove('hidden');
      }

      toggle.addEventListener('click', () => {
        const isPaused = video.paused;
        if (isPaused) {
          video.play();
          toggle.setAttribute('aria-pressed', 'false');
          toggle.setAttribute('aria-label', 'Pause background video');
        } else {
          video.pause();
          toggle.setAttribute('aria-pressed', 'true');
          toggle.setAttribute('aria-label', 'Play background video');
        }
        pauseIcon.classList.toggle('hidden', !isPaused);
        playIcon.classList.toggle('hidden', isPaused);
      });
    })();





    document.addEventListener('DOMContentLoaded', () => {
      const card = document.getElementById('video-card');
      const video = document.getElementById('demo-video');
      const button = document.getElementById('video-cta');
      const scaleWrap = document.getElementById('video-scale-wrap');

      const buttonRadius = 44; // half of the 88px button — used for clamping

      /* -----------------------------------------------------------
         1. CURSOR-FOLLOW BUTTON
      ----------------------------------------------------------- */
      const showButton = (x, y) => {
        gsap.to(button, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
        gsap.set(button, { x, y });
      };

      const hideButton = () => {
        gsap.to(button, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power3.out',
        });
      };

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      const moveButton = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const rawX = clientX - rect.left;
        const rawY = clientY - rect.top;

        const x = clamp(rawX, buttonRadius, rect.width - buttonRadius);
        const y = clamp(rawY, buttonRadius, rect.height - buttonRadius);

        gsap.to(button, {
          x,
          y,
          duration: 1,
          ease: 'power3.out',
        });
      };

      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, buttonRadius, rect.width - buttonRadius);
        const y = clamp(e.clientY - rect.top, buttonRadius, rect.height - buttonRadius);
        showButton(x, y);
      });

      card.addEventListener('mousemove', (e) => {
        moveButton(e.clientX, e.clientY);
      });

      card.addEventListener('mouseleave', hideButton);

      /* -----------------------------------------------------------
         2. CLICK TO TOGGLE PLAY / PAUSE
      ----------------------------------------------------------- */
      card.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          button.classList.remove('is-paused'); // shows the pause icon
        } else {
          video.pause();
          button.classList.add('is-paused'); // shows the play icon
        }
      });


    });



  

let heading = document.querySelector(".CustomAISolutions");
let spans = heading.querySelectorAll(".inline-block");
 
gsap.set(spans, {
  opacity: 0,
  x: isMobile ? -70 : -150
});
 
gsap.to(spans, {
  opacity: 1,
  x: 0,
  duration: isMobile ? 0.8 : 1.1,
  ease: "power3.out",
  stagger: isMobile ? 0.1 : 0.15,
  scrollTrigger: {
    trigger: heading,
    start: "top 85%", 
    toggleActions: "play none none none", 
  }
});

const secondHeading = document.querySelectorAll(".second-sec");
gsap.set(secondHeading , {
  y :100,
  opacity  : 0
})
gsap.to(secondHeading , {
  y: 0,
  opacity : 1,
  stagger : 1,
  duration : .8,
  ease :"power4.out",
  scrollTrigger : {
    trigger : ".secondSecHead",
    start : "top 60%",
  }

})


let wrap = document.querySelector(".video-scale-wrap");
let video = wrap.querySelector("video");
 
gsap.fromTo(video,
  { scale: 0.6 },
  {
    scale: 1,
    ease: "none", // scrub ke saath "none" best rehta hai, natural feel deta hai
    scrollTrigger: {
      trigger: wrap,
      start: "top bottom",   // wrap ka top jab viewport ke bottom pe aaye
      end: "top 40%",        // wrap ka top jab viewport ke 40% pe pahunche
      scrub: 1,              // scroll ke saath directly linked (smooth lag)
              // testing ke liye, production mein hata dena
    }
  }
);












 
>>>>>>> 0bc18ab086fcba827ef8fff867881b536171f3ca
