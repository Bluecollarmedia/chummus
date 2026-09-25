(function () {
  'use strict';

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById('siteNav');
  function updateNav() {
    if (window.scrollY > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', function () {
    var open = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Sticky mobile CTA (hide near footer / booking form) ---------- */
  var stickyCta = document.getElementById('stickyCta');
  var bookingSection = document.getElementById('booking');
  if (stickyCta && bookingSection && 'IntersectionObserver' in window) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyCta.classList.toggle('hide', entry.isIntersecting);
      });
    }, { threshold: 0.05 });
    ctaObserver.observe(bookingSection);
  }

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  document.querySelectorAll('.masonry-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var full = btn.getAttribute('data-full');
      var imgAlt = btn.querySelector('img').getAttribute('alt') || '';
      lightboxImage.src = full;
      lightboxImage.alt = imgAlt;
      lastFocused = btn;
      lightbox.hidden = false;
      lightboxClose.focus();
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ---------- Booking form ----------
     No backend is connected yet. We do NOT fake a successful submission.
     Once a real endpoint exists, replace the fetch() below and remove
     the blocking status message. */
  var form = document.getElementById('bookingForm');
  var success = document.getElementById('bookingSuccess');
  var statusNote = document.getElementById('formStatusNote');
  var BOOKING_ENDPOINT = null; // e.g. 'https://formspree.io/f/XXXXXXX' — set this once a real endpoint is ready.

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.reportValidity()) return;

    if (!BOOKING_ENDPOINT) {
      statusNote.textContent = 'This form isn\'t connected to a live inbox yet, so this submission has not been sent. Please reach out by phone or email for now.';
      statusNote.style.color = '#e8b4b4';
      statusNote.style.borderLeftColor = '#e8b4b4';
      return;
    }

    var data = new FormData(form);
    fetch(BOOKING_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.hidden = true;
        success.hidden = false;
      } else {
        statusNote.textContent = 'Something went wrong sending your request. Please try again or reach out by phone or email.';
      }
    }).catch(function () {
      statusNote.textContent = 'Something went wrong sending your request. Please try again or reach out by phone or email.';
    });
  });
})();
