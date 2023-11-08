const slider = document.querySelector(".slider-container");
const slides = Array.from(document.querySelectorAll(".slide"));
const pre = document.getElementById("pre");
const next = document.getElementById("next");

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentIndex = 0;

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector(".item");
  slideImage.addEventListener("dragstart", (e) => e.preventDefault());
  slide.addEventListener("pointerdown", pointerDown(index));
  slide.addEventListener("pointerup", pointerUp);
  slide.addEventListener("pointerleave", pointerUp);
  slide.addEventListener("pointermove", pointerMove);
});

window.addEventListener("resize", setPositionByIndex);
pre.addEventListener("click", decrement);
next.addEventListener("click", increment);

window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

function pointerDown(index) {
  return function (event) {
    currentIndex = index;
    startPos = event.clientX;
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
}

function pointerMove(event) {
  if (isDragging) {
    const currentPosition = event.clientX;
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function pointerUp() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;
  setPositionByIndex();
  slider.classList.remove("grabbing");

  currentIndex === 0 ? pre.classList.add("not-allow") : pre.classList.remove("not-allow");
  currentIndex === slides.length - 1 ? next.classList.add("not-allow") : next.classList.remove("not-allow");
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function decrement() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    pointerUp();
  }
}

function increment() {
  if (currentIndex < slides.length - 1) {
    currentIndex += 1;
    pointerUp();
  }
}
