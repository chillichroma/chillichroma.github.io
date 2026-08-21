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
   BEFORE ↔ AFTER
========================= */

const preworkCards =
  document.querySelectorAll(
    '.prework-card'
  );


let preworkIndex = 0;



setInterval(
  () => {

    preworkIndex =
      preworkIndex === 0
        ? 1
        : 0;


    preworkCards.forEach(
      card => {

        const images =
          card.querySelectorAll(
            'img'
          );


        images.forEach(
          (image, index) => {

            image.classList.toggle(
              'active',
              index === preworkIndex
            );

          }
        );

      }
    );

  },
  2800
);



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
