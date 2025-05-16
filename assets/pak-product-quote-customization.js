document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle-input').forEach((toggle) => {
    toggle.addEventListener('change', function () {
      const targetId = this.dataset.toggleTarget;
      const content = document.getElementById(targetId);
      if (this.checked) {
        content.removeAttribute('hidden');
        content
          .querySelectorAll('input, select')
          .forEach((el) => (el.disabled = false));
      } else {
        content.setAttribute('hidden', true);
        content
          .querySelectorAll('input, select')
          .forEach((el) => (el.disabled = true));
      }
    });
  });
});
