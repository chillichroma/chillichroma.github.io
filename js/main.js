/* =========================
   MAIN SLIDER
   independent auto rotation
========================= */

(() => {

  const slides =
    Array.from(
      document.querySelectorAll(
        '.hero-slider .slide'
      )
    );

  const dotsWrap =
    document.querySelector(
      '.hero-slider .slider-dots'
    );

  if (
    slides.length < 1 ||
    !dotsWrap
  ) {
    return;
  }

  let currentSlide = 0;
  let slideTimer = null;

  dotsWrap.innerHTML = '';

  const dots =
    slides.map(
      (slide, index) => {

        const button =
          document.createElement(
            'button'
          );

        button.type = 'button';
        button.className =
          index === 0
            ? 'dot active'
            : 'dot';

        button.setAttribute(
          'aria-label',
          `${index + 1}번 슬라이드`
        );

        button.addEventListener(
          'click',
          () => {

            showSlide(index);
            restartSlider();

          }
        );

        dotsWrap.appendChild(
          button
        );

        return button;

      }
    );


  function showSlide(index) {

    const safeIndex =
      (
        index + slides.length
      ) % slides.length;

    slides.forEach(
      (slide, i) => {

        slide.classList.toggle(
          'active',
          i === safeIndex
        );

      }
    );

    dots.forEach(
      (dot, i) => {

        dot.classList.toggle(
          'active',
          i === safeIndex
        );

      }
    );

    currentSlide = safeIndex;

  }


  function nextSlide() {

    showSlide(
      currentSlide + 1
    );

  }


  function restartSlider() {

    if (slideTimer !== null) {
      clearInterval(slideTimer);
    }

    if (slides.length > 1) {

      slideTimer =
        window.setInterval(
          nextSlide,
          3500
        );

    }

  }


  showSlide(0);
  restartSlider();

})();


/* =========================
   HEADER
========================= */

const header =
  document.querySelector(
    '.site-header'
  );


function updateHeader() {

  header.classList.toggle(
    'scrolled',
    window.scrollY > 20
  );

}


window.addEventListener(
  'scroll',
  updateHeader,
  {
    passive: true
  }
);


updateHeader();



/* =========================
   PREWORK
   PROJECT CROSSFADE
========================= */

const preworkProjects = [
  {
    before: 'images/prework-01-before.jpg',
    after: 'images/prework-01-after.jpg'
  },
  {
    before: 'images/prework-02-before.jpg',
    after: 'images/prework-02-after.jpg'
  },
  {
    before: 'images/prework-03-before.png',
    after: 'images/prework-03-after.png'
  }
];

const beforeLayers =
  document.querySelectorAll(
    '.prework-before .prework-layer'
  );

const afterLayers =
  document.querySelectorAll(
    '.prework-after .prework-layer'
  );

let preworkIndex = 0;
let activeLayer = 0;


/* 모든 프로젝트 이미지 사전 로딩 */

preworkProjects.forEach(
  project => {

    const beforeImage = new Image();
    beforeImage.src = project.before;

    const afterImage = new Image();
    afterImage.src = project.after;

  }
);


function loadImage(src) {

  return new Promise(
    resolve => {

      const image = new Image();

      image.onload =
        () => resolve(true);

      image.onerror =
        () => resolve(false);

      image.src = src;

    }
  );

}


async function showNextPrework() {

  const nextIndex =
    (
      preworkIndex + 1
    ) % preworkProjects.length;

  const nextProject =
    preworkProjects[nextIndex];

  const loaded =
    await Promise.all([
      loadImage(nextProject.before),
      loadImage(nextProject.after)
    ]);

  if (!loaded[0] || !loaded[1]) {
    return;
  }

  const nextLayer =
    activeLayer === 0 ? 1 : 0;

  beforeLayers[nextLayer].src =
    nextProject.before;

  afterLayers[nextLayer].src =
    nextProject.after;


  /* 브라우저가 새 이미지를 먼저 그린 다음 크로스페이드 */

  requestAnimationFrame(
    () => {

      requestAnimationFrame(
        () => {

          beforeLayers[nextLayer]
            .classList.add('active');

          afterLayers[nextLayer]
            .classList.add('active');

          beforeLayers[activeLayer]
            .classList.remove('active');

          afterLayers[activeLayer]
            .classList.remove('active');

          activeLayer = nextLayer;
          preworkIndex = nextIndex;

        }
      );

    }
  );

}


