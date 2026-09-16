/* =========================
   MAIN SLIDER
========================= */

const slides =
  document.querySelectorAll(
    '.slide'
  );

const dotsWrap =
  document.querySelector(
    '.slider-dots'
  );

let currentSlide = 0;
let slideTimer = null;


/* DOT 자동 생성 */

slides.forEach(
  (slide, index) => {

    const button =
      document.createElement(
        'button'
      );

    button.type =
      'button';

    button.className =
      'dot' +
      (
        index === 0
          ? ' active'
          : ''
      );

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

  }
);


const dots =
  document.querySelectorAll(
    '.dot'
  );


function showSlide(index) {

  slides.forEach(
    (slide, i) => {

      slide.classList.toggle(
        'active',
        i === index
      );

    }
  );

  dots.forEach(
    (dot, i) => {

      dot.classList.toggle(
        'active',
        i === index
      );

    }
  );

  currentSlide =
    index;

}


function nextSlide() {

  const next =
    (
      currentSlide + 1
    ) % slides.length;

  showSlide(next);

}


function restartSlider() {

  if (slideTimer) {

    clearInterval(
      slideTimer
    );

  }

  slideTimer =
    setInterval(
      nextSlide,
      3500
    );

}


restartSlider();



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
   PROJECT SLIDER
========================= */

const preworkBefore =
  document.querySelector(
    '.prework-before img'
  );

const preworkAfter =
  document.querySelector(
    '.prework-after img'
  );


const preworkProjects = [
  {
    before:
      'images/prework-01-before.jpg',
    after:
      'images/prework-01-after.jpg'
  },
  {
    before:
      'images/prework-02-before.jpg',
    after:
      'images/prework-02-after.jpg'
  },
  {
    before:
      'images/prework-03-before.png',
    after:
      'images/prework-03-after.png'
  }
];


let preworkIndex = 0;


/* 전환 전에 모든 이미지 미리 로딩 */

preworkProjects.forEach(
  project => {

    const beforeImage =
      new Image();

    beforeImage.src =
      project.before;


    const afterImage =
      new Image();

    afterImage.src =
      project.after;

  }
);


function preloadImage(src) {

  return new Promise(
    resolve => {

      const image =
        new Image();

      image.onload =
        () => resolve(true);

      image.onerror =
        () => resolve(false);

      image.src =
        src;

    }
  );

}


async function showNextPrework() {

  const nextIndex =
    (
      preworkIndex + 1
    ) % preworkProjects.length;

  const nextProject =
    preworkProjects[
      nextIndex
    ];


  const loaded =
    await Promise.all([
      preloadImage(
        nextProject.before
      ),
      preloadImage(
        nextProject.after
      )
    ]);


  /* 두 이미지가 모두 로드됐을 때만 전환 */

  if (
    !loaded[0] ||
    !loaded[1]
  ) {

    return;

  }


  preworkBefore.classList.remove(
    'active'
  );

  preworkAfter.classList.remove(
    'active'
  );


  setTimeout(
    () => {

      preworkBefore.src =
        nextProject.before;

      preworkAfter.src =
        nextProject.after;


      preworkBefore.classList.add(
        'active'
      );

      preworkAfter.classList.add(
        'active'
      );


      preworkIndex =
        nextIndex;

    },
    350
  );

}


if (
  preworkBefore &&
  preworkAfter
) {

  setInterval(
    showNextPrework,
    3200
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
