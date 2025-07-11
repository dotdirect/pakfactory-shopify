class AnchorNavigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.sectionObserver = null;
  }

  calcHeader = () => {
    const header = document.querySelector('.header-wrapper');
    const headerObserver = new ResizeObserver(() => {
      const headerHeight = header?.getBoundingClientRect().height || 0;
      const marginHeader = getComputedStyle(
        header.querySelector('.header')
      ).getPropertyValue('margin-top');
      document.documentElement.style.setProperty(
        '--header-height',
        `${headerHeight}px`
      );
      document.documentElement.style.setProperty(
        '--margin-header',
        `${marginHeader}`
      );
    });

    if (header) headerObserver.observe(header);
  };

  connectedCallback() {
    const lightDomContent = Array.from(this.children);
    const baseStyleUrl = this.getAttribute('data-base-style-url') || '';
    const componentStyleUrl = this.getAttribute('data-style-url') || '';

    this.shadowRoot.innerHTML = `
      <style>
        @import url("${baseStyleUrl}");
        @import url("${componentStyleUrl}");

        .anchor-navigation__links {
          transition:all 0.3s ease-in-out;
        }

        :host(.is-sticky) .anchor-navigation__links {
          box-shadow: 0 8px 30px rgba(var(--color-shadow),.08);
          padding-inline: 7.8rem;
          max-width: 176rem; 
          border-radius: 0;
        }

      </style>
      <div class="anchor-navigation__links"></div>
    `;

    const navigationWrapper = this.shadowRoot.querySelector(
      '.anchor-navigation__links'
    );

    lightDomContent.forEach((child) => {
      if (
        child.tagName === 'A' &&
        child.getAttribute('href')?.startsWith('#')
      ) {
        const clonedLink = child.cloneNode(true);
        navigationWrapper.appendChild(clonedLink);
        clonedLink.addEventListener('click', this.handleAnchorClick.bind(this));
      } else {
        console.warn(
          'anchor-navigation: Only <a href="#..."> are expected.',
          child
        );
      }
    });

    this.setActiveLinkFromHash();
    this.observeAnchorsInView();
    this.watchStickyState();

    window.addEventListener(
      'hashchange',
      this.setActiveLinkFromHash.bind(this)
    );
  }

  disconnectedCallback() {
    const anchorLinks = this.shadowRoot.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((anchor) => {
      anchor.removeEventListener('click', this.handleAnchorClick);
    });

    window.removeEventListener('hashchange', this.setActiveLinkFromHash);
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
  }

  handleAnchorClick(event) {
    event.preventDefault();

    const header = document.querySelector('.header-wrapper');
    const scrollOffset = header?.getBoundingClientRect().height || 0;

    const clickedLink = event.currentTarget;
    const href = clickedLink.getAttribute('href');
    if (!href) return;

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: targetPosition - scrollOffset,
      behavior: 'smooth',
    });

    history.pushState(null, '', href);
    this.setActiveLink(clickedLink);
  }

  setActiveLink(activeLink) {
    this.shadowRoot.querySelectorAll('a').forEach((link) => {
      link.classList.remove('anchor-navigation__link-item--active');
    });

    if (activeLink) {
      activeLink.classList.add('anchor-navigation__link-item--active');
    }
  }

  setActiveLinkFromHash() {
    const currentHash = window.location.hash;
    let foundActive = false;

    this.shadowRoot.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === currentHash) {
        this.setActiveLink(link);
        foundActive = true;
      }
    });

    if (!foundActive && (!currentHash || currentHash === '#')) {
      const firstLink = this.shadowRoot.querySelector('a');
      if (firstLink) this.setActiveLink(firstLink);
    }
  }

  observeAnchorsInView() {
    const options = {
      root: null,
      rootMargin: '0px 0px -50% 0px',
      threshold: 0.1,
    };

    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = this.shadowRoot.querySelector(`a[href="#${id}"]`);
        if (entry.isIntersecting && link) {
          this.setActiveLink(link);
        }
      });
    }, options);

    document.querySelectorAll('[id]').forEach((section) => {
      this.sectionObserver.observe(section);
    });
  }

  watchStickyState() {
    const anchorNavigation = document.querySelector(
      '.anchor-navigation-wrapper'
    );
    if (!anchorNavigation) return;

    const sentinel = document.createElement('div');
    sentinel.style.position = 'relative';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.marginTop = '3px'; // Prevent layout jump

    anchorNavigation.parentNode.insertBefore(sentinel, anchorNavigation);

    requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const isSticky = !entry.isIntersecting;
          anchorNavigation.classList.toggle('is-sticky', isSticky);
          this.shadowRoot.host.classList.toggle('is-sticky', isSticky);
        },
        {
          root: null,
          threshold: 0,
        }
      );

      observer.observe(sentinel);
    });
  }
}

customElements.define('anchor-navigation', AnchorNavigation);
