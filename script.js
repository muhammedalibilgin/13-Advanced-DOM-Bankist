"use strict";

//selections
const buttonScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

///////////////////////////////////////
// Modal window
const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

//button scrolling
// my scroll smooty code

buttonScrollTo.addEventListener("click", function (e) {
    section1.scrollIntoView({ behavior: "smooth" });
});

//page navigation
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });
//add event listener to common parent element
//Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
    e.preventDefault();
    //matching stratejy
    if (e.target.classList.contains("nav__link")) {
        const id = e.target.getAttribute("href");
        // console.log(e);
        // console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
});

///Tabbed Component

// this is not confortable
// tabs.forEach(t=>t.addEventListener("click",()=>{
//   console.log("TAB")
// }))

tabsContainer.addEventListener("click", function (e) {
    const clicked = e.target.closest(".operations__tab");

    //Guard Clouses
    if (!clicked) return;

    //Remove
    tabs.forEach(t => t.classList.remove("operations__tab--active"));
    tabsContent.forEach(tc =>
        tc.classList.remove("operations__content--active")
    );

    //Active Tab
    clicked.classList.add("operations__tab--active");

    //Active Content
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add("operations__content--active");
});

///Navigation Fade Effects
const handleHover = function (e) {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const siblings = link.closest(".nav").querySelectorAll(".nav__link");
        const logo = link.closest(".nav").querySelector("img");

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
            logo.style.opacity = this;
        });
    }
};

//passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// ///Scroll And Sticky Navigation 1.version example
// const initialSection1 = section1.getBoundingClientRect();
// // console.log(initialSection1);
// window.addEventListener("scroll", function () {
//     if (window.scrollY > initialSection1.top) nav.classList.add("sticky");
//     else nav.classList.remove("sticky");
// });

//intersectionObserver API 2. version example
// const obsCallback = function (entries, observer) {
//     entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//     root: null,
//     threshold: [0.1],
// };
// const observer = new IntersectionObserver(function (entries) {
//     entries.forEach(entryp => console.log(entryp));
// }, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(
    function (entries) {
        const [entry] = entries;
        // console.log(entry);
        if (!entry.isIntersecting) nav.classList.add("sticky");
        else nav.classList.remove("sticky");
    },
    { root: null, threshold: 0, rootMargin: `-${navHeight}px` }
);
headerObserver.observe(header);

///Reveal Sections
const allSections = document.querySelectorAll(".section");
const revealSectionCalback = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    // console.log(entry.target);
    observer.unobserve(entry.target);
};

const revealSectionsObs = new IntersectionObserver(revealSectionCalback, {
    root: null,
    threshold: 0.25,
});
allSections.forEach(function (section) {
    revealSectionsObs.observe(section);
    section.classList.add("section--hidden");
});

/// Lazy Loading

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImgCalback = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) return;
    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    // entry.target.classList.remove("lazy-img");
    entry.target.addEventListener("load", function () {
        entry.target.classList.remove("lazy-img");
        observer.unobserve(entry.target);
    });
};

const imgObserver = new IntersectionObserver(loadImgCalback, {
    root: null,
    threshold: 0,
    rootMargin: "200px",
});

imgTargets.forEach(img => imgObserver.observe(img));

/// Slider (coppy and paste = :( = )

const slider = function () {
    const slides = document.querySelectorAll(".slide");
    const btnLeft = document.querySelector(".slider__btn--left");
    const btnRight = document.querySelector(".slider__btn--right");
    const dotContainer = document.querySelector(".dots");

    let curSlide = 0;
    const maxSlide = slides.length;

    // Functions
    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML(
                "beforeend",
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const activateDot = function (slide) {
        document
            .querySelectorAll(".dots__dot")
            .forEach(dot => dot.classList.remove("dots__dot--active"));

        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add("dots__dot--active");
    };

    const goToSlide = function (slide) {
        slides.forEach(
            (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        );
    };

    // Next slide
    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const init = function () {
        goToSlide(0);
        createDots();

        activateDot(0);
    };
    init();

    // Event handlers
    btnRight.addEventListener("click", nextSlide);
    btnLeft.addEventListener("click", prevSlide);

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") prevSlide();
        e.key === "ArrowRight" && nextSlide();
    });

    dotContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("dots__dot")) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

