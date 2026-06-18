(function () {
  'use strict';

  var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isPerformance = document.documentElement.classList.contains('performance-mode');
  var hasObserver = 'IntersectionObserver' in window;

  function getSpeed() {
    var isMobile = 'ontouchstart' in window;
    return isMobile ? 22 : 26;
  }

  function typeText(el, text, speed, callback) {
    var index = 0;
    el.textContent = '';

    function tick() {
      if (index >= text.length) {
        el.classList.add('typed-complete');
        if (callback) callback();
        return;
      }
      el.textContent += text.charAt(index);
      index++;
      setTimeout(tick, speed);
    }
    tick();
  }

  function initTyping(el) {
    var text = el.getAttribute('data-text');
    if (!text) return;

    // Store original text
    el.textContent = text;
    el.classList.add('typed-complete');

    if (isReduced || isPerformance) {
      return;
    }

    if (!hasObserver) {
      el.textContent = '';
      typeText(el, text, getSpeed());
      return;
    }

    // Reset for animation
    el.textContent = '';
    el.classList.remove('typed-complete');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          typeText(el, text, getSpeed());
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);
  }

  var els = document.querySelectorAll('.typing-effect');
  els.forEach(function (el) {
    if (el.classList.contains('visible')) {
      initTyping(el);
    } else {
      var checkVisible = setInterval(function () {
        if (el.classList.contains('visible') || el.offsetParent !== null) {
          clearInterval(checkVisible);
          initTyping(el);
        }
      }, 200);
      setTimeout(function () { clearInterval(checkVisible); }, 5000);
    }
  });

})();
