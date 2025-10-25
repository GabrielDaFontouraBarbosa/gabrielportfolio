// Smooth scrolling for anchor links (if not handled purely by CSS)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      // Scroll smoothly to the top of the target section
      window.scrollTo({
        top: targetSection.offsetTop - 60,  // offset for header height if needed
        behavior: 'smooth'
      });
    }
  });
});

// Active menu link highlight on scroll using IntersectionObserver
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.6  // section is considered "visible" when 60% in view
};
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Get the section ID that is in view
      const sectionId = entry.target.getAttribute('id');
      // Remove active class from all nav links
      navLinks.forEach(link => link.classList.remove('active'));
      // Add active class to the current section's nav link
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, observerOptions);
// Observe each section
sections.forEach(section => {
  sectionObserver.observe(section);
});

// Custom cursor follower (blue dot)
const cursorDot = document.querySelector('.cursor-dot');
// Only activate custom cursor if not a touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (!isTouchDevice && cursorDot) {
  // Show the dot (in case it was hidden)
  cursorDot.style.display = 'block';
  // Listen for mouse movements
  window.addEventListener('mousemove', (e) => {
    // Use GSAP to smoothly animate the dot to cursor position
    if (typeof gsap !== 'undefined') {
      gsap.to(cursorDot, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.2, 
        ease: 'power3.out' 
      });
    } else {
      // Fallback: directly position the dot (less smooth without GSAP)
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  });
  // Optionally, change cursor-dot appearance when hovering over links/buttons
  document.querySelectorAll('a, button').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursorDot.style.transform += ' scale(1.5)';  // enlarge dot
      cursorDot.style.opacity = '0.6';
    });
    elem.addEventListener('mouseleave', () => {
      cursorDot.style.transform = cursorDot.style.transform.replace(' scale(1.5)', '');
      cursorDot.style.opacity = '0.8';
    });
  });
  // Hide dot when leaving page viewport
  document.addEventListener('mouseleave', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(cursorDot, { opacity: 0, duration: 0.3 });
    } else {
      cursorDot.style.opacity = '0';
    }
  });
  document.addEventListener('mouseenter', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(cursorDot, { opacity: 0.8, duration: 0.3 });
    } else {
      cursorDot.style.opacity = '0.8';
    }
  });
} else {
  // On touch devices, hide the custom cursor element
  if (cursorDot) cursorDot.style.display = 'none';

  document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
});

}

  // Mobile menu toggle: toggles `.mobile-open` on the nav-list
  (function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    if (!menuToggle || !navList) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('mobile-open');
      // update accessible state and toggle icon
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close mobile menu when a nav link is clicked
    navList.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('mobile-open')) {
          navList.classList.remove('mobile-open');
        }
      });
    });

    // Ensure nav is visible again on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 600 && navList.classList.contains('mobile-open')) {
        navList.classList.remove('mobile-open');
      }
    });
  })();
