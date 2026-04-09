// Mobile nav
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
}

// Night mode toggle
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
}

// Counter animation
const counters = document.querySelectorAll(".counter");
const statsSection = document.querySelector(".stats-section");

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute("data-target"));
    const isLarge = target >= 100;
    const increment = Math.ceil(target / 60);
    let current = 0;

    const updateCounter = () => {
      current += increment;

      if (current >= target) {
        counter.innerText = isLarge ? target.toLocaleString() : target;
      } else {
        counter.innerText = isLarge ? current.toLocaleString() : current;
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
};

if (statsSection && counters.length) {
  let countersStarted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(statsSection);
}

// Testimonial slider
const testimonials = document.querySelectorAll(".testimonial");
const dotsContainer = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (testimonials.length && dotsContainer && prevBtn && nextBtn) {
  let currentSlide = 0;

  testimonials.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    testimonials.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  prevBtn.addEventListener("click", () => {
    const index = currentSlide === 0 ? testimonials.length - 1 : currentSlide - 1;
    showSlide(index);
  });

  nextBtn.addEventListener("click", () => {
    const index = currentSlide === testimonials.length - 1 ? 0 : currentSlide + 1;
    showSlide(index);
  });

  setInterval(() => {
    const index = currentSlide === testimonials.length - 1 ? 0 : currentSlide + 1;
    showSlide(index);
  }, 5500);
}