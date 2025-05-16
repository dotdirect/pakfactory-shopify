document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const list = dropdown.querySelector(".dropdown-options");
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const label = dropdown.querySelector(".dropdown-label");

    // Toggle dropdown open/close
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !expanded);
      list.hidden = expanded;
    });

    // Handle option selection
    list.querySelectorAll(".dropdown-option").forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.getAttribute("data-value");
        hiddenInput.value = value;
        label.textContent = value;
        list.hidden = true;
        toggle.setAttribute("aria-expanded", false);
      });
    });

    // Optional: close dropdown on outside click
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        list.hidden = true;
        toggle.setAttribute("aria-expanded", false);
      }
    });
  });
});