/*
// battery API 
// We get the initial value when the promise resolves ...
navigator.getBattery().then(x => console.log(`%${x.level * 100}`));
*/
/*
//mytest
const paragraph = document.querySelectorAll("p");
console.log(paragraph[4].nodeName);

// const someting = (onload = "window.alert('Welcome to my home page!');");
*/
//selecting elements
/*
console.log(document.querySelector(".nav"));

console.log(document);
console.log(document.documentElement);
const allSections = document.querySelectorAll(".section");
console.log(allSections);

const allButtons = document.getElementsByTagName("button");
console.log(allButtons);
const tagSections = document.getElementsByTagName("div");
console.log(tagSections);
*/
/*
const header = document.querySelector(".header");
const message = document.createElement("div");
message.classList.add(".cookie-message");
// message.textContent = "we use cookies for inmprove.thank you for visit";
message.innerHTML =
  "we use cookies for improve and thank you for visit <button class='btn btn--close-cookie'> Got It<button>";
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

//remove element
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

//style 
message.style.backgroundColor = "lightblue";
message.style.width = "120%";

console.log(message.style.height);
console.log(message.style.backgroundColor);
console.log(message.style.color);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 60 + "px"; //dont workkkkkkkk!!!!!!!! whyyyyyyyyy!!!!!

document.documentElement.style.setProperty("--color-primary", "yellow");

//attributes
const logo = document.querySelector(".nav__logo");
console.log(logo);
console.log(logo.alt);
console.log(logo.getAttribute("alt"));
console.log(logo.src);
console.log(logo.href);
console.log(logo.class);
console.log(logo.className);
console.log(logo.designer);
console.log(logo.getAttribute("designer"));
console.log(logo.designer);
logo.alt = "beatufil minimalist logo";
logo.setAttribute("company", "bankist");

console.log(logo.src);
console.log(logo.getAttribute("src"));

const link = document.querySelector(".btn--show-modal");
console.log(link.href);
console.log(link.getAttribute("href"));
//data attribute
console.log(logo.dataset.versionNumber);
//classes
logo.classList.add("a", "b");
logo.classList.remove;
logo.classList.toggle;
logo.classList.contains; //not includes

//dont use 
...
*/
/*
const buttonScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

buttonScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());

  console.log("current scroll X/Y", window.pageXOffset, window.pageYOffset);

  // console.log(
  //   "height,7width viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //scroll To

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  //smooth modern way
  section1.scrollIntoView({ behavior: "smooth" });
});
*/
/*
const h1 = document.querySelector("h1");
const alertH1 = function (e) {
  alert("addeventlistener graat! you are in h1 element");
};

h1.addEventListener("mouseenter", alertH1);

setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 1000);

// h1.onmouseenter = function (e) {
//   alert("onmouseenter graat! you are in h1 element");
// };

// buttonScrollTo.onclick = function (e) {
//   alert("click section one and the on is amazing");
// };
// document.addEventListener("click", e => console.log(e));
*/
/*
//make random color

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());

const navlinkS = document.querySelectorAll(".nav__link");
console.log(navlinkS);

navlinkS.forEach(ite =>
  ite.addEventListener("click", function (e) {
    this.style.backgroundColor = randomColor();
    console.log("link", e.target, e.currentTarget);
    console.log(e.currentTarget === this);
    //stop propagation
    // e.stopPropagation();
  })
);

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("container", e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("nav", e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});
*/
/*
const h1 = document.querySelector("h1");
//going downwards:child
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "brown";
//going upwards:parent
console.log(h1.parentNode);
console.log(h1.parentElement);
// h1.closest(".header").style.background = "var(--gradient-secondary)";
// h1.closest("h1").style.background = "red";

// document.querySelector(".header").style.background =
//   "var(--gradient-secondary)";
// h1.closest("h1").style.background = "var(--gradient-primary)";

//going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); //important just for me
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5)";
});
*/

document.addEventListener("DOMContentLoaded", function (e) {
    console.log("loaded", e);
});

window.addEventListener("load", function (e) {
    console.log("fully load", e);
});
