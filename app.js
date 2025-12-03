document.addEventListener("DOMContentLoaded", () => {

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  /* ---------- CUSTOMER REVIEW SLIDER ---------- */
  const testimonials = [
    {
      name: "Maruthi Gupta",
      text: "My premium got waived off because of Health Returns. Very satisfied with the benefits!",
      img: "./images/Customer_rating/Customer_rating1.png"
    },
    {
      name: "Harshitha",
      text: "My maternity expenses were covered smoothly. The policy really helped my family during delivery.",
      img: "./images/Customer_rating/Customer_rating2.png"
    },
    {
      name: "Ravi Kumar",
      text: "I received health insurance without any waiting periods. Great support and quick approval!",
      img: "./images/Customer_rating/Customer_rating3.png"
    }
  ];

  let index = 0;

  // DOM elements
  const nameEl = document.getElementById("customer-name");
  const textEl = document.getElementById("customer-text");
  const imgEl  = document.getElementById("customer-img");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Stop if elements not found
  if (!nameEl || !textEl || !imgEl || !prevBtn || !nextBtn) return;

  // Show testimonial
  function showTestimonial(i) {
    const t = testimonials[i];

    // Fade-out effect
    nameEl.classList.add("opacity-0");
    textEl.classList.add("opacity-0");
    imgEl.classList.add("opacity-0");

    setTimeout(() => {
      nameEl.textContent = t.name;
      textEl.textContent = `"${t.text}"`;
      imgEl.src = t.img;

      // Fade-in
      nameEl.classList.remove("opacity-0");
      textEl.classList.remove("opacity-0");
      imgEl.classList.remove("opacity-0");
    }, 150);
  }

  // Load first testimonial
  showTestimonial(index);

  // Buttons
  prevBtn.addEventListener("click", () => {
    index = (index - 1 + testimonials.length) % testimonials.length;
    showTestimonial(index);
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % testimonials.length;
    showTestimonial(index);
  });

});