if (
  beforeLayers.length === 2 &&
  afterLayers.length === 2
) {

  setInterval(
    showNextPrework,
    2000
  );

}


/* =========================
   CONCEPT IMAGE
   LOAD + SCROLL ANIMATION
========================= */

const conceptStage =
  document.querySelector(
    '.concept-animate'
  );

const conceptImage =
  conceptStage
    ? conceptStage.querySelector(
        '.concept-image'
      )
    : null;


function prepareConceptAnimation() {

  if (
    !conceptStage ||
    !conceptImage
  ) {
    return;
  }

  /* 먼저 시작 상태를 적용 */
  conceptStage.classList.add(
    'concept-ready'
  );

  const conceptObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              /* 시작 상태가 실제로 그려진 다음 등장 */
              requestAnimationFrame(
                () => {

                  requestAnimationFrame(
                    () => {

                      conceptStage.classList.add(
                        'in-view'
                      );

                    }
                  );

                }
              );

              conceptObserver.unobserve(
                conceptStage
              );

            }

          }
        );

      },
      {
        threshold: 0.18
      }
    );

  conceptObserver.observe(
    conceptStage
  );

}


/* 캐시 이미지와 최초 로딩 모두 대응 */
if (
  conceptImage &&
  conceptImage.complete
) {

  prepareConceptAnimation();

} else if (conceptImage) {

  conceptImage.addEventListener(
    'load',
    prepareConceptAnimation,
    {
      once: true
    }
  );

}



/* =========================
   SCROLL REVEAL
========================= */

const reveals =
  document.querySelectorAll(
    '.reveal, .section-reveal'
  );


const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add(
                'in-view'
              );

            revealObserver
              .unobserve(
                entry.target
              );

          }

        }
      );

    },

    {
      threshold: 0.18
    }

  );


reveals.forEach(
  (element, index) => {

    element.style
      .transitionDelay =
      `${
        Math.min(
          index * 70,
          280
        )
      }ms`;

    revealObserver.observe(
      element
    );

  }
);


// Mobile side menu
(() => {
  const buttons = document.querySelectorAll(".mobile-menu-button");
  buttons.forEach((button) => {
    const header = button.closest(".site-header");
    const menu = header ? header.querySelector(".mobile-side-menu") : null;
    const close = menu ? menu.querySelector(".mobile-menu-close") : null;
    if (!menu) return;

    const openMenu = () => {
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
    };
    const closeMenu = () => {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", openMenu);
    if (close) close.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  });
})();

/* ===== v22 hero manual navigation ===== */
(() => {
  const hero=document.querySelector('.hero-slider');
  if(!hero) return;
  const slides=()=>Array.from(hero.querySelectorAll('.slide'));
  const dots=()=>Array.from(document.querySelectorAll('.hero-dots button, .slider-dots button, .dots button, .dot'));
  const current=()=>{
    const ss=slides();
    let i=ss.findIndex(x=>x.classList.contains('active'));
    if(i<0) i=ss.findIndex(x=>getComputedStyle(x).opacity!=='0' && getComputedStyle(x).display!=='none');
    return i<0?0:i;
  };
  const move=(dir)=>{
    const ds=dots(), ss=slides(), i=current(), next=(i+dir+ss.length)%ss.length;
    if(ds[next]) { ds[next].click(); return; }
    ss.forEach((x,n)=>x.classList.toggle('active',n===next));
  };
  hero.querySelector('.hero-prev')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();move(-1)});
  hero.querySelector('.hero-next')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();move(1)});
  let sx=null,sy=null;
  hero.addEventListener('touchstart',e=>{const t=e.changedTouches[0];sx=t.clientX;sy=t.clientY},{passive:true});
  hero.addEventListener('touchend',e=>{
    if(sx===null)return; const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy; sx=sy=null;
    if(Math.abs(dx)>=45 && Math.abs(dx)>Math.abs(dy)*1.25) move(dx<0?1:-1);
  },{passive:true});
})();
