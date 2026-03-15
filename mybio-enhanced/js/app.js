/* =============================================
   MyBio.ae - Enhanced JavaScript
   Enhancements: #9 Alpine Store, #8 HTMX, #2 SW
   ============================================= */

// ---- Enhancement #9: Alpine.js Store for shared state ----
document.addEventListener('alpine:init', () => {

  // Theme store
  Alpine.store('theme', {
    dark: localStorage.getItem('mybio-dark') === 'true' ||
          (!localStorage.getItem('mybio-dark') && window.matchMedia('(prefers-color-scheme: dark)').matches),

    init() {
      this.apply();
      // Listen for OS theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('mybio-dark')) {
          this.dark = e.matches;
          this.apply();
        }
      });
    },

    toggle() {
      this.dark = !this.dark;
      localStorage.setItem('mybio-dark', this.dark);
      this.apply();
    },

    apply() {
      document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light');
    }
  });

  // Language store
  Alpine.store('lang', {
    current: localStorage.getItem('mybio-lang') || 'ar',

    init() {
      this.apply();
    },

    toggle() {
      this.current = this.current === 'ar' ? 'en' : 'ar';
      localStorage.setItem('mybio-lang', this.current);
      this.apply();
    },

    apply() {
      const html = document.documentElement;
      html.setAttribute('lang', this.current);
      html.setAttribute('dir', this.current === 'ar' ? 'rtl' : 'ltr');
    }
  });
});

// ---- Enhancement #8: HTMX event handlers ----

// Scroll to top after HTMX content swap
document.addEventListener('htmx:afterSwap', (event) => {
  if (event.detail.target.id === 'main-content') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Re-initialize Alpine on HTMX content load
document.addEventListener('htmx:afterSettle', () => {
  // Alpine auto-initializes new elements when using defer
});

// Handle HTMX request errors gracefully
document.addEventListener('htmx:responseError', (event) => {
  console.error('HTMX request failed:', event.detail.xhr.status, event.detail.pathInfo.requestPath);
});

// ---- Enhancement #2: Service Worker Registration ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration skipped:', err.message);
    });
  });
}
