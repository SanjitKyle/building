/**
 * CraftCombine.org Text & Heading Animation Engine
 * Applies cubic-bezier(0.22, 1, 0.36, 1) scroll reveals and manages scrolling marquee tickers
 */
(function() {
  function initCraftAnimations() {
    // 1. Automatically register headings and text elements for scroll reveal
    const targetSelectors = [
      'h1', 
      'h2', 
      'h3', 
      '.eyebrow', 
      '.hero-description', 
      '.section-subtitle',
      'article.group'
    ];

    document.querySelectorAll(targetSelectors.join(', ')).forEach((el, index) => {
      if (!el.classList.contains('craft-text-reveal') && !el.classList.contains('craft-card-reveal')) {
        if (el.tagName === 'ARTICLE' || el.classList.contains('group')) {
          el.classList.add('craft-card-reveal');
        } else {
          el.classList.add('craft-text-reveal');
        }
      }
    });

    // 2. IntersectionObserver using CraftCombine's viewport thresholds
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('.craft-text-reveal, .craft-card-reveal, .craft-heading-mask').forEach(el => {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCraftAnimations);
  } else {
    initCraftAnimations();
  }
})();
