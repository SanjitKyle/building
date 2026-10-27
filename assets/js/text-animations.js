(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionPreference.matches) return;

  const prepare = () => {
    const headings = [...document.querySelectorAll('main h1, main h2, main h3, footer h2, footer h3')];
    const copy = [...document.querySelectorAll('main p, main li, main blockquote, footer p, footer li')];

    headings.forEach((heading) => {
      if (heading.dataset.textMotionReady) return;
      heading.dataset.textMotionReady = 'true';
      heading.classList.add('text-reveal-heading');
      const accessibleText = heading.textContent.replace(/\s+/g, ' ').trim();
      if (accessibleText && !heading.hasAttribute('aria-label')) heading.setAttribute('aria-label', accessibleText);

      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode);
      }
      let wordIndex = 0;
      textNodes.forEach((textNode) => {
        const fragment = document.createDocumentFragment();
        textNode.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }
          const word = document.createElement('span');
          word.className = 'text-reveal-word';
          word.setAttribute('aria-hidden', 'true');
          word.style.setProperty('--word-delay', `${Math.min(wordIndex * 48, 520)}ms`);
          word.textContent = part;
          fragment.append(word);
          wordIndex += 1;
        });
        textNode.replaceWith(fragment);
      });
    });

    copy.forEach((element) => {
      if (element.closest('h1, h2, h3') || element.dataset.textMotionReady) return;
      element.dataset.textMotionReady = 'true';
      element.classList.add('text-reveal-copy');
    });

    const groups = [...headings, ...copy].reduce((map, element) => {
      if (!element.dataset.textMotionReady || element.dataset.motionDelaySet) return map;
      element.dataset.motionDelaySet = 'true';
      const parent = element.parentElement;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent).push(element);
      return map;
    }, new Map());
    groups.forEach((items) => items.forEach((element, index) => {
      if (element.classList.contains('text-reveal-copy')) element.style.setProperty('--text-delay', `${Math.min(index * 75, 300)}ms`);
    }));

    document.documentElement.classList.add('text-motion-enabled');
    const revealTargets = document.querySelectorAll('.text-reveal-heading, .text-reveal-copy');
    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach((element) => observer.observe(element));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, { once: true });
  else prepare();
})();