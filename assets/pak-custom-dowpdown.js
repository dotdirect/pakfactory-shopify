document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const list = dropdown.querySelector('.dropdown-options');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const label = dropdown.querySelector('.dropdown-label');

    // Toggle dropdown open/close
    toggle.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent bubbling to document click
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      dropdowns.forEach((d) => {
        d.querySelector('.dropdown-options').hidden = true;
        d.querySelector('.dropdown-toggle').setAttribute(
          'aria-expanded',
          false
        );
      });
      toggle.setAttribute('aria-expanded', !expanded);
      list.hidden = expanded;
    });

    // Handle option selection
    list.querySelectorAll('.dropdown-option').forEach((option) => {
      option.addEventListener('click', (e) => {
        const value = option.getAttribute('data-value');
        hiddenInput.value = value;
        label.textContent = value;
        list.hidden = true;
        toggle.setAttribute('aria-expanded', false);
      });
    });
  });

  // Close all dropdowns when clicking outside
  document.addEventListener('click', () => {
    dropdowns.forEach((dropdown) => {
      dropdown.querySelector('.dropdown-options').hidden = true;
      dropdown
        .querySelector('.dropdown-toggle')
        .setAttribute('aria-expanded', false);
    });
  });
});
