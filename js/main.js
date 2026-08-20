/* =========================
   MAIN SLIDER
========================= */

const slides =
  document.querySelectorAll('.slide');

const dots =
  document.querySelectorAll('.dot');


let currentSlide = 0;

const slideInterval = 3500;

let slideTimer;



function showSlide(index) {

  slides.forEach((slide, i) => {

    slide.classList.toggle(
      'active',
      i === index
    );

  });


  dots.forEach((dot, i) => {

    dot.classList.toggle(
      'active',
      i === index
    );

  });


  currentSlide = index;

}



function nextSlide() {

  const next =
    (currentSlide + 1)
    % slides.length;

  showSlide(next);

}



function startSlider() {

  slideTimer =
    setInterval(
      nextSlide,
      slideInterval
    );

}



function restartSlider() {

  clearInterval(slideTimer);

  startSlider();

}



dots.forEach((dot, index) => {

  dot.addEventListener(
    'click',
    () => {

      showSlide(index);

      restartSlider();

    }
  );

});


startSlider();



/* =========================
   HEADER SCROLL
========================= */

const header =
  document.querySelector(
    '.site-header'
  );


function updateHeader() {

  if (window.scrollY > 20) {

    header.classList.add(
      'scrolled'
    );

  } else {

    header.classList.remove(
      'scrolled'
    );

  }

}


window.addEventListener(
  'scroll',
  updateHeader,
  { passive: true }
);


updateHeader();
